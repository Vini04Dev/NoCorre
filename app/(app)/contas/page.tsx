import { redirect } from "next/navigation";
import { ROTA_CONTAS } from "@/lib/contas-fixas";

// As contas fixas viraram uma aba de Metas; o endereço antigo continua valendo.
export default function Pagina() {
  redirect(ROTA_CONTAS);
}
