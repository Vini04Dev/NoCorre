import type { Enums } from "@/types/database";

export type TipoCategoria = Enums<"tipo_categoria">;

/** Categoria das despesas que pagam uma conta das Metas; o app preenche sozinho. */
export const CATEGORIA_CONTAS = "Contas";

/**
 * Categorias sugeridas, iguais para todo mundo. Ficam no código e não no banco;
 * a tabela `categorias` guarda só as que cada pessoa cria.
 */
export const CATEGORIAS_PADRAO: Record<TipoCategoria, string[]> = {
  receita: ["Entrega", "Corrida", "Gorjeta"],
  // Diária é o que a central cobra do entregador por dia: despesa, não receita.
  despesa: ["Combustível", "Alimentação", "Peças", "EPI", "Diária da central", "Taxa da central", CATEGORIA_CONTAS],
};

export const ROTULO_TIPO_CATEGORIA: Record<TipoCategoria, string> = {
  receita: "Receita",
  despesa: "Despesa",
};
