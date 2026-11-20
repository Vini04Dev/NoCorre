"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { ComparativoMensal } from "./ComparativoMensal";
import { GraficoBarras } from "./GraficoBarras";
import { ListaAvisos } from "./ListaAvisos";
import { MapaDoCorre } from "./MapaDoCorre";
import { RankingClientes } from "./RankingClientes";
import { ResumoDinheiro, type Dinheiro } from "./ResumoDinheiro";
import { CORES_DESPESA, Rosca } from "./Rosca";
import { Tendencias } from "./Tendencias";
import { PrevisaoMes } from "@/components/contas/PrevisaoMes";
import { Botao } from "@/components/ui/Botao";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { SeletorPeriodoAmplo } from "@/components/ui/SeletorPeriodoAmplo";
import { Valor } from "@/components/ui/Valor";
import { useClientes } from "@/hooks/useClientes";
import { useEstadoDaTela } from "@/hooks/useEstadoDaTela";
import { useHistoricoMeses, usePendentes, useRelatorio, type Despesa, type Entrada, type Receita } from "@/hooks/useMovimentacoes";
import { useOrdemPeriodos } from "@/hooks/useOrdemPeriodos";
import { formatarMoeda } from "@/lib/formatar";
import { comparadoCom, quandoFoi, type FiltroPeriodo } from "@/lib/periodo";
import {
  gerarAvisos,
  mapaDoCorre,
  numerosDoCorre,
  porCategoria,
  rankingClientes,
  receitaPorDia,
  type CriterioRanking,
} from "@/lib/relatorio";
import { fontesDeRenda, porMes } from "@/lib/renda";
import { calcularTotais } from "@/lib/totais";

/** Entrou, saiu e sobrou com as mesmas contas do saldo do Início. */
function dinheiroDe(dados: { receitas: Receita[]; despesas: Despesa[]; entradas: Entrada[] }): Dinheiro {
  const t = calcularTotais(dados.receitas, dados.despesas, dados.entradas);
  return { entrou: t.recebidosTotal, saiu: t.despesas, sobrou: t.saldo };
}

/**
 * Relatórios: não repete o Início, explica o período. Cada bloco responde uma
 * pergunta, sem repetir número de outro:
 * - Seu dinheiro: quanto entrou (do corre e de fora dele), saiu e sobrou, e de onde veio a renda.
 * - O corre: o trabalho em si (por dia, por entrega, custos), a receita por dia e o mapa de horários.
 * - Últimos 6 meses: a mesma conta, mês a mês.
 * - Fim do mês (mês atual): quanto deve sobrar.
 * - Onde mais entrego, para onde foi o dinheiro e o que pede atenção.
 * O filtro de cliente vale para o que é do corre; salário e outras rendas não
 * têm cliente, então os blocos de dinheiro total somem com ele.
 */
