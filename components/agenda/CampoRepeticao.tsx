"use client";

import Image from "next/image";
import { useId } from "react";
import { paraCampoData } from "@/lib/agenda";
import { DIAS_REPETICAO, fimMaximo, fraseRegra, MAXIMO_OCORRENCIAS, OPCOES_REPETICAO, type DiaSemana, type Repeticao } from "@/lib/repeticao";

type Props = {
  tipo: Repeticao | "nunca";
  aoMudarTipo: (tipo: Repeticao | "nunca") => void;
  /** Dias da semana marcados (toda semana). */
  diasSemana: DiaSemana[];
  aoMudarDias: (dias: DiaSemana[]) => void;
  /** Último dia da repetição, no formato do input date. */
  ate: string;
  aoMudarAte: (ate: string) => void;
  /** Data escolhida no formulário: o começo da repetição. */
  inicio: Date | null;
  /** Quantos eventos a escolha atual vai criar. */
  quantos: number;
  erroAte?: string;
};

const CAMPO =
  "rounded-[10px] border border-cinza-claro bg-white px-[14px] py-[11px] text-[13px] outline-none focus:border-dourado";

/**
 * "Repetição: Nunca ⌃⌄", como no Calendário da Apple. Em "Toda semana", a
 * pessoa toca nos dias (S T Q Q S S D) em que o evento acontece, e no "Até"
 * escolhe até quando. Embaixo, a regra por extenso e quantos eventos vão para a
 * Agenda.
 */
export function CampoRepeticao({ tipo, aoMudarTipo, diasSemana, aoMudarDias, ate, aoMudarAte, inicio, quantos, erroAte }: Props) {
  const idRepeticao = useId();
  const idAte = useId();
  const repete = tipo !== "nunca";

  function alternarDia(dia: DiaSemana) {
    const marcado = diasSemana.includes(dia);
    // Sempre fica pelo menos um dia marcado.
    if (marcado && diasSemana.length === 1) return;
    aoMudarDias(marcado ? diasSemana.filter((d) => d !== dia) : [...diasSemana, dia]);
  }

  return (
    <div className="flex flex-col gap-2.5 rounded-[12px] border border-black/8 bg-white p-3 shadow-cartao">
      <div className="flex items-center gap-3">
        <Image src="/icones/repetir.svg" alt="" width={20} height={20} />
        <label htmlFor={idRepeticao} className="flex-1 text-[13px] font-semibold">
          Repetição
        </label>
        <select
          id={idRepeticao}
          value={tipo}
          onChange={(e) => aoMudarTipo(e.target.value as Repeticao | "nunca")}
          className="appearance-none rounded-[10px] bg-cinza-fundo bg-[url('/icones/seta-baixo.svg')] bg-[right_12px_center] bg-no-repeat py-2 pr-8 pl-3 text-[13px] font-semibold outline-none focus:ring-2 focus:ring-dourado"
        >
          {OPCOES_REPETICAO.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </div>

      {tipo === "semanal" && (
        <div role="group" aria-labelledby={`${idRepeticao}-dias`} className="flex flex-col gap-2 border-t border-cinza-claro pt-2.5">
          <span id={`${idRepeticao}-dias`} className="text-xs font-semibold">
            Repetir em
          </span>
          <div className="flex justify-between gap-1">
            {DIAS_REPETICAO.map(({ valor, curto, nome }) => {
              const ativo = diasSemana.includes(valor);
              return (
                <button
                  key={valor}
                  type="button"
                  aria-pressed={ativo}
                  aria-label={nome}
                  onClick={() => alternarDia(valor)}
                  className={`grid size-9 place-items-center rounded-full text-[13px] font-bold transition-colors ${
                    ativo ? "bg-marinho text-white" : "border border-cinza-claro bg-white text-cinza-escuro"
                  }`}
                >
                  {curto}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
            {erroAte ?? (
              <>
                <b className="text-marinho">{fraseRegra({ tipo, diasSemana }, inicio ?? undefined)}</b>
                {` · ${quantos === 1 ? "1 evento" : `${quantos} eventos`} na Agenda. Até 1 ano (no máximo ${MAXIMO_OCORRENCIAS} eventos).`}
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
}
