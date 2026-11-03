type ReceitaTotal = { valor_total: number | null; quantidade: number; status_pagamento: "pago" | "pendente" };
type DespesaTotal = { valor_total: number | null };

/**
 * Totais da Home e do Resumo.
 *
 * - Saldo considera só receitas pagas (regra 1): saldo = recebidos − despesas.
 * - Pendentes é o que falta receber e não entra no saldo.
 * - Entregas soma a quantidade de todas as receitas do período, pagas ou não:
 *   conta o trabalho feito, não o dinheiro que entrou.
 *
 * Soma em centavos para não acumular erro de ponto flutuante.
 */
export function calcularTotais(receitas: ReceitaTotal[], despesas: DespesaTotal[]) {
  const centavos = (valor: number | null) => Math.round((valor ?? 0) * 100);

  let recebidos = 0;
  let pendentes = 0;
  let entregas = 0;
  for (const receita of receitas) {
    if (receita.status_pagamento === "pago") recebidos += centavos(receita.valor_total);
    else pendentes += centavos(receita.valor_total);
    entregas += receita.quantidade;
  }
  const gastos = despesas.reduce((soma, despesa) => soma + centavos(despesa.valor_total), 0);

  return {
    saldo: (recebidos - gastos) / 100,
    recebidos: recebidos / 100,
    pendentes: pendentes / 100,
    despesas: gastos / 100,
    entregas,
  };
}
