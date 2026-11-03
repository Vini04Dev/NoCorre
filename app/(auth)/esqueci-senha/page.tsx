import type { Metadata } from "next";
import { FormularioRecuperacao } from "@/components/acesso/FormularioRecuperacao";

export const metadata: Metadata = { title: "Esqueci minha senha | No Corre!" };

export default function Pagina() {
  return <FormularioRecuperacao />;
}
