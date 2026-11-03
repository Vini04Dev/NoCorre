import type { Metadata } from "next";
import { AbasAcesso } from "@/components/acesso/AbasAcesso";
import { FormularioAcesso } from "@/components/acesso/FormularioAcesso";

export const metadata: Metadata = { title: "Entrar | No Corre!" };

const ERROS: Record<string, string> = {
  confirmacao: "O link de confirmação expirou ou já foi usado. Tente entrar ou cadastre-se de novo.",
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
