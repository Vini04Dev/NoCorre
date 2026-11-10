/**
 * Notas de atualização do No Corre!, da mais nova para a mais antiga.
 *
 * Regra do projeto: todo PR da dev para a main ganha uma nota nova no topo
 * desta lista (e a versão em package.json acompanha). A primeira nota que a
 * pessoa ainda não viu abre sozinha num aviso ao entrar no app.
 */

export type Destaque = { icone: string; titulo: string; texto: string };

export type Nota = {
  versao: string;
  /** Data da publicação, no formato do input date ("2026-11-10"). */
  data: string;
  titulo: string;
  resumo: string;
  destaques: Destaque[];
};

export const NOTAS: Nota[] = [
  {
    versao: "0.0.1",
    data: "2026-11-10",
    titulo: "O corre começou",
    resumo: "A primeira versão do No Corre!: tudo o que você precisa para saber quanto entra, quanto sai e quanto sobra.",
    destaques: [
      {
        icone: "💰",
        titulo: "Saldo na hora",
        texto: "O Início mostra saldo, recebidos, pendentes, despesas e entregas do dia, da semana ou do mês, em lista ou no calendário.",
      },
      {
        icone: "➕",
        titulo: "Lançar é rápido",
        texto: "Receita (entrega, corrida ou gorjeta) e despesa em poucos toques, com o total calculado enquanto você digita. O app lembra a categoria de costume de cada cliente e de cada descrição.",
      },
      {
        icone: "🧾",
        titulo: "Resumo do seu corre",
        texto: "Todas as movimentações com filtros por período, categoria, cliente e situação. Toque num lançamento para editar, excluir ou marcar como pago.",
      },
      {
        icone: "📊",
        titulo: "Relatórios que ensinam",
        texto: "Tendências contra o período anterior, previsão do fim do mês, o dia e o horário que mais rendem, os últimos 6 meses e o saldo acumulado.",
      },
      {
        icone: "🎯",
        titulo: "Metas e contas",
        texto: "Metas de receita, de entregas ou de limite de gasto, e contas parceladas que abatem a cada pagamento.",
      },
      {
        icone: "👁️",
        titulo: "Olhinho do saldo",
        texto: "Esconda os valores com um toque quando estiver usando o celular perto de outras pessoas.",
      },
      {
        icone: "💻",
        titulo: "No celular e no computador",
        texto: "Instale como app na tela de início do celular ou use no computador, com menu lateral e telas mais largas.",
      },
    ],
  },
];

export const VERSAO_ATUAL = NOTAS[0].versao;

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "2026-11-10" → "10 nov 2026". */
export function dataDaNota(data: string) {
  const [ano, mes, dia] = data.split("-").map(Number);
  return `${dia} ${MESES[mes - 1]} ${ano}`;
}
