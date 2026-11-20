"use client";

import { useState } from "react";
import { useArrastarLados } from "@/hooks/useArrastarLados";
import { MESES_LONGOS, paraCampoData } from "@/lib/agenda";
import { fimMaximo } from "@/lib/repeticao";

const CABECALHO = ["S", "T", "Q", "Q", "S", "S", "D"];

type Props = {
  /** Data do evento: primeiro dia da série, sempre marcado. */
  inicio: Date;
  /** Datas marcadas, no formato do input date (AAAA-MM-DD). */
  datas: string[];
  aoMudar: (datas: string[]) => void;
};

/**
 * Calendário para marcar as datas exatas da repetição, mês a mês (setas ou
 * arrastando para os lados, como no Início). Dia 5 pode ser quarta num mês e
 * quinta no outro: aqui a pessoa vê o dia da semana e marca o que quiser em
 * cada mês. A data do evento abre marcada e não sai; dias antes dela ou depois
 * de 1 ano ficam apagados.
 */
export function CalendarioDatas({ inicio, datas, aoMudar }: Props) {
  const [passo, setPasso] = useState(0);
  const limite = fimMaximo(inicio);
  const primeiroMes = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
  const ultimoMes = new Date(limite.getFullYear(), limite.getMonth(), 1);
  const mes = new Date(inicio.getFullYear(), inicio.getMonth() + passo, 1);
  const podeVoltar = mes > primeiroMes;
  const podeAvancar = mes < ultimoMes;
  const arrastar = useArrastarLados((sentido) => {
    if ((sentido === -1 && podeVoltar) || (sentido === 1 && podeAvancar)) setPasso(passo + sentido);
  });

  const marcadas = new Set(datas);
  const textoInicio = paraCampoData(inicio);
  const diasNoMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  // Segunda primeiro: domingo (0) vai para a última coluna.
  const vazios = (mes.getDay() + 6) % 7;
  const marcadasNoMes = datas.filter((d) => d.startsWith(paraCampoData(mes).slice(0, 7))).length;

  function alternar(texto: string) {
    if (texto === textoInicio) return;
    aoMudar(marcadas.has(texto) ? datas.filter((d) => d !== texto) : [...datas, texto].sort());
  }

  const seta = "grid size-8 place-items-center rounded-full text-xl font-semibold disabled:opacity-25";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => setPasso(passo - 1)} disabled={!podeVoltar} aria-label="Mês anterior" className={seta}>
          ‹
        </button>
        <span className="flex flex-col items-center">
          <span className="text-[13px] font-bold" aria-live="polite">
            {MESES_LONGOS[mes.getMonth()]} de {mes.getFullYear()}
          </span>
          <span className="text-[11px] text-cinza-escuro">
            {marcadasNoMes === 0 ? "Nenhum dia marcado" : marcadasNoMes === 1 ? "1 dia marcado" : `${marcadasNoMes} dias marcados`}
          </span>
        </span>
        <button type="button" onClick={() => setPasso(passo + 1)} disabled={!podeAvancar} aria-label="Próximo mês" className={seta}>
          ›
        </button>
      </div>

      <div {...arrastar} className="grid grid-cols-7 gap-1 transition-transform duration-150">
        {CABECALHO.map((letra, i) => (
          <span key={i} aria-hidden className="text-center text-[10px] font-semibold text-cinza-escuro">
            {letra}
          </span>
        ))}
        {Array.from({ length: vazios }, (_, i) => (
          <span key={`v${i}`} />
        ))}
        {Array.from({ length: diasNoMes }, (_, i) => {
          const dia = new Date(mes.getFullYear(), mes.getMonth(), i + 1);
          const texto = paraCampoData(dia);
          const fora = dia < new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate()) || dia > limite;
          const ativo = marcadas.has(texto);
          const fixo = texto === textoInicio;
          return (
            <button
              key={texto}
              type="button"
              disabled={fora}
              aria-pressed={ativo}
              aria-label={`${dia.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}${fixo ? ", data do evento" : ""}`}
              onClick={() => alternar(texto)}
              className={`grid aspect-square place-items-center rounded-full text-[13px] font-bold transition-colors ${
                ativo
                  ? `bg-marinho text-white ${fixo ? "ring-2 ring-dourado ring-offset-1" : ""}`
                  : fora
                    ? "text-cinza-claro"
                    : "border border-cinza-claro bg-white text-cinza-escuro"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <span className="text-[11px] text-cinza-escuro">
        Toque nos dias em que o evento acontece. Passe de mês pelas setas ou arrastando. O dia com contorno é a data do evento.
      </span>
    </div>
  );
}
