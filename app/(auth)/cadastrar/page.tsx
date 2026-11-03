import type { Metadata } from "next";
import { AbasAcesso } from "@/components/acesso/AbasAcesso";
import { FormularioAcesso } from "@/components/acesso/FormularioAcesso";

export const metadata: Metadata = { title: "Cadastrar | No Corre!" };

export default function Pagina() {
  return (
    <>
      <AbasAcesso ativa="/cadastrar" />
      <FormularioAcesso modo="cadastrar" />
    </>
  );
}
