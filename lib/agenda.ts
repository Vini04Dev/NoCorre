// Paleta das 6 cores (enum cor_evento), compartilhada com as carteiras.
export { CORES_EVENTO, corDoEvento, type CorEvento } from "./cores";

export const MESES_LONGOS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
/** Segunda primeiro (regra 10 do projeto). */
export const DIAS_CURTOS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const DIAS_LONGOS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function somarDias(data: Date, dias: number) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate() + dias);
}

export function inicioDoDia(data: Date) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

export function mesmoDia(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Segunda-feira da semana de `data`. */
export function inicioDaSemana(data: Date) {
  return somarDias(inicioDoDia(data), -((data.getDay() + 6) % 7));
}

/** Os 7 dias (segunda a domingo) da semana de `data`. */
export function diasDaSemana(data: Date) {
  const segunda = inicioDaSemana(data);
  return Array.from({ length: 7 }, (_, i) => somarDias(segunda, i));
}

/** Semanas completas (segunda a domingo) que cobrem o mês de `data`, para a grade do Mês. */
export function semanasDoMes(data: Date) {
  const primeiro = new Date(data.getFullYear(), data.getMonth(), 1);
  const ultimo = new Date(data.getFullYear(), data.getMonth() + 1, 0);
  const inicio = inicioDaSemana(primeiro);
  const semanas: Date[][] = [];
  for (let dia = inicio; dia <= ultimo; dia = somarDias(dia, 7)) {
    semanas.push(Array.from({ length: 7 }, (_, i) => somarDias(dia, i)));
  }
  return semanas;
}

/** "Terça, 8 de setembro" */
export function rotuloDiaLongo(data: Date) {
  return `${DIAS_LONGOS[data.getDay()]}, ${data.getDate()} de ${MESES_LONGOS[data.getMonth()].toLowerCase()}`;
}

/** Data no formato do input date ("2026-09-08"), sem passar por UTC. */
export function paraCampoData(data: Date) {
  const dois = (n: number) => String(n).padStart(2, "0");
  return `${data.getFullYear()}-${dois(data.getMonth() + 1)}-${dois(data.getDate())}`;
}

/** "2026-09-08" → Date local (new Date("2026-09-08") seria meia-noite UTC). */
export function deCampoData(texto: string) {
  const [ano, mes, dia] = texto.split("-").map(Number);
  return ano && mes && dia ? new Date(ano, mes - 1, dia) : null;
}

/** Horas (com fração) desde a meia-noite do dia `dia`, presas entre 0 e 24. */
export function horasNoDia(instante: Date, dia: Date) {
  return Math.min(24, Math.max(0, (instante.getTime() - inicioDoDia(dia).getTime()) / 3_600_000));
}
