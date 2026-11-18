// Regras da repetição de eventos da Agenda (lib/repeticao.ts). Rodar: npm run testar
import { test } from "node:test";
import assert from "node:assert/strict";
import { diasDaRepeticao, fimMaximo, MAXIMO_OCORRENCIAS } from "../lib/repeticao.ts";

const dia = (texto) => {
  const [a, m, d] = texto.split("-").map(Number);
  return new Date(a, m - 1, d);
};
const texto = (data) =>
  `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;

test("toda semana: mesmo dia da semana, até a data escolhida (inclusive)", () => {
  const dias = diasDaRepeticao(dia("2026-11-18"), "semanal", dia("2026-12-09")).map(texto);
  assert.deepEqual(dias, ["2026-11-18", "2026-11-25", "2026-12-02", "2026-12-09"]);
});

test("a cada 2 semanas pula uma semana", () => {
  const dias = diasDaRepeticao(dia("2026-11-18"), "quinzenal", dia("2026-12-31")).map(texto);
  assert.deepEqual(dias, ["2026-11-18", "2026-12-02", "2026-12-16", "2026-12-30"]);
});

test("todo mês no dia 31 cai no último dia dos meses mais curtos", () => {
  const dias = diasDaRepeticao(dia("2027-01-31"), "mensal", dia("2027-05-31")).map(texto);
  assert.deepEqual(dias, ["2027-01-31", "2027-02-28", "2027-03-31", "2027-04-30", "2027-05-31"]);
});

test("vira o ano sem erro", () => {
  const dias = diasDaRepeticao(dia("2026-12-30"), "diaria", dia("2027-01-02")).map(texto);
  assert.deepEqual(dias, ["2026-12-30", "2026-12-31", "2027-01-01", "2027-01-02"]);
});

test("nunca passa de 1 ano nem do máximo de eventos", () => {
  const semanal = diasDaRepeticao(dia("2026-11-18"), "semanal", dia("2030-01-01"));
  assert.ok(semanal.at(-1) <= fimMaximo(dia("2026-11-18")));
  assert.equal(semanal.length, 53);
  const diaria = diasDaRepeticao(dia("2026-11-18"), "diaria", dia("2030-01-01"));
  assert.equal(diaria.length, MAXIMO_OCORRENCIAS);
});

test("Até antes do primeiro dia: só o próprio evento", () => {
  assert.deepEqual(diasDaRepeticao(dia("2026-11-18"), "semanal", dia("2026-11-01")).map(texto), ["2026-11-18"]);
});
