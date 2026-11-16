import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesenhoExportarImportar } from "@/components/exportar/DesenhoExportarImportar";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { ehAdmin } from "@/lib/admin-servidor";

export const metadata: Metadata = { title: "Desenho: exportar e importar | No Corre!" };

/**
 * Desenho do módulo de exportar e importar, ainda sem função, para discutir o
 * fluxo antes de implementar. Só para o ADM, aberto pelo Painel do sistema.
 */
export default async function PreviaExportar() {
  if (!(await ehAdmin())) notFound();
  return (
    <main className="flex flex-col gap-4 px-[17px] pt-[calc(env(safe-area-inset-top)+12px)] pb-6 lg:max-w-xl lg:px-0 lg:pt-2">
      <CabecalhoTela titulo="Exportar e importar" voltarPara="/admin" tituloGrande />
      <DesenhoExportarImportar />
    </main>
  );
}
