"use client";

import { useId } from "react";
import { formatarMoeda } from "@/lib/formatar";

/** Até R$ 99.999.999,99, dentro do numeric(10,2) do banco. */
const MAXIMO_DIGITOS = 10;

type Props = {
  rotulo: string;
  /** Valor em centavos, para não acumular erro de ponto flutuante. */
  centavos: number;
  aoMudar: (centavos: number) => void;
  erro?: string;
};

/**
 * Campo de dinheiro que preenche da direita para a esquerda, como maquininha de
 * cartão: digitar 5, 0, 0 mostra R$ 5,00. Evita vírgula e ponto no teclado.
 */
export function CampoMoeda({ rotulo, centavos, aoMudar, erro }: Props) {
  const id = useId();

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
      <label htmlFor={id} className="text-xs font-semibold">
        {rotulo}
      </label>
      <input
        id={id}
        inputMode="numeric"
        value={formatarMoeda(centavos / 100)}
        onChange={(evento) => {
          const digitos = evento.target.value.replace(/\D/g, "").slice(-MAXIMO_DIGITOS);
          aoMudar(Number(digitos || 0));
        }}
        aria-invalid={erro ? true : undefined}
        className={`rounded-[10px] border bg-white px-[14px] py-[11px] text-[13px] outline-none focus:border-dourado ${
          erro ? "border-negativo" : "border-cinza-claro"
        }`}
      />
      {erro && <span className="text-[11px] text-negativo">{erro}</span>}
    </div>
  );
}
