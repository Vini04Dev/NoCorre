"use client";

import { useState } from "react";
import { formatarMoeda } from "@/lib/formatar";
import type { Barra } from "@/lib/relatorio";
import { Valor } from "@/components/ui/Valor";

const ALTURA = 64;

/**
 * Receita por dia (ou por faixa de horário, num dia só). O melhor dia fica em
 * azul-marinho; tocar numa barra mostra o valor dela no título.
 */
export function GraficoBarras({ barras }: { barras: Barra[] }) {
  const maior = Math.max(...barras.map((b) => b.valor));
  const indiceMelhor = maior > 0 ? barras.findIndex((b) => b.valor === maior) : -1;
  const [tocada, setTocada] = useState<number | null>(null);
  const destaque = tocada ?? indiceMelhor;
  // Com muitas barras (mês), só alguns rótulos cabem embaixo.
  const passoRotulo = barras.length > 8 ? 5 : 1;

  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <h2 className="tracking-[0.66px] text-cinza">RECEITA POR DIA</h2>
        {destaque >= 0 && (
          <span aria-live="polite">
            {tocada === null ? "Melhor: " : ""}
            {barras[destaque].descricao} · <Valor texto={formatarMoeda(barras[destaque].valor)} />
          </span>
        )}
      </div>

      <div className="rounded-[12px] border border-cinza-claro bg-white px-[18px] pt-3 pb-2.5">
        {maior === 0 ? (
          <p className="py-6 text-center text-xs text-cinza-escuro">Nenhuma receita paga neste período.</p>
        ) : (
          <ul className="flex items-end gap-0.5">
            {barras.map((barra, indice) => {
              const ativa = indice === destaque;
              const mostrarRotulo = passoRotulo === 1 || indice === 0 || (indice + 1) % passoRotulo === 0;
              return (
                <li key={indice} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTocada(indice === tocada ? null : indice)}
                    aria-label={`${barra.descricao}: ${formatarMoeda(barra.valor)}`}
                    aria-pressed={ativa}
                    // Área de toque mais alta que a barra, para barras baixas também serem fáceis de tocar.
                    className="flex w-full justify-center"
                    style={{ height: ALTURA }}
                  >
                    <span
                      className={`mt-auto w-full max-w-7 rounded-t-[4px] ${ativa ? "bg-marinho" : "bg-dourado-claro"}`}
                      // Dia sem receita ganha 2 px para continuar visível como "zero".
                      style={{ height: Math.max(2, Math.round((barra.valor / maior) * ALTURA)) }}
                    />
                  </button>
                  <span
                    className={`h-3.5 text-[10px] leading-[14px] ${ativa ? "font-semibold" : "text-cinza"}`}
                  >
                    {mostrarRotulo ? barra.rotulo : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
