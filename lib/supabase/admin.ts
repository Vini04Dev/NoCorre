import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { supabaseUrl } from "./config";

/**
 * Cliente com a Secret key, que ignora o RLS. Existe só para o painel de
 * administração chamar metricas_admin(), que o banco libera apenas para o
 * service_role. O import "server-only" faz o build falhar se este arquivo
 * for parar num componente do navegador.
 *
 * Retorna null quando SUPABASE_SECRET_KEY não está definida, para o painel
 * avisar em vez de quebrar.
 */
export function criarClienteAdmin() {
  const chave = process.env.SUPABASE_SECRET_KEY;
  if (!chave) return null;
  return createClient<Database>(supabaseUrl, chave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
