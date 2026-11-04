"use client";

import { useRef } from "react";
import { useProgressoRolagem } from "./animacao";

/**
 * Frase grande que "acende" palavra por palavra conforme a rolagem
 * (seção alta com o texto preso no meio da tela).
 */
export function Frase({ texto, destaque }: { texto: string; destaque: string[] }) {
  const secao = useRef<HTMLElement>(null);
  const palavras = texto.split(" ");
  const spans = useRef<(HTMLSpanElement | null)[]>([]);

  useProgressoRolagem(secao, (p) => {
    const acesas = p * 1.25 * palavras.length;
    spans.current.forEach((span, indice) => {
      if (span) span.style.opacity = String(Math.min(Math.max(acesas - indice, 0.15), 1));
    });
  });

  return (
    <section ref={secao} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-dvh items-center">
        <p className="mx-auto max-w-5xl px-5 text-4xl leading-[1.15] font-black tracking-tight text-white sm:px-8 sm:text-6xl lg:text-7xl">
          {palavras.map((palavra, indice) => (
            <span
              key={indice}
              ref={(elemento) => {
                spans.current[indice] = elemento;
              }}
              style={{ opacity: 0.15 }}
              className={`transition-opacity duration-200 motion-reduce:!opacity-100 ${
                destaque.includes(palavra) ? "text-dourado-claro" : ""
              }`}
            >
              {palavra}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
