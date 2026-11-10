import "server-only";
import { cache } from "react";
import { validarClaims } from "@/lib/supabase/claims";
import { criarClienteServidor } from "@/lib/supabase/servidor";

/**
 * Claims da sessão nesta requisição. Com cache() do React, layout, página e
 * ehAdmin() compartilham uma única validação em vez de repetir getClaims
 * (que valida a assinatura do token) a cada chamada.
 */
export const obterClaims = cache(async () => {
  return validarClaims(await criarClienteServidor());
});

/** Há sessão válida nesta requisição? */
export async function estaLogado() {
  return Boolean(await obterClaims());
}
