/*
 * Renda dos Relatórios: o que entrou do corre e de fora dele (salário, bolsa,
 * benefício...), com as mesmas regras do saldo do Início. Funções puras, sem
 * dependências (os testes rodam direto no Node). Somas em centavos.
 *
 * Regra 1: do corre só conta receita paga; pendente não é renda ainda.
 */

const centavos = (valor: number | null) => Math.round((valor ?? 0) * 100);

type ReceitaRenda = { valor_total: number | null; status_pagamento: string };
type EntradaRenda = { tipo: string; valor: number };

export type Fonte = {
  nome: string;
  valor: number;
  /** Parte da renda total, de 0 a 100. */
  percentual: number;
  doCorre: boolean;
};

/**
 * De onde veio a renda do período: o corre numa linha só e cada tipo de outra
 * entrada (Salário, Bolsa...) na sua, da maior para a menor. Fonte zerada não
 * aparece.
 */
export function fontesDeRenda(receitas: ReceitaRenda[], entradas: EntradaRenda[]) {
  const corre = receitas.filter((r) => r.status_pagamento === "pago").reduce((soma, r) => soma + centavos(r.valor_total), 0);
  const porTipo = new Map<string, number>();
  for (const e of entradas) porTipo.set(e.tipo, (porTipo.get(e.tipo) ?? 0) + centavos(e.valor));
  const total = corre + [...porTipo.values()].reduce((a, b) => a + b, 0);
  const fontes = [
    ...(corre > 0 ? [{ nome: "Corre", valor: corre, doCorre: true }] : []),
    ...[...porTipo].filter(([, v]) => v > 0).map(([nome, valor]) => ({ nome, valor, doCorre: false })),
  ].sort((a, b) => b.valor - a.valor);
  return {
    total: total / 100,
    corre: corre / 100,
    foraDoCorre: (total - corre) / 100,
    fontes: fontes.map((f): Fonte => ({ ...f, valor: f.valor / 100, percentual: total ? Math.round((f.valor / total) * 100) : 0 })),
  };
}

const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export type Mes = {
  rotulo: string;
  /** Receita paga do corre. */
  corre: number;
  /** Outras entradas (salário, bolsa...). */
  outras: number;
  /** Todas as despesas, do corre e pessoais. */
  despesa: number;
  /** corre + outras - despesa: o mesmo saldo do Início naquele mês. */
  saldo: number;
};

/** Renda (do corre e de fora), despesas e saldo de cada mês a partir de `inicio`. */
export function porMes(
  dados: {
    receitas: (ReceitaRenda & { data_hora: string })[];
    despesas: { valor_total: number | null; data_hora: string }[];
    entradas: { valor: number; data_hora: string }[];
  },
  inicio: Date,
  meses: number,
): Mes[] {
  const indice = (dataHora: string) => {
    const data = new Date(dataHora);
    return (data.getFullYear() - inicio.getFullYear()) * 12 + data.getMonth() - inicio.getMonth();
  };
  const corre = new Array<number>(meses).fill(0);
  const outras = new Array<number>(meses).fill(0);
  const despesa = new Array<number>(meses).fill(0);
  const somar = (lista: number[], dataHora: string, valor: number) => {
    const i = indice(dataHora);
    if (i >= 0 && i < meses) lista[i] += valor;
  };
  for (const r of dados.receitas) if (r.status_pagamento === "pago") somar(corre, r.data_hora, centavos(r.valor_total));
  for (const e of dados.entradas) somar(outras, e.data_hora, centavos(e.valor));
  for (const d of dados.despesas) somar(despesa, d.data_hora, centavos(d.valor_total));
  return corre.map((valor, i) => {
    const mes = new Date(inicio.getFullYear(), inicio.getMonth() + i, 1);
    return {
      rotulo: MESES_CURTOS[mes.getMonth()],
      corre: valor / 100,
      outras: outras[i] / 100,
      despesa: despesa[i] / 100,
      saldo: (valor + outras[i] - despesa[i]) / 100,
    };
  });
}
