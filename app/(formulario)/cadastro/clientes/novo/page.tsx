import type { Metadata } from "next";
import { FormularioCliente } from "@/components/cadastro/FormularioCliente";

export const metadata: Metadata = { title: "Novo cliente | No Corre!" };

export default function Pagina() {
  return <FormularioCliente />;
}
