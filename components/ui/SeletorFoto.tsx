"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

type Props = {
  /** URL da foto já salva (assinada), ou null. */
  fotoSalva: string | null;
  /** undefined: mantém a foto salva; null: remove; File: troca. */
  novaFoto: File | null | undefined;
  aoMudar: (foto: File | null) => void;
  /** O que aparece sem foto (ex.: a inicial do cliente). Sem ele, um "+" tracejado. */
  semFoto?: React.ReactNode;
  /** Texto do botão quando ainda não há foto. */
  rotuloAdicionar?: string;
};

/** Foto redonda de 84 px com Trocar / Remover, usada no cliente e no perfil. */
export function SeletorFoto({ fotoSalva, novaFoto, aoMudar, semFoto, rotuloAdicionar = "Adicionar foto" }: Props) {
  const seletor = useRef<HTMLInputElement>(null);
  const previa = useObjectUrl(novaFoto);
  const exibida = novaFoto === undefined ? fotoSalva : previa;
  const abrir = () => seletor.current?.click();

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button type="button" onClick={abrir} aria-label={exibida ? "Trocar foto" : rotuloAdicionar}>
        {exibida ? (
          <Image src={exibida} alt="" width={84} height={84} unoptimized className="size-[84px] rounded-full object-cover" />
        ) : (
          (semFoto ?? (
            <span className="grid size-[84px] place-items-center rounded-full border-[1.5px] border-dashed border-cinza bg-cinza-fundo text-[28px] font-medium text-cinza-escuro">
              +
            </span>
          ))
        )}
      </button>
      <div className="flex gap-3 text-xs font-medium">
        <button
          type="button"
          onClick={abrir}
          className={exibida || semFoto ? "font-semibold text-dourado" : "text-cinza-escuro"}
        >
          {exibida || semFoto ? "Trocar foto" : rotuloAdicionar}
        </button>
        {exibida && (
          <button type="button" onClick={() => aoMudar(null)} className="text-cinza-escuro">
            Remover
          </button>
        )}
      </div>
      <input
        ref={seletor}
        type="file"
        accept="image/*"
        hidden
        onChange={(evento) => {
          const arquivo = evento.target.files?.[0];
          if (arquivo) aoMudar(arquivo);
          evento.target.value = "";
        }}
      />
    </div>
  );
}

/** URL local para pré-visualizar o arquivo escolhido, liberada quando ele muda. */
function useObjectUrl(arquivo: File | null | undefined) {
  const url = useMemo(() => (arquivo ? URL.createObjectURL(arquivo) : null), [arquivo]);
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );
  return url;
}
