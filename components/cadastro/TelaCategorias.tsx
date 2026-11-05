"use client";

import { useState } from "react";
import { PainelCategoria } from "./PainelCategoria";
import { TopoCadastro } from "./TopoCadastro";
import { useCategorias, type Categoria } from "@/hooks/useCategorias";
import { CATEGORIAS_PADRAO, type TipoCategoria } from "@/lib/categorias-padrao";

const SECOES: { tipo: TipoCategoria; titulo: string }[] = [
  { tipo: "receita", titulo: "Receita" },
  { tipo: "despesa", titulo: "Despesa" },
];

/** null: painel fechado; "nova": criando; Categoria: editando essa. */
type Painel = null | "nova" | Categoria;

export function TelaCategorias() {
  const { data: categorias, isError, error } = useCategorias();
  const [painel, setPainel] = useState<Painel>(null);

  return (
    <main className="flex flex-col gap-3 px-5 pt-[calc(env(safe-area-inset-top)+12px)] lg:max-w-3xl lg:px-0 lg:pt-2">
      <TopoCadastro abaAtiva="/cadastro/categorias" novo={{ aoClicar: () => setPainel("nova") }} />
      {isError && <p className="text-center text-[13px] text-negativo">{error.message}</p>}

      {SECOES.map(({ tipo, titulo }) => (
        <section key={tipo} className="flex flex-col gap-1.5">
          <div className="flex justify-between px-0.5 text-[10px] font-semibold text-cinza-escuro">
            <h2 className="uppercase">{titulo}</h2>
            <span>padrão + suas</span>
          </div>
          <ul className="rounded-[12px] border border-black/8 bg-white px-[14px] py-0.5 shadow-cartao">
            {CATEGORIAS_PADRAO[tipo].map((nome) => (
              <li key={nome} className="flex items-center justify-between border-b border-black/6 py-[9px] text-[13px] last:border-b-0">
                {nome}
                <span className="rounded-full bg-cinza-fundo px-2 py-0.5 text-[9px] font-medium text-cinza-escuro">
                  padrão
                </span>
              </li>
            ))}
            {categorias
              ?.filter((categoria) => categoria.tipo === tipo)
              .map((categoria) => (
                <li key={categoria.id} className="border-b border-black/6 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setPainel(categoria)}
                    className="flex w-full items-center justify-between py-[9px] text-left text-[13px] font-semibold"
                  >
                    {categoria.nome}
                    <span aria-hidden className="text-base text-cinza-escuro">
                      ›
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </section>
      ))}

      {painel && (
        <PainelCategoria
          // key: trocar de categoria recria o painel com os dados da nova.
          key={painel === "nova" ? "nova" : painel.id}
          categoria={painel === "nova" ? undefined : painel}
          aoFechar={() => setPainel(null)}
        />
      )}
    </main>
  );
}
