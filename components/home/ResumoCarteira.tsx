"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { fundoCarteira, IconeTipoCarteira } from "@/components/carteiras/CartaoCarteira";
import { LinhaValor } from "@/components/ui/LinhaValor";
import { Valor } from "@/components/ui/Valor";
import { useSaldosCarteiras, useTransferenciasDoPeriodo, type Carteira } from "@/hooks/useCarteiras";
import { gravarEstadoDaTela } from "@/hooks/useEstadoDaTela";
import type { Despesa, Entrada, Receita } from "@/hooks/useMovimentacoes";
import { movimentoDaCarteira } from "@/lib/carteiras";
import { formatarMoeda } from "@/lib/formatar";

type Props = {
  carteira: Carteira;
  principalId: string | null;
  inicio: Date;
  fim: Date;
  dados?: { receitas: Receita[]; despesas: Despesa[]; entradas: Entrada[] };
};

/**
 * Início com uma carteira escolhida: o saldo de agora em destaque e, no
 * período, o que entrou e o que saiu por ela (receitas, outras entradas,
 * despesas do corre ou pessoais e transferências). Responde "o que passou
 * pela Next nesta semana?"; o saldo de tudo fica na visão "Todas".
 */
export function ResumoCarteira({ carteira, principalId, inicio, fim, dados }: Props) {
  const router = useRouter();
  const { data: saldos } = useSaldosCarteiras();
  const { data: transferencias } = useTransferenciasDoPeriodo(inicio, fim);
  const pronto = Boolean(dados && transferencias);
  const m = movimentoDaCarteira(dados ?? { receitas: [], despesas: [], entradas: [] }, transferencias ?? [], carteira.id, principalId);
  const moeda = (valor: number) => (!pronto ? "–" : <Valor texto={formatarMoeda(valor)} />);
  const saldo = saldos?.get(carteira.id);

  // Toque abre o extrato completo da carteira na tela Carteiras.
  const abrirCarteira = () => {
    gravarEstadoDaTela("carteiras:escolhida", carteira.id);
    router.push("/carteiras");
  };

  const detalhes = [
    m.entradas > 0 && `${formatarMoeda(m.entradas)} de outras entradas`,
    m.chegou > 0 && `${formatarMoeda(m.chegou)} transferidos para cá`,
    m.enviado > 0 && `${formatarMoeda(m.enviado)} transferidos daqui`,
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
      <LinhaValor rotulo="Entrou" valor={moeda(m.entrou)} icone="/icones/receita.svg" corValor="text-recebido" aoTocar={abrirCarteira} />
      <LinhaValor rotulo="Saiu" valor={moeda(m.saiu)} icone="/icones/despesa.svg" corValor="text-negativo" aoTocar={abrirCarteira} />
      <LinhaValor rotulo="Pendentes" valor={moeda(m.pendentes)} icone="/icones/pendente.svg" corValor="text-pendente" aoTocar={abrirCarteira} />
      <LinhaValor
        rotulo="Entregas"
        valor={pronto ? String(m.entregas) : "–"}
        icone="/icones/moto.svg"
        corValor="text-positivo"
        aoTocar={abrirCarteira}
      />
      <p className="text-[11px] leading-snug text-cinza-escuro">
        Tudo que passou por {carteira.nome} no período, do corre ou não.
        {detalhes.length > 0 && ` Inclui ${detalhes.join(" · ")}.`} Para voltar a ver tudo, toque no botão de carteira no
        topo.
      </p>
    </div>
  );
}
