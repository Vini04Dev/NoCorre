import type { Metadata } from "next";
import { FormularioEvento } from "@/components/agenda/FormularioEvento";

export const metadata: Metadata = { title: "Novo evento | No Corre!" };

/** `?data=2026-09-08` já abre o formulário no dia que estava escolhido na Agenda. */
export default async function Pagina({ searchParams }: PageProps<"/agenda/novo">) {
  const { data } = await searchParams;
  const dataInicial = typeof data === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data) ? data : undefined;
  return <FormularioEvento dataInicial={dataInicial} />;
}