export function TelaRelatorios() {
  const [ordem] = useOrdemPeriodos();
  const [periodo, setPeriodo] = useEstadoDaTela<FiltroPeriodo>("relatorios:periodo", { tipo: ordem[0] });
  const [clienteId, setClienteId] = useEstadoDaTela("relatorios:cliente", "");
  const [painelAberto, setPainelAberto] = useState(false);
  const [criterioRanking, setCriterioRanking] = useEstadoDaTela<CriterioRanking>("relatorios:ranking", "entregas");
  const { data: clientes } = useClientes();
  const relatorio = useRelatorio(periodo);
  const pendentes = usePendentes();
  const historico = useHistoricoMeses(6);

  const nomeCliente = clientes?.find((c) => c.id === clienteId)?.nome;
  const doCliente = <T extends { cliente_id: string }>(lista: T[]) =>
    clienteId ? lista.filter((r) => r.cliente_id === clienteId) : lista;
  const doCorre = <T extends { do_corre?: boolean }>(lista: T[]) => lista.filter((d) => d.do_corre !== false);

  const dados = relatorio.data;
  const receitas = dados ? doCliente(dados.atual.receitas) : [];
  const despesas = dados?.atual.despesas ?? [];
  const entradas = dados?.atual.entradas ?? [];

  // Período ainda correndo (esta semana, este mês): o anterior entra só até o
  // mesmo ponto, senão metade do mês sempre parece pior que o mês inteiro.
  const [agora] = useState(() => Date.now());
  const emAndamento = Boolean(dados && agora < dados.fim.getTime());
  const limiteAnterior = dados
    ? dados.inicio.getTime() - (dados.fim.getTime() - dados.inicio.getTime()) + (Math.min(agora, dados.fim.getTime()) - dados.inicio.getTime())
    : 0;
  const ateMesmoPonto = <T extends { data_hora: string }>(lista: T[]) =>
    emAndamento ? lista.filter((item) => new Date(item.data_hora).getTime() < limiteAnterior) : lista;
  const anterior = dados
    ? {
        receitas: ateMesmoPonto(doCliente(dados.anterior.receitas)),
        despesas: ateMesmoPonto(dados.anterior.despesas),
        entradas: ateMesmoPonto(dados.anterior.entradas),
      }
    : null;
  const comparado = comparadoCom(periodo, emAndamento);
  const semAnterior = Boolean(anterior && !anterior.receitas.length && !anterior.despesas.length && !anterior.entradas.length);

  const numeros = dados ? numerosDoCorre({ receitas, despesas: doCorre(despesas) }) : null;
  const numerosAntes = anterior ? numerosDoCorre({ receitas: anterior.receitas, despesas: doCorre(anterior.despesas) }) : null;
  const renda = fontesDeRenda(receitas, entradas);
  const gastos = porCategoria(despesas);
  const totaisGastos = calcularTotais([], despesas);
  const ranking = rankingClientes(receitas, criterioRanking);
  const meses = historico.data
    ? porMes(
        {
          receitas: clienteId ? historico.data.receitas.filter((r) => r.cliente_id === clienteId) : historico.data.receitas,
          // Com cliente, só o corre dele: despesas e outras rendas não têm cliente.
          despesas: clienteId ? [] : historico.data.despesas,
          entradas: clienteId ? [] : historico.data.entradas,
        },
        historico.data.inicio,
        6,
      )
    : [];
  const avisos = dados && anterior ? gerarAvisos({ despesas }, { despesas: anterior.despesas }, doCliente(pendentes.data ?? [])) : [];

  return (
    <main className="flex flex-col gap-[18px] px-[17px] pt-[calc(env(safe-area-inset-top)+12px)] pb-4 lg:px-0 lg:pt-2">
      <header className="flex items-center justify-between">
        <h1 className="text-[22px] font-extrabold lg:text-3xl">Relatórios</h1>
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

      <div className="lg:max-w-sm">
        <SeletorPeriodoAmplo valor={periodo} aoMudar={setPeriodo} />
      </div>

      {nomeCliente && (
        <p className="-mt-2 flex items-center justify-between gap-3 rounded-[10px] bg-dourado-claro/40 px-3 py-2 text-xs">
          <span>
            Só o corre de <strong>{nomeCliente}</strong>. Salário, outras rendas e despesas não têm cliente e ficam de fora.
          </span>
          <button type="button" onClick={() => setClienteId("")} className="font-semibold">
            Limpar
          </button>
        </p>
      )}

      {/* Um aviso só, em vez de "sem dados para comparar" embaixo de cada número. */}
      {semAnterior && (
        <p className="-mt-2 text-[11px] text-cinza-escuro">
          Nada lançado {comparado.replace(/^que /, "")}, então ainda não há comparação.
        </p>
      )}

      {relatorio.isPending && <p className="py-6 text-center text-[13px] text-cinza-escuro">Carregando...</p>}
      {relatorio.isError && <p className="py-6 text-center text-[13px] text-negativo">{relatorio.error.message}</p>}

      {dados && anterior && numeros && numerosAntes && (
        <div className="flex flex-col gap-[18px] lg:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
          {/* Esquerda: o dinheiro do período e o corre, do geral para o detalhe. */}
          <div className="flex flex-col gap-[18px]">
            {!clienteId && (
              <ResumoDinheiro
                nomePeriodo={quandoFoi(periodo)}
                comparado={comparado}
                atual={dinheiroDe(dados.atual)}
                anterior={dinheiroDe(anterior)}
                fontes={renda.fontes}
              />
            )}
            <Tendencias atual={numeros} anterior={numerosAntes} comparado={comparado} />
            <GraficoBarras barras={receitaPorDia(receitas, dados.inicio, dados.fim)} />
            <MapaDoCorre celulas={mapaDoCorre(receitas)} />
            {meses.length > 0 && <ComparativoMensal meses={meses} />}
          </div>

          {/* Direita: o mês que está correndo, clientes, gastos e avisos. */}
          <div className="flex flex-col gap-[18px] lg:sticky lg:top-6">
            {/* Saldo do mês inteiro: sem sentido com filtro de cliente ou outro período. */}
            {periodo.tipo === "mes" && !clienteId && <PrevisaoMes />}
            <RankingClientes
              total={ranking.total}
              posicoes={ranking.posicoes}
              criterio={criterioRanking}
              aoMudarCriterio={setCriterioRanking}
              periodo={periodo}
            />
            {!clienteId && (
              <section className="flex flex-col gap-2.5">
                <h2 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">PARA ONDE FOI O DINHEIRO</h2>
                <Rosca
                  titulo="Despesas por categoria"
                  total={gastos.total}
                  fatias={gastos.fatias}
                  cores={CORES_DESPESA}
                  vazio="Sem despesas no período."
                  rodape={
                    <p className="flex justify-between border-t border-cinza-claro pt-2 text-[11px] text-cinza-escuro">
                      <span>
                        Do corre <Valor className="font-semibold text-marinho" texto={formatarMoeda(totaisGastos.despesasCorre)} />
                      </span>
                      <span>
                        Pessoais <Valor className="font-semibold text-marinho" texto={formatarMoeda(totaisGastos.despesasPessoais)} />
                      </span>
                    </p>
                  }
                />
              </section>
            )}
            <ListaAvisos avisos={avisos} />
          </div>
        </div>
      )}

      {painelAberto && <PainelCliente clienteId={clienteId} aoAplicar={setClienteId} aoFechar={() => setPainelAberto(false)} />}
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
