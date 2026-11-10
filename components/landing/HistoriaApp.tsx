"use client";

import { useEffect, useRef, useState } from "react";
import { suave, trecho } from "./animacao";
import { useTextos } from "./ContextoLanding";
import { MockupCelular, TelaConta, TelaLancamento, TelaMeta, TelaSaldo } from "./MockupCelular";

/** Telas do celular, na ordem dos textos de idiomas.ts (historia). */
const TELAS = [TelaSaldo, TelaLancamento, TelaMeta, TelaConta];

/**
 * Celular preso ao lado enquanto os textos passam: a tela troca conforme o
 * texto que está no meio da tela. A seção abre com uma linha (como a que
 * "engoliu" o celular da abertura) e o celular volta descendo de dentro dela;
 * só quando ele chega no lugar a primeira tela começa a animar.
 */
export function HistoriaApp() {
  const textos = useTextos().historia;
  // -1: nenhum passo lido ainda (a seção está abaixo da tela). O celular mostra a
  // primeira tela parada e só anima quando o primeiro texto chega ao meio.
  const [ativo, setAtivo] = useState(-1);
  const exibido = Math.max(ativo, 0);
  const passos = useRef<(HTMLDivElement | null)[]>([]);
  const secao = useRef<HTMLDivElement>(null);
  const celular = useRef<HTMLDivElement>(null);
  const [chegou, setChegou] = useState(false);

  useEffect(() => {
    let quadro = 0;
    function medir() {
      quadro = 0;
      const topo = secao.current?.getBoundingClientRect().top;
      const elemento = celular.current;
      if (topo === undefined || !elemento) return;
      // Começa a descer quando a linha passa de 90% da tela e chega no lugar quando
      // a seção encosta embaixo da barra superior (64px), onde o celular fica preso.
      const t = suave(trecho(window.innerHeight * 0.9 - topo, 0, window.innerHeight * 0.9 - 64));
      // Escondido: inteiro acima da linha, cortado pelo overflow da seção.
      const escondido = elemento.offsetTop + elemento.offsetHeight + 24;
      elemento.style.transform = `translateY(${-(1 - t) * escondido}px)`;
      setChegou(t > 0.98);
    }
    function agendar() {
      if (!quadro) quadro = requestAnimationFrame(medir);
    }
    medir();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, []);

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          const indice = Number((entrada.target as HTMLElement).dataset.indice);
          if (entrada.isIntersecting) setAtivo(indice);
          // Rolou de volta para cima do primeiro passo: zera para animar de novo na descida.
          else if (indice === 0 && entrada.boundingClientRect.top > 0) setAtivo(-1);
        });
      },
      // Só a faixa do meio da tela conta como "lendo agora".
      { rootMargin: "-45% 0px -45% 0px" },
    );
    passos.current.forEach((passo) => passo && observador.observe(passo));
    return () => observador.disconnect();
  }, []);

  return (
    // overflow-y-clip (e não hidden) corta o celular na linha sem quebrar o sticky.
    <div ref={secao} className="border-t border-l-tinta/10 [overflow-y:clip]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-2">
        <div className="sticky top-16 z-10 order-first flex h-[calc(100dvh-4rem)] items-center justify-center lg:order-last">
          <div ref={celular} className="will-change-transform">
            <MockupCelular className="scale-[0.8] sm:scale-100">
              {TELAS.map((Tela, indice) => (
                <div
                  key={indice}
                  aria-hidden={indice !== exibido}
                  className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    indice === exibido ? "translate-y-0 opacity-100" : indice < exibido ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0"
                  }`}
                >
                  <Tela ativa={chegou && indice === ativo} />
                </div>
              ))}
            </MockupCelular>
          </div>
        </div>

        <div className="relative z-20 -mt-[60dvh] flex flex-col lg:mt-0">
          {textos.map(({ selo, titulo, texto }, indice) => (
            <div
              key={indice}
              data-indice={indice}
              ref={(elemento) => {
                passos.current[indice] = elemento;
              }}
              className="flex min-h-[90dvh] items-end pb-[12dvh] lg:items-center lg:pb-0"
            >
              <div
                className={`flex flex-col gap-3 rounded-3xl bg-l-fundo/85 p-6 backdrop-blur transition-opacity duration-500 lg:bg-transparent lg:p-0 lg:backdrop-blur-none ${
                  indice === ativo ? "opacity-100" : "opacity-30"
                }`}
              >
                <span className="text-xs font-semibold tracking-[0.14em] text-l-destaque uppercase">{selo}</span>
                <h3 className="text-3xl font-titulo font-bold tracking-[-0.03em] text-l-titulo sm:text-5xl">{titulo}</h3>
                <p className="max-w-md text-base text-l-texto sm:text-lg">{texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
