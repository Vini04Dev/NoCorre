import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { supabaseChave, supabaseUrl } from "./config";

/**
 * Cliente do Supabase para Server Components, Server Functions e Route Handlers.
 * Lê a sessão dos cookies da requisição, então as políticas de RLS enxergam o
 * usuário logado também no servidor.
 */
export async function criarClienteServidor() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseChave, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesParaGravar) {
        try {
          cookiesParaGravar.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components não podem gravar cookies. A renovação da sessão
          // fica a cargo do proxy (Etapa 3), então é seguro ignorar aqui.
        }
      },
    },
  });
}
