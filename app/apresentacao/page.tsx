import type { Metadata } from "next";
import { TelaApresentacao } from "@/components/landing/TelaApresentacao";

export const metadata: Metadata = {
  title: "No Corre! | Controle financeiro para entregadores",
};

/** Servida em "/" para visitantes (o proxy reescreve a rota); logado, "/" é a Home. */
export default function Pagina() {
  return <TelaApresentacao />;
}
