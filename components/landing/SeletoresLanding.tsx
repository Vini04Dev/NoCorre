"use client";

import { useLanding } from "./ContextoLanding";
import { IDIOMAS, NOME_IDIOMA, type Idioma } from "./idiomas";

/** Idioma (PT, EN, ES) e tema claro/escuro, na barra de cima da landing. */
export function SeletoresLanding() {
  const { idioma, mudarIdioma, tema, alternarTema, textos } = useLanding();
  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <label className="relative flex items-center rounded-md text-l-texto transition hover:bg-l-tinta/10">
        <span className="sr-only">{textos.nav.idioma}</span>
        {/* Ícone de idioma (A / 文), o mais reconhecido para "trocar língua". */}
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-1.5"
        >
          <path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />
        </svg>
        <select
          value={idioma}
          onChange={(evento) => mudarIdioma(evento.target.value as Idioma)}
          aria-label={textos.nav.idioma}
          className="cursor-pointer appearance-none rounded-md bg-transparent py-1.5 pr-1.5 pl-6 text-[13px] font-semibold uppercase sm:pr-2"
        >
          {IDIOMAS.map((codigo) => (
            // Só a sigla, para caber na barra do celular; o nome completo vai no title.
            <option key={codigo} value={codigo} title={NOME_IDIOMA[codigo]} className="text-marinho">
              {codigo.toUpperCase()}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={alternarTema}
        aria-label={tema === "escuro" ? textos.nav.temaClaro : textos.nav.temaEscuro}
        title={tema === "escuro" ? textos.nav.temaClaro : textos.nav.temaEscuro}
        className="grid size-8 place-items-center rounded-md text-l-texto transition hover:bg-l-tinta/10"
      >
        {tema === "escuro" ? (
          // Sol: troca para o claro.
          <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        ) : (
          // Lua: volta para o escuro.
          <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
