import { FaixaStatus } from "@/components/navegacao/FaixaStatus";
import { MenuLateral } from "@/components/navegacao/MenuLateral";
import { ehAdmin } from "@/lib/admin-servidor";

/**
 * Casca das telas de formulário (novo e editar). Como no Figma, elas não têm a
 * navegação inferior: o rodapé é ocupado pelos botões de salvar e excluir.
 * No computador o menu lateral continua visível e o formulário vira um cartão
 * centralizado (as telas usam min-h-dvh, anulado aqui para o cartão não esticar).
 */
export default async function LayoutFormulario({ children }: LayoutProps<"/">) {
  return (
    <div className="casca-app min-h-dvh lg:pl-64">
      <MenuLateral admin={await ehAdmin()} />
      <div className="mx-auto min-h-dvh max-w-[430px] lg:min-h-0 lg:max-w-none lg:px-6 lg:py-10">
        <FaixaStatus />
        <div className="lg:mx-auto lg:max-w-xl lg:overflow-clip lg:rounded-3xl lg:bg-fundo lg:pt-5 lg:pb-2 lg:shadow-[0_20px_60px_-25px_rgba(43,45,66,0.35)] lg:ring-1 lg:ring-black/5 lg:*:min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}
