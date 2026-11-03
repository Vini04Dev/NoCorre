"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CHAVES_LANCAMENTOS } from "./useMovimentacoes";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import type { TablesInsert } from "@/types/database";

/*
 * Nos inserts e updates não vão `usuario_id` (o banco preenche com auth.uid())
 * nem `valor_total` (coluna gerada: quantidade × valor_unitario).
 */
export type DadosReceita = Omit<TablesInsert<"receitas">, "id" | "usuario_id" | "valor_total" | "created_at">;
export type DadosDespesa = Omit<TablesInsert<"despesas">, "id" | "usuario_id" | "valor_total" | "created_at">;

type Tabela = "receitas" | "despesas";

function verificar(error: Parameters<typeof traduzirErroBanco>[0] | null) {
  if (error) throw new Error(traduzirErroBanco(error));
}

/** Toda mudança em lançamento recarrega Home, Resumo, pendentes e detalhes. */
function useMutacaoLancamento<T>(executar: (variaveis: T) => Promise<void>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: executar,
    onSuccess: () =>
      Promise.all(CHAVES_LANCAMENTOS.map((queryKey) => queryClient.invalidateQueries({ queryKey }))),
  });
}

export function useSalvarReceita() {
  return useMutacaoLancamento(async ({ id, dados }: { id?: string; dados: DadosReceita }) => {
    const tabela = criarClienteNavegador().from("receitas");
    const { error } = id ? await tabela.update(dados).eq("id", id) : await tabela.insert(dados);
    verificar(error);
  });
}

export function useSalvarDespesa() {
  return useMutacaoLancamento(async ({ id, dados }: { id?: string; dados: DadosDespesa }) => {
    const tabela = criarClienteNavegador().from("despesas");
    const { error } = id ? await tabela.update(dados).eq("id", id) : await tabela.insert(dados);
    verificar(error);
  });
}

export function useMarcarComoPago() {
  return useMutacaoLancamento(async (id: string) => {
    const { error } = await criarClienteNavegador()
      .from("receitas")
      .update({ status_pagamento: "pago" })
      .eq("id", id);
    verificar(error);
  });
}

export function useExcluirLancamento() {
  return useMutacaoLancamento(async ({ tabela, id }: { tabela: Tabela; id: string }) => {
    const { error } = await criarClienteNavegador().from(tabela).delete().eq("id", id);
    verificar(error);
  });
}
