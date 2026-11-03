import type { Metadata } from "next";
import { EditarLancamento } from "@/components/resumo/EditarLancamento";

export const metadata: Metadata = { title: "Editar despesa | No Corre!" };

export default async function Pagina({ params }: PageProps<"/resumo/despesa/[id]/editar">) {
  const { id } = await params;
  return <EditarLancamento tipo="despesa" id={id} />;
}
