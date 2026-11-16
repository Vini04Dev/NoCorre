import Image from "next/image";

type Props = {
  rotulo: string;
  valor: React.ReactNode;
  icone: string;
  /** Classe de cor do valor, ex.: "text-positivo". */
  corValor: string;
  /** Com ação, a linha vira botão (ex.: abrir o Resumo filtrado). */
  aoTocar?: () => void;
  /** Linha com sublinhas: mostra a seta que recolhe ou abre o detalhe. */
  recuo?: { aberto: boolean; aoAlternar: () => void };
};

const CLASSE =
  "flex h-[43px] w-full items-center justify-between rounded-[10px] border border-black/8 bg-white pr-3 pl-2.5 shadow-cartao";

/** Linha chave-valor da Home: rótulo à esquerda, ícone e valor à direita. */
export function LinhaValor({ rotulo, valor, icone, corValor, aoTocar, recuo }: Props) {
  const conteudo = (
    <>
      <span className="text-base font-extrabold uppercase">{rotulo}:</span>
      <span className="flex items-center gap-2.5">
        <Image src={icone} alt="" width={24} height={24} />
        <span className={`min-w-[96px] text-right text-xl font-extrabold ${corValor}`}>{valor}</span>
      </span>
    </>
  );

  // Seta e linha são dois botões lado a lado (um botão não pode ficar dentro do outro).
  if (recuo) {
    return (
      <div className={`${CLASSE} !pl-0`}>
        <button
          type="button"
          onClick={recuo.aoAlternar}
          aria-expanded={recuo.aberto}
          aria-label={`${recuo.aberto ? "Recolher" : "Mostrar"} o detalhe de ${rotulo.toLowerCase()}`}
          className="grid h-full w-9 shrink-0 place-items-center"
        >
          <Image
            src="/icones/seta-baixo.svg"
            alt=""
            width={12}
            height={12}
            className={`transition-transform ${recuo.aberto ? "" : "-rotate-90"}`}
          />
        </button>
        <button
          type="button"
          onClick={aoTocar}
          className="flex h-full min-w-0 flex-1 items-center justify-between text-left transition-transform active:scale-[0.99]"
        >
          {conteudo}
        </button>
      </div>
    );
  }

  if (!aoTocar) return <div className={CLASSE}>{conteudo}</div>;
  return (
    <button
      type="button"
      onClick={aoTocar}
      className={`${CLASSE} text-left transition-transform active:scale-[0.99]`}
    >
      {conteudo}
    </button>
  );
}

/**
 * Sublinha da Home: detalha a linha de cima (ex.: Despesas em "Do corre" e
 * "Pessoais"). Menor e recuada, para ler como parte dela e não como outro total.
 */
export function SubLinhaValor({ rotulo, valor, corValor, aoTocar }: Omit<Props, "icone">) {
  return (
    <button
      type="button"
      onClick={aoTocar}
      className="ml-5 flex h-[34px] items-center justify-between rounded-[10px] border border-black/8 bg-white pr-3 pl-2.5 text-left shadow-cartao transition-transform active:scale-[0.99]"
    >
      <span className="text-[13px] font-bold">{rotulo}</span>
      <span className={`text-[15px] font-extrabold ${corValor}`}>{valor}</span>
    </button>
  );
}
