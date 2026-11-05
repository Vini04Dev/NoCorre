"use client";

import Link from "next/link";
import { useState } from "react";
import { CartaoMeta } from "./CartaoMeta";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { useMetas } from "@/hooks/useMetas";

const ABAS = [
  { valor: "ativas", rotulo: "Ativas" },
  { valor: "encerradas", rotulo: "Encerradas" },
] as const;

const RODAPE = {
  ativas: "O progresso é calculado automaticamente a partir dos seus lançamentos. Contas a pagar só contam as despesas ligadas a elas.",
  encerradas:
    "Metas de receita e de entregas vão para Encerradas quando são batidas ou quando o período termina. Limites de despesa, só no fim do período. Contas, quando quitadas.",
};

export function TelaMetas() {
  const { data: metas, isPending, isError, error } = useMetas();
  const [aba, setAba] = useState<(typeof ABAS)[number]["valor"]>("ativas");

  const lista = (metas ?? []).filter((meta) => (aba === "encerradas") === meta.encerrada);
  // Ativas: o que vence primeiro no topo. Encerradas: as mais recentes no topo.
  if (aba === "encerradas") lista.reverse();

  return (
    <main className="flex flex-col gap-3.5 px-[17px] pt-[calc(env(safe-area-inset-top)+12px)] pb-4 lg:px-0 lg:pt-2">
      <CabecalhoTela
        titulo="Metas"
        voltarPara="/"
        tituloGrande
        acao={
          <Link
            href="/metas/nova"
            aria-label="Nova meta"
            className="grid size-[38px] place-items-center rounded-full bg-linear-to-r from-dourado-claro to-dourado text-[22px] font-semibold"
          >
            +
          </Link>
        }
      />

      <div role="tablist" className="flex rounded-[10px] bg-cinza-fundo p-1 lg:max-w-sm">
        {ABAS.map(({ valor, rotulo }) => (
          <button
            key={valor}
            type="button"
            role="tab"
            aria-selected={aba === valor}
            onClick={() => setAba(valor)}
            className={`flex-1 rounded-lg py-1.5 text-[13px] ${
              aba === valor ? "bg-white font-semibold shadow-cartao" : "font-medium"
            }`}
          >
            {rotulo}
          </button>
        ))}
      </div>

      {isPending && <p className="text-center text-[13px] text-cinza-escuro">Carregando...</p>}
      {isError && <p className="text-center text-[13px] text-negativo">{error.message}</p>}

      {metas && lista.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center text-[13px] text-cinza-escuro">
          {aba === "ativas" ? (
            <>
              <p>Nenhuma meta ativa.</p>
              <Link href="/metas/nova" className="font-black text-dourado">
                Criar uma meta
              </Link>
            </>
          ) : (
            <p>Nenhuma meta encerrada ainda.</p>
          )}
        </div>
      )}

      <ul className="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
        {lista.map((meta) => (
          <li key={meta.id}>
            <CartaoMeta meta={meta} />
          </li>
        ))}
      </ul>

      {lista.length > 0 && <p className="px-4 text-center text-[11px] text-cinza-escuro">{RODAPE[aba]}</p>}
    </main>
  );
}
