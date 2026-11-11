import type { Enums } from "@/types/database";

/** Cor de um evento da Agenda ou de uma carteira (enum cor_evento, paleta fixa de 6 cores). */
export type CorEvento = Enums<"cor_evento">;

/** As 6 cores na ordem do Figma, com o tom forte (barra, ponto) e o fundo claro. */
export const CORES_EVENTO: { valor: CorEvento; rotulo: string; forte: string; fundo: string }[] = [
  { valor: "amarelo", rotulo: "Amarelo", forte: "#e0a92e", fundo: "#faf0d7" },
  { valor: "verde", rotulo: "Verde", forte: "#4caf00", fundo: "#e3f3d6" },
  { valor: "vermelho", rotulo: "Vermelho", forte: "#cc0000", fundo: "#f8dada" },
  { valor: "azul", rotulo: "Azul", forte: "#3b82f6", fundo: "#dde8fb" },
  { valor: "roxo", rotulo: "Roxo", forte: "#8b5cf6", fundo: "#ebe3fc" },
  { valor: "cinza", rotulo: "Cinza", forte: "#9196a2", fundo: "#ebecef" },
];

export function corDoEvento(cor: CorEvento) {
  return CORES_EVENTO.find((item) => item.valor === cor) ?? CORES_EVENTO[0];
}
