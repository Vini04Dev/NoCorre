"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CHAVES_LANCAMENTOS } from "./useMovimentacoes";
import { doCorrePadrao } from "@/lib/categorias-padrao";
import { limitesDoMes } from "@/lib/contas-fixas";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import type { PostgrestError } from "@supabase/supabase-js";
import type { Tables, TablesInsert } from "@/types/database";

export type ContaFixa = Tables<"contas_fixas">;
export type DadosContaFixa = Omit<TablesInsert<"contas_fixas">, "id" | "usuario_id" | "created_at">;

const CHAVE = ["contas-fixas"] as const;

/** Migration das contas fixas ainda não aplicada: tratar como "nenhuma conta". */
function tabelaAusente(erro: PostgrestError) {
  return erro.code === "42P01" || erro.code === "PGRST205" || erro.code === "42703" || erro.code === "PGRST204";
}

/** Contas fixas da pessoa, por dia de vencimento. */
export function useContasFixas() {
  return useQuery({
    queryKey: [...CHAVE, "lista"],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("contas_fixas")
        .select("*")
        .order("ativa", { ascending: false })
        .order("dia_vencimento")
        .order("descricao");
      if (error) {
        if (tabelaAusente(error)) return [] as ContaFixa[];
        throw new Error(traduzirErroBanco(error));
      }
      return data;
    },
  });
}

/**
 * Ids das contas fixas já pagas neste mês (há despesa ligada a elas no mês).
 * A chave começa com "movimentacoes": lançar ou excluir uma despesa recalcula.
 */
export function useContasPagasNoMes() {
  const { inicio, fim } = limitesDoMes();
  return useQuery({
    queryKey: ["movimentacoes", "contas-fixas-pagas", inicio],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("despesas")
        .select("conta_fixa_id")
        .not("conta_fixa_id", "is", null)
        .gte("data_hora", inicio)
        .lt("data_hora", fim);
      if (error) {
        if (tabelaAusente(error)) return new Set<string>();
        throw new Error(traduzirErroBanco(error));
      }
      return new Set(data.map((linha) => linha.conta_fixa_id as string));
    },
  });
}

/**
 * Quantos pagamentos cada conta já teve no app (todas as datas), para as
 * parcelas: "parcela 5 de 12". A chave começa com "movimentacoes": lançar ou
 * excluir uma despesa recalcula.
 */
export function useContagemPagamentos() {
  return useQuery({
    queryKey: ["movimentacoes", "contas-fixas-contagem"],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("despesas")
        .select("conta_fixa_id")
        .not("conta_fixa_id", "is", null);
      if (error) {
        if (tabelaAusente(error)) return new Map<string, number>();
        throw new Error(traduzirErroBanco(error));
      }
      const contagem = new Map<string, number>();
      for (const linha of data) {
        const id = linha.conta_fixa_id as string;
        contagem.set(id, (contagem.get(id) ?? 0) + 1);
      }
      return contagem;
    },
  });
}

export function useSalvarContaFixa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dados }: { id?: string; dados: DadosContaFixa }) => {
      const tabela = criarClienteNavegador().from("contas_fixas");
      const { error } = id ? await tabela.update(dados).eq("id", id) : await tabela.insert(dados);
      if (error) throw new Error(traduzirErroBanco(error));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHAVE }),
  });
}

export function useExcluirContaFixa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await criarClienteNavegador().from("contas_fixas").delete().eq("id", id);
      if (error) throw new Error(traduzirErroBanco(error));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHAVE }),
  });
}

/**
 * Débito automático: um toque confirma que caiu e lança a despesa do mês com
 * os dados da conta, na data de hoje.
 */
export function useConfirmarDebito() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conta: ContaFixa) => {
      const { error } = await criarClienteNavegador()
        .from("despesas")
        .insert({
          tipo: conta.tipo,
          observacao: conta.descricao,
          quantidade: 1,
          valor_unitario: conta.valor,
          conta_fixa_id: conta.id,
          do_corre: doCorrePadrao(conta.tipo),
          ...(conta.carteira_id ? { carteira_id: conta.carteira_id } : {}),
        });
      if (error) throw new Error(traduzirErroBanco(error));
    },
    onSuccess: () => CHAVES_LANCAMENTOS.forEach((queryKey) => queryClient.invalidateQueries({ queryKey })),
  });
}
