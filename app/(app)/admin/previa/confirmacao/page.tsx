import Link from "next/link";
import { notFound } from "next/navigation";
import { AguardandoConfirmacao } from "@/components/acesso/AguardandoConfirmacao";
import { ehAdmin } from "@/lib/admin-servidor";

/**
 * Prévia do "Confirme seu email", que só aparece logo depois de criar conta.
 * Aberta pelo Painel do sistema, sem tentar entrar nem reenviar nada. Só para o ADM.
 */
export default async function PreviaConfirmacao() {
  if (!(await ehAdmin())) notFound();
  return (
    <main className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-marinho px-6">
      <div className="w-full max-w-[360px]">
        <AguardandoConfirmacao email="exemplo@email.com" senha="" previa />
      </div>
      <Link href="/admin" className="text-xs font-semibold text-cinza-claro">
        ‹ Voltar ao Painel
      </Link>
    </main>
  );
}
