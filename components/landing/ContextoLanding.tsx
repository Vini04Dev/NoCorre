"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { COOKIE_IDIOMA, COOKIE_TEMA, LANG, TEXTOS, type Idioma, type Tema, type Textos } from "./idiomas";

type Valor = {
  idioma: Idioma;
  textos: Textos;
  tema: Tema;
  mudarIdioma: (idioma: Idioma) => void;
  alternarTema: () => void;
};

const Contexto = createContext<Valor | null>(null);

const UM_ANO = 60 * 60 * 24 * 365;

function gravarCookie(nome: string, valor: string) {
  document.cookie = `${nome}=${valor}; path=/; max-age=${UM_ANO}; samesite=lax`;
}

/**
 * Idioma e tema da landing. Os dois ficam em cookie para o servidor já
 * renderizar a página certa na próxima visita (sem piscar no idioma ou tema
 * errado). Trocar o idioma refaz a página no servidor; o tema troca na hora.
 *
 * Renderiza a raiz da landing: o atributo data-tema liga as cores do tema
 * (classe "landing" em app/globals.css) e lang avisa o idioma ao navegador.
 */
export function ProvedorLanding({
  idioma,
  temaInicial,
  className,
  children,
}: {
  idioma: Idioma;
  temaInicial: Tema;
  className: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [tema, setTema] = useState(temaInicial);

  const valor: Valor = {
    idioma,
    textos: TEXTOS[idioma],
    tema,
    mudarIdioma(novo) {
      gravarCookie(COOKIE_IDIOMA, novo);
      router.refresh();
    },
    alternarTema() {
      const novo = tema === "escuro" ? "claro" : "escuro";
      gravarCookie(COOKIE_TEMA, novo);
      setTema(novo);
    },
  };

  return (
    <Contexto.Provider value={valor}>
      <div data-tema={tema} lang={LANG[idioma]} className={`landing ${className}`}>
        {children}
      </div>
    </Contexto.Provider>
  );
}

export function useLanding() {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useLanding precisa estar dentro de ProvedorLanding");
  return valor;
}

/** Atalho para os textos no idioma escolhido. */
export function useTextos() {
  return useLanding().textos;
}
