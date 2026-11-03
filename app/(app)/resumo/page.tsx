import type { Metadata } from "next";
import { TelaResumo } from "@/components/resumo/TelaResumo";

export const metadata: Metadata = { title: "Resumo | No Corre!" };

export default function Pagina() {
  return <TelaResumo />;
}
