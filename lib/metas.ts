import { dataHoraParaCampos } from "./data";
import { formatarMoeda } from "./formatar";
import type { Enums, Tables } from "@/types/database";

export type Parametro = Enums<"parametro_meta">;
export type Meta = Tables<"metas">;

/** Só as colunas de lançamento que o progresso usa. */
export type ReceitaMeta = Pick<
  Tables<"receitas">,
  "data_hora" | "tipo" | "cliente_id" | "quantidade" | "valor_total" | "status_pagamento"
>;
export type DespesaMeta = Pick<Tables<"despesas">, "id" | "data_hora" | "tipo" | "valor_total" | "meta_id" | "observacao">;

export const ROTULO_PARAMETRO: Record<Parametro, string> = {
  receita: "Receita",
  quantidade: "Entregas",
  despesa: "Limite de despesa",
  conta: "Conta a pagar",
};

export type Situacao =
  | "agendada"
  | "andamento"
  | "batida"
  | "nao_batida"
  | "dentro_limite"
  | "passou_limite"
  | "quitada"
  | "atrasada"
  | "pausada";

export const ROTULO_SITUACAO: Record<Situacao, string> = {
  agendada: "Agendada",
  andamento: "Ativa",
  batida: "Batida!",
  nao_batida: "Não batida",
  dentro_limite: "Dentro do limite",
  passou_limite: "Passou do limite",
  quitada: "Quitada",
  atrasada: "Em atraso",
  pausada: "Pausada",
};

export type MetaComProgresso = Meta & {
  /** Quanto já foi feito: reais (receita, despesa, conta) ou entregas (quantidade). */
  atual: number;
  /** Receitas pendentes que contariam para a meta quando forem pagas. */
  aReceber: number;
  percentual: number;
  situacao: Situacao;
  encerrada: boolean;
  /** Pagamentos ligados (só conta a pagar), mais recentes primeiro. */
  pagamentos: DespesaMeta[];
};

/** "2026-11-03" de um timestamptz, no horário do celular. */
function diaLocal(dataHora: string | Date) {
  return dataHoraParaCampos(new Date(dataHora)).data;
}

export function hojeLocal() {
  return diaLocal(new Date());
}

function noPeriodo(meta: Meta, dataHora: string) {
  const dia = diaLocal(dataHora);
  return dia >= meta.data_inicio && dia <= meta.data_fim;
}

/**
 * Progresso de uma meta, calculado na hora a partir dos lançamentos
 * (regra de negócio 6: nunca é salvo no banco).
 */
export function calcularProgresso(
  meta: Meta,
  receitas: ReceitaMeta[],
  despesas: DespesaMeta[],
  hoje = hojeLocal(),
): MetaComProgresso {
  let atual = 0;
  let aReceber = 0;
  let pagamentos: DespesaMeta[] = [];

  const bateFiltro = (item: { tipo: string; cliente_id?: string }) =>
    (!meta.categoria || item.tipo === meta.categoria) && (!meta.cliente_id || item.cliente_id === meta.cliente_id);

  switch (meta.parametro) {
    case "receita":
      for (const receita of receitas) {
        if (!noPeriodo(meta, receita.data_hora) || !bateFiltro(receita)) continue;
        // Regra 1: só receita paga conta. Pendente aparece à parte.
        if (receita.status_pagamento === "pago") atual += receita.valor_total ?? 0;
        else aReceber += receita.valor_total ?? 0;
      }
      break;
    case "quantidade":
      for (const receita of receitas) {
        if (noPeriodo(meta, receita.data_hora) && bateFiltro(receita)) atual += receita.quantidade;
      }
      break;
    case "despesa":
      for (const despesa of despesas) {
        if (noPeriodo(meta, despesa.data_hora) && bateFiltro(despesa)) atual += despesa.valor_total ?? 0;
      }
      break;
    case "conta":
      // Conta só soma o que foi ligado a ela, de qualquer data.
      pagamentos = despesas.filter((despesa) => despesa.meta_id === meta.id);
      atual = pagamentos.reduce((soma, despesa) => soma + (despesa.valor_total ?? 0), 0);
      break;
  }

  // Soma de numeric vindo como número: arredonda para não exibir 99,99999.
  atual = Math.round(atual * 100) / 100;
  const percentual = Math.round((atual / meta.valor_alvo) * 100);
  const situacao = situacaoDaMeta(meta, atual, hoje);
  const encerrada = ["batida", "nao_batida", "dentro_limite", "quitada", "pausada"].includes(situacao)
    || (situacao === "passou_limite" && hoje > meta.data_fim);

  return { ...meta, atual, aReceber, percentual, situacao, encerrada, pagamentos };
}

function situacaoDaMeta(meta: Meta, atual: number, hoje: string): Situacao {
  if (meta.status === "inativa") return "pausada";
  const terminou = hoje > meta.data_fim;
  const comecou = hoje >= meta.data_inicio;

  switch (meta.parametro) {
    case "conta":
      // Conta continua ativa depois do vencimento: ainda há o que pagar.
      if (atual >= meta.valor_alvo) return "quitada";
      if (terminou) return "atrasada";
      return comecou ? "andamento" : "agendada";
    case "despesa":
      // Limite só se encerra no fim do período, mesmo já estourado.
      if (atual > meta.valor_alvo) return "passou_limite";
      if (terminou) return "dentro_limite";
      return comecou ? "andamento" : "agendada";
    default:
      if (atual >= meta.valor_alvo) return "batida";
      if (terminou) return "nao_batida";
      return comecou ? "andamento" : "agendada";
  }
}

