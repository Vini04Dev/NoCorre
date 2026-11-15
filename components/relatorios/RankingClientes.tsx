"use client";

import { useRouter } from "next/navigation";
import { Valor } from "@/components/ui/Valor";
import { gravarEstadoDaTela } from "@/hooks/useEstadoDaTela";
import { FILTROS_VAZIOS } from "@/lib/filtros";
import { formatarMoeda } from "@/lib/formatar";
import type { FiltroPeriodo } from "@/lib/periodo";
import type { CriterioRanking, PosicaoCliente } from "@/lib/relatorio";

type Props = {
  total: number;
  posicoes: PosicaoCliente[];
  criterio: CriterioRanking;
  aoMudarCriterio: (criterio: CriterioRanking) => void;
  /** Período dos Relatórios: o Resumo abre no mesmo. */
  periodo: FiltroPeriodo;
};

const CRITERIOS: { valor: CriterioRanking; rotulo: string }[] = [
  { valor: "entregas", rotulo: "Entregas" },
  { valor: "valor", rotulo: "Valor" },
];

/**
 * "Onde mais entrego": cada cliente com entregas e valor recebido lado a lado,
 * ordenado por um dos dois. Tocar num cliente abre o Resumo só com as receitas
 * dele no mesmo período (o jeito fácil de ver "quanto fiz só no iFood").
 */
export function RankingClientes({ total, posicoes, criterio, aoMudarCriterio, periodo }: Props) {
  const router = useRouter();
  const medida = (p: PosicaoCliente) => (criterio === "valor" ? p.valor : p.quantidade);
  const maior = posicoes[0] ? medida(posicoes[0]) : 0;

  const abrirNoResumo = (clienteId: string) => {
    gravarEstadoDaTela("resumo:periodo", periodo);
    gravarEstadoDaTela("resumo:rapido", "receitas");
    gravarEstadoDaTela("resumo:filtros", { ...FILTROS_VAZIOS, clienteId });
    router.push("/resumo");
  };

  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold">
        <h2 className="tracking-[0.66px] text-cinza">ONDE MAIS ENTREGO</h2>
        <div role="radiogroup" aria-label="Ordenar por" className="flex rounded-full bg-cinza-fundo p-0.5">
          {CRITERIOS.map(({ valor, rotulo }) => (
            <button
              key={valor}
              type="button"
              role="radio"
              aria-checked={criterio === valor}
              onClick={() => aoMudarCriterio(valor)}
              className={`rounded-full px-2.5 py-1 text-[11px] ${criterio === valor ? "bg-white font-bold shadow-cartao" : "font-medium text-cinza-escuro"}`}
            >
              {rotulo}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-[12px] border border-cinza-claro bg-white px-1.5 py-1.5">
        {posicoes.length === 0 ? (
          <p className="py-4 text-center text-xs text-cinza-escuro">Nenhuma receita neste período.</p>
        ) : (
          <ol className="flex flex-col">
            {posicoes.map((p, indice) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => abrirNoResumo(p.id)}
                  aria-label={`${p.nome}: ver as receitas no Resumo`}
                  className="flex w-full flex-col gap-1 rounded-[10px] px-2.5 py-2 text-left transition-colors hover:bg-cinza-fundo"
                >
                  <span className="flex w-full items-center gap-2.5">
                    <span className="w-3 text-[11px] font-semibold text-cinza">{indice + 1}</span>
                    <span className="w-24 truncate text-xs font-semibold">{p.nome}</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-cinza-claro" aria-hidden>
                      <span
                        className={`block h-full rounded-full ${indice === 0 ? "bg-marinho" : "bg-dourado-claro"}`}
                        style={{ width: `${maior ? (medida(p) / maior) * 100 : 0}%` }}
                      />
                    </span>
                    <span className="w-9 text-right text-[11px] font-extrabold">{p.percentual}%</span>
                    <span aria-hidden className="text-sm text-cinza">
                      ›
                    </span>
                  </span>
                  <span className="pl-[22px] text-[11px] text-cinza-escuro">
                    {p.quantidade} {p.quantidade === 1 ? "entrega" : "entregas"} ·{" "}
                    <span className="font-semibold text-recebido">
                      <Valor texto={formatarMoeda(p.valor)} />
                    </span>
                    {p.aReceber > 0 && (
                      <>
                        {" "}
                        · <Valor texto={formatarMoeda(p.aReceber)} /> a receber
                      </>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
      <p className="px-1 text-[11px] text-cinza-escuro">
        {criterio === "valor" ? (
          <>
            Total recebido: <Valor texto={formatarMoeda(total)} />.
          </>
        ) : (
          `${total} ${total === 1 ? "entrega" : "entregas"} no período.`
        )}{" "}
        Toque num cliente para ver as receitas dele.
      </p>
    </section>
  );
}
