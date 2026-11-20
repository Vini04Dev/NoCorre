/**
 * Filtro por carteira do Início e do Resumo: quais lançamentos e
 * transferências contam quando a pessoa escolhe uma ou várias carteiras no
 * botão de carteira. Sem dependências, para os testes rodarem direto no Node.
 */

/** O lançamento é desta carteira? Sem carteira (null) conta na principal. */
export function ehDaCarteira(carteiraDoLancamento: string | null, carteiraId: string, principalId: string | null) {
  return carteiraDoLancamento === carteiraId || (carteiraDoLancamento === null && carteiraId === principalId);
}

/** "Nubank", "Nubank e Caixa", "Nubank, Caixa e Dinheiro". */
export function nomesCarteiras(nomes: string[]) {
  return nomes.length <= 1 ? (nomes[0] ?? "") : `${nomes.slice(0, -1).join(", ")} e ${nomes.at(-1)}`;
}

/** O lançamento é de alguma destas carteiras? Sem carteira (null) conta na principal. */
export function ehDasCarteiras(carteiraDoLancamento: string | null, ids: string[], principalId: string | null) {
  return ids.some((id) => ehDaCarteira(carteiraDoLancamento, id, principalId));
}

/**
 * Só os lançamentos das carteiras escolhidas (sem carteira contam na
 * principal). Com isso o Início e o Resumo mostram uma ou várias carteiras com
 * as mesmas linhas e os mesmos nomes de "Todas as carteiras".
 */
export function lancamentosDasCarteiras<
  R extends { carteira_id: string | null },
  D extends { carteira_id: string | null },
  E extends { carteira_id: string | null },
>(dados: { receitas: R[]; despesas: D[]; entradas: E[] }, ids: string[], principalId: string | null) {
  const daqui = (id: string | null) => ehDasCarteiras(id, ids, principalId);
  return {
    receitas: dados.receitas.filter((r) => daqui(r.carteira_id)),
    despesas: dados.despesas.filter((d) => daqui(d.carteira_id)),
    entradas: dados.entradas.filter((e) => daqui(e.carteira_id)),
  };
}

/**
 * Transferências do período para as carteiras escolhidas: o que chegou de
 * fora delas menos o que saiu para fora, em reais. Entre duas escolhidas
 * (Nubank para Caixa, as duas marcadas) não muda a soma, então não conta.
 */
export function saldoTransferencias(transferencias: { origem_id: string; destino_id: string; valor: number }[], ids: string[]) {
  const dentro = new Set(ids);
  let centavos = 0;
  for (const t of transferencias) {
    const chega = dentro.has(t.destino_id);
    const sai = dentro.has(t.origem_id);
    if (chega && !sai) centavos += Math.round(t.valor * 100);
    if (sai && !chega) centavos -= Math.round(t.valor * 100);
  }
  return centavos / 100;
}
