"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Estado de tela que sobrevive à navegação (abrir um detalhe e voltar, trocar de
 * aba na barra inferior) e a um recarregamento. Fica no sessionStorage: some
 * quando o app é fechado, então ao abrir de novo tudo volta ao padrão.
 */

const PREFIXO = "nocorre:tela:";
const ouvintes = new Set<() => void>();
// Cache do texto lido para devolver o mesmo objeto enquanto nada muda
// (useSyncExternalStore re-renderiza em loop se o snapshot muda a cada leitura).
const cache = new Map<string, { texto: string | null; valor: unknown }>();

function ler<T>(chave: string, inicial: T): T {
  let texto: string | null = null;
  try {
    texto = sessionStorage.getItem(PREFIXO + chave);
  } catch {
    return inicial;
  }
  const guardado = cache.get(chave);
  if (guardado && guardado.texto === texto) return guardado.valor as T;
  let valor: T = inicial;
  if (texto !== null) {
    try {
      valor = JSON.parse(texto) as T;
    } catch {
      valor = inicial;
    }
  }
  cache.set(chave, { texto, valor });
  return valor;
}

function inscrever(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export function useEstadoDaTela<T>(chave: string, inicial: T) {
  const valor = useSyncExternalStore(
    inscrever,
    () => ler(chave, inicial),
    // No servidor (e na primeira renderização) vale o padrão, para não divergir do HTML.
    () => inicial,
  );

  const mudar = useCallback((novo: T) => gravarEstadoDaTela(chave, novo), [chave]);

  return [valor, mudar] as const;
}

/** Grava o estado de outra tela antes de abri-la (ex.: Início leva ao Resumo já filtrado). */
export function gravarEstadoDaTela<T>(chave: string, valor: T) {
  try {
    sessionStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
  } catch {
    // Sem armazenamento (aba anônima restrita): o filtro só não fica salvo.
  }
  ouvintes.forEach((ouvinte) => ouvinte());
}

/** Ao sair da conta: a próxima pessoa no aparelho não herda filtros (ex.: cliente). */
export function limparEstadoDasTelas() {
  try {
    Object.keys(sessionStorage)
      .filter((chave) => chave.startsWith(PREFIXO))
      .forEach((chave) => sessionStorage.removeItem(chave));
  } catch {
    // nada a limpar
  }
  cache.clear();
}
