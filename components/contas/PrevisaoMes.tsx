"use client";

import { Valor } from "@/components/ui/Valor";
import { useContagemPagamentos, useContasFixas, useContasPagasNoMes } from "@/hooks/useContasFixas";
import { progressoParcelas } from "@/lib/contas-fixas";
import { useMovimentacoes } from "@/hooks/useMovimentacoes";
import { formatarMoeda } from "@/lib/formatar";
import { ritmoAteOFimDoMes } from "@/lib/relatorio";
import { calcularTotais } from "@/lib/totais";

/**
 * Previsão do fim do mês nos Relatórios, numa conta só: o saldo do mês até
 * agora (o mesmo do Início), mais o que está pendente, menos as contas fixas
 * que faltam. Embaixo, à parte e como estimativa, quanto o corre ainda deve
 * render no ritmo de hoje (antes eram duas previsões que não batiam).
 */
export function PrevisaoMes() {
  const { data } = useMovimentacoes({ tipo: "mes" });
  const contas = useContasFixas();
  const pagas = useContasPagasNoMes();
  const contagem = useContagemPagamentos();
  if (!data || !contas.data || !pagas.data) return null;

  const { saldo, pendentes } = calcularTotais(data.receitas, data.despesas, data.entradas);
  const faltaPagar = contas.data
    .filter((conta) => conta.ativa && !pagas.data.has(conta.id) && !progressoParcelas(conta, contagem.data?.get(conta.id) ?? 0)?.quitada)
    .reduce((soma, conta) => soma + conta.valor, 0);
  const sobra = saldo + pendentes - faltaPagar;
  const ritmo = ritmoAteOFimDoMes(calcularTotais(data.receitas, []).recebidos);

  const linhas = [
    { rotulo: "Saldo do mês até agora", valor: saldo, sinal: "" },
    { rotulo: "A receber (pendentes)", valor: pendentes, sinal: "+ " },
    ...(contas.data.length ? [{ rotulo: "Contas fixas que faltam", valor: faltaPagar, sinal: "− " }] : []),
  ];

  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">FIM DO MÊS</h2>
      <div className="flex flex-col gap-2 rounded-[14px] border border-black/8 bg-white px-4 py-3.5 shadow-cartao">
        <ul className="flex flex-col gap-1 text-xs">
          {linhas.map(({ rotulo, valor, sinal }) => (
            <li key={rotulo} className="flex justify-between gap-2">
              <span className="text-cinza-escuro">{rotulo}</span>
              <span className="font-semibold">
                <Valor texto={`${sinal}${formatarMoeda(valor)}`} />
              </span>
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between border-t border-cinza-claro pt-2">
          <span className="text-sm font-bold">Deve sobrar</span>
          <span className={`text-lg font-extrabold ${sobra >= 0 ? "text-positivo" : "text-negativo"}`}>
            <Valor texto={formatarMoeda(sobra)} />
          </span>
        </div>
        <p className="text-[11px] text-cinza-escuro">
          {ritmo ? (
            <>
              Conta só o que já está lançado. No ritmo de hoje, o corre ainda deve render cerca de{" "}
              <b className="text-marinho">
                <Valor texto={formatarMoeda(ritmo.aMais)} />
              </b>{" "}
              até o fim do mês ({ritmo.diasRestantes} {ritmo.diasRestantes === 1 ? "dia" : "dias"}).
            </>
          ) : (
            "Conta só o que já está lançado. Cada entrega nova aumenta a sobra."
          )}
        </p>
      </div>
    </section>
  );
}
