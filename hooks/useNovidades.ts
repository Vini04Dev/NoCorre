"use client";

import { useSyncExternalStore } from "react";
import { VERSAO_ATUAL } from "@/lib/novidades";

/**
 * A pessoa já viu a nota da versão atual neste aparelho? Fica no localStorage:
 * a cada versão nova (nota nova em lib/novidades.ts) o aviso volta a abrir,
 * mesmo que a sessão continue aberta desde antes da atualização.
 */
const CHAVE = "nocorre:novidades-vistas";
const ouvintes = new Set<() => void>();

function ler() {
  try {
    return localStorage.getItem(CHAVE) !== VERSAO_ATUAL;
  } catch {
    return false;
  }
}

function inscrever(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export function useNovidadesPendentes() {
  // No servidor nada é pendente: o aviso só aparece depois de hidratar.
  const pendentes = useSyncExternalStore(inscrever, ler, () => false);

  function marcarComoVistas() {
    try {
      localStorage.setItem(CHAVE, VERSAO_ATUAL);
    } catch {
      // Sem armazenamento, o aviso só volta na próxima vez.
    }
    ouvintes.forEach((ouvinte) => ouvinte());
  }

  return [pendentes, marcarComoVistas] as const;
}
