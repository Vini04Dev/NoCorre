"use client";

import { fundoCarteira, IconeTipoCarteira } from "@/components/carteiras/CartaoCarteira";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { Valor } from "@/components/ui/Valor";
import type { Carteira } from "@/hooks/useCarteiras";
import { formatarMoeda } from "@/lib/formatar";

/**
 * Painel do botão de carteira: "Todas as carteiras" ou uma delas, com o saldo
 * de agora. A escolha vale para o Início e o Resumo até o app ser fechado.
 */
export function SeletorCarteira({
  ativas,
  saldos,
  valor,
  aoEscolher,
  aoFechar,
}: {
  ativas: Carteira[];
  saldos?: Map<string, number>;
  valor: string | null;
  aoEscolher: (id: string | null) => void;
  aoFechar: () => void;
}) {
  const total = ativas.reduce((soma, c) => soma + (saldos?.get(c.id) ?? c.saldo_inicial), 0);
  const escolher = (id: string | null) => {
    aoEscolher(id);
    aoFechar();
  };
  const opcao = (ativa: boolean) =>
    `flex w-full items-center gap-3 rounded-[12px] border px-3 py-2.5 text-left ${
      ativa ? "border-marinho bg-cinza-fundo" : "border-cinza-claro bg-white"
    }`;

  return (
    <PainelInferior idTitulo="carteira-titulo" aoFechar={aoFechar}>
      <div className="flex flex-col gap-0.5">
        <h2 id="carteira-titulo" className="text-lg font-extrabold">
          Ver qual carteira?
        </h2>
        <p className="text-xs text-cinza-escuro">
          Muda o que o Início e o Resumo mostram. Lançamentos novos já abrem com ela marcada.
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        <li>
          <button type="button" onClick={() => escolher(null)} aria-pressed={valor === null} className={opcao(valor === null)}>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cinza-fundo text-cinza-escuro">
              <IconeTipoCarteira tipo={null} tamanho={18} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-bold">Todas as carteiras</span>
              <span className="text-[11px] text-cinza-escuro">Saldo e resumo de tudo</span>
            </span>
            <span className="text-sm font-extrabold">
              <Valor texto={formatarMoeda(total)} />
            </span>
          </button>
        </li>
        {ativas.map((carteira) => (
          <li key={carteira.id}>
            <button
              type="button"
              onClick={() => escolher(carteira.id)}
              aria-pressed={valor === carteira.id}
              className={opcao(valor === carteira.id)}
            >
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
                <Valor texto={formatarMoeda(saldos?.get(carteira.id) ?? carteira.saldo_inicial)} />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </PainelInferior>
  );
}
