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

/** Transferências de um intervalo [inicio, fim), para o extrato de cada carteira. */
export function useTransferenciasDoPeriodo(inicio: Date, fim: Date, ativo = true) {
  return useQuery({
    enabled: ativo,
    queryKey: [...CHAVE, "transferencias", inicio.toISOString(), fim.toISOString()],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("transferencias")
        .select("*")
        .gte("data_hora", inicio.toISOString())
        .lt("data_hora", fim.toISOString())
        .order("data_hora", { ascending: false });
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

type SalvarCarteira = {
  id?: string;
  dados: DadosCarteira;
  /**
   * Quanto a pessoa diz que tem nela hoje. O app acerta o saldo inicial para o
   * saldo calculado bater com esse valor, sem mexer em nenhum lançamento.
   * Resolve, por exemplo, a principal que herdou todos os lançamentos antigos.
   */
  saldoAtual?: number;
};

export function useSalvarCarteira() {
  return useMutacaoCarteira(async ({ id, dados, saldoAtual }: SalvarCarteira) => {
    const supabase = criarClienteNavegador();
    // Só uma principal por pessoa (índice único no banco): desmarca as outras antes.
    if (dados.padrao) {
      let desmarcar = supabase.from("carteiras").update({ padrao: false }).eq("padrao", true);
      if (id) desmarcar = desmarcar.neq("id", id);
      const { error } = await desmarcar;
      if (error) throw new Error(traduzirErroBanco(error));
    }
    const tabela = supabase.from("carteiras");
    const salvo = id
      ? await tabela.update(dados).eq("id", id).select("id, saldo_inicial").single()
      : await tabela.insert(dados).select("id, saldo_inicial").single();
    if (salvo.error) {
      throw new Error(traduzirErroBanco(salvo.error, { duplicado: "Você já tem uma carteira com esse nome." }));
    }
    if (saldoAtual === undefined) return;

    // O saldo calculado depende dos lançamentos (e, na principal, dos sem
    // carteira), então só dá para acertar depois de salvar.
    const saldos = await supabase.rpc("saldos_carteiras");
    if (saldos.error) throw new Error(traduzirErroBanco(saldos.error));
    const calculado = Number(saldos.data.find((linha) => linha.carteira_id === salvo.data.id)?.saldo ?? 0);
    const diferenca = Math.round((saldoAtual - calculado) * 100) / 100;
    if (diferenca === 0) return;
    const { error } = await supabase
      .from("carteiras")
      .update({ saldo_inicial: Math.round((Number(salvo.data.saldo_inicial) + diferenca) * 100) / 100 })
      .eq("id", salvo.data.id);
    if (error) throw new Error(traduzirErroBanco(error));
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
