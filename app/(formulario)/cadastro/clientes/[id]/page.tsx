import type { Metadata } from "next";
import { EditarCliente } from "@/components/cadastro/EditarCliente";

export const metadata: Metadata = { title: "Editar cliente | No Corre!" };

export default async function Pagina({ params }: PageProps<"/cadastro/clientes/[id]">) {
  const { id } = await params;
  return <EditarCliente id={id} />;
}
