/**
 * Celular desenhado em HTML. As telas imitam o app com valores de exemplo;
 * nada aqui busca dados de verdade.
 */

export function MockupCelular({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto w-[260px] text-marinho sm:w-[290px] ${className}`}>
      <div className="rounded-[46px] bg-[linear-gradient(145deg,#4a4d63,#1b1c29)] p-[9px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/15">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[38px] bg-fundo">
          <div className="absolute top-2.5 left-1/2 z-10 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
          {children}
        </div>
      </div>
    </div>
  );
}

function Topo({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
  return (
    <div className="bg-[linear-gradient(180deg,#9196a2_0%,#2b2d42_100%)] px-4 pt-11 pb-4 text-white">
      <p className="text-[13px] font-black">{titulo}</p>
      {subtitulo && <p className="text-[10px] text-cinza-claro">{subtitulo}</p>}
    </div>
  );
}

const LINHAS = [
  { rotulo: "SALDO", valor: "R$ 1.284,50", cor: "text-positivo" },
  { rotulo: "RECEBIDOS", valor: "R$ 1.612,00", cor: "text-recebido" },
  { rotulo: "PENDENTES", valor: "R$ 96,00", cor: "text-pendente" },
  { rotulo: "DESPESAS", valor: "R$ 327,50", cor: "text-negativo" },
  { rotulo: "ENTREGAS", valor: "142", cor: "text-positivo" },
];

export function TelaSaldo() {
  return (
    <>
      <Topo titulo="SEJA BEM VINDO LUCAS! 🚀" subtitulo="Bora pro corre!?" />
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
    </>
  );
}

export function TelaLancamento() {
  return (
    <>
      <Topo titulo="Nova receita" />
      <div className="flex flex-col gap-2.5 px-3.5 py-3.5 text-[10px]">
        <span className="font-semibold">Tipo</span>
        <div className="flex flex-wrap gap-1.5">
          {["Entrega", "Corrida", "Diária", "Gorjeta"].map((tipo, i) => (
            <span
              key={tipo}
              className={`rounded-full border px-2.5 py-1 ${i === 0 ? "border-marinho bg-marinho text-white" : "border-cinza-claro bg-white"}`}
            >
              {tipo}
            </span>
          ))}
        </div>
        <span className="font-semibold">Cliente</span>
        <div className="rounded-lg border border-cinza-claro bg-white px-2.5 py-2">Pizzaria Bella Massa</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Quantidade</span>
            <div className="rounded-lg border border-cinza-claro bg-white px-2.5 py-2">12</div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Valor</span>
            <div className="rounded-lg border border-cinza-claro bg-white px-2.5 py-2">R$ 8,00</div>
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between rounded-lg bg-positivo/12 px-2.5 py-2.5">
          <span className="font-semibold">Total</span>
          <span className="text-[13px] font-extrabold text-recebido">R$ 96,00</span>
        </div>
        <div className="mt-2 rounded-lg bg-[linear-gradient(90deg,var(--color-dourado-claro),var(--color-dourado))] py-2.5 text-center font-extrabold">
          Salvar receita
        </div>
      </div>
    </>
  );
}

export function TelaMeta() {
  const volta = 2 * Math.PI * 38;
  return (
    <>
      <Topo titulo="Metas" />
      <div className="flex flex-col items-center gap-3 px-3.5 py-5">
        <div className="relative grid size-32 place-items-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
            <circle cx="50" cy="50" r="38" fill="none" strokeWidth="10" className="stroke-cinza-fundo" />
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${0.72 * volta} ${volta}`}
              className="stroke-positivo"
            />
          </svg>
          <span className="text-2xl font-black text-recebido">72%</span>
        </div>
        <p className="text-[12px] font-bold">Meta da semana</p>
        <p className="text-[10px] text-cinza-escuro">R$ 720 de R$ 1.000</p>
        <div className="w-full rounded-lg bg-white px-3 py-2.5 text-center text-[10px] shadow-cartao">
          Faltam <b>R$ 280</b> em 3 dias
        </div>
        <div className="flex w-full items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-[10px] shadow-cartao">
          <span className="size-2 rounded-full bg-dourado" />
          <span className="flex-1">150 entregas no mês</span>
          <b>92%</b>
        </div>
      </div>
    </>
  );
}

export function TelaConta() {
  return (
    <>
      <Topo titulo="Conta a pagar" subtitulo="Financiamento da moto · 8 de 24" />
      <div className="flex flex-col gap-2.5 px-3.5 py-3.5 text-[10px]">
        <div className="flex flex-col gap-2 rounded-lg bg-white p-3 shadow-cartao">
          <div className="flex justify-between">
            <span className="font-semibold">Pago R$ 232 de R$ 386</span>
            <b className="text-pendente">60%</b>
          </div>
          <span className="h-2 overflow-hidden rounded-full bg-cinza-fundo">
            <span className="block h-full w-3/5 rounded-full bg-dourado" />
          </span>
          <span className="text-cinza-escuro">Falta R$ 154 · vence em 6 dias</span>
        </div>
        <p className="mt-1 text-[8px] font-semibold tracking-[0.5px] text-cinza">PAGAMENTOS</p>
        {[
          ["12/11", "R$ 132,00"],
          ["05/11", "R$ 100,00"],
        ].map(([data, valor]) => (
          <div key={data} className="flex justify-between rounded-lg bg-white px-3 py-2.5 shadow-cartao">
            <span>{data} · Pix</span>
            <b className="text-negativo">{valor}</b>
          </div>
        ))}
        <div className="mt-2 rounded-lg bg-marinho py-2.5 text-center font-bold text-white">Lançar pagamento</div>
      </div>
    </>
  );
}
