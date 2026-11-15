import type { Despesa, Entrada, Movimentacao, Receita } from "@/hooks/useMovimentacoes";
import type { Enums } from "@/types/database";

export type FiltroRapido = "todos" | "receitas" | "despesas" | "pendentes";

/** Filtros do painel do Resumo. Lista vazia ou cliente vazio = sem filtro. */
export type Filtros = {
  categorias: string[];
  clienteId: string;
  formas: Enums<"forma_pagamento">[];
  situacoes: Enums<"status_pagamento">[];
};

export const FILTROS_VAZIOS: Filtros = { categorias: [], clienteId: "", formas: [], situacoes: [] };

export function quantidadeFiltrosAtivos(filtros: Filtros) {
  return (
    filtros.categorias.length + (filtros.clienteId ? 1 : 0) + filtros.formas.length + filtros.situacoes.length
  );
}

function receitaPassa(receita: Receita, filtros: Filtros) {
  if (filtros.categorias.length && !filtros.categorias.includes(receita.tipo)) return false;
  if (filtros.clienteId && receita.cliente_id !== filtros.clienteId) return false;
  if (filtros.formas.length && !(receita.forma_pagamento && filtros.formas.includes(receita.forma_pagamento))) {
    return false;
  }
  if (filtros.situacoes.length && !filtros.situacoes.includes(receita.status_pagamento)) return false;
  return true;
}

function despesaPassa(despesa: Despesa, filtros: Filtros) {
  // Despesa não tem cliente, forma de pagamento nem situação: esses filtros a escondem.
  if (filtros.clienteId || filtros.formas.length || filtros.situacoes.length) return false;
  return !filtros.categorias.length || filtros.categorias.includes(despesa.tipo);
}

/** Junta receitas e despesas numa lista só, filtrada e ordenada da mais recente para a mais antiga. */
export function montarExtrato(
  receitas: Receita[],
  despesas: Despesa[],
  rapido: Exclude<FiltroRapido, "pendentes">,
  filtros: Filtros,
  entradas: Entrada[] = [],
): Movimentacao[] {
  // Entradas fora do corre só aparecem em "Todos" e sem filtro: não têm cliente, categoria nem situação.
  const semFiltro = quantidadeFiltrosAtivos(filtros) === 0;
  const lista: Movimentacao[] = [
    ...(rapido === "todos" && semFiltro ? entradas.map((dados) => ({ tipo: "entrada" as const, dados })) : []),
    ...(rapido === "despesas" ? [] : receitas.filter((r) => receitaPassa(r, filtros)).map((dados) => ({ tipo: "receita" as const, dados }))),
    ...(rapido === "receitas" ? [] : despesas.filter((d) => despesaPassa(d, filtros)).map((dados) => ({ tipo: "despesa" as const, dados }))),
  ];
  return lista.sort((a, b) => b.dados.data_hora.localeCompare(a.dados.data_hora));
}
