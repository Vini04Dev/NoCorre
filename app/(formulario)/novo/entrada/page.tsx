import type { Metadata } from "next";
import { FormularioEntrada } from "@/components/lancamentos/FormularioEntrada";
import { MoverParaEntrada } from "@/components/lancamentos/MoverParaEntrada";

export const metadata: Metadata = { title: "Outra entrada | No Corre!" };

export default async function Pagina({ searchParams }: PageProps<"/novo/entrada">) {
  // ?de=<receita>: transforma uma receita lançada como entrega em outra entrada.
  const { de } = await searchParams;
  if (typeof de === "string") return <MoverParaEntrada receitaId={de} />;
  return <FormularioEntrada />;
}
