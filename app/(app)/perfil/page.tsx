import type { Metadata } from "next";
import { TelaPerfil } from "@/components/perfil/TelaPerfil";

export const metadata: Metadata = { title: "Perfil | No Corre!" };

export default function Pagina() {
  return <TelaPerfil />;
}
