"use client";

import Link from "next/link";
import { useAvisoForcado } from "@/hooks/useAvisoForcado";
import { useConfirmarDebito, useContasFixas, useContasPagasNoMes, type ContaFixa } from "@/hooks/useContasFixas";
import { ROTA_CONTAS, pedeAtencao, situacaoDaConta, textoSituacao, type SituacaoConta } from "@/lib/contas-fixas";
import { formatarMoeda } from "@/lib/formatar";

type Item = { conta: ContaFixa; situacao: SituacaoConta };

/** Exemplo para a prévia do Painel do sistema. */
const EXEMPLO: Item[] = [
  {
    conta: {
      id: "exemplo-3",
      usuario_id: "",
      descricao: "Internet",
      tipo: "Contas",
      valor: 99.9,
      dia_vencimento: 10,
      carteira_id: null,
      automatico: false,
      ativa: true,
      created_at: "",
    },
    situacao: { tipo: "atrasada", dias: -2 },
  },
  {
    conta: {
      id: "exemplo-1",
      usuario_id: "",
      descricao: "Plano de celular",
      tipo: "Contas",
      valor: 49.9,
      dia_vencimento: 20,
      carteira_id: null,
      automatico: false,
      ativa: true,
      created_at: "",
    },
    situacao: { tipo: "vence", dias: 2 },
  },
  {
    conta: {
      id: "exemplo-2",
      usuario_id: "",
      descricao: "YouTube Premium",
      tipo: "Contas",
      valor: 26.9,
      dia_vencimento: 15,
      carteira_id: null,
      automatico: true,
      ativa: true,
      created_at: "",
    },
    situacao: { tipo: "debito", dias: 0 },
  },
];

/**
 * Mesmo degradê escurecido dos cartões de carteira, na cor da situação:
 * marinho para o que vence ou cai no débito, vermelho para o atrasado.
 */
function fundoDa(situacao: SituacaoConta) {
  const cor = situacao.tipo === "atrasada" ? "var(--color-negativo)" : "var(--color-marinho)";
  return `linear-gradient(135deg, color-mix(in srgb, ${cor} 88%, #000) 0%, color-mix(in srgb, ${cor} 55%, #000) 100%)`;
}

/** Ícone de linha de conta (recibo), na cor do texto do cartão. */
function IconeConta() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2zM9 7h6M9 11h6M9 15h4" />
    </svg>
  );
}

const CLASSE_CARTAO =
  "relative flex h-[104px] w-[156px] shrink-0 snap-start flex-col justify-between rounded-[14px] p-3 text-left text-white shadow-cartao transition-transform active:scale-[0.98]";

/** Cartão de uma conta: tocar paga (abre a despesa preenchida) ou confirma o débito automático. */
function CartaoConta({ conta, situacao, exemplo }: Item & { exemplo: boolean }) {
  const confirmar = useConfirmarDebito();
  const debito = situacao.tipo === "debito";
  const conteudo = (
    <>
      <span className="absolute top-3 right-3 opacity-90">
        <IconeConta />
      </span>
      <span className="flex min-w-0 flex-col pr-6">
        <span className="truncate text-sm font-bold">{conta.descricao}</span>
        <span className="truncate text-[10px] text-white/85">{textoSituacao(situacao, conta.dia_vencimento)}</span>
      </span>
      <span className="flex items-end justify-between gap-1">
        <span className="text-[15px] font-extrabold">{formatarMoeda(conta.valor)}</span>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
          {debito ? (confirmar.isPending ? "Lançando..." : "Já caiu") : "Pagar"}
        </span>
      </span>
    </>
  );

  if (debito) {
    return (
      <button
        type="button"
        onClick={() => !exemplo && confirmar.mutate(conta)}
        disabled={confirmar.isPending}
        aria-label={`${conta.descricao}: confirmar que o débito automático caiu`}
        className={`${CLASSE_CARTAO} disabled:opacity-70`}
        style={{ background: fundoDa(situacao) }}
      >
        {conteudo}
      </button>
    );
  }
  return (
    <Link
      href={exemplo ? ROTA_CONTAS : `/novo/despesa?fixa=${conta.id}`}
      aria-label={`Pagar ${conta.descricao}`}
      className={CLASSE_CARTAO}
      style={{ background: fundoDa(situacao) }}
    >
      {conteudo}
    </Link>
  );
}

/**
 * Aviso no Início: contas fixas que vencem em até 3 dias, atrasadas ou com
 * débito automático para confirmar, em cartões que rolam de lado (como os de
 * carteira). Some quando a conta do mês é paga.
 */
export function AvisoContas() {
  const { data: contas } = useContasFixas();
  const { data: pagas } = useContasPagasNoMes();
  // Aberto pelo Painel do sistema (?aviso=vencimento): mostra um exemplo.
  const [forcado] = useAvisoForcado("vencimento");

  const itens: Item[] = forcado
    ? EXEMPLO
    : !contas || !pagas
      ? []
      : contas
          .filter((conta) => conta.ativa)
          .map((conta) => ({ conta, situacao: situacaoDaConta(conta, pagas.has(conta.id)) }))
          .filter((item) => pedeAtencao(item.situacao))
          // Atrasadas primeiro, depois as que vencem antes.
          .sort((a, b) => ("dias" in a.situacao ? a.situacao.dias : 0) - ("dias" in b.situacao ? b.situacao.dias : 0));
  if (itens.length === 0) return null;

  return (
    <section aria-label="Contas a vencer" className="flex flex-col gap-1.5">
      <h2 className="flex items-center justify-between text-[11px] font-semibold tracking-[0.66px] text-cinza">
        CONTAS A VENCER
        <Link href={ROTA_CONTAS} className="font-bold tracking-normal text-dourado">
          Ver todas
        </Link>
      </h2>
      <div className="-mx-[17px] flex snap-x scroll-px-[17px] gap-2.5 overflow-x-auto px-[17px] pt-1 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0">
        {itens.map((item) => (
          <CartaoConta key={item.conta.id} {...item} exemplo={forcado} />
        ))}
      </div>
    </section>
  );
}
