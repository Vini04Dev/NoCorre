import { isAuthRetryableFetchError, type SupabaseClient } from "@supabase/supabase-js";

/**
 * getClaims com uma nova tentativa quando a falha é de rede (Supabase demorou ou
 * caiu por um instante). Sem isso, uma oscilação fazia uma pessoa logada ser
 * tratada como visitante naquela requisição: via a landing ou ia para Entrar,
 * mesmo com o cookie de login intacto. Erro de token inválido não é repetido.
 */
export async function validarClaims(supabase: { auth: Pick<SupabaseClient["auth"], "getClaims"> }) {
  for (let tentativa = 0; ; tentativa += 1) {
    const { data, error } = await supabase.auth.getClaims();
    if (!error || !isAuthRetryableFetchError(error) || tentativa >= 1) return data?.claims ?? null;
    await new Promise((pronto) => setTimeout(pronto, 150));
  }
}
