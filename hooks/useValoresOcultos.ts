"use client";

import { useSyncExternalStore } from "react";

/**
 * "Olhinho" do saldo: esconde os valores em dinheiro (Início, Resumo, Perfil).
 * Fica no localStorage, então vale até a pessoa abrir o olho de novo, mesmo
 * fechando o app. Quem usa o celular na frente dos outros não precisa repetir.
 */
const CHAVE = "nocorre:valores-ocultos";
const ouvintes = new Set<() => void>();

function ler() {
  try {
    return localStorage.getItem(CHAVE) === "1";
  } catch {
    return false;
  }
}

function inscrever(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export function useValoresOcultos() {
  // No servidor os valores aparecem; o navegador corrige logo na hidratação.
  const ocultos = useSyncExternalStore(inscrever, ler, () => false);

  function alternar() {
    try {
      localStorage.setItem(CHAVE, ocultos ? "0" : "1");
    } catch {
      // Sem armazenamento: o olhinho só não fica lembrado.
    }
    ouvintes.forEach((ouvinte) => ouvinte());
  }

  return [ocultos, alternar] as const;
}

/** Texto no lugar de um valor escondido. */
export const VALOR_OCULTO = "R$ •••••";
