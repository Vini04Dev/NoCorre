"use client";

import { FormularioEntrada } from "./FormularioEntrada";
import { useReceita } from "@/hooks/useMovimentacoes";

/**
 * Corrige uma receita que não era do corre (ex.: salário do emprego CLT
 * lançado como entrega): abre a outra entrada já preenchida e, ao salvar, a
 * receita sai. O valor continua na mesma carteira; só deixa de contar como
 * receita do corre, entrega e cliente.
 */
export function MoverParaEntrada({ receitaId }: { receitaId: string }) {
  const { data, isPending, error } = useReceita(receitaId);
  if (isPending) return <p className="p-6 text-center text-[13px] text-cinza-escuro">Carregando...</p>;
  if (error || !data) return <p className="p-6 text-center text-[13px] text-negativo">{error?.message ?? "Receita não encontrada."}</p>;
  return <FormularioEntrada key={data.id} origem={data} />;
}
