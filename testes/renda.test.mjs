// Renda dos Relatórios (lib/renda.ts). Rodar: npm run testar
import { test } from "node:test";
import assert from "node:assert/strict";
import { fontesDeRenda, porMes } from "../lib/renda.ts";

test("de onde veio a renda: corre pago e cada tipo de outra entrada", () => {
  const receitas = [
    { valor_total: 100.5, status_pagamento: "pago" },
    { valor_total: 50, status_pagamento: "pendente" },
    { valor_total: 49.5, status_pagamento: "pago" },
  ];
  const entradas = [
    { tipo: "Salário", valor: 1500 },
    { tipo: "Bolsa", valor: 200 },
    { tipo: "Salário", valor: 100 },
  ];
  const r = fontesDeRenda(receitas, entradas);
  assert.equal(r.total, 1950);
  assert.equal(r.corre, 150);
  assert.equal(r.foraDoCorre, 1800);
  assert.deepEqual(
    r.fontes.map((f) => [f.nome, f.valor, f.percentual, f.doCorre]),
    [
      ["Salário", 1600, 82, false],
      ["Bolsa", 200, 10, false],
      ["Corre", 150, 8, true],
    ],
  );
});

test("sem renda nenhuma, nenhuma fonte", () => {
  const r = fontesDeRenda([{ valor_total: 10, status_pagamento: "pendente" }], []);
  assert.equal(r.total, 0);
  assert.deepEqual(r.fontes, []);
});

test("por mês: corre, outras rendas, despesas e o saldo do Início", () => {
  const inicio = new Date(2026, 9, 1); // outubro
  const meses = porMes(
    {
      receitas: [
        { valor_total: 300, status_pagamento: "pago", data_hora: new Date(2026, 9, 5).toISOString() },
        { valor_total: 80, status_pagamento: "pendente", data_hora: new Date(2026, 10, 2).toISOString() },
        { valor_total: 200, status_pagamento: "pago", data_hora: new Date(2026, 10, 3).toISOString() },
      ],
      despesas: [{ valor_total: 120, data_hora: new Date(2026, 10, 4).toISOString() }],
      entradas: [{ valor: 1000, data_hora: new Date(2026, 10, 5).toISOString() }],
    },
    inicio,
    2,
  );
  assert.deepEqual(meses, [
    { rotulo: "out", corre: 300, outras: 0, despesa: 0, saldo: 300 },
    { rotulo: "nov", corre: 200, outras: 1000, despesa: 120, saldo: 1080 },
  ]);
});
