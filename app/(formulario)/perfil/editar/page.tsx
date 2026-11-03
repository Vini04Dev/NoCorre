import type { Metadata } from "next";
import { EditarPerfil } from "@/components/perfil/EditarPerfil";

export const metadata: Metadata = { title: "Dados pessoais | No Corre!" };

export default function Pagina() {
  return <EditarPerfil />;
}
