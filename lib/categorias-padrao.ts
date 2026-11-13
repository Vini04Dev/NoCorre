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
  despesa: ["Combustível", "Alimentação", "Peças", "EPI", "Diária da central", "Mercado", CATEGORIA_CONTAS],
};

/**
 * Categorias padrão que são custo do trabalho: entram no saldo do corre.
 * Alimentação conta como do corre (o lanche do turno); a compra do mês vai em
 * Mercado, que é pessoal. Cada despesa ainda pode trocar no formulário.
 */
const DO_CORRE = new Set(["Combustível", "Alimentação", "Peças", "EPI", "Diária da central"]);

/**
 * Padrão de "do corre" para uma categoria de despesa: as padrão pelo conjunto
 * acima; as criadas pela pessoa pelo que ela marcou; texto livre novo, pessoal.
 */
export function doCorrePadrao(tipo: string, criadas: { nome: string; tipo: TipoCategoria; do_corre?: boolean }[] = []) {
  const nome = tipo.trim();
  if (DO_CORRE.has(nome)) return true;
  const criada = criadas.find((c) => c.tipo === "despesa" && c.nome.toLowerCase() === nome.toLowerCase());
  return criada?.do_corre ?? false;
}

export const ROTULO_TIPO_CATEGORIA: Record<TipoCategoria, string> = {
  receita: "Receita",
  despesa: "Despesa",
};
