import type { Metadata } from "next";
import { FormularioDespesa } from "@/components/lancamentos/FormularioDespesa";

export const metadata: Metadata = { title: "Nova despesa | No Corre!" };

export default function Pagina() {
  return <FormularioDespesa />;
}
