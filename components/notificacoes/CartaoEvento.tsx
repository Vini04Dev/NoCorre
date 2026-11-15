import { CartaoAviso } from "./CartaoAviso";
import type { Evento } from "@/hooks/useEventos";
import { corDoEvento, mesmoDia, somarDias } from "@/lib/agenda";
import { horaCurta } from "@/lib/data";

const CALENDARIO = "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z";

/** Próximo compromisso da Agenda (ou o que está acontecendo agora), na cor do evento. */
export function CartaoEvento({ evento, agora, aoAbrir }: { evento: Evento; agora: Date; aoAbrir?: () => void }) {
  const inicio = new Date(evento.data_hora_inicial);
  const fim = new Date(evento.data_hora_final);
  const acontecendo = inicio <= agora;
  const dia = mesmoDia(inicio, agora) ? "Hoje" : mesmoDia(inicio, somarDias(agora, 1)) ? "Amanhã" : "";
  const valor = acontecendo ? `até ${horaCurta(fim)}` : horaCurta(inicio);

  return (
    <CartaoAviso
      href={evento.usuario_id ? `/agenda/${evento.id}` : "/agenda"}
      cor={corDoEvento(evento.cor).forte}
      icone={CALENDARIO}
      titulo={evento.descricao}
      situacao={acontecendo ? "Compromisso agora" : `Próximo compromisso${dia ? ` · ${dia}` : ""}`}
      valor={valor}
      rotulo={`Abrir compromisso: ${evento.descricao}, ${dia ? `${dia.toLowerCase()} ` : ""}${valor}`}
      aoAbrir={aoAbrir}
    />
  );
}
