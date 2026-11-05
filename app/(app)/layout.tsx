import { BarraNavegacao } from "@/components/navegacao/BarraNavegacao";
import { FaixaStatus } from "@/components/navegacao/FaixaStatus";
import { MenuLateral } from "@/components/navegacao/MenuLateral";
import { ehAdmin } from "@/lib/admin-servidor";

/**
 * Casca das telas logadas. No celular: coluna com largura de celular e navegação
 * inferior. No computador (lg): menu lateral fixo e conteúdo largo, com as telas
 * reorganizadas em colunas.
 */
export default async function LayoutApp({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-dvh lg:pl-64">
      <MenuLateral admin={await ehAdmin()} />
      <div className="mx-auto min-h-dvh max-w-[430px] pb-[calc(env(safe-area-inset-bottom)+96px)] lg:max-w-6xl lg:px-6 lg:pt-6 lg:pb-12">
        <FaixaStatus />
        {children}
      </div>
      <BarraNavegacao />
    </div>
  );
}
