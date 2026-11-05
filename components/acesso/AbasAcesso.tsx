import Link from "next/link";

const ABAS = [
  { href: "/entrar", rotulo: "Entrar" },
  { href: "/cadastrar", rotulo: "Cadastrar" },
] as const;

/** Alternância entre Entrar e Cadastrar no topo do painel. */
export function AbasAcesso({ ativa }: { ativa: "/entrar" | "/cadastrar" }) {
  return (
    <nav className="grid grid-cols-2 rounded-[10px] bg-white/90 lg:ring-1 lg:ring-black/8">
      {ABAS.map(({ href, rotulo }) => {
        const atual = href === ativa;
        return (
          <Link
            key={href}
            href={href}
            aria-current={atual ? "page" : undefined}
            className={`rounded-[10px] py-[7px] text-center text-base font-semibold ${
              atual ? "bg-marinho text-white" : "text-[#b4b4b4]"
            }`}
          >
            {rotulo}
          </Link>
        );
      })}
    </nav>
  );
}
