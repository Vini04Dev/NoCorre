"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TipoCategoria } from "@/lib/categorias-padrao";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import type { Tables } from "@/types/database";

const CHAVE = ["categorias"] as const;

export type Categoria = Tables<"categorias">;

async function buscarCategorias(): Promise<Categoria[]> {
  const { data, error } = await criarClienteNavegador()
    .from("categorias")
    .select("*")
    .order("nome");
  if (error) throw new Error(traduzirErroBanco(error));
  return data;
}

export function useCategorias() {
  return useQuery({ queryKey: CHAVE, queryFn: buscarCategorias });
}

type SalvarCategoria = { id?: string; nome: string; tipo: TipoCategoria };

async function salvarCategoria({ id, ...dados }: SalvarCategoria) {
  const supabase = criarClienteNavegador();
  const { error } = id
    ? await supabase.from("categorias").update(dados).eq("id", id)
    : await supabase.from("categorias").insert(dados);
  if (error) {
    throw new Error(
      traduzirErroBanco(error, { duplicado: "Você já tem uma categoria com esse nome." }),
    );
  }
}

async function excluirCategoria(id: string) {
  const { error } = await criarClienteNavegador().from("categorias").delete().eq("id", id);
  if (error) throw new Error(traduzirErroBanco(error));
}

export function useSalvarCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: salvarCategoria,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHAVE }),
  });
}

export function useExcluirCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: excluirCategoria,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHAVE }),
  });
}
