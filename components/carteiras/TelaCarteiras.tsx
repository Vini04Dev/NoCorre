"use client";

import { useState } from "react";
import { BloqueioPro } from "@/components/pro/BloqueioPro";
import { SeloPro } from "@/components/pro/SeloPro";
import { ListaMovimentacoes } from "@/components/resumo/ListaMovimentacoes";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { Valor } from "@/components/ui/Valor";
import {
  useCarteiras,
  useSaldosCarteiras,
  useTransferenciasDoPeriodo,
  type Carteira,
} from "@/hooks/useCarteiras";
import { useEstadoDaTela } from "@/hooks/useEstadoDaTela";
import { useMovimentacoes, type Movimentacao } from "@/hooks/useMovimentacoes";
import { usePlano } from "@/hooks/usePlano";
import { formatarMoeda } from "@/lib/formatar";
import { CartaoCarteira, IconeTipoCarteira, fundoCarteira } from "./CartaoCarteira";
import { PainelCarteira } from "./PainelCarteira";
import { PainelTransferencia } from "./PainelTransferencia";

type Painel = { tipo: "carteira"; carteira?: Carteira } | { tipo: "transferencia"; origem?: string } | null;

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const doisDigitos = (n: number) => String(n).padStart(2, "0");

/**
 * Carteiras (Pro): cartões com o saldo de cada uma, total, e o extrato do mês
 * da carteira escolhida. Quem é grátis vê o bloqueio explicando o recurso.
 */
export function TelaCarteiras() {
  const { ehPro, carregando } = usePlano();
  const { data: carteiras = [], isPending, error } = useCarteiras(ehPro);
  const { data: saldos } = useSaldosCarteiras(ehPro);
  const [painel, setPainel] = useState<Painel>(null);
  const [idEscolhida, setIdEscolhida] = useEstadoDaTela<string | null>("carteiras:escolhida", null);

  const ativas = carteiras.filter((c) => !c.arquivada);
  const arquivadas = carteiras.filter((c) => c.arquivada);
  const saldoDe = (c: Carteira) => saldos?.get(c.id) ?? c.saldo_inicial;
  const total = ativas.reduce((soma, c) => soma + saldoDe(c), 0);
  const escolhida = ativas.find((c) => c.id === idEscolhida) ?? ativas[0];

  const cabecalho = (
    <CabecalhoTela
      titulo="Carteiras"
      voltarPara="/"
      tituloGrande
      acao={
        ehPro ? (
          <button
            type="button"
            onClick={() => setPainel({ tipo: "carteira" })}
            aria-label="Nova carteira"
            className="grid size-[38px] place-items-center rounded-full bg-linear-to-r from-dourado-claro to-dourado text-[22px] font-semibold"
          >
            +
          </button>
        ) : (
          <SeloPro />
        )
      }
    />
  );

  if (carregando) return <main className="px-[17px] pt-6 text-center text-[13px] text-cinza-escuro">Carregando...</main>;
  if (!ehPro) {
    return (
      <main className="flex flex-col gap-4 px-[17px] pt-[calc(env(safe-area-inset-top)+12px)] lg:max-w-xl lg:px-0 lg:pt-2">
        {cabecalho}
        <BloqueioPro recurso="carteiras" />
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-4 px-[17px] pt-[calc(env(safe-area-inset-top)+12px)] pb-6 lg:max-w-3xl lg:px-0 lg:pt-2">
      {cabecalho}

      {error && <p className="text-center text-xs text-negativo">{error.message}</p>}
      {isPending && <p className="text-center text-[13px] text-cinza-escuro">Carregando...</p>}

      {!isPending && ativas.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-[14px] border border-cinza-claro bg-white px-6 py-8 text-center">
          <p className="text-sm font-bold">Nenhuma carteira ainda</p>
          <p className="text-xs text-cinza-escuro">
            Crie uma para cada lugar onde seu dinheiro fica. A primeira vira a principal: os lançamentos sem carteira
            entram nela.
          </p>
          <button
            type="button"
            onClick={() => setPainel({ tipo: "carteira" })}
            className="mt-1 text-sm font-black text-dourado"
          >
            Criar a primeira carteira
          </button>
        </div>
      )}

      {ativas.length > 0 && escolhida && (
        <>
          {/* Carrossel: rola de lado no celular, com o último cartão para criar outra. */}
          <div className="-mx-[17px] flex snap-x gap-2.5 overflow-x-auto px-[17px] [scrollbar-width:none] pt-1 pb-2 lg:mx-0 lg:flex-wrap lg:px-0">
            {ativas.map((carteira) => (
              <CartaoCarteira
                key={carteira.id}
                carteira={carteira}
                saldo={saldoDe(carteira)}
                selecionada={carteira.id === escolhida.id}
                aoTocar={() => setIdEscolhida(carteira.id)}
              />
            ))}
            <button
              type="button"
              onClick={() => setPainel({ tipo: "carteira" })}
              className="flex h-[104px] w-[150px] shrink-0 snap-start flex-col items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed border-cinza text-xs font-semibold text-cinza-escuro"
            >
              <span className="grid size-8 place-items-center rounded-full bg-cinza-claro text-lg leading-none">+</span>
              Nova carteira
            </button>
          </div>

          <section>
            <p className="text-[11px] font-semibold tracking-[0.66px] text-cinza-escuro">SALDO TOTAL DISPONÍVEL</p>
            <p className="text-[28px] leading-tight font-extrabold">
              <Valor texto={formatarMoeda(total)} />
            </p>
          </section>

          <DetalheCarteira
            carteira={escolhida}
            saldo={saldoDe(escolhida)}
            podeTransferir={ativas.length >= 2}
            aoEditar={() => setPainel({ tipo: "carteira", carteira: escolhida })}
            aoTransferir={() => setPainel({ tipo: "transferencia", origem: escolhida.id })}
            nomeDe={(id) => carteiras.find((c) => c.id === id)?.nome ?? "–"}
          />
        </>
      )}

      {arquivadas.length > 0 && (
        <section className="flex flex-col gap-1.5">
          <h2 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">ARQUIVADAS</h2>
          {arquivadas.map((carteira) => (
            <button
              key={carteira.id}
              type="button"
              onClick={() => setPainel({ tipo: "carteira", carteira })}
              className="rounded-[10px] border border-cinza-claro bg-white px-3 py-2 text-left text-xs text-cinza-escuro"
            >
              {carteira.nome}
            </button>
          ))}
        </section>
      )}

      {painel?.tipo === "carteira" && (
        <PainelCarteira
          key={painel.carteira?.id ?? "nova"}
          carteira={painel.carteira}
          saldo={painel.carteira ? saldoDe(painel.carteira) : 0}
          primeira={carteiras.length === 0}
          aoFechar={() => setPainel(null)}
        />
      )}
      {painel?.tipo === "transferencia" && (
        <PainelTransferencia carteiras={ativas} origem={painel.origem} aoFechar={() => setPainel(null)} />
      )}
    </main>
  );
}

