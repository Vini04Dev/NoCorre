"use client";

import { useState } from "react";
import { formatarMoeda } from "@/lib/formatar";
import { DIAS_MAPA, FAIXAS_HORARIO } from "@/lib/relatorio";

/** Degraus de dourado, do mais claro ao mais forte (escala de uma cor só). */
const DEGRAUS = ["#f3f4f6", "#fff1cc", "#ffe08f", "#ffd36a", "#e0a92e", "#b07d12"];

function degrau(valor: number, maior: number) {
  if (valor <= 0 || maior <= 0) return DEGRAUS[0];
  return DEGRAUS[Math.min(DEGRAUS.length - 1, 1 + Math.floor((valor / maior) * (DEGRAUS.length - 1.01)))];
}

/**
 * Mapa do corre: receita paga por dia da semana e faixa de horário, em tons de
 * dourado. Quanto mais forte, mais rendeu. Tocar numa célula mostra o valor.
 */
export function MapaDoCorre({ celulas }: { celulas: number[][] }) {
  const maior = Math.max(...celulas.flat());
  const [tocada, setTocada] = useState<[number, number] | null>(null);
  let melhor: [number, number] | null = null;
  celulas.forEach((linha, d) => linha.forEach((v, f) => {
    if (v > 0 && (!melhor || v > celulas[melhor[0]][melhor[1]])) melhor = [d, f];
  }));
  const destaque: [number, number] | null = tocada ?? melhor;
  const descrever = ([d, f]: [number, number]) =>
    `${DIAS_MAPA[d]}, ${FAIXAS_HORARIO[f]} às ${(f + 1) * 3}h · ${formatarMoeda(celulas[d][f])}`;

  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold">
        <h2 className="tracking-[0.66px] text-cinza">MAPA DO CORRE</h2>
        {destaque && maior > 0 && (
          <span aria-live="polite" className="truncate">
            {tocada ? "" : "Melhor: "}
            {descrever(destaque)}
          </span>
        )}
      </div>
      <div className="rounded-[12px] border border-cinza-claro bg-white p-3">
        {maior === 0 ? (
          <p className="py-6 text-center text-xs text-cinza-escuro">Nenhuma receita paga neste período.</p>
        ) : (
          <>
            <div className="grid grid-cols-[28px_repeat(8,minmax(0,1fr))] gap-[3px]">
              <span />
              {FAIXAS_HORARIO.map((faixa) => (
                <span key={faixa} className="text-center text-[9px] text-cinza-escuro">
                  {faixa}
                </span>
              ))}
              {celulas.map((linha, d) => (
                <div key={DIAS_MAPA[d]} className="contents">
                  <span className="self-center text-[10px] text-cinza-escuro">{DIAS_MAPA[d]}</span>
                  {linha.map((valor, f) => {
                    const ativa = destaque?.[0] === d && destaque?.[1] === f;
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setTocada(ativa && tocada ? null : [d, f])}
                        aria-label={descrever([d, f])}
                        aria-pressed={ativa}
                        className={`h-6 rounded-[4px] ${ativa ? "ring-2 ring-marinho" : ""}`}
                        style={{ background: degrau(valor, maior) }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="mt-2.5 flex items-center justify-end gap-1 text-[10px] text-cinza-escuro">
              Menos
              {DEGRAUS.map((cor) => (
                <span key={cor} className="size-2.5 rounded-[2px]" style={{ background: cor }} />
              ))}
              Mais
            </div>
          </>
        )}
      </div>
    </section>
  );
}
