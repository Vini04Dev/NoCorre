import { notFound } from "next/navigation";
import { ehAdmin } from "@/lib/admin-servidor";

/**
 * Prévia do aviso de erro (app/error.tsx), aberta pelo Painel do sistema.
 * Falha de propósito para mostrar a tela como a pessoa veria. Só para o ADM.
 */
export default async function PreviaErro() {
  if (!(await ehAdmin())) notFound();
  throw new Error("Prévia do aviso de erro aberta pelo Painel do sistema.");
}
