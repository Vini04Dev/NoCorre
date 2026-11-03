"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao, classeBotao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { NavegacaoDetalhe } from "./NavegacaoDetalhe";
import { ConfirmarExclusao } from "@/components/ui/ConfirmarExclusao";
import { useExcluirLancamento, useMarcarComoPago } from "@/hooks/useLancamentos";
import { useDespesa, useReceita, type Despesa, type Receita } from "@/hooks/useMovimentacoes";
import { dataHoraCompleta } from "@/lib/data";
import { formatarMoeda } from "@/lib/formatar";

const ROTULO_FORMA = { pix: "Pix", dinheiro: "Dinheiro" } as const;

type Props = { tipo: "receita"; id: string } | { tipo: "despesa"; id: string };

/** Detalhe de uma receita ou despesa, com Editar, Excluir e, se pendente, Marcar como pago. */
export function DetalheLancamento(props: Props) {
  // Os dois hooks rodam sempre (regra dos hooks); só um deles tem o id certo.
  const receita = useReceita(props.tipo === "receita" ? props.id : "");
  const despesa = useDespesa(props.tipo === "despesa" ? props.id : "");
  const consulta = props.tipo === "receita" ? receita : despesa;
  const titulo = props.tipo === "receita" ? "Detalhe da receita" : "Detalhe da despesa";

  if (consulta.isPending) {
    return <p className="p-6 text-center text-[13px] text-cinza-escuro">Carregando...</p>;
  }
  if (!consulta.data) {
    return (
      <div className="flex flex-col items-center gap-3 p-6 text-center text-[13px]">
        <p>{consulta.error?.message ?? "Lançamento não encontrado."}</p>
        <Link href="/resumo" className="font-black text-dourado">
          Voltar para o Resumo
        </Link>
      </div>
    );
  }

  return props.tipo === "receita" ? (
    <Conteudo titulo={titulo} receita={receita.data!} />
  ) : (
    <Conteudo titulo={titulo} despesa={despesa.data!} />
  );
}

function Conteudo({ titulo, receita, despesa }: { titulo: string; receita?: Receita; despesa?: Despesa }) {
  const router = useRouter();
  const excluir = useExcluirLancamento();
  const marcarPago = useMarcarComoPago();
  const [confirmando, setConfirmando] = useState(false);

  const lancamento = (receita ?? despesa)!;
  const pendente = receita?.status_pagamento === "pendente";
  const valor = formatarMoeda(lancamento.valor_total ?? 0);
  const caminho = receita ? `/resumo/receita/${receita.id}` : `/resumo/despesa/${despesa!.id}`;

  const linhas: [string, string][] = receita
    ? [
        ["Cliente", receita.clientes?.nome ?? "–"],
        ["Categoria", receita.tipo],
        ["Data e hora", dataHoraCompleta(new Date(receita.data_hora))],
        ["Quantidade", String(receita.quantidade)],
        ["Valor unitário", formatarMoeda(receita.valor_unitario)],
        ["Total", valor],
        ["Pagamento", receita.forma_pagamento ? ROTULO_FORMA[receita.forma_pagamento] : "–"],
        ...(receita.observacao ? [["Observação", receita.observacao] as [string, string]] : []),
      ]
    : [
        ["Descrição", despesa!.observacao || "–"],
        ["Categoria", despesa!.tipo],
        ["Data e hora", dataHoraCompleta(new Date(despesa!.data_hora))],
        ["Quantidade", String(despesa!.quantidade)],
        ["Valor unitário", formatarMoeda(despesa!.valor_unitario)],
        ["Total", valor],
      ];

  const etiqueta = receita
    ? pendente
      ? { texto: "Pendente", classe: "bg-pendente/15 text-pendente" }
      : { texto: "Recebido", classe: "bg-recebido/12 text-recebido" }
    : { texto: "Despesa", classe: "bg-negativo/12 text-negativo" };

  const mensagemExclusao = pendente
    ? `Essa receita ainda não foi paga (${valor} a receber). Excluir mesmo assim?`
    : receita
      ? `Essa receita de ${valor} sai do extrato e do saldo.`
      : `Essa despesa de ${valor} sai do extrato e do saldo.`;

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex flex-col gap-3 px-[17px] pt-[calc(env(safe-area-inset-top)+12px)]">
        <CabecalhoTela titulo={titulo} voltarPara="/resumo" />
        <NavegacaoDetalhe atual={{ tipo: receita ? "receita" : "despesa", id: lancamento.id }} />
        <AvisoErro mensagem={excluir.error?.message ?? marcarPago.error?.message} />

        <section className="flex flex-col gap-2 rounded-[12px] border border-black/8 bg-white p-4 shadow-cartao">
          <div className="flex items-center gap-3">
            <span
              className={`grid size-10 place-items-center rounded-full ${receita ? "bg-positivo/12" : "bg-negativo/12"}`}
            >
              <Image
                src={receita ? "/icones/seta-receita.svg" : "/icones/seta-despesa.svg"}
                alt=""
                width={22}
                height={22}
              />
            </span>
            <span className="flex-1 text-sm font-semibold">{lancamento.tipo}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${etiqueta.classe}`}>
              {etiqueta.texto}
            </span>
          </div>
          <p
            className={`text-[30px] font-extrabold ${
              receita ? (pendente ? "text-pendente" : "text-positivo") : "text-negativo"
            }`}
          >
            {receita ? "+" : "–"} {valor}
          </p>
          {pendente && (
            <p className="text-xs text-cinza-escuro">
              Ainda não recebido. Este valor aparece em Pendentes e não entra no saldo até ser marcado como pago.
            </p>
          )}
        </section>

        <dl className="rounded-[12px] border border-black/8 bg-white px-4 py-1 shadow-cartao">
          {linhas.map(([rotulo, texto]) => (
            <div key={rotulo} className="flex justify-between gap-4 border-b border-black/6 py-[11px] last:border-b-0">
              <dt className="text-xs text-cinza-escuro">{rotulo}</dt>
              <dd className="text-right text-xs font-semibold">{texto}</dd>
            </div>
          ))}
        </dl>
      </main>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-2.5 bg-fundo px-[17px] pt-2.5 pb-[calc(env(safe-area-inset-bottom)+26px)]">
        {pendente && (
          <Botao onClick={() => marcarPago.mutate(receita!.id)} disabled={marcarPago.isPending}>
            {marcarPago.isPending ? "Salvando..." : "Marcar como pago"}
          </Botao>
        )}
        <div className="grid grid-cols-2 gap-2.5">
          <Link href={`${caminho}/editar`} className={classeBotao("contorno")}>
            Editar
          </Link>
          <Botao variante="perigo" onClick={() => setConfirmando(true)}>
            Excluir
          </Botao>
        </div>
      </div>

      {confirmando && (
        <ConfirmarExclusao
          titulo={receita ? "Excluir esta receita?" : "Excluir esta despesa?"}
          mensagem={mensagemExclusao}
          excluindo={excluir.isPending}
          aoCancelar={() => setConfirmando(false)}
          aoConfirmar={() =>
            excluir.mutate(
              { tabela: receita ? "receitas" : "despesas", id: lancamento.id },
              { onSuccess: () => router.push("/resumo"), onSettled: () => setConfirmando(false) },
            )
          }
        />
      )}
    </div>
  );
}
