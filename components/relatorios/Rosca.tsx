import type { Fatia } from "@/lib/relatorio";
import { Valor } from "@/components/ui/Valor";

/*
 * Paletas das roscas, nos tons do Figma (dourados para receita, vermelhos para
 * despesa) com os degraus afastados o suficiente para quem tem daltonismo
 * (conferido com o validador de paleta). A última cor, cinza, é sempre "Outras".
 */
export const CORES_RECEITA = ["#2b2d42", "#b07d12", "#ffd36a"];
export const CORES_DESPESA = ["#cc0000", "#f08a7a", "#7a1010"];
const COR_OUTRAS = "#8a909c";

const RAIO = 48;
const ESPESSURA = 16;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;
/** Espaço de 2 px entre as fatias, na cor do fundo. */
const VAO = 2;

type Props = {
  titulo: string;
  total: number;
  fatias: Fatia[];
  cores: string[];
  vazio: string;
};

function corDa(fatia: Fatia, indice: number, cores: string[]) {
  return fatia.nome === "Outras" ? COR_OUTRAS : cores[indice];
}

/** Rosca com o total no centro e legenda com percentuais (a cor nunca é a única pista). */
export function Rosca({ titulo, total, fatias, cores, vazio }: Props) {
  const totalArredondado = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
  // Início de cada arco = soma dos comprimentos das fatias anteriores.
  const arcos = fatias.map((fatia) => (fatia.valor / (total || 1)) * CIRCUNFERENCIA);
  const inicios = arcos.map((_, indice) => arcos.slice(0, indice).reduce((a, b) => a + b, 0));

  return (
    <figure className="flex min-w-0 flex-1 flex-col items-center gap-3 rounded-[12px] border border-black/8 bg-white p-3.5 shadow-cartao">
      <figcaption className="sr-only">{titulo}</figcaption>
      {total === 0 ? (
        <p className="py-10 text-center text-xs text-cinza-escuro">{vazio}</p>
      ) : (
        <>
          <div className="relative size-[116px]">
            <svg viewBox="0 0 116 116" className="size-full -rotate-90" aria-hidden>
              {fatias.map((fatia, indice) => {
                const comprimento = arcos[indice];
                const visivel = fatias.length > 1 ? Math.max(comprimento - VAO, 0.5) : comprimento;
                return (
                  <circle
                    key={fatia.nome}
                    cx="58"
                    cy="58"
                    r={RAIO}
                    fill="none"
                    stroke={corDa(fatia, indice, cores)}
                    strokeWidth={ESPESSURA}
                    strokeDasharray={`${visivel} ${CIRCUNFERENCIA - visivel}`}
                    strokeDashoffset={-inicios[indice]}
                  >
                    <title>{`${fatia.nome}: ${fatia.percentual}%`}</title>
                  </circle>
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-cinza-escuro">total</span>
              <Valor className="text-[13px] font-extrabold" texto={totalArredondado} />
            </div>
          </div>
          <ul className="flex w-full flex-col gap-1.5">
            {fatias.map((fatia, indice) => (
              <li key={fatia.nome} className="flex items-center gap-1.5 text-[11px]">
                <span
                  aria-hidden
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: corDa(fatia, indice, cores) }}
                />
                <span className="min-w-0 flex-1 truncate">{fatia.nome}</span>
                <span className="font-semibold">{fatia.percentual}%</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </figure>
  );
}
