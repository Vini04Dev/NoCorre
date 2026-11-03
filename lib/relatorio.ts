import type { Despesa, Receita } from "@/hooks/useMovimentacoes";

/*
 * Cálculos da tela de Relatórios. Funções puras: recebem as listas já buscadas
 * e devolvem o que cada bloco desenha. Valores em reais, somados em centavos.
 *
 * Regra 1: dinheiro (barras, rosca de receitas, horário rentável) usa só receitas
 * pagas. Contagem de trabalho (ranking de clientes) usa todas, como na Home.
 */

const centavos = (valor: number | null) => Math.round((valor ?? 0) * 100);
const pagas = (receitas: Receita[]) => receitas.filter((r) => r.status_pagamento === "pago");

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export type Barra = { rotulo: string; descricao: string; valor: number };

/**
 * Receita paga por dia do intervalo. Num intervalo de um dia só, divide por
 * faixas de 3 horas, que é o que dá para comparar dentro de um dia.
 */
export function receitaPorDia(receitas: Receita[], inicio: Date, fim: Date): Barra[] {
  const dias = Math.round((fim.getTime() - inicio.getTime()) / 86_400_000);

  if (dias <= 1) {
    const faixas = Array.from({ length: 8 }, (_, i) => ({
      rotulo: `${i * 3}h`,
      descricao: `${i * 3}h às ${i * 3 + 3}h`,
      soma: 0,
    }));
    for (const r of pagas(receitas)) {
      faixas[Math.floor(new Date(r.data_hora).getHours() / 3)].soma += centavos(r.valor_total);
    }
    return faixas.map(({ rotulo, descricao, soma }) => ({ rotulo, descricao, valor: soma / 100 }));
  }

  const somas = new Array<number>(dias).fill(0);
  for (const r of pagas(receitas)) {
    const data = new Date(r.data_hora);
    const dia = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    const indice = Math.round((dia.getTime() - inicio.getTime()) / 86_400_000);
    if (indice >= 0 && indice < dias) somas[indice] += centavos(r.valor_total);
  }
  return somas.map((soma, indice) => {
    const data = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + indice);
    const dataCurta = `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}`;
    return {
      // Até uma semana cabe o nome do dia; acima disso, só o número.
      rotulo: dias <= 7 ? DIAS_SEMANA[data.getDay()] : String(data.getDate()),
      descricao: `${DIAS_SEMANA[data.getDay()]}, ${dataCurta}`,
      valor: soma / 100,
    };
  });
}

export type Fatia = { nome: string; valor: number; percentual: number };

/** Até 3 categorias maiores e o resto somado em "Outras", para a rosca não virar arco-íris. */
export function porCategoria(itens: { tipo: string; valor_total: number | null }[]) {
  const somas = new Map<string, number>();
  for (const item of itens) somas.set(item.tipo, (somas.get(item.tipo) ?? 0) + centavos(item.valor_total));

  const ordenadas = [...somas].sort((a, b) => b[1] - a[1]);
  const total = ordenadas.reduce((soma, [, valor]) => soma + valor, 0);
  const principais = ordenadas.length > 4 ? ordenadas.slice(0, 3) : ordenadas;
  const resto = ordenadas.slice(principais.length).reduce((soma, [, valor]) => soma + valor, 0);
  const fatias = resto > 0 ? [...principais, ["Outras", resto] as [string, number]] : principais;

  return {
    total: total / 100,
    fatias: fatias.map(([nome, valor]): Fatia => ({
      nome,
      valor: valor / 100,
      percentual: total ? Math.round((valor / total) * 100) : 0,
    })),
  };
}

export type PosicaoCliente = { nome: string; quantidade: number; percentual: number };

/** Clientes com mais lançamentos de receita (soma da quantidade), do maior para o menor. */
export function rankingClientes(receitas: Receita[], limite = 5) {
  const somas = new Map<string, number>();
  for (const r of receitas) {
    const nome = r.clientes?.nome ?? "Sem cliente";
    somas.set(nome, (somas.get(nome) ?? 0) + r.quantidade);
  }
  const total = [...somas.values()].reduce((a, b) => a + b, 0);
  const posicoes = [...somas]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limite)
    .map(([nome, quantidade]): PosicaoCliente => ({
      nome,
      quantidade,
      percentual: total ? Math.round((quantidade / total) * 100) : 0,
    }));
  return { total, posicoes };
}

