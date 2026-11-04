"use client";

import { useVisivel } from "./animacao";

const ESCONDIDO = {
  subir: "translate-y-10 opacity-0",
  zoom: "scale-95 opacity-0",
  esquerda: "-translate-x-10 opacity-0",
  direita: "translate-x-10 opacity-0",
} as const;

type Props = {
  children: React.ReactNode;
  como?: keyof typeof ESCONDIDO;
  /** Em milissegundos, para escalonar itens de uma lista. */
  atraso?: number;
  /** Duração da entrada, em milissegundos. */
  duracao?: number;
  className?: string;
};

/** Aparece suavemente quando entra na tela. Quem prefere menos movimento vê tudo direto. */
export function Revelar({ children, como = "subir", atraso = 0, duracao = 900, className = "" }: Props) {
  const [ref, visivel] = useVisivel<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${atraso}ms`, transitionDuration: `${duracao}ms` }}
      className={`transition-[opacity,transform] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none ${
        visivel ? "translate-x-0 translate-y-0 scale-100 opacity-100" : ESCONDIDO[como]
      } ${className}`}
    >
      {children}
    </div>
  );
}
