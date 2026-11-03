import type { Metadata } from "next";
import { RedefinirSenha } from "@/components/perfil/RedefinirSenha";

export const metadata: Metadata = { title: "Nova senha | No Corre!" };

export default function Pagina() {
  return <RedefinirSenha />;
}
