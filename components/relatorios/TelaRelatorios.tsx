"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { GraficoBarras } from "./GraficoBarras";
import { ListaAvisos } from "./ListaAvisos";
import { RankingClientes } from "./RankingClientes";
import { CORES_DESPESA, CORES_RECEITA, Rosca } from "./Rosca";
import { Botao } from "@/components/ui/Botao";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { SeletorPeriodoAmplo } from "@/components/ui/SeletorPeriodoAmplo";
import { useClientes } from "@/hooks/useClientes";
import { useEstadoDaTela } from "@/hooks/useEstadoDaTela";
import { usePendentes, useRelatorio } from "@/hooks/useMovimentacoes";
import type { FiltroPeriodo } from "@/lib/periodo";
import { gerarAvisos, porCategoria, rankingClientes, receitaPorDia } from "@/lib/relatorio";

/**
 * Relatórios: não repete os números da Home. Mostra receita por dia, receitas e
 * despesas por categoria, onde mais trabalho e avisos. Filtros por período e cliente.
 */
export function TelaRelatorios() {
  const [periodo, setPeriodo] = useEstadoDaTela<FiltroPeriodo>("relatorios:periodo", { tipo: "semana" });
  const [clienteId, setClienteId] = useEstadoDaTela("relatorios:cliente", "");
  const [painelAberto, setPainelAberto] = useState(false);
  const { data: clientes } = useClientes();
  const relatorio = useRelatorio(periodo);
  const pendentes = usePendentes();

  const nomeCliente = clientes?.find((c) => c.id === clienteId)?.nome;
  const doCliente = <T extends { cliente_id: string }>(lista: T[]) =>
    clienteId ? lista.filter((r) => r.cliente_id === clienteId) : lista;

  const dados = relatorio.data;
  const receitas = dados ? doCliente(dados.atual.receitas) : [];
  const despesas = dados?.atual.despesas ?? [];
  const categoriasReceita = porCategoria(receitas.filter((r) => r.status_pagamento === "pago"));
  const categoriasDespesa = porCategoria(despesas);
  const ranking = rankingClientes(receitas);
  const avisos = dados
    ? gerarAvisos({ receitas, despesas }, dados.anterior, doCliente(pendentes.data ?? []))
    : [];

  return (
    <main className="flex flex-col gap-[18px] px-[17px] pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
      <header className="flex items-center justify-between">
        <h1 className="text-[22px] font-extrabold">Relatórios</h1>
        <button
          type="button"
          onClick={() => setPainelAberto(true)}
          aria-label={nomeCliente ? `Filtro de cliente: ${nomeCliente}` : "Filtrar por cliente"}
          className="relative p-1"
        >
          <Image src="/icones/filtro.svg" alt="" width={22} height={22} />
          {clienteId && <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-dourado" />}
        </button>
      </header>

      <SeletorPeriodoAmplo valor={periodo} aoMudar={setPeriodo} />

      {nomeCliente && (
        <p className="-mt-2 flex items-center justify-between rounded-[10px] bg-dourado-claro/40 px-3 py-2 text-xs">
          <span>
            Receitas de <strong>{nomeCliente}</strong>. Despesas não têm cliente e aparecem todas.
          </span>
          <button type="button" onClick={() => setClienteId("")} className="font-semibold">
            Limpar
          </button>
        </p>
      )}

      {relatorio.isPending && <p className="py-6 text-center text-[13px] text-cinza-escuro">Carregando...</p>}
      {relatorio.isError && <p className="py-6 text-center text-[13px] text-negativo">{relatorio.error.message}</p>}

      {dados && (
        <>
          <GraficoBarras barras={receitaPorDia(receitas, dados.inicio, dados.fim)} />

          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <h2 className="tracking-[0.66px] text-cinza">POR CATEGORIA</h2>
              <span>Receitas · Despesas</span>
            </div>
            <div className="flex gap-3">
              <Rosca
                titulo="Receitas pagas por categoria"
                total={categoriasReceita.total}
                fatias={categoriasReceita.fatias}
                cores={CORES_RECEITA}
                vazio="Sem receitas pagas."
              />
              <Rosca
                titulo="Despesas por categoria"
                total={categoriasDespesa.total}
                fatias={categoriasDespesa.fatias}
                cores={CORES_DESPESA}
                vazio="Sem despesas."
              />
            </div>
          </section>

          <RankingClientes total={ranking.total} posicoes={ranking.posicoes} />
          <ListaAvisos avisos={avisos} />
        </>
      )}

      {painelAberto && (
        <PainelCliente
          clienteId={clienteId}
          aoAplicar={setClienteId}
          aoFechar={() => setPainelAberto(false)}
        />
      )}
    </main>
  );
}

function PainelCliente({
  clienteId,
  aoAplicar,
  aoFechar,
}: {
  clienteId: string;
  aoAplicar: (id: string) => void;
  aoFechar: () => void;
}) {
  const id = useId();
  const { data: clientes } = useClientes();
  const [rascunho, setRascunho] = useState(clienteId);

  return (
    <PainelInferior idTitulo="painel-relatorio-titulo" aoFechar={aoFechar}>
      <h2 id="painel-relatorio-titulo" className="text-lg font-extrabold">
        Filtrar relatórios
      </h2>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-[13px] font-semibold">
          Cliente
        </label>
        <select
          id={id}
          value={rascunho}
          onChange={(evento) => setRascunho(evento.target.value)}
          className="appearance-none rounded-[10px] border border-cinza-claro bg-white bg-[url('/icones/seta-baixo.svg')] bg-[right_14px_center] bg-no-repeat px-[14px] py-[11px] text-[13px] outline-none focus:border-dourado"
        >
          <option value="">Todos os clientes</option>
          {clientes?.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>
      </div>
      <Botao
        onClick={() => {
          aoAplicar(rascunho);
          aoFechar();
        }}
      >
        Aplicar filtro
      </Botao>
    </PainelInferior>
  );
}
