import { BarraNavegacao } from "@/components/navegacao/BarraNavegacao";
import { FaixaStatus } from "@/components/navegacao/FaixaStatus";
import { MenuLateral } from "@/components/navegacao/MenuLateral";
import { Suspense } from "react";
import { AvisoNovidades } from "@/components/novidades/AvisoNovidades";
import { ehAdmin } from "@/lib/admin-servidor";
import { estaLogado } from "@/lib/sessao";

/**
 * Casca das telas logadas. No celular: coluna com largura de celular e navegação
 * inferior. No computador (lg): menu lateral fixo e conteúdo largo, com as telas
 * reorganizadas em colunas.
 *
 * Sem login, a única tela deste grupo que o proxy deixa abrir é "/", que mostra a
 * landing: ela vem sem menu, barra inferior nem a coluna estreita.
 */
export default async function LayoutApp({ children }: LayoutProps<"/">) {
  if (!(await estaLogado())) return children;

  return (
    <div className="min-h-dvh lg:pl-64">
      <MenuLateral admin={await ehAdmin()} />
      <div className="mx-auto min-h-dvh max-w-[430px] pb-[calc(env(safe-area-inset-bottom)+96px)] lg:max-w-6xl lg:px-6 lg:pt-6 lg:pb-12">
        <FaixaStatus />
        {children}
      </div>
      <BarraNavegacao />
      {/* useSearchParams (?aviso=) precisa de Suspense em volta. */}
      <Suspense>
        <AvisoNovidades />
      </Suspense>
    </div>
  );
}
