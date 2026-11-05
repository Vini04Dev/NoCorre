import type { Metadata } from "next";
import { TelaApresentacao } from "@/components/landing/TelaApresentacao";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export const metadata: Metadata = {
  title: "No Corre! | Controle financeiro para entregadores",
  description: "Entregas, corridas, despesas e metas num app feito para entregadores de São Sebastião do Paraíso.",
};

/** Landing page. Visitante sem login que abre "/" é redirecionado para cá pelo proxy. */
export default async function Pagina() {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.auth.getClaims();
  return <TelaApresentacao logado={Boolean(data?.claims)} />;
}
