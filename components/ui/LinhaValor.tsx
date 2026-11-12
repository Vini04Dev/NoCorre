import Image from "next/image";

type Props = {
  rotulo: string;
  valor: React.ReactNode;
  icone: string;
  /** Classe de cor do valor, ex.: "text-positivo". */
  corValor: string;
  /** Com ação, a linha vira botão (ex.: abrir o Resumo filtrado). */
  aoTocar?: () => void;
};

const CLASSE =
  "flex h-[43px] w-full items-center justify-between rounded-[10px] border border-black/8 bg-white pr-3 pl-2.5 shadow-cartao";

/** Linha chave-valor da Home: rótulo à esquerda, ícone e valor à direita. */
export function LinhaValor({ rotulo, valor, icone, corValor, aoTocar }: Props) {
  const conteudo = (
    <>
      <span className="text-base font-extrabold uppercase">{rotulo}:</span>
      <span className="flex items-center gap-2.5">
        <Image src={icone} alt="" width={24} height={24} />
        <span className={`min-w-[96px] text-right text-xl font-extrabold ${corValor}`}>{valor}</span>
      </span>
    </>
  );

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
