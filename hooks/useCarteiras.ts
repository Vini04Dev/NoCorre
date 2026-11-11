"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CHAVES_LANCAMENTOS } from "./useMovimentacoes";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import type { PostgrestError } from "@supabase/supabase-js";
import type { Tables, TablesInsert } from "@/types/database";

export type Carteira = Tables<"carteiras">;
export type DadosCarteira = Omit<TablesInsert<"carteiras">, "id" | "usuario_id" | "created_at">;
export type Transferencia = Tables<"transferencias">;

const CHAVE = ["carteiras"] as const;

/** Tabela ainda não criada (migration das carteiras não aplicada): tratar como "sem carteiras". */
function tabelaAusente(erro: PostgrestError) {
  return erro.code === "42P01" || erro.code === "PGRST205" || erro.code === "42883" || erro.code === "PGRST202";
}

/** Carteiras da pessoa, a principal primeiro. Arquivadas vêm por último. */
/** `ativo = false` não consulta (quem não é Pro não tem carteiras). */
export function useCarteiras(ativo = true) {
  return useQuery({
    enabled: ativo,
    queryKey: [...CHAVE, "lista"],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("carteiras")
        .select("*")
        .order("arquivada")
        .order("padrao", { ascending: false })
        .order("created_at");
      if (error) {
        if (tabelaAusente(error)) return [] as Carteira[];
        throw new Error(traduzirErroBanco(error));
      }
      return data;
    },
  });
}

/** Saldo de cada carteira (função saldos_carteiras no banco), por id. */
/** `ativo = false` não consulta (quem não é Pro não tem carteiras). */
export function useSaldosCarteiras(ativo = true) {
  return useQuery({
    enabled: ativo,
    // Começa com "movimentacoes": qualquer lançamento novo recalcula os saldos.
    queryKey: ["movimentacoes", "saldos-carteiras"],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador().rpc("saldos_carteiras");
      if (error) {
        if (tabelaAusente(error)) return new Map<string, number>();
        throw new Error(traduzirErroBanco(error));
      }
      return new Map(data.map((linha) => [linha.carteira_id, Number(linha.saldo)]));
    },
  });
}

/** `ativo = false` não consulta (quem não é Pro não tem carteiras). */
export function useTransferencias(ativo = true) {
  return useQuery({
    enabled: ativo,
    queryKey: [...CHAVE, "transferencias"],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("transferencias")
        .select("*")
        .order("data_hora", { ascending: false })
        .limit(15);
      if (error) {
        if (tabelaAusente(error)) return [] as Transferencia[];
        throw new Error(traduzirErroBanco(error));
      }
      return data;
    },
  });
}

function useMutacaoCarteira<T>(executar: (variaveis: T) => Promise<void>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: executar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAVE });
      CHAVES_LANCAMENTOS.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
    },
  });
}

export function useSalvarCarteira() {
  return useMutacaoCarteira(async ({ id, dados }: { id?: string; dados: DadosCarteira }) => {
    const supabase = criarClienteNavegador();
    // Só uma principal por pessoa (índice único no banco): desmarca as outras antes.
    if (dados.padrao) {
      let desmarcar = supabase.from("carteiras").update({ padrao: false }).eq("padrao", true);
      if (id) desmarcar = desmarcar.neq("id", id);
      const { error } = await desmarcar;
      if (error) throw new Error(traduzirErroBanco(error));
    }
    const tabela = supabase.from("carteiras");
    const { error } = id ? await tabela.update(dados).eq("id", id) : await tabela.insert(dados);
    if (error) throw new Error(traduzirErroBanco(error, { duplicado: "Você já tem uma carteira com esse nome." }));
  });
}

export function useExcluirCarteira() {
  return useMutacaoCarteira(async (id: string) => {
    const { error } = await criarClienteNavegador().from("carteiras").delete().eq("id", id);
    if (error) {
      throw new Error(
        traduzirErroBanco(error, {
          vinculo: "Essa carteira tem lançamentos. Arquive em vez de excluir: ela some das escolhas e o histórico fica.",
        }),
      );
    }
  });
}

export function useTransferir() {
  return useMutacaoCarteira(async (dados: Omit<TablesInsert<"transferencias">, "id" | "usuario_id" | "created_at">) => {
    const { error } = await criarClienteNavegador().from("transferencias").insert(dados);
    if (error) throw new Error(traduzirErroBanco(error));
  });
}

export function useExcluirTransferencia() {
  return useMutacaoCarteira(async (id: string) => {
    const { error } = await criarClienteNavegador().from("transferencias").delete().eq("id", id);
    if (error) throw new Error(traduzirErroBanco(error));
  });
}
