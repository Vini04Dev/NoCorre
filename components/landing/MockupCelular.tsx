"use client";

import { useEffect, useState } from "react";
import { prefereMenosMovimento, suave } from "./animacao";

/**
 * Celular desenhado em HTML. As telas imitam o app com valores de exemplo e se
 * animam por dentro toda vez que ficam ativas (`ativa`); nada busca dados reais.
 */

export function MockupCelular({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto w-[260px] text-marinho sm:w-[290px] ${className}`}>
      <div className="rounded-[46px] bg-[linear-gradient(145deg,#4a4d63,#1b1c29)] p-[9px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/15">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[38px] bg-fundo">
          <div className="absolute top-2.5 left-1/2 z-10 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
          {children}
        </div>
      </div>
    </div>
  );
}

type PropsTela = { ativa: boolean };

/** Progresso de 0 a 1 que recomeça toda vez que a tela fica ativa. */
function useProgresso(ativa: boolean, duracao = 1400, atraso = 250) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let quadro = 0;
    if (!ativa) {
      quadro = requestAnimationFrame(() => setT(0));
      return () => cancelAnimationFrame(quadro);
    }
    const tempo = prefereMenosMovimento() ? 0 : duracao;
    const inicio = performance.now() + (tempo ? atraso : 0);
    function passo(agora: number) {
      const bruto = tempo ? Math.min(Math.max((agora - inicio) / tempo, 0), 1) : 1;
      setT(bruto);
      if (bruto < 1) quadro = requestAnimationFrame(passo);
    }
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [ativa, duracao, atraso]);
  return t;
}

const moeda = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Classes para itens que entram um depois do outro quando a tela fica ativa. */
function entrada(ativa: boolean, indice: number) {
  return {
    style: { transitionDelay: ativa ? `${150 + indice * 90}ms` : "0ms" },
    className: `transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
      ativa ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
    }`,
  };
}

function Topo({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
  return (
    <div className="bg-[linear-gradient(180deg,#9196a2_0%,#2b2d42_100%)] px-4 pt-11 pb-4 text-white">
      <p className="text-[13px] font-black">{titulo}</p>
      {subtitulo && <p className="text-[10px] text-cinza-claro">{subtitulo}</p>}
    </div>
  );
}

const LINHAS = [
  { rotulo: "SALDO", valor: 667.5, cor: "text-positivo" },
  { rotulo: "RECEBIDOS", valor: 880, cor: "text-recebido" },
  { rotulo: "PENDENTES", valor: 64, cor: "text-pendente" },
  { rotulo: "DESPESAS", valor: 212.5, cor: "text-negativo" },
  { rotulo: "ENTREGAS", valor: 109, cor: "text-positivo", inteiro: true },
];

export function TelaSaldo({ ativa }: PropsTela) {
  const t = suave(useProgresso(ativa, 1500, 500));
  return (
    <>
      <Topo titulo="SEJA BEM VINDO LUCAS! 🚀" subtitulo="Bora pro corre!?" />
      <div className="flex flex-col gap-2 px-3.5 py-3.5">
        <p className="text-[8px] font-semibold tracking-[0.5px] text-cinza">MEU SALDO</p>
        <div className="rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-semibold shadow-cartao">Esta semana</div>
        {LINHAS.map(({ rotulo, valor, cor, inteiro }, indice) => (
          <div
            key={rotulo}
            {...entrada(ativa, indice)}
            className={`flex items-center justify-between rounded-lg border border-black/5 bg-white px-2.5 py-2 shadow-cartao ${entrada(ativa, indice).className}`}
          >
            <span className="text-[10px] font-extrabold">{rotulo}:</span>
            <span className={`text-[11px] font-extrabold tabular-nums ${cor}`}>
              {inteiro ? Math.round(valor * t) : moeda(valor * t)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export function TelaLancamento({ ativa }: PropsTela) {
  // Linha do tempo: escolhe o tipo, digita a quantidade, o total sobe e o botão é tocado.
  const t = useProgresso(ativa, 2600, 300);
  const tipoEscolhido = t > 0.12;
  const quantidade = t < 0.3 ? "" : t < 0.38 ? "1" : "12";
  const total = quantidade === "12" ? 96 * suave(Math.min((t - 0.38) / 0.3, 1)) : quantidade === "1" ? 8 : 0;
  const tocou = t > 0.85 && t < 0.95;

  return (
    <>
      <Topo titulo="Nova receita" />
      <div className="flex flex-col gap-2.5 px-3.5 py-3.5 text-[10px]">
        <span className="font-semibold">Tipo</span>
        <div className="flex flex-wrap gap-1.5">
          {["Entrega", "Corrida", "Gorjeta"].map((tipo, i) => (
            <span
              key={tipo}
              className={`rounded-full border px-2.5 py-1 transition-colors duration-300 ${
                i === 0 && tipoEscolhido ? "border-marinho bg-marinho text-white" : "border-cinza-claro bg-white"
              }`}
            >
              {tipo}
            </span>
          ))}
        </div>
        <span className="font-semibold">Cliente</span>
        <div className="rounded-lg border border-cinza-claro bg-white px-2.5 py-2">Pizzaria Bella Massa</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Quantidade</span>
            <div
              className={`h-[30px] rounded-lg border bg-white px-2.5 py-2 transition-colors ${
                t > 0.25 && t < 0.5 ? "border-dourado" : "border-cinza-claro"
              }`}
            >
              {quantidade}
              {t > 0.25 && t < 0.5 && <span className="ml-px inline-block h-3 w-px animate-pulse bg-marinho align-middle" />}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Valor</span>
            <div className="rounded-lg border border-cinza-claro bg-white px-2.5 py-2">R$ 8,00</div>
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between rounded-lg bg-positivo/12 px-2.5 py-2.5">
          <span className="font-semibold">Total</span>
          <span className="text-[13px] font-extrabold text-recebido tabular-nums">{moeda(total)}</span>
        </div>
        <div
          className={`mt-2 rounded-lg bg-[linear-gradient(90deg,var(--color-dourado-claro),var(--color-dourado))] py-2.5 text-center font-extrabold transition-transform duration-150 ${
            tocou ? "scale-95" : "scale-100"
          }`}
        >
          {t >= 0.95 ? "Salvo! ✓" : "Salvar receita"}
        </div>
      </div>
    </>
  );
}

export function TelaMeta({ ativa }: PropsTela) {
  const t = suave(useProgresso(ativa, 1600, 300));
  const volta = 2 * Math.PI * 38;
  const percentual = 73 * t;
  return (
    <>
      <Topo titulo="Metas" />
      <div className="flex flex-col items-center gap-3 px-3.5 py-5">
        <div className="relative grid size-32 place-items-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
            <circle cx="50" cy="50" r="38" fill="none" strokeWidth="10" className="stroke-cinza-fundo" />
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(percentual / 100) * volta} ${volta}`}
              className="stroke-positivo"
            />
          </svg>
          <span className="text-2xl font-black text-recebido tabular-nums">{Math.round(percentual)}%</span>
        </div>
        <p className="text-[12px] font-bold">Meta da semana</p>
        <p className="text-[10px] text-cinza-escuro tabular-nums">
          {moeda(880 * t)} de R$ 1.200,00
        </p>
        <div {...entrada(ativa, 6)} className={`w-full rounded-lg bg-white px-3 py-2.5 text-center text-[10px] shadow-cartao ${entrada(ativa, 6).className}`}>
          Faltam <b>R$ 320</b> em 2 dias
        </div>
        <div
          {...entrada(ativa, 8)}
          className={`flex w-full items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-[10px] shadow-cartao ${entrada(ativa, 8).className}`}
        >
          <span className="size-2 rounded-full bg-dourado" />
          <span className="flex-1">450 entregas no mês</span>
          <b className="tabular-nums">{Math.round(92 * t)}%</b>
        </div>
      </div>
    </>
  );
}