export type Aviso = { icone: "alta" | "horario" | "pendente"; titulo: string; detalhe: string };

const DIAS_PENDENTE_PARA_AVISAR = 3;
const AUMENTO_MINIMO_PARA_AVISAR = 10; // %

/**
 * Avisos automáticos ("Atenção na operação"):
 * - categoria de despesa que subiu em relação ao período anterior de mesmo tamanho;
 * - faixa de 3 horas que mais rendeu receita paga;
 * - receita pendente há vários dias, a mais antiga de cada cliente.
 */
export function gerarAvisos(
  atual: { receitas: Receita[]; despesas: Despesa[] },
  anterior: { despesas: Despesa[] },
  pendentes: Receita[],
  agora = new Date(),
): Aviso[] {
  const avisos: Aviso[] = [];
  const moeda = (valor: number) =>
    (valor / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // 1. Maior alta de despesa por categoria.
  const somar = (despesas: Despesa[]) => {
    const somas = new Map<string, number>();
    for (const d of despesas) somas.set(d.tipo, (somas.get(d.tipo) ?? 0) + centavos(d.valor_total));
    return somas;
  };
  const somasAnteriores = somar(anterior.despesas);
  let maiorAlta: { tipo: string; valor: number; aumento: number } | null = null;
  for (const [tipo, valor] of somar(atual.despesas)) {
    const antes = somasAnteriores.get(tipo);
    if (!antes) continue;
    const aumento = Math.round(((valor - antes) / antes) * 100);
    if (aumento >= AUMENTO_MINIMO_PARA_AVISAR && (!maiorAlta || aumento > maiorAlta.aumento)) {
      maiorAlta = { tipo, valor, aumento };
    }
  }
  if (maiorAlta) {
    avisos.push({
      icone: "alta",
      titulo: `${maiorAlta.tipo} ${maiorAlta.aumento}% acima do período anterior`,
      detalhe: `${moeda(maiorAlta.valor)} gastos com ${maiorAlta.tipo.toLowerCase()} neste período.`,
    });
  }

  // 2. Faixa de horário mais rentável.
  const faixas = new Array<number>(8).fill(0);
  for (const r of pagas(atual.receitas)) {
    faixas[Math.floor(new Date(r.data_hora).getHours() / 3)] += centavos(r.valor_total);
  }
  const totalPago = faixas.reduce((a, b) => a + b, 0);
  if (totalPago > 0) {
    const melhor = faixas.indexOf(Math.max(...faixas));
    avisos.push({
      icone: "horario",
      titulo: `Horário mais rentável: ${melhor * 3}h às ${melhor * 3 + 3}h`,
      detalhe: `${Math.round((faixas[melhor] / totalPago) * 100)}% da sua receita do período saiu desse horário.`,
    });
  }

  // 3. Pendências antigas, uma por cliente, das mais antigas para as mais novas.
  const porCliente = new Map<string, { valor: number; desde: Date }>();
  for (const r of pendentes) {
    const nome = r.clientes?.nome ?? "Sem cliente";
    const data = new Date(r.data_hora);
    const atualCliente = porCliente.get(nome);
    porCliente.set(nome, {
      valor: (atualCliente?.valor ?? 0) + centavos(r.valor_total),
      desde: atualCliente && atualCliente.desde < data ? atualCliente.desde : data,
    });
  }
  const antigas = [...porCliente]
    .map(([nome, { valor, desde }]) => ({ nome, valor, dias: Math.floor((agora.getTime() - desde.getTime()) / 86_400_000) }))
    .filter(({ dias }) => dias >= DIAS_PENDENTE_PARA_AVISAR)
    .sort((a, b) => b.dias - a.dias)
    .slice(0, 2);
  for (const { nome, valor, dias } of antigas) {
    avisos.push({
      icone: "pendente",
      titulo: `${nome}: ${moeda(valor)} pendente há ${dias} dias`,
      detalhe: "Cobre o repasse para não acumular.",
    });
  }

  return avisos;
}
