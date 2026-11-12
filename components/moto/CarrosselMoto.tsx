"use client";

import { useId, useRef, useState } from "react";
import type { CalorParte } from "./MapaCalorMoto";
import { COR_SITUACAO, type ParteDesenho } from "@/lib/moto";

type Mancha = { cx: number; cy: number; rx: number; ry: number };

/**
 * Fotos da CG 160 em volta da moto, na ordem em que aparecem quando ela gira
 * arrastando para a esquerda (a frente vem para quem olha). Coordenadas das
 * manchas no tamanho original das fotos (950 × 466). Parte que não aparece
 * naquele ângulo (a corrente fica do lado esquerdo) não ganha mancha.
 */
const ANGULOS: { nome: string; foto: string; manchas: Partial<Record<ParteDesenho, Mancha[]>> }[] = [
  {
    nome: "Lateral",
    foto: "/moto/fan160/lateral.webp",
    manchas: {
      motor: [{ cx: 478, cy: 318, rx: 62, ry: 55 }],
      roda_traseira: [{ cx: 268, cy: 368, rx: 92, ry: 92 }],
      roda_dianteira: [{ cx: 705, cy: 360, rx: 98, ry: 98 }],
      freios: [
        { cx: 705, cy: 352, rx: 44, ry: 44 },
        { cx: 268, cy: 368, rx: 30, ry: 30 },
      ],
    },
  },
  {
    nome: "Frente",
    foto: "/moto/fan160/dianteira.webp",
    manchas: {
      motor: [{ cx: 445, cy: 285, rx: 55, ry: 50 }],
      roda_traseira: [{ cx: 330, cy: 325, rx: 62, ry: 70 }],
      roda_dianteira: [{ cx: 638, cy: 355, rx: 82, ry: 92 }],
      freios: [{ cx: 618, cy: 352, rx: 40, ry: 44 }],
    },
  },
  {
    nome: "Traseira esquerda",
    foto: "/moto/fan160/traseira-esquerda.webp",
    manchas: {
      motor: [{ cx: 395, cy: 285, rx: 52, ry: 48 }],
      corrente: [{ cx: 470, cy: 325, rx: 92, ry: 24 }],
      roda_traseira: [{ cx: 585, cy: 335, rx: 88, ry: 98 }],
      roda_dianteira: [{ cx: 268, cy: 318, rx: 62, ry: 82 }],
      freios: [{ cx: 262, cy: 318, rx: 28, ry: 34 }],
    },
  },
  {
    nome: "Traseira direita",
    foto: "/moto/fan160/traseira-direita.webp",
    manchas: {
      motor: [{ cx: 505, cy: 290, rx: 55, ry: 50 }],
      roda_traseira: [{ cx: 318, cy: 340, rx: 88, ry: 98 }],
      roda_dianteira: [{ cx: 625, cy: 315, rx: 62, ry: 80 }],
      freios: [
        { cx: 318, cy: 340, rx: 30, ry: 34 },
        { cx: 632, cy: 305, rx: 26, ry: 32 },
      ],
    },
  },
];

const TOTAL = ANGULOS.length;
/** Quantos pixels de arraste trocam um ângulo. */
const PASSO = 110;

/** Distância em volta (0 a TOTAL/2) entre o ângulo i e a posição atual. */
function distancia(i: number, posicao: number) {
  const d = Math.abs((((i - posicao) % TOTAL) + TOTAL) % TOTAL);
  return Math.min(d, TOTAL - d);
}

/** Ícone de linha de giro (360°): avisa que a moto gira, sem texto nem setas. */
function IconeGirar() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16.5 7.5C15.6 4.2 14 2 12 2 9.2 2 7 6.5 7 12s2.2 10 5 10c.3 0 .7-.1 1-.2" />
      <path d="m15.2 13.7 3.8 1.9-1.9 3.8" />
      <path d="M19 15.6c-1.8.9-4.3 1.4-7 1.4-5.5 0-10-2.2-10-5s4.5-5 10-5c4.8 0 8.9 1.7 9.8 4" />
    </svg>
  );
}

