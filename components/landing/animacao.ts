"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** true quando a pessoa pediu ao sistema menos movimento na tela. */
export function prefereMenosMovimento() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Vira true na primeira vez que o elemento entra na tela (e fica true). */
export function useVisivel<T extends Element>(margem = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { rootMargin: margem },
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, [margem]);

  return [ref, visivel] as const;
}

/**
 * Progresso de 0 a 1 da rolagem por dentro de uma seção alta (com conteúdo
 * "sticky"): 0 quando o topo dela chega ao topo da tela, 1 quando o fim dela
 * chega ao fim da tela. Chama `aoMudar` a cada quadro, sem re-renderizar o React,
 * para quem aplica o valor direto no estilo ou em atributos do SVG.
 */
export function useProgressoRolagem(ref: RefObject<HTMLElement | null>, aoMudar: (progresso: number) => void) {
  const callback = useRef(aoMudar);
  useEffect(() => {
    callback.current = aoMudar;
  });

  useEffect(() => {
    let quadro = 0;
    function medir() {
      quadro = 0;
      const elemento = ref.current;
      if (!elemento) return;
      const caixa = elemento.getBoundingClientRect();
      const percurso = Math.max(caixa.height - window.innerHeight, 1);
      callback.current(Math.min(Math.max(-caixa.top / percurso, 0), 1));
    }
    function agendar() {
      if (!quadro) quadro = requestAnimationFrame(medir);
    }
    medir();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [ref]);
}

/** Interpola de `a` até `b` quando `t` anda de `inicio` a `fim` (fora disso, fica nas pontas). */
export function trecho(t: number, inicio: number, fim: number) {
  return Math.min(Math.max((t - inicio) / (fim - inicio), 0), 1);
}

/** Desacelera no fim, como as transições da Apple. */
export function suave(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
