"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * Busca as métricas de novo no servidor, sem cache: router.refresh() refaz a
 * página e a função metricas_admin() conta tudo na hora.
 */
export function BotaoAtualizar() {
  const router = useRouter();
  const [atualizando, iniciar] = useTransition();
  return (
    <button
      type="button"
      onClick={() => iniciar(() => router.refresh())}
      disabled={atualizando}
      className="rounded-lg border border-cinza-claro bg-white px-3 py-1.5 text-xs font-semibold disabled:opacity-60"
    >
      {atualizando ? "Atualizando..." : "Atualizar"}
    </button>
  );
}
