import Link from "next/link";
import { IconeTingido } from "@/components/ui/Icones";

type Props = {
  href: string;
  titulo: string;
  descricao: string;
  icone: string;
  tamanhoIcone: number;
  /**
   * Na faixa que rola para o lado (celular): cartão em pé, mais estreito, com o
   * ícone em cima. No computador volta a ser a linha de sempre.
   */
  faixa?: boolean;
};

const LINHA = "flex min-h-[75px] items-center gap-2 rounded-[10px] border border-black/8 bg-white py-2.5 pr-2 pl-1.5 shadow-cartao";
const EM_PE =
  "flex w-[150px] shrink-0 snap-start flex-col items-start gap-2 rounded-[12px] border border-black/8 bg-white p-3 shadow-cartao " +
  "lg:w-auto lg:min-h-[75px] lg:flex-row lg:items-center lg:rounded-[10px] lg:py-2.5 lg:pr-2 lg:pl-1.5";

/** Botão grande de módulo da Home (Agenda, Metas, Cadastro). */
export function CartaoModulo({ href, titulo, descricao, icone, tamanhoIcone, faixa = false }: Props) {
  return (
    <Link href={href} className={faixa ? EM_PE : LINHA}>
      {/* Círculo marinho fixo; o ícone acompanha a cor de destaque do tema. */}
      <span className="grid size-[55px] shrink-0 place-items-center rounded-full bg-marinho">
        <IconeTingido src={icone} tamanho={tamanhoIcone} cor="bg-dourado-icone" />
      </span>
      <span className="flex flex-col gap-1">
        <span className={`font-semibold uppercase ${faixa ? "text-[13px] lg:text-[15px]" : "text-[15px]"}`}>{titulo}</span>
        <span className={`text-[11px] ${faixa ? "line-clamp-3 lg:line-clamp-none" : ""}`}>{descricao}</span>
      </span>
    </Link>
  );
}
