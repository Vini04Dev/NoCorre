import type { Metadata } from "next";
import { TelaCategorias } from "@/components/cadastro/TelaCategorias";

export const metadata: Metadata = { title: "Categorias | No Corre!" };

export default function Pagina() {
  return <TelaCategorias />;
}
