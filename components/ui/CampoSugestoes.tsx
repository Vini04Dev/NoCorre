"use client";

import { useId, useState } from "react";
import { filtrarSugestoes } from "@/lib/sugestoes";

type Props = {
  rotulo: string;
  opcional?: boolean;
  valor: string;
  aoMudar: (valor: string) => void;
  /** Textos que a pessoa já usou antes, dos mais usados para os menos. */
  opcoes: string[];
  placeholder?: string;
  maxLength?: number;
};

/**
 * Campo de texto que sugere o que a pessoa já digitou em outros lançamentos.
 * As sugestões aparecem logo abaixo enquanto ela digita; tocar numa (ou usar
 * as setas e Enter) preenche o campo. Segue o padrão "combobox" de acessibilidade.
 */
export function CampoSugestoes({ rotulo, opcional, valor, aoMudar, opcoes, placeholder, maxLength }: Props) {
  const id = useId();
  const idLista = `${id}-sugestoes`;
  const [aberto, setAberto] = useState(false);
  const [destaque, setDestaque] = useState(-1);
  const sugestoes = aberto ? filtrarSugestoes(opcoes, valor) : [];
  const mostrar = sugestoes.length > 0;

  function escolher(texto: string) {
    aoMudar(texto);
    setAberto(false);
    setDestaque(-1);
  }

  function aoTeclar(evento: React.KeyboardEvent<HTMLInputElement>) {
    if (!mostrar) return;
    if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
      evento.preventDefault();
      const passo = evento.key === "ArrowDown" ? 1 : -1;
      setDestaque((atual) => (atual + passo + sugestoes.length) % sugestoes.length);
    } else if (evento.key === "Enter" && destaque >= 0) {
      // Enter escolhe a sugestão em vez de enviar o formulário.
      evento.preventDefault();
      escolher(sugestoes[destaque]);
    } else if (evento.key === "Escape") {
      setAberto(false);
    }
  }

  return (
    <div className="flex flex-col gap-[5px]">
      <label htmlFor={id} className="flex gap-1">
        <span className="text-xs font-semibold">{rotulo}</span>
        {opcional && <span className="text-[11px] text-cinza-escuro">(opcional)</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          role="combobox"
          aria-expanded={mostrar}
          aria-controls={idLista}
          aria-autocomplete="list"
          aria-activedescendant={mostrar && destaque >= 0 ? `${idLista}-${destaque}` : undefined}
          autoComplete="off"
          value={valor}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(evento) => {
            aoMudar(evento.target.value);
            setAberto(true);
            setDestaque(-1);
          }}
          onFocus={() => setAberto(true)}
          onBlur={() => setAberto(false)}
          onKeyDown={aoTeclar}
          className="w-full min-w-0 rounded-[10px] border border-cinza-claro bg-white px-[14px] py-[11px] text-[13px] outline-none focus:border-dourado"
        />
        {mostrar && (
          <ul
            id={idLista}
            role="listbox"
            aria-label={`Sugestões de ${rotulo.toLowerCase()}`}
            className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-[10px] border border-cinza-claro bg-white py-1 shadow-cartao"
          >
            {sugestoes.map((sugestao, indice) => (
              <li
                key={sugestao}
                id={`${idLista}-${indice}`}
                role="option"
                aria-selected={indice === destaque}
                // mousedown (e não click) para escolher antes do blur fechar a lista.
                onMouseDown={(evento) => {
                  evento.preventDefault();
                  escolher(sugestao);
                }}
                onMouseEnter={() => setDestaque(indice)}
                className={`cursor-pointer px-[14px] py-2.5 text-[13px] ${indice === destaque ? "bg-dourado-claro/35" : ""}`}
              >
                {sugestao}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
