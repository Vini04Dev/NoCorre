"use client";

import { useState } from "react";
import { LinhaValor } from "@/components/ui/LinhaValor";
import { SeletorPeriodo, type Periodo } from "@/components/ui/SeletorPeriodo";
import { useMovimentacoes } from "@/hooks/useMovimentacoes";
import { formatarMoeda } from "@/lib/formatar";
import { calcularTotais } from "@/lib/totais";

/** Filtro de período e totais da Home. */
export function ResumoPeriodo() {
  const [periodo, setPeriodo] = useState<Periodo>("semana");
  const { data, isError } = useMovimentacoes(periodo);
  const totais = calcularTotais(data?.receitas ?? [], data?.despesas ?? []);
  // Enquanto carrega, mostra "–" em vez de um R$ 0,00 que pareceria verdadeiro.
  const moeda = (valor: number) => (data ? formatarMoeda(valor) : "–");

  return (
    <section className="flex flex-col gap-[21px]">
      <SeletorPeriodo valor={periodo} aoMudar={setPeriodo} />
      {isError && <p className="text-center text-xs text-negativo">Não foi possível carregar os totais.</p>}
      <div className="flex flex-col gap-[5px]">
        <LinhaValor
          rotulo="Saldo"
          valor={moeda(totais.saldo)}
          icone="/icones/saldo.svg"
          corValor={totais.saldo < 0 ? "text-negativo" : "text-positivo"}
        />
        <LinhaValor rotulo="Recebidos" valor={moeda(totais.recebidos)} icone="/icones/receita.svg" corValor="text-recebido" />
        <LinhaValor rotulo="Pendentes" valor={moeda(totais.pendentes)} icone="/icones/pendente.svg" corValor="text-pendente" />
        <LinhaValor rotulo="Despesas" valor={moeda(totais.despesas)} icone="/icones/despesa.svg" corValor="text-negativo" />
        <LinhaValor
          rotulo="Entregas"
          valor={data ? String(totais.entregas) : "–"}
          icone="/icones/moto.svg"
          corValor="text-positivo"
        />
      </div>
    </section>
  );
}
