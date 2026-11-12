"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import type { Tables, TablesInsert } from "@/types/database";

export type Evento = Tables<"eventos">;
export type DadosEvento = Omit<TablesInsert<"eventos">, "id" | "usuario_id" | "created_at">;

const CHAVE = ["eventos"] as const;

/**
 * Eventos que aparecem no intervalo [inicio, fim): começam antes do fim e
 * terminam depois do início, então um turno que atravessa a meia-noite aparece
 * nos dois dias. A RLS só devolve os da própria pessoa.
 */
export function useEventos(inicio: Date, fim: Date) {
  return useQuery({
    queryKey: [...CHAVE, inicio.toISOString(), fim.toISOString()],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("eventos")
        .select("*")
        .lt("data_hora_inicial", fim.toISOString())
        .gte("data_hora_final", inicio.toISOString())
        .order("data_hora_inicial");
      if (error) throw new Error(traduzirErroBanco(error));
      return data;
    },
  });
}

export function useEvento(id: string) {
  return useQuery({
    queryKey: [...CHAVE, "id", id],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador().from("eventos").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(traduzirErroBanco(error));
      return data;
    },
  });
}

/** Descrições já usadas, das mais recentes, para sugerir no formulário. */
export function useDescricoesEventos() {
  return useQuery({
    queryKey: [...CHAVE, "descricoes"],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("eventos")
        .select("descricao")
        .order("data_hora_inicial", { ascending: false })
        .limit(300);
      if (error) throw new Error(traduzirErroBanco(error));
      return data.map((linha) => linha.descricao);
    },
    staleTime: 5 * 60 * 1000,
  });
}

function useMutacaoEvento<T>(executar: (variaveis: T) => Promise<void>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: executar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAVE });
    },
  });
}

export function useSalvarEvento() {
  return useMutacaoEvento(async ({ id, dados }: { id?: string; dados: DadosEvento }) => {
    const tabela = criarClienteNavegador().from("eventos");
    const { error } = id ? await tabela.update(dados).eq("id", id) : await tabela.insert(dados);
    if (error) throw new Error(traduzirErroBanco(error));
  });
}

export function useExcluirEvento() {
  return useMutacaoEvento(async (id: string) => {
    const { error } = await criarClienteNavegador().from("eventos").delete().eq("id", id);
    if (error) throw new Error(traduzirErroBanco(error));
  });
}
