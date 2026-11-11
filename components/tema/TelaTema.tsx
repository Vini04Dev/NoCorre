"use client";

import { useEffect } from "react";
import { BloqueioPro } from "@/components/pro/BloqueioPro";
import { SeloPro } from "@/components/pro/SeloPro";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { usePlano } from "@/hooks/usePlano";
import { aplicarTemaApp, useTemaApp } from "@/hooks/useTemaApp";
import { TEMAS_APP } from "@/lib/tema-app";

/**
 * Tema do app (Pro): troca a cor de destaque (botões, seleção, ícones em
 * círculo). Vale para este aparelho. Os valores positivos/negativos continuam
 * verdes e vermelhos em qualquer tema, para não confundir.
 */
export function TelaTema() {
  const { ehPro, carregando } = usePlano();
  const [tema, mudar] = useTemaApp();

  return (
    <main className="flex flex-col gap-4 px-5 pt-[calc(env(safe-area-inset-top)+12px)] pb-10">
      <CabecalhoTela titulo="Tema do app" voltarPara="/perfil" acao={<SeloPro />} />
      {carregando ? (
        <p className="text-center text-[13px] text-cinza-escuro">Carregando...</p>
      ) : !ehPro ? (
        <BloqueioPro recurso="tema" />
      ) : (
        <>
          <p className="text-xs text-cinza-escuro">Escolha a cor de destaque do app neste aparelho.</p>
          <div role="radiogroup" aria-label="Cor do app" className="grid grid-cols-5 gap-2">
            {TEMAS_APP.map(({ valor, rotulo, forte, claro }) => {
              const ativo = valor === tema;
              return (
                <button
                  key={valor}
                  type="button"
                  role="radio"
                  aria-checked={ativo}
                  onClick={() => mudar(valor)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span
                    className={`size-12 rounded-full ${ativo ? "ring-2 ring-marinho ring-offset-2 ring-offset-fundo" : ""}`}
                    style={{ background: `linear-gradient(135deg, ${claro}, ${forte})` }}
                  />
                  <span className={`text-[11px] ${ativo ? "font-semibold" : "text-cinza-escuro"}`}>{rotulo}</span>
                </button>
              );
            })}
          </div>

          <section className="flex flex-col gap-3 rounded-[14px] border border-black/8 bg-white p-4 shadow-cartao">
            <p className="text-[11px] font-semibold tracking-[0.66px] text-cinza">PRÉVIA</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-marinho bg-marinho px-3 py-1.5 text-xs font-semibold text-white">Semana</span>
              <span className="rounded-full bg-dourado-claro px-3 py-1.5 text-xs font-semibold">Selecionado</span>
              <span className="rounded-full border border-dourado px-3 py-1.5 text-xs font-semibold text-dourado">Destaque</span>
            </div>
            <Botao type="button">Botão principal</Botao>
          </section>
        </>
      )}
    </main>
  );
}

/**
 * Sem Pro, o tema volta ao dourado (ex.: o Pro acabou e o aparelho ainda
 * guardava outra cor). Fica no layout das telas logadas.
 */
export function GuardaTema() {
  const { ehPro, carregando } = usePlano();
  useEffect(() => {
    if (!carregando && !ehPro && document.documentElement.dataset.temaApp) aplicarTemaApp("dourado");
  }, [ehPro, carregando]);
  return null;
}
