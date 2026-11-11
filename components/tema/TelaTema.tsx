"use client";

import { useEffect } from "react";
import { BloqueioPro } from "@/components/pro/BloqueioPro";
import { SeloPro } from "@/components/pro/SeloPro";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { usePlano } from "@/hooks/usePlano";
import { aplicarTemaApp, useTemaApp } from "@/hooks/useTemaApp";
import { TEMAS_APP, type CoresTema } from "@/lib/tema-app";

const MARINHO = "#2b2d42";
const degradeBotao = (c: CoresTema) => `linear-gradient(90deg, ${c.destaqueClaro}, ${c.destaque})`;

/** Linhas cinzas no lugar de texto, dentro de um cartão do tema. */
function CartaoPrevia({ c, ponto, largura = "70%" }: { c: CoresTema; ponto?: string; largura?: string }) {
  return (
    <div
      className="flex items-center gap-1 rounded-[3px] px-1 py-[3px]"
      style={{ background: c.superficie, boxShadow: c.sombra.replace("4px 4px", "1px 2px") }}
    >
      {ponto && <span className="size-1.5 shrink-0 rounded-full" style={{ background: ponto }} />}
      <span className="h-[3px] rounded-full" style={{ width: largura, background: c.texto, opacity: 0.75 }} />
    </div>
  );
}

/** Mini celular: faixa do topo, cartões, botão e barra de baixo com o (+). */
function CelularPrevia({ c }: { c: CoresTema }) {
  return (
    <div className="mx-auto w-[86px] rounded-[16px] p-[3px]" style={{ background: "#0b0c10" }}>
      <div className="flex h-[156px] flex-col overflow-hidden rounded-[13px]" style={{ background: c.fundo }}>
        <div className="h-[22px] shrink-0 rounded-b-[5px]" style={{ background: `linear-gradient(90deg, ${MARINHO} 40%, #9196a2 130%)` }} />
        <div className="flex flex-1 flex-col gap-[3px] px-[5px] pt-[6px]">
          <CartaoPrevia c={c} ponto={c.positivo} />
          <CartaoPrevia c={c} ponto={c.pendente} largura="55%" />
          <CartaoPrevia c={c} ponto={c.negativo} largura="62%" />
          <div className="mt-[3px] h-[9px] rounded-[3px]" style={{ background: degradeBotao(c) }} />
        </div>
        <div className="relative flex h-[16px] shrink-0 items-center justify-around px-2" style={{ background: c.superficie }}>
          <span className="size-[5px] rounded-[1.5px]" style={{ background: c.destaqueIcone }} />
          <span className="size-[5px] rounded-[1.5px]" style={{ background: c.cinza }} />
          <span className="absolute -top-[6px] left-1/2 size-[13px] -translate-x-1/2 rounded-full" style={{ background: degradeBotao(c) }} />
          <span className="size-[5px] rounded-[1.5px]" style={{ background: c.cinza }} />
          <span className="size-[5px] rounded-[1.5px]" style={{ background: c.cinza }} />
        </div>
      </div>
    </div>
  );
}

/** Mini monitor: menu lateral, faixa, cartões em grade e botão. */
function MonitorPrevia({ c }: { c: CoresTema }) {
  return (
    <div className="mx-auto w-[168px]">
      <div className="rounded-[7px] p-[3px]" style={{ background: "#0b0c10" }}>
        <div className="flex h-[96px] overflow-hidden rounded-[4px]" style={{ background: c.fundo }}>
          <div className="flex w-[34px] shrink-0 flex-col gap-[4px] px-[4px] pt-[6px]" style={{ background: c.superficie }}>
            <div className="h-[6px] rounded-[2px]" style={{ background: degradeBotao(c) }} />
            {[c.destaqueIcone, c.cinza, c.cinza, c.cinza].map((cor, i) => (
              <span key={i} className="h-[3px] rounded-full" style={{ background: cor, width: i === 0 ? "80%" : "65%" }} />
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-[4px] p-[5px]">
            <div className="h-[16px] rounded-[3px]" style={{ background: `linear-gradient(90deg, ${MARINHO} 40%, #9196a2 130%)` }} />
            <div className="grid grid-cols-2 gap-[4px]">
              <CartaoPrevia c={c} ponto={c.positivo} />
              <CartaoPrevia c={c} ponto={c.pendente} largura="55%" />
              <CartaoPrevia c={c} ponto={c.negativo} largura="62%" />
              <CartaoPrevia c={c} ponto={c.recebido} largura="50%" />
            </div>
            <div className="mt-auto ml-auto h-[8px] w-[46px] rounded-[3px]" style={{ background: degradeBotao(c) }} />
          </div>
        </div>
      </div>
      <div className="mx-auto h-[8px] w-[26px]" style={{ background: "#0b0c10" }} />
      <div className="mx-auto h-[3px] w-[60px] rounded-full" style={{ background: "#0b0c10" }} />
    </div>
  );
}

/**
 * Tema do app (Pro): temas completos, com fundo, cartões e destaque já
 * combinados e conferidos no contraste. Vale para este aparelho.
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
          <p className="text-xs text-cinza-escuro">
            Cada tema já vem com fundo, cartões e cor de destaque combinados e com boa leitura. Vale para este aparelho.
          </p>
          <div role="radiogroup" aria-label="Tema do app" className="grid grid-cols-2 gap-3">
            {TEMAS_APP.map(({ valor, nome, descricao, cores }) => {
              const ativo = valor === tema;
              return (
                <button
                  key={valor}
                  type="button"
                  role="radio"
                  aria-checked={ativo}
                  onClick={() => mudar(valor)}
                  className={`flex flex-col gap-2.5 rounded-[14px] border bg-white p-3 text-left shadow-cartao transition-colors ${
                    ativo ? "border-dourado ring-2 ring-dourado" : "border-black/8"
                  }`}
                >
                  <span className="lg:hidden">
                    <CelularPrevia c={cores} />
                  </span>
                  <span className="hidden lg:block">
                    <MonitorPrevia c={cores} />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="flex items-center justify-between gap-1 text-sm font-bold">
                      {nome}
                      {ativo && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
                          <circle cx="12" cy="12" r="10" fill="var(--color-dourado)" />
                          <path d="m7.5 12.5 3 3 6-6.5" stroke={MARINHO} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="text-[11px] leading-snug text-cinza-escuro">{descricao}</span>
                  </span>
                </button>
              );
            })}
            <div className="flex flex-col items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-cinza p-3 text-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden className="text-cinza-escuro">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2} />
                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-bold">Mais temas em breve</span>
              <span className="text-[11px] leading-snug text-cinza-escuro">Novas combinações chegam nas próximas versões.</span>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

/**
 * Sem Pro, o tema volta ao padrão (ex.: o Pro acabou e o aparelho ainda
 * guardava outro tema). Fica no layout das telas logadas.
 */
export function GuardaTema() {
  const { ehPro, carregando } = usePlano();
  useEffect(() => {
    if (!carregando && !ehPro && document.documentElement.dataset.temaApp) aplicarTemaApp(TEMAS_APP[0].valor);
  }, [ehPro, carregando]);
  return null;
}
