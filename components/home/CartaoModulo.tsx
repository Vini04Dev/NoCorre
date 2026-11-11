import Image from "next/image";
import Link from "next/link";

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
      <span className="relative grid size-[55px] shrink-0 place-items-center">
        {/* data-cor-fixa: círculo marinho e ícone dourado não mudam nos fundos escuros. */}
        <Image src="/icones/modulo-circulo.svg" alt="" width={55} height={55} className="absolute" data-cor-fixa />
        <Image src={icone} alt="" width={tamanhoIcone} height={tamanhoIcone} className="relative" data-cor-fixa />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[15px] font-semibold uppercase">{titulo}</span>
        <span className="text-[11px]">{descricao}</span>
      </span>
    </Link>
  );
}
