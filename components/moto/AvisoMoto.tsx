"use client";

import Image from "next/image";
import Link from "next/link";
import { useComponentes, useQuilometragem } from "@/hooks/useMoto";
import { usePlano } from "@/hooks/usePlano";
import { COR_SITUACAO, desgaste, formatarKm } from "@/lib/moto";

/**
 * Aviso no Início (Pro): a manutenção mais urgente quando passa de 90% do
 * intervalo. Não aparece com tudo em dia, para não virar barulho.
 */
export function AvisoMoto() {
  const { ehPro } = usePlano();
  const { data: km } = useQuilometragem(ehPro);
  const { data: componentes } = useComponentes(ehPro);
  if (!ehPro || km?.atual == null || !componentes?.length) return null;

  const urgentes = componentes
    .filter((c) => c.ativo)
    .map((c) => ({ c, ...desgaste(km.atual!, c.km_ultima_troca, c.intervalo_km) }))
    .filter((i) => i.situacao === "trocar" || i.situacao === "vencido")
    .sort((a, b) => b.fracao - a.fracao);
  if (urgentes.length === 0) return null;

  const [primeiro] = urgentes;
  const detalhe =
    primeiro.faltam >= 0 ? `Faltam ${formatarKm(primeiro.faltam)}` : `Passou ${formatarKm(-primeiro.faltam)} da troca`;

  return (
    <Link
      href="/moto"
      className="flex items-center gap-3 rounded-[10px] border border-black/8 border-l-4 bg-white py-2.5 pr-3 pl-3 shadow-cartao"
      style={{ borderLeftColor: COR_SITUACAO[primeiro.situacao] }}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-dourado-claro">
        <Image src="/icones/moto-linha.svg" alt="" width={18} height={18} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[11px] font-semibold tracking-[0.4px] text-cinza-escuro uppercase">Saúde da moto</span>
        <span className="truncate text-sm font-bold">{primeiro.c.nome}</span>
        <span className="text-xs text-cinza-escuro">
          {detalhe}
          {urgentes.length > 1 ? ` · mais ${urgentes.length - 1} ${urgentes.length > 2 ? "itens" : "item"}` : ""}
        </span>
      </span>
      <span aria-hidden className="text-lg text-cinza">
        ›
      </span>
    </Link>
  );
}
