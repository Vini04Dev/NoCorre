import type { Metadata } from "next";
import { TelaMoto } from "@/components/moto/TelaMoto";

export const metadata: Metadata = { title: "Saúde da moto | No Corre!" };

export default function Pagina() {
  return <TelaMoto />;
}
