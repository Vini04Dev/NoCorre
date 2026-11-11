"use client";

import { useState } from "react";
import { BloqueioPro } from "@/components/pro/BloqueioPro";
import { SeloPro } from "@/components/pro/SeloPro";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { Valor } from "@/components/ui/Valor";
import { useCarteiras, useSaldosCarteiras, useTransferencias, type Carteira } from "@/hooks/useCarteiras";
import { usePlano } from "@/hooks/usePlano";
import { corDoEvento } from "@/lib/cores";
import { formatarMoeda } from "@/lib/formatar";
import { PainelCarteira } from "./PainelCarteira";
import { PainelTransferencia } from "./PainelTransferencia";

type Painel = { tipo: "carteira"; carteira?: Carteira } | { tipo: "transferencia" } | null;

/**
 * Carteiras (Pro): saldo de cada uma, total, transferências recentes. Quem é
 * grátis vê o bloqueio explicando o recurso.
 */
export function TelaCarteiras() {
  const { ehPro, carregando } = usePlano();
  const { data: carteiras = [], isPending, error } = useCarteiras(ehPro);
  const { data: saldos } = useSaldosCarteiras(ehPro);
  const { data: transferencias = [] } = useTransferencias(ehPro);
  const [painel, setPainel] = useState<Painel>(null);

  const ativas = carteiras.filter((c) => !c.arquivada);
  const arquivadas = carteiras.filter((c) => c.arquivada);
  const total = ativas.reduce((soma, c) => soma + (saldos?.get(c.id) ?? c.saldo_inicial), 0);
  const nomeDe = (id: string) => carteiras.find((c) => c.id === id)?.nome ?? "–";

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

      <section className="rounded-[14px] bg-marinho px-[18px] py-4 text-white">
        <p className="text-[11px] font-semibold tracking-[0.66px] text-cinza">TOTAL NAS CARTEIRAS</p>
        <p className="mt-1 text-2xl font-extrabold text-dourado-claro">
          <Valor texto={formatarMoeda(total)} />
        </p>
        <p className="mt-0.5 text-[11px] text-cinza">Receitas pagas, despesas e transferências de cada carteira.</p>
      </section>

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

      {ativas.length > 0 && (
        <ul className="flex flex-col gap-2">
          {ativas.map((carteira) => (
            <li key={carteira.id}>
              <button
                type="button"
                onClick={() => setPainel({ tipo: "carteira", carteira })}
                className="flex w-full items-center gap-3 rounded-[12px] border border-black/8 border-l-4 bg-white py-3 pr-3 pl-3 text-left shadow-cartao"
                style={{ borderLeftColor: corDoEvento(carteira.cor).forte }}
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-center gap-1.5 truncate text-sm font-semibold">
                    {carteira.nome}
                    {carteira.padrao && (
                      <span className="rounded-md bg-dourado-claro px-1.5 py-0.5 text-[9px] font-bold">PRINCIPAL</span>
                    )}
                  </span>
                  <span className="text-[11px] text-cinza-escuro">Toque para editar</span>
                </span>
                <span className="text-base font-extrabold">
                  <Valor texto={formatarMoeda(saldos?.get(carteira.id) ?? carteira.saldo_inicial)} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {ativas.length >= 2 && (
        <button
          type="button"
          onClick={() => setPainel({ tipo: "transferencia" })}
          className="rounded-[10px] border-[1.5px] border-marinho bg-white py-3 text-sm font-semibold"
        >
          Transferir entre carteiras
        </button>
      )}

      {transferencias.length > 0 && (
        <section className="flex flex-col gap-1.5">
          <h2 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">TRANSFERÊNCIAS RECENTES</h2>
          <ul className="rounded-[12px] border border-black/8 bg-white px-3.5 py-1 shadow-cartao">
            {transferencias.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 border-b border-cinza-claro py-2 text-xs last:border-0">
                <span className="min-w-0 truncate">
                  {nomeDe(t.origem_id)} → {nomeDe(t.destino_id)}
                  <span className="block text-[10px] text-cinza-escuro">
                    {new Date(t.data_hora).toLocaleDateString("pt-BR")}
                  </span>
                </span>
                <span className="font-bold">
                  <Valor texto={formatarMoeda(t.valor)} />
                </span>
              </li>
            ))}
          </ul>
        </section>
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
          primeira={carteiras.length === 0}
          aoFechar={() => setPainel(null)}
        />
      )}
      {painel?.tipo === "transferencia" && <PainelTransferencia carteiras={ativas} aoFechar={() => setPainel(null)} />}
    </main>
  );
}
