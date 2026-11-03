"use client";

import { useState } from "react";
import { LinhaValor } from "@/components/ui/LinhaValor";
import { SeletorPeriodo, type Periodo } from "@/components/ui/SeletorPeriodo";
import { formatarMoeda } from "@/lib/formatar";

/** Filtro de período e totais da Home. Os valores reais chegam na Etapa 6. */
export function ResumoPeriodo() {
  const [periodo, setPeriodo] = useState<Periodo>("semana");

  return (
    <section className="flex flex-col gap-[21px]">
      <SeletorPeriodo valor={periodo} aoMudar={setPeriodo} />
      <div className="flex flex-col gap-[5px]">
        <LinhaValor rotulo="Saldo" valor={formatarMoeda(0)} icone="/icones/saldo.svg" corValor="text-positivo" />
        <LinhaValor rotulo="Recebidos" valor={formatarMoeda(0)} icone="/icones/receita.svg" corValor="text-recebido" />
        <LinhaValor rotulo="Pendentes" valor={formatarMoeda(0)} icone="/icones/pendente.svg" corValor="text-pendente" />
        <LinhaValor rotulo="Despesas" valor={formatarMoeda(0)} icone="/icones/despesa.svg" corValor="text-negativo" />
        <LinhaValor rotulo="Entregas" valor="0" icone="/icones/moto.svg" corValor="text-positivo" />
      </div>
    </section>
  );
}
