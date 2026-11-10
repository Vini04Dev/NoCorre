/**
 * Conteúdo da landing page. Números, depoimentos e nomes abaixo são FICTÍCIOS,
 * colocados só para montar o layout. Trocar pelos reais antes de divulgar.
 */

/** Âncoras da barra de cima e do rodapé; os rótulos ficam em idiomas.ts (nav.links). */
export const ANCORAS = ["#historia", "#relatorios", "#cidade", "#planos", "#codigo", "#perguntas"];

/** Rótulos em idiomas.ts (numeros), na mesma ordem. */
export const NUMEROS: { ate: number; prefixo: string; sufixo: string; casas?: number }[] = [
  { ate: 1200, prefixo: "+", sufixo: "" },
  { ate: 20, prefixo: "", sufixo: "" },
  { ate: 4.9, prefixo: "", sufixo: "/5", casas: 1 },
];

/**
 * Entregas por dia, de segunda a domingo (nomes dos dias em idiomas.ts). 176
 * entregas a uns R$ 8 cada (média de R$ 7 a R$ 9 na cidade) dão a receita da
 * semana em RECEITA_TOTAL_SEMANA.
 */
export const ENTREGAS_SEMANA = [22, 18, 25, 20, 40, 34, 17];

export const RECEITA_TOTAL_SEMANA = 1412;

/** Nomes das categorias em idiomas.ts (relatorios.categorias), na mesma ordem. */
export const CATEGORIAS_DESPESA = [
  { valor: 412, cor: "#ffd36a" },
  { valor: 238, cor: "#4caf00" },
  { valor: 164, cor: "#9196a2" },
  { valor: 120, cor: "#5b6b9a" },
];

/** Saldo acumulado a cada 3 dias do mês. */
export const SALDO_MES = [380, 920, 1350, 1980, 1860, 2610, 3190, 3620, 3980, 4310];
