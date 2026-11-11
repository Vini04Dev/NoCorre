/**
 * Temas do app (recurso Pro). Cada tema é completo: fundo, cartões, textos,
 * cores de valores e cor de destaque combinados e conferidos no contraste
 * (WCAG 2.2 AA; ver testes/contraste.test.mjs). Esta lista é a única fonte:
 * dela saem o CSS dos temas (CSS_TEMAS_APP), as prévias da tela de tema e o teste.
 *
 * O primeiro é o padrão e precisa bater com os valores do @theme em app/globals.css.
 */

export type CoresTema = {
  /** Fundo da tela. */
  fundo: string;
  /** Cartões, painéis e campos (o "branco" do tema claro). */
  superficie: string;
  /** Superfícies secundárias: seletores, chips apagados. */
  cinzaFundo: string;
  /** Bordas e divisórias. */
  cinzaClaro: string;
  painel: string;
  /** Texto principal (o marinho do tema claro). */
  texto: string;
  /** Texto de apoio (rótulos, títulos de seção). */
  cinza: string;
  /** Texto secundário mais forte (datas, descrições). */
  cinzaEscuro: string;
  textoSegmento: string;
  /** Destaque: fim do degradê dos botões, bordas e seleção. */
  destaque: string;
  /** Destaque claro: início do degradê, chips e círculos de ícone. */
  destaqueClaro: string;
  /** Ícones dos módulos e aba ativa. */
  destaqueIcone: string;
  /** Destaque usado como texto (links como "Ver todas as metas"). */
  destaqueTexto: string;
  positivo: string;
  recebido: string;
  pendente: string;
  negativo: string;
  sombra: string;
};

export const TEMAS_APP = [
  {
    valor: "classico",
    nome: "Clássico",
    descricao: "Branco e dourado, o visual de sempre.",
    escuro: false,
    cores: {
      fundo: "#f9fafb",
      superficie: "#ffffff",
      cinzaFundo: "#f3f4f6",
      cinzaClaro: "#dfe1e6",
      painel: "#e8e8e8",
      texto: "#2b2d42",
      cinza: "#6c7180",
      cinzaEscuro: "#5c6170",
      textoSegmento: "#1f2937",
      destaque: "#e0a92e",
      destaqueClaro: "#ffd36a",
      destaqueIcone: "#c89e3b",
      destaqueTexto: "#916408",
      positivo: "#3a8500",
      recebido: "#347701",
      pendente: "#857000",
      negativo: "#cc0000",
      sombra: "0px 4px 4px 0px rgba(0, 0, 0, 0.1)",
    },
  },
  {
    valor: "noturno",
    nome: "Noturno",
    descricao: "Escuro com dourado. Cansa menos a vista no corre da noite.",
    escuro: true,
    cores: {
      fundo: "#121319",
      superficie: "#1d1f28",
      cinzaFundo: "#272a35",
      cinzaClaro: "#343745",
      painel: "#23252f",
      texto: "#eceef2",
      cinza: "#9298a6",
      cinzaEscuro: "#a7acb9",
      textoSegmento: "#eceef2",
      destaque: "#e0a92e",
      destaqueClaro: "#ffd36a",
      destaqueIcone: "#e0b04a",
      destaqueTexto: "#ffd36a",
      positivo: "#6ad11f",
      recebido: "#8fd14f",
      pendente: "#ffd84d",
      negativo: "#ff6b6b",
      sombra: "0px 4px 10px 0px rgba(0, 0, 0, 0.5)",
    },
  },
  {
    valor: "asfalto",
    nome: "Asfalto",
    descricao: "Cinza do asfalto com laranja de sinalização.",
    escuro: true,
    cores: {
      fundo: "#26282c",
      superficie: "#33363b",
      cinzaFundo: "#3d4046",
      cinzaClaro: "#4a4e55",
      painel: "#393c42",
      texto: "#eef0f2",
      cinza: "#a8adb9",
      cinzaEscuro: "#b9bdc6",
      textoSegmento: "#eef0f2",
      destaque: "#f28c28",
      destaqueClaro: "#ffb066",
      destaqueIcone: "#f39a3e",
      destaqueTexto: "#ffb066",
      positivo: "#6ad11f",
      recebido: "#8fd14f",
      pendente: "#ffd84d",
      negativo: "#ff7a7a",
      sombra: "0px 4px 10px 0px rgba(0, 0, 0, 0.4)",
    },
  },
] as const satisfies readonly { valor: string; nome: string; descricao: string; escuro: boolean; cores: CoresTema }[];

export type TemaApp = (typeof TEMAS_APP)[number]["valor"];

export const CHAVE_TEMA_APP = "nocorre:tema-app";

/** Variáveis --t-* de um tema; app/globals.css as distribui pelas superfícies. */
function variaveis(c: CoresTema) {
  return [
    `--t-fundo:${c.fundo}`,
    `--t-superficie:${c.superficie}`,
    `--t-cinza-fundo:${c.cinzaFundo}`,
    `--t-cinza-claro:${c.cinzaClaro}`,
    `--t-painel:${c.painel}`,
    `--t-texto:${c.texto}`,
    `--t-cinza:${c.cinza}`,
    `--t-cinza-escuro:${c.cinzaEscuro}`,
    `--t-texto-segmento:${c.textoSegmento}`,
    `--t-destaque:${c.destaque}`,
    `--t-destaque-claro:${c.destaqueClaro}`,
    `--t-destaque-icone:${c.destaqueIcone}`,
    `--t-destaque-texto:${c.destaqueTexto}`,
    `--t-positivo:${c.positivo}`,
    `--t-recebido:${c.recebido}`,
    `--t-pendente:${c.pendente}`,
    `--t-negativo:${c.negativo}`,
    `--t-sombra:${c.sombra}`,
  ].join(";");
}

/**
 * CSS com os valores de cada tema, posto no <head> (app/layout.tsx). Na camada
 * base, como o resto do tema em app/globals.css.
 */
export const CSS_TEMAS_APP = `@layer base{:root{${variaveis(TEMAS_APP[0].cores)}}${TEMAS_APP.slice(1)
  .map((t) => `html[data-tema-app="${t.valor}"]{${variaveis(t.cores)}}`)
  .join("")}}`;

/**
 * Script do <head>: aplica o tema guardado antes da primeira pintura, sem piscar
 * o padrão. Só aceita os valores conhecidos; marca os escuros com data-tema-escuro.
 * Também apaga a escolha de fundo da versão anterior da tela de tema.
 */
export const SCRIPT_TEMA_APP = `try{localStorage.removeItem("nocorre:fundo-app");var v=localStorage.getItem("${CHAVE_TEMA_APP}"),t=${JSON.stringify(
  TEMAS_APP.map((t) => t.valor),
)},e=${JSON.stringify(TEMAS_APP.filter((t) => t.escuro).map((t) => t.valor))};if(t.indexOf(v)>0){document.documentElement.dataset.temaApp=v;if(e.indexOf(v)>=0)document.documentElement.dataset.temaEscuro=""}}catch(x){}`;
