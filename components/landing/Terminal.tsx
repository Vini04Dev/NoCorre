"use client";

import { useEffect, useState } from "react";
import { prefereMenosMovimento, useVisivel } from "./animacao";

const LINHAS = [
  { comando: true, texto: "git clone https://github.com/Vini04Dev/NoCorre.git" },
  { comando: true, texto: "cd NoCorre && npm install" },
  { comando: true, texto: "npm run dev" },
  { comando: false, texto: "✓ Ready on http://localhost:3000" },
];

const TOTAL = LINHAS.reduce((soma, linha) => soma + linha.texto.length, 0);

/** Terminal que "digita" os comandos para rodar o projeto; apaga ao rolar de volta para cima. */
export function Terminal() {
  const [ref, visivel] = useVisivel<HTMLDivElement>();
  const [letras, setLetras] = useState(0);

  useEffect(() => {
    let quadro = 0;
    if (!visivel) {
      quadro = requestAnimationFrame(() => setLetras(0));
      return () => cancelAnimationFrame(quadro);
    }
    const inicio = performance.now();
    const velocidade = prefereMenosMovimento() ? Infinity : 0.04; // letras por ms
    function passo(agora: number) {
      const n = Math.min(Math.floor((agora - inicio) * velocidade), TOTAL);
      setLetras(n);
      if (n < TOTAL) quadro = requestAnimationFrame(passo);
    }
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [visivel]);

  // Quantas letras de cada linha já apareceram: o que sobra depois das linhas anteriores.
  const linhas = LINHAS.map((linha, indice) => {
    const antes = LINHAS.slice(0, indice).reduce((soma, anterior) => soma + anterior.texto.length, 0);
    return { ...linha, mostra: Math.min(Math.max(letras - antes, 0), linha.texto.length) };
  });
  const atual = linhas.findIndex((linha) => linha.mostra < linha.texto.length);

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-xl border border-white/10 bg-[#08090e] text-left shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
    >
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
        <span className="size-3 rounded-full bg-white/15" />
        <span className="size-3 rounded-full bg-white/15" />
        <span className="size-3 rounded-full bg-white/15" />
        <span className="ml-2 font-mono text-xs text-cinza">~/projetos</span>
      </div>
      <pre className="min-h-[170px] overflow-x-auto p-5 font-mono text-[12px] leading-7 sm:text-[13px]" aria-label="Comandos para rodar o projeto">
        {linhas.map((linha, indice) =>
          linha.mostra === 0 && indice !== atual ? null : (
            <div key={indice} className={linha.comando ? "text-cinza-claro" : "text-positivo"}>
              {linha.comando && <span className="text-dourado-claro">$ </span>}
              {linha.texto.slice(0, linha.mostra)}
              {indice === atual && <span className="ml-px inline-block h-4 w-2 animate-pulse bg-cinza-claro align-middle" />}
            </div>
          ),
        )}
      </pre>
    </div>
  );
}
