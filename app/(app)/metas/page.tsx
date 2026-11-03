import type { Metadata } from "next";
import { TelaMetas } from "@/components/metas/TelaMetas";

export const metadata: Metadata = { title: "Metas | No Corre!" };

export default function Pagina() {
  return <TelaMetas />;
}
