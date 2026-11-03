import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { supabaseChave, supabaseUrl } from "./config";

/** Cliente do Supabase para componentes que rodam no navegador ("use client"). */
export function criarClienteNavegador() {
  return createBrowserClient<Database>(supabaseUrl, supabaseChave);
}
