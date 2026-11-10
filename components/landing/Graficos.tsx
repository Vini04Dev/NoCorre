"use client";

import { useVisivel } from "./animacao";
import { Contador } from "./Contador";
import { useTextos } from "./ContextoLanding";
import { CATEGORIAS_DESPESA, ENTREGAS_SEMANA, RECEITA_TOTAL_SEMANA, SALDO_MES } from "./dados";

const TRANSICAO = "transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

function Cartao({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex min-w-0 flex-col gap-5 rounded-2xl border border-l-tinta/8 bg-l-tinta/[0.04] p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}

function Rotulo({ titulo, valor }: { titulo: string; valor: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-l-suave">{titulo}</span>
      <span className="text-3xl font-extrabold text-l-titulo sm:text-4xl">{valor}</span>
    </div>
  );
}

/** Barras da receita por dia: crescem uma depois da outra. */
function Barras() {
  const [ref, visivel] = useVisivel<HTMLDivElement>();
  const t = useTextos().relatorios;
  const maior = Math.max(...ENTREGAS_SEMANA);
  const entregas = ENTREGAS_SEMANA.reduce((soma, valor) => soma + valor, 0);

  return (
    <Cartao className="lg:col-span-2">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <Rotulo titulo={t.receitaSemana} valor={<Contador ate={RECEITA_TOTAL_SEMANA} prefixo="R$ " />} />
        <span className="pb-1 text-sm text-l-suave">
          <Contador ate={entregas} /> {t.entregas}
        </span>
      </div>
      <div ref={ref} className="flex h-56 items-end gap-2 sm:gap-4" role="img" aria-label={t.entregasPorDia}>
        {ENTREGAS_SEMANA.map((valor, indice) => (
          <div key={indice} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span
              style={{ transitionDelay: `${indice * 90 + 500}ms` }}
              className={`text-[11px] font-semibold text-l-texto ${TRANSICAO} ${visivel ? "opacity-100" : "opacity-0"}`}
            >
              {valor}
            </span>
            <div
              style={{ height: visivel ? `${(valor / maior) * 100}%` : "0%", transitionDelay: `${indice * 90}ms` }}
              className={`w-full max-w-12 rounded-t-lg ${
                valor === maior
                  ? "bg-[linear-gradient(180deg,var(--color-dourado-claro),var(--color-dourado))]"
                  : "bg-l-tinta/20"
              } ${TRANSICAO}`}
            />
            <span className="text-xs text-l-suave">{t.dias[indice]}</span>
          </div>
        ))}
      </div>
    </Cartao>
  );
}

/** Rosca das despesas: cada fatia se desenha em sequência. */
function Rosca() {
  const [ref, visivel] = useVisivel<HTMLDivElement>();
  const raio = 40;
  const volta = 2 * Math.PI * raio;
  const t = useTextos().relatorios;
  const total = CATEGORIAS_DESPESA.reduce((soma, item) => soma + item.valor, 0);
  // Onde cada fatia começa: soma das anteriores.
  const inicios = CATEGORIAS_DESPESA.map((_, i) =>
    CATEGORIAS_DESPESA.slice(0, i).reduce((soma, item) => soma + (item.valor / total) * volta, 0),
  );

  return (
    <Cartao>
      <Rotulo titulo={t.paraOnde} valor={<Contador ate={total} prefixo="R$ " />} />
      <div ref={ref} className="flex flex-col items-center gap-6 sm:flex-row">
        <svg viewBox="0 0 100 100" className="size-36 shrink-0 -rotate-90" role="img" aria-label={t.despesasPorCategoria}>
          <circle cx="50" cy="50" r={raio} fill="none" strokeWidth="14" className="stroke-l-tinta/8" />
          {CATEGORIAS_DESPESA.map(({ valor, cor }, indice) => {
            const fatia = (valor / total) * volta;
            const deslocamento = -inicios[indice];
            return (
              <circle
                key={cor}
                cx="50"
                cy="50"
                r={raio}
                fill="none"
                strokeWidth="14"
                stroke={cor}
                strokeDasharray={`${visivel ? Math.max(fatia - 1.5, 0) : 0} ${volta}`}
                strokeDashoffset={deslocamento}
                style={{ transitionDelay: `${indice * 250}ms` }}
                className={TRANSICAO}
              />
            );
          })}
        </svg>
        <ul className="flex w-full flex-col gap-2.5 text-sm">
          {CATEGORIAS_DESPESA.map(({ valor, cor }, indice) => (
            <li key={cor} className="flex items-center gap-2 text-l-texto">
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: cor }} />
              <span className="flex-1">{t.categorias[indice]}</span>
              <span className="font-semibold text-l-titulo tabular-nums">{Math.round((valor / total) * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Cartao>
  );
}

/** Linha do saldo do mês: o traço corre da esquerda para a direita e a área aparece depois. */
function Linha({ className = "" }: { className?: string }) {
  const t = useTextos().relatorios;
  const [ref, visivel] = useVisivel<HTMLDivElement>();
  const largura = 300;
  const altura = 120;
  const maior = Math.max(...SALDO_MES);
  const pontos = SALDO_MES.map((valor, indice) => [
    (indice / (SALDO_MES.length - 1)) * largura,
    altura - (valor / maior) * (altura - 12) - 4,
  ]);
  const traco = pontos.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  const area = `${traco}L${largura} ${altura}L0 ${altura}Z`;
  const [ultimoX, ultimoY] = pontos[pontos.length - 1];

  return (
    <Cartao className={className}>
      <Rotulo titulo={t.saldoMes} valor={<Contador ate={SALDO_MES[SALDO_MES.length - 1]} prefixo="R$ " />} />
      <div ref={ref}>
        <svg viewBox={`0 0 ${largura} ${altura}`} className="w-full overflow-visible" role="img" aria-label={t.saldoSubindo}>
          <defs>
            <linearGradient id="area-saldo" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4caf00" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#4caf00" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={area}
            fill="url(#area-saldo)"
            style={{ transitionDelay: "900ms" }}
            className={`${TRANSICAO} ${visivel ? "opacity-100" : "opacity-0"}`}
          />
          <path
            d={traco}
            fill="none"
            stroke="#4caf00"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={visivel ? 0 : 1}
            className="transition-[stroke-dashoffset] duration-[1800ms] ease-out motion-reduce:transition-none"
          />
          <circle
            cx={ultimoX}
            cy={ultimoY}
            r="4"
            fill="#4caf00"
            style={{ transitionDelay: "1700ms" }}
            className={`${TRANSICAO} ${visivel ? "opacity-100" : "opacity-0"}`}
          />
        </svg>
      </div>
    </Cartao>
  );
}

function Destaque() {
  const t = useTextos().relatorios;
  return (
    <Cartao className="justify-between border-dourado-claro/30">
      <span className="text-sm text-l-suave">{t.meta}</span>
      <span className="font-titulo text-6xl font-bold text-l-destaque sm:text-7xl">
        <Contador ate={92} sufixo="%" />
      </span>
      <span className="text-sm text-l-texto">
        {t.metaDetalhe(<Contador ate={644} />)}
      </span>
    </Cartao>
  );
}

/** Bento de gráficos animados (dados fictícios). */
export function Graficos() {
  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
      <Barras />
      <Destaque />
      <Rosca />
      <Linha className="lg:col-span-2" />
    </div>
  );
}
