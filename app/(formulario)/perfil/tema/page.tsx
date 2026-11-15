import type { Metadata } from "next";
import { TelaTema } from "@/components/tema/TelaTema";

export const metadata: Metadata = { title: "Tema do app | No Corre!" };

export default function Pagina() {
  return <TelaTema />;
}
