import Image from "next/image";
import { BotaoOlho } from "./BotaoOlho";

/**
 * Faixa do Início: saudação à esquerda e o olho (esconder valores) à direita,
 * com o mesmo degradê da esquerda para a direita no celular e no computador.
 */
export function CabecalhoHome({ nome }: { nome?: string }) {
  const saudacao = nome ? `Olá, ${nome}!` : "Olá!";

  return (
    <header className="flex items-center justify-between gap-3 rounded-b-[10px] bg-linear-to-r from-marinho from-40% to-cinza-escuro to-130% px-[13px] pt-[calc(env(safe-area-inset-top)+18px)] pb-[18px] text-white shadow-cabecalho lg:rounded-[20px] lg:px-8 lg:py-7">
      <div className="min-w-0">
        <h1 className="flex items-center gap-1.5 text-xl font-black uppercase lg:text-3xl lg:font-semibold">
          <span className="truncate">{saudacao}</span>
          <Image src="/imagens/foguete.png" alt="" width={21} height={21} />
        </h1>
        <p className="mt-0.5 text-[13px] font-medium text-cinza-claro lg:text-base">Bora pro corre!?</p>
      </div>
      <BotaoOlho className="shrink-0" />
    </header>
  );
}
