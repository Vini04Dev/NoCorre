"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useEventos } from "@/hooks/useEventos";
import { corDoEvento, mesmoDia, somarDias } from "@/lib/agenda";
import { horaCurta } from "@/lib/data";

/**
 * Lembrete no Início: o próximo compromisso da Agenda nas próximas 24 horas
 * (ou o que está acontecendo agora). Some quando não há nada perto.
 */
export function ProximoEvento() {
  // Fixo enquanto a tela está aberta, para a consulta não mudar de chave a cada renderização.
  const [agora] = useState(() => new Date());
  const ate = new Date(agora.getTime() + 24 * 3_600_000);
  const { data: eventos } = useEventos(agora, ate);
  const proximo = eventos?.find((e) => new Date(e.data_hora_final) >= agora);
  if (!proximo) return null;

  const inicio = new Date(proximo.data_hora_inicial);
  const fim = new Date(proximo.data_hora_final);
  const acontecendo = inicio <= agora;
  const quando = acontecendo
    ? `Agora, até ${horaCurta(fim)}`
    : `${mesmoDia(inicio, agora) ? "Hoje" : mesmoDia(inicio, somarDias(agora, 1)) ? "Amanhã" : ""} às ${horaCurta(inicio)}`.trim();
  const cor = corDoEvento(proximo.cor);

  return (
    <Link
      href={`/agenda/${proximo.id}`}
      className="flex items-center gap-3 rounded-[10px] border border-black/8 border-l-4 bg-white py-2.5 pr-3 pl-3 shadow-cartao"
      style={{ borderLeftColor: cor.forte }}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-dourado-claro">
        <Image src="/icones/calendario.svg" alt="" width={18} height={18} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[11px] font-semibold tracking-[0.4px] text-cinza-escuro uppercase">
          {acontecendo ? "Compromisso agora" : "Próximo compromisso"}
        </span>
        <span className="truncate text-sm font-bold">{proximo.descricao}</span>
        <span className="text-xs text-cinza-escuro">{quando}</span>
      </span>
      <span aria-hidden className="text-lg text-cinza">
        ›
      </span>
    </Link>
  );
}
