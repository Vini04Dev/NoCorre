// Regras da repetição de eventos da Agenda (lib/repeticao.ts). Rodar: npm run testar
import { test } from "node:test";
import assert from "node:assert/strict";
import { diasDaRepeticao, fimMaximo, fraseRegra, MAXIMO_OCORRENCIAS } from "../lib/repeticao.ts";

const dia = (texto) => {
  const [a, m, d] = texto.split("-").map(Number);
  return new Date(a, m - 1, d);
};
const texto = (data) =>
  `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
const SEXTA = 5;

test("toda sexta até a data escolhida (inclusive)", () => {
  const dias = diasDaRepeticao(dia("2026-11-20"), { tipo: "semanal", diasSemana: [SEXTA] }, dia("2026-12-11")).map(texto);
  assert.deepEqual(dias, ["2026-11-20", "2026-11-27", "2026-12-04", "2026-12-11"]);
});

test("começando numa quarta, toda sexta começa na sexta seguinte", () => {
  const dias = diasDaRepeticao(dia("2026-11-18"), { tipo: "semanal", diasSemana: [SEXTA] }, dia("2026-12-04")).map(texto);
  assert.deepEqual(dias, ["2026-11-20", "2026-11-27", "2026-12-04"]);
});

test("vários dias: segunda e quarta", () => {
  const dias = diasDaRepeticao(dia("2026-11-16"), { tipo: "semanal", diasSemana: [1, 3] }, dia("2026-11-25")).map(texto);
  assert.deepEqual(dias, ["2026-11-16", "2026-11-18", "2026-11-23", "2026-11-25"]);
});

test("sem dia marcado, usa o dia da semana da data escolhida", () => {
  const dias = diasDaRepeticao(dia("2026-11-18"), { tipo: "semanal", diasSemana: [] }, dia("2026-12-02")).map(texto);
  assert.deepEqual(dias, ["2026-11-18", "2026-11-25", "2026-12-02"]);
});

test("todo mês no dia 31 cai no último dia dos meses mais curtos", () => {
  const dias = diasDaRepeticao(dia("2027-01-31"), { tipo: "mensal", diasSemana: [] }, dia("2027-05-31")).map(texto);
  assert.deepEqual(dias, ["2027-01-31", "2027-02-28", "2027-03-31", "2027-04-30", "2027-05-31"]);
});

test("vira o ano sem erro", () => {
  const dias = diasDaRepeticao(dia("2026-12-25"), { tipo: "semanal", diasSemana: [SEXTA] }, dia("2027-01-08")).map(texto);
  assert.deepEqual(dias, ["2026-12-25", "2027-01-01", "2027-01-08"]);
});

test("nunca passa de 1 ano nem do máximo de eventos", () => {
  const sextas = diasDaRepeticao(dia("2026-11-20"), { tipo: "semanal", diasSemana: [SEXTA] }, dia("2030-01-01"));
  assert.ok(sextas.at(-1) <= fimMaximo(dia("2026-11-20")));
  assert.equal(sextas.length, 53);
  const todoDia = diasDaRepeticao(dia("2026-11-20"), { tipo: "semanal", diasSemana: [0, 1, 2, 3, 4, 5, 6] }, dia("2030-01-01"));
  assert.equal(todoDia.length, MAXIMO_OCORRENCIAS);
});

test("nenhum dia que sirva: fica só o próprio evento", () => {
  assert.deepEqual(diasDaRepeticao(dia("2026-11-18"), { tipo: "semanal", diasSemana: [SEXTA] }, dia("2026-11-19")).map(texto), ["2026-11-18"]);
});

test("frases da regra", () => {
  assert.equal(fraseRegra({ tipo: "semanal", diasSemana: [SEXTA] }), "Toda sexta");
  assert.equal(fraseRegra({ tipo: "semanal", diasSemana: [3, 1] }), "Toda segunda e quarta");
  assert.equal(fraseRegra({ tipo: "semanal", diasSemana: [6, 0] }), "Todo sábado e domingo");
  assert.equal(fraseRegra({ tipo: "semanal", diasSemana: [1, 2, 3, 4, 5] }), "De segunda a sexta");
  assert.equal(fraseRegra({ tipo: "semanal", diasSemana: [0, 1, 2, 3, 4, 5, 6] }), "Todo dia");
});
