/**
 * Repetição de eventos da Agenda (como no Google Agenda e no Calendário da
 * Apple). Cada repetição vira um evento de verdade no banco, todos ligados pelo
 * mesmo `serie_id`. Assim a Agenda, o sininho e o "próximo compromisso" do
 * Início funcionam sem mudança, e cada dia pode ser editado à parte.
 *
 * Regras:
 * - Opções: todo dia, toda semana, a cada 2 semanas e todo mês.
 * - A repetição termina numa data escolhida ("Até"), no máximo 1 ano depois do
 *   primeiro, e com no máximo MAXIMO_OCORRENCIAS eventos (todo dia por um ano
 *   seria demais para uma agenda de trabalho).
 * - Todo mês cai no mesmo dia; quando o mês não tem esse dia (31 em abril, 30
 *   em fevereiro), cai no último dia do mês.
 * - O horário é o mesmo em todas as repetições, no relógio do aparelho.
 */

export type Repeticao = "diaria" | "semanal" | "quinzenal" | "mensal";

export const OPCOES_REPETICAO: { valor: Repeticao | "nunca"; rotulo: string; frase: string }[] = [
  { valor: "nunca", rotulo: "Nunca", frase: "" },
  { valor: "diaria", rotulo: "Todo dia", frase: "todo dia" },
  { valor: "semanal", rotulo: "Toda semana", frase: "toda semana" },
  { valor: "quinzenal", rotulo: "A cada 2 semanas", frase: "a cada 2 semanas" },
  { valor: "mensal", rotulo: "Todo mês", frase: "todo mês" },
];

export const MAXIMO_OCORRENCIAS = 120;

/** "Até" padrão ao ligar a repetição: o bastante para ver a repetição sem lotar a agenda. */
export function fimPadrao(inicio: Date, repeticao: Repeticao) {
  const meses = repeticao === "diaria" ? 1 : repeticao === "mensal" ? 6 : 3;
  return new Date(inicio.getFullYear(), inicio.getMonth() + meses, inicio.getDate());
}

/** Último dia permitido para o "Até": 1 ano depois do primeiro evento. */
export function fimMaximo(inicio: Date) {
  return new Date(inicio.getFullYear() + 1, inicio.getMonth(), inicio.getDate());
}

/** O dia `dia` do mês `mes` (pode passar de 11), ou o último dia, se o mês for mais curto. */
function diaNoMes(ano: number, mes: number, dia: number) {
  const ultimo = new Date(ano, mes + 1, 0).getDate();
  return new Date(ano, mes, Math.min(dia, ultimo));
}

/**
 * Dias (à meia-noite, horário local) em que o evento acontece, do primeiro até
 * `ate` (inclusive), respeitando o máximo de ocorrências. O primeiro é sempre
 * o próprio dia de `inicio`.
 */
export function diasDaRepeticao(inicio: Date, repeticao: Repeticao, ate: Date): Date[] {
  const base = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
  const limite = new Date(Math.min(ate.getTime(), fimMaximo(base).getTime()));
  const dias: Date[] = [];
  for (let i = 0; dias.length < MAXIMO_OCORRENCIAS; i++) {
    const dia =
      repeticao === "mensal"
        ? diaNoMes(base.getFullYear(), base.getMonth() + i, base.getDate())
        : new Date(base.getFullYear(), base.getMonth(), base.getDate() + i * (repeticao === "diaria" ? 1 : repeticao === "semanal" ? 7 : 14));
    // O primeiro entra sempre, mesmo com um "Até" anterior a ele.
    if (i > 0 && dia > limite) break;
    dias.push(dia);
  }
  return dias;
}

/** Mesmo dia de `dia` com a hora e o minuto de `hora` ("18:30"). */
export function comHora(dia: Date, hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), h, m);
}

/** "Repete toda semana" para mostrar no evento. */
export function fraseRepeticao(repeticao: string | null | undefined) {
  const opcao = OPCOES_REPETICAO.find((o) => o.valor === repeticao);
  return opcao?.frase ? `Repete ${opcao.frase}` : null;
}
