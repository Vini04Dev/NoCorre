import type { Periodo } from "@/components/ui/SeletorPeriodo";

/**
 * Intervalo [início, fim) do período que contém `referencia`, no horário do celular.
 * A semana começa na segunda-feira (regra do app), não no domingo do JavaScript.
 */
export function intervaloDoPeriodo(periodo: Periodo, referencia = new Date()) {
  const inicio = new Date(referencia.getFullYear(), referencia.getMonth(), referencia.getDate());

  if (periodo === "dia") {
    return { inicio, fim: somarDias(inicio, 1) };
  }
  if (periodo === "semana") {
    // getDay(): domingo = 0 ... sábado = 6. Recuar até a segunda.
    const diasDesdeSegunda = (inicio.getDay() + 6) % 7;
    const segunda = somarDias(inicio, -diasDesdeSegunda);
    return { inicio: segunda, fim: somarDias(segunda, 7) };
  }
  const primeiroDia = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
  return { inicio: primeiroDia, fim: new Date(inicio.getFullYear(), inicio.getMonth() + 1, 1) };
}

function somarDias(data: Date, dias: number) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate() + dias);
}

export const NOME_PERIODO: Record<Periodo, string> = {
  dia: "do dia",
  semana: "da semana",
  mes: "do mês",
};
