"use client";

import { useSyncExternalStore } from "react";
import { CHAVE_TEMA_APP, TEMAS_APP, type TemaApp } from "@/lib/tema-app";

const ouvintes = new Set<() => void>();

function ler(): TemaApp {
  try {
    const valor = localStorage.getItem(CHAVE_TEMA_APP);
    return TEMAS_APP.some((t) => t.valor === valor) ? (valor as TemaApp) : "dourado";
  } catch {
    return "dourado";
  }
}

function inscrever(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

/** Aplica no <html> (o CSS do tema só vale dentro das telas logadas, em .casca-app). */
export function aplicarTemaApp(tema: TemaApp) {
  try {
    if (tema === "dourado") localStorage.removeItem(CHAVE_TEMA_APP);
    else localStorage.setItem(CHAVE_TEMA_APP, tema);
  } catch {
    // Sem armazenamento: o tema vale só até fechar o app.
  }
  if (tema === "dourado") delete document.documentElement.dataset.temaApp;
  else document.documentElement.dataset.temaApp = tema;
  ouvintes.forEach((ouvinte) => ouvinte());
}

/** Tema de cor escolhido neste aparelho. */
export function useTemaApp() {
  const tema = useSyncExternalStore(inscrever, ler, () => "dourado" as TemaApp);
  return [tema, aplicarTemaApp] as const;
}
