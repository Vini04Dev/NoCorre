"use client";

import { usePerfil } from "./usePerfil";

/**
 * Plano da conta ("gratis" ou "pro"). Antes de a migration do plano ser
 * aplicada a coluna não existe e todo mundo é tratado como grátis.
 * A trava de verdade é do banco (RLS com eh_pro()); isto só decide o que mostrar.
 */
export function usePlano() {
  const { data: perfil, isPending } = usePerfil();
  const plano = perfil?.plano ?? "gratis";
  return { plano, ehPro: plano === "pro", carregando: isPending };
}
