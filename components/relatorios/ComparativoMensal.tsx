"use client";

import { useState } from "react";
import { Valor } from "@/components/ui/Valor";
import { formatarMoeda } from "@/lib/formatar";
import type { Mes } from "@/lib/renda";

const ALTURA = 96;
const COR_CORRE = "#2b2d42";
const COR_OUTRAS = "#b07d12";

/**
 * Últimos 6 meses: a renda de cada mês (o corre embaixo e as outras rendas em
 * cima, na mesma coluna) ao lado das despesas. Um eixo só. Tocar num mês
 * mostra o que entrou, saiu e sobrou nele, como no Início.
 */
export function ComparativoMensal({ meses }: { meses: Mes[] }) {
  const maior = Math.max(...meses.flatMap((m) => [m.corre + m.outras, m.despesa]), 0);
  const [tocado, setTocado] = useState<number | null>(null);
  const indice = tocado ?? meses.length - 1;
  const mes = meses[indice];
  const altura = (valor: number) => (valor > 0 ? Math.max(2, Math.round((valor / maior) * ALTURA)) : 0);
  const temOutras = meses.some((m) => m.outras > 0);

  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">ÚLTIMOS 6 MESES</h2>
      <div className="flex flex-col gap-2 rounded-[12px] border border-cinza-claro bg-white px-[18px] pt-3 pb-2.5">
        {maior === 0 ? (
          <p className="py-6 text-center text-xs text-cinza-escuro">Sem lançamentos nos últimos 6 meses.</p>
        ) : (
          <>
            {mes && (
              <p aria-live="polite" className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-[11px]">
                <b className="capitalize">{mes.rotulo}</b>
                <span>
                  Entrou <Valor className="font-semibold text-recebido" texto={formatarMoeda(mes.corre + mes.outras)} />
                </span>
                <span>
                  Saiu <Valor className="font-semibold text-negativo" texto={formatarMoeda(mes.despesa)} />
                </span>
                <span>
                  Sobrou{" "}
                  <Valor className={`font-semibold ${mes.saldo < 0 ? "text-negativo" : "text-positivo"}`} texto={formatarMoeda(mes.saldo)} />
                </span>
              </p>
            )}
            <ul className="flex items-end gap-3">
              {meses.map((m, i) => {
                const ativo = i === indice;
                return (
                  <li key={`${m.rotulo}-${i}`} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setTocado(i === tocado ? null : i)}
                      aria-label={`${m.rotulo}: entrou ${formatarMoeda(m.corre + m.outras)}, saiu ${formatarMoeda(m.despesa)}`}
                      aria-pressed={ativo}
                      className={`flex w-full items-end justify-center gap-[2px] ${ativo ? "" : "opacity-60"}`}
                      style={{ height: ALTURA }}
                    >
                      {/* Renda: corre embaixo, outras rendas em cima, com 2 px de vão. */}
                      <span className="flex w-full max-w-4 flex-col justify-end gap-[2px]">
                        {m.outras > 0 && <span className="rounded-t-[4px]" style={{ height: altura(m.outras), background: COR_OUTRAS }} />}
                        <span
                          className={m.outras > 0 ? "" : "rounded-t-[4px]"}
                          style={{ height: altura(m.corre), background: COR_CORRE }}
                        />
                      </span>
                      <span className="w-full max-w-4 rounded-t-[4px] bg-negativo" style={{ height: altura(m.despesa) }} />
                    </button>
                    <span className={`text-[10px] ${ativo ? "font-semibold" : "text-cinza"}`}>{m.rotulo}</span>
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-cinza-escuro">
              <span className="flex items-center gap-1">
                <span className="size-2.5 rounded-[2px]" style={{ background: COR_CORRE }} /> Corre
              </span>
              {temOutras && (
                <span className="flex items-center gap-1">
                  <span className="size-2.5 rounded-[2px]" style={{ background: COR_OUTRAS }} /> Outras rendas
                </span>
              )}
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
