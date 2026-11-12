"use client";

import Image from "next/image";
import Link from "next/link";
import { useAvisoForcado } from "@/hooks/useAvisoForcado";
import { useConfirmarDebito, useContasFixas, useContasPagasNoMes, type ContaFixa } from "@/hooks/useContasFixas";
import { pedeAtencao, situacaoDaConta, textoSituacao, type SituacaoConta } from "@/lib/contas-fixas";
import { formatarMoeda } from "@/lib/formatar";

type Item = { conta: ContaFixa; situacao: SituacaoConta };

/** Exemplo para a prévia do Painel do sistema. */
const EXEMPLO: Item[] = [
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

const BORDA: Partial<Record<SituacaoConta["tipo"], string>> = {
  vence: "var(--color-pendente)",
  debito: "var(--color-pendente)",
  atrasada: "var(--color-negativo)",
};

function Linha({ conta, situacao, exemplo }: Item & { exemplo: boolean }) {
  const confirmar = useConfirmarDebito();
  return (
    <li
      className="flex items-center gap-3 rounded-[10px] border border-l-4 border-black/8 bg-white py-2.5 pr-3 pl-3 shadow-cartao"
      style={{ borderLeftColor: BORDA[situacao.tipo] }}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-dourado-claro">
        <Image src="/icones/conta-fixa.svg" alt="" width={18} height={18} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-bold">{conta.descricao}</span>
        <span className="text-xs text-cinza-escuro">
          {textoSituacao(situacao, conta.dia_vencimento)} · {formatarMoeda(conta.valor)}
        </span>
      </span>
      {situacao.tipo === "debito" ? (
        <button
          type="button"
          onClick={() => !exemplo && confirmar.mutate(conta)}
          disabled={confirmar.isPending}
          className="shrink-0 rounded-[8px] bg-marinho px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-50"
        >
          Já caiu
        </button>
      ) : (
        <Link
          href={exemplo ? "/contas" : `/novo/despesa?fixa=${conta.id}`}
          className="shrink-0 rounded-[8px] bg-marinho px-3 py-1.5 text-[11px] font-bold text-white"
        >
          Pagar
        </Link>
      )}
    </li>
  );
}

/**
 * Aviso no Início: contas fixas que vencem em até 3 dias, atrasadas ou com
 * débito automático para confirmar. Some quando a conta do mês é paga.
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
        <Link href="/contas" className="font-bold tracking-normal text-dourado">
          Ver todas
        </Link>
      </h2>
      <ul className="flex flex-col gap-2">
        {itens.map((item) => (
          <Linha key={item.conta.id} {...item} exemplo={forcado} />
        ))}
      </ul>
    </section>
  );
}
