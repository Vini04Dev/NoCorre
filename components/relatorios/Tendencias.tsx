import { Comparacao } from "./Comparacao";
import { Valor } from "@/components/ui/Valor";
import { formatarMoeda } from "@/lib/formatar";
import type { NumerosCorre } from "@/lib/relatorio";

const CARTAO = "rounded-[12px] border border-cinza-claro bg-white px-3.5 py-3";

/**
 * "O corre": só o trabalho (sem salário e outras rendas, que ficam em "Seu
 * dinheiro"). O que recebeu e o que sobrou tirando os custos do corre, e os
 * números de ritmo: entregas, por dia, por entrega e quanto foi para custos.
 * Cada um com a diferença para o período anterior, em reais ou quantidade.
 */
export function Tendencias({ atual, anterior, comparado }: { atual: NumerosCorre; anterior: NumerosCorre; comparado: string }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">O CORRE</h2>
      <div className="grid grid-cols-2 gap-2 lg:gap-3 xl:grid-cols-4">
        <div className={`${CARTAO} col-span-2 grid grid-cols-2 gap-3 xl:col-span-4`}>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[11px] text-cinza-escuro">Recebeu no corre</span>
            <span className="text-xl font-extrabold text-recebido">
              <Valor texto={formatarMoeda(atual.recebido)} />
            </span>
            <Comparacao atual={atual.recebido} antes={anterior.recebido} comparado={comparado} />
          </div>
          <div className="flex min-w-0 flex-col gap-0.5 border-l border-cinza-claro pl-3">
            <span className="text-[11px] text-cinza-escuro">Sobrou do corre</span>
            <span className={`text-xl font-extrabold ${atual.sobrou < 0 ? "text-negativo" : "text-positivo"}`}>
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
          <span className="text-[11px] text-cinza-escuro">Custos do corre</span>
          <span className="text-lg font-extrabold text-negativo">
            <Valor texto={formatarMoeda(atual.custo)} />
          </span>
          <span className="text-[11px] text-cinza-escuro">
            {atual.custoPercentual}% do que recebeu
            {atual.maiorCusto && `, mais em ${atual.maiorCusto.toLowerCase()}`}
          </span>
        </div>
      </div>
    </section>
  );
}
