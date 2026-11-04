import Image from "next/image";

const DESTAQUES = [
  { icone: "/icones/carteira.svg", texto: "Resumo diário, semanal e mensal do seu caixa!", caixa: true },
  { icone: "/icones/destaque-metas.svg", texto: "Determine metas, monte sua agenda de compromissos!" },
  { icone: "/icones/destaque-usuario.svg", texto: "Suas finanças organizadas em um só lugar!" },
];

/** Casca das telas de Entrar e Cadastrar: apresentação do app em cima e painel com o formulário embaixo. */
export default function LayoutAcesso({ children }: LayoutProps<"/">) {
  return (
    // No desktop a coluna de celular vira um cartão centralizado sobre o fundo marinho.
    <div className="min-h-dvh bg-marinho md:grid md:place-items-center md:py-10">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[linear-gradient(25deg,var(--color-marinho)_43%,var(--color-cinza)_105%)] md:min-h-0 md:overflow-hidden md:rounded-[28px] md:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] md:ring-1 md:ring-white/10">
        <header className="flex flex-col items-center px-[39px] pt-[calc(env(safe-area-inset-top)+53px)] pb-6 text-cinza-claro">
          <div className="size-[108px] overflow-hidden rounded-[27px] bg-white">
            <Image src="/imagens/logo.png" alt="" width={108} height={108} priority />
          </div>
          <h1 className="text-[22px] font-black">No Corre!</h1>
          <p className="text-[11px] font-semibold">De Entregador para Entregador</p>

          <ul className="mt-[30px] flex w-full flex-col gap-4">
            {DESTAQUES.map(({ icone, texto, caixa }) => (
              <li key={texto} className="flex items-center gap-[13px] text-xs font-medium">
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
        </header>

        <main className="mt-auto flex flex-col gap-[11px] rounded-t-[20px] bg-painel px-[17px] pt-5 pb-[calc(env(safe-area-inset-bottom)+28px)] shadow-cartao">
          {children}
        </main>
      </div>
    </div>
  );
}
