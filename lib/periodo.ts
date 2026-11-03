import type { Periodo } from "@/components/ui/SeletorPeriodo";

/**
 * Período escolhido no Resumo e nos Relatórios. Além de dia, semana e mês
 * (os mesmos da Home), há o mês passado e um intervalo de datas livre.
 * Datas personalizadas no formato do input date ("2026-11-03").
 */
export type FiltroPeriodo =
  | { tipo: Periodo | "mes-passado" }
  | { tipo: "personalizado"; de: string; ate: string };

/**
 * Intervalo [início, fim) do período que contém `referencia`, no horário do celular.
 * A semana começa na segunda-feira (regra do app), não no domingo do JavaScript.
 */
export function intervaloDoPeriodo(filtro: FiltroPeriodo, referencia = new Date()) {
  const hoje = new Date(referencia.getFullYear(), referencia.getMonth(), referencia.getDate());

  switch (filtro.tipo) {
    case "dia":
      return { inicio: hoje, fim: somarDias(hoje, 1) };
    case "semana": {
      // getDay(): domingo = 0 ... sábado = 6. Recuar até a segunda.
      const segunda = somarDias(hoje, -((hoje.getDay() + 6) % 7));
      return { inicio: segunda, fim: somarDias(segunda, 7) };
    }
    case "mes":
      return {
        inicio: new Date(hoje.getFullYear(), hoje.getMonth(), 1),
        fim: new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1),
      };
    case "mes-passado":
      return {
        inicio: new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1),
        fim: new Date(hoje.getFullYear(), hoje.getMonth(), 1),
      };
    case "personalizado": {
      // "Até" inclui o dia inteiro: o fim é a meia-noite do dia seguinte.
      const inicio = lerData(filtro.de);
      return { inicio, fim: somarDias(lerData(filtro.ate), 1) };
    }
  }
}

/** "2026-11-03" → 03/11/2026 00:00 no horário local (new Date("2026-11-03") seria UTC). */
function lerData(texto: string) {
  const [ano, mes, dia] = texto.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

function somarDias(data: Date, dias: number) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate() + dias);
}

/** Complemento do título do período: "Saldo da semana", "Saldo de 01/11 a 05/11". */
export function nomeDoPeriodo(filtro: FiltroPeriodo) {
  switch (filtro.tipo) {
    case "dia":
      return "do dia";
    case "semana":
      return "da semana";
    case "mes":
      return "do mês";
    case "mes-passado":
      return "do mês passado";
    case "personalizado": {
      const curta = (texto: string) => texto.split("-").reverse().slice(0, 2).join("/");
      return `de ${curta(filtro.de)} a ${curta(filtro.ate)}`;
    }
  }
}
