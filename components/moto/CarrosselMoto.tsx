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

function Seta({ lado, aoClicar }: { lado: "esquerda" | "direita"; aoClicar: () => void }) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-label={lado === "esquerda" ? "Girar a moto para a esquerda" : "Girar a moto para a direita"}
      className="grid size-8 place-items-center rounded-full border border-cinza-claro text-cinza-escuro"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={lado === "esquerda" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
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
        aria-label={`${descricao}. Foto: ${ANGULOS[atual].nome}. Arraste para girar.`}
        className={`relative aspect-[950/466] w-full max-w-md touch-pan-y select-none ${arrastando ? "cursor-grabbing" : "cursor-grab"}`}
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

      <div className="flex items-center gap-3">
        <Seta lado="esquerda" aoClicar={() => setPosicao((p) => Math.round(p) + 1)} />
        <span className="flex flex-col items-center">
          <span className="text-[11px] font-semibold">{ANGULOS[atual].nome}</span>
          <span className="flex gap-1" aria-hidden>
            {ANGULOS.map((angulo, i) => (
              <span key={angulo.nome} className={`size-1.5 rounded-full ${i === atual ? "bg-marinho" : "bg-cinza-claro"}`} />
            ))}
          </span>
        </span>
        <Seta lado="direita" aoClicar={() => setPosicao((p) => Math.round(p) - 1)} />
      </div>
    </div>
  );
}
