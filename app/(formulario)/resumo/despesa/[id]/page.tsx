import type { Metadata } from "next";
import { DetalheLancamento } from "@/components/resumo/DetalheLancamento";

export const metadata: Metadata = { title: "Despesa | No Corre!" };

export default async function Pagina({ params }: PageProps<"/resumo/despesa/[id]">) {
  const { id } = await params;
  return <DetalheLancamento tipo="despesa" id={id} />;
}
