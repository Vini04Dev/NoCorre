import type { Metadata } from "next";
import { TelaMetas } from "@/components/metas/TelaMetas";

export const metadata: Metadata = { title: "Metas | No Corre!" };

// Lista repetida aqui: valores de um arquivo "use client" não chegam ao servidor.
const ABAS = ["ativas", "encerradas", "contas"] as const;

export default async function Pagina({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  const { aba } = await searchParams;
  const abaInicial = ABAS.find((valor) => valor === aba) ?? "ativas";
  return <TelaMetas key={abaInicial} abaInicial={abaInicial} />;
}
