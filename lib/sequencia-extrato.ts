/**
 * Lista do extrato que estava na tela quando um item foi aberto, para o detalhe
 * poder ir para o anterior/próximo respeitando o mesmo período e filtros.
 * Fica no sessionStorage: some ao fechar o app e não vai para o servidor.
 */
export type ItemSequencia = { tipo: "receita" | "despesa"; id: string };

const CHAVE = "nocorre:sequencia-extrato";

export function salvarSequencia(itens: ItemSequencia[]) {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(itens));
  } catch {
    // Sem storage (navegação privada): o detalhe só não mostra as setas.
  }
}

export function lerSequencia(): ItemSequencia[] {
  try {
    const salvo = sessionStorage.getItem(CHAVE);
    return salvo ? (JSON.parse(salvo) as ItemSequencia[]) : [];
  } catch {
    return [];
  }
}

export function caminhoDoDetalhe(item: ItemSequencia) {
  return `/resumo/${item.tipo}/${item.id}`;
}
