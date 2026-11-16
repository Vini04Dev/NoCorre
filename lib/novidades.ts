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
    versao: "0.0.5",
    data: "2026-11-16",
    titulo: "Saldo de tudo, com o detalhe à mão",
    resumo: "O saldo volta a contar tudo o que entrou e saiu, com recebidos e despesas divididos em do corre e pessoais.",
    destaques: [
      {
        icone: "/icones/saldo-linha.svg",
        titulo: "Saldo de tudo",
        texto: "O saldo do Início e do Resumo volta a somar tudo o que entrou e descontar tudo o que saiu, do corre ou não.",
      },
      {
        icone: "/icones/receita.svg",
        titulo: "Recebidos e despesas em duas partes",
        texto: "Cada um mostra o total e, logo abaixo, quanto foi do corre e quanto foi pessoal. Toque numa parte para ver só ela no Resumo.",
      },
      {
        icone: "/icones/seta-baixo.svg",
        titulo: "Mostre ou recolha o detalhe",
        texto: "A seta ao lado de Recebidos e de Despesas recolhe as duas partes para quem prefere ver só o total. O app lembra a escolha.",
      },
      {
        icone: "/icones/carteira-linha.svg",
        titulo: "Quanto tenho agora",
        texto: "Para quem usa carteiras (Pro), o Início mostra no topo a soma de todas elas, sem depender do período.",
      },
      {
        icone: "/icones/filtro.svg",
        titulo: "Filtro por tipo de despesa",
        texto: "No Resumo, o painel de filtros separa as despesas do corre das pessoais.",
      },
      {
        icone: "/icones/dispositivos.svg",
        titulo: "Setas do detalhe no computador",
        texto: "As setas de anterior e próximo no detalhe de um lançamento voltaram para o lado do cartão.",
      },
    ],
  },
  {
    versao: "0.0.4",
    data: "2026-11-15",
    titulo: "O dinheiro do corre separado do resto",
    resumo: "Gastos pessoais e outras entradas fora do saldo do corre, contas do mês, um sininho de avisos e Relatórios mais fáceis de entender.",
    destaques: [
      {
        icone: "/icones/saldo-linha.svg",
        titulo: "Saldo só do corre",
        texto: "Cada despesa agora é do corre ou pessoal. O saldo mostra só o que o corre deu; mercado, conta de luz e outros gastos pessoais aparecem à parte.",
      },
      {
        icone: "/icones/receita.svg",
        titulo: "Outra entrada",
        texto: "Salário, bolsa ou ajuda da família entram pelo botão + em Outra entrada, sem misturar com as entregas. Uma receita lançada errado pode ser movida para lá.",
      },
      {
        icone: "/icones/conta-fixa.svg",
        titulo: "Contas do mês",
        texto: "Cadastre aluguel, internet ou parcelas em Metas. O app lembra o vencimento, conta as parcelas pagas e marca débito automático.",
      },
      {
        icone: "/icones/relatorios.svg",
        titulo: "Relatórios mais claros",
        texto: "Tudo em reais, sem porcentagem: quanto recebeu, quanto sobrou, por dia e por entrega, comparado ao mesmo ponto do período anterior.",
      },
      {
        icone: "/icones/info.svg",
        titulo: "Sininho de avisos",
        texto: "No Início, o sininho junta contas para vencer, o próximo compromisso e entregas a receber. O que é urgente aparece numa linha logo abaixo.",
      },
      {
        icone: "/icones/destaque-usuario.svg",
        titulo: "Quanto fiz em cada cliente",
        texto: "Em Relatórios, os clientes aparecem por entregas ou por valor recebido. Toque num deles para ver só as receitas dele no Resumo.",
      },
      {
        icone: "/icones/despesa.svg",
        titulo: "Categoria Fixo",
        texto: "Para o valor fixo da diária ou do estabelecimento. Entra no que você recebeu, mas não conta como entrega.",
      },
      {
        icone: "/icones/metas.svg",
        titulo: "Metas mais fáceis de ler",
        texto: "Meta pausada ou encerrada mostra um símbolo no lugar da porcentagem.",
      },
    ],
  },
  {
    versao: "0.0.3",
    data: "2026-11-12",
    titulo: "Página de apresentação revisada",
    resumo: "Respostas das dúvidas frequentes mais claras e botões do GitHub sem o ícone que falhava no iPhone.",
    destaques: [
      {
        icone: "/icones/info.svg",
        titulo: "Dúvidas frequentes mais claras",
        texto: "As respostas da página de apresentação ficaram mais diretas e explicam melhor como o app funciona, em português, inglês e espanhol.",
      },
      {
        icone: "/icones/codigo.svg",
        titulo: "Botão do GitHub corrigido",
        texto: "O botão “Ver no GitHub” e o link do código em Sobre o No Corre! perderam a seta, que aparecia quebrada no iPhone.",
      },
    ],
  },
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
