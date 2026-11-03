import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { criarClienteServidor } from "@/lib/supabase/servidor";

/**
 * Destino do link do email de confirmação de cadastro.
 *
 * Aceita os dois formatos que o Supabase pode mandar: `code` (template padrão,
 * fluxo PKCE) e `token_hash` + `type` (template personalizado, que funciona mesmo
 * se o link for aberto em outro navegador).
 */
export async function GET(request: NextRequest) {
  const parametros = request.nextUrl.searchParams;
  const codigo = parametros.get("code");
  const tokenHash = parametros.get("token_hash");
  const tipo = parametros.get("type") as EmailOtpType | null;

  const supabase = await criarClienteServidor();
  let confirmado = false;

  if (codigo) {
    const { error } = await supabase.auth.exchangeCodeForSession(codigo);
    confirmado = !error;
  } else if (tokenHash && tipo) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: tipo });
    confirmado = !error;
  }

  // "proximo" vem do link de recuperação de senha. Só caminhos internos, para o
  // link não poder mandar a pessoa para outro site.
  const proximo = parametros.get("proximo");
  const interno = proximo?.startsWith("/") && !proximo.startsWith("//") ? proximo : "/";
  const destino = confirmado ? interno : "/entrar?erro=confirmacao";
  return NextResponse.redirect(new URL(destino, request.url));
}
