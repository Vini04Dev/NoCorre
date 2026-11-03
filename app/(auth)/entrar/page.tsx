import type { Metadata } from "next";
import { AbasAcesso } from "@/components/acesso/AbasAcesso";
import { FormularioAcesso } from "@/components/acesso/FormularioAcesso";

export const metadata: Metadata = { title: "Entrar | No Corre!" };

const ERROS: Record<string, string> = {
  // O link pode confirmar o email e mesmo assim não abrir a sessão, por exemplo quando
  // é aberto em outro aparelho. Por isso a mensagem orienta a só entrar.
  confirmacao: "Não foi possível entrar por este link. Se você já confirmou o email, entre com seu email e senha.",
};

export default async function Pagina({ searchParams }: PageProps<"/entrar">) {
  const { erro } = await searchParams;
  const mensagem = typeof erro === "string" ? ERROS[erro] : undefined;

  return (
    <>
      <AbasAcesso ativa="/entrar" />
      <FormularioAcesso modo="entrar" erroInicial={mensagem} />
    </>
  );
}
