"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { aplicarTemaApp, temaGuardado } from "@/hooks/useTemaApp";
import { ENFEITES } from "@/lib/tema-app";

/**
 * Prévia dos enfeites de data (`?enfeite=natal`, atalho no Painel do sistema).
 * O script do <head> só lê o parâmetro quando a página carrega do zero, e o
 * link do Painel troca de tela sem recarregar; por isso a prévia também é
 * ligada aqui, a cada navegação. Os enfeites só existem no tema Clássico, então
 * a prévia mostra o Clássico na hora, sem mudar o tema escolhido no aparelho.
 * Sair da prévia (ou sair do endereço com o parâmetro) volta o tema guardado.
 */
export function PreviaEnfeite() {
  const parametros = useSearchParams();
  const router = useRouter();
  const caminho = usePathname();
  const pedido = parametros.get("enfeite");
  const enfeite = ENFEITES.find((e) => e.valor === pedido)?.valor ?? null;

  useEffect(() => {
    if (!enfeite) return;
    const raiz = document.documentElement.dataset;
    delete raiz.temaApp;
    delete raiz.temaEscuro;
    raiz.enfeite = enfeite;
    return () => aplicarTemaApp(temaGuardado());
  }, [enfeite]);

  if (!enfeite) return null;
  return (
    <div
      role="status"
      className="fixed top-[calc(env(safe-area-inset-top)+8px)] left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-marinho py-1.5 pr-1.5 pl-4 text-xs whitespace-nowrap text-white shadow-cartao lg:left-[calc(50%+128px)]"
    >
      Prévia dos enfeites, no tema Clássico
      <button
        type="button"
        onClick={() => router.replace(caminho, { scroll: false })}
        className="rounded-full bg-white/15 px-3 py-1 font-semibold"
      >
        Sair da prévia
      </button>
    </div>
  );
}
