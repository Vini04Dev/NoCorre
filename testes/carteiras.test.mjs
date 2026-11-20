// Soma de várias carteiras escolhidas (lib/filtro-carteiras.ts). Rodar: npm run testar
import { test } from "node:test";
import assert from "node:assert/strict";
import { lancamentosDasCarteiras, nomesCarteiras, saldoTransferencias } from "../lib/filtro-carteiras.ts";

test("lançamentos das carteiras escolhidas; sem carteira conta na principal", () => {
  const dados = {
    receitas: [{ carteira_id: "nubank" }, { carteira_id: null }, { carteira_id: "caixa" }],
    despesas: [{ carteira_id: "dinheiro" }, { carteira_id: "nubank" }],
    entradas: [{ carteira_id: null }],
  };
  const r = lancamentosDasCarteiras(dados, ["nubank", "dinheiro"], "dinheiro");
  assert.equal(r.receitas.length, 2);
  assert.equal(r.despesas.length, 2);
  assert.equal(r.entradas.length, 1);
});

test("transferência entre duas escolhidas não muda a soma", () => {
  const transferencias = [
    { origem_id: "nubank", destino_id: "caixa", valor: 100 },
    { origem_id: "dinheiro", destino_id: "nubank", valor: 30.5 },
    { origem_id: "caixa", destino_id: "dinheiro", valor: 10 },
  ];
  assert.equal(saldoTransferencias(transferencias, ["nubank", "caixa"]), 20.5);
  assert.equal(saldoTransferencias(transferencias, ["nubank"]), -69.5);
});

test("nomes das carteiras em lista", () => {
  assert.equal(nomesCarteiras(["Nubank"]), "Nubank");
  assert.equal(nomesCarteiras(["Nubank", "Caixa", "Dinheiro"]), "Nubank, Caixa e Dinheiro");
});
