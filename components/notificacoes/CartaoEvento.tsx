import Link from "next/link";
import type { Evento } from "@/hooks/useEventos";
import { corDoEvento, mesmoDia, somarDias } from "@/lib/agenda";
import { horaCurta } from "@/lib/data";

/**
 * Cartão do próximo compromisso da Agenda (ou o que está acontecendo agora),
 * no mesmo formato dos cartões de conta das notificações: um toque da cor do
 * evento no fundo, ícone na cor dele e a ação à direita.
 */
export function CartaoEvento({ evento, agora, aoAbrir }: { evento: Evento; agora: Date; aoAbrir?: () => void }) {
  const inicio = new Date(evento.data_hora_inicial);
  const fim = new Date(evento.data_hora_final);
  const acontecendo = inicio <= agora;
  const dia = mesmoDia(inicio, agora) ? "Hoje" : mesmoDia(inicio, somarDias(agora, 1)) ? "Amanhã" : "";
  const quando = acontecendo ? `Agora, até ${horaCurta(fim)}` : `${dia} às ${horaCurta(inicio)}`.trim();
  const cor = corDoEvento(evento.cor).forte;

  return (
    <Link
      href={evento.usuario_id ? `/agenda/${evento.id}` : "/agenda"}
      onClick={aoAbrir}
      aria-label={`Abrir compromisso: ${evento.descricao}, ${quando}`}
      className="flex w-full items-center gap-2.5 rounded-[12px] border py-2 pr-3 pl-2.5 text-left shadow-cartao transition-transform active:scale-[0.99]"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${cor} 13%, var(--color-white)) 0%, color-mix(in srgb, ${cor} 4%, var(--color-white)) 100%)`,
        borderColor: `color-mix(in srgb, ${cor} 22%, transparent)`,
      }}
    >
      <span
        className="grid size-8 shrink-0 place-items-center rounded-full"
        style={{ color: cor, background: `color-mix(in srgb, ${cor} 16%, transparent)` }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        </svg>
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[13px] font-bold">{evento.descricao}</span>
        <span className="truncate text-[11px] font-semibold" style={{ color: cor }}>
          {acontecendo ? "Compromisso agora" : `Próximo compromisso${dia ? ` · ${dia}` : ""}`}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-extrabold">{acontecendo ? `até ${horaCurta(fim)}` : horaCurta(inicio)}</span>
        <span className="rounded-full bg-marinho px-2.5 py-1 text-[10px] font-bold text-white">Ver</span>
      </span>
    </Link>
  );
}
