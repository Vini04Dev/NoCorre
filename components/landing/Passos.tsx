"use client";

import { useEffect, useRef, useState } from "react";
import { useVisivel } from "./animacao";
import { useTextos } from "./ContextoLanding";

/** Quantos passos há (os textos ficam em idiomas.ts). */
const PASSOS_TOTAL = 3;

/** Tempo entre um passo e o seguinte; a linha leva parte desse tempo para chegar. */
const RITMO = 900;

type Ponto = { x: number; y: number };

/** Curva entre os números: por cima dos cards no desktop, pela lateral no celular. */
function curva(a: Ponto, b: Ponto) {
  const lado = b.x - a.x > 120;
  if (lado) {
    const meio = (a.x + b.x) / 2;
    const topo = Math.min(a.y, b.y) - 70;
    return `M${a.x} ${a.y} C${meio - 40} ${topo}, ${meio + 40} ${topo}, ${b.x} ${b.y}`;
  }
  const meio = (a.y + b.y) / 2;
  return `M${a.x} ${a.y} C${a.x - 14} ${meio}, ${b.x - 14} ${meio}, ${b.x} ${b.y}`;
}

/**
 * Três cards em escada, cada um passando um pouco por baixo do anterior. Ao
 * aparecer, uma linha pontilhada vai do número 1 ao 2 e do 2 ao 3, e cada card
 * entra quando a linha chega nele.
 */
export function Passos() {
  const passos = useTextos().passos.itens;
  const [ref, visivel] = useVisivel<HTMLDivElement>("0px 0px -25% 0px");
  const numeros = useRef<(HTMLSpanElement | null)[]>([]);
  const [caminhos, setCaminhos] = useState<string[]>([]);

  useEffect(() => {
    const caixa = ref.current;
    if (!caixa) return;
    function medir() {
      // offsetLeft/Top ignoram o transform da entrada: mede a posição final dos números.
      // O ResizeObserver pode disparar enquanto a tela é desmontada (refs já nulos).
      const elementos = numeros.current.filter((numero): numero is HTMLSpanElement => Boolean(numero?.offsetParent));
      if (elementos.length !== PASSOS_TOTAL) return;
      const centros = elementos.map((numero) => {
        const card = numero.offsetParent as HTMLElement;
        return {
          x: card.offsetLeft + numero.offsetLeft + numero.offsetWidth / 2,
          y: card.offsetTop + numero.offsetTop + numero.offsetHeight / 2,
        };
      });
      setCaminhos(centros.slice(1).map((ponto, i) => curva(centros[i], ponto)));
    }
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(caixa);
    return () => observador.disconnect();
  }, [ref]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-5xl">
      <ol className="relative flex flex-col pl-6 md:flex-row md:items-start md:pl-0">
        {passos.map(({ titulo, texto }, indice) => (
          <li
            key={titulo}
            style={{
              zIndex: PASSOS_TOTAL - indice,
              transitionDelay: visivel ? `${indice * RITMO + (indice ? 500 : 0)}ms` : "0ms",
            }}
            className={`relative flex-1 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
              indice > 0 ? "-mt-4 md:mt-0 md:-ml-8" : ""
            } ${indice === 1 ? "md:mt-16" : ""} ${indice === 2 ? "md:mt-32" : ""} ${
              visivel ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div
              className={`flex flex-col gap-4 rounded-2xl border border-l-tinta/10 bg-l-cartao p-7 pl-9 shadow-[0_30px_60px_-25px_var(--l-sombra)] ${
                // A borda esquerda fica por baixo do card anterior: o texto começa depois dela.
                indice > 0 ? "md:pt-10 md:pl-14" : "md:pt-10 md:pl-7"
              }`}
            >
              <span
                ref={(elemento) => {
                  numeros.current[indice] = elemento;
                }}
                className="absolute top-7 -left-5 grid size-10 place-items-center rounded-full bg-dourado-claro text-base font-black text-marinho ring-4 ring-l-fundo md:-top-5 md:left-14"
              >
                {indice + 1}
              </span>
              <h3 className="text-xl font-bold text-l-titulo">{titulo}</h3>
              <p className="text-sm text-l-texto">{texto}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Por cima dos cards: a linha passa entre eles e encosta nos números. */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible">
        <defs>
          {caminhos.map((d, i) => (
            <mask key={d} id={`linha-passo-${i}`} maskUnits="userSpaceOnUse">
              <path
                d={d}
                fill="none"
                stroke="white"
                strokeWidth="6"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={visivel ? 0 : 1}
                style={{ transitionDelay: visivel ? `${i * RITMO + 200}ms` : "0ms" }}
                className="transition-[stroke-dashoffset] duration-700 ease-in-out motion-reduce:transition-none"
              />
            </mask>
          ))}
        </defs>
        {/* O pontilhado fica parado; a máscara revela ele aos poucos. */}
        {caminhos.map((d, i) => (
          <path
            key={d}
            d={d}
            fill="none"
            mask={`url(#linha-passo-${i})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="0 9"
            className="stroke-dourado-claro"
          />
        ))}
      </svg>
    </div>
  );
}
