"use client";

import { SeletorChips } from "@/components/ui/SeletorChips";
import { useCarteiras } from "@/hooks/useCarteiras";
import { usePlano } from "@/hooks/usePlano";

/**
 * Escolha da carteira no lançamento. Só aparece para quem é Pro e tem duas ou
 * mais carteiras: para os outros, nada muda no formulário. Sem escolha, o
 * lançamento fica na carteira principal.
 */
export function CampoCarteira({ valor, aoMudar }: { valor: string | null; aoMudar: (id: string | null) => void }) {
  const { ehPro } = usePlano();
  const { data: carteiras = [] } = useCarteiras(ehPro);
  const ativas = carteiras.filter((c) => !c.arquivada || c.id === valor);
  if (!ehPro || ativas.length < 2) return null;

  const principal = ativas.find((c) => c.padrao);
  return (
    <SeletorChips
      rotulo="Carteira"
      opcoes={ativas.map((c) => ({ valor: c.id, rotulo: c.nome }))}
      valor={valor ?? principal?.id ?? null}
      aoMudar={(id) => aoMudar(id)}
    />
  );
}

/** Só manda carteira_id quando a pessoa escolheu: sem a migration, a coluna nem existe. */
export function campoCarteira(id: string | null | undefined) {
  return id === undefined ? {} : { carteira_id: id };
}
