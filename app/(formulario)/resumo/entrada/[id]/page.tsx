import type { Metadata } from "next";
import { EditarEntrada } from "@/components/lancamentos/EditarEntrada";

export const metadata: Metadata = { title: "Entrada | No Corre!" };

export default async function Pagina({ params }: PageProps<"/resumo/entrada/[id]">) {
  const { id } = await params;
  return <EditarEntrada id={id} />;
}
