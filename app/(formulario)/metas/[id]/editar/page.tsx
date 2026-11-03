import type { Metadata } from "next";
import { CarregarMeta } from "@/components/metas/CarregarMeta";

export const metadata: Metadata = { title: "Editar meta | No Corre!" };

export default async function Pagina({ params }: PageProps<"/metas/[id]/editar">) {
  const { id } = await params;
  return <CarregarMeta modo="editar" id={id} />;
}
