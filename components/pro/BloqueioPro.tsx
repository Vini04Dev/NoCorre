import Link from "next/link";
import { IconeCirculo } from "@/components/ui/IconeCirculo";
import { RECURSOS_PRO, type RecursoPro } from "@/lib/pro";
import { SeloPro } from "./SeloPro";

/**
 * Mostrado no lugar de um recurso Pro para quem está no plano grátis: explica
 * o recurso e leva à tela do plano. Nada de tela vazia ou erro.
 */
export function BloqueioPro({ recurso }: { recurso: RecursoPro }) {
  const info = RECURSOS_PRO.find((item) => item.chave === recurso)!;
  return (
    <div className="flex flex-col items-center gap-3 rounded-[14px] border border-black/8 bg-white px-5 py-7 text-center shadow-cartao">
      <IconeCirculo src={info.icone} />
      <p className="flex items-center gap-1.5 text-base font-extrabold">
        {info.titulo} <SeloPro />
      </p>
      <p className="max-w-xs text-xs leading-relaxed text-cinza-escuro">{info.texto}</p>
      <Link href="/pro" className="rounded-[10px] bg-marinho px-4 py-2.5 text-xs font-bold text-white">
        Conhecer o No Corre! Pro
      </Link>
    </div>
  );
}
