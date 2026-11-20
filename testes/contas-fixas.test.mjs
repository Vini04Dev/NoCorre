// Situação das contas fixas (lib/contas-fixas.ts). Rodar: npm run testar
import { test } from "node:test";
import assert from "node:assert/strict";
import { situacaoDaConta } from "../lib/contas-fixas.ts";

const hoje = new Date(2026, 10, 20); // 20/11/2026

test("cadastrada no dia 20 com vencimento dia 5: primeira é a do mês que vem, sem atraso", () => {
  const situacao = situacaoDaConta(
    { dia_vencimento: 5, automatico: false, created_at: new Date(2026, 10, 20, 9).toISOString() },
    false,
    hoje,
  );
  assert.equal(situacao.tipo, "proximo");
  assert.equal(situacao.dias, 15);
});

test("cadastrada antes do vencimento e não paga: atrasada", () => {
  const situacao = situacaoDaConta(
    { dia_vencimento: 5, automatico: false, created_at: new Date(2026, 9, 1).toISOString() },
    false,
    hoje,
  );
  assert.deepEqual(situacao, { tipo: "atrasada", dias: -15 });
});

test("no mês seguinte ao cadastro volta à regra de sempre", () => {
  const situacao = situacaoDaConta(
    { dia_vencimento: 5, automatico: false, created_at: new Date(2026, 10, 20).toISOString() },
    false,
    new Date(2026, 11, 3),
  );
  assert.deepEqual(situacao, { tipo: "vence", dias: 2 });
});
