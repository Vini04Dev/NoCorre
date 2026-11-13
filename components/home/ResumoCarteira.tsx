"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { fundoCarteira, IconeTipoCarteira } from "@/components/carteiras/CartaoCarteira";
import { LinhaValor } from "@/components/ui/LinhaValor";
import { Valor } from "@/components/ui/Valor";
import { useSaldosCarteiras, useTransferenciasDoPeriodo, type Carteira } from "@/hooks/useCarteiras";
import { gravarEstadoDaTela } from "@/hooks/useEstadoDaTela";
import type { Despesa, Entrada, Receita } from "@/hooks/useMovimentacoes";
import { ehDaCarteira } from "@/lib/carteiras";
import { formatarMoeda } from "@/lib/formatar";

type Props = {
  carteira: Carteira;
  principalId: string | null;
  inicio: Date;
  fim: Date;
  dados?: { receitas: Receita[]; despesas: Despesa[]; entradas: Entrada[] };
};

const centavos = (valor: number | null) => Math.round((valor ?? 0) * 100);

/**
 * Início com uma carteira escolhida: o saldo de agora em destaque e, no
 * período, o que entrou e o que saiu por ela (receitas, outras entradas,
 * despesas do corre ou pessoais e transferências). Responde "o que passou
 * pela Next nesta semana?"; o saldo do corre fica na visão "Todas".
 */
export function ResumoCarteira({ carteira, principalId, inicio, fim, dados }: Props) {
  const router = useRouter();
  const { data: saldos } = useSaldosCarteiras();
  const { data: transferencias } = useTransferenciasDoPeriodo(inicio, fim);
  const daqui = (id: string | null) => ehDaCarteira(id, carteira.id, principalId);

  let recebidos = 0;
  let pendentes = 0;
  let entregas = 0;
  let despesas = 0;
  let entradas = 0;
  let chegou = 0;
  let enviado = 0;
  for (const r of dados?.receitas ?? []) {
    if (!daqui(r.carteira_id)) continue;
    if (r.status_pagamento === "pago") recebidos += centavos(r.valor_total);
    else pendentes += centavos(r.valor_total);
    entregas += r.quantidade;
  }
  for (const d of dados?.despesas ?? []) if (daqui(d.carteira_id)) despesas += centavos(d.valor_total);
  for (const e of dados?.entradas ?? []) if (daqui(e.carteira_id)) entradas += centavos(e.valor);
  for (const t of transferencias ?? []) {
    if (t.destino_id === carteira.id) chegou += centavos(t.valor);
    if (t.origem_id === carteira.id) enviado += centavos(t.valor);
  }
  const entrou = (recebidos + entradas + chegou) / 100;
  const saiu = (despesas + enviado) / 100;
  const pronto = Boolean(dados && transferencias);
  const moeda = (valor: number) => (!pronto ? "–" : <Valor texto={formatarMoeda(valor)} />);
  const saldo = saldos?.get(carteira.id);

  // Toque abre o extrato completo da carteira na tela Carteiras.
  const abrirCarteira = () => {
    gravarEstadoDaTela("carteiras:escolhida", carteira.id);
    router.push("/carteiras");
  };

  const detalhes = [
    entradas > 0 && `${formatarMoeda(entradas / 100)} de outras entradas`,
    chegou > 0 && `${formatarMoeda(chegou / 100)} transferidos para cá`,
    enviado > 0 && `${formatarMoeda(enviado / 100)} transferidos daqui`,
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-[5px]">
      <Link
        href="/carteiras"
        onClick={() => gravarEstadoDaTela("carteiras:escolhida", carteira.id)}
        className="relative mb-1.5 flex flex-col gap-0.5 rounded-[14px] px-4 py-3 text-white shadow-cartao"
        style={{ background: fundoCarteira(carteira.cor) }}
      >
        <span className="absolute top-3 right-3.5 opacity-90">
          <IconeTipoCarteira tipo={carteira.tipo} tamanho={20} />
        </span>
        <span className="text-[11px] text-white/85">{carteira.nome} · saldo agora</span>
        <span className="text-[24px] leading-tight font-extrabold">
          {saldo === undefined ? "–" : <Valor texto={formatarMoeda(saldo)} />}
        </span>
      </Link>
      <LinhaValor rotulo="Entrou" valor={moeda(entrou)} icone="/icones/receita.svg" corValor="text-recebido" aoTocar={abrirCarteira} />
      <LinhaValor rotulo="Saiu" valor={moeda(saiu)} icone="/icones/despesa.svg" corValor="text-negativo" aoTocar={abrirCarteira} />
      <LinhaValor rotulo="Pendentes" valor={moeda(pendentes / 100)} icone="/icones/pendente.svg" corValor="text-pendente" aoTocar={abrirCarteira} />
      <LinhaValor
        rotulo="Entregas"
        valor={pronto ? String(entregas) : "–"}
        icone="/icones/moto.svg"
        corValor="text-positivo"
        aoTocar={abrirCarteira}
      />
      <p className="text-[11px] leading-snug text-cinza-escuro">
        Tudo que passou por {carteira.nome} no período, do corre ou não.
        {detalhes.length > 0 && ` Inclui ${detalhes.join(" · ")}.`} Lançamentos novos vão para ela; dá para trocar no
        formulário.
      </p>
    </div>
  );
}
