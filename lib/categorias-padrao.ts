import type { Enums } from "@/types/database";

export type TipoCategoria = Enums<"tipo_categoria">;

/**
 * Categorias sugeridas, iguais para todo mundo. Ficam no código e não no banco;
 * a tabela `categorias` guarda só as que cada pessoa cria.
 */
export const CATEGORIAS_PADRAO: Record<TipoCategoria, string[]> = {
  receita: ["Entrega", "Corrida", "Diária", "Gorjeta"],
  despesa: ["Combustível", "Alimentação", "Peças", "EPI", "Taxa da central"],
};

export const ROTULO_TIPO_CATEGORIA: Record<TipoCategoria, string> = {
  receita: "Receita",
  despesa: "Despesa",
};
