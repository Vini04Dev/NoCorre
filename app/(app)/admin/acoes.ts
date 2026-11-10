"use server";

import type { MetricasUsuario } from "@/lib/admin";
import { ehAdmin } from "@/lib/admin-servidor";
import { criarClienteAdmin } from "@/lib/supabase/admin";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Registros de uma pessoa, para o detalhe no painel do sistema. Server action:
 * qualquer um pode chamar pela rede, então confere de novo se é o ADM antes de
 * usar a Secret key (a página esconder o botão não basta).
 */
export async function buscarDetalheUsuario(id: string): Promise<{ dados?: MetricasUsuario; erro?: string }> {
  if (!(await ehAdmin())) return { erro: "Acesso restrito à administração." };
  if (!UUID.test(id)) return { erro: "Usuário inválido." };
  const supabase = criarClienteAdmin();
  if (!supabase) return { erro: "Defina SUPABASE_SECRET_KEY no servidor." };
  const { data, error } = await supabase.rpc("metricas_usuario_admin", { p_usuario: id });
  if (error) return { erro: error.message };
  return { dados: data as MetricasUsuario };
}
