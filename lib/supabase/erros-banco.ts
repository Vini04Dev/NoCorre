import type { PostgrestError } from "@supabase/supabase-js";
import { formatarMoeda } from "@/lib/formatar";

/** Erros que os triggers de metas levantam com um código no texto (migration metas_contas). */
const ERROS_DE_REGRA: Record<string, (detalhe: number) => string> = {
  pagamento_acima_da_conta: (falta) => `Esse pagamento passa do valor da conta. Falta pagar ${formatarMoeda(falta)}.`,
  valor_abaixo_do_pago: (pago) => `O valor não pode ficar abaixo do que já foi pago (${formatarMoeda(pago)}).`,
  conta_com_pagamentos: () => "Essa conta já tem pagamentos. Não dá para mudar o que ela mede.",
  meta_nao_e_conta: () => "Essa conta não foi encontrada. Atualize a tela e tente de novo.",
};

/**
 * Traduz os erros de constraint do Postgres para mensagens da interface.
 * `mensagens` permite que cada tela diga o que a constraint significa ali.
 */
export function traduzirErroBanco(
  erro: PostgrestError,
  mensagens: { vinculo?: string; duplicado?: string } = {},
) {
  const regra = ERROS_DE_REGRA[erro.message];
  if (regra) return regra(Number(erro.details));

  switch (erro.code) {
    case "23503": // foreign_key_violation
      return mensagens.vinculo ?? "Não é possível excluir: existem registros ligados a este item.";
    case "23505": // unique_violation
      return mensagens.duplicado ?? "Já existe um cadastro com esses dados.";
    case "23514": // check_violation
      return "Algum campo está com um valor inválido.";
    default:
      return "Não foi possível salvar. Verifique sua conexão e tente de novo.";
  }
}
