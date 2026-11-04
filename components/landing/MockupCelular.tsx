/**
 * Celular desenhado em HTML com uma prévia da Home. Os valores são de exemplo;
 * nada aqui busca dados de verdade.
 */

const LINHAS = [
  { rotulo: "SALDO", valor: "R$ 1.284,50", cor: "text-positivo" },
  { rotulo: "RECEBIDOS", valor: "R$ 1.612,00", cor: "text-recebido" },
  { rotulo: "PENDENTES", valor: "R$ 96,00", cor: "text-pendente" },
  { rotulo: "DESPESAS", valor: "R$ 327,50", cor: "text-negativo" },
  { rotulo: "ENTREGAS", valor: "142", cor: "text-positivo" },
];

export function MockupCelular() {
  return (
    <div className="relative mx-auto w-[270px] text-marinho sm:w-[300px]">
      <div className="rounded-[44px] bg-marinho p-2.5 shadow-[0_40px_80px_-20px_rgba(43,45,66,0.55)] ring-1 ring-white/10">
        <div className="overflow-hidden rounded-[36px] bg-fundo">
          <div className="bg-[linear-gradient(180deg,#9196a2_0%,#2b2d42_100%)] px-4 pt-7 pb-4 text-white">
            <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-black/40" />
            <p className="text-[13px] font-black">SEJA BEM VINDO LUCAS! 🚀</p>
            <p className="text-[10px] text-cinza-claro">Bora pro corre!?</p>
          </div>
          <div className="flex flex-col gap-2 px-3.5 py-3.5">
            <p className="text-[8px] font-semibold tracking-[0.5px] text-cinza">MEU SALDO</p>
            <div className="rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-semibold shadow-cartao">Esta semana</div>
            {LINHAS.map(({ rotulo, valor, cor }) => (
              <div
                key={rotulo}
                className="flex items-center justify-between rounded-lg border border-black/5 bg-white px-2.5 py-2 shadow-cartao"
              >
                <span className="text-[10px] font-extrabold">{rotulo}:</span>
                <span className={`text-[11px] font-extrabold ${cor}`}>{valor}</span>
              </div>
            ))}
          </div>
          <div className="mx-3.5 mb-4 flex items-center justify-around rounded-xl bg-white py-2 text-[8px] text-cinza-escuro shadow-cartao">
            <span>Início</span>
            <span>Resumo</span>
            <span className="-mt-5 grid size-9 place-items-center rounded-full bg-dourado text-lg font-bold text-white shadow-cartao">
              +
            </span>
            <span>Relatórios</span>
            <span>Perfil</span>
          </div>
        </div>
      </div>

      {/* Cartões flutuantes: só aparecem onde há espaço ao lado do celular. */}
      <div className="absolute top-24 -left-24 hidden w-48 items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_20px_40px_-12px_rgba(43,45,66,0.35)] lg:flex">
        <svg viewBox="0 0 36 36" className="size-11 shrink-0 -rotate-90" aria-hidden>
          <circle cx="18" cy="18" r="15" fill="none" strokeWidth="4" className="stroke-cinza-fundo" />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${0.72 * 94.2} 94.2`}
            className="stroke-positivo"
          />
        </svg>
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold">Meta da semana</span>
          <span className="text-[10px] text-cinza-escuro">R$ 720 de R$ 1.000</span>
        </div>
      </div>
      <div className="absolute -right-20 bottom-28 hidden w-44 flex-col gap-1 rounded-2xl bg-white p-3 shadow-[0_20px_40px_-12px_rgba(43,45,66,0.35)] lg:flex">
        <span className="text-[11px] font-semibold">Conta: Financiamento</span>
        <span className="h-1.5 overflow-hidden rounded-full bg-cinza-fundo">
          <span className="block h-full w-3/5 rounded-full bg-dourado" />
        </span>
        <span className="text-[10px] text-cinza-escuro">Falta R$ 154 · vence em 6 dias</span>
      </div>
    </div>
  );
}
