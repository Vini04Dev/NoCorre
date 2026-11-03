"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import type { TablesInsert } from "@/types/database";

/*
 * Nos inserts não vão `usuario_id` (o banco preenche com auth.uid()) nem
 * `valor_total` (coluna gerada: quantidade × valor_unitario).
 */
export type NovaReceita = Omit<TablesInsert<"receitas">, "usuario_id" | "valor_total">;
export type NovaDespesa = Omit<TablesInsert<"despesas">, "usuario_id" | "valor_total">;

async function inserirReceita(receita: NovaReceita) {
  const { error } = await criarClienteNavegador().from("receitas").insert(receita);
  if (error) throw new Error(traduzirErroBanco(error));
}

async function inserirDespesa(despesa: NovaDespesa) {
  const { error } = await criarClienteNavegador().from("despesas").insert(despesa);
  if (error) throw new Error(traduzirErroBanco(error));
}

export function useNovaReceita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inserirReceita,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["receitas"] }),
  });
}

export function useNovaDespesa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inserirDespesa,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["despesas"] }),
  });
}
