import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { BotaoOlho } from "./BotaoOlho";
import { SinoNotificacoes } from "@/components/notificacoes/SinoNotificacoes";

/**
 * Faixa do Início: saudação à esquerda; à direita o sininho de notificações e
 * o olho (esconder valores). Mesmo degradê da esquerda para a direita no
 * celular e no computador.
 */
export function CabecalhoHome({ nome }: { nome?: string }) {
  const saudacao = nome ? `Olá, ${nome}!` : "Olá!";

  return (
    <header className="flex items-center justify-between gap-3 rounded-b-[10px] bg-linear-to-r from-marinho from-40% to-cinza-escuro to-130% px-[13px] pt-[calc(env(safe-area-inset-top)+18px)] pb-[18px] text-white shadow-cabecalho lg:rounded-[20px] lg:px-8 lg:py-7">
      <div className="min-w-0">
        <h1 className="text-xl font-black uppercase lg:text-3xl">
          {/* O nome leva ao Perfil, onde a pessoa vê e edita os próprios dados. */}
          <Link href="/perfil" className="flex items-center gap-1.5">
            <span className="truncate">{saudacao}</span>
            <Image src="/imagens/foguete.png" alt="" width={21} height={21} />
          </Link>
        </h1>
        <p className="mt-0.5 text-[13px] font-medium text-cinza-claro lg:text-base">Bora pro corre!?</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {/* useSearchParams (prévia ?aviso=vencimento) precisa de Suspense em volta. */}
        <Suspense>
          <SinoNotificacoes />
        </Suspense>
        <BotaoOlho className="shrink-0" />
      </div>
    </header>
  );
}
