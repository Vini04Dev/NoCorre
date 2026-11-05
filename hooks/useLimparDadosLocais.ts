"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { limparEstadoDasTelas } from "./useEstadoDaTela";

/**
 * Esquece o que esta aba guardou da conta: cache das consultas e filtros das telas.
 * Roda ao entrar ou criar conta: login e logout são server actions e o QueryClient
 * continua vivo na aba, então quem entrasse depois de outra pessoa veria por alguns
 * instantes os dados da conta anterior (as chaves não levam o id da pessoa).
 * Não roda ao sair para a tela de Perfil não piscar "Carregando" antes do redirect.
 */
export function useLimparDadosLocais() {
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.clear();
    limparEstadoDasTelas();
  }, [queryClient]);
}
