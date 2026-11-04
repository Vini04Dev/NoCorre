import type { Metadata } from "next";
import { EditarPerfil } from "@/components/perfil/EditarPerfil";

export const metadata: Metadata = { title: "Meu veículo | No Corre!" };

export default function Pagina() {
  return <EditarPerfil parte="veiculo" />;
}
