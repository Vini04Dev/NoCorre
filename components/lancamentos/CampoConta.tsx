"use client";

import { SeletorChips } from "@/components/ui/SeletorChips";
import { useContasEmAberto } from "@/hooks/useMetas";
import { formatarMoeda } from "@/lib/formatar";
import { emAbertoNaConta } from "@/lib/metas";

type Props = {
  valor: string | null;
  aoMudar: (id: string | null) => void;
  /** Despesa em edição: o valor dela volta a contar como "em aberto" na conta. */
  despesa?: { id: string; valor_total: number | null };
  erro?: string;
};

/**
 * Liga a despesa a uma conta a pagar das Metas. Só aparece quando há contas
 * com valor em aberto (ou a que já está ligada, ao editar).
 */
export function CampoConta({ valor, aoMudar, despesa, erro }: Props) {
  const { data: contas } = useContasEmAberto();
  const opcoes = contas
    .map((conta) => ({ conta, falta: emAbertoNaConta(conta, despesa) }))
    .filter(({ conta, falta }) => falta > 0 || conta.id === valor);

  if (opcoes.length === 0) return null;

  return (
    <SeletorChips
      rotulo="Pagar qual conta?"
      opcional
      desmarcavel
      opcoes={opcoes.map(({ conta, falta }) => ({
        valor: conta.id,
        rotulo: `${conta.nome} · falta ${formatarMoeda(falta)}`,
      }))}
      valor={valor}
      aoMudar={aoMudar}
      erro={erro}
    />
  );
}
