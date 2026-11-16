import { Revelar } from "./Revelar";
import type { Textos } from "./idiomas";

/** Ícones de linha, na ordem de `recursos.itens` (idiomas.ts). */
const ICONES = [
  // Saldo
  <path key="saldo" d="M3 7h18v10H3zM3 10h18M7 14h3" />,
  // Contas do mês
  <path key="contas" d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" />,
  // Sininho
  <path key="sino" d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0" />,
  // Relatórios
  <path key="relatorios" d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  // Agenda
  <path key="agenda" d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />,
  // Outras entradas
  <path key="entradas" d="M12 4v12M7 11l5 5 5-5M4 20h16" />,
  // Carteiras
  <path key="carteiras" d="M3 7a2 2 0 0 1 2-2h13v4M3 7v10a2 2 0 0 0 2 2h16V9H5a2 2 0 0 1-2-2zM16.5 14h.01" />,
  // Saúde da moto
  <g key="moto">
    <circle cx="5.5" cy="16.5" r="3.5" />
    <circle cx="18.5" cy="16.5" r="3.5" />
    <path d="M5.5 16.5 9 10h5l2.5 6.5M14 10l1.5-3H18" />
  </g>,
];

/** Quantos itens do fim da lista são do plano Pro. */
const QUANTOS_PRO = 2;

/**
 * Grade "tudo o que o app já faz": um cartão por recurso, com selo PRO nos
 * que dependem do plano. Complementa a história do celular, que mostra só
 * algumas telas.
 */
export function Recursos({ t }: { t: Textos }) {
  const { itens } = t.recursos;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {itens.map(({ titulo, texto }, indice) => {
        const pro = indice >= itens.length - QUANTOS_PRO;
        return (
          <li key={titulo}>
            <Revelar atraso={(indice % 4) * 90} className="h-full">
              <div className="group flex h-full flex-col gap-3 rounded-2xl border border-l-tinta/10 bg-l-tinta/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-l-destaque/50 hover:bg-l-tinta/[0.07]">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-l-destaque/15 text-l-destaque">
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {ICONES[indice]}
                    </svg>
                  </span>
                  {pro && (
                    <span className="rounded-md bg-l-titulo px-2 py-0.5 text-[10px] font-bold tracking-[0.6px] text-l-fundo">PRO</span>
                  )}
                </div>
                <h3 className="font-titulo text-lg font-bold tracking-[-0.02em] text-l-titulo">{titulo}</h3>
                <p className="text-sm leading-relaxed text-l-texto">{texto}</p>
              </div>
            </Revelar>
          </li>
        );
      })}
    </ul>
  );
}
