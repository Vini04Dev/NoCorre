"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Periodo } from "@/lib/periodo";

/**
 * Ordem de Dia, Semana e Mês escolhida pela pessoa, guardada no aparelho. O
 * primeiro é o que abre sozinho no Início, no Resumo, nos Relatórios e na
 * Agenda; a ordem também vale para as opções do seletor. Uma ordem só para o
 * app inteiro: quem prefere ver o mês quer ver o mês em todo lugar.
 */

const CHAVE = "nocorre:pref:ordem-periodos";
export const ORDEM_PADRAO: Periodo[] = ["semana", "dia", "mes"];
const ouvintes = new Set<() => void>();
// Mesmo array enquanto o texto guardado não muda (useSyncExternalStore compara por referência).
let cache: { texto: string | null; ordem: Periodo[] } = { texto: null, ordem: ORDEM_PADRAO };

function valida(lista: unknown): lista is Periodo[] {
  return (
    Array.isArray(lista) &&
    lista.length === ORDEM_PADRAO.length &&
    ORDEM_PADRAO.every((p) => lista.includes(p))
  );
}

function ler(): Periodo[] {
  let texto: string | null = null;
  try {
    texto = localStorage.getItem(CHAVE);
  } catch {
    return ORDEM_PADRAO;
  }
  if (texto === cache.texto) return cache.ordem;
  let ordem = ORDEM_PADRAO;
  try {
    const lida: unknown = texto ? JSON.parse(texto) : null;
    if (valida(lida)) ordem = lida;
  } catch {
    // Valor estragado: volta ao padrão.
  }
  cache = { texto, ordem };
  return ordem;
}

function inscrever(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export function useOrdemPeriodos() {
  const ordem = useSyncExternalStore(inscrever, ler, () => ORDEM_PADRAO);
  const mudar = useCallback((nova: Periodo[]) => {
    if (!valida(nova)) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(nova));
    } catch {
      // Sem armazenamento: a ordem não é lembrada.
    }
    ouvintes.forEach((ouvinte) => ouvinte());
  }, []);
  // Ainda no padrão: cada tela mantém o que já abria (Agenda no Dia, o resto na Semana).
  const escolhida = ordem !== ORDEM_PADRAO;
  return [ordem, mudar, escolhida] as const;
}
