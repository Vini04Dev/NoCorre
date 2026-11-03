import type { Metadata } from "next";
import { TelaResumo } from "@/components/resumo/TelaResumo";

export const metadata: Metadata = { title: "Resumo | No Corre!" };

export default async function Pagina({ searchParams }: PageProps<"/resumo">) {
  // ?dia=2026-11-03 vem do calendário da Home e abre o extrato só daquele dia.
  const { dia } = await searchParams;
  const diaValido = typeof dia === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dia) ? dia : undefined;
  return <TelaResumo key={diaValido} dia={diaValido} />;
}
