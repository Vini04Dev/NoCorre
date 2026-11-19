"use client";

import Image from "next/image";
import { useId } from "react";
import { paraCampoData } from "@/lib/agenda";
import { DIAS_DO_MES, DIAS_REPETICAO, fimMaximo, fraseRegra, MAXIMO_OCORRENCIAS, OPCOES_REPETICAO, type DiaSemana, type Repeticao } from "@/lib/repeticao";

type Props = {
  tipo: Repeticao | "nunca";
  aoMudarTipo: (tipo: Repeticao | "nunca") => void;
  /** Dias da semana marcados (toda semana). */
  diasSemana: DiaSemana[];
  aoMudarDias: (dias: DiaSemana[]) => void;
  /** Dias do mês marcados (todo mês), de 1 a 31. */
  diasMes: number[];
  aoMudarDiasMes: (dias: number[]) => void;
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
 * "Repetição" em cima e a escolha embaixo, ocupando a largura toda (o texto ao
 * lado parecia o botão e as pessoas tocavam nele). Em "Toda semana", a pessoa
 * toca nos dias (S T Q Q S S D) em que o evento acontece; em "Todo mês", nos
 * dias do mês (1 a 31, sortidos). No "Até" escolhe até quando. Embaixo, a regra
 * por extenso e quantos eventos vão para a Agenda.
 */
export function CampoRepeticao({
  tipo,
  aoMudarTipo,
  diasSemana,
  aoMudarDias,
  diasMes,
  aoMudarDiasMes,
  ate,
  aoMudarAte,
  inicio,
  quantos,
  erroAte,
}: Props) {
  const idRepeticao = useId();
  const idAte = useId();
  const repete = tipo !== "nunca";

  function alternarDia(dia: DiaSemana) {
    const marcado = diasSemana.includes(dia);
    // Sempre fica pelo menos um dia marcado.
    if (marcado && diasSemana.length === 1) return;
    aoMudarDias(marcado ? diasSemana.filter((d) => d !== dia) : [...diasSemana, dia]);
  }

  function alternarDiaMes(dia: number) {
    const marcado = diasMes.includes(dia);
    if (marcado && diasMes.length === 1) return;
    aoMudarDiasMes(marcado ? diasMes.filter((d) => d !== dia) : [...diasMes, dia].sort((a, b) => a - b));
  }

  return (
    <div className="flex flex-col gap-2.5 rounded-[12px] border border-black/8 bg-white p-3 shadow-cartao">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={idRepeticao} className="flex items-center gap-2 text-[13px] font-semibold">
          <Image src="/icones/repetir.svg" alt="" width={18} height={18} />
          Repetição
        </label>
        <select
          id={idRepeticao}
          value={tipo}
          onChange={(e) => aoMudarTipo(e.target.value as Repeticao | "nunca")}
          className="w-full appearance-none rounded-[10px] bg-cinza-fundo bg-[url('/icones/seta-baixo.svg')] bg-[right_14px_center] bg-no-repeat py-[11px] pr-9 pl-3.5 text-[13px] font-semibold outline-none focus:ring-2 focus:ring-dourado"
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

      {tipo === "mensal" && (
        <div role="group" aria-labelledby={`${idRepeticao}-dias-mes`} className="flex flex-col gap-2 border-t border-cinza-claro pt-2.5">
          <span id={`${idRepeticao}-dias-mes`} className="text-xs font-semibold">
            Repetir nos dias
          </span>
          <div className="grid grid-cols-7 gap-1.5">
            {DIAS_DO_MES.map((dia) => {
              const ativo = diasMes.includes(dia);
              return (
                <button
                  key={dia}
                  type="button"
                  aria-pressed={ativo}
                  aria-label={`Dia ${dia}`}
                  onClick={() => alternarDiaMes(dia)}
                  className={`grid aspect-square place-items-center rounded-full text-[13px] font-bold transition-colors ${
                    ativo ? "bg-marinho text-white" : "border border-cinza-claro bg-white text-cinza-escuro"
                  }`}
                >
                  {dia}
                </button>
              );
            })}
          </div>
          {diasMes.some((d) => d > 28) && (
            <span className="text-[11px] text-cinza-escuro">Nos meses mais curtos, o dia que não existe cai no último dia do mês.</span>
          )}
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
                <b className="text-marinho">{fraseRegra({ tipo, diasSemana, diasMes }, inicio ?? undefined)}</b>
                {` · ${quantos === 1 ? "1 evento" : `${quantos} eventos`} na Agenda. Até 1 ano (no máximo ${MAXIMO_OCORRENCIAS} eventos).`}
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
}
