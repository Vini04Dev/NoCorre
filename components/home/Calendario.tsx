import Link from "next/link";
import type { Despesa, Receita } from "@/hooks/useMovimentacoes";
import { dataHoraParaCampos } from "@/lib/data";

/** Semana começando na segunda, como no resto do app. */
const CABECALHO = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const valorCurto = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

type Props = {
  inicio: Date;
  fim: Date;
  receitas: Receita[];
  despesas: Despesa[];
  /** Olhinho fechado: mostra só as cores do dia, sem os valores. */
  ocultos?: boolean;
};

function somarDias(data: Date, dias: number) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate() + dias);
}

/**
 * Visão de calendário da Home: um quadrado por dia, com a receita recebida
 * (dourado) e a despesa (cinza) daquele dia. Tocar num dia com lançamentos abre
 * o Resumo filtrado nele. Dias de fora do período aparecem apagados.
 */
export function Calendario({ inicio, fim, receitas, despesas, ocultos = false }: Props) {
  const somas = new Map<string, { receita: number; despesa: number }>();
  const somar = (dataHora: string, campo: "receita" | "despesa", valor: number | null) => {
    const chave = dataHoraParaCampos(new Date(dataHora)).data;
    const atual = somas.get(chave) ?? { receita: 0, despesa: 0 };
    atual[campo] += Math.round((valor ?? 0) * 100);
    somas.set(chave, atual);
  };
  // Mesma regra do saldo: receita só conta quando paga.
  receitas.filter((r) => r.status_pagamento === "pago").forEach((r) => somar(r.data_hora, "receita", r.valor_total));
  despesas.forEach((d) => somar(d.data_hora, "despesa", d.valor_total));

  // Grade completa: da segunda da primeira semana ao domingo da última.
  const primeiro = somarDias(inicio, -((inicio.getDay() + 6) % 7));
  const ultimoDia = somarDias(fim, -1);
  const ultimo = somarDias(ultimoDia, (7 - ultimoDia.getDay()) % 7);
  const dias: Date[] = [];
  for (let dia = primeiro; dia <= ultimo; dia = somarDias(dia, 1)) dias.push(dia);
  const hoje = dataHoraParaCampos(new Date()).data;

  return (
    <div className="overflow-hidden rounded-[10px] border border-black/8 bg-white shadow-cartao">
      <div className="grid grid-cols-7 border-b border-black/8 bg-cinza-fundo">
        {CABECALHO.map((nome) => (
          <span key={nome} className="py-1 text-center text-[11px] font-semibold text-cinza-escuro">
            {nome}
          </span>
        ))}
      </div>
      <ul className="grid grid-cols-7">
        {dias.map((dia) => {
          const chave = dataHoraParaCampos(dia).data;
          const dentro = dia >= inicio && dia < fim;
          const soma = somas.get(chave);
          const ehHoje = chave === hoje;
          const conteudo = (
            <>
              <span
                className={`grid size-5 place-items-center rounded-full text-[11px] ${
                  ehHoje ? "bg-marinho font-semibold text-white" : dentro ? "" : "text-cinza"
                }`}
              >
                {dia.getDate()}
              </span>
              {soma && dentro && (
                <span className="mt-auto flex flex-col items-end text-[9px] leading-3 font-semibold">
                  {soma.receita > 0 && <span className="text-[#b07d12]">{ocultos ? "•••" : valorCurto.format(soma.receita / 100)}</span>}
                  {soma.despesa > 0 && <span className="text-cinza-escuro">{ocultos ? "•••" : valorCurto.format(soma.despesa / 100)}</span>}
                </span>
              )}
            </>
          );
          const classe = `flex h-[58px] flex-col p-1 ${dentro ? "" : "bg-cinza-fundo/60"}`;

          return (
            <li key={chave} className="border-r border-b border-black/6 [&:nth-child(7n)]:border-r-0">
              {soma && dentro ? (
                <Link
                  href={`/resumo?dia=${chave}`}
                  aria-label={`${dia.getDate()}: ver lançamentos do dia`}
                  className={classe}
                >
                  {conteudo}
                </Link>
              ) : (
                <div className={classe}>{conteudo}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
