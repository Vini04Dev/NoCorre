import type { Metadata } from "next";
import { TelaRelatorios } from "@/components/relatorios/TelaRelatorios";

export const metadata: Metadata = { title: "Relatórios | No Corre!" };

export default function Pagina() {
  return <TelaRelatorios />;
}
