import type { Metadata } from "next";
import { FormularioEntrada } from "@/components/lancamentos/FormularioEntrada";

export const metadata: Metadata = { title: "Outra entrada | No Corre!" };

export default function Pagina() {
  return <FormularioEntrada />;
}
