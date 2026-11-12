/**
 * Contas fixas: despesas que se repetem todo mês no mesmo dia.
 * Aqui ficam as contas de data: quando vence neste mês e em que situação está.
 */

/** As contas fixas moram na aba "Contas do mês" de Metas. */
export const ROTA_CONTAS = "/metas?aba=contas";

/** A partir de quantos dias antes do vencimento o Início avisa. */
export const DIAS_AVISO = 3;

export type SituacaoConta =
  /** Já tem despesa ligada a ela neste mês. */
  | { tipo: "paga" }
  /** Ainda falta, e o vencimento está longe: não avisa. */
  | { tipo: "em_dia"; dias: number }
  /** Vence em até DIAS_AVISO dias (0 = hoje). */
  | { tipo: "vence"; dias: number }
  /** Passou do dia e não foi paga. */
  | { tipo: "atrasada"; dias: number }
  /** Débito automático: o dia chegou, falta confirmar que caiu. */
  | { tipo: "debito"; dias: number };

/** Dia do vencimento no mês; 29, 30 e 31 caem no último dia em mês mais curto. */
export function vencimentoNoMes(dia: number, ano: number, mes: number) {
  const ultimo = new Date(ano, mes + 1, 0).getDate();
  return new Date(ano, mes, Math.min(dia, ultimo));
}

const MS_DIA = 24 * 60 * 60 * 1000;

function inicioDoDia(data: Date) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

export function situacaoDaConta(
  conta: { dia_vencimento: number; automatico: boolean },
  pagaNoMes: boolean,
  hoje = new Date(),
): SituacaoConta {
  if (pagaNoMes) return { tipo: "paga" };
  const vencimento = vencimentoNoMes(conta.dia_vencimento, hoje.getFullYear(), hoje.getMonth());
  const dias = Math.round((vencimento.getTime() - inicioDoDia(hoje).getTime()) / MS_DIA);
  if (dias > DIAS_AVISO) return { tipo: "em_dia", dias };
  if (dias > 0) return { tipo: "vence", dias };
  if (conta.automatico) return { tipo: "debito", dias };
  return dias === 0 ? { tipo: "vence", dias } : { tipo: "atrasada", dias };
}

/** Frase curta da situação, para a lista e o aviso. */
export function textoSituacao(situacao: SituacaoConta, dia: number) {
  switch (situacao.tipo) {
    case "paga":
      return "Paga neste mês";
    case "em_dia":
      return `Vence dia ${dia}`;
    case "vence":
      return situacao.dias === 0 ? "Vence hoje" : situacao.dias === 1 ? "Vence amanhã" : `Vence em ${situacao.dias} dias`;
    case "atrasada":
      return -situacao.dias === 1 ? "Venceu ontem" : `Venceu há ${-situacao.dias} dias`;
    case "debito":
      return "Débito automático do mês";
  }
}

/** Pede atenção no Início. */
export function pedeAtencao(situacao: SituacaoConta) {
  return situacao.tipo === "vence" || situacao.tipo === "atrasada" || situacao.tipo === "debito";
}

/** Primeiro e último instante do mês de `data`, para buscar os pagamentos. */
export function limitesDoMes(data = new Date()) {
  const inicio = new Date(data.getFullYear(), data.getMonth(), 1);
  const fim = new Date(data.getFullYear(), data.getMonth() + 1, 1);
  return { inicio: inicio.toISOString(), fim: fim.toISOString() };
}