/**
 * Fotos da moto que giram com o dedo (ou arrastando com o mouse): uma foto vai
 * sumindo enquanto a do ângulo seguinte aparece por cima. O mapa de calor
 * acompanha cada foto, com as manchas no lugar da peça naquele ângulo.
 */
export function CarrosselMoto({ partes, descricao }: { partes: Partial<Record<ParteDesenho, CalorParte>>; descricao: string }) {
  const id = useId();
  const filtro = `calor-foto-${id.replace(/[^a-zA-Z0-9]/g, "")}`;
  const [posicao, setPosicao] = useState(0);
  const [arrastando, setArrastando] = useState(false);
  const inicio = useRef<{ x: number; posicao: number } | null>(null);
  const atual = ((Math.round(posicao) % TOTAL) + TOTAL) % TOTAL;

  return (
    <div className="flex w-full flex-col items-center gap-1.5">
      <div
        role="img"
        aria-label={`${descricao}. Foto: ${ANGULOS[atual].nome}. Arraste ou use as setas do teclado para girar.`}
        // Sem os botões de seta na tela, o teclado continua girando a moto.
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPosicao((p) => Math.round(p) + 1);
          if (e.key === "ArrowRight") setPosicao((p) => Math.round(p) - 1);
        }}
        className={`relative aspect-[950/466] w-full max-w-md touch-pan-y rounded-[10px] outline-offset-2 select-none focus:outline-none focus-visible:outline-2 focus-visible:outline-dourado ${arrastando ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          inicio.current = { x: e.clientX, posicao };
          setArrastando(true);
        }}
        onPointerMove={(e) => {
          if (!inicio.current) return;
          // Arrastar para a esquerda traz a frente da moto: próximo ângulo da lista.
          setPosicao(inicio.current.posicao + (inicio.current.x - e.clientX) / PASSO);
        }}
        onPointerUp={() => {
          inicio.current = null;
          setArrastando(false);
          setPosicao((p) => Math.round(p));
        }}
        onPointerCancel={() => {
          inicio.current = null;
          setArrastando(false);
          setPosicao((p) => Math.round(p));
        }}
      >
        {/* Tema escuro: luz suave atrás da moto, que é preta e sumiria no cartão escuro. */}
        <div
          aria-hidden
          className="absolute inset-0 hidden [html[data-tema-escuro]_&]:block"
          style={{ background: "radial-gradient(ellipse 55% 62% at 50% 56%, rgba(255,255,255,0.17), transparent 72%)" }}
        />
        {ANGULOS.map((angulo, i) => {
          const opacidade = Math.max(0, 1 - distancia(i, posicao));
          return (
            <div
              key={angulo.nome}
              className={`absolute inset-0 ${arrastando ? "" : "transition-opacity duration-300 motion-reduce:transition-none"}`}
              style={{ opacity: opacidade }}
              aria-hidden
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- fotos fixas e leves (webp ~50 KB); a primeira carrega já, as outras logo depois */}
              <img src={angulo.foto} alt="" draggable={false} loading={i === 0 ? "eager" : "lazy"} className="size-full object-contain" />
              <svg viewBox="0 0 950 466" className="absolute inset-0 size-full">
                <defs>
                  <filter id={`${filtro}-${i}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="20" />
                  </filter>
                </defs>
                <g filter={`url(#${filtro}-${i})`}>
                  {(Object.keys(angulo.manchas) as ParteDesenho[]).map((parte) => {
                    const calor = partes[parte];
                    if (!calor) return null;
                    const forte = calor.situacao === "trocar" || calor.situacao === "vencido";
                    return angulo.manchas[parte]!.map((m, j) => (
                      <ellipse
                        key={`${parte}-${j}`}
                        {...m}
                        fill={COR_SITUACAO[calor.situacao]}
                        opacity={0.25 + 0.45 * Math.min(calor.fracao, 1)}
                        className={forte ? "animate-pulse motion-reduce:animate-none" : undefined}
                      />
                    ));
                  })}
                </g>
              </svg>
            </div>
          );
        })}
      </div>

      <span className="text-cinza" title="Arraste a moto para girar">
        <IconeGirar />
      </span>
    </div>
  );
}
