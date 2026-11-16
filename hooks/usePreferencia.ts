"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Preferência de liga/desliga guardada no aparelho (localStorage), para valer
 * também depois de fechar o app. Diferente de useEstadoDaTela, que some ao
 * fechar: aqui é escolha de como a pessoa gosta de ver a tela.
 */

const PREFIXO = "nocorre:pref:";
const ouvintes = new Set<() => void>();

function inscrever(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export function usePreferencia(chave: string, inicial: boolean) {
  const valor = useSyncExternalStore(
    inscrever,
    () => {
      try {
        const texto = localStorage.getItem(PREFIXO + chave);
        return texto === null ? inicial : texto === "1";
      } catch {
        return inicial;
      }
    },
    // No servidor (e na primeira renderização) vale o padrão, para não divergir do HTML.
    () => inicial,
  );
  const mudar = useCallback(
    (novo: boolean) => {
      try {
        localStorage.setItem(PREFIXO + chave, novo ? "1" : "0");
      } catch {
        // Sem armazenamento: a escolha não é lembrada.
      }
      ouvintes.forEach((ouvinte) => ouvinte());
    },
    [chave],
  );
  return [valor, mudar] as const;
}
