"use client";

type Props<T extends string> = {
  rotulo: string;
  /** `cor` pinta o texto da opção quando ativa (ex.: Pago em verde). */
  opcoes: { valor: T; rotulo: string; cor?: string }[];
  valor: T;
  aoMudar: (valor: T) => void;
};

/** Escolha entre poucas opções lado a lado (ex.: Pessoa Física / Empresa). */
export function Alternador<T extends string>({ rotulo, opcoes, valor, aoMudar }: Props<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold">{rotulo}</span>
      <div role="radiogroup" aria-label={rotulo} className="flex rounded-[10px] bg-cinza-fundo p-1">
        {opcoes.map((opcao) => {
          const ativo = opcao.valor === valor;
          return (
            <button
              key={opcao.valor}
              type="button"
              role="radio"
              aria-checked={ativo}
              onClick={() => aoMudar(opcao.valor)}
              className={`flex-1 rounded-lg py-[7px] text-[13px] ${
                ativo ? `bg-white font-semibold shadow-cartao ${opcao.cor ?? ""}` : "font-medium text-cinza-escuro"
              }`}
            >
              {opcao.rotulo}
            </button>
          );
        })}
      </div>
    </div>
  );
}
