"use client";

import { useEffect, useRef } from "react";
import { prefereMenosMovimento } from "./animacao";

/**
 * Fundo da landing, preso atrás do conteúdo: uma malha de pontos que anda mais
 * devagar que a página (dá profundidade) e uma luz dourada fraca que atravessa
 * a tela conforme a rolagem avança. Sem movimento se a pessoa pediu menos movimento.
 *
 * Um elemento com `data-luz-alvo` "puxa" a luz: quanto mais perto do meio da tela,
 * mais a luz vai para cima dele, e ele recebe `--aceso` (0 a 1) para acender junto.
 */
export function FundoAnimado() {
  const pontos = useRef<HTMLDivElement>(null);
  const luz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefereMenosMovimento()) {
      // Sem a luz andando, o card fica aceso direto.
      document.querySelector<HTMLElement>("[data-luz-alvo]")?.style.setProperty("--aceso", "1");
      return;
    }
    let quadro = 0;
    function mover() {
      quadro = 0;
      const y = window.scrollY;
      const total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const p = y / total;
      if (pontos.current) pontos.current.style.backgroundPosition = `0 ${-y * 0.12}px`;
      // Vai e volta de um lado ao outro, descendo junto com a página.
      let x = 50 + Math.sin(p * Math.PI * 3) * 35;
      let yLuz = 30 + p * 40;
      const alvo = document.querySelector<HTMLElement>("[data-luz-alvo]");
      if (alvo) {
        const caixa = alvo.getBoundingClientRect();
        const centroY = caixa.top + caixa.height / 2;
        // 1 com o card no meio da tela, 0 quando ele está a 60% da altura de distância.
        const perto = Math.max(1 - Math.abs(centroY - window.innerHeight / 2) / (window.innerHeight * 0.6), 0);
        const k = perto * perto * (3 - 2 * perto);
        x += ((caixa.left + caixa.width / 2) / window.innerWidth * 100 - x) * k;
        yLuz += (centroY / window.innerHeight * 100 - yLuz) * k;
        alvo.style.setProperty("--aceso", k.toFixed(3));
      }
      if (luz.current) {
        luz.current.style.background = `radial-gradient(600px circle at ${x}% ${yLuz}%, rgba(255, 211, 106, 0.07), transparent 70%)`;
      }
    }
    function agendar() {
      if (!quadro) quadro = requestAnimationFrame(mover);
    }
    mover();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div
        ref={pontos}
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div ref={luz} className="absolute inset-0" />
    </div>
  );
}
