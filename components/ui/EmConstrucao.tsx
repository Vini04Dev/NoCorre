import { CabecalhoTela } from "./CabecalhoTela";

/** Página provisória para as telas das próximas etapas. */
export function EmConstrucao({ titulo, voltarPara }: { titulo: string; voltarPara?: string }) {
  return (
    <main className="flex flex-col gap-6 px-[17px] pt-3">
      <CabecalhoTela titulo={titulo} voltarPara={voltarPara} />
      <p className="text-[13px] text-cinza-escuro">Esta tela ainda está em construção.</p>
    </main>
  );
}
