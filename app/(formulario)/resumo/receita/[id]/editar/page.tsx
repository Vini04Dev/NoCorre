import type { Metadata } from "next";
import { EditarLancamento } from "@/components/resumo/EditarLancamento";

export const metadata: Metadata = { title: "Editar receita | No Corre!" };

export default async function Pagina({ params }: PageProps<"/resumo/receita/[id]/editar">) {
  const { id } = await params;
  return <EditarLancamento tipo="receita" id={id} />;
}
