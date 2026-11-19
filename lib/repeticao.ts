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
 * - Todo mês: a pessoa marca um ou mais dias do mês (padrão: o dia da data
 *   escolhida), sortidos, como 4, 15, 22 e 31. Quando o mês não tem o dia (31
 *   em abril, 30 em fevereiro), cai no último dia do mês.
 * - No máximo 1 ano depois da data escolhida e MAXIMO_OCORRENCIAS eventos.
 * - O horário é o mesmo em todas as repetições, no relógio do aparelho.
 */

export type Repeticao = "semanal" | "mensal";

/** Dias da semana como no Date: 0 = domingo ... 6 = sábado. */
export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** `diasMes` (1 a 31) só vale em "Todo mês"; ausente ou vazio, usa o dia da data escolhida. */
export type RegraRepeticao = { tipo: Repeticao; diasSemana: DiaSemana[]; diasMes?: number[] };

/** 1 a 31, para os botões de dia do mês. */
export const DIAS_DO_MES = Array.from({ length: 31 }, (_, i) => i + 1);

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
 * `ate` (inclusive), respeitando os limites. Sem nenhum dia marcado, usa o dia
 * da semana (toda semana) ou do mês (todo mês) de `inicio`. Nunca volta vazio:
 * sem nenhum dia que sirva, fica só o próprio `inicio`.
 */
export function diasDaRepeticao(inicio: Date, regra: RegraRepeticao, ate: Date): Date[] {
  const base = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
  const limite = new Date(Math.min(ate.getTime(), fimMaximo(base).getTime()));
  const dias: Date[] = [];

  if (regra.tipo === "mensal") {
    const marcados = [...new Set(regra.diasMes?.length ? regra.diasMes : [base.getDate()])].sort((a, b) => a - b);
    for (let i = 0; dias.length < MAXIMO_OCORRENCIAS; i++) {
      const primeiro = new Date(base.getFullYear(), base.getMonth() + i, 1);
      if (primeiro > limite) break;
      // 30 e 31 marcados num mês de 30 dias viram o mesmo dia: entra uma vez só.
      const doMes = new Map<number, Date>();
      for (const numero of marcados) {
        const dia = diaNoMes(primeiro.getFullYear(), primeiro.getMonth(), numero);
        doMes.set(dia.getDate(), dia);
      }
      for (const dia of doMes.values()) {
        if (dia >= base && dia <= limite && dias.length < MAXIMO_OCORRENCIAS) dias.push(dia);
      }
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

/** "e" antes do último: "4, 15 e 22". */
function emLista(itens: (string | number)[]) {
  return itens.length === 1 ? String(itens[0]) : `${itens.slice(0, -1).join(", ")} e ${itens.at(-1)}`;
}

/** "Toda sexta", "Toda segunda e quarta", "Todo dia", "Todo mês, dia 15", "Todo mês, dias 4, 15 e 22". */
export function fraseRegra(regra: RegraRepeticao, dia?: Date) {
  if (regra.tipo === "mensal") {
    const numeros = [...new Set(regra.diasMes?.length ? regra.diasMes : dia ? [dia.getDate()] : [])].sort((a, b) => a - b);
    if (!numeros.length) return "Todo mês";
    return `Todo mês, ${numeros.length === 1 ? "dia" : "dias"} ${emLista(numeros)}`;
  }
  const marcados = DIAS_REPETICAO.filter((d) => regra.diasSemana.includes(d.valor));
  if (marcados.length === 7) return "Todo dia";
  if (marcados.length === 5 && !regra.diasSemana.includes(0) && !regra.diasSemana.includes(6)) return "De segunda a sexta";
  if (!marcados.length) return "Toda semana";
  const lista = emLista(marcados.map((d) => d.nome));
  // "Todo sábado/domingo", "Toda segunda...": o gênero vem do primeiro dia.
  return `${marcados[0].valor === 0 || marcados[0].valor === 6 ? "Todo" : "Toda"} ${lista}`;
}

/** Frase curta para a lista da Agenda, a partir da coluna `repeticao` do evento. */
export function fraseRepeticao(repeticao: string | null | undefined, dia?: Date) {
  if (repeticao === "mensal") return "Repete todo mês";
  if (repeticao === "semanal") return dia ? `Repete ${fraseRegra({ tipo: "semanal", diasSemana: [dia.getDay() as DiaSemana] }, dia).toLowerCase()}` : "Repete toda semana";
  return null;
}
