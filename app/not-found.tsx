import type { Metadata } from "next";
import Link from "next/link";
import { classeBotao } from "@/components/ui/Botao";
import { TelaAviso } from "@/components/ui/TelaAviso";

export const metadata: Metadata = { title: "Página não encontrada | No Corre!" };

/** Endereço que não existe (ou o Painel do sistema para quem não é ADM). */
export default function NaoEncontrada() {
  return (
    <TelaAviso
      desenho="naoEncontrada"
      titulo="Página não encontrada"
      texto="Este endereço não existe ou mudou de lugar. Seus dados continuam salvos."
    >
      <Link href="/" className={classeBotao()}>
        Voltar ao Início
      </Link>
    </TelaAviso>
  );
}
