"use client";

import { FormularioDespesa } from "@/components/lancamentos/FormularioDespesa";
import { useContasFixas } from "@/hooks/useContasFixas";

/**
 * "Pagar" de uma conta fixa: abre a despesa já preenchida com a descrição, a
 * categoria, o valor e a carteira da conta. A pessoa só confere e salva.
 */
export function PagarContaFixa({ id }: { id: string }) {
  const { data: contas, isPending } = useContasFixas();
  if (isPending) return <p className="pt-20 text-center text-[13px] text-cinza-escuro">Carregando...</p>;
  // Conta não encontrada (excluída ou endereço antigo): despesa em branco.
  return <FormularioDespesa fixa={contas?.find((conta) => conta.id === id)} />;
}
