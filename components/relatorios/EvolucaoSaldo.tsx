"use client";

import { useState } from "react";
import { formatarMoeda } from "@/lib/formatar";
import type { Mes } from "@/lib/relatorio";
import { Valor } from "@/components/ui/Valor";

const LARGURA = 300;
const ALTURA = 110;
const MARGEM = 10;

/**
 * Saldo acumulado mês a mês: quanto sobrou somando os meses anteriores.
 * Linha de 2 px, pontos tocáveis e a linha do zero quando o saldo fica negativo.
 */
export function EvolucaoSaldo({ meses }: { meses: Mes[] }) {
  const [tocado, setTocado] = useState<number | null>(null);
  const valores = meses.map((m) => m.acumulado);
  const max = Math.max(...valores, 0);
  const min = Math.min(...valores, 0);
  const faixa = max - min || 1;
  const x = (i: number) => MARGEM + (i * (LARGURA - 2 * MARGEM)) / Math.max(meses.length - 1, 1);
  const y = (v: number) => MARGEM + ((max - v) * (ALTURA - 2 * MARGEM)) / faixa;
  const indice = tocado ?? meses.length - 1;
  const atual = meses[indice];
  const caminho = meses.map((m, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(m.acumulado).toFixed(1)}`).join(" ");

  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold">
        <h2 className="tracking-[0.66px] text-cinza">SALDO ACUMULADO</h2>
        {atual && (
          <span aria-live="polite" className={atual.acumulado < 0 ? "text-negativo" : ""}>
            até {atual.rotulo}: <Valor texto={formatarMoeda(atual.acumulado)} />
          </span>
        )}
      </div>
      <div className="rounded-[12px] border border-cinza-claro bg-white px-3 pt-3 pb-2">
        <svg viewBox={`0 0 ${LARGURA} ${ALTURA}`} className="h-auto w-full" role="img" aria-label="Saldo acumulado por mês">
          {min < 0 && (
            <line x1={MARGEM} x2={LARGURA - MARGEM} y1={y(0)} y2={y(0)} stroke="#dfe1e6" strokeDasharray="4 4" />
          )}
          <path d={caminho} fill="none" stroke="#2b2d42" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {meses.map((m, i) => (
            <g key={`${m.rotulo}-${i}`}>
              <circle
                cx={x(i)}
                cy={y(m.acumulado)}
                r={i === indice ? 5 : 4}
                fill={m.acumulado < 0 ? "#cc0000" : i === indice ? "#e0a92e" : "#2b2d42"}
                stroke="#fff"
                strokeWidth={2}
              />
              {/* Área de toque maior que o ponto. */}
              <rect
                x={x(i) - 18}
                y={0}
                width={36}
                height={ALTURA}
                fill="transparent"
                className="cursor-pointer"
                onClick={() => setTocado(i === tocado ? null : i)}
              >
                <title>{`${m.rotulo}: ${formatarMoeda(m.acumulado)}`}</title>
              </rect>
            </g>
          ))}
        </svg>
        <div className="flex justify-between px-1 text-[10px] text-cinza">
          {meses.map((m, i) => (
            <span key={`${m.rotulo}-${i}`} className={i === indice ? "font-semibold text-marinho" : ""}>
              {m.rotulo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
