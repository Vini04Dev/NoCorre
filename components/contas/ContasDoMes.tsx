"use client";

import Image from "next/image";
import Link from "next/link";
import { PainelContaFixa } from "./PainelContaFixa";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { useConfirmarDebito, useContagemPagamentos, useContasFixas, useContasPagasNoMes, type ContaFixa } from "@/hooks/useContasFixas";
import { pedeAtencao, progressoParcelas, situacaoDaConta, textoSituacao, type SituacaoConta } from "@/lib/contas-fixas";
import { formatarMoeda } from "@/lib/formatar";

const COR_SITUACAO: Record<SituacaoConta["tipo"], string> = {
  paga: "text-positivo",
  em_dia: "text-cinza-escuro",
  vence: "text-pendente",
  atrasada: "text-negativo",
  debito: "text-pendente",
};

/** Painel aberto: nova conta ({}) ou edição ({ conta }). */
export type PainelConta = { conta?: ContaFixa } | null;

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
 * Aba "Contas do mês" de Metas: o que vence todo mês, quanto soma e o que
 * falta pagar neste mês. Fica junto das metas porque as duas respondem "o que
 * eu tenho que pagar"; a diferença é que a meta tem total e fim, e a conta
 * fixa se repete. O Início avisa quando uma está perto de vencer.
 */
export function ContasDoMes({ painel, setPainel }: { painel: PainelConta; setPainel: (painel: PainelConta) => void }) {
  const contas = useContasFixas();
  const pagas = useContasPagasNoMes();
  const contagem = useContagemPagamentos();

  const lista = (contas.data ?? []).map((conta) => ({
    conta,
    situacao: situacaoDaConta(conta, pagas.data?.has(conta.id) ?? false),
    parcelas: progressoParcelas(conta, contagem.data?.get(conta.id) ?? 0),
  }));
  // Parcelada quitada não entra nos totais do mês (e não tem mais o que pagar).
  const ativas = lista.filter((item) => item.conta.ativa && !item.parcelas?.quitada);
  const totalMes = ativas.reduce((soma, item) => soma + item.conta.valor, 0);
  const faltaPagar = ativas.filter((item) => item.situacao.tipo !== "paga").reduce((soma, item) => soma + item.conta.valor, 0);

  return (
    <div className="flex flex-col gap-3.5 lg:max-w-3xl">
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
            Cadastre o que vence todo mês, com ou sem fim: plano de celular, internet, a parcela do celular ou da moto. O Início avisa
            uns dias antes e o pagamento vira despesa com um toque.
          </p>
          <button type="button" onClick={() => setPainel({})} className="text-[13px] font-black text-dourado">
            Cadastrar uma conta
          </button>
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

          <section className="flex flex-col gap-1.5">
            <h2 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">TOQUE NA CONTA PARA EDITAR</h2>
            <ul className="flex flex-col gap-2">
              {lista.map(({ conta, situacao, parcelas }) => (
                <li
                  key={conta.id}
                  className={`flex items-center gap-3 rounded-[12px] border border-black/8 bg-white py-2.5 pr-3 pl-3.5 shadow-cartao ${
                    conta.ativa && !parcelas?.quitada ? "" : "opacity-60"
                  }`}
                >
                  <button type="button" onClick={() => setPainel({ conta })} className="flex min-w-0 flex-1 flex-col text-left">
                    <span className="truncate text-[13px] font-semibold">{conta.descricao}</span>
                    <span className="text-[11px] text-cinza-escuro">
                      {formatarMoeda(conta.valor)} · dia {conta.dia_vencimento}
                      {conta.automatico ? " · débito automático" : ""}
                      {parcelas && !parcelas.quitada && ` · parcela ${Math.min(parcelas.pagas + (situacao.tipo === "paga" ? 0 : 1), parcelas.total)} de ${parcelas.total}`}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        parcelas?.quitada ? "text-positivo" : conta.ativa ? COR_SITUACAO[situacao.tipo] : "text-cinza-escuro"
                      }`}
                    >
                      {parcelas?.quitada
                        ? `Quitada · ${parcelas.total} de ${parcelas.total} pagas`
                        : conta.ativa
                          ? `${textoSituacao(situacao, conta.dia_vencimento)}${parcelas ? ` · faltam ${formatarMoeda(parcelas.faltam * conta.valor)}` : ""}`
                          : "Avisos pausados"}
                    </span>
                  </button>
                  {!parcelas?.quitada && <AcaoDoMes conta={conta} situacao={situacao} />}
                </li>
              ))}
            </ul>
          </section>

          <p className="px-4 text-center text-[11px] text-cinza-escuro">
            Conta mensal se repete sem fim. Parcelada (um notebook em 12x) se encerra sozinha depois da última parcela.
          </p>
        </>
      )}

      {painel && <PainelContaFixa conta={painel.conta} aoFechar={() => setPainel(null)} />}
    </div>
  );
}
