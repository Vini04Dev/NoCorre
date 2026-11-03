function doisDigitos(numero: number) {
  return String(numero).padStart(2, "0");
}

/** Data e hora locais nos formatos dos inputs date ("2026-09-08") e time ("19:30"). */
export function dataHoraParaCampos(data: Date) {
  return {
    data: `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`,
    hora: `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`,
  };
}

/**
 * Junta os campos de data e hora num instante para a coluna timestamptz.
 * O horário digitado é o do celular (America/Sao_Paulo para o público do app);
 * o banco guarda em UTC e devolve convertido.
 */
export function camposParaDataHora(data: string, hora: string) {
  return new Date(`${data}T${hora}`).toISOString();
}

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function mesmoDia(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Cabeçalho de grupo do extrato: "HOJE", "ONTEM" ou "06 SET". */
export function rotuloDia(data: Date, hoje = new Date()) {
  const ontem = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1);
  if (mesmoDia(data, hoje)) return "HOJE";
  if (mesmoDia(data, ontem)) return "ONTEM";
  return `${doisDigitos(data.getDate())} ${MESES[data.getMonth()]}`;
}

/** "14:32" */
export function horaCurta(data: Date) {
  return dataHoraParaCampos(data).hora;
}

/** "Ter, 08/09/2026 · 14:32", usado no detalhe do lançamento. */
export function dataHoraCompleta(data: Date) {
  const dia = `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}/${data.getFullYear()}`;
  return `${DIAS_SEMANA[data.getDay()]}, ${dia} · ${horaCurta(data)}`;
}
