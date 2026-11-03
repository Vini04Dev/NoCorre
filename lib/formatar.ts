const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 694 → "R$ 694,00" */
export function formatarMoeda(valor: number) {
  return moeda.format(valor);
}
