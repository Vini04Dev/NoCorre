"use client";

type Props = {
  rotulo: string;
  opcional?: boolean;
  opcoes: { valor: string; rotulo: string }[];
  valor: string | null;
  aoMudar: (valor: string | null) => void;
  /** Permite desmarcar tocando de novo na opção escolhida (campos opcionais). */
  desmarcavel?: boolean;
  erro?: string;
  /** Chip extra no fim da lista, como o "+ Outra". */
  extra?: React.ReactNode;
};

const CLASSE_CHIP = "rounded-full px-[13px] py-1.5 text-xs";
export const CLASSE_CHIP_INATIVO = `${CLASSE_CHIP} border border-cinza-claro bg-white font-medium`;
const CLASSE_CHIP_ATIVO = `${CLASSE_CHIP} border border-marinho bg-marinho font-semibold text-white`;

/** Escolha única em formato de "pílulas", como Categoria e Forma de pagamento. */
export function SeletorChips({ rotulo, opcional, opcoes, valor, aoMudar, desmarcavel, erro, extra }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex gap-1">
        <span className="text-xs font-semibold">{rotulo}</span>
        {opcional && <span className="text-[11px] text-cinza-escuro">(opcional)</span>}
      </span>
      <div role="radiogroup" aria-label={rotulo} className="flex flex-wrap gap-[7px]">
        {opcoes.map((opcao) => {
          const ativo = opcao.valor === valor;
          return (
            <button
              key={opcao.valor}
              type="button"
              role="radio"
              aria-checked={ativo}
              onClick={() => aoMudar(ativo && desmarcavel ? null : opcao.valor)}
              className={ativo ? CLASSE_CHIP_ATIVO : CLASSE_CHIP_INATIVO}
            >
              {opcao.rotulo}
            </button>
          );
        })}
        {extra}
      </div>
      {erro && <span className="text-[11px] text-negativo">{erro}</span>}
    </div>
  );
}
