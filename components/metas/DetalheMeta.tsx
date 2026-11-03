"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CirculoProgresso } from "./CirculoProgresso";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao, classeBotao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { ConfirmarExclusao } from "@/components/ui/ConfirmarExclusao";
import { useClientes } from "@/hooks/useClientes";
import { useExcluirMeta, useMeta } from "@/hooks/useMetas";
import { rotuloDia } from "@/lib/data";
import { formatarMoeda } from "@/lib/formatar";
import {
  corDaMeta,
  ROTULO_PARAMETRO,
  textoPeriodo,
  textoProgresso,
  textoRitmo,
  type MetaComProgresso,
} from "@/lib/metas";

const COMO_CALCULA: Record<MetaComProgresso["parametro"], string> = {
  receita: "soma das receitas pagas no período. Receitas pendentes só contam depois de marcadas como pagas.",
  quantidade: "soma da quantidade de todas as receitas do período, pagas ou pendentes.",
  despesa: "soma das despesas do período. O círculo mostra quanto do limite já foi usado.",
  conta: "soma das despesas ligadas a esta conta, em qualquer data. Ao lançar a despesa, escolha a conta em \"Pagar qual conta?\".",
};

export function DetalheMeta({ id }: { id: string }) {
  const { data: meta, isPending, error } = useMeta(id);

  if (isPending) return <p className="p-6 text-center text-[13px] text-cinza-escuro">Carregando...</p>;
  if (!meta) {
    return (
      <div className="flex flex-col items-center gap-3 p-6 text-center text-[13px]">
        <p>{error?.message ?? "Meta não encontrada."}</p>
        <Link href="/metas" className="font-black text-dourado">
          Voltar para Metas
        </Link>
      </div>
    );
  }
  return <Conteudo meta={meta} />;
}

function Conteudo({ meta }: { meta: MetaComProgresso }) {
  const router = useRouter();
  const excluir = useExcluirMeta();
  const { data: clientes } = useClientes();
  const [confirmando, setConfirmando] = useState(false);

  const cor = corDaMeta(meta);
  const conta = meta.parametro === "conta";
  const ultimaParcela = meta.parcela_total !== null && meta.parcela_atual === meta.parcela_total;
  const filtro = [meta.categoria, clientes?.find((cliente) => cliente.id === meta.cliente_id)?.nome]
    .filter(Boolean)
    .join(" · ");

  const linhas: [string, string][] = [
    ["Parâmetro", ROTULO_PARAMETRO[meta.parametro]],
    [conta ? "Valor da conta" : meta.parametro === "despesa" ? "Limite" : "Valor alvo",
      meta.parametro === "quantidade" ? `${meta.valor_alvo.toLocaleString("pt-BR")} entregas` : formatarMoeda(meta.valor_alvo)],
    [conta ? "Período (vence no fim)" : "Período", textoPeriodo(meta, true)],
    ...(filtro ? [["Só conta", filtro] as [string, string]] : []),
    ...(meta.parcela_total ? [["Parcela", `${meta.parcela_atual} de ${meta.parcela_total}`] as [string, string]] : []),
    ["Status", meta.status === "ativa" ? "Ativa" : "Pausada"],
  ];

  const mensagemExclusao =
    conta && meta.pagamentos.length > 0
      ? "Os pagamentos continuam no Resumo e no saldo, só deixam de estar ligados a esta conta."
      : "A meta some da lista. Seus lançamentos não mudam.";

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex flex-col gap-3 px-[17px] pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
        <CabecalhoTela titulo={conta ? "Detalhe da conta" : "Detalhe da meta"} voltarPara="/metas" />
        <AvisoErro mensagem={excluir.error?.message} />

        <section className="flex flex-col items-center gap-2 rounded-[14px] border border-black/8 bg-white px-4 py-5 text-center shadow-cartao">
          <CirculoProgresso percentual={meta.percentual} traco={cor.traco} tamanho={140} espessura={14} />
          <h2 className="mt-1 text-base font-extrabold">{meta.nome}</h2>
          <p className={`text-sm font-semibold ${cor.texto}`}>{textoProgresso(meta)}</p>
          {meta.aReceber > 0 && !meta.encerrada && (
            <p className="text-xs font-medium text-pendente">+ {formatarMoeda(meta.aReceber)} a receber (pendente)</p>
          )}
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${cor.fundo} ${cor.texto}`}>
            {textoRitmo(meta)}
          </span>
        </section>

        <dl className="rounded-[12px] border border-black/8 bg-white px-4 py-1 shadow-cartao">
          {linhas.map(([rotulo, texto]) => (
            <div key={rotulo} className="flex justify-between gap-4 border-b border-black/6 py-[11px] last:border-b-0">
              <dt className="text-xs text-cinza-escuro">{rotulo}</dt>
              <dd className="text-right text-xs font-semibold">{texto}</dd>
            </div>
          ))}
        </dl>

        {conta && (
          <section className="flex flex-col gap-1.5">
            <h3 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">PAGAMENTOS</h3>
            {meta.pagamentos.length === 0 ? (
              <p className="text-xs text-cinza-escuro">Nenhum pagamento ligado a esta conta ainda.</p>
            ) : (
              <ul className="rounded-[12px] border border-black/8 bg-white px-4 py-0.5 shadow-cartao">
                {meta.pagamentos.map((pagamento) => (
                  <li key={pagamento.id} className="border-b border-black/6 last:border-b-0">
                    <Link href={`/resumo/despesa/${pagamento.id}`} className="flex justify-between gap-3 py-[10px] text-xs">
                      <span className="min-w-0 truncate">
                        <span className="font-semibold">{rotuloDia(new Date(pagamento.data_hora))}</span>
                        <span className="text-cinza-escuro"> · {pagamento.observacao || pagamento.tipo}</span>
                      </span>
                      <span className="shrink-0 font-semibold text-negativo">{formatarMoeda(pagamento.valor_total ?? 0)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <p className="text-[11px] text-cinza-escuro">Como é calculado: {COMO_CALCULA[meta.parametro]}</p>
      </main>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-2.5 bg-fundo px-[17px] pt-2.5 pb-[calc(env(safe-area-inset-bottom)+26px)]">
        {conta && meta.situacao !== "quitada" && meta.status === "ativa" && (
          <Link href={`/novo/despesa?conta=${meta.id}`} className={classeBotao()}>
            Lançar pagamento
          </Link>
        )}
        {meta.encerrada && !ultimaParcela && (
          <Link href={`/metas/nova?repetir=${meta.id}`} className={classeBotao(conta ? "contorno" : "primario")}>
            {meta.parcela_total ? `Lançar parcela ${(meta.parcela_atual ?? 0) + 1}/${meta.parcela_total}` : "Repetir no próximo período"}
          </Link>
        )}
        <div className="grid grid-cols-2 gap-2.5">
          <Botao variante="perigo" onClick={() => setConfirmando(true)}>
            Excluir
          </Botao>
          <Link href={`/metas/${meta.id}/editar`} className={classeBotao("contorno")}>
            Editar
          </Link>
        </div>
      </div>

      {confirmando && (
        <ConfirmarExclusao
          titulo={conta ? "Excluir esta conta?" : "Excluir esta meta?"}
          mensagem={mensagemExclusao}
          excluindo={excluir.isPending}
          aoCancelar={() => setConfirmando(false)}
          aoConfirmar={() =>
            excluir.mutate(meta.id, { onSuccess: () => router.push("/metas"), onSettled: () => setConfirmando(false) })
          }
        />
      )}
    </div>
  );
}
