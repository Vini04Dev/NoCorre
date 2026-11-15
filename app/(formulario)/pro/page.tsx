import type { Metadata } from "next";
import { TelaPro } from "@/components/pro/TelaPro";

export const metadata: Metadata = { title: "No Corre! Pro" };

export default function Pagina() {
  return <TelaPro />;
}
