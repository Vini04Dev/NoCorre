import type { Metadata } from "next";
import { TelaAgenda } from "@/components/agenda/TelaAgenda";

export const metadata: Metadata = { title: "Agenda | No Corre!" };

export default function Pagina() {
  return <TelaAgenda />;
}
