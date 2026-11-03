import Link from "next/link";

type Props = {
  titulo: string;
  /** Quando informado, mostra a seta "‹" de voltar. */
  voltarPara?: string;
  /** Título de 24 px das telas principais de módulo (ex.: Cadastro). Sem ele, formulários usam 20 px. */
  tituloGrande?: boolean;
  acao?: React.ReactNode;
};

export function CabecalhoTela({ titulo, voltarPara, tituloGrande, acao }: Props) {
  const tamanho = tituloGrande ? "text-2xl" : voltarPara ? "text-xl" : "text-[22px]";

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {voltarPara && (
          <Link href={voltarPara} aria-label="Voltar" className="text-[28px] font-medium">
            ‹
          </Link>
        )}
        <h1 className={`font-extrabold ${tamanho}`}>{titulo}</h1>
      </div>
      {acao}
    </header>
  );
}
