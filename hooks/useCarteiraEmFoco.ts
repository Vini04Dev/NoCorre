"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCarteiras } from "./useCarteiras";
import { usePerfil, type Perfil } from "./usePerfil";
import { usePlano } from "./usePlano";
import { principalEntre } from "@/lib/carteiras";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";

/**
 * Carteiras que contam no Início e no Resumo (Pro, com duas ou mais). A
 * pessoa marca uma ou várias no botão de carteira, e a escolha fica no perfil
 * (`perfis.carteiras_visiveis`): sair e entrar de novo, ou abrir em outro
 * aparelho, mantém a mesma seleção. Vazia = todas.
 *
 * - `escolhidas`: as carteiras ativas que contam (todas, sem filtro).
 * - `filtro`: ids para filtrar, ou null quando contam todas.
 * - `carteira`: a única escolhida, quando é só uma. Vira o padrão da carteira
 *   nos lançamentos novos, sempre à vista no campo Carteira do formulário.
 */
export function useCarteiraEmFoco() {
  const { ehPro } = usePlano();
  const { data: carteiras = [] } = useCarteiras(ehPro);
  const { data: perfil } = usePerfil();
  const salvar = useSalvarCarteirasVisiveis();
  const ativas = carteiras.filter((c) => !c.arquivada);
  const disponivel = ehPro && ativas.length >= 2;
  // Ids de carteiras arquivadas ou excluídas que ficaram na lista não contam.
  const marcadas = disponivel ? ativas.filter((c) => perfil?.carteiras_visiveis?.includes(c.id)) : [];
  const todas = marcadas.length === 0 || marcadas.length === ativas.length;
  const escolhidas = todas ? ativas : marcadas;
  return {
    ativas,
    escolhidas,
    filtro: todas ? null : marcadas.map((c) => c.id),
    carteira: !todas && marcadas.length === 1 ? marcadas[0] : null,
    principalId: principalEntre(carteiras)?.id ?? null,
    disponivel,
    salvar,
  };
}

/** Grava a seleção no perfil; `null` (ou todas) volta para "todas as carteiras". */
function useSalvarCarteirasVisiveis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ perfilId, ids }: { perfilId: string; ids: string[] | null }) => {
      const { error } = await criarClienteNavegador().from("perfis").update({ carteiras_visiveis: ids }).eq("id", perfilId);
      if (error) throw new Error(traduzirErroBanco(error));
      return ids;
    },
    // A tela muda na hora; se o banco recusar, volta como estava.
    onMutate: async ({ ids }) => {
      await queryClient.cancelQueries({ queryKey: ["perfil"] });
      const antes = queryClient.getQueryData<Perfil | null>(["perfil"]);
      if (antes) queryClient.setQueryData<Perfil>(["perfil"], { ...antes, carteiras_visiveis: ids });
      return { antes };
    },
    onError: (_erro, _variaveis, contexto) => {
      if (contexto?.antes) queryClient.setQueryData(["perfil"], contexto.antes);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["perfil"] }),
  });
}
