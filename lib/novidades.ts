/**
 * Notas de atualização do No Corre!, da mais nova para a mais antiga.
 *
 * Regra do projeto: todo PR da dev para a main ganha uma nota nova no topo
 * desta lista (e a versão em package.json acompanha). A primeira nota que a
 * pessoa ainda não viu abre sozinha num aviso ao entrar no app.
 */

/** `icone`: caminho de um ícone de linha em /public/icones (nunca emoji). */
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
    versao: "0.0.2",
    data: "2026-11-12",
    titulo: "Agenda nova e Início mais rápido",
    resumo: "Agenda por dia, semana e mês, atalhos no Início e o app mais leve de usar no celular.",
    destaques: [
      {
        icone: "/icones/calendario.svg",
        titulo: "Agenda por dia, semana e mês",
        texto: "Linha do tempo do dia e da semana, mês com pontos coloridos e o próximo compromisso lembrado no Início.",
      },
      {
        icone: "/icones/saldo-linha.svg",
        titulo: "Atalhos no Início",
        texto: "Toque no saldo, nos recebidos, pendentes, despesas ou entregas para abrir o Resumo já filtrado no mesmo período.",
      },
      {
        icone: "/icones/dispositivos.svg",
        titulo: "Melhor no celular",
        texto: "O iPhone não dá mais zoom ao tocar num campo, o toque duplo não seleciona texto e botões e painéis respondem ao toque.",
      },
      {
        icone: "/icones/olho.svg",
        titulo: "Olho também nos Relatórios",
        texto: "Com os valores escondidos no Início, os Relatórios também ficam escondidos.",
      },
      {
        icone: "/icones/info.svg",
        titulo: "Avisos mais claros",
        texto: "Endereço errado ou tela que não carregou agora explicam o que houve e mostram como voltar.",
      },
    ],
  },
  {
    versao: "0.0.1",
    data: "2026-11-10",
    titulo: "Primeira versão",
    resumo: "O controle completo do seu corre: o que entra, o que sai e quanto sobra.",
    destaques: [
      {
        icone: "/icones/saldo-linha.svg",
        titulo: "Saldo do período",
        texto: "Saldo, recebidos, pendentes, despesas e entregas do dia, da semana ou do mês, em lista ou no calendário.",
      },
      {
        icone: "/icones/adicionar.svg",
        titulo: "Lançamento rápido",
        texto: "Receita (entrega, corrida ou gorjeta) e despesa com o total calculado na hora. A categoria de costume de cada cliente e de cada descrição já vem marcada.",
      },
      {
        icone: "/icones/lista.svg",
        titulo: "Resumo",
        texto: "Todas as movimentações com filtros por período, categoria, cliente e situação. Cada lançamento pode ser editado, excluído ou marcado como pago.",
      },
      {
        icone: "/icones/relatorios.svg",
        titulo: "Relatórios",
        texto: "Comparação com o período anterior, previsão do fim do mês, dia e horário que mais rendem, últimos 6 meses e saldo acumulado.",
      },
      {
        icone: "/icones/alvo.svg",
        titulo: "Metas e contas",
        texto: "Metas de receita, de entregas ou de limite de gasto, e contas parceladas que abatem a cada pagamento.",
      },
      {
        icone: "/icones/olho.svg",
        titulo: "Esconder valores",
        texto: "Um toque no olho do Início esconde os valores da tela.",
      },
      {
        icone: "/icones/dispositivos.svg",
        titulo: "Celular e computador",
        texto: "Instale na tela de início do celular ou use no computador, com menu lateral e telas mais largas.",
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