/** Cartão grande da carteira escolhida, ações e o extrato do mês. */
function DetalheCarteira({
  carteira,
  saldo,
  podeTransferir,
  aoEditar,
  aoTransferir,
  nomeDe,
}: {
  carteira: Carteira;
  saldo: number;
  podeTransferir: boolean;
  aoEditar: () => void;
  aoTransferir: () => void;
  nomeDe: (id: string) => string;
}) {
  const hoje = new Date();
  const [mes, setMes] = useState({ ano: hoje.getFullYear(), mes: hoje.getMonth() });
  const inicio = new Date(mes.ano, mes.mes, 1);
  const fim = new Date(mes.ano, mes.mes + 1, 1);
  const ultimoDia = new Date(mes.ano, mes.mes + 1, 0).getDate();
  const prefixo = `${mes.ano}-${doisDigitos(mes.mes + 1)}`;
  const { data } = useMovimentacoes({ tipo: "personalizado", de: `${prefixo}-01`, ate: `${prefixo}-${ultimoDia}` });
  const { data: transferencias = [] } = useTransferenciasDoPeriodo(inicio, fim);

  // Lançamento sem carteira conta na principal (mesma regra do saldo no banco).
  const daCarteira = (id: string | null) => id === carteira.id || (id === null && carteira.padrao);
  const movimentacoes: Movimentacao[] = data
    ? [
        ...data.receitas.filter((r) => daCarteira(r.carteira_id)).map((dados) => ({ tipo: "receita" as const, dados })),
        ...data.despesas.filter((d) => daCarteira(d.carteira_id)).map((dados) => ({ tipo: "despesa" as const, dados })),
      ].sort((a, b) => b.dados.data_hora.localeCompare(a.dados.data_hora))
    : [];
  const minhasTransferencias = transferencias.filter(
    (t) => t.origem_id === carteira.id || t.destino_id === carteira.id,
  );
  const mudarMes = (passo: number) => {
    const nova = new Date(mes.ano, mes.mes + passo, 1);
    setMes({ ano: nova.getFullYear(), mes: nova.getMonth() });
  };
  const ehMesAtual = mes.ano === hoje.getFullYear() && mes.mes === hoje.getMonth();

  return (
    <section className="flex flex-col gap-3">
      <div
        className="relative flex min-h-[150px] flex-col justify-end gap-0.5 rounded-[18px] p-5 text-white shadow-cartao"
        style={{ background: fundoCarteira(carteira.cor) }}
      >
        <span className="absolute top-4 right-4 opacity-90">
          <IconeTipoCarteira tipo={carteira.tipo} tamanho={24} />
        </span>
        <p className="text-base font-bold">{carteira.nome}</p>
        <p className="text-[11px] text-white/80">
          {carteira.tipo ?? "Carteira"}
          {carteira.padrao && " · principal"} · saldo atual
        </p>
        <p className="mt-1 text-[26px] leading-tight font-extrabold">
          <Valor texto={formatarMoeda(saldo)} />
        </p>
      </div>

      <div className={`grid gap-2 ${podeTransferir ? "grid-cols-2" : "grid-cols-1"}`}>
        <button
          type="button"
          onClick={aoEditar}
          className="rounded-[10px] border-[1.5px] border-marinho bg-white py-2.5 text-sm font-semibold"
        >
          Editar ou acertar saldo
        </button>
        {podeTransferir && (
          <button
            type="button"
            onClick={aoTransferir}
            className="rounded-[10px] bg-marinho py-2.5 text-sm font-semibold text-white"
          >
            Transferir
          </button>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between">
        <h2 className="text-[11px] font-semibold tracking-[0.66px] text-cinza-escuro">MOVIMENTAÇÕES</h2>
        <div className="flex items-center gap-1 rounded-full bg-white px-1 py-0.5 shadow-cartao">
          <button type="button" onClick={() => mudarMes(-1)} aria-label="Mês anterior" className="grid size-7 place-items-center text-base">
            ‹
          </button>
          <span className="min-w-[112px] text-center text-xs font-semibold">
            {MESES[mes.mes]} {mes.ano}
          </span>
          <button
            type="button"
            onClick={() => mudarMes(1)}
            disabled={ehMesAtual}
            aria-label="Próximo mês"
            className="grid size-7 place-items-center text-base disabled:opacity-30"
          >
            ›
          </button>
        </div>
      </div>

      {minhasTransferencias.length > 0 && (
        <ul className="rounded-[12px] border border-black/8 bg-white px-3.5 py-1 shadow-cartao">
          {minhasTransferencias.map((t) => {
            const saiu = t.origem_id === carteira.id;
            return (
              <li key={t.id} className="flex items-center justify-between gap-3 border-b border-cinza-claro py-2 text-xs last:border-0">
                <span className="min-w-0 truncate">
                  <span className="font-semibold">Transferência {saiu ? "para" : "de"} {nomeDe(saiu ? t.destino_id : t.origem_id)}</span>
                  <span className="block text-[10px] text-cinza-escuro">{new Date(t.data_hora).toLocaleDateString("pt-BR")}</span>
                </span>
                <span className={`font-bold ${saiu ? "text-negativo" : "text-positivo"}`}>
                  <Valor texto={`${saiu ? "−" : "+"} ${formatarMoeda(t.valor)}`} />
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {!data ? (
        <p className="text-center text-[13px] text-cinza-escuro">Carregando...</p>
      ) : movimentacoes.length === 0 && minhasTransferencias.length === 0 ? (
        <p className="rounded-[12px] border border-cinza-claro bg-white px-4 py-6 text-center text-xs text-cinza-escuro">
          Nenhuma movimentação nesta carteira em {MESES[mes.mes].toLowerCase()}.
        </p>
      ) : (
        movimentacoes.length > 0 && <ListaMovimentacoes movimentacoes={movimentacoes} />
      )}
    </section>
  );
}
