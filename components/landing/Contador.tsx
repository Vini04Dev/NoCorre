"use client";

import { useEffect, useState } from "react";
import { prefereMenosMovimento, suave, useVisivel } from "./animacao";

type Props = {
  ate: number;
  prefixo?: string;
  sufixo?: string;
  casas?: number;
  duracao?: number;
};

/** Número que sobe de 0 até o valor quando aparece na tela. */
export function Contador({ ate, prefixo = "", sufixo = "", casas = 0, duracao = 1600 }: Props) {
  const [ref, visivel] = useVisivel<HTMLSpanElement>();
  const [valor, setValor] = useState(0);

  useEffect(() => {
    if (!visivel) {
      // Saiu por baixo (rolou para cima): volta a zero para contar de novo.
      const quadro = requestAnimationFrame(() => setValor(0));
      return () => cancelAnimationFrame(quadro);
    }
    // Com menos movimento, o primeiro quadro já chega ao valor final.
    const tempo = prefereMenosMovimento() ? 0 : duracao;
    let quadro = 0;
    const inicio = performance.now();
    function passo(agora: number) {
      const t = tempo ? Math.min((agora - inicio) / tempo, 1) : 1;
      setValor(ate * suave(t));
      if (t < 1) quadro = requestAnimationFrame(passo);
    }
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [visivel, ate, duracao]);

  const texto = valor.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  return (
    <span ref={ref} className="tabular-nums">
      {prefixo}
      {texto}
      {sufixo}
    </span>
  );
}
