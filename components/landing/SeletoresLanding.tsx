"use client";

import { useLanding } from "./ContextoLanding";
import { IDIOMAS, NOME_IDIOMA, type Idioma } from "./idiomas";

/** Idioma (PT, EN, ES) e tema claro/escuro, na barra de cima da landing. */
export function SeletoresLanding() {
  const { idioma, mudarIdioma, tema, alternarTema, textos } = useLanding();
  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <label className="relative">
        <span className="sr-only">{textos.nav.idioma}</span>
        <select
          value={idioma}
          onChange={(evento) => mudarIdioma(evento.target.value as Idioma)}
          aria-label={textos.nav.idioma}
          className="cursor-pointer appearance-none rounded-md bg-transparent px-1.5 py-1.5 sm:px-2 text-[13px] font-semibold text-l-texto uppercase transition hover:bg-l-tinta/10"
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
