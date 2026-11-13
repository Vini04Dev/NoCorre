"use client";

import { FormularioEntrada } from "./FormularioEntrada";
import { useEntrada } from "@/hooks/useEntradas";

/** Carrega a entrada e abre o formulário já preenchido (editar ou excluir). */
export function EditarEntrada({ id }: { id: string }) {
  const { data, isPending, error } = useEntrada(id);
  if (isPending) return <p className="p-6 text-center text-[13px] text-cinza-escuro">Carregando...</p>;
  if (error || !data) return <p className="p-6 text-center text-[13px] text-negativo">{error?.message ?? "Entrada não encontrada."}</p>;
  return <FormularioEntrada key={data.id} entrada={data} />;
}
