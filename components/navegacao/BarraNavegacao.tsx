"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PainelLancamento } from "@/components/lancamentos/PainelLancamento";

type ItemNavegacao = {
  href: string;
  rotulo: string;
  icone: string;
  iconeAtivo: string;
};

const itensEsquerda: ItemNavegacao[] = [
  { href: "/", rotulo: "Início", icone: "/icones/inicio.svg", iconeAtivo: "/icones/inicio-ativo.svg" },
  { href: "/resumo", rotulo: "Resumo", icone: "/icones/resumo.svg", iconeAtivo: "/icones/resumo-ativo.svg" },
];

const itensDireita: ItemNavegacao[] = [
  {
    href: "/relatorios",
    rotulo: "Relatórios",
    icone: "/icones/relatorios.svg",
    iconeAtivo: "/icones/relatorios-ativo.svg",
  },
  { href: "/perfil", rotulo: "Perfil", icone: "/icones/perfil.svg", iconeAtivo: "/icones/perfil-ativo.svg" },
];

function estaAtivo(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function LinkNavegacao({ item, ativo }: { item: ItemNavegacao; ativo: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={ativo ? "page" : undefined}
      className="flex flex-col items-center gap-0.5 pt-[11px] text-[11px] text-marinho"
    >
      <Image src={ativo ? item.iconeAtivo : item.icone} alt="" width={24} height={24} />
      {item.rotulo}
    </Link>
  );
}

export function BarraNavegacao() {
  const pathname = usePathname();
  const [painelAberto, setPainelAberto] = useState(false);

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-[430px] border-t border-black/8 bg-white pb-[env(safe-area-inset-bottom)] shadow-navegacao"
    >
      <div className="grid h-14 grid-cols-5">
        {itensEsquerda.map((item) => (
          <LinkNavegacao key={item.href} item={item} ativo={estaAtivo(pathname, item.href)} />
        ))}

        <div className="relative flex justify-center">
          <button
            type="button"
            onClick={() => setPainelAberto(true)}
            aria-label="Novo lançamento"
            aria-haspopup="dialog"
            className="absolute -top-10 grid size-20 place-items-center"
          >
            <Image src="/icones/botao-mais-fundo.svg" alt="" width={80} height={80} className="absolute" />
            <Image src="/icones/botao-mais-circulo.svg" alt="" width={64} height={64} className="absolute" />
            <Image src="/icones/mais.svg" alt="" width={55} height={55} className="absolute" />
          </button>
        </div>

        {itensDireita.map((item) => (
          <LinkNavegacao key={item.href} item={item} ativo={estaAtivo(pathname, item.href)} />
        ))}
      </div>
      {painelAberto && <PainelLancamento aoFechar={() => setPainelAberto(false)} />}
    </nav>
  );
}
