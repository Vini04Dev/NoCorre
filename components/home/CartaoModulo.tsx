import Link from "next/link";
import { IconeTingido } from "@/components/ui/Icones";

type Props = {
  href: string;
  titulo: string;
  descricao: string;
  icone: string;
  tamanhoIcone: number;
};

/** Botão grande de módulo da Home (Agenda, Metas, Cadastro). */
export function CartaoModulo({ href, titulo, descricao, icone, tamanhoIcone }: Props) {
  return (
    <Link
      href={href}
      className="flex min-h-[75px] items-center gap-2 rounded-[10px] border border-black/8 bg-white py-2.5 pr-2 pl-1.5 shadow-cartao"
    >
      {/* Círculo marinho fixo; o ícone acompanha a cor de destaque do tema. */}
      <span className="grid size-[55px] shrink-0 place-items-center rounded-full bg-marinho">
        <IconeTingido src={icone} tamanho={tamanhoIcone} cor="bg-dourado-icone" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[15px] font-semibold uppercase">{titulo}</span>
        <span className="text-[11px]">{descricao}</span>
      </span>
    </Link>
  );
}
