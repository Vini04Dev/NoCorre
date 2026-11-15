import { contaComoEntrega } from "./categorias-padrao";

/**
 * Tipos de carteira. A coluna no banco é texto livre (como o tipo de receitas e
 * despesas); estas opções só definem o rótulo e o ícone do cartão.
 * Ícones de linha 24x24 (traço 2), desenhados com currentColor.
 */
export const TIPOS_CARTEIRA = [
  {
    valor: "Conta corrente",
    // banco
    icone: "M3 10h18M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18M12 3l9 5H3l9-5Z",
  },
  {
    valor: "Poupança",
    // cofrinho
    icone:
      "M19 9.5c1 .6 2 1.8 2 3.5h-2c0 1.3-.6 2.4-1.5 3.2V19h-3v-1.5h-4V19h-3v-2.8A6 6 0 0 1 11 6h3c1.2 0 2.4.3 3.4 1L19 5v4.5ZM15.5 11h.01",
  },
  {
    valor: "Dinheiro",
    // cédula
    icone: "M3 7h18v10H3zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6.5 10v.01M17.5 14v.01",
  },
  {
    valor: "Conta salário",
    // maleta
    icone: "M4 8h16v11H4zM9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8M4 13h16",
  },
  {
    valor: "Outro",
    // carteira
    icone: "M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3M4 7.5V17a2 2 0 0 0 2 2h14V8H6.5A2.5 2.5 0 0 1 4 5.5M16 13.5h.01",
  },
] as const;

export type TipoCarteira = (typeof TIPOS_CARTEIRA)[number]["valor"];

/** Ícone do tipo; tipo vazio ou desconhecido usa o de carteira. */
export function iconeDoTipo(tipo: string | null | undefined) {
  return (TIPOS_CARTEIRA.find((t) => t.valor === tipo) ?? TIPOS_CARTEIRA[TIPOS_CARTEIRA.length - 1]).icone;
}

type CarteiraBase = { id: string; padrao: boolean; created_at: string };

/**
 * Carteira principal, com a mesma regra do banco (saldos_carteiras): a marcada
 * como principal, ou a mais antiga se nenhuma estiver marcada. Lançamento sem
 * carteira conta nela.
 */
export function principalEntre<T extends CarteiraBase>(carteiras: T[]): T | undefined {
  return [...carteiras].sort((a, b) => Number(b.padrao) - Number(a.padrao) || a.created_at.localeCompare(b.created_at))[0];
}

/** O lançamento é desta carteira? Sem carteira (null) conta na principal. */
export function ehDaCarteira(carteiraDoLancamento: string | null, carteiraId: string, principalId: string | null) {
  return carteiraDoLancamento === carteiraId || (carteiraDoLancamento === null && carteiraId === principalId);
}

type Movimentos = {
  receitas: { tipo: string; carteira_id: string | null; valor_total: number | null; quantidade: number; status_pagamento: "pago" | "pendente" }[];
  despesas: { carteira_id: string | null; valor_total: number | null }[];
  entradas: { carteira_id: string | null; valor: number }[];
};

/**
 * O que passou por uma carteira no período: entrou (receitas pagas, outras
 * entradas e transferências recebidas), saiu (despesas e transferências
 * enviadas), pendentes e entregas. Usado no Início e no Resumo com uma
 * carteira escolhida. Em centavos para não acumular erro de arredondamento.
 */
export function movimentoDaCarteira(
  dados: Movimentos,
  transferencias: { origem_id: string; destino_id: string; valor: number }[],
  carteiraId: string,
  principalId: string | null,
) {
  const c = (valor: number | null) => Math.round((valor ?? 0) * 100);
  const daqui = (id: string | null) => ehDaCarteira(id, carteiraId, principalId);
  let recebidos = 0, pendentes = 0, entregas = 0, despesas = 0, entradas = 0, chegou = 0, enviado = 0;
  for (const r of dados.receitas) {
    if (!daqui(r.carteira_id)) continue;
    if (r.status_pagamento === "pago") recebidos += c(r.valor_total);
    else pendentes += c(r.valor_total);
    if (contaComoEntrega(r.tipo)) entregas += r.quantidade;
  }
  for (const d of dados.despesas) if (daqui(d.carteira_id)) despesas += c(d.valor_total);
  for (const e of dados.entradas) if (daqui(e.carteira_id)) entradas += c(e.valor);
  for (const t of transferencias) {
    if (t.destino_id === carteiraId) chegou += c(t.valor);
    if (t.origem_id === carteiraId) enviado += c(t.valor);
  }
  return {
    entrou: (recebidos + entradas + chegou) / 100,
    saiu: (despesas + enviado) / 100,
    pendentes: pendentes / 100,
    entregas,
    entradas: entradas / 100,
    chegou: chegou / 100,
    enviado: enviado / 100,
  };
}
