"use client";

import { useState, useSyncExternalStore } from "react";
import { useAvisoForcado } from "./useAvisoForcado";
import { useContasFixas, useContasPagasNoMes, type ContaFixa } from "./useContasFixas";
import { useEventos, type Evento } from "./useEventos";
import { useMetas } from "./useMetas";
import { useComponentes, useQuilometragem } from "./useMoto";
import { usePendentes } from "./useMovimentacoes";
import { usePlano } from "./usePlano";
import { pedeAtencao, situacaoDaConta, type SituacaoConta } from "@/lib/contas-fixas";
import { hojeLocal, type MetaComProgresso } from "@/lib/metas";
import { desgaste, type Situacao } from "@/lib/moto";

/** Entrega pendente há mais que isso vira notificação ("ainda não te pagaram"). */
export const DIAS_PENDENTE = 7;

/**
 * O que pede ação agora, de cada módulo. Nada fica guardado no banco: tudo é
 * calculado do que já existe, e a notificação some sozinha quando o motivo
 * some (paga a conta, recebe a entrega, passa o compromisso).
 * `urgente` = vence hoje, está atrasado ou acontece daqui a pouco: só isso
 * aparece também na linha do Início; o resto fica só no sininho.
 */
export type Notificacao =
  | { tipo: "conta"; id: string; urgente: boolean; conta: ContaFixa; situacao: SituacaoConta }
  | { tipo: "evento"; id: string; urgente: boolean; evento: Evento; agora: Date }
  | { tipo: "pendentes"; id: string; urgente: false; quantidade: number; valor: number }
  | { tipo: "meta"; id: string; urgente: false; meta: MetaComProgresso; texto: string }
  /** Peça da moto (Pro) perto da troca ou passada; urgente quando já passou. */
  | { tipo: "moto"; id: string; urgente: boolean; nome: string; situacao: Situacao; faltam: number };

const HORA = 3_600_000;

/** Exemplo da prévia do Painel do sistema (?aviso=vencimento). */
function exemplo(agora: Date): Notificacao[] {
  const conta = (id: string, descricao: string, valor: number, dia: number, automatico: boolean): ContaFixa => ({
    id,
    usuario_id: "",
    descricao,
    tipo: "Contas",
    valor,
    dia_vencimento: dia,
    carteira_id: null,
    automatico,
    ativa: true,
    created_at: "",
  });
  const inicio = new Date(agora.getTime() + HORA);
  return [
    { tipo: "conta", id: "ex-1", urgente: true, conta: conta("ex-1", "Internet", 99.9, 10, false), situacao: { tipo: "atrasada", dias: -2 } },
    {
      tipo: "evento",
      id: "ex-evento",
      urgente: true,
      agora,
      evento: {
        id: "ex-evento",
        usuario_id: "",
        created_at: "",
        descricao: "Turno na pizzaria",
        cor: "azul",
        data_hora_inicial: inicio.toISOString(),
        data_hora_final: new Date(inicio.getTime() + 5 * HORA).toISOString(),
      },
    },
    { tipo: "conta", id: "ex-2", urgente: false, conta: conta("ex-2", "Plano de celular", 49.9, 20, false), situacao: { tipo: "vence", dias: 2 } },
    { tipo: "moto", id: "ex-moto", urgente: true, nome: "Óleo do motor", situacao: "vencido", faltam: -120 },
    { tipo: "pendentes", id: "ex-pendentes", urgente: false, quantidade: 3, valor: 114 },
  ];
}

/** "2026-11-13" do dia seguinte ao de hoje, no horário do celular. */
function amanhaLocal() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function textoDaMeta(meta: MetaComProgresso): string | null {
  if (meta.encerrada) return null;
  if (meta.situacao === "passou_limite") return "Passou do limite de gasto";
  if ((meta.parametro === "receita" || meta.parametro === "quantidade") && meta.situacao === "andamento") {
    const quando = meta.data_fim === hojeLocal() ? "hoje" : meta.data_fim === amanhaLocal() ? "amanhã" : null;
    if (quando) return `Termina ${quando}, está em ${meta.percentual}%`;
  }
  return null;
}

