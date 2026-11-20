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
 * - Dias escolhidos (coluna `repeticao` = "mensal"): a pessoa marca num
 *   calendário, mês a mês, as datas exatas em que o evento acontece. Dia 5
 *   pode ser quarta num mês e quinta no outro, então não há regra fixa: a
 *   série é exatamente as datas marcadas. Sem datas (séries antigas), vale o
 *   mesmo dia todo mês, caindo no último dia quando o mês é mais curto.
 * - No máximo 1 ano depois da data escolhida e MAXIMO_OCORRENCIAS eventos.
 * - O horário é o mesmo em todas as repetições, no relógio do aparelho.
 */

export type Repeticao = "semanal" | "mensal";

/** Dias da semana como no Date: 0 = domingo ... 6 = sábado. */
export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** `datas` (AAAA-MM-DD) só vale em "mensal": as datas marcadas no calendário. */
export type RegraRepeticao = { tipo: Repeticao; diasSemana: DiaSemana[]; datas?: string[] };

/** "2026-12-05" para a data local, sem passar por UTC. */
function lerData(texto: string) {
  const [ano, mes, dia] = texto.split("-").map(Number);
  return ano && mes && dia ? new Date(ano, mes - 1, dia) : null;
}

export const OPCOES_REPETICAO: { valor: Repeticao | "nunca"; rotulo: string }[] = [
  { valor: "nunca", rotulo: "Nunca" },
  { valor: "semanal", rotulo: "Toda semana" },
  { valor: "mensal", rotulo: "Dias escolhidos no calendário" },
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

  if (regra.tipo === "mensal" && regra.datas?.length) {
    // Datas marcadas valem até 1 ano depois do início, sem olhar o "Até".
    const teto = fimMaximo(base);
    const unicas = [...new Set(regra.datas)].sort();
    for (const texto of unicas) {
      const dia = lerData(texto);
      if (dia && dia >= base && dia <= teto && dias.length < MAXIMO_OCORRENCIAS) dias.push(dia);
    }
  } else if (regra.tipo === "mensal") {
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

/** "e" antes do último: "4, 15 e 22". */
function emLista(itens: (string | number)[]) {
  return itens.length === 1 ? String(itens[0]) : `${itens.slice(0, -1).join(", ")} e ${itens.at(-1)}`;
}

/** "05/12" */
function curta(texto: string) {
  const [, mes, dia] = texto.split("-");
  return `${dia}/${mes}`;
}

/**
 * "Toda sexta", "Toda segunda e quarta", "Todo dia", "Todo mês, dia 15",
 * "Nos dias 20/11, 05/12 e 09/01", "8 dias escolhidos, de 20/11 a 15/05".
 */
export function fraseRegra(regra: RegraRepeticao, dia?: Date) {
  if (regra.tipo === "mensal") {
    const datas = [...new Set(regra.datas ?? [])].sort();
    if (datas.length === 1) return `Só em ${curta(datas[0])}`;
    if (datas.length > 1 && datas.length <= 4) return `Nos dias ${emLista(datas.map(curta))}`;
    if (datas.length > 4) return `${datas.length} dias escolhidos, de ${curta(datas[0])} a ${curta(datas.at(-1)!)}`;
    return dia ? `Todo mês, dia ${dia.getDate()}` : "Todo mês";
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
  if (repeticao === "mensal") return "Repete em dias escolhidos";
  if (repeticao === "semanal") return dia ? `Repete ${fraseRegra({ tipo: "semanal", diasSemana: [dia.getDay() as DiaSemana] }, dia).toLowerCase()}` : "Repete toda semana";
  return null;
}
