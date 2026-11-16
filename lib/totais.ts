import { contaComoEntrega } from "./categorias-padrao";

type ReceitaTotal = { tipo: string; valor_total: number | null; quantidade: number; status_pagamento: "pago" | "pendente" };
/** `do_corre` ausente (antes da migration) conta como do corre, como sempre contou. */
type DespesaTotal = { valor_total: number | null; do_corre?: boolean };

type EntradaTotal = { valor: number };

/**
 * Totais da Home e do Resumo.
 *
 * - Saldo é o do bolso inteiro no período: tudo o que entrou (receitas pagas,
 *   regra 1, e outras entradas) menos tudo o que saiu (despesas do corre e
 *   pessoais). É o número que responde "quanto eu tenho" sem abrir filtro.
 * - Do corre ou pessoal é um detalhe da despesa, mostrado em linhas separadas;
 *   sobrouDoCorre (receitas pagas menos despesas do corre) diz quanto o
 *   trabalho rendeu, para quem trata a entrega como bico ou como renda única.
 * - Pendentes é o que falta receber e não entra no saldo.
 * - Entregas soma a quantidade das receitas do período, pagas ou não: conta o
 *   trabalho feito, não o dinheiro que entrou. O fixo do estabelecimento não
 *   é entrega e fica de fora.
 *
 * Soma em centavos para não acumular erro de ponto flutuante.
 */
export function calcularTotais(receitas: ReceitaTotal[], despesas: DespesaTotal[], entradas: EntradaTotal[] = []) {
  const centavos = (valor: number | null) => Math.round((valor ?? 0) * 100);

  let recebidos = 0;
  let pendentes = 0;
  let entregas = 0;
  for (const receita of receitas) {
    if (receita.status_pagamento === "pago") recebidos += centavos(receita.valor_total);
    else pendentes += centavos(receita.valor_total);
    if (contaComoEntrega(receita.tipo)) entregas += receita.quantidade;
  }
  let doCorre = 0;
  let pessoais = 0;
  for (const despesa of despesas) {
    if (despesa.do_corre === false) pessoais += centavos(despesa.valor_total);
    else doCorre += centavos(despesa.valor_total);
  }
  const outras = entradas.reduce((soma, entrada) => soma + centavos(entrada.valor), 0);

  return {
    saldo: (recebidos + outras - doCorre - pessoais) / 100,
    recebidos: recebidos / 100,
    pendentes: pendentes / 100,
    entradas: outras / 100,
    despesas: (doCorre + pessoais) / 100,
    despesasCorre: doCorre / 100,
    despesasPessoais: pessoais / 100,
    sobrouDoCorre: (recebidos - doCorre) / 100,
    entregas,
  };
}
