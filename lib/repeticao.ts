/**
 * Repetição de eventos da Agenda: "toda sexta até 20/02" ou "toda segunda e
 * quarta até o fim do ano". Cada repetição vira um evento de verdade no banco,
 * todos ligados pelo mesmo `serie_id`. Assim a Agenda, o sininho e o "próximo
 * compromisso" do Início funcionam sem mudança, e cada dia pode ser editado à
 * parte.
 *
 * Regras:
 * - Toda semana: a pessoa marca um ou mais dias da semana (padrão: o dia da
 *   data escolhida). O evento entra em cada um desses dias, a partir da data
 *   escolhida, até o "Até" (inclusive).
 * - Todo mês: mesmo dia do mês; quando o mês não tem esse dia (31 em abril, 30
 *   em fevereiro), cai no último dia do mês.
 * - No máximo 1 ano depois da data escolhida e MAXIMO_OCORRENCIAS eventos.
 * - O horário é o mesmo em todas as repetições, no relógio do aparelho.
 */

export type Repeticao = "semanal" | "mensal";

/** Dias da semana como no Date: 0 = domingo ... 6 = sábado. */
export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type RegraRepeticao = { tipo: Repeticao; diasSemana: DiaSemana[] };

export const OPCOES_REPETICAO: { valor: Repeticao | "nunca"; rotulo: string }[] = [
  { valor: "nunca", rotulo: "Nunca" },
  { valor: "semanal", rotulo: "Toda semana" },
  { valor: "mensal", rotulo: "Todo mês" },
];

/** Botões de dia, de segunda a domingo (a semana do app começa na segunda). */
export const DIAS_REPETICAO: { valor: DiaSemana; curto: string; nome: string; plural: string }[] = [
  { valor: 1, curto: "S", nome: "segunda", plural: "segundas" },
  { valor: 2, curto: "T", nome: "terça", plural: "terças" },
  { valor: 3, curto: "Q", nome: "quarta", plural: "quartas" },
  { valor: 4, curto: "Q", nome: "quinta", plural: "quintas" },
  { valor: 5, curto: "S", nome: "sexta", plural: "sextas" },
  { valor: 6, curto: "S", nome: "sábado", plural: "sábados" },
  { valor: 0, curto: "D", nome: "domingo", plural: "domingos" },
];

export const MAXIMO_OCORRENCIAS = 120;

/** "Até" padrão ao ligar a repetição: 3 meses por semana, 6 por mês. */
export function fimPadrao(inicio: Date, tipo: Repeticao) {
  return new Date(inicio.getFullYear(), inicio.getMonth() + (tipo === "mensal" ? 6 : 3), inicio.getDate());
}

/** Último dia permitido para o "Até": 1 ano depois da data escolhida. */
export function fimMaximo(inicio: Date) {
  return new Date(inicio.getFullYear() + 1, inicio.getMonth(), inicio.getDate());
}

/** O dia `dia` do mês `mes` (pode passar de 11), ou o último dia, se o mês for mais curto. */
function diaNoMes(ano: number, mes: number, dia: number) {
  const ultimo = new Date(ano, mes + 1, 0).getDate();
  return new Date(ano, mes, Math.min(dia, ultimo));
}

/**
 * Dias (à meia-noite, horário local) em que o evento acontece, de `inicio` até
 * `ate` (inclusive), respeitando os limites. Toda semana sem nenhum dia marcado
 * usa o dia da semana de `inicio`. Nunca volta vazio: sem nenhum dia que sirva,
 * fica só o próprio `inicio`.
 */
export function diasDaRepeticao(inicio: Date, regra: RegraRepeticao, ate: Date): Date[] {
  const base = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
  const limite = new Date(Math.min(ate.getTime(), fimMaximo(base).getTime()));
  const dias: Date[] = [];

  if (regra.tipo === "mensal") {
    for (let i = 0; dias.length < MAXIMO_OCORRENCIAS; i++) {
      const dia = diaNoMes(base.getFullYear(), base.getMonth() + i, base.getDate());
      if (dia > limite) break;
      dias.push(dia);
    }
  } else {
    const marcados = new Set<number>(regra.diasSemana.length ? regra.diasSemana : [base.getDay()]);
    for (let dia = base; dia <= limite && dias.length < MAXIMO_OCORRENCIAS; ) {
      if (marcados.has(dia.getDay())) dias.push(dia);
      dia = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate() + 1);
    }
  }
  return dias.length ? dias : [base];
}

/** Mesmo dia de `dia` com a hora e o minuto de `hora` ("18:30"). */
export function comHora(dia: Date, hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), h, m);
}

/** "Toda sexta", "Toda segunda e quarta", "Todo dia", "Todo mês, dia 15". */
export function fraseRegra(regra: RegraRepeticao, dia?: Date) {
  if (regra.tipo === "mensal") return dia ? `Todo mês, dia ${dia.getDate()}` : "Todo mês";
  const marcados = DIAS_REPETICAO.filter((d) => regra.diasSemana.includes(d.valor));
  if (marcados.length === 7) return "Todo dia";
  if (marcados.length === 5 && !regra.diasSemana.includes(0) && !regra.diasSemana.includes(6)) return "De segunda a sexta";
  if (!marcados.length) return "Toda semana";
  const nomes = marcados.map((d) => d.nome);
  const lista = nomes.length === 1 ? nomes[0] : `${nomes.slice(0, -1).join(", ")} e ${nomes.at(-1)}`;
  // "Todo sábado/domingo", "Toda segunda...": o gênero vem do primeiro dia.
  return `${marcados[0].valor === 0 || marcados[0].valor === 6 ? "Todo" : "Toda"} ${lista}`;
}

/** Frase curta para a lista da Agenda, a partir da coluna `repeticao` do evento. */
export function fraseRepeticao(repeticao: string | null | undefined, dia?: Date) {
  if (repeticao === "mensal") return "Repete todo mês";
  if (repeticao === "semanal") return dia ? `Repete ${fraseRegra({ tipo: "semanal", diasSemana: [dia.getDay() as DiaSemana] }, dia).toLowerCase()}` : "Repete toda semana";
  return null;
}
