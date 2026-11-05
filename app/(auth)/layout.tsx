import Image from "next/image";
import Link from "next/link";

const DESTAQUES = [
  { icone: "/icones/carteira.svg", texto: "Resumo diário, semanal e mensal do seu caixa!", caixa: true },
  { icone: "/icones/destaque-metas.svg", texto: "Determine metas, monte sua agenda de compromissos!" },
  { icone: "/icones/destaque-usuario.svg", texto: "Suas finanças organizadas em um só lugar!" },
];

/**
 * Casca das telas de Entrar e Cadastrar.
 * Celular: apresentação do app em cima e painel com o formulário embaixo.
 * Tablet: a mesma coluna vira um cartão centralizado.
 * Computador (lg): tela dividida, com a apresentação à esquerda e o formulário à direita.
 */
export default function LayoutAcesso({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-dvh bg-marinho md:max-lg:grid md:max-lg:place-items-center md:max-lg:py-10 lg:grid lg:grid-cols-[1.15fr_1fr]">
      {/* No computador esta coluna "some" (lg:contents) e cabeçalho e painel viram as duas metades. */}
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[linear-gradient(25deg,var(--color-marinho)_43%,var(--color-cinza)_105%)] md:max-lg:min-h-0 md:max-lg:overflow-hidden md:max-lg:rounded-[28px] md:max-lg:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] md:max-lg:ring-1 md:max-lg:ring-white/10 lg:contents">
        <header className="relative flex flex-col items-center overflow-hidden px-[39px] pt-[calc(env(safe-area-inset-top)+53px)] pb-6 text-cinza-claro lg:items-start lg:justify-center lg:bg-[linear-gradient(25deg,var(--color-marinho)_45%,var(--color-cinza)_130%)] lg:px-[clamp(3rem,7vw,7rem)] lg:py-16">
          {/* Brilho dourado discreto, o mesmo da landing. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-48 -left-24 hidden size-[520px] rounded-full bg-dourado/20 blur-[120px] lg:block"
          />
          <Link
            href="/apresentacao"
            className="relative mb-auto hidden text-sm font-medium text-cinza transition-colors hover:text-white lg:inline-flex"
          >
            ‹ Conhecer o No Corre!
          </Link>
          <div className="relative flex flex-col items-center lg:items-start">
            <div className="size-[108px] overflow-hidden rounded-[27px] bg-white lg:size-24 lg:rounded-3xl">
              <Image src="/imagens/logo.png" alt="" width={108} height={108} priority />
            </div>
            <h1 className="text-[22px] font-black lg:mt-6 lg:text-5xl lg:text-white">No Corre!</h1>
            <p className="text-[11px] font-semibold lg:mt-2 lg:text-lg lg:font-medium lg:text-dourado-claro">
              De Entregador para Entregador
            </p>
          </div>

          <ul className="relative mt-[30px] flex w-full flex-col gap-4 lg:mt-12 lg:max-w-md lg:gap-6">
            {DESTAQUES.map(({ icone, texto, caixa }) => (
              <li key={texto} className="flex items-center gap-[13px] text-xs font-medium lg:gap-4 lg:text-base">
                {caixa ? (
                  <span className="grid size-11 shrink-0 place-items-center rounded-[10px] bg-white shadow-[inset_2px_2px_6px_0px_rgba(0,0,0,0.15),inset_-2px_0px_6px_0px_rgba(0,0,0,0.25)]">
                    <Image src={icone} alt="" width={21} height={21} />
                  </span>
                ) : (
                  <Image src={icone} alt="" width={44} height={44} className="shrink-0" />
                )}
                {texto}
              </li>
            ))}
          </ul>
          <p className="relative mt-auto hidden pt-12 text-xs text-cinza lg:block">
            © {new Date().getFullYear()} No Corre! · Código aberto
          </p>
        </header>

        <main className="mt-auto flex flex-col gap-[11px] rounded-t-[20px] bg-painel px-[17px] pt-5 pb-[calc(env(safe-area-inset-bottom)+28px)] shadow-cartao lg:m-0 lg:justify-center lg:rounded-none lg:bg-fundo lg:px-[max(2.5rem,calc(50%-220px))] lg:py-16 lg:shadow-none">
          <div className="hidden lg:mb-4 lg:block">
            <h2 className="text-3xl font-extrabold">Bora pro corre!</h2>
            <p className="mt-1 text-sm text-cinza-escuro">Suas receitas e despesas organizadas, no celular ou no computador.</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
