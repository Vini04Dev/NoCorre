import type { NextRequest } from "next/server";
import { atualizarSessao } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return atualizarSessao(request);
}

export const config = {
  // Não roda para arquivos estáticos (JS/CSS do Next, ícones e imagens) nem para o
  // manifest do PWA, que o navegador busca sem cookies e precisa vir sem login.
  matcher: ["/((?!_next/static|_next/image|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
