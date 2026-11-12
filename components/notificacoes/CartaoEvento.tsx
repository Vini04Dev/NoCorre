import Image from "next/image";
import Link from "next/link";
import type { Evento } from "@/hooks/useEventos";
import { corDoEvento, mesmoDia, somarDias } from "@/lib/agenda";
import { horaCurta } from "@/lib/data";

/**
 * Cartão do próximo compromisso da Agenda (ou o que está acontecendo agora).
 * Mora nas notificações; quem escolhe o evento é o useNotificacoes.
 */
export function CartaoEvento({ evento, agora, aoAbrir }: { evento: Evento; agora: Date; aoAbrir?: () => void }) {
  const inicio = new Date(evento.data_hora_inicial);
  const fim = new Date(evento.data_hora_final);
  const acontecendo = inicio <= agora;
  const quando = acontecendo
    ? `Agora, até ${horaCurta(fim)}`
    : `${mesmoDia(inicio, agora) ? "Hoje" : mesmoDia(inicio, somarDias(agora, 1)) ? "Amanhã" : ""} às ${horaCurta(inicio)}`.trim();
  const cor = corDoEvento(evento.cor);

  return (
    <Link
      href={evento.usuario_id ? `/agenda/${evento.id}` : "/agenda"}
      onClick={aoAbrir}
      className="flex items-center gap-2.5 rounded-[12px] border border-black/8 border-l-4 bg-white py-2 pr-3 pl-2.5 shadow-cartao"
      style={{ borderLeftColor: cor.forte }}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-dourado-claro">
        <Image src="/icones/calendario.svg" alt="" width={16} height={16} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[13px] font-bold">{evento.descricao}</span>
        <span className="text-[11px] text-cinza-escuro">
          {acontecendo ? "Compromisso agora" : "Próximo compromisso"} · {quando}
        </span>
      </span>
      <span aria-hidden className="text-lg text-cinza">
        ›
      </span>
    </Link>
  );
}
