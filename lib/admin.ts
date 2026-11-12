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
  /** `id` veio na migration 20261110120000; sem ele, a linha não abre o detalhe. */
  ultimos_cadastros: {
    id?: string;
    nome: string;
    criado_em: string;
    ultimo_acesso: string | null;
    /** Último uso real (sessão renovada); veio na migration 20261111090000. */
    ultimo_uso?: string | null;
  }[];
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

/** Formato do jsonb de public.metricas_usuario_admin(): registros de uma pessoa. */
export type MetricasUsuario = {
  receitas: number;
  receitas_pendentes: number;
  entregas: number;
  despesas: number;
  clientes: number;
  categorias: number;
  eventos: number;
  metas: number;
  metas_ativas: number;
  fotos: number;
  primeiro_lancamento: string | null;
  ultimo_lancamento: string | null;
  ultimo_uso: string | null;
  aparelho: string | null;
  /** Vem de perfis.plano (migration 20261111100000); ausente antes dela. */
  plano?: "gratis" | "pro";
};
