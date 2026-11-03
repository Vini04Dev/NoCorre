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
