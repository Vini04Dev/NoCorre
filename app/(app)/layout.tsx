import { BarraNavegacao } from "@/components/navegacao/BarraNavegacao";

/**
 * Casca das telas logadas: coluna com largura de celular e navegação inferior.
 * As telas de login (Etapa 3) ficam fora deste grupo, sem a navegação.
 */
export default function LayoutApp({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto min-h-dvh max-w-[430px] pb-[calc(env(safe-area-inset-bottom)+96px)]">
      {children}
      <BarraNavegacao />
    </div>
  );
}
