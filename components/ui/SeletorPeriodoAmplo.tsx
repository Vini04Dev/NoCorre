"use client";

import { useId } from "react";
import { dataHoraParaCampos } from "@/lib/data";
import type { FiltroPeriodo } from "@/lib/periodo";

const OPCOES: { valor: FiltroPeriodo["tipo"]; rotulo: string }[] = [
  { valor: "dia", rotulo: "Hoje" },
  { valor: "semana", rotulo: "Esta semana" },
  { valor: "mes", rotulo: "Este mês" },
  { valor: "mes-passado", rotulo: "Mês passado" },
  { valor: "personalizado", rotulo: "Escolher datas..." },
];

const CLASSE_CAMPO =
  "min-w-0 rounded-[10px] border border-cinza-claro bg-white px-3 py-[9px] text-[13px] outline-none focus:border-dourado";

type Props = { valor: FiltroPeriodo; aoMudar: (valor: FiltroPeriodo) => void };

/**
 * Período do Resumo e dos Relatórios: atalhos num select e, em "Escolher datas",
 * um intervalo livre de/até.
 */
export function SeletorPeriodoAmplo({ valor, aoMudar }: Props) {
  const id = useId();

  function escolher(tipo: FiltroPeriodo["tipo"]) {
    if (tipo !== "personalizado") {
      aoMudar({ tipo });
      return;
    }
    // Começa com o mês atual até hoje, para a pessoa só ajustar.
    const hoje = new Date();
    aoMudar({
      tipo,
      de: dataHoraParaCampos(new Date(hoje.getFullYear(), hoje.getMonth(), 1)).data,
      ate: dataHoraParaCampos(hoje).data,
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="sr-only">
        Período
      </label>
      <select
        id={id}
        value={valor.tipo}
        onChange={(evento) => escolher(evento.target.value as FiltroPeriodo["tipo"])}
        className="h-[38px] appearance-none rounded-[10px] bg-cinza-fundo bg-[url('/icones/seta-baixo.svg')] bg-[right_14px_center] bg-no-repeat px-[14px] font-inter text-[13px] font-semibold text-texto-segmento shadow-segmento outline-none focus:ring-1 focus:ring-dourado"
      >
        {OPCOES.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>

      {valor.tipo === "personalizado" && (
        <div className="grid grid-cols-2 gap-2.5">
          <label className="flex flex-col gap-1 text-[11px] font-semibold">
            De
            <input
              type="date"
              value={valor.de}
              max={valor.ate}
              onChange={(evento) => evento.target.value && aoMudar({ ...valor, de: evento.target.value })}
              className={CLASSE_CAMPO}
            />
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-semibold">
            Até
            <input
              type="date"
              value={valor.ate}
              min={valor.de}
              onChange={(evento) => evento.target.value && aoMudar({ ...valor, ate: evento.target.value })}
              className={CLASSE_CAMPO}
            />
          </label>
        </div>
      )}
    </div>
  );
}
