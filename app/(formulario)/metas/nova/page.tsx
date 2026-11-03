import type { Metadata } from "next";
import { CarregarMeta } from "@/components/metas/CarregarMeta";
import { FormularioMeta } from "@/components/metas/FormularioMeta";

export const metadata: Metadata = { title: "Nova meta | No Corre!" };

export default async function Pagina({ searchParams }: PageProps<"/metas/nova">) {
  const { repetir } = await searchParams;
  return typeof repetir === "string" ? <CarregarMeta modo="repetir" id={repetir} /> : <FormularioMeta />;
}
