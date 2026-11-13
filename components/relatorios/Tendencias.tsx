import { formatarMoeda } from "@/lib/formatar";
import type { Tendencia } from "@/lib/relatorio";
import { Valor } from "@/components/ui/Valor";

type Previsao = { receita: number; despesa: number; saldo: number; diasRestantes: number } | null;

const CARTAO = "rounded-[12px] border border-cinza-claro bg-white px-3.5 py-3";

/** Seta, percentual e cor: verde quando a mudança é boa, vermelho quando é ruim. */
function Variacao({ tendencia }: { tendencia: Tendencia }) {
  const { variacao, subirEhBom } = tendencia;
  if (variacao === null) return <span className="text-[11px] text-cinza-escuro">sem base para comparar</span>;
  if (variacao === 0) return <span className="text-[11px] text-cinza-escuro">= igual ao anterior</span>;
  const subiu = variacao > 0;
  const bom = subiu === subirEhBom;
  return (
    <span className={`text-[11px] font-semibold ${bom ? "text-recebido" : "text-negativo"}`}>
      {subiu ? "▲" : "▼"} {Math.abs(variacao)}% <span className="font-normal text-cinza-escuro">vs anterior</span>
    </span>
  );
}

/**
 * Tendências: cada número do período com a variação contra o período anterior
 * de mesmo tamanho. No mês atual, soma a previsão para o fim do mês.
 */
export function Tendencias({ itens, previsao }: { itens: Tendencia[]; previsao: Previsao }) {
  const formatar = (t: Tendencia, valor: number) =>
    t.dinheiro ? <Valor texto={formatarMoeda(valor)} /> : valor.toLocaleString("pt-BR");
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">TENDÊNCIAS</h2>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-5 lg:gap-3">
        {itens.map((t) => (
          <div key={t.chave} className={`${CARTAO} flex flex-col gap-0.5 ${t.chave === "ticket" ? "col-span-2 lg:col-span-1" : ""}`}>
            <span className="text-[11px] text-cinza-escuro">{t.rotulo}</span>
            <span className={`text-base font-extrabold ${t.chave === "saldo" && t.atual < 0 ? "text-negativo" : ""}`}>
              {formatar(t, t.atual)}
            </span>
            <Variacao tendencia={t} />
          </div>
        ))}
      </div>
      {previsao && (
        <div className={`${CARTAO} flex flex-col gap-2 bg-marinho text-white`}>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold">Ritmo do corre até o fim do mês</span>
            <span className="text-[11px] text-cinza">no ritmo atual · faltam {previsao.diasRestantes} dias</span>
          </div>
          <dl className="grid grid-cols-3 text-center">
            {[
              { rotulo: "Receita", valor: previsao.receita, cor: "text-dourado-claro" },
              { rotulo: "Despesas", valor: previsao.despesa, cor: "text-[#f08a7a]" },
              { rotulo: "Saldo", valor: previsao.saldo, cor: previsao.saldo < 0 ? "text-[#f08a7a]" : "text-[#9be15d]" },
            ].map(({ rotulo, valor, cor }) => (
              <div key={rotulo} className="flex flex-col-reverse">
                <dt className="text-[10px] text-cinza">{rotulo}</dt>
                <dd className={`text-sm font-extrabold ${cor}`}>
                  <Valor texto={formatarMoeda(valor)} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
