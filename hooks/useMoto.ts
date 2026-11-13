"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import { COMPONENTES_PADRAO } from "@/lib/moto";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import type { Tables } from "@/types/database";

export type Componente = Tables<"moto_componentes">;

const CHAVE = ["moto"] as const;

/** Tabela ainda não criada (migration não aplicada): tratar como vazio. */
function tabelaAusente(erro: PostgrestError) {
  return erro.code === "42P01" || erro.code === "PGRST205";
}

/** Quilometragem atual (leitura mais recente do odômetro) e a anterior, para o histórico. */
export function useQuilometragem(ativo = true) {
  return useQuery({
    enabled: ativo,
    queryKey: [...CHAVE, "km"],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("moto_quilometragem")
        .select("*")
        .order("registrado_em", { ascending: false })
        .limit(60);
      if (error) {
        if (tabelaAusente(error)) return { atual: null, leituras: [] };
        throw new Error(traduzirErroBanco(error));
      }
      return { atual: data[0]?.km ?? null, leituras: data };
    },
  });
}

/** Itens de manutenção da pessoa, na ordem dos padrões. */
export function useComponentes(ativo = true) {
  return useQuery({
    enabled: ativo,
    queryKey: [...CHAVE, "componentes"],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador().from("moto_componentes").select("*");
      if (error) {
        if (tabelaAusente(error)) return [] as Componente[];
        throw new Error(traduzirErroBanco(error));
      }
      const ordem = (tipo: string) => {
        const i = COMPONENTES_PADRAO.findIndex((c) => c.tipo === tipo);
        return i === -1 ? 99 : i;
      };
      return data.sort((a, b) => ordem(a.tipo) - ordem(b.tipo));
    },
  });
}

function useMutacaoMoto<T>(executar: (variaveis: T) => Promise<void>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: executar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAVE });
    },
  });
}

/** Grava uma leitura do odômetro. */
export function useRegistrarKm() {
  return useMutacaoMoto(async (km: number) => {
    const { error } = await criarClienteNavegador().from("moto_quilometragem").insert({ km });
    if (error) throw new Error(traduzirErroBanco(error));
  });
}

/**
 * Primeira configuração: odômetro atual e os itens padrão, todos contando a
 * partir de agora (a pessoa corrige a última troca de cada um se souber).
 */
export function useConfigurarMoto() {
  return useMutacaoMoto(async (km: number) => {
    const supabase = criarClienteNavegador();
    const leitura = await supabase.from("moto_quilometragem").insert({ km });
    if (leitura.error) throw new Error(traduzirErroBanco(leitura.error));
    const itens = COMPONENTES_PADRAO.map(({ tipo, nome, intervalo_km }) => ({
      tipo,
      nome,
      intervalo_km,
      km_ultima_troca: km,
    }));
    const { error } = await supabase.from("moto_componentes").upsert(itens, { onConflict: "usuario_id,tipo" });
    if (error) throw new Error(traduzirErroBanco(error));
  });
}

export function useSalvarComponente() {
  return useMutacaoMoto(
    async ({ id, dados }: { id: string; dados: Partial<Pick<Componente, "intervalo_km" | "km_ultima_troca" | "ativo">> }) => {
      const { error } = await criarClienteNavegador().from("moto_componentes").update(dados).eq("id", id);
      if (error) throw new Error(traduzirErroBanco(error));
    },
  );
}
