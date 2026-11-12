"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Avisos que só aparecem sob condição e podem ser abertos à mão para conferir. */
export type Aviso =
  | "novidades"
  | "primeiro-uso"
  | "vencimento"
  | "pro";

/**
 * `?aviso=novidades` ou `?aviso=primeiro-uso` no endereço abre o aviso na hora,
 * mesmo que a condição normal dele não esteja valendo (atalhos no Painel do
 * sistema). Fechar tira o parâmetro do endereço.
 */
export function useAvisoForcado(aviso: Aviso) {
  const parametros = useSearchParams();
  const router = useRouter();
  const caminho = usePathname();
  const forcado = parametros.get("aviso") === aviso;

  function limpar() {
    if (forcado) router.replace(caminho, { scroll: false });
  }

  return [forcado, limpar] as const;
}
