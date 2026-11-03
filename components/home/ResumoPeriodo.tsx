"use client";

import Image from "next/image";
import { useState } from "react";
import { Calendario } from "./Calendario";
import { LinhaValor } from "@/components/ui/LinhaValor";
import { SeletorPeriodoAmplo } from "@/components/ui/SeletorPeriodoAmplo";
import { useMovimentacoes } from "@/hooks/useMovimentacoes";
import { formatarMoeda } from "@/lib/formatar";
import { intervaloDoPeriodo, type FiltroPeriodo } from "@/lib/periodo";
import { calcularTotais } from "@/lib/totais";

type Visao = "lista" | "calendario";

/**
 * Filtro de período e totais da Home. Em períodos de mais de um dia, um botão
 * troca as linhas de totais pelo calendário com receita e despesa de cada dia.
 */
export function ResumoPeriodo() {
  const [periodo, setPeriodo] = useState<FiltroPeriodo>({ tipo: "semana" });
  const [visao, setVisao] = useState<Visao>("lista");
  const { data, isError } = useMovimentacoes(periodo);
  const totais = calcularTotais(data?.receitas ?? [], data?.despesas ?? []);
  // Enquanto carrega, mostra "–" em vez de um R$ 0,00 que pareceria verdadeiro.
  const moeda = (valor: number) => (data ? formatarMoeda(valor) : "–");

  // "Hoje" é sempre a lista: um calendário de um quadrado só não diz nada.
  const permiteCalendario = periodo.tipo !== "dia";
  const mostrarCalendario = permiteCalendario && visao === "calendario";

  return (
    <section className="flex flex-col gap-[21px]">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <SeletorPeriodoAmplo valor={periodo} aoMudar={setPeriodo} />
        </div>
        {permiteCalendario && (
          <button
            type="button"
            onClick={() => setVisao(mostrarCalendario ? "lista" : "calendario")}
            aria-label={mostrarCalendario ? "Ver em lista" : "Ver em calendário"}
            className="grid size-[38px] shrink-0 place-items-center rounded-[10px] bg-cinza-fundo shadow-segmento"
          >
            <Image
              src={mostrarCalendario ? "/icones/vista-lista.svg" : "/icones/vista-calendario.svg"}
              alt=""
              width={20}
              height={20}
            />
          </button>
        )}
      </div>
      {isError && <p className="text-center text-xs text-negativo">Não foi possível carregar os totais.</p>}

      {mostrarCalendario ? (
        <div className="flex flex-col gap-2">
          <dl className="grid grid-cols-3 rounded-[10px] border border-black/8 bg-white px-3 py-2 text-center shadow-cartao">
            {[
              { rotulo: "Recebidos", valor: totais.recebidos, cor: "text-recebido" },
              { rotulo: "Despesas", valor: totais.despesas, cor: "text-negativo" },
              { rotulo: "Saldo", valor: totais.saldo, cor: totais.saldo < 0 ? "text-negativo" : "text-positivo" },
            ].map(({ rotulo, valor, cor }) => (
              <div key={rotulo}>
                <dt className="text-[10px] text-cinza-escuro">{rotulo}</dt>
                <dd className={`text-[13px] font-extrabold ${cor}`}>{moeda(valor)}</dd>
              </div>
            ))}
          </dl>
          {data && <Calendario {...intervaloDoPeriodo(periodo)} receitas={data.receitas} despesas={data.despesas} />}
        </div>
      ) : (
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
      )}
    </section>
  );
}
