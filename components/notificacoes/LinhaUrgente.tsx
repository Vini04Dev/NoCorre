"use client";

import { ICONES, Icone } from "./PainelNotificacoes";
import { abrirNotificacoes, useNotificacoes, type Notificacao } from "@/hooks/useNotificacoes";
import { horaCurta } from "@/lib/data";

function plural(n: number, um: string, varios: string) {
  return `${n} ${n > 1 ? varios : um}`;
}

/** Resumo curto do que é urgente: "1 conta atrasada · compromisso às 14:00". */
function resumo(urgentes: Notificacao[]) {
  const contas = urgentes.flatMap((n) => (n.tipo === "conta" ? [n.situacao.tipo] : []));
  const atrasadas = contas.filter((t) => t === "atrasada").length;
  const hoje = contas.filter((t) => t === "vence").length;
  const debitos = contas.filter((t) => t === "debito").length;
  const evento = urgentes.find((n) => n.tipo === "evento");
  const pecas = urgentes.filter((n) => n.tipo === "moto").length;
  const partes = [
    atrasadas && plural(atrasadas, "conta atrasada", "contas atrasadas"),
    hoje && plural(hoje, "conta vence hoje", "contas vencem hoje"),
    debitos && plural(debitos, "débito para confirmar", "débitos para confirmar"),
    pecas && plural(pecas, "peça da moto passou da troca", "peças da moto passaram da troca"),
    evento &&
      (new Date(evento.evento.data_hora_inicial) <= evento.agora
        ? "compromisso agora"
        : `compromisso às ${horaCurta(new Date(evento.evento.data_hora_inicial))}`),
  ].filter(Boolean);
  return partes.join(" · ");
}

/**
 * Meio-termo do Início: o sininho guarda tudo, mas o que vence hoje, está
 * atrasado ou acontece daqui a pouco aparece aqui em uma linha, para não
 * passar batido por quem nunca toca no sino.
 */
export function LinhaUrgente() {
  const urgentes = useNotificacoes().filter((n) => n.urgente);
  if (urgentes.length === 0) return null;
  const temAtrasada = urgentes.some((n) => n.tipo === "conta" && n.situacao.tipo === "atrasada");

  return (
    <button
      type="button"
      onClick={() => abrirNotificacoes(true)}
      className="flex w-full items-center gap-2.5 rounded-[12px] border border-black/8 bg-white py-2 pr-3 pl-2.5 text-left shadow-cartao"
    >
      <span
        className={`grid size-8 shrink-0 place-items-center rounded-full ${temAtrasada ? "text-negativo" : "text-pendente"}`}
        style={{ background: `color-mix(in srgb, var(--color-${temAtrasada ? "negativo" : "pendente"}) 14%, transparent)` }}
      >
        <Icone d={ICONES.sino} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold first-letter:uppercase">{resumo(urgentes)}</span>
      <span className="shrink-0 text-xs font-bold text-dourado">Ver</span>
    </button>
  );
}
