import "server-only";
import { obterClaims } from "@/lib/sessao";

/**
 * A conta é ADM quando o e-mail da sessão está em ADMIN_EMAIL (variável do
 * servidor, fora do Git). Aceita mais de um e-mail separado por vírgula.
 * Trocar o ADM é só mudar a variável (.env.local e Vercel) e reiniciar.
 */
export async function ehAdmin() {
  const lista = (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  if (lista.length === 0) return false;

  // Claims validados do JWT da sessão; o e-mail não vem de nada que o navegador mande à parte.
  const email = (await obterClaims())?.email;
  return typeof email === "string" && lista.includes(email.toLowerCase());
}
