"use client";

export type Periodo = "dia" | "semana" | "mes";

const opcoes: { valor: Periodo; rotulo: string }[] = [
  { valor: "dia", rotulo: "Dia" },
  { valor: "semana", rotulo: "Semana" },
  { valor: "mes", rotulo: "Mês" },
];

type Props = {
  valor: Periodo;
  aoMudar: (periodo: Periodo) => void;
};

/** Filtro Dia / Semana / Mês usado na Home, no Resumo e nos Relatórios. */
export function SeletorPeriodo({ valor, aoMudar }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Período"
      className="grid h-[38px] grid-cols-3 rounded-[10px] bg-cinza-fundo p-1 shadow-segmento"
    >
      {opcoes.map((opcao) => {
        const ativo = opcao.valor === valor;
        return (
          <button
            key={opcao.valor}
            type="button"
            role="radio"
            aria-checked={ativo}
            onClick={() => aoMudar(opcao.valor)}
            className={`rounded-[10px] font-inter text-[13px] font-semibold text-texto-segmento ${
              ativo ? "bg-white shadow-segmento-ativo" : ""
            }`}
          >
            {opcao.rotulo}
          </button>
        );
      })}
    </div>
  );
}
