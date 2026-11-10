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

/** Chaves de cache que qualquer mudança em lançamentos precisa recarregar (o progresso das metas também). */
export const CHAVES_LANCAMENTOS = [["movimentacoes"], ["receitas"], ["despesas"], ["metas"]] as const;

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
 * (para as tendências e os avisos), numa busca só, separados aqui.
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
        anterior: { receitas: receitas.filter((r) => !noPeriodo(r)), despesas: despesas.filter((d) => !noPeriodo(d)) },
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

export type LinhaHistorico = Pick<Receita, "data_hora" | "valor_total" | "status_pagamento" | "quantidade" | "cliente_id">;
export type LinhaHistoricoDespesa = Pick<Despesa, "data_hora" | "valor_total">;

/**
 * Busca todas as linhas, de 1000 em 1000: a API do Supabase devolve no máximo
 * 1000 por consulta, e seis meses de corre passam disso fácil.
 */
async function buscarTudo<T>(pagina: (de: number, ate: number) => PromiseLike<{ data: T[] | null; error: Parameters<typeof traduzirErroBanco>[0] | null }>) {
  const linhas: T[] = [];
  for (let de = 0; ; de += 1000) {
    const { data, error } = await pagina(de, de + 999);
    if (error) throw new Error(traduzirErroBanco(error));
    linhas.push(...(data ?? []));
    if (!data || data.length < 1000) return linhas;
  }
}

/**
 * Últimos `meses` meses inteiros (o atual incluído), só com as colunas que os
 * gráficos de evolução usam. Não depende do período escolhido na tela.
 */
export function useHistoricoMeses(meses = 6) {
  return useQuery({
    queryKey: ["movimentacoes", "historico", meses],
    queryFn: async () => {
      const hoje = new Date();
      const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - (meses - 1), 1);
      const fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
      const supabase = criarClienteNavegador();
      const [receitas, despesas] = await Promise.all([
        buscarTudo<LinhaHistorico>((de, ate) =>
          supabase
            .from("receitas")
            .select("data_hora, valor_total, status_pagamento, quantidade, cliente_id")
            .gte("data_hora", inicio.toISOString())
            .lt("data_hora", fim.toISOString())
            .order("data_hora")
            .range(de, ate),
        ),
        buscarTudo<LinhaHistoricoDespesa>((de, ate) =>
          supabase
            .from("despesas")
            .select("data_hora, valor_total")
            .gte("data_hora", inicio.toISOString())
            .lt("data_hora", fim.toISOString())
            .order("data_hora")
            .range(de, ate),
        ),
      ]);
      return { inicio, receitas, despesas };
    },
  });
}
