import type { Metadata } from "next";
import { TelaCarteiras } from "@/components/carteiras/TelaCarteiras";

export const metadata: Metadata = { title: "Carteiras | No Corre!" };

export default function Pagina() {
  return <TelaCarteiras />;
}
