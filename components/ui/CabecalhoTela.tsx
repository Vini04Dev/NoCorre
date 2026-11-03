import Link from "next/link";

type Props = {
  titulo: string;
  /** Quando informado, mostra a seta "‹" e o título menor, como nas telas de formulário. */
  voltarPara?: string;
  acao?: React.ReactNode;
};

export function CabecalhoTela({ titulo, voltarPara, acao }: Props) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {voltarPara && (
          <Link href={voltarPara} aria-label="Voltar" className="text-[28px] font-medium">
            ‹
          </Link>
        )}
        <h1 className={`font-extrabold ${voltarPara ? "text-xl" : "text-[22px]"}`}>{titulo}</h1>
      </div>
      {acao}
    </header>
  );
}
