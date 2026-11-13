type ReceitaTotal = { valor_total: number | null; quantidade: number; status_pagamento: "pago" | "pendente" };
/** `do_corre` ausente (antes da migration) conta como do corre, como sempre contou. */
type DespesaTotal = { valor_total: number | null; do_corre?: boolean };

/**
 * Totais da Home e do Resumo.
 *
 * - Saldo é o saldo do corre: receitas pagas (regra 1) menos as despesas do
 *   corre (combustível, peças, diária...). Gasto pessoal fica de fora e
 *   aparece à parte, para o Início responder "quanto o corre rendeu".
 * - Pendentes é o que falta receber e não entra no saldo.
 * - Entregas soma a quantidade de todas as receitas do período, pagas ou não:
 *   conta o trabalho feito, não o dinheiro que entrou.
 * - saldoGeral considera todas as despesas (visão do bolso inteiro).
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
  let doCorre = 0;
  let pessoais = 0;
  for (const despesa of despesas) {
    if (despesa.do_corre === false) pessoais += centavos(despesa.valor_total);
    else doCorre += centavos(despesa.valor_total);
  }

  return {
    saldo: (recebidos - doCorre) / 100,
    recebidos: recebidos / 100,
    pendentes: pendentes / 100,
    despesas: doCorre / 100,
    pessoais: pessoais / 100,
    saldoGeral: (recebidos - doCorre - pessoais) / 100,
    entregas,
  };
}
