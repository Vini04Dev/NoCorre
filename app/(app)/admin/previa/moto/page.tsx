import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfigurarMoto } from "@/components/moto/ConfigurarMoto";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { ehAdmin } from "@/lib/admin-servidor";

export const metadata: Metadata = { title: "Prévia: primeira visita da moto | No Corre!" };

/**
 * Prévia da primeira visita à Saúde da moto (odômetro e estado das peças), que
 * só aparece uma vez para cada pessoa. Aberta pelo Painel do sistema, sem
 * salvar nada. Só para o ADM.
 */
export default async function PreviaMoto() {
  if (!(await ehAdmin())) notFound();
  return (
    <main className="flex flex-col gap-4 px-[17px] pt-[calc(env(safe-area-inset-top)+12px)] pb-6 lg:max-w-3xl lg:px-0 lg:pt-2">
      <CabecalhoTela titulo="Saúde da moto" voltarPara="/admin" tituloGrande />
      <p className="rounded-[10px] bg-cinza-fundo px-3 py-2 text-xs text-cinza-escuro">
        Prévia da primeira visita (Pro). Pode mexer à vontade: nada é salvo.{" "}
        <Link href="/admin" className="font-bold text-dourado">
          Voltar ao Painel
        </Link>
      </p>
      <ConfigurarMoto previa />
    </main>
  );
}
