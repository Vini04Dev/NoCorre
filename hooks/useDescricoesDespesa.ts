"use client";

import { useQuery } from "@tanstack/react-query";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import { contarUsos } from "@/lib/sugestoes";

/**
 * Descrições que a pessoa já usou nas despesas, das mais usadas para as menos,
 * para sugerir enquanto ela digita. A RLS só devolve as despesas dela.
 * A chave começa com "despesas", então salvar ou excluir despesa já atualiza a lista.
 */
export function useDescricoesDespesa() {
  return useQuery({
    queryKey: ["despesas", "descricoes"],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("despesas")
        .select("observacao")
        .not("observacao", "is", null)
        .order("data_hora", { ascending: false })
        .limit(1000);
      if (error) throw new Error(traduzirErroBanco(error));
      return contarUsos(data.map((linha) => linha.observacao ?? ""));
    },
    staleTime: 5 * 60 * 1000,
  });
}
