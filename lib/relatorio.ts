import { contaComoEntrega } from "./categorias-padrao";
import type { Despesa, Receita } from "@/hooks/useMovimentacoes";

/*
 * Cálculos do corre na tela de Relatórios (a renda total e o mês a mês ficam em
 * lib/renda.ts). Funções puras: recebem as listas já buscadas e devolvem o que
 * cada bloco desenha. Valores em reais, somados em centavos.
 *
 * Regra 1: dinheiro (barras, mapa do corre) usa só receitas pagas. Contagem de
 * trabalho (ranking de clientes, entregas) usa todas, como no Início.
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

export type CriterioRanking = "entregas" | "valor";

export type PosicaoCliente = {
  id: string;
  nome: string;
  /** Entregas (soma da quantidade; o fixo do estabelecimento não conta). */
  quantidade: number;
  /** Receita paga no período, em reais. */
  valor: number;
  /** Receita pendente no período, em reais. */
  aReceber: number;
  /** Parte do total pelo critério escolhido. */
  percentual: number;
};

/**
 * Clientes do período com entregas e valor lado a lado, do maior para o menor
 * pelo critério escolhido (entregas ou receita paga). Por valor, entra também
 * quem só pagou fixo, sem entrega.
 */
export function rankingClientes(receitas: Receita[], criterio: CriterioRanking = "entregas", limite = 5) {
  const porCliente = new Map<string, { nome: string; quantidade: number; pago: number; pendente: number }>();
  for (const r of receitas) {
    const atual = porCliente.get(r.cliente_id) ?? { nome: r.clientes?.nome ?? "Sem cliente", quantidade: 0, pago: 0, pendente: 0 };
    if (contaComoEntrega(r.tipo)) atual.quantidade += r.quantidade;
    if (r.status_pagamento === "pago") atual.pago += centavos(r.valor_total);
    else atual.pendente += centavos(r.valor_total);
    porCliente.set(r.cliente_id, atual);
  }
  const medida = (c: { quantidade: number; pago: number }) => (criterio === "valor" ? c.pago : c.quantidade);
  const lista = [...porCliente].filter(([, c]) => medida(c) > 0);
  const total = lista.reduce((soma, [, c]) => soma + medida(c), 0);
  const posicoes = lista
    .sort((a, b) => medida(b[1]) - medida(a[1]))
    .slice(0, limite)
    .map(([id, c]): PosicaoCliente => ({
      id,
      nome: c.nome,
      quantidade: c.quantidade,
      valor: c.pago / 100,
      aReceber: c.pendente / 100,
      percentual: total ? Math.round((medida(c) / total) * 100) : 0,
    }));
  return { total: criterio === "valor" ? total / 100 : total, posicoes };
}

export type Aviso = { icone: "alta" | "pendente"; titulo: string; detalhe: string };

const DIAS_PENDENTE_PARA_AVISAR = 3;
const AUMENTO_MINIMO_PARA_AVISAR = 10; // %

/**
 * Avisos automáticos ("Atenção"), só o que pede uma ação:
 * - categoria de despesa que subiu em relação ao período anterior de mesmo tamanho;
 * - receita pendente há vários dias, a mais antiga de cada cliente.
 * O melhor horário fica no Mapa do corre, para não aparecer duas vezes.
 */
