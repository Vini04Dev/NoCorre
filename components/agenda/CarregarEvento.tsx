"use client";

import { FormularioEvento } from "./FormularioEvento";
import { useEvento } from "@/hooks/useEventos";

/** Busca o evento e abre o formulário de edição. */
export function CarregarEvento({ id }: { id: string }) {
  const { data: evento, isPending, error } = useEvento(id);
  if (isPending) return <p className="p-6 text-center text-[13px] text-cinza-escuro">Carregando...</p>;
  if (!evento) return <p className="p-6 text-center text-[13px] text-negativo">{error?.message ?? "Evento não encontrado."}</p>;
  return <FormularioEvento key={evento.id} evento={evento} />;
}
