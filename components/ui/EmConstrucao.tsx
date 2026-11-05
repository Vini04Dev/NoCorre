import { CabecalhoTela } from "./CabecalhoTela";

/** Página provisória para as telas das próximas etapas. */
export function EmConstrucao({ titulo, voltarPara }: { titulo: string; voltarPara?: string }) {
  return (
    // Altura da tela menos a navegação inferior, para o aviso ficar no meio do espaço livre.
    <main className="flex min-h-[calc(100dvh-env(safe-area-inset-bottom)-96px)] flex-col px-[17px] pt-[calc(env(safe-area-inset-top)+12px)] lg:min-h-[calc(100dvh-5rem)] lg:px-0 lg:pt-2">
      <CabecalhoTela titulo={titulo} voltarPara={voltarPara} />
      <p className="my-auto text-center text-[13px] text-cinza-escuro">Esta tela ainda está em construção.</p>
    </main>
  );
}
