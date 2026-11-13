"use client";

import { Valor } from "@/components/ui/Valor";
import { useContagemPagamentos, useContasFixas, useContasPagasNoMes } from "@/hooks/useContasFixas";
import { progressoParcelas } from "@/lib/contas-fixas";
import { useMovimentacoes } from "@/hooks/useMovimentacoes";
import { formatarMoeda } from "@/lib/formatar";
import { calcularTotais } from "@/lib/totais";

/**
 * Previsão do fim do mês (ideia vinda do "Saldo previsto" do Recta), nos
 * Relatórios: quanto deve sobrar se o que está pendente for recebido e as
 * contas fixas que faltam forem pagas. Só soma o que o app já sabe; não chuta
 * receita futura (isso é a projeção das tendências).
 */
export function PrevisaoMes() {
  const { data } = useMovimentacoes({ tipo: "mes" });
  const contas = useContasFixas();
  const pagas = useContasPagasNoMes();
  const contagem = useContagemPagamentos();
  if (!data || !contas.data || !pagas.data) return null;

  const { saldo, pessoais, pendentes } = calcularTotais(data.receitas, data.despesas);
  const entradas = data.entradas.reduce((soma, e) => soma + e.valor, 0);
  const faltaPagar = contas.data
    .filter((conta) => conta.ativa && !pagas.data.has(conta.id) && !progressoParcelas(conta, contagem.data?.get(conta.id) ?? 0)?.quitada)
    .reduce((soma, conta) => soma + conta.valor, 0);
  const sobra = saldo - pessoais + entradas + pendentes - faltaPagar;

  const linhas = [
    { rotulo: "Saldo do corre no mês", valor: saldo, sinal: "" },
    ...(pessoais > 0 ? [{ rotulo: "Gastos pessoais", valor: pessoais, sinal: "− " }] : []),
    ...(entradas > 0 ? [{ rotulo: "Outras entradas", valor: entradas, sinal: "+ " }] : []),
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
        <p className="text-[11px] text-cinza-escuro">Conta só o que já está lançado. Cada entrega nova aumenta a sobra.</p>
      </div>
    </section>
  );
}
