"use client";

import { useState } from "react";
import { formatarMoeda } from "@/lib/formatar";
import type { Mes } from "@/lib/relatorio";
import { Valor } from "@/components/ui/Valor";

const ALTURA = 96;

/**
 * Receita paga e despesas lado a lado, mês a mês (últimos 6 meses). Um eixo só;
 * a legenda e o texto do mês tocado dizem qual barra é qual, além da cor.
 */
export function ComparativoMensal({ meses }: { meses: Mes[] }) {
  const maior = Math.max(...meses.flatMap((m) => [m.receita, m.despesa]), 0);
  const [tocado, setTocado] = useState<number | null>(null);
  const mes = meses[tocado ?? meses.length - 1];

  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold">
        <h2 className="tracking-[0.66px] text-cinza">ÚLTIMOS 6 MESES</h2>
        {mes && maior > 0 && (
          <span aria-live="polite" className="truncate">
            {mes.rotulo}: <Valor className="text-recebido" texto={formatarMoeda(mes.receita)} /> ·{" "}
            <Valor className="text-negativo" texto={formatarMoeda(mes.despesa)} />
          </span>
        )}
      </div>
      <div className="rounded-[12px] border border-cinza-claro bg-white px-[18px] pt-3 pb-2.5">
        {maior === 0 ? (
          <p className="py-6 text-center text-xs text-cinza-escuro">Sem lançamentos nos últimos 6 meses.</p>
        ) : (
          <>
            <ul className="flex items-end gap-3">
              {meses.map((m, i) => {
                const ativo = i === (tocado ?? meses.length - 1);
                return (
                  <li key={`${m.rotulo}-${i}`} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setTocado(i === tocado ? null : i)}
                      aria-label={`${m.rotulo}: receita ${formatarMoeda(m.receita)}, despesas ${formatarMoeda(m.despesa)}`}
                      aria-pressed={ativo}
                      className={`flex w-full items-end justify-center gap-[2px] ${ativo ? "" : "opacity-60"}`}
                      style={{ height: ALTURA }}
                    >
                      {[
                        { valor: m.receita, cor: "bg-positivo" },
                        { valor: m.despesa, cor: "bg-negativo" },
                      ].map(({ valor, cor }) => (
                        <span
                          key={cor}
                          className={`w-full max-w-4 rounded-t-[4px] ${cor}`}
                          style={{ height: Math.max(2, Math.round((valor / maior) * ALTURA)) }}
                        />
                      ))}
                    </button>
                    <span className={`text-[10px] ${ativo ? "font-semibold" : "text-cinza"}`}>{m.rotulo}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-2 flex justify-center gap-4 text-[10px] text-cinza-escuro">
              <span className="flex items-center gap-1">
                <span className="size-2.5 rounded-[2px] bg-positivo" /> Receita paga
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2.5 rounded-[2px] bg-negativo" /> Despesas
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
