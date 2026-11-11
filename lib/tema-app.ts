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
 * Script do <head>: aplica o tema guardado antes da primeira pintura, sem
 * piscar o dourado. Só aceita os valores conhecidos.
 */
export const SCRIPT_TEMA_APP = `try{var t=localStorage.getItem("${CHAVE_TEMA_APP}");if(${JSON.stringify(
  TEMAS_APP.map((t) => t.valor),
)}.indexOf(t)>0)document.documentElement.dataset.temaApp=t}catch(e){}`;
