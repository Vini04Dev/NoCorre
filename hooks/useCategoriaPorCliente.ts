"use client";

import { useQuery } from "@tanstack/react-query";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";

/**
 * Categoria da receita mais recente de cada cliente (id do cliente → categoria),
 * para a Nova receita já marcar a categoria de costume ao escolher o cliente.
 * Mesma ideia da descrição da despesa. A chave começa com "receitas", então
 * salvar ou excluir receita já atualiza.
 */
export function useCategoriaPorCliente() {
  return useQuery({
    queryKey: ["receitas", "categoria-por-cliente"],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("receitas")
        .select("cliente_id, tipo")
        .order("data_hora", { ascending: false })
        .limit(1000);
      if (error) throw new Error(traduzirErroBanco(error));
      const mapa = new Map<string, string>();
      // Mais recentes primeiro: a primeira de cada cliente é a última usada.
      for (const { cliente_id, tipo } of data) if (!mapa.has(cliente_id)) mapa.set(cliente_id, tipo);
      return mapa;
    },
    staleTime: 5 * 60 * 1000,
  });
}
