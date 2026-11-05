"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trecho } from "./animacao";
import { MockupCelular, TelaEntrar } from "./MockupCelular";

type Props = { logado: boolean };

/** Quanto o celular desce a cada pixel rolado: perto de 1, ele quase fica parado na tela. */
const AFUNDA = 0.8;

/**
 * Abertura. Título e celular entram ao carregar e o celular faz o login sozinho.
 * Ao rolar, o celular desce junto e some atrás da linha que fecha a seção; o
 * login recomeça se a pessoa volta ao topo.
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

  useEffect(() => {
    let quadro = 0;
    function medir() {
      quadro = 0;
      const caixa = secao.current?.getBoundingClientRect();
      if (!caixa || !celular.current) return;
      const rolado = Math.max(-caixa.top, 0);
      if (texto.current) {
        texto.current.style.opacity = String(1 - trecho(rolado, 60, 480));
        texto.current.style.transform = `translateY(${rolado * 0.3}px)`;
      }
      celular.current.style.transform = `translateY(${rolado * AFUNDA}px)`;
      // Toca enquanto mais da metade do celular está à vista (na tela estreita ele
      // nunca cabe inteiro junto com o texto).
      const tela = celular.current.getBoundingClientRect();
      const aVista = Math.min(tela.bottom, caixa.bottom, window.innerHeight) - Math.max(tela.top, 0);
      setTelaAtiva(aVista > tela.height * 0.55);
    }
    function agendar() {
      if (!quadro) quadro = requestAnimationFrame(medir);
    }
    // Espera o celular terminar de entrar antes de medir pela primeira vez.
    const espera = setTimeout(medir, 900);
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      clearTimeout(espera);
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, []);

  const entrada = (atraso: number, extra = "") => ({
    style: { transitionDelay: `${atraso}ms` },
    className: `transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
      entrou ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    } ${extra}`,
  });

  return (
    <section ref={secao} className="relative overflow-hidden border-b border-white/10">
      <div className="mx-auto grid min-h-dvh w-full max-w-6xl items-center gap-12 px-5 pt-28 pb-16 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:pt-20 lg:pb-0">
        <div
          ref={texto}
          className="relative z-10 flex flex-col items-center gap-5 text-center will-change-transform lg:items-start lg:text-left"
        >
          <span {...entrada(0, "text-sm font-medium text-cinza-claro")}>
            De entregador para entregador<span className="hidden sm:inline"> · São Sebastião do Paraíso</span>
          </span>
          <h1
            {...entrada(
              120,
              "max-w-3xl font-titulo text-5xl leading-[0.98] font-bold tracking-[-0.035em] text-white sm:text-7xl lg:text-[5.5rem]",
            )}
          >
            Seu corre. <span className="text-dourado-claro">No controle.</span>
          </h1>
          <p {...entrada(240, "max-w-xl text-base text-cinza-claro sm:text-xl")}>
            Entregas, corridas, despesas e metas num app feito para quem vive em cima da moto.
          </p>
          <div {...entrada(360, "flex flex-col gap-3 sm:flex-row")}>
            <Link
              href={logado ? "/" : "/cadastrar"}
              className="rounded-lg bg-dourado-claro px-6 py-3 text-sm font-bold text-marinho transition hover:bg-[#ffdd85]"
            >
              {logado ? "Abrir o app" : "Começar grátis"}
            </Link>
            <a
              href="#historia"
              className="rounded-lg px-6 py-3 text-sm font-semibold text-white underline-offset-4 transition hover:underline"
            >
              Ver como funciona ›
            </a>
          </div>
        </div>
        <div ref={celular} className="relative will-change-transform">
          <div {...entrada(500)}>
            <MockupCelular className="scale-90 sm:scale-100">
              <TelaEntrar ativa={telaAtiva} />
            </MockupCelular>
          </div>
        </div>
      </div>
    </section>
  );
}
