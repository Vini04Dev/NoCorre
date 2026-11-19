"use client";

import { useRef, useState } from "react";

const MINIMO = 50; // px na horizontal para contar como troca

/**
 * Arrastar para os lados num calendário: para a esquerda vai para o próximo
 * (mês ou semana), para a direita volta. A rolagem vertical continua com o
 * navegador (touch-action: pan-y). Enquanto arrasta, o conteúdo acompanha o
 * dedo um pouco, para a pessoa perceber que dá para passar.
 *
 * Devolve os eventos e o estilo para espalhar no elemento. Logo depois de uma
 * troca, o clique que termina o gesto é engolido, para não abrir o dia que
 * estava embaixo do dedo.
 */
export function useArrastarLados(aoPassar: (passo: 1 | -1) => void) {
  const inicio = useRef<{ x: number; y: number; id: number } | null>(null);
  const horizontal = useRef(false);
  const arrastou = useRef(false);
  const [deslocamento, setDeslocamento] = useState(0);

  function terminar(x: number | null) {
    const comeco = inicio.current;
    inicio.current = null;
    setDeslocamento(0);
    if (!comeco || x === null || !horizontal.current) return;
    const dx = x - comeco.x;
    if (Math.abs(dx) < MINIMO) return;
    arrastou.current = true;
    // Libera o próximo toque depois que o clique deste gesto já passou.
    setTimeout(() => (arrastou.current = false), 350);
    aoPassar(dx < 0 ? 1 : -1);
  }

  const eventos = {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      inicio.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
      horizontal.current = false;
    },
    onPointerMove: (e: React.PointerEvent) => {
      const comeco = inicio.current;
      if (!comeco || comeco.id !== e.pointerId) return;
      const dx = e.clientX - comeco.x;
      const dy = e.clientY - comeco.y;
      if (!horizontal.current) {
        // Decide a direção no começo: mais de lado que para baixo é troca de mês.
        if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) horizontal.current = true;
        else if (Math.abs(dy) > 10) {
          inicio.current = null;
          return;
        }
      }
      if (horizontal.current) setDeslocamento(Math.max(-60, Math.min(60, dx / 3)));
    },
    onPointerUp: (e: React.PointerEvent) => terminar(e.clientX),
    onPointerCancel: () => terminar(null),
    onClickCapture: (e: React.MouseEvent) => {
      if (arrastou.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    style: { touchAction: "pan-y" as const, transform: deslocamento ? `translateX(${deslocamento}px)` : undefined },
  };

  return eventos;
}
