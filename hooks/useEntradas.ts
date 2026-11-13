"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CHAVES_LANCAMENTOS, type Entrada } from "./useMovimentacoes";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import type { TablesInsert } from "@/types/database";

export type DadosEntrada = Omit<TablesInsert<"entradas">, "id" | "usuario_id" | "created_at">;

export function useEntrada(id: string) {
  return useQuery({
    queryKey: ["movimentacoes", "entrada", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador().from("entradas").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(traduzirErroBanco(error));
      return data as Entrada | null;
    },
  });
}

/** Mexer numa entrada recarrega o extrato, o Início e o saldo das carteiras (chaves "movimentacoes"). */
function useMutacaoEntrada<T>(executar: (variaveis: T) => Promise<void>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: executar,
    onSuccess: () => CHAVES_LANCAMENTOS.forEach((queryKey) => queryClient.invalidateQueries({ queryKey })),
  });
}

export function useSalvarEntrada() {
  return useMutacaoEntrada(async ({ id, dados }: { id?: string; dados: DadosEntrada }) => {
    const tabela = criarClienteNavegador().from("entradas");
    const { error } = id ? await tabela.update(dados).eq("id", id) : await tabela.insert(dados);
    if (error) throw new Error(traduzirErroBanco(error));
  });
}

export function useExcluirEntrada() {
  return useMutacaoEntrada(async (id: string) => {
    const { error } = await criarClienteNavegador().from("entradas").delete().eq("id", id);
    if (error) throw new Error(traduzirErroBanco(error));
  });
}
