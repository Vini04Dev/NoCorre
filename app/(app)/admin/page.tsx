import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TelaAdmin } from "@/components/admin/TelaAdmin";
import type { MetricasAdmin } from "@/lib/admin";
import { ehAdmin } from "@/lib/admin-servidor";
import { criarClienteAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Administração | No Corre!" };

/**
 * Painel do sistema, só para o e-mail em ADMIN_EMAIL. Quem não é ADM recebe 404,
 * como se a página não existisse. As métricas saem com a Secret key, aqui no
 * servidor: o banco não deixa nenhum usuário comum chamar metricas_admin().
 */
export default async function Pagina() {
  if (!(await ehAdmin())) notFound();

  const supabase = criarClienteAdmin();
  if (!supabase) {
    return <TelaAdmin metricas={null} erro="defina SUPABASE_SECRET_KEY no servidor" />;
  }
  const { data, error } = await supabase.rpc("metricas_admin");
  return <TelaAdmin metricas={data as MetricasAdmin | null} erro={error?.message} />;
}
