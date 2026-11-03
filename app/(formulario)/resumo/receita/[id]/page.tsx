import type { Metadata } from "next";
import { DetalheLancamento } from "@/components/resumo/DetalheLancamento";

export const metadata: Metadata = { title: "Receita | No Corre!" };

export default async function Pagina({ params }: PageProps<"/resumo/receita/[id]">) {
  const { id } = await params;
  return <DetalheLancamento tipo="receita" id={id} />;
}
