"use client";

import { usePathname } from "next/navigation";

/**
 * Fundo da barra de status do iPhone quando o app está instalado.
 *
 * Com statusBarStyle "black-translucent" o conteúdo passa por baixo da barra
 * (relógio e bateria em branco). Esta faixa azul-marinho, da altura da área
 * segura, dá fundo escuro para o texto branco. Fora do app instalado a altura é
 * zero e ela não aparece. Na Home não é usada: o cabeçalho escuro já ocupa
 * esse espaço.
 */
export function FaixaStatus() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[env(safe-area-inset-top)] bg-marinho" />;
}