export function gerarAvisos(
  atual: { despesas: Despesa[] },
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
  let maiorAlta: { tipo: string; valor: number; antes: number; aumento: number } | null = null;
  for (const [tipo, valor] of somar(atual.despesas)) {
    const antes = somasAnteriores.get(tipo);
    if (!antes) continue;
    const aumento = Math.round(((valor - antes) / antes) * 100);
    if (aumento >= AUMENTO_MINIMO_PARA_AVISAR && (!maiorAlta || aumento > maiorAlta.aumento)) {
      maiorAlta = { tipo, valor, antes, aumento };
    }
  }
  if (maiorAlta) {
    avisos.push({
      icone: "alta",
      // Em reais: "R$ 51 a mais" se entende melhor que "53% acima".
      titulo: `${maiorAlta.tipo}: ${moeda(maiorAlta.valor - maiorAlta.antes)} a mais que no período anterior`,
      detalhe: `Foram ${moeda(maiorAlta.valor)} agora, contra ${moeda(maiorAlta.antes)} antes.`,
    });
  }

  // 2. Pendências antigas, uma por cliente, das mais antigas para as mais novas.
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

/* ---------- Números do corre e mapa do corre ---------- */

type ItemValor = { valor_total: number | null };
type ItemReceita = ItemValor & { tipo: string; status_pagamento: string; quantidade: number };

const somaCentavos = (itens: ItemValor[]) => itens.reduce((soma, item) => soma + centavos(item.valor_total), 0);
const somaPagas = (receitas: ItemReceita[]) =>
  somaCentavos(receitas.filter((r) => r.status_pagamento === "pago"));

type ItemDespesa = ItemValor & { tipo: string };

/** Números de um período, em reais e quantidades (nada de porcentagem). */
export type NumerosCorre = {
  /** Receita paga. */
  recebido: number;
  /** Recebido menos as despesas do corre. */
  sobrou: number;
  entregas: number;
  /** Dias com pelo menos uma receita. */
  diasTrabalhados: number;
  /** Recebido dividido pelas entregas pagas. */
  porEntrega: number;
  /** Recebido dividido pelos dias trabalhados. */
  porDia: number;
  /** Despesas do corre, em reais. */
  custo: number;
  /** Quanto do recebido foi para os custos do corre, de 0 a 100. */
  custoPercentual: number;
  /** Categoria de despesa do corre que mais pesou, se houver. */
  maiorCusto: string | null;
};

/**
 * "Como foi o corre": o que o entregador quer saber, em reais e em número de
 * entregas (fáceis de entender), em vez de variação percentual. As despesas
 * passadas aqui são só as do corre.
 */
export function numerosDoCorre(dados: { receitas: (ItemReceita & { data_hora: string })[]; despesas: ItemDespesa[] }): NumerosCorre {
  const recebido = somaPagas(dados.receitas);
  const custo = somaCentavos(dados.despesas);
  const deEntrega = dados.receitas.filter((r) => contaComoEntrega(r.tipo));
  const entregas = deEntrega.reduce((soma, r) => soma + r.quantidade, 0);
  const entregasPagas = deEntrega.filter((r) => r.status_pagamento === "pago").reduce((s, r) => s + r.quantidade, 0);
  const dias = new Set(dados.receitas.map((r) => new Date(r.data_hora).toDateString())).size;
  const porCategoria = new Map<string, number>();
  for (const d of dados.despesas) porCategoria.set(d.tipo, (porCategoria.get(d.tipo) ?? 0) + centavos(d.valor_total));
  const maior = [...porCategoria].sort((a, b) => b[1] - a[1])[0];
  return {
    recebido: recebido / 100,
    sobrou: (recebido - custo) / 100,
    entregas,
    diasTrabalhados: dias,
    porEntrega: entregasPagas ? recebido / entregasPagas / 100 : 0,
    porDia: dias ? recebido / dias / 100 : 0,
    custo: custo / 100,
    custoPercentual: recebido ? Math.round((custo / recebido) * 100) : 0,
    maiorCusto: maior ? maior[0] : null,
  };
}

export const FAIXAS_HORARIO = ["0h", "3h", "6h", "9h", "12h", "15h", "18h", "21h"];
/** Segunda primeiro (regra 10). */
export const DIAS_MAPA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

/**
 * "Mapa do corre": receita paga somada por dia da semana (linhas, segunda
 * primeiro) e faixa de 3 horas (colunas). Mostra quando o corre mais rende.
 */
export function mapaDoCorre(receitas: (ItemReceita & { data_hora: string })[]) {
  const celulas = DIAS_MAPA.map(() => new Array<number>(FAIXAS_HORARIO.length).fill(0));
  for (const r of receitas) {
    if (r.status_pagamento !== "pago") continue;
    const data = new Date(r.data_hora);
    celulas[(data.getDay() + 6) % 7][Math.floor(data.getHours() / 3)] += centavos(r.valor_total);
  }
  return celulas.map((linha) => linha.map((valor) => valor / 100));
}

/**
 * Quanto o corre ainda deve render até o fim do mês atual, no ritmo de hoje:
 * o recebido até agora dividido pelos dias corridos, vezes os dias que faltam.
 * Só faz sentido a partir do 3º dia; antes disso (ou no último dia) devolve null.
 */
export function ritmoAteOFimDoMes(recebidoNoMes: number, hoje = new Date()) {
  const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
  const corridos = hoje.getDate();
  const diasRestantes = diasNoMes - corridos;
  if (corridos < 3 || diasRestantes === 0) return null;
  return { aMais: Math.round((recebidoNoMes / corridos) * diasRestantes * 100) / 100, diasRestantes };
}
