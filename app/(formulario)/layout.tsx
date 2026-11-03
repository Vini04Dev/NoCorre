import { FaixaStatus } from "@/components/navegacao/FaixaStatus";

/**
 * Casca das telas de formulário (novo e editar). Como no Figma, elas não têm a
 * navegação inferior: o rodapé é ocupado pelos botões de salvar e excluir.
 */
export default function LayoutFormulario({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto min-h-dvh max-w-[430px]">
      <FaixaStatus />
      {children}
    </div>
  );
}
