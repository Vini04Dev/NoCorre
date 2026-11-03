import type { PosicaoCliente } from "@/lib/relatorio";

type Props = { total: number; posicoes: PosicaoCliente[] };

/**
 * "Onde mais entrego": clientes com mais receitas (soma da quantidade, de qualquer
 * categoria, como a linha Entregas da Home), com barra proporcional ao primeiro.
 */
export function RankingClientes({ total, posicoes }: Props) {
  const maior = posicoes[0]?.quantidade ?? 0;

  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <h2 className="tracking-[0.66px] text-cinza">ONDE MAIS ENTREGO</h2>
        <span>
          {total} {total === 1 ? "entrega" : "entregas"}
        </span>
      </div>
      <div className="rounded-[12px] border border-cinza-claro bg-white px-4 py-2.5">
        {posicoes.length === 0 ? (
          <p className="py-4 text-center text-xs text-cinza-escuro">Nenhuma receita neste período.</p>
        ) : (
          <ol className="flex flex-col gap-1.5">
            {posicoes.map((posicao, indice) => (
              <li key={posicao.nome} className="flex items-center gap-2.5">
                <span className="w-3 text-[11px] font-semibold text-cinza">{indice + 1}</span>
                <span className="w-24 truncate text-xs font-semibold">{posicao.nome}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-cinza-claro" aria-hidden>
                  <span
                    className={`block h-full rounded-full ${indice === 0 ? "bg-marinho" : "bg-dourado-claro"}`}
                    style={{ width: `${(posicao.quantidade / maior) * 100}%` }}
                  />
                </span>
                <span className="flex w-[58px] items-baseline justify-end gap-1">
                  <span className="text-[13px] font-extrabold">{posicao.quantidade}</span>
                  <span className="text-[9px] text-cinza">{posicao.percentual}%</span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
