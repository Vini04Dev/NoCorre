"use client";

import { memo, useRef } from "react";
import { suave, trecho, useProgressoRolagem } from "./animacao";
import { CAIXAS, CENTRO_CIDADE, CIDADE, CODIGO_MG, ESTADOS } from "./mapa-dados";

type Caixa = readonly [number, number, number, number];

/** Pontos de entrega ao redor do centro, em fração do tamanho da cidade (fictícios). */
const PONTOS = [
  [-0.08, -0.05], [0.06, -0.09], [0.11, 0.04], [-0.03, 0.08], [0.02, -0.02], [-0.12, 0.02],
  [0.08, 0.1], [-0.06, -0.12], [0.14, -0.03], [-0.1, 0.11], [0.04, 0.14], [-0.15, -0.06],
];

/** Interpola dois enquadramentos: centro em linha reta, tamanho em escala logarítmica (zoom natural). */
function interpolar(a: Caixa, b: Caixa, t: number): Caixa {
  const centro = (c: Caixa) => [c[0] + c[2] / 2, c[1] + c[3] / 2];
  const [ax, ay] = centro(a);
  const [bx, by] = centro(b);
  const largura = a[2] * Math.pow(b[2] / a[2], t);
  const altura = a[3] * Math.pow(b[3] / a[3], t);
  // O centro acompanha o zoom (e não o tempo), senão o alvo foge da tela no meio do caminho.
  const k = a[2] === b[2] ? t : (a[2] - largura) / (a[2] - b[2]);
  const cx = ax + (bx - ax) * k;
  const cy = ay + (by - ay) * k;
  return [cx - largura / 2, cy - altura / 2, largura, altura];
}

function folga(caixa: Caixa, fator: number): Caixa {
  const [x, y, w, h] = caixa;
  return [x - (w * (fator - 1)) / 2, y - (h * (fator - 1)) / 2, w * fator, h * fator];
}

const BRASIL = folga(CAIXAS.brasil, 1.08);
const MINAS = folga(CAIXAS.minas, 1.5);
const CIDADE_CAIXA = folga(CAIXAS.cidade, 1.9);

/** Os contornos não mudam: memo evita reprocessar ~70 KB de caminhos a cada quadro. */
const Contornos = memo(function Contornos() {
  return (
    <>
      {ESTADOS.map(({ id, d }) => (
        <path
          key={id}
          d={d}
          vectorEffect="non-scaling-stroke"
          strokeWidth={1}
          className={id === CODIGO_MG ? "fill-dourado/25 stroke-dourado-claro" : "fill-white/[0.06] stroke-white/20"}
        />
      ))}
      <path d={CIDADE} vectorEffect="non-scaling-stroke" strokeWidth={2} className="fill-dourado/40 stroke-dourado-claro" />
    </>
  );
});

const ETAPAS = [
  { ate: 0.22, titulo: "Brasil", texto: "Milhares de entregadores rodando todo dia, quase sempre sem controle do que ganham." },
  { ate: 0.6, titulo: "Minas Gerais", texto: "No Sul de Minas, o corre é de moto: app, central, pizzaria e mototáxi." },
  {
    ate: 1.01,
    titulo: "São Sebastião do Paraíso",
    texto: "É aqui que o No Corre! nasceu e roda o teste piloto, com entregadores da cidade.",
  },
];

/**
 * Seção alta com o mapa preso na tela: rolar dá zoom do Brasil até Minas e,
 * depois, até São Sebastião do Paraíso, onde aparecem o pino e as entregas.
 */
export function MapaCidade() {
  const secao = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const pino = useRef<SVGGElement>(null);
  const pontos = useRef<SVGGElement>(null);
  const textos = useRef<(HTMLDivElement | null)[]>([]);

  useProgressoRolagem(secao, (p) => {
    const ateMinas = suave(trecho(p, 0.12, 0.42));
    const ateCidade = suave(trecho(p, 0.5, 0.8));
    const caixa = ateCidade > 0 ? interpolar(MINAS, CIDADE_CAIXA, ateCidade) : interpolar(BRASIL, MINAS, ateMinas);
    svg.current?.setAttribute("viewBox", caixa.map((n) => n.toFixed(3)).join(" "));

    // Pino e pontos mantêm o tamanho na tela: o raio acompanha a largura do enquadramento.
    const escala = caixa[2] / 100;
    const mostrarPino = trecho(p, 0.42, 0.55);
    pino.current?.setAttribute("transform", `translate(${CENTRO_CIDADE[0]} ${CENTRO_CIDADE[1]}) scale(${escala})`);
    pino.current?.setAttribute("opacity", String(mostrarPino));
    pontos.current?.setAttribute("opacity", String(trecho(p, 0.8, 0.9)));

    const atual = ETAPAS.findIndex((etapa) => p < etapa.ate);
    textos.current.forEach((texto, indice) => {
      if (!texto) return;
      texto.style.opacity = indice === atual ? "1" : "0";
      texto.style.transform = `translateY(${indice === atual ? 0 : indice < atual ? -16 : 16}px)`;
    });
  });

  const [, , larguraCidade, alturaCidade] = CAIXAS.cidade;

  return (
    <section ref={secao} aria-label="Onde o No Corre! roda" className="relative h-[320vh]">
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden lg:flex-row">
        <div className="relative z-10 flex flex-col gap-3 px-5 pt-24 sm:px-8 lg:w-[42%] lg:justify-center lg:pt-0 lg:pl-[max(2rem,calc((100vw-72rem)/2+2rem))]">
          <span className="text-xs font-semibold tracking-[0.14em] text-dourado-claro uppercase">DE ONDE A GENTE VEM</span>
          <div className="relative min-h-[150px] sm:min-h-[170px]">
            {ETAPAS.map(({ titulo, texto }, indice) => (
              <div
                key={titulo}
                ref={(elemento) => {
                  textos.current[indice] = elemento;
                }}
                style={{ opacity: indice === 0 ? 1 : 0 }}
                className="absolute inset-0 flex flex-col gap-3 transition-[opacity,transform] duration-500 ease-out"
              >
                <h2 className="text-4xl font-titulo font-bold tracking-[-0.03em] text-white sm:text-5xl">{titulo}</h2>
                <p className="max-w-md text-base text-cinza-claro sm:text-lg">{texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex-1 [mask-image:linear-gradient(to_bottom,transparent,black_18%)] lg:[mask-image:linear-gradient(to_right,transparent,black_22%)]">
          <svg
            ref={svg}
            viewBox={BRASIL.join(" ")}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 size-full"
            role="img"
            aria-label="Mapa do Brasil com Minas Gerais e São Sebastião do Paraíso em destaque"
          >
            <Contornos />
            <g ref={pontos} opacity={0}>
              {PONTOS.map(([dx, dy], indice) => (
                <circle
                  key={indice}
                  cx={CENTRO_CIDADE[0] + dx * larguraCidade}
                  cy={CENTRO_CIDADE[1] + dy * alturaCidade}
                  r={0.06}
                  className="animate-pulse fill-positivo"
                  style={{ animationDelay: `${indice * 160}ms` }}
                />
              ))}
            </g>
            <g ref={pino} opacity={0}>
              <circle r={3.2} className="animate-ping fill-dourado/40 [transform-box:fill-box] [transform-origin:center]" />
              <circle r={1.4} className="fill-dourado-claro stroke-marinho" strokeWidth={0.5} />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
