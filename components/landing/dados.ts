/**
 * Conteúdo da landing page. Números, depoimentos e nomes abaixo são FICTÍCIOS,
 * colocados só para montar o layout. Trocar pelos reais antes de divulgar.
 */

export const LINKS_NAVEGACAO = [
  { href: "#historia", rotulo: "Como funciona" },
  { href: "#relatorios", rotulo: "Relatórios" },
  { href: "#cidade", rotulo: "Nossa cidade" },
  { href: "#planos", rotulo: "Planos" },
  { href: "#codigo", rotulo: "GitHub" },
  { href: "#perguntas", rotulo: "Dúvidas" },
];

export const NUMEROS = [
  { ate: 1200, prefixo: "+", sufixo: "", rotulo: "lançamentos no teste piloto" },
  { ate: 20, prefixo: "", sufixo: " entregadores", rotulo: "usando em Paraíso" },
  { ate: 4.9, prefixo: "", sufixo: "/5", rotulo: "de satisfação", casas: 1 },
];

export const RECEITA_SEMANA = [
  { dia: "Seg", valor: 35 },
  { dia: "Ter", valor: 25 },
  { dia: "Qua", valor: 40 },
  { dia: "Qui", valor: 30 },
  { dia: "Sex", valor: 70 },
  { dia: "Sáb", valor: 55 },
  { dia: "Dom", valor: 25 },
];

export const CATEGORIAS_DESPESA = [
  { nome: "Combustível", valor: 180, cor: "#ffd36a" },
  { nome: "Manutenção", valor: 90, cor: "#4caf00" },
  { nome: "Alimentação", valor: 70, cor: "#9196a2" },
  { nome: "Diária Central", valor: 60, cor: "#5b6b9a" },
];

/** Saldo acumulado a cada 3 dias do mês. */
export const SALDO_MES = [40, 110, 160, 240, 220, 330, 420, 510, 640, 780];

export const PERFIS = ["Apps de entrega", "Centrais de motoboy", "Mototáxi", "Pizzarias e demais estabelecimentos", "Entregas avulsas"];

export const PASSOS = [
  { titulo: "Crie sua conta", texto: "Só nome, e-mail e senha. Grátis e sem cartão de crédito." },
  { titulo: "Cadastre onde você roda", texto: "O app, a central ou a pizzaria. Leva menos de um minuto." },
  { titulo: "Lance e acompanhe", texto: "A cada entrega, um toque. No fim do dia, o saldo já está pronto." },
];

export const DEPOIMENTOS = [
  {
    nome: "Rafael M.",
    papel: "Entregador por aplicativo",
    texto: "Antes eu anotava no caderno e sempre perdia alguma coisa. Agora sei na hora quanto fiz na semana.",
  },
  {
    nome: "Juliana S.",
    papel: "Mototaxista",
    texto: "As metas me ajudaram a juntar para a revisão da moto sem apertar o mês.",
  },
  {
    nome: "Carlos P.",
    papel: "Entregador de pizzaria",
    texto: "O controle das contas do mês é o que eu mais uso. Pago a parcela e ele já mostra quanto falta.",
  },
];

export const PLANO_GRATIS = [
  "Receitas e despesas ilimitadas",
  "Resumo do dia, semana e mês",
  "Metas e contas a pagar",
  "Relatórios e avisos",
  "Funciona no celular como app",
];

export const PLANO_PRO = ["Tudo do plano grátis", "Agenda com lembretes", "Saúde da moto (trocas por km)", "Exportar relatórios"];

export const PERGUNTAS = [
  {
    pergunta: "O No Corre! é pago?",
    resposta: "Não. Todas as funções atuais são gratuitas. Um plano Pro com recursos extras está nos planos, mas o essencial continua grátis.",
  },
  {
    pergunta: "Preciso baixar na loja de aplicativos?",
    resposta: "Não. Abra o site no celular e use “Adicionar à tela de início”. Ele abre em tela cheia, como um app.",
  },
  {
    pergunta: "Meus dados ficam seguros?",
    resposta: "Cada conta só enxerga os próprios dados, com regras de acesso no próprio banco. Sua senha é guardada criptografada.",
  },
  {
    pergunta: "Serve para quem faz entrega e mototáxi?",
    resposta: "Serve. Você escolhe o tipo de cada receita: entrega, corrida ou gorjeta, e de qual cliente veio. A diária da central entra como despesa.",
  },
];
