import type { Metadata } from "next";
import { FormularioDespesa } from "@/components/lancamentos/FormularioDespesa";

export const metadata: Metadata = { title: "Nova despesa | No Corre!" };

export default async function Pagina({ searchParams }: PageProps<"/novo/despesa">) {
  const { conta } = await searchParams;
  return <FormularioDespesa contaInicial={typeof conta === "string" ? conta : undefined} />;
}
