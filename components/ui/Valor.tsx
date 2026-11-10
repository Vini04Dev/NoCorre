"use client";

import { mascarar, useValoresOcultos } from "@/hooks/useValoresOcultos";

/**
 * Valor em dinheiro que obedece ao olhinho: escondido, ele vira um borrão
 * (com transição suave) de um número de mentira do mesmo tamanho.
 */
export function Valor({ texto, className = "" }: { texto: string; className?: string }) {
  const [ocultos] = useValoresOcultos();
  return (
    <span
      aria-label={ocultos ? "Valor oculto" : undefined}
      className={`inline-block transition-[filter,opacity] duration-300 ease-out ${
        ocultos ? "pointer-events-none opacity-80 blur-[6px] select-none" : ""
      } ${className}`}
    >
      {ocultos ? mascarar(texto) : texto}
    </span>
  );
}
