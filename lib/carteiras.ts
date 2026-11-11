/**
 * Tipos de carteira. A coluna no banco é texto livre (como o tipo de receitas e
 * despesas); estas opções só definem o rótulo e o ícone do cartão.
 * Ícones de linha 24x24 (traço 2), desenhados com currentColor.
 */
export const TIPOS_CARTEIRA = [
  {
    valor: "Conta corrente",
    // banco
    icone: "M3 10h18M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18M12 3l9 5H3l9-5Z",
  },
  {
    valor: "Poupança",
    // cofrinho
    icone:
      "M19 9.5c1 .6 2 1.8 2 3.5h-2c0 1.3-.6 2.4-1.5 3.2V19h-3v-1.5h-4V19h-3v-2.8A6 6 0 0 1 11 6h3c1.2 0 2.4.3 3.4 1L19 5v4.5ZM15.5 11h.01",
  },
  {
    valor: "Dinheiro",
    // cédula
    icone: "M3 7h18v10H3zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6.5 10v.01M17.5 14v.01",
  },
  {
    valor: "Conta salário",
    // maleta
    icone: "M4 8h16v11H4zM9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8M4 13h16",
  },
  {
    valor: "Outro",
    // carteira
    icone: "M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3M4 7.5V17a2 2 0 0 0 2 2h14V8H6.5A2.5 2.5 0 0 1 4 5.5M16 13.5h.01",
  },
] as const;

export type TipoCarteira = (typeof TIPOS_CARTEIRA)[number]["valor"];

/** Ícone do tipo; tipo vazio ou desconhecido usa o de carteira. */
export function iconeDoTipo(tipo: string | null | undefined) {
  return (TIPOS_CARTEIRA.find((t) => t.valor === tipo) ?? TIPOS_CARTEIRA[TIPOS_CARTEIRA.length - 1]).icone;
}
