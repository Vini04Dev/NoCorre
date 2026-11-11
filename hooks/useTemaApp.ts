"use client";

import { useSyncExternalStore } from "react";
import {
  CHAVE_FUNDO_APP,
  CHAVE_TEMA_APP,
  FUNDOS_APP,
  TEMAS_APP,
  type FundoApp,
  type TemaApp,
} from "@/lib/tema-app";

const ouvintes = new Set<() => void>();

function inscrever(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

/**
 * Preferência visual guardada no aparelho e refletida no <html> como data-*.
 * O primeiro valor da lista é o padrão: com ele, nada fica guardado.
 */
function preferencia<T extends string>(chave: string, valores: readonly T[], atributo: "temaApp" | "fundoApp") {
  const padrao = valores[0];

  function ler(): T {
    try {
      const valor = localStorage.getItem(chave);
      return valores.includes(valor as T) ? (valor as T) : padrao;
    } catch {
      return padrao;
    }
  }

  function aplicar(valor: T) {
    try {
      if (valor === padrao) localStorage.removeItem(chave);
      else localStorage.setItem(chave, valor);
    } catch {
      // Sem armazenamento: vale só até fechar o app.
    }
    if (valor === padrao) delete document.documentElement.dataset[atributo];
    else document.documentElement.dataset[atributo] = valor;
    ouvintes.forEach((ouvinte) => ouvinte());
  }

  return { ler, aplicar, padrao };
}

const cor = preferencia<TemaApp>(CHAVE_TEMA_APP, TEMAS_APP.map((t) => t.valor), "temaApp");
const fundo = preferencia<FundoApp>(CHAVE_FUNDO_APP, FUNDOS_APP.map((f) => f.valor), "fundoApp");

/** O CSS de cor e fundo só vale dentro das telas logadas (.casca-app). */
export const aplicarTemaApp = cor.aplicar;
export const aplicarFundoApp = fundo.aplicar;

/** Cor de destaque escolhida neste aparelho. */
export function useTemaApp() {
  const tema = useSyncExternalStore(inscrever, cor.ler, () => cor.padrao);
  return [tema, aplicarTemaApp] as const;
}

/** Tom de fundo escolhido neste aparelho. */
export function useFundoApp() {
  const valor = useSyncExternalStore(inscrever, fundo.ler, () => fundo.padrao);
  return [valor, aplicarFundoApp] as const;
}
