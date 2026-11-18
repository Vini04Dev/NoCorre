"use client";

import { Botao } from "@/components/ui/Botao";
import type { Escopo } from "@/hooks/useEventos";

type Props = {
  acao: "salvar" | "excluir";
  /** Mudou a repetição: só "Este e os próximos" faz sentido. */
  soProximos?: boolean;
  ocupado?: boolean;
  aoEscolher: (escopo: Escopo) => void;
  aoCancelar: () => void;
};

/**
 * Evento que se repete: a mudança vale só para este dia ou para ele e os
 * seguintes (os anteriores nunca mudam), como no Google Agenda.
 */
export function EscolherEscopo({ acao, soProximos = false, ocupado, aoEscolher, aoCancelar }: Props) {
  const excluir = acao === "excluir";
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-[25px] backdrop-blur-[2px]">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="escopo-titulo"
        aria-describedby="escopo-texto"
        className="flex w-full max-w-[340px] flex-col gap-2.5 rounded-[16px] bg-white px-[18px] pt-5 pb-[18px] text-center"
      >
        <h2 id="escopo-titulo" className="text-lg font-extrabold">
          {excluir ? "Excluir evento que se repete" : "Salvar evento que se repete"}
        </h2>
        <p id="escopo-texto" className="text-[13px] text-cinza-escuro">
          {soProximos
            ? "Você mudou a repetição. A mudança vale para este dia e os próximos; os anteriores ficam como estão."
            : excluir
              ? "Os dias anteriores continuam na Agenda."
              : "Os dias anteriores ficam como estão."}
        </p>
        <div className="mt-1 flex flex-col gap-2">
          {!soProximos && (
            <Botao variante={excluir ? "perigo" : "contorno"} onClick={() => aoEscolher("este")} disabled={ocupado}>
              {excluir ? "Excluir só este" : "Só este evento"}
            </Botao>
          )}
          <Botao variante={excluir ? "perigoCheio" : "primario"} onClick={() => aoEscolher("proximos")} disabled={ocupado}>
            {ocupado ? (excluir ? "Excluindo..." : "Salvando...") : excluir ? "Excluir este e os próximos" : "Este e os próximos"}
          </Botao>
          <button type="button" onClick={aoCancelar} disabled={ocupado} className="py-1 text-xs font-semibold text-cinza-escuro">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
