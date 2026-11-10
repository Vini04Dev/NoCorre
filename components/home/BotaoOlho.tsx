"use client";

import { useValoresOcultos } from "@/hooks/useValoresOcultos";

/** Mostra ou esconde os valores em dinheiro do app (olho aberto = valores à vista). */
export function BotaoOlho({ className = "" }: { className?: string }) {
  const [ocultos, alternar] = useValoresOcultos();
  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={ocultos}
      aria-label={ocultos ? "Mostrar valores" : "Esconder valores"}
      className={`grid size-10 place-items-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/20 ${className}`}
    >
      <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
        <circle cx="12" cy="12" r="3" />
        {ocultos && <path d="M4 4l16 16" />}
      </svg>
    </button>
  );
}
