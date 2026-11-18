"use client";

import Image from "next/image";
import { useId } from "react";
import { paraCampoData } from "@/lib/agenda";
import { fimMaximo, MAXIMO_OCORRENCIAS, OPCOES_REPETICAO, type Repeticao } from "@/lib/repeticao";

type Props = {
  valor: Repeticao | "nunca";
  aoMudar: (valor: Repeticao | "nunca") => void;
  /** Último dia da repetição, no formato do input date. */
  ate: string;
  aoMudarAte: (ate: string) => void;
  /** Primeiro dia (o do evento), para o limite do "Até". */
  inicio: Date | null;
  /** Quantos eventos a escolha atual vai criar. */
  quantos: number;
  erroAte?: string;
};

const CAMPO =
  "rounded-[10px] border border-cinza-claro bg-white px-[14px] py-[11px] text-[13px] outline-none focus:border-dourado";

/**
 * "Repetição: Nunca ⌃⌄", como no Calendário da Apple. Escolhida uma repetição,
 * aparece o "Até" e uma frase dizendo quantos eventos vão para a Agenda.
 */
export function CampoRepeticao({ valor, aoMudar, ate, aoMudarAte, inicio, quantos, erroAte }: Props) {
  const idRepeticao = useId();
  const idAte = useId();
  const repete = valor !== "nunca";

  return (
    <div className="flex flex-col gap-2.5 rounded-[12px] border border-black/8 bg-white p-3 shadow-cartao">
      <div className="flex items-center gap-3">
        <Image src="/icones/repetir.svg" alt="" width={20} height={20} />
        <label htmlFor={idRepeticao} className="flex-1 text-[13px] font-semibold">
          Repetição
        </label>
        <select
          id={idRepeticao}
          value={valor}
          onChange={(e) => aoMudar(e.target.value as Repeticao | "nunca")}
          className="appearance-none rounded-[10px] bg-cinza-fundo bg-[url('/icones/seta-baixo.svg')] bg-[right_12px_center] bg-no-repeat py-2 pr-8 pl-3 text-[13px] font-semibold outline-none focus:ring-2 focus:ring-dourado"
        >
          {OPCOES_REPETICAO.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </div>

      {repete && (
        <>
          <div className="flex flex-col gap-[5px] border-t border-cinza-claro pt-2.5">
            <label htmlFor={idAte} className="text-xs font-semibold">
              Até
            </label>
            <input
              id={idAte}
              type="date"
              value={ate}
              min={inicio ? paraCampoData(inicio) : undefined}
              max={inicio ? paraCampoData(fimMaximo(inicio)) : undefined}
              onChange={(e) => aoMudarAte(e.target.value)}
              aria-invalid={erroAte ? true : undefined}
              className={`${CAMPO} ${erroAte ? "border-negativo" : ""}`}
            />
          </div>
          <p className={`text-[11px] ${erroAte ? "text-negativo" : "text-cinza-escuro"}`}>
            {erroAte ??
              `Vai ${quantos === 1 ? "ficar 1 evento" : `criar ${quantos} eventos`} na Agenda. Dá para repetir por até 1 ano (no máximo ${MAXIMO_OCORRENCIAS} eventos).`}
          </p>
        </>
      )}
    </div>
  );
}
