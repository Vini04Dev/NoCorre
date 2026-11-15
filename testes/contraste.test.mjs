// Contraste dos temas do app pelas regras da WCAG 2.2, nível AA:
// - 1.4.3 Contraste (mínimo): texto 4,5:1 (texto grande, 18,66px negrito ou 24px, 3:1).
// - 1.4.11 Contraste sem texto: ícones e indicadores de estado 3:1.
// Fonte única das cores: lib/tema-app.ts. Rodar: npm run testar
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { TEMAS_APP } from "../lib/tema-app.ts";

/** Luminância relativa (WCAG): canais sRGB linearizados. */
function luminancia(hex) {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(a, b) {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

const TEXTO = 4.5;
const GRAFICO = 3;

// Superfícies de cor fixa, iguais em todos os temas (faixas marinho, chips dourados).
const MARINHO = "#2b2d42";
const BRANCO = "#ffffff";
const CINZA_NO_MARINHO = "#b0b6bf";
const CINZA_ESCURO_NO_MARINHO = "#9196a2";

/** [descrição, frente, fundo, mínimo] para um tema. */
function pares(c, escuro) {
  const lista = [
    ["texto no fundo", c.texto, c.fundo, TEXTO],
    ["texto no cartão", c.texto, c.superficie, TEXTO],
    ["texto em superfície secundária", c.texto, c.cinzaFundo, TEXTO],
    ["texto de apoio (cinza) no cartão", c.cinza, c.superficie, TEXTO],
    ["texto de apoio (cinza) no fundo", c.cinza, c.fundo, TEXTO],
    ["texto secundário (cinza escuro) no cartão", c.cinzaEscuro, c.superficie, TEXTO],
    ["texto secundário em superfície secundária", c.cinzaEscuro, c.cinzaFundo, TEXTO],
    ["segmento ativo", c.textoSegmento, c.superficie, TEXTO],
    ["link de destaque no cartão", c.destaqueTexto, c.superficie, TEXTO],
    ["link de destaque no fundo", c.destaqueTexto, c.fundo, TEXTO],
    ["texto do botão (início do degradê)", MARINHO, c.destaqueClaro, TEXTO],
    ["texto do botão (fim do degradê)", MARINHO, c.destaque, TEXTO],
    ["ícone na aba ativa", MARINHO, c.destaqueIcone, GRAFICO],
    ["ícone do módulo no círculo marinho", c.destaqueIcone, MARINHO, GRAFICO],
    ["ícone no círculo de destaque claro", MARINHO, c.destaqueClaro, GRAFICO],
    // Seleção (chip ativo, botão marinho): no claro, o próprio marinho; nos escuros,
    // o contorno na cor de destaque (app/globals.css).
    ["indicador de seleção no cartão", escuro ? c.destaque : MARINHO, c.superficie, GRAFICO],
    ["indicador de seleção no fundo", escuro ? c.destaque : MARINHO, c.fundo, GRAFICO],
    ["valor positivo no cartão", c.positivo, c.superficie, TEXTO],
    ["valor recebido no cartão", c.recebido, c.superficie, TEXTO],
    ["valor pendente no cartão", c.pendente, c.superficie, TEXTO],
    ["valor negativo no cartão", c.negativo, c.superficie, TEXTO],
  ];
  return lista;
}

for (const tema of TEMAS_APP) {
  test(`tema ${tema.nome}: contraste AA`, () => {
    const falhas = pares(tema.cores, tema.escuro)
      .map(([nome, frente, fundo, minimo]) => ({ nome, razao: contraste(frente, fundo), minimo, frente, fundo }))
      .filter((p) => p.razao < p.minimo)
      .map((p) => `${p.nome}: ${p.frente} sobre ${p.fundo} = ${p.razao.toFixed(2)} (mínimo ${p.minimo})`);
    assert.deepEqual(falhas, []);
  });
}

test("faixas marinho (iguais em todos os temas): contraste AA", () => {
  assert.ok(contraste(BRANCO, MARINHO) >= TEXTO);
  assert.ok(contraste(CINZA_NO_MARINHO, MARINHO) >= TEXTO);
  assert.ok(contraste(CINZA_ESCURO_NO_MARINHO, MARINHO) >= TEXTO);
  for (const tema of TEMAS_APP) assert.ok(contraste(tema.cores.destaqueClaro, MARINHO) >= TEXTO, tema.nome);
});

test("tema padrão bate com o @theme de app/globals.css", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const c = TEMAS_APP[0].cores;
  const esperado = {
    "--color-fundo": c.fundo,
    "--color-cinza-fundo": c.cinzaFundo,
    "--color-cinza-claro": c.cinzaClaro,
    "--color-painel": c.painel,
    "--color-marinho": c.texto,
    "--color-cinza": c.cinza,
    "--color-cinza-escuro": c.cinzaEscuro,
    "--color-dourado": c.destaque,
    "--color-dourado-claro": c.destaqueClaro,
    "--color-dourado-icone": c.destaqueIcone,
    "--color-positivo": c.positivo,
    "--color-recebido": c.recebido,
    "--color-pendente": c.pendente,
    "--color-negativo": c.negativo,
  };
  for (const [variavel, valor] of Object.entries(esperado)) {
    const achado = css.match(new RegExp(`${variavel}:\\s*(#[0-9a-fA-F]{6})`));
    assert.equal(achado?.[1].toLowerCase(), valor, variavel);
  }
});
