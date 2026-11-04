"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { suave, trecho, useProgressoRolagem } from "./animacao";
import { MockupCelular, TelaEntrar } from "./MockupCelular";

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
    return () => cancelAnimationFrame(quadro);
  }, []);

  useProgressoRolagem(secao, (p) => {
    const t = suave(trecho(p, 0, 0.7));
    if (texto.current) {
      texto.current.style.opacity = String(1 - trecho(p, 0.05, 0.5));
      texto.current.style.transform = `translateY(${-t * 80}px) scale(${1 - t * 0.08})`;
    }
    // O texto some mas continua ocupando espaço: o celular sobe para o lugar dele.
    const alturaTexto = texto.current?.offsetHeight ?? 0;
    if (celular.current) {
      celular.current.style.transform = `translateY(calc(${(1 - t) * 38}% - ${t * alturaTexto}px)) scale(${0.9 + t * 0.1})`;
    }
    // O login no celular toca quando ele sobe o bastante para o formulário aparecer,
    // e volta ao começo quando a pessoa rola de novo até o topo.
    setTelaAtiva(p > 0.3);
  });

  const entrada = (atraso: number) => ({
    style: { transitionDelay: `${atraso}ms` },
    className: `transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
      entrou ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    }`,
  });

  return (
    <section ref={secao} className="relative h-[180vh]">
      <div className="sticky top-0 flex h-dvh flex-col items-center overflow-hidden pt-28 sm:pt-32">
        <div ref={texto} className="relative z-10 flex flex-col items-center gap-5 px-5 text-center">
          <span {...entrada(0)}>
            <span className="font-mono text-[11px] tracking-[0.18em] text-cinza uppercase">
              De entregador para entregador<span className="hidden sm:inline"> · São Sebastião do Paraíso</span>
            </span>
          </span>
          <h1
            {...entrada(120)}
            className={`${entrada(120).className} max-w-4xl font-titulo text-5xl leading-[0.98] font-bold tracking-[-0.035em] text-white sm:text-7xl lg:text-8xl`}
          >
            Seu corre. <span className="text-dourado-claro">No controle.</span>
          </h1>
          <p {...entrada(240)} className={`${entrada(240).className} max-w-xl text-base text-cinza-claro sm:text-xl`}>
            Entregas, corridas, despesas e metas num app feito para quem vive em cima da moto.
          </p>
          <div {...entrada(360)} className={`${entrada(360).className} flex flex-col gap-3 sm:flex-row`}>
            <Link
              href={logado ? "/" : "/cadastrar"}
              className="rounded-lg bg-dourado-claro px-6 py-3 text-sm font-bold text-marinho transition hover:bg-[#ffdd85]"
            >
              {logado ? "Abrir o app" : "Começar grátis"}
            </Link>
            <a href="#historia" className="rounded-lg px-6 py-3 text-sm font-semibold text-white underline-offset-4 transition hover:underline">
              Ver como funciona ›
            </a>
          </div>
        </div>
        <div ref={celular} className="relative mt-10 origin-top will-change-transform" style={{ transform: "translateY(38%) scale(0.9)" }}>
          <div {...entrada(500)}>
            <MockupCelular>
              <TelaEntrar ativa={telaAtiva} />
            </MockupCelular>
          </div>
        </div>
      </div>
    </section>
  );
}
