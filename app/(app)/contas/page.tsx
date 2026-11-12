import type { Metadata } from "next";
import { TelaContasFixas } from "@/components/contas/TelaContasFixas";

export const metadata: Metadata = { title: "Contas fixas | No Corre!" };

export default function Pagina() {
  return <TelaContasFixas />;
}
