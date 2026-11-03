"use client";

import Image from "next/image";
import Link from "next/link";
import type { Movimentacao } from "@/hooks/useMovimentacoes";
import { horaCurta, rotuloDia } from "@/lib/data";
import { salvarSequencia } from "@/lib/sequencia-extrato";
import { formatarMoeda } from "@/lib/formatar";

const ROTULO_FORMA = { pix: "Pix", dinheiro: "Dinheiro" } as const;

/** Título, linha de apoio, valor e cor de cada item do extrato. */
function descrever(movimentacao: Movimentacao) {
  if (movimentacao.tipo === "receita") {
    const receita = movimentacao.dados;
    const pendente = receita.status_pagamento === "pendente";
    const cliente = receita.clientes?.nome;
    return {
      href: `/resumo/receita/${receita.id}`,
      titulo: cliente ? `${receita.tipo} - ${cliente}` : receita.tipo,
      apoio: pendente ? "Pendente" : receita.forma_pagamento ? ROTULO_FORMA[receita.forma_pagamento] : "Recebido",
      valor: `+ ${formatarMoeda(receita.valor_total ?? 0)}`,
      corValor: pendente ? "text-pendente" : "",
    };
  }
  const despesa = movimentacao.dados;
  return {
    href: `/resumo/despesa/${despesa.id}`,
    titulo: despesa.observacao || despesa.tipo,
    apoio: despesa.tipo,
    valor: `– ${formatarMoeda(despesa.valor_total ?? 0)}`,
    corValor: "",
  };
}

/** Extrato agrupado por dia (HOJE, ONTEM, 06 SET), na ordem em que chega. */
export function ListaMovimentacoes({ movimentacoes }: { movimentacoes: Movimentacao[] }) {
  // Ao abrir um item, guarda a lista inteira para o detalhe navegar entre eles.
  const lembrarSequencia = () =>
    salvarSequencia(movimentacoes.map(({ tipo, dados }) => ({ tipo, id: dados.id })));

  const grupos = new Map<string, Movimentacao[]>();
  for (const movimentacao of movimentacoes) {
    const rotulo = rotuloDia(new Date(movimentacao.dados.data_hora));
    grupos.set(rotulo, [...(grupos.get(rotulo) ?? []), movimentacao]);
  }

  return (
    <div className="overflow-hidden rounded-[14px] border border-cinza-claro bg-white">
      {[...grupos].map(([rotulo, itens]) => (
        <section key={rotulo}>
          <h3 className="bg-cinza-claro/40 px-4 pt-3 pb-1 text-[11px] font-semibold tracking-[0.44px] text-cinza">
            {rotulo}
          </h3>
          <ul>
            {itens.map((movimentacao) => {
              const item = descrever(movimentacao);
              const receita = movimentacao.tipo === "receita";
              return (
                <li key={movimentacao.dados.id} className="border-b border-cinza-claro last:border-b-0">
                  <Link href={item.href} onClick={lembrarSequencia} className="flex items-center gap-3 px-4 py-2">
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-full ${
                        receita ? "bg-dourado-claro" : "bg-cinza-claro"
                      }`}
                    >
                      <Image
                        src={receita ? "/icones/seta-extrato-receita.svg" : "/icones/seta-extrato-despesa.svg"}
                        alt=""
                        width={20}
                        height={20}
                      />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-px">
                      <span className="truncate text-sm font-semibold">{item.titulo}</span>
                      <span className="truncate text-[11px] text-cinza">
                        {horaCurta(new Date(movimentacao.dados.data_hora))} · {item.apoio}
                      </span>
                    </span>
                    <span className={`shrink-0 text-sm ${receita ? "font-semibold" : "font-medium"} ${item.corValor}`}>
                      {item.valor}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
