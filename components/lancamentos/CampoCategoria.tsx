"use client";

import { useState } from "react";
import { CLASSE_CHIP_INATIVO, SeletorChips } from "@/components/ui/SeletorChips";
import { useCategorias } from "@/hooks/useCategorias";
import { CATEGORIAS_PADRAO, type TipoCategoria } from "@/lib/categorias-padrao";

type Props = {
  tipo: TipoCategoria;
  valor: string;
  aoMudar: (valor: string) => void;
  erro?: string;
};

/**
 * Categoria do lançamento: as padrão, as criadas no Cadastro e "+ Outra" para
 * digitar um nome só desta vez. O banco guarda o nome como texto livre.
 */
export function CampoCategoria({ tipo, valor, aoMudar, erro }: Props) {
  const { data: categorias } = useCategorias();
  const nomes = [
    ...CATEGORIAS_PADRAO[tipo],
    ...(categorias ?? []).filter((categoria) => categoria.tipo === tipo).map((categoria) => categoria.nome),
  ];
  const [digitando, setDigitando] = useState(false);
  // Uma categoria conhecida (escolhida pela sugestão da descrição, por exemplo) sai do modo "Outra".
  const outraEscolhida = !nomes.includes(valor) && (digitando || valor !== "");

  return (
    <div className="flex flex-col gap-2">
      <SeletorChips
        rotulo="Categoria"
        opcoes={nomes.map((nome) => ({ valor: nome, rotulo: nome }))}
        valor={outraEscolhida ? null : valor}
        aoMudar={(nome) => {
          setDigitando(false);
          aoMudar(nome ?? "");
        }}
        erro={erro}
        extra={
          <button
            type="button"
            aria-pressed={outraEscolhida}
            onClick={() => {
              setDigitando(true);
              aoMudar("");
            }}
            className={
              outraEscolhida
                ? "rounded-full border border-marinho bg-marinho px-[13px] py-1.5 text-xs font-semibold text-white"
                : CLASSE_CHIP_INATIVO
            }
          >
            + Outra
          </button>
        }
      />
      {outraEscolhida && (
        <input
          autoFocus
          value={valor}
          onChange={(evento) => aoMudar(evento.target.value)}
          maxLength={50}
          placeholder="Nome da categoria"
          aria-label="Nome da outra categoria"
          className="rounded-[10px] border border-cinza-claro bg-white px-[14px] py-[11px] text-[13px] outline-none focus:border-dourado"
        />
      )}
    </div>
  );
}
