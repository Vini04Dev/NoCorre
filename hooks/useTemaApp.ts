"use client";

import { useSyncExternalStore } from "react";
import { CHAVE_TEMA_APP, TEMAS_APP, type TemaApp } from "@/lib/tema-app";

const PADRAO = TEMAS_APP[0].valor;
const ouvintes = new Set<() => void>();

function ler(): TemaApp {
  try {
    const valor = localStorage.getItem(CHAVE_TEMA_APP);
    return TEMAS_APP.some((t) => t.valor === valor) ? (valor as TemaApp) : PADRAO;
  } catch {
    return PADRAO;
  }
}

function inscrever(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

/**
 * Guarda o tema no aparelho e o põe no <html> (data-tema-app e, nos escuros,
 * data-tema-escuro). O CSS só muda as telas logadas (.casca-app).
 */
export function aplicarTemaApp(tema: TemaApp) {
  try {
    if (tema === PADRAO) localStorage.removeItem(CHAVE_TEMA_APP);
    else localStorage.setItem(CHAVE_TEMA_APP, tema);
  } catch {
    // Sem armazenamento: o tema vale só até fechar o app.
  }
  const raiz = document.documentElement.dataset;
  if (tema === PADRAO) delete raiz.temaApp;
  else raiz.temaApp = tema;
  if (TEMAS_APP.find((t) => t.valor === tema)?.escuro) raiz.temaEscuro = "";
  else delete raiz.temaEscuro;
  ouvintes.forEach((ouvinte) => ouvinte());
}

/** Tema escolhido neste aparelho. */
export function useTemaApp() {
  const tema = useSyncExternalStore(inscrever, ler, () => PADRAO);
  return [tema, aplicarTemaApp] as const;
}