export function TelaConta({ ativa }: PropsTela) {
  const t = suave(useProgresso(ativa, 1400, 400));
  return (
    <>
      <Topo titulo="Conta a pagar" subtitulo="Financiamento da moto · 8 de 24" />
      <div className="flex flex-col gap-2.5 px-3.5 py-3.5 text-[10px]">
        <div className="flex flex-col gap-2 rounded-lg bg-white p-3 shadow-cartao">
          <div className="flex justify-between">
            <span className="font-semibold tabular-nums">Pago {moeda(232 * t)} de R$ 386</span>
            <b className="text-pendente tabular-nums">{Math.round(60 * t)}%</b>
          </div>
          <span className="h-2 overflow-hidden rounded-full bg-cinza-fundo">
            <span className="block h-full rounded-full bg-dourado" style={{ width: `${60 * t}%` }} />
          </span>
          <span className="text-cinza-escuro">Falta R$ 154 · vence em 6 dias</span>
        </div>
        <p className="mt-1 text-[8px] font-semibold tracking-[0.5px] text-cinza">PAGAMENTOS</p>
        {[
          ["12/11", "R$ 132,00"],
          ["05/11", "R$ 100,00"],
        ].map(([data, valor], indice) => (
          <div
            key={data}
            {...entrada(ativa, indice + 3)}
            className={`flex justify-between rounded-lg bg-white px-3 py-2.5 shadow-cartao ${entrada(ativa, indice + 3).className}`}
          >
            <span>{data} · Pix</span>
            <b className="text-negativo">{valor}</b>
          </div>
        ))}
        <div {...entrada(ativa, 6)} className={`mt-2 rounded-lg bg-marinho py-2.5 text-center font-bold text-white ${entrada(ativa, 6).className}`}>
          Lançar pagamento
        </div>
      </div>
    </>
  );
}
