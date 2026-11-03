"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CHAVES_LANCAMENTOS } from "./useMovimentacoes";
import { calcularProgresso, hojeLocal, type DespesaMeta, type MetaComProgresso, type ReceitaMeta } from "@/lib/metas";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import type { TablesInsert } from "@/types/database";

const CHAVE = ["metas"] as const;

export type DadosMeta = Omit<TablesInsert<"metas">, "id" | "usuario_id" | "created_at">;

/** "2026-11-30" → início do dia seguinte, para o filtro "menor que". */
function inicioDoDiaSeguinte(dia: string) {
  const [ano, mes, d] = dia.split("-").map(Number);
  return new Date(ano, mes - 1, d + 1).toISOString();
}

function inicioDoDia(dia: string) {
  const [ano, mes, d] = dia.split("-").map(Number);
  return new Date(ano, mes - 1, d).toISOString();
}

/**
 * Metas com o progresso já calculado. Busca uma vez só os lançamentos do
 * intervalo que cobre todas as metas, mais os pagamentos ligados às contas.
 */
async function buscarMetas(): Promise<MetaComProgresso[]> {
  const supabase = criarClienteNavegador();
  const { data: metas, error } = await supabase.from("metas").select("*").order("data_fim");
  if (error) throw new Error(traduzirErroBanco(error));
  if (metas.length === 0) return [];

  const porPeriodo = metas.filter((meta) => meta.parametro !== "conta");
  const contas = metas.filter((meta) => meta.parametro === "conta").map((meta) => meta.id);
  const inicio = inicioDoDia(porPeriodo.reduce((menor, meta) => (meta.data_inicio < menor ? meta.data_inicio : menor), "9999-12-31"));
  const fim = inicioDoDiaSeguinte(porPeriodo.reduce((maior, meta) => (meta.data_fim > maior ? meta.data_fim : maior), "0000-01-01"));
  const precisa = (parametros: string[]) => porPeriodo.some((meta) => parametros.includes(meta.parametro));

  const [receitas, despesas, pagamentos] = await Promise.all([
    precisa(["receita", "quantidade"])
      ? supabase
          .from("receitas")
          .select("data_hora, tipo, cliente_id, quantidade, valor_total, status_pagamento")
          .gte("data_hora", inicio)
          .lt("data_hora", fim)
      : { data: [], error: null },
    precisa(["despesa"])
      ? supabase
          .from("despesas")
          .select("id, data_hora, tipo, valor_total, meta_id, observacao")
          .gte("data_hora", inicio)
          .lt("data_hora", fim)
      : { data: [], error: null },
    contas.length
      ? supabase
          .from("despesas")
          .select("id, data_hora, tipo, valor_total, meta_id, observacao")
          .in("meta_id", contas)
          .order("data_hora", { ascending: false })
      : { data: [], error: null },
  ]);
  for (const resposta of [receitas, despesas, pagamentos]) {
    if (resposta.error) throw new Error(traduzirErroBanco(resposta.error));
  }

  const hoje = hojeLocal();
  const listaDespesas = [...(despesas.data ?? []), ...(pagamentos.data ?? [])] as DespesaMeta[];
  return metas.map((meta) => calcularProgresso(meta, (receitas.data ?? []) as ReceitaMeta[], listaDespesas, hoje));
}

export function useMetas() {
  return useQuery({ queryKey: CHAVE, queryFn: buscarMetas });
}

/** Uma meta da lista (a lista já vem do cache quando se navega a partir dela). */
export function useMeta(id: string) {
  const consulta = useMetas();
  return { ...consulta, data: consulta.data?.find((meta) => meta.id === id) ?? null };
}

/** Contas que ainda aceitam pagamento, para o campo "Pagar qual conta?" da despesa. */
export function useContasEmAberto() {
  const consulta = useMetas();
  return {
    ...consulta,
    data: consulta.data?.filter((meta) => meta.parametro === "conta" && meta.status === "ativa") ?? [],
  };
}

function useMutacaoMeta<T>(executar: (variaveis: T) => Promise<void>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: executar,
    // Inclui ["metas"]. Excluir uma conta solta as despesas ligadas: o Resumo também recarrega.
    onSuccess: () =>
      Promise.all(CHAVES_LANCAMENTOS.map((queryKey) => queryClient.invalidateQueries({ queryKey }))),
  });
}

export function useSalvarMeta() {
  return useMutacaoMeta(async ({ id, dados }: { id?: string; dados: DadosMeta }) => {
    const tabela = criarClienteNavegador().from("metas");
    const { error } = id ? await tabela.update(dados).eq("id", id) : await tabela.insert(dados);
    if (error) throw new Error(traduzirErroBanco(error));
  });
}

export function useExcluirMeta() {
  return useMutacaoMeta(async (id: string) => {
    const { error } = await criarClienteNavegador().from("metas").delete().eq("id", id);
    if (error) throw new Error(traduzirErroBanco(error));
  });
}
