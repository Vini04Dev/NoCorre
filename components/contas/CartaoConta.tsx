"use client";

import Link from "next/link";
import { useConfirmarDebito, type ContaFixa } from "@/hooks/useContasFixas";
import { ROTA_CONTAS, textoSituacao, type SituacaoConta } from "@/lib/contas-fixas";
import { formatarMoeda } from "@/lib/formatar";

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
    background: `linear-gradient(135deg, color-mix(in srgb, ${cor} 13%, var(--t-superficie, #ffffff)) 0%, color-mix(in srgb, ${cor} 4%, var(--t-superficie, #ffffff)) 100%)`,
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
  "superficie-tema flex w-full items-center gap-2.5 rounded-[12px] border py-2 pr-3 pl-2.5 text-left shadow-cartao transition-transform active:scale-[0.99]";

/**
 * Conta fixa que pede atenção, nas notificações: tocar paga (abre a despesa
 * preenchida) ou confirma o débito automático. Conta de exemplo (prévia do
 * Painel do sistema, sem dono) só leva para a lista.
 */
export function CartaoConta({ conta, situacao, aoAbrir }: { conta: ContaFixa; situacao: SituacaoConta; aoAbrir?: () => void }) {
  const confirmar = useConfirmarDebito();
  const exemplo = !conta.usuario_id;
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

  if (debito && !exemplo) {
    return (
      <button
        type="button"
        onClick={() => confirmar.mutate(conta)}
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
      onClick={aoAbrir}
      aria-label={`Pagar ${conta.descricao}`}
      className={CLASSE_CARTAO}
      style={estiloDo(situacao)}
    >
      {conteudo}
    </Link>
  );
}
