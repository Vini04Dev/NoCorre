"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PainelContaFixa } from "./PainelContaFixa";
import { PrevisaoMes } from "./PrevisaoMes";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { useConfirmarDebito, useContasFixas, useContasPagasNoMes, type ContaFixa } from "@/hooks/useContasFixas";
import { pedeAtencao, situacaoDaConta, textoSituacao, type SituacaoConta } from "@/lib/contas-fixas";
import { formatarMoeda } from "@/lib/formatar";

const COR_SITUACAO: Record<SituacaoConta["tipo"], string> = {
  paga: "text-positivo",
  em_dia: "text-cinza-escuro",
  vence: "text-pendente",
  atrasada: "text-negativo",
  debito: "text-pendente",
};

/** Ação do mês: pagar (abre a despesa preenchida) ou confirmar o débito automático. */
function AcaoDoMes({ conta, situacao }: { conta: ContaFixa; situacao: SituacaoConta }) {
  const confirmar = useConfirmarDebito();
  if (situacao.tipo === "paga" || !conta.ativa) return null;
  if (situacao.tipo === "debito") {
    return (
      <button
        type="button"
        onClick={() => confirmar.mutate(conta)}
        disabled={confirmar.isPending}
        className="shrink-0 rounded-[8px] bg-marinho px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-50"
      >
        {confirmar.isPending ? "Lançando..." : "Já caiu"}
      </button>
    );
  }
  return (
    <Link
      href={`/novo/despesa?fixa=${conta.id}`}
      className={`shrink-0 rounded-[8px] px-3 py-1.5 text-[11px] font-bold ${
        pedeAtencao(situacao) ? "bg-marinho text-white" : "border border-cinza-claro"
      }`}
    >
      Pagar
    </Link>
  );
}

/**
 * Contas fixas: o que vence todo mês, quanto soma e o que falta pagar neste
 * mês. O Início avisa quando uma está perto de vencer.
 */
export function TelaContasFixas() {
  const contas = useContasFixas();
  const pagas = useContasPagasNoMes();
  const [painel, setPainel] = useState<{ conta?: ContaFixa } | null>(null);

  const lista = (contas.data ?? []).map((conta) => ({
    conta,
    situacao: situacaoDaConta(conta, pagas.data?.has(conta.id) ?? false),
  }));
  const ativas = lista.filter((item) => item.conta.ativa);
  const totalMes = ativas.reduce((soma, item) => soma + item.conta.valor, 0);
  const faltaPagar = ativas.filter((item) => item.situacao.tipo !== "paga").reduce((soma, item) => soma + item.conta.valor, 0);

  return (
    <main className="flex flex-col gap-4 px-[17px] pt-[calc(env(safe-area-inset-top)+12px)] pb-6 lg:max-w-3xl lg:px-0 lg:pt-2">
      <CabecalhoTela titulo="Contas fixas" voltarPara="/" tituloGrande />
      <AvisoErro mensagem={contas.error?.message ?? pagas.error?.message} />

      {contas.isPending ? (
        <p className="text-center text-[13px] text-cinza-escuro">Carregando...</p>
      ) : lista.length === 0 ? (
        <section className="flex flex-col items-center gap-3 rounded-[14px] border border-black/8 bg-white px-5 py-6 text-center shadow-cartao">
          <span className="grid size-12 place-items-center rounded-full bg-dourado-claro">
            <Image src="/icones/conta-fixa.svg" alt="" width={24} height={24} />
          </span>
          <p className="text-sm font-bold">Nenhuma conta fixa ainda</p>
          <p className="text-xs text-cinza-escuro">
            Cadastre o que vence todo mês (plano de celular, internet, parcela). O Início avisa uns dias antes e o
            pagamento vira despesa com um toque.
          </p>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3">
            <div className="flex flex-col rounded-[12px] border border-black/8 bg-white px-3.5 py-3 shadow-cartao">
              <span className="text-[11px] text-cinza-escuro">Por mês</span>
              <span className="text-lg font-extrabold">{formatarMoeda(totalMes)}</span>
            </div>
            <div className="flex flex-col rounded-[12px] border border-black/8 bg-white px-3.5 py-3 shadow-cartao">
              <span className="text-[11px] text-cinza-escuro">Falta pagar este mês</span>
              <span className={`text-lg font-extrabold ${faltaPagar > 0 ? "text-negativo" : "text-positivo"}`}>
                {formatarMoeda(faltaPagar)}
              </span>
            </div>
          </section>

          <PrevisaoMes faltaPagar={faltaPagar} />

          <section className="flex flex-col gap-1.5">
            <h2 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">TOQUE NA CONTA PARA EDITAR</h2>
            <ul className="flex flex-col gap-2">
              {lista.map(({ conta, situacao }) => (
                <li
                  key={conta.id}
                  className={`flex items-center gap-3 rounded-[12px] border border-black/8 bg-white py-2.5 pr-3 pl-3.5 shadow-cartao ${
                    conta.ativa ? "" : "opacity-60"
                  }`}
                >
                  <button type="button" onClick={() => setPainel({ conta })} className="flex min-w-0 flex-1 flex-col text-left">
                    <span className="truncate text-[13px] font-semibold">{conta.descricao}</span>
                    <span className="text-[11px] text-cinza-escuro">
                      {formatarMoeda(conta.valor)} · dia {conta.dia_vencimento}
                      {conta.automatico ? " · débito automático" : ""}
                    </span>
                    <span className={`text-[11px] font-semibold ${conta.ativa ? COR_SITUACAO[situacao.tipo] : "text-cinza-escuro"}`}>
                      {conta.ativa ? textoSituacao(situacao, conta.dia_vencimento) : "Avisos pausados"}
                    </span>
                  </button>
                  <AcaoDoMes conta={conta} situacao={situacao} />
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <Botao onClick={() => setPainel({})}>Nova conta fixa</Botao>
      {painel && <PainelContaFixa conta={painel.conta} aoFechar={() => setPainel(null)} />}
    </main>
  );
}
