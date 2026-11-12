"use server";

import type { MetricasUsuario } from "@/lib/admin";
import { ehAdmin } from "@/lib/admin-servidor";
import { obterClaims } from "@/lib/sessao";
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
  const [metricas, perfil] = await Promise.all([
    supabase.rpc("metricas_usuario_admin", { p_usuario: id }),
    supabase.from("perfis").select("plano").eq("id", id).maybeSingle(),
  ]);
  if (metricas.error) return { erro: metricas.error.message };
  // Sem a migration do plano, a coluna não existe: o detalhe sai sem o plano.
  const plano = perfil.error ? undefined : perfil.data?.plano;
  return { dados: { ...(metricas.data as MetricasUsuario), plano } };
}

/**
 * Alterna o plano da própria conta do ADM (Pro ↔ Grátis), para testar o app
 * dos dois jeitos. O id vem da sessão validada no servidor, nunca do navegador.
 */
export async function alternarMeuPlano(): Promise<{ plano?: "gratis" | "pro"; erro?: string }> {
  if (!(await ehAdmin())) return { erro: "Acesso restrito à administração." };
  const id = (await obterClaims())?.sub;
  if (typeof id !== "string" || !UUID.test(id)) return { erro: "Sessão inválida." };
  const supabase = criarClienteAdmin();
  if (!supabase) return { erro: "Defina SUPABASE_SECRET_KEY no servidor." };
  const { data, error } = await supabase.from("perfis").select("plano").eq("id", id).maybeSingle();
  if (error || !data) return { erro: error?.message ?? "Perfil não encontrado." };
  const plano = data.plano === "pro" ? "gratis" : "pro";
  const resposta = await supabase.from("perfis").update({ plano }).eq("id", id);
  return resposta.error ? { erro: resposta.error.message } : { plano };
}

/**
 * Liga ou desliga o Pro de uma pessoa. Só o servidor muda o plano: a pessoa
 * não tem permissão de update nessa coluna (migration 20261111100000).
 */
export async function definirPlano(id: string, plano: "gratis" | "pro"): Promise<{ erro?: string }> {
  if (!(await ehAdmin())) return { erro: "Acesso restrito à administração." };
  if (!UUID.test(id) || (plano !== "gratis" && plano !== "pro")) return { erro: "Dados inválidos." };
  const supabase = criarClienteAdmin();
  if (!supabase) return { erro: "Defina SUPABASE_SECRET_KEY no servidor." };
  const { error } = await supabase.from("perfis").update({ plano }).eq("id", id);
  return error ? { erro: error.message } : {};
}
