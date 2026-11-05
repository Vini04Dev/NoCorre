import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TelaAdmin } from "@/components/admin/TelaAdmin";
import type { MetricasAdmin } from "@/lib/admin";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export const metadata: Metadata = { title: "Administração | No Corre!" };

/**
 * Painel do sistema, só para perfis com admin = true. Quem não é ADM recebe 404,
 * como se a página não existisse. A trava de verdade está no banco: a função
 * metricas_admin() recusa quem não é ADM, mesmo chamada direto pela API.
 */
export default async function Pagina() {
  const supabase = await criarClienteServidor();
  const { data: perfil } = await supabase.from("perfis").select("admin").maybeSingle();
  if (!perfil?.admin) notFound();

  const { data, error } = await supabase.rpc("metricas_admin");
  return <TelaAdmin metricas={data as MetricasAdmin | null} erro={error?.message} />;
}
