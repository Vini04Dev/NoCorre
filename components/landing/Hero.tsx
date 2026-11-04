"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { suave, trecho, useProgressoRolagem } from "./animacao";
import { LogoAnimada } from "./LogoAnimada";
import { MockupCelular, TelaSaldo } from "./MockupCelular";

type Props = { logado: boolean };

/**
 * Abertura em tela cheia. Ao carregar, título e celular entram; ao rolar, o
 * título recua e o celular sobe e cresce, como nas páginas de produto da Apple.
 */
export function Hero({ logado }: Props) {
  const secao = useRef<HTMLElement>(null);
  const texto = useRef<HTMLDivElement>(null);
  const celular = useRef<HTMLDivElement>(null);
  const [entrou, setEntrou] = useState(false);
  const [telaAtiva, setTelaAtiva] = useState(false);

  useEffect(() => {
    const quadro = requestAnimationFrame(() => setEntrou(true));
    // Os números do celular só começam a subir quando ele já apareceu.
    const espera = setTimeout(() => setTelaAtiva(true), 1700);
    return () => {
      cancelAnimationFrame(quadro);
      clearTimeout(espera);
    };
  }, []);

  useProgressoRolagem(secao, (p) => {
    const t = suave(trecho(p, 0, 0.7));
    if (texto.current) {
      texto.current.style.opacity = String(1 - trecho(p, 0.05, 0.5));
      texto.current.style.transform = `translateY(${-t * 80}px) scale(${1 - t * 0.08})`;
    }
    if (celular.current) celular.current.style.transform = `translateY(${(1 - t) * 38}%) scale(${0.9 + t * 0.2})`;
  });

  const entrada = (atraso: number) => ({
    // As entradas esperam a logo se montar.
    style: { transitionDelay: `${atraso + 900}ms` },
    className: `transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
      entrou ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    }`,
  });

  return (
    <section ref={secao} className="relative h-[180vh]">
      <div className="sticky top-0 flex h-dvh flex-col items-center overflow-hidden pt-20 sm:pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute top-[35%] left-1/2 size-[700px] -translate-x-1/2 rounded-full bg-dourado/20 blur-[140px]"
        />
        <div ref={texto} className="relative z-10 flex flex-col items-center gap-5 px-5 text-center">
          <LogoAnimada montada={entrou} />
          <span {...entrada(0)}>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-cinza-claro">
              De entregador para entregador<span className="hidden sm:inline"> · São Sebastião do Paraíso</span>
            </span>
          </span>
          <h1
            {...entrada(120)}
            className={`${entrada(120).className} max-w-4xl text-5xl leading-[1.02] font-black tracking-tight text-white sm:text-7xl lg:text-8xl`}
          >
            Seu corre. <span className="bg-[linear-gradient(90deg,#ffd36a,#e0a92e)] bg-clip-text text-transparent">No controle.</span>
          </h1>
          <p {...entrada(240)} className={`${entrada(240).className} max-w-xl text-base text-cinza-claro sm:text-xl`}>
            Entregas, corridas, despesas e metas num app feito para quem vive em cima da moto.
          </p>
          <div {...entrada(360)} className={`${entrada(360).className} flex flex-col gap-3 sm:flex-row`}>
            <Link
              href={logado ? "/" : "/cadastrar"}
              className="rounded-full bg-[linear-gradient(90deg,var(--color-dourado-claro),var(--color-dourado))] px-7 py-3 text-sm font-extrabold text-marinho transition hover:brightness-105"
            >
              {logado ? "Abrir o app" : "Começar grátis"}
            </Link>
            <a href="#historia" className="rounded-full px-7 py-3 text-sm font-semibold text-dourado-claro transition hover:bg-white/5">
              Ver como funciona ›
            </a>
          </div>
        </div>
        <div ref={celular} className="relative mt-10 origin-top will-change-transform" style={{ transform: "translateY(38%) scale(0.9)" }}>
          <div {...entrada(500)}>
            <MockupCelular>
              <TelaSaldo ativa={telaAtiva} />
            </MockupCelular>
          </div>
        </div>
      </div>
    </section>
  );
}
