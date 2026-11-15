import type { Metadata } from "next";
import { PagarContaFixa } from "@/components/contas/PagarContaFixa";
import { FormularioDespesa } from "@/components/lancamentos/FormularioDespesa";

export const metadata: Metadata = { title: "Nova despesa | No Corre!" };

export default async function Pagina({ searchParams }: PageProps<"/novo/despesa">) {
  const { conta, fixa } = await searchParams;
  if (typeof fixa === "string") return <PagarContaFixa id={fixa} />;
  return <FormularioDespesa contaInicial={typeof conta === "string" ? conta : undefined} />;
}
