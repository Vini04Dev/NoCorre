import Link from "next/link";
import { IconeTingido } from "@/components/ui/Icones";
import { classeBotao } from "@/components/ui/Botao";

const EXEMPLOS = ["iFood", "99", "Vai Moto", "Entrega avulsa", "Corridas avulsas"];

/**
 * Conteúdo do painel de primeiro uso: toda receita pertence a um cliente,
 * então quem ainda não tem nenhum é levado a cadastrar antes de lançar.
 */
export function PrimeiroCliente({ aoFechar }: { aoFechar: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="grid size-[54px] place-items-center rounded-full bg-marinho">
        <IconeTingido src="/icones/cadastro.svg" tamanho={32} cor="bg-dourado-icone" />
      </span>
      <h2 id="primeiro-cliente-titulo" className="text-lg font-extrabold">
        Bora começar o corre!
      </h2>
      <p className="text-[13px] text-cinza-escuro">
        Antes de lançar sua primeira receita, cadastre de quem você recebe: o app, a central, o
        estabelecimento onde trabalha ou você mesmo (ex.: &quot;Corridas avulsas&quot;).
      </p>
      <ul className="flex flex-wrap justify-center gap-1.5">
        {EXEMPLOS.map((exemplo) => (
          <li key={exemplo} className="rounded-full bg-cinza-fundo px-2.5 py-1 text-[11px] font-medium">
            {exemplo}
          </li>
        ))}
      </ul>
      <Link href="/cadastro/clientes/novo" className={classeBotao()}>
        Cadastrar meu primeiro cliente
      </Link>
      <button type="button" onClick={aoFechar} className="py-1 text-[13px] font-semibold text-cinza-escuro">
        Agora não
      </button>
    </div>
  );
}
