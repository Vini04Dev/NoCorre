"use client";

import { useQuery } from "@tanstack/react-query";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import { contarUsos, normalizar } from "@/lib/sugestoes";

export type DescricoesDespesa = {
  /** Descrições já usadas, das mais usadas para as menos. */
  descricoes: string[];
  /** Categoria da vez mais recente em que cada descrição foi usada (chave normalizada). */
  categorias: Map<string, string>;
};

/**
 * Descrições que a pessoa já usou nas despesas, para sugerir enquanto ela digita,
 * e a categoria que acompanhou cada uma, para já marcar ao escolher a sugestão.
 * A RLS só devolve as despesas dela. A chave começa com "despesas", então salvar
 * ou excluir despesa já atualiza a lista.
 */
export function useDescricoesDespesa() {
  return useQuery({
    queryKey: ["despesas", "descricoes"],
    queryFn: async (): Promise<DescricoesDespesa> => {
      const { data, error } = await criarClienteNavegador()
        .from("despesas")
        .select("observacao, tipo")
        .not("observacao", "is", null)
        .order("data_hora", { ascending: false })
        .limit(1000);
      if (error) throw new Error(traduzirErroBanco(error));

      const categorias = new Map<string, string>();
      // Mais recentes primeiro: a primeira vez que a descrição aparece é a última usada.
      for (const { observacao, tipo } of data) {
        const chave = normalizar(observacao ?? "");
        if (chave && !categorias.has(chave)) categorias.set(chave, tipo);
      }
      return { descricoes: contarUsos(data.map((linha) => linha.observacao ?? "")), categorias };
    },
    staleTime: 5 * 60 * 1000,
  });
}
