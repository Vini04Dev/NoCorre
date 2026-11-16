import Link from "next/link";
import { Gorro } from "@/components/tema/Enfeites";
import { IconeTingido } from "@/components/ui/Icones";

type Props = {
  href: string;
  titulo: string;
  descricao: string;
  icone: string;
  tamanhoIcone: number;
  /** Enfeite do tema Natal no ícone. */
  gorro?: boolean;
};

/** Botão grande de módulo da Home (Agenda, Metas, Cadastro). */
export function CartaoModulo({ href, titulo, descricao, icone, tamanhoIcone, gorro }: Props) {
  return (
    <Link
      href={href}
      className="flex min-h-[75px] items-center gap-2 rounded-[10px] border border-black/8 bg-white py-2.5 pr-2 pl-1.5 shadow-cartao"
    >
      {/* Círculo marinho fixo; o ícone acompanha a cor de destaque do tema. */}
      <span className="relative shrink-0">
        <span className="grid size-[55px] place-items-center rounded-full bg-marinho">
          <IconeTingido src={icone} tamanho={tamanhoIcone} cor="bg-dourado-icone" />
        </span>
        {/* Tema Natal: só o primeiro módulo leva gorro, para enfeitar sem poluir. */}
        {gorro && <Gorro className="-top-3 -right-2.5 w-8 rotate-[20deg]" />}
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[15px] font-semibold uppercase">{titulo}</span>
        <span className="text-[11px]">{descricao}</span>
      </span>
    </Link>
  );
}
