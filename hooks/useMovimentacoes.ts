"use client";

import { useQuery } from "@tanstack/react-query";
import { intervaloDoPeriodo, type FiltroPeriodo } from "@/lib/periodo";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import type { Tables } from "@/types/database";

export type Receita = Tables<"receitas"> & { clientes: { nome: string } | null };
export type Despesa = Tables<"despesas">;

/** Receita ou despesa numa lista só, para o extrato. */
export type Movimentacao =
  | { tipo: "receita"; dados: Receita }
  | { tipo: "despesa"; dados: Despesa };

// O cliente vem junto pela FK composta (cliente_id, usuario_id), sem segunda consulta.
const SELECT_RECEITA = "*, clientes(nome)";

async function buscarIntervalo(inicio: Date, fim: Date) {
  const supabase = criarClienteNavegador();
  const [receitas, despesas] = await Promise.all([
    supabase
      .from("receitas")
      .select(SELECT_RECEITA)
      .gte("data_hora", inicio.toISOString())
      .lt("data_hora", fim.toISOString())
      .order("data_hora", { ascending: false }),
    supabase
      .from("despesas")
      .select("*")
      .gte("data_hora", inicio.toISOString())
      .lt("data_hora", fim.toISOString())
      .order("data_hora", { ascending: false }),
  ]);
  if (receitas.error) throw new Error(traduzirErroBanco(receitas.error));
  if (despesas.error) throw new Error(traduzirErroBanco(despesas.error));
  return { receitas: receitas.data as Receita[], despesas: despesas.data };
}

/** Chaves de cache que qualquer mudança em lançamentos precisa recarregar. */
export const CHAVES_LANCAMENTOS = [["movimentacoes"], ["receitas"], ["despesas"]] as const;

/** Receitas e despesas do período escolhido, mais recentes primeiro. */
export function useMovimentacoes(periodo: FiltroPeriodo) {
  return useQuery({
    queryKey: ["movimentacoes", periodo],
    queryFn: () => {
      const { inicio, fim } = intervaloDoPeriodo(periodo);
      return buscarIntervalo(inicio, fim);
    },
  });
}

/**
 * Dados dos Relatórios: o período escolhido e o anterior de mesmo tamanho
 * (para comparar despesas), numa busca só, separados aqui.
 */
export function useRelatorio(periodo: FiltroPeriodo) {
  return useQuery({
    queryKey: ["movimentacoes", "relatorio", periodo],
    queryFn: async () => {
      const { inicio, fim } = intervaloDoPeriodo(periodo);
      const inicioAnterior = new Date(inicio.getTime() - (fim.getTime() - inicio.getTime()));
      const { receitas, despesas } = await buscarIntervalo(inicioAnterior, fim);
      const noPeriodo = (item: { data_hora: string }) => new Date(item.data_hora) >= inicio;
      return {
        inicio,
        fim,
        atual: { receitas: receitas.filter(noPeriodo), despesas: despesas.filter(noPeriodo) },
        anterior: { despesas: despesas.filter((d) => !noPeriodo(d)) },
      };
    },
  });
}

/** Todas as receitas pendentes, de qualquer data: o que ainda falta receber. */
export function usePendentes() {
  return useQuery({
    queryKey: ["receitas", "pendentes"],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("receitas")
        .select(SELECT_RECEITA)
        .eq("status_pagamento", "pendente")
        .order("data_hora", { ascending: false });
      if (error) throw new Error(traduzirErroBanco(error));
      return data as Receita[];
    },
  });
}

export function useReceita(id: string) {
  return useQuery({
    queryKey: ["receitas", "id", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("receitas")
        .select(SELECT_RECEITA)
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(traduzirErroBanco(error));
      return data as Receita | null;
    },
  });
}

export function useDespesa(id: string) {
  return useQuery({
    queryKey: ["despesas", "id", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador().from("despesas").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(traduzirErroBanco(error));
      return data;
    },
  });
}
