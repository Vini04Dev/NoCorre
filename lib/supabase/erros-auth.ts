import type { AuthError } from "@supabase/supabase-js";

/** Mensagens do Supabase Auth traduzidas para quem usa o app. */
const MENSAGENS: Record<string, string> = {
  invalid_credentials: "Email ou senha incorretos.",
  email_not_confirmed: "Confirme seu email pelo link que enviamos antes de entrar.",
  user_already_exists: "Já existe uma conta com esse email.",
  email_exists: "Já existe uma conta com esse email.",
  weak_password: "Senha fraca. Use pelo menos 6 caracteres.",
  email_address_invalid: "Esse email não é válido.",
  over_email_send_rate_limit: "Muitas tentativas. Espere alguns minutos e tente de novo.",
  over_request_rate_limit: "Muitas tentativas. Espere alguns minutos e tente de novo.",
  email_provider_disabled: "O login por email está temporariamente desativado.",
  signup_disabled: "Novos cadastros estão temporariamente desativados.",
};

export function traduzirErroAuth(erro: AuthError) {
  const conhecida = erro.code && MENSAGENS[erro.code];
  if (conhecida) return conhecida;
  // Erro não previsto: registra no log (Vercel → Logs) e mostra o código na tela,
  // para quem for ajudar saber o que aconteceu.
  console.error("Erro do Supabase Auth:", erro.code ?? "sem código", erro.status, erro.message);
  return `Não foi possível continuar (${erro.code ?? erro.status ?? "erro"}). Tente de novo.`;
}
