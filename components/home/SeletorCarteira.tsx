"use client";

import { useId } from "react";
import type { Carteira } from "@/hooks/useCarteiras";

/**
 * Escolha da carteira ao lado do período no Início. Mesmo visual do seletor de
 * período (select nativo: acessível e familiar no celular).
 */
export function SeletorCarteira({
  ativas,
  valor,
  aoMudar,
}: {
  ativas: Carteira[];
  valor: string | null;
  aoMudar: (id: string | null) => void;
}) {
  const id = useId();
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className="sr-only">
        Carteira
      </label>
      <select
        id={id}
        value={valor ?? ""}
        onChange={(e) => aoMudar(e.target.value || null)}
        className="h-[38px] w-full appearance-none truncate rounded-[10px] bg-cinza-fundo bg-[url('/icones/seta-baixo.svg')] bg-[right_14px_center] bg-no-repeat pr-9 pl-[14px] font-inter text-[13px] font-semibold text-texto-segmento shadow-segmento outline-none focus:ring-1 focus:ring-dourado"
      >
        <option value="">Todas as carteiras</option>
        {ativas.map((carteira) => (
          <option key={carteira.id} value={carteira.id}>
            {carteira.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
