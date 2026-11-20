"use client";

import { useState } from "react";
import { fundoCarteira, IconeTipoCarteira } from "@/components/carteiras/CartaoCarteira";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { Valor } from "@/components/ui/Valor";
import type { Carteira } from "@/hooks/useCarteiras";
import { formatarMoeda } from "@/lib/formatar";

/** Caixinha de marcar, desenhada (o input nativo some atrás do botão inteiro). */
function Marca({ marcada }: { marcada: boolean }) {
  return (
    <span
      aria-hidden
      className={`grid size-5 shrink-0 place-items-center rounded-[6px] border-2 ${
        marcada ? "border-marinho bg-marinho text-white" : "border-cinza-claro bg-white"
      }`}
    >
      {marcada && (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      )}
    </span>
  );
}

/**
 * Painel do botão de carteira: a pessoa marca quais carteiras contam no Início
 * e no Resumo (uma, várias ou todas), vendo o saldo de agora de cada uma e a
 * soma das marcadas. "Salvar" grava na conta, então a escolha continua depois
 * de sair e entrar de novo. Sempre fica pelo menos uma marcada.
 */
export function SeletorCarteira({
  ativas,
  saldos,
  escolhidas,
  salvando,
  erro,
  aoSalvar,
  aoFechar,
}: {
  ativas: Carteira[];
  saldos?: Map<string, number>;
  /** Ids que contam hoje. */
  escolhidas: string[];
  salvando: boolean;
  erro?: string;
  aoSalvar: (ids: string[]) => void;
  aoFechar: () => void;
}) {
  const [marcadas, setMarcadas] = useState(() => new Set(escolhidas));
  const saldo = (c: Carteira) => saldos?.get(c.id) ?? c.saldo_inicial;
  const todas = marcadas.size === ativas.length;
  const soma = ativas.filter((c) => marcadas.has(c.id)).reduce((total, c) => total + saldo(c), 0);

  function alternar(id: string) {
    const novas = new Set(marcadas);
    if (novas.has(id)) {
      if (novas.size === 1) return;
      novas.delete(id);
    } else novas.add(id);
    setMarcadas(novas);
  }

  const opcao = (ativa: boolean) =>
    `flex w-full items-center gap-3 rounded-[12px] border px-3 py-2.5 text-left ${
      ativa ? "border-marinho bg-cinza-fundo" : "border-cinza-claro bg-white"
    }`;

  return (
    <PainelInferior
      idTitulo="carteira-titulo"
      aoFechar={aoFechar}
      aoEnviar={(e) => {
        e.preventDefault();
        aoSalvar([...marcadas]);
      }}
    >
      <div className="flex flex-col gap-0.5">
        <h2 id="carteira-titulo" className="text-lg font-extrabold">
          Quais carteiras contar?
        </h2>
        <p className="text-xs text-cinza-escuro">
          Marque uma ou mais. O Início e o Resumo somam só as marcadas, e a escolha fica salva na sua conta.
        </p>
      </div>
      <AvisoErro mensagem={erro} />
      <ul className="flex flex-col gap-2">
        <li>
          <button
            type="button"
            role="checkbox"
            aria-checked={todas}
            onClick={() => setMarcadas(new Set(ativas.map((c) => c.id)))}
            className={opcao(todas)}
          >
            <Marca marcada={todas} />
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cinza-fundo text-cinza-escuro">
              <IconeTipoCarteira tipo={null} tamanho={18} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-bold">Todas as carteiras</span>
              <span className="text-[11px] text-cinza-escuro">Saldo e resumo de tudo</span>
            </span>
          </button>
        </li>
        {ativas.map((carteira) => {
          const marcada = marcadas.has(carteira.id);
          return (
            <li key={carteira.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={marcada}
                onClick={() => alternar(carteira.id)}
                className={opcao(marcada && !todas)}
              >
                <Marca marcada={marcada} />
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-full text-white"
                  style={{ background: fundoCarteira(carteira.cor) }}
                >
                  <IconeTipoCarteira tipo={carteira.tipo} tamanho={18} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-bold">{carteira.nome}</span>
                  <span className="text-[11px] text-cinza-escuro">
                    {carteira.tipo ?? "Carteira"}
                    {carteira.padrao && " · principal"}
                  </span>
                </span>
                <span className="text-sm font-extrabold">
                  <Valor texto={formatarMoeda(saldo(carteira))} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="flex items-center justify-between rounded-[10px] bg-cinza-fundo px-3 py-2 text-xs">
        <span className="text-cinza-escuro">
          {todas ? "Todas marcadas" : marcadas.size === 1 ? "1 carteira marcada" : `${marcadas.size} carteiras marcadas`}, hoje
        </span>
        <b className="text-sm">
          <Valor texto={formatarMoeda(soma)} />
        </b>
      </p>
      <Botao type="submit" disabled={salvando}>
        {salvando ? "Salvando..." : "Salvar"}
      </Botao>
    </PainelInferior>
  );
}
