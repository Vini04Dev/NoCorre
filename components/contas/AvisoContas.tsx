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

/** Cor da situação: amarelo de pendente para o que vence ou cai no débito, vermelho para o atrasado. */
function corDa(situacao: SituacaoConta) {
  return situacao.tipo === "atrasada" ? "var(--color-negativo)" : "var(--color-pendente)";
}

/**
 * Degradê como o dos cartões de carteira, mas só um toque da cor sobre o
 * fundo do cartão (segue o tema): avisa sem gritar.
 */
function estiloDo(situacao: SituacaoConta) {
  const cor = corDa(situacao);
  return {
    background: `linear-gradient(135deg, color-mix(in srgb, ${cor} 13%, var(--color-white)) 0%, color-mix(in srgb, ${cor} 4%, var(--color-white)) 100%)`,
    borderColor: `color-mix(in srgb, ${cor} 22%, transparent)`,
  };
}

/** Ícone de linha de conta (recibo), na cor da situação. */
function IconeConta() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2zM9 7h6M9 11h6M9 15h4" />
    </svg>
  );
}

const CLASSE_CARTAO =
  "flex w-full items-center gap-2.5 rounded-[12px] border py-2 pr-3 pl-2.5 text-left shadow-cartao transition-transform active:scale-[0.99]";

/** Cartão de uma conta: tocar paga (abre a despesa preenchida) ou confirma o débito automático. */
function CartaoConta({ conta, situacao, exemplo }: Item & { exemplo: boolean }) {
  const confirmar = useConfirmarDebito();
  const debito = situacao.tipo === "debito";
  const conteudo = (
    <>
      <span
        className="grid size-8 shrink-0 place-items-center rounded-full"
        style={{ color: corDa(situacao), background: `color-mix(in srgb, ${corDa(situacao)} 16%, transparent)` }}
      >
        <IconeConta />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[13px] font-bold">{conta.descricao}</span>
        <span className="truncate text-[11px] font-semibold" style={{ color: corDa(situacao) }}>
          {textoSituacao(situacao, conta.dia_vencimento)}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-extrabold">{formatarMoeda(conta.valor)}</span>
        <span className="rounded-full bg-marinho px-2.5 py-1 text-[10px] font-bold text-white">
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
        style={estiloDo(situacao)}
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
      style={estiloDo(situacao)}
    >
      {conteudo}
    </Link>
  );
}

/**
 * Aviso no Início: contas fixas que vencem em até 3 dias, atrasadas ou com
 * débito automático para confirmar, uma embaixo da outra, com o degradê dos
 * cartões de carteira. Some quando a conta do mês é paga.
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
      <ul className="flex flex-col gap-2">
        {itens.map((item) => (
          <li key={item.conta.id}>
            <CartaoConta {...item} exemplo={forcado} />
          </li>
        ))}
      </ul>
    </section>
  );
}
