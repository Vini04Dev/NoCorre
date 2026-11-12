import type { ReactNode } from "react";

/** Desenhos de linha dos avisos de tela cheia (traço na cor do texto). */
const DESENHOS = {
  // Placa de "sem saída": o endereço não leva a lugar nenhum.
  naoEncontrada: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM7.5 12h9",
  // Triângulo de atenção.
  erro: "M10.3 4.2 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0ZM12 9.5v4M12 17v.01",
} as const;

type Props = {
  desenho: keyof typeof DESENHOS;
  titulo: string;
  texto: string;
  /** Botões e links de saída, um embaixo do outro. */
  children: ReactNode;
};

/**
 * Aviso de tela cheia (página não encontrada, erro inesperado). Centralizado,
 * com um desenho, o que aconteceu em uma frase e sempre uma saída.
 */
export function TelaAviso({ desenho, titulo, texto, children }: Props) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[360px] flex-col items-center justify-center gap-5 px-6 py-10 text-center">
      <span aria-hidden className="grid size-16 place-items-center rounded-full bg-marinho text-dourado-claro">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d={DESENHOS[desenho]} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-extrabold">{titulo}</h1>
        <p className="text-[13px] text-cinza-escuro">{texto}</p>
      </div>
      <div className="flex w-full flex-col gap-2.5">{children}</div>
    </main>
  );
}
