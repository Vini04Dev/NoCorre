import Image from "next/image";

type Props = {
  rotulo: string;
  valor: string;
  icone: string;
  /** Classe de cor do valor, ex.: "text-positivo". */
  corValor: string;
};

/** Linha chave-valor da Home: rótulo à esquerda, ícone e valor à direita. */
export function LinhaValor({ rotulo, valor, icone, corValor }: Props) {
  return (
    <div className="flex h-[43px] items-center justify-between rounded-[10px] border border-black/8 bg-white pr-3 pl-2.5 shadow-cartao">
      <span className="text-base font-extrabold uppercase">{rotulo}:</span>
      <span className="flex items-center gap-2.5">
        <Image src={icone} alt="" width={24} height={24} />
        <span className={`min-w-[96px] text-right text-xl font-extrabold ${corValor}`}>{valor}</span>
      </span>
    </div>
  );
}
