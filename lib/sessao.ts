import "server-only";
import { criarClienteServidor } from "@/lib/supabase/servidor";

/** Há sessão válida nesta requisição? (getClaims valida a assinatura do token.) */
export async function estaLogado() {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.auth.getClaims();
  return Boolean(data?.claims);
}
