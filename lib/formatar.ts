const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 694 → "R$ 694,00" */
export function formatarMoeda(valor: number) {
  return moeda.format(valor);
}

/**
 * Máscara de telefone enquanto digita: "35999998888" → "(35) 9 9999-8888".
 * Fixo com 10 dígitos fica "(35) 3333-1234".
 */
export function formatarTelefone(texto: string) {
  const d = texto.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
}

/** Placa em maiúsculas com hífen depois das 3 letras: "abc1d23" → "ABC-1D23". */
export function formatarPlaca(texto: string) {
  const limpo = texto.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
  return limpo.length > 3 ? `${limpo.slice(0, 3)}-${limpo.slice(3)}` : limpo;
}
