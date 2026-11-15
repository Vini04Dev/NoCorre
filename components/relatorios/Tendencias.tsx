import { Valor } from "@/components/ui/Valor";
import { formatarMoeda } from "@/lib/formatar";
import type { NumerosCorre } from "@/lib/relatorio";

type Previsao = { receita: number; despesa: number; saldo: number; diasRestantes: number } | null;

const CARTAO = "rounded-[12px] border border-cinza-claro bg-white px-3.5 py-3";

/**
 * Diferença contra o período anterior, em reais ou em quantidade:
 * "R$ 30 a mais que na semana passada". Verde quando é bom, vermelho quando
 * é ruim, cinza quando não dá para comparar.
 */
function Comparacao({
  atual,
  antes,
  dinheiro = true,
  comparado,
  unidade,
}: {
  atual: number;
  antes: number;
  dinheiro?: boolean;
  comparado: string;
  unidade?: [string, string];
}) {
  if (antes === 0) return <span className="text-[11px] text-cinza-escuro">Sem dados {comparado.replace(/^que /, "")} para comparar</span>;
  const diferenca = Math.round((atual - antes) * 100) / 100;
  if (diferenca === 0) return <span className="text-[11px] text-cinza-escuro">O mesmo {comparado}</span>;
  const mais = diferenca > 0;
  const valor = Math.abs(diferenca);
  return (
    <span className={`text-[11px] ${mais ? "text-recebido" : "text-negativo"}`}>
      <b>
        {dinheiro ? (
          <Valor texto={formatarMoeda(valor)} />
        ) : (
          `${valor.toLocaleString("pt-BR")}${unidade ? ` ${valor === 1 ? unidade[0] : unidade[1]}` : ""}`
        )}{" "}
        a {mais ? "mais" : "menos"}
      </b>{" "}
      <span className="text-cinza-escuro">{comparado}</span>
    </span>
  );
}

/**
 * "Como foi o corre": o período em frases simples e em reais, com a diferença
 * para o período anterior (sem porcentagem, que confunde). No mês atual, o
 * ritmo até o fim do mês.
 */
export function Tendencias({
  atual,
  anterior,
  comparado,
  nomePeriodo,
  previsao,
}: {
  atual: NumerosCorre;
  anterior: NumerosCorre;
  comparado: string;
  nomePeriodo: string;
  previsao: Previsao;
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">COMO FOI O CORRE</h2>
      <div className="grid grid-cols-2 gap-2 lg:gap-3 xl:grid-cols-4">
        <div className={`${CARTAO} col-span-2 flex flex-col gap-2 sm:flex-row sm:gap-6 xl:col-span-4`}>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-[11px] text-cinza-escuro">Você recebeu {nomePeriodo}</span>
            <span className="text-2xl font-extrabold text-recebido">
              <Valor texto={formatarMoeda(atual.recebido)} />
            </span>
            <Comparacao atual={atual.recebido} antes={anterior.recebido} comparado={comparado} />
          </div>
          <div className="flex flex-1 flex-col gap-0.5 border-t border-cinza-claro pt-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
            <span className="text-[11px] text-cinza-escuro">Sobrou, tirando os custos do corre</span>
            <span className={`text-2xl font-extrabold ${atual.sobrou < 0 ? "text-negativo" : "text-positivo"}`}>
              <Valor texto={formatarMoeda(atual.sobrou)} />
            </span>
            <Comparacao atual={atual.sobrou} antes={anterior.sobrou} comparado={comparado} />
          </div>
        </div>

        <div className={`${CARTAO} flex flex-col gap-0.5`}>
          <span className="text-[11px] text-cinza-escuro">Entregas</span>
          <span className="text-lg font-extrabold">{atual.entregas.toLocaleString("pt-BR")}</span>
          <span className="text-[11px] text-cinza-escuro">
            em {atual.diasTrabalhados} {atual.diasTrabalhados === 1 ? "dia trabalhado" : "dias trabalhados"}
          </span>
        </div>
        <div className={`${CARTAO} flex flex-col gap-0.5`}>
          <span className="text-[11px] text-cinza-escuro">Por dia trabalhado</span>
          <span className="text-lg font-extrabold">
            <Valor texto={formatarMoeda(atual.porDia)} />
          </span>
          <Comparacao atual={atual.porDia} antes={anterior.porDia} comparado={comparado} />
        </div>
        <div className={`${CARTAO} flex flex-col gap-0.5`}>
          <span className="text-[11px] text-cinza-escuro">Por entrega</span>
          <span className="text-lg font-extrabold">
            <Valor texto={formatarMoeda(atual.porEntrega)} />
          </span>
          <Comparacao atual={atual.porEntrega} antes={anterior.porEntrega} comparado={comparado} />
        </div>
        <div className={`${CARTAO} flex flex-col gap-0.5`}>
          <span className="text-[11px] text-cinza-escuro">Custo do corre</span>
          <span className="text-lg font-extrabold">
            <Valor texto={formatarMoeda(atual.custoACada100)} />
          </span>
          <span className="text-[11px] text-cinza-escuro">
            de cada <Valor texto="R$ 100" /> recebidos
            {atual.maiorCusto && `, mais em ${atual.maiorCusto.toLowerCase()}`}
          </span>
        </div>
      </div>

      {previsao && (
        <div className={`${CARTAO} flex flex-col gap-1 bg-marinho text-white`}>
          <span className="text-xs font-bold">Se continuar nesse ritmo</span>
          <p className="text-[13px] leading-snug text-white/90">
            O mês fecha com cerca de{" "}
            <b className="text-dourado-claro">
              <Valor texto={formatarMoeda(previsao.receita)} />
            </b>{" "}
            recebidos e{" "}
            <b className={previsao.saldo < 0 ? "text-[#f08a7a]" : "text-[#9be15d]"}>
              <Valor texto={formatarMoeda(previsao.saldo)} />
            </b>{" "}
            de sobra do corre. Faltam {previsao.diasRestantes} {previsao.diasRestantes === 1 ? "dia" : "dias"}.
          </p>
        </div>
      )}
    </section>
  );
}
