import type { Metadata } from "next";
import { dataDaUrl } from "@/lib/data";
import { FormularioReceita } from "@/components/lancamentos/FormularioReceita";

export const metadata: Metadata = { title: "Nova receita | No Corre!" };

export default async function Pagina({ searchParams }: PageProps<"/novo/receita">) {
  const { data } = await searchParams;
  return <FormularioReceita dataInicial={dataDaUrl(data)} />;
}
