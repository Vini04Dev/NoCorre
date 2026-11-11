import type { Metadata } from "next";
import { CarregarEvento } from "@/components/agenda/CarregarEvento";

export const metadata: Metadata = { title: "Editar evento | No Corre!" };

export default async function Pagina({ params }: PageProps<"/agenda/[id]">) {
  const { id } = await params;
  return <CarregarEvento id={id} />;
}
