"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PainelLancamento } from "@/components/lancamentos/PainelLancamento";
import { IconeMenu } from "@/components/ui/Icones";

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
      <IconeMenu src={item.icone} ativo={ativo} />
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
      className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-[430px] border-t lg:hidden border-black/8 bg-white pb-[env(safe-area-inset-bottom)] shadow-navegacao"
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
            {/* Desenhado em CSS para acompanhar a cor de destaque do tema. */}
            <span aria-hidden className="absolute size-20 rounded-full bg-white/25" />
            <span
              aria-hidden
              className="absolute grid size-16 place-items-center rounded-full text-marinho shadow-[inset_0_4px_4px_rgb(255_255_255/0.35)]"
              style={{
                background:
                  "linear-gradient(30deg, var(--color-dourado-claro) 0%, var(--color-dourado) 45%, color-mix(in srgb, var(--color-dourado) 70%, #000) 100%)",
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
              </svg>
            </span>
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
