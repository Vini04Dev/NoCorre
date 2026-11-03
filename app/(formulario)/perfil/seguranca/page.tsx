import type { Metadata } from "next";
import { TelaSeguranca } from "@/components/perfil/TelaSeguranca";

export const metadata: Metadata = { title: "Senha e segurança | No Corre!" };

export default function Pagina() {
  return <TelaSeguranca />;
}
