import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { supabaseChave, supabaseUrl } from "./config";

/** Telas que qualquer pessoa pode abrir sem estar logada. */
const ROTAS_PUBLICAS = ["/entrar", "/cadastrar", "/esqueci-senha", "/auth"];

function ehRotaPublica(caminho: string) {
  return ROTAS_PUBLICAS.some((rota) => caminho === rota || caminho.startsWith(`${rota}/`));
}

/**
 * Renova a sessão do Supabase a cada requisição e redireciona conforme o login.
 *
 * O token de acesso expira em pouco tempo. Server Components não conseguem gravar
 * cookies, então é aqui, antes da página renderizar, que o token renovado volta
 * para o navegador.
 */
export async function atualizarSessao(request: NextRequest) {
  let resposta = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseChave, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesParaGravar, cabecalhos) {
        // Grava na requisição (para a página enxergar o token novo) e na resposta
        // (para o navegador guardar).
        cookiesParaGravar.forEach(({ name, value }) => request.cookies.set(name, value));
        resposta = NextResponse.next({ request });
        cookiesParaGravar.forEach(({ name, value, options }) =>
          resposta.cookies.set(name, value, options),
        );
        Object.entries(cabecalhos).forEach(([chave, valor]) => resposta.headers.set(chave, valor));
      },
    },
  });

  // getClaims valida a assinatura do token. Não trocar por getSession, que só lê o
  // cookie e não deve ser usado para decidir acesso no servidor.
  const { data } = await supabase.auth.getClaims();
  const logado = Boolean(data?.claims);
  const caminho = request.nextUrl.pathname;

  if (!logado && !ehRotaPublica(caminho)) {
    return redirecionar(request, resposta, "/entrar");
  }
  if (logado && (caminho === "/entrar" || caminho === "/cadastrar")) {
    return redirecionar(request, resposta, "/");
  }

  return resposta;
}

/** Redireciona sem perder os cookies de sessão que acabaram de ser renovados. */
function redirecionar(request: NextRequest, resposta: NextResponse, destino: string) {
  const redirecionamento = NextResponse.redirect(new URL(destino, request.url));
  resposta.cookies.getAll().forEach((cookie) => redirecionamento.cookies.set(cookie));
  return redirecionamento;
}