/** Cor do círculo e do texto de destaque. */
export function corDaMeta(meta: MetaComProgresso) {
  switch (meta.situacao) {
    case "batida":
    case "dentro_limite":
    case "quitada":
      return { traco: "stroke-positivo", texto: "text-recebido", fundo: "bg-positivo/12" };
    case "passou_limite":
    case "atrasada":
      return { traco: "stroke-negativo", texto: "text-negativo", fundo: "bg-negativo/12" };
    case "nao_batida":
    case "pausada":
      return { traco: "stroke-cinza-escuro", texto: "text-cinza-escuro", fundo: "bg-cinza-fundo" };
    default:
      return meta.parametro === "despesa" || meta.parametro === "conta"
        ? { traco: "stroke-dourado", texto: "text-marinho", fundo: "bg-dourado-claro/40" }
        : { traco: "stroke-positivo", texto: "text-recebido", fundo: "bg-positivo/12" };
  }
}

/** "R$ 720 de R$ 1.000", "90 de 120 entregas", "Pago R$ 300 de R$ 386". */
export function textoProgresso(meta: MetaComProgresso) {
  if (meta.parametro === "quantidade") {
    return `${meta.atual.toLocaleString("pt-BR")} de ${meta.valor_alvo.toLocaleString("pt-BR")} entregas`;
  }
  const texto = `${formatarMoeda(meta.atual)} de ${formatarMoeda(meta.valor_alvo)}`;
  return meta.parametro === "conta" ? `Pago ${texto}` : texto;
}

/** "07/09 a 13/09" */
export function textoPeriodo(meta: Pick<Meta, "data_inicio" | "data_fim">, comAno = false) {
  const curta = (texto: string) => {
    const [ano, mes, dia] = texto.split("-");
    return comAno ? `${dia}/${mes}/${ano}` : `${dia}/${mes}`;
  };
  return `${curta(meta.data_inicio)} a ${curta(meta.data_fim)}`;
}

function lerDia(texto: string) {
  const [ano, mes, dia] = texto.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

function diasAte(fim: string, hoje: string) {
  return Math.round((lerDia(fim).getTime() - lerDia(hoje).getTime()) / 86_400_000) + 1;
}

/** Ritmo para quem olha a meta no meio do período: quanto falta e em quantos dias. */
export function textoRitmo(meta: MetaComProgresso, hoje = hojeLocal()) {
  const falta = Math.max(meta.valor_alvo - meta.atual, 0);
  const dias = diasAte(meta.data_fim, hoje);
  const plural = (n: number) => `${n} ${n === 1 ? "dia" : "dias"}`;
  const valor = (n: number) =>
    meta.parametro === "quantidade" ? `${n.toLocaleString("pt-BR")} ${n === 1 ? "entrega" : "entregas"}` : formatarMoeda(n);

  switch (meta.situacao) {
    case "andamento":
      if (meta.parametro === "despesa") return `Restam ${formatarMoeda(falta)} para ${plural(dias)}`;
      if (meta.parametro === "conta") return `Falta ${formatarMoeda(falta)} · vence em ${plural(dias)}`;
      return `Faltam ${valor(falta)} em ${plural(dias)}`;
    case "atrasada":
      return `Em atraso · falta ${formatarMoeda(falta)}`;
    case "agendada":
      return `Começa em ${textoPeriodo(meta).split(" a ")[0]}`;
    case "passou_limite":
      return `Passou ${formatarMoeda(meta.atual - meta.valor_alvo)} do limite`;
    default:
      return ROTULO_SITUACAO[meta.situacao];
  }
}

/** Atalhos de período do formulário. A semana vai de segunda a domingo. */
export function datasDoAtalho(atalho: "semana" | "mes", referencia = new Date()) {
  const hoje = new Date(referencia.getFullYear(), referencia.getMonth(), referencia.getDate());
  if (atalho === "semana") {
    const segunda = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - ((hoje.getDay() + 6) % 7));
    const domingo = new Date(segunda.getFullYear(), segunda.getMonth(), segunda.getDate() + 6);
    return { inicio: diaLocal(segunda), fim: diaLocal(domingo) };
  }
  return {
    inicio: diaLocal(new Date(hoje.getFullYear(), hoje.getMonth(), 1)),
    fim: diaLocal(new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)),
  };
}

/**
 * Período seguinte, para "Repetir": mês inteiro vira o mês seguinte inteiro
 * (31/10 → 30/11); qualquer outro intervalo anda o próprio tamanho.
 */
export function proximoPeriodo(meta: Pick<Meta, "data_inicio" | "data_fim">) {
  const inicio = lerDia(meta.data_inicio);
  const fim = lerDia(meta.data_fim);
  const mesInteiro =
    inicio.getDate() === 1 &&
    fim.getMonth() === inicio.getMonth() &&
    new Date(fim.getFullYear(), fim.getMonth(), fim.getDate() + 1).getDate() === 1;

  if (mesInteiro) {
    return {
      inicio: diaLocal(new Date(inicio.getFullYear(), inicio.getMonth() + 1, 1)),
      fim: diaLocal(new Date(inicio.getFullYear(), inicio.getMonth() + 2, 0)),
    };
  }
  const dias = diasAte(meta.data_fim, meta.data_inicio);
  return {
    inicio: diaLocal(new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + dias)),
    fim: diaLocal(new Date(fim.getFullYear(), fim.getMonth(), fim.getDate() + dias)),
  };
}

/** Quanto ainda cabe na conta. Ao editar uma despesa, o valor dela volta a estar disponível. */
export function emAbertoNaConta(conta: MetaComProgresso, despesaEditada?: { id: string; valor_total: number | null }) {
  const devolvido = conta.pagamentos.find((pagamento) => pagamento.id === despesaEditada?.id)?.valor_total ?? 0;
  return Math.round((conta.valor_alvo - conta.atual + devolvido) * 100) / 100;
}