export function useNotificacoes() {
  // Arredondado ao minuto: o sininho e a linha do Início usam a mesma consulta de eventos.
  const [agora] = useState(() => new Date(Math.floor(Date.now() / 60_000) * 60_000));
  const contas = useContasFixas();
  const pagas = useContasPagasNoMes();
  const eventos = useEventos(agora, new Date(agora.getTime() + 24 * HORA));
  const pendentes = usePendentes();
  const metas = useMetas();
  const { ehPro } = usePlano();
  const km = useQuilometragem(ehPro);
  const componentes = useComponentes(ehPro);
  const [forcado] = useAvisoForcado("vencimento");

  if (forcado) return exemplo(agora);

  const lista: Notificacao[] = [];

  for (const conta of contas.data ?? []) {
    if (!conta.ativa || !pagas.data) continue;
    const situacao = situacaoDaConta(conta, pagas.data.has(conta.id));
    if (!pedeAtencao(situacao)) continue;
    const urgente = situacao.tipo === "atrasada" || situacao.tipo === "debito" || (situacao.tipo === "vence" && situacao.dias === 0);
    lista.push({ tipo: "conta", id: `conta-${conta.id}`, urgente, conta, situacao });
  }

  // Só o próximo compromisso (ou o que está acontecendo), como era no Início.
  const proximo = eventos.data?.find((e) => new Date(e.data_hora_final) >= agora);
  if (proximo) {
    const urgente = new Date(proximo.data_hora_inicial).getTime() - agora.getTime() <= 2 * HORA;
    lista.push({ tipo: "evento", id: `evento-${proximo.id}`, urgente, evento: proximo, agora });
  }

  const limite = agora.getTime() - DIAS_PENDENTE * 24 * HORA;
  const antigas = (pendentes.data ?? []).filter((r) => new Date(r.data_hora).getTime() < limite);
  if (antigas.length) {
    lista.push({
      tipo: "pendentes",
      id: "pendentes",
      urgente: false,
      quantidade: antigas.length,
      valor: antigas.reduce((soma, r) => soma + (r.valor_total ?? 0), 0),
    });
  }

  for (const meta of metas.data ?? []) {
    const texto = textoDaMeta(meta);
    if (texto) lista.push({ tipo: "meta", id: `meta-${meta.id}`, urgente: false, meta, texto });
  }

  // Saúde da moto (Pro): a partir de 90% do intervalo ("trocar logo"); passou da troca é urgente.
  const kmAtual = km.data?.atual;
  if (ehPro && kmAtual != null) {
    for (const c of componentes.data ?? []) {
      if (!c.ativo) continue;
      const { situacao, faltam } = desgaste(kmAtual, c.km_ultima_troca, c.intervalo_km);
      if (situacao !== "trocar" && situacao !== "vencido") continue;
      lista.push({ tipo: "moto", id: `moto-${c.id}`, urgente: situacao === "vencido", nome: c.nome, situacao, faltam });
    }
  }

  // Urgentes primeiro; dentro de cada grupo, a ordem dos módulos.
  return [...lista.filter((n) => n.urgente), ...lista.filter((n) => !n.urgente)];
}

/* Painel aberto ou fechado, compartilhado entre o sininho (no cabeçalho) e a linha do Início. */
let aberto = false;
const ouvintes = new Set<() => void>();

export function abrirNotificacoes(valor: boolean) {
  aberto = valor;
  ouvintes.forEach((avisar) => avisar());
}

export function useNotificacoesAbertas() {
  return useSyncExternalStore(
    (avisar) => {
      ouvintes.add(avisar);
      return () => ouvintes.delete(avisar);
    },
    () => aberto,
    () => false,
  );
}
