/** Temas de cor do app (recurso Pro). Os valores de cada um ficam em app/globals.css. */
export const TEMAS_APP = [
  { valor: "dourado", rotulo: "Dourado", forte: "#e0a92e", claro: "#ffd36a" },
  { valor: "verde", rotulo: "Verde", forte: "#5cb82a", claro: "#b5e48c" },
  { valor: "azul", rotulo: "Azul", forte: "#4a8ef0", claro: "#a9cbff" },
  { valor: "laranja", rotulo: "Laranja", forte: "#f08a3c", claro: "#ffc29a" },
  { valor: "roxo", rotulo: "Roxo", forte: "#9b7bff", claro: "#cdbcff" },
] as const;

export type TemaApp = (typeof TEMAS_APP)[number]["valor"];

export const CHAVE_TEMA_APP = "nocorre:tema-app";

/**
 * Tons de fundo (recurso Pro), do claro ao escuro. Nos dois escuros o texto
 * sobre o fundo fica claro; cartões e painéis continuam claros (app/globals.css).
 */
export const FUNDOS_APP = [
  { valor: "branco", rotulo: "Branco", cor: "#f9fafb" },
  { valor: "gelo", rotulo: "Gelo", cor: "#eceef2" },
  { valor: "nevoa", rotulo: "Névoa", cor: "#d5d9e0" },
  { valor: "grafite", rotulo: "Grafite", cor: "#3a3d4f" },
  { valor: "noite", rotulo: "Noite", cor: "#16171f" },
] as const;

export type FundoApp = (typeof FUNDOS_APP)[number]["valor"];

export const CHAVE_FUNDO_APP = "nocorre:fundo-app";

/** Lê do aparelho e põe no <html> como data-*, só se for um valor conhecido (o primeiro é o padrão). */
const aplicarGuardado = (chave: string, valores: readonly string[], atributo: string) =>
  `try{var v=localStorage.getItem("${chave}");if(${JSON.stringify(valores)}.indexOf(v)>0)document.documentElement.dataset.${atributo}=v}catch(e){}`;

/**
 * Script do <head>: aplica cor e fundo guardados antes da primeira pintura,
 * sem piscar o padrão.
 */
export const SCRIPT_TEMA_APP =
  aplicarGuardado(CHAVE_TEMA_APP, TEMAS_APP.map((t) => t.valor), "temaApp") +
  aplicarGuardado(CHAVE_FUNDO_APP, FUNDOS_APP.map((f) => f.valor), "fundoApp");
