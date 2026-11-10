/** Formato do jsonb devolvido por public.metricas_admin() (docs/der-fisico.md). */
export type MetricasAdmin = {
  gerado_em: string;
  usuarios: {
    total: number;
    confirmados: number;
    novos_7d: number;
    novos_30d: number;
    acessaram_7d: number;
    acessaram_30d: number;
  };
  lancaram_7d: number;
  /*
   * Campos abaixo vieram na migration 20261110120000. Opcionais para o painel
   * não quebrar se o app for publicado antes de a migration ser aplicada.
   */
  /** Uso pelas sessões renovadas (quem abriu o app), não só por login. */
  uso?: { ativos_hoje: number; ativos_7d: number; ativos_30d: number; celular_30d: number; computador_30d: number };
  retencao_7d?: { base: number; voltaram: number };
  sem_lancamento?: number;
  receitas_pendentes?: number;
  metas_ativas?: number;
  categorias_receita?: { nome: string; total: number }[];
  categorias_despesa?: { nome: string; total: number }[];
  tabelas?: { nome: string; bytes: number }[];
  registros: Record<"receitas" | "despesas" | "clientes" | "categorias" | "eventos" | "metas", number>;
  por_dia: { dia: string; cadastros: number; lancamentos: number; usuarios?: number }[];
  armazenamento: { banco_bytes: number; fotos: { arquivos: number; bytes: number } };
  ultimos_cadastros: { nome: string; criado_em: string; ultimo_acesso: string | null }[];
};

export function formatarBytes(bytes: number) {
  const unidades = ["B", "KB", "MB", "GB"];
  let valor = bytes;
  let indice = 0;
  while (valor >= 1024 && indice < unidades.length - 1) {
    valor /= 1024;
    indice += 1;
  }
  return `${valor.toLocaleString("pt-BR", { maximumFractionDigits: indice === 0 ? 0 : 1 })} ${unidades[indice]}`;
}
