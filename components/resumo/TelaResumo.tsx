"use client";

import Image from "next/image";
import { useState } from "react";
import { CartaoSaldo } from "./CartaoSaldo";
import { ListaMovimentacoes } from "./ListaMovimentacoes";
import { PainelFiltros } from "./PainelFiltros";
import { SeletorPeriodoAmplo } from "@/components/ui/SeletorPeriodoAmplo";
import { useMovimentacoes, usePendentes } from "@/hooks/useMovimentacoes";
import {
  FILTROS_VAZIOS,
  montarExtrato,
  quantidadeFiltrosAtivos,
  type FiltroRapido,
  type Filtros,
} from "@/lib/filtros";
import { formatarMoeda } from "@/lib/formatar";
import { nomeDoPeriodo, type FiltroPeriodo } from "@/lib/periodo";
import { calcularTotais } from "@/lib/totais";

const RAPIDOS: { valor: FiltroRapido; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "receitas", rotulo: "Receitas" },
  { valor: "despesas", rotulo: "Despesas" },
  { valor: "pendentes", rotulo: "Pendentes" },
];

/** Extrato: saldo do período, filtros rápidos, painel de filtros e lista de movimentações. */
export function TelaResumo({ dia }: { dia?: string }) {
  const [periodo, setPeriodo] = useState<FiltroPeriodo>(
    dia ? { tipo: "personalizado", de: dia, ate: dia } : { tipo: "semana" },
  );
  const [rapido, setRapido] = useState<FiltroRapido>("todos");
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS);
  const [painelAberto, setPainelAberto] = useState(false);

  const movimentacoes = useMovimentacoes(periodo);
  // "Pendentes" mostra tudo o que falta receber, de qualquer data, não só do período.
  const pendentes = usePendentes();
  const consulta = rapido === "pendentes" ? pendentes : movimentacoes;

  const totais = movimentacoes.data
    ? calcularTotais(movimentacoes.data.receitas, movimentacoes.data.despesas)
    : null;
  const lista =
    rapido === "pendentes"
      ? (pendentes.data ?? []).map((dados) => ({ tipo: "receita" as const, dados }))
      : movimentacoes.data
        ? montarExtrato(movimentacoes.data.receitas, movimentacoes.data.despesas, rapido, filtros)
        : [];
  const aReceber = (pendentes.data ?? []).reduce((soma, r) => soma + Math.round((r.valor_total ?? 0) * 100), 0);
  const filtrosAtivos = quantidadeFiltrosAtivos(filtros);

  return (
    <main className="flex flex-col gap-3.5 px-[17px] pt-[calc(env(safe-area-inset-top)+12px)]">
      <header className="flex items-center justify-between">
        <h1 className="text-[22px] font-extrabold">Resumo</h1>
        <button
          type="button"
          onClick={() => setPainelAberto(true)}
          aria-label={filtrosAtivos ? `Filtros (${filtrosAtivos} ativos)` : "Filtros"}
          className="relative p-1"
        >
          <Image src="/icones/filtro.svg" alt="" width={22} height={22} />
          {filtrosAtivos > 0 && (
            <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-dourado text-[9px] font-bold">
              {filtrosAtivos}
            </span>
          )}
        </button>
      </header>

      <SeletorPeriodoAmplo valor={periodo} aoMudar={setPeriodo} />
      <CartaoSaldo nomePeriodo={nomeDoPeriodo(periodo)} totais={totais} />

      <div role="radiogroup" aria-label="Mostrar" className="-mx-[17px] flex gap-2 overflow-x-auto px-[17px]">
        {RAPIDOS.map(({ valor, rotulo }) => {
          const ativo = valor === rapido;
          return (
            <button
              key={valor}
              type="button"
              role="radio"
              aria-checked={ativo}
              onClick={() => setRapido(valor)}
              className={`shrink-0 rounded-full border px-4 py-[7px] text-xs ${
                ativo ? "border-marinho bg-marinho font-semibold text-white" : "border-cinza-claro bg-white font-medium"
              }`}
            >
              {rotulo}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.66px]">
        <h2 className="text-cinza">{rapido === "pendentes" ? "A RECEBER" : "MOVIMENTAÇÕES"}</h2>
        {rapido === "pendentes" && pendentes.data && (
          <span className="text-xs tracking-normal">{formatarMoeda(aReceber / 100)}</span>
        )}
        {rapido !== "pendentes" && filtrosAtivos > 0 && (
          <button type="button" onClick={() => setFiltros(FILTROS_VAZIOS)} className="text-xs tracking-normal">
            Limpar filtros
          </button>
        )}
      </div>

      {consulta.isPending && <p className="py-6 text-center text-[13px] text-cinza-escuro">Carregando...</p>}
      {consulta.isError && <p className="py-6 text-center text-[13px] text-negativo">{consulta.error.message}</p>}
      {consulta.data && lista.length === 0 && (
        <p className="rounded-[14px] border border-cinza-claro bg-white py-8 text-center text-[13px] text-cinza-escuro">
          {rapido === "pendentes" ? "Nada a receber. Tudo pago!" : "Nenhuma movimentação neste período."}
        </p>
      )}
      {lista.length > 0 && <ListaMovimentacoes movimentacoes={lista} />}

      {painelAberto && (
        <PainelFiltros filtros={filtros} aoAplicar={setFiltros} aoFechar={() => setPainelAberto(false)} />
      )}
    </main>
  );
}
