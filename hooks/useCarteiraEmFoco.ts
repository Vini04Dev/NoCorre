"use client";

import { useCarteiras } from "./useCarteiras";
import { useEstadoDaTela } from "./useEstadoDaTela";
import { usePlano } from "./usePlano";
import { principalEntre } from "@/lib/carteiras";

/** Chave no sessionStorage: some quando o app é fechado, e o Início volta para "Todas". */
export const CHAVE_CARTEIRA_EM_FOCO = "home:carteira";

/**
 * Carteira escolhida no Início (Pro, com duas ou mais carteiras). Muda o que o
 * Início mostra e vira o padrão da carteira nos lançamentos novos, sempre à
 * vista no campo Carteira do formulário (nunca um modo escondido).
 */
export function useCarteiraEmFoco() {
  const { ehPro } = usePlano();
  const { data: carteiras = [] } = useCarteiras(ehPro);
  const [id, escolher] = useEstadoDaTela<string | null>(CHAVE_CARTEIRA_EM_FOCO, null);
  const ativas = carteiras.filter((c) => !c.arquivada);
  const disponivel = ehPro && ativas.length >= 2;
  const carteira = disponivel ? (ativas.find((c) => c.id === id) ?? null) : null;
  return { carteira, ativas, principalId: principalEntre(carteiras)?.id ?? null, disponivel, escolher };
}
