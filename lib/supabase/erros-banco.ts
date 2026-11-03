import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Traduz os erros de constraint do Postgres para mensagens da interface.
 * `mensagens` permite que cada tela diga o que a constraint significa ali.
 */
export function traduzirErroBanco(
  erro: PostgrestError,
  mensagens: { vinculo?: string; duplicado?: string } = {},
) {
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
