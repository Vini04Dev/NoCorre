"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { caminhoDoDetalhe, lerSequencia, type ItemSequencia } from "@/lib/sequencia-extrato";

/** Distância mínima, em px, para um arrasto lateral contar como "passar". */
const ARRASTO_MINIMO = 60;

const CLASSE_SETA =
  "grid size-9 place-items-center rounded-full border border-black/8 bg-white shadow-cartao disabled:opacity-30";

/**
 * Setas "anterior / próximo" no detalhe, seguindo a lista do extrato de onde o
 * item foi aberto (mesmo período e filtros). Também passa arrastando para os lados.
 * Sem lista guardada (ex.: link aberto direto), não mostra nada.
 */
export function NavegacaoDetalhe({ atual }: { atual: ItemSequencia }) {
  const router = useRouter();
  // Lido só no navegador: no servidor não existe sessionStorage.
  const [sequencia] = useState(() => (typeof window === "undefined" ? [] : lerSequencia()));
  const indice = sequencia.findIndex((item) => item.tipo === atual.tipo && item.id === atual.id);
  const anterior = indice > 0 ? sequencia[indice - 1] : undefined;
  const proximo = indice >= 0 ? sequencia[indice + 1] : undefined;

  // replace: trocar de item não empilha histórico; o "voltar" leva direto ao Resumo.
  useEffect(() => {
    let inicioX: number | null = null;
    const aoTocar = (evento: TouchEvent) => (inicioX = evento.touches[0].clientX);
    const aoSoltar = (evento: TouchEvent) => {
      if (inicioX === null) return;
      const deslocamento = evento.changedTouches[0].clientX - inicioX;
      inicioX = null;
      if (deslocamento > ARRASTO_MINIMO && anterior) router.replace(caminhoDoDetalhe(anterior));
      if (deslocamento < -ARRASTO_MINIMO && proximo) router.replace(caminhoDoDetalhe(proximo));
    };
    window.addEventListener("touchstart", aoTocar, { passive: true });
    window.addEventListener("touchend", aoSoltar);
    return () => {
      window.removeEventListener("touchstart", aoTocar);
      window.removeEventListener("touchend", aoSoltar);
    };
  }, [anterior, proximo, router]);

  if (indice < 0 || sequencia.length < 2) return null;

  return (
    <nav aria-label="Outros lançamentos da lista" className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => anterior && router.replace(caminhoDoDetalhe(anterior))}
        disabled={!anterior}
        aria-label="Lançamento anterior"
        className={CLASSE_SETA}
      >
        <Image src="/icones/voltar.svg" alt="" width={20} height={20} />
      </button>
      <span className="text-xs font-semibold text-cinza-escuro">
        {indice + 1} de {sequencia.length}
      </span>
      <button
        type="button"
        onClick={() => proximo && router.replace(caminhoDoDetalhe(proximo))}
        disabled={!proximo}
        aria-label="Próximo lançamento"
        className={CLASSE_SETA}
      >
        <Image src="/icones/voltar.svg" alt="" width={20} height={20} className="rotate-180" />
      </button>
    </nav>
  );
}
