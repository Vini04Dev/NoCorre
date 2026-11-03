import type { Metadata } from "next";
import { FormularioReceita } from "@/components/lancamentos/FormularioReceita";

export const metadata: Metadata = { title: "Nova receita | No Corre!" };

export default function Pagina() {
  return <FormularioReceita />;
}
