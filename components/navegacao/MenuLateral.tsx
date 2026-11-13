"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PainelLancamento } from "@/components/lancamentos/PainelLancamento";
import { usePlano } from "@/hooks/usePlano";

type Item = { href: string; rotulo: string; icone: string; iconeAtivo?: string };

const PRINCIPAIS: Item[] = [
  { href: "/", rotulo: "Início", icone: "/icones/inicio.svg", iconeAtivo: "/icones/inicio-ativo.svg" },
  { href: "/resumo", rotulo: "Resumo", icone: "/icones/resumo.svg", iconeAtivo: "/icones/resumo-ativo.svg" },
  {
    href: "/relatorios",
    rotulo: "Relatórios",
    icone: "/icones/relatorios.svg",
    iconeAtivo: "/icones/relatorios-ativo.svg",
  },
];

const MODULOS: Item[] = [
  { href: "/agenda", rotulo: "Agenda", icone: "/icones/agenda.svg" },
  { href: "/metas", rotulo: "Metas", icone: "/icones/metas.svg" },
  { href: "/cadastro", rotulo: "Cadastro", icone: "/icones/cadastro.svg" },
];

/** Módulos que só aparecem para quem é Pro. */
const MODULOS_PRO: Item[] = [
  { href: "/carteiras", rotulo: "Carteiras", icone: "/icones/carteira-modulo.svg" },
  { href: "/moto", rotulo: "Saúde da moto", icone: "/icones/moto-modulo.svg" },
];

const PERFIL: Item = { href: "/perfil", rotulo: "Perfil", icone: "/icones/perfil.svg", iconeAtivo: "/icones/perfil-ativo.svg" };

function estaAtivo(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function LinkMenu({ item, ativo }: { item: Item; ativo: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={ativo ? "page" : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
        ativo ? "bg-dourado-claro/35 font-semibold" : "font-medium text-marinho/80 hover:bg-cinza-fundo"
      }`}
    >
      <Image src={(ativo && item.iconeAtivo) || item.icone} alt="" width={24} height={24} className="size-6" />
      {item.rotulo}
    </Link>
  );
}

function Grupo({ titulo, itens, pathname }: { titulo?: string; itens: Item[]; pathname: string }) {
  return (
    <div className="flex flex-col gap-1">
      {titulo && <p className="px-3 pt-4 pb-1 text-[11px] font-semibold tracking-[0.66px] text-cinza">{titulo}</p>}
      {itens.map((item) => (
        <LinkMenu key={item.href} item={item} ativo={estaAtivo(pathname, item.href)} />
      ))}
    </div>
  );
}

/**
 * Navegação do computador: menu fixo à esquerda no lugar da barra inferior do
 * celular. O botão (+) vira "Novo lançamento" e abre o mesmo painel.
 * `admin` vem do layout (servidor), que confere ADMIN_EMAIL.
 */
export function MenuLateral({ admin = false }: { admin?: boolean }) {
  const pathname = usePathname();
  const [painelAberto, setPainelAberto] = useState(false);
  const { ehPro } = usePlano();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-black/8 bg-white px-4 py-6 lg:flex">
      <Link href="/" className="flex items-center gap-3 px-2">
        <span className="size-10 overflow-hidden rounded-[10px] bg-white shadow-cartao ring-1 ring-black/5">
          <Image src="/imagens/logo.png" alt="" width={40} height={40} priority />
        </span>
        <span className="flex flex-col">
          <span className="text-lg leading-tight font-black">No Corre!</span>
          <span className="text-[10px] font-semibold text-cinza-escuro">De Entregador para Entregador</span>
        </span>
      </Link>

      <button
        type="button"
        onClick={() => setPainelAberto(true)}
        aria-haspopup="dialog"
        className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-dourado-claro px-4 py-3 text-sm font-bold shadow-cartao transition-colors hover:bg-dourado"
      >
        <span aria-hidden className="text-lg leading-none">
          +
        </span>
        Novo lançamento
      </button>

      <nav aria-label="Navegação principal" className="mt-5 flex flex-1 flex-col overflow-y-auto">
        <Grupo itens={PRINCIPAIS} pathname={pathname} />
        <Grupo titulo="MÓDULOS" itens={ehPro ? [...MODULOS, ...MODULOS_PRO] : MODULOS} pathname={pathname} />
        {admin && (
          <Grupo
            titulo="ADMINISTRAÇÃO"
            itens={[{ href: "/admin", rotulo: "Painel do sistema", icone: "/icones/relatorios.svg" }]}
            pathname={pathname}
          />
        )}
      </nav>

      <div className="border-t border-black/8 pt-3">
        <LinkMenu item={PERFIL} ativo={estaAtivo(pathname, PERFIL.href)} />
      </div>

      {painelAberto && <PainelLancamento aoFechar={() => setPainelAberto(false)} />}
    </aside>
  );
}
