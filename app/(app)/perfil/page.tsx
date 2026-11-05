import type { Metadata } from "next";
import { TelaPerfil } from "@/components/perfil/TelaPerfil";
import { ehAdmin } from "@/lib/admin-servidor";

export const metadata: Metadata = { title: "Perfil | No Corre!" };

export default async function Pagina() {
  return <TelaPerfil admin={await ehAdmin()} />;
}
