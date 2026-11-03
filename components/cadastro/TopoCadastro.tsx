import Link from "next/link";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";

const ABAS = [
  { href: "/cadastro", rotulo: "Clientes" },
  { href: "/cadastro/categorias", rotulo: "Categorias" },
] as const;

const CLASSE_MAIS =
  "grid size-[38px] place-items-center rounded-full bg-linear-to-r from-dourado-claro to-dourado text-[22px] font-semibold";

type Props = {
  abaAtiva: (typeof ABAS)[number]["href"];
  /** O "+" leva a uma página (cliente) ou abre o painel na mesma tela (categoria). */
  novo: { href: string } | { aoClicar: () => void };
};

/** Título do módulo, botão "+" e abas Clientes / Categorias. */
export function TopoCadastro({ abaAtiva, novo }: Props) {
  const botaoMais =
    "href" in novo ? (
      <Link href={novo.href} aria-label="Novo cliente" className={CLASSE_MAIS}>
        +
      </Link>
    ) : (
      <button type="button" onClick={novo.aoClicar} aria-label="Nova categoria" className={CLASSE_MAIS}>
        +
      </button>
    );

  return (
    <>
      <CabecalhoTela titulo="Cadastro" voltarPara="/" tituloGrande acao={botaoMais} />
      <nav className="flex rounded-[10px] bg-cinza-fundo p-1">
        {ABAS.map(({ href, rotulo }) => {
          const ativa = href === abaAtiva;
          return (
            <Link
              key={href}
              href={href}
              aria-current={ativa ? "page" : undefined}
              className={`flex-1 rounded-lg py-1.5 text-center text-[13px] ${
                ativa ? "bg-white font-semibold shadow-cartao" : "font-medium"
              }`}
            >
              {rotulo}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
