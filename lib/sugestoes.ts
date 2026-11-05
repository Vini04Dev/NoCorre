/** Sem acento e em minúsculas: "Garagem" e "garágem" batem com "gar". */
export function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

/**
 * Textos já usados, do mais frequente para o menos, sem repetir (ignorando
 * maiúsculas e acentos; vale a grafia mais recente).
 */
export function contarUsos(textos: string[]) {
  const usos = new Map<string, { texto: string; vezes: number }>();
  for (const texto of textos) {
    const limpo = texto.trim();
    if (!limpo) continue;
    const chave = normalizar(limpo);
    const atual = usos.get(chave);
    if (atual) atual.vezes += 1;
    else usos.set(chave, { texto: limpo, vezes: 1 });
  }
  return [...usos.values()].sort((a, b) => b.vezes - a.vezes).map((uso) => uso.texto);
}

/**
 * Sugestões para o que está sendo digitado: valem as opções em que alguma
 * palavra começa com o texto ("g" acha Gasolina e Garagem, mas não Supermercado;
 * "pos" acha "Lanche no posto"). As que começam pelo texto vêm primeiro.
 * Quando o texto já é exatamente uma opção, não sugere nada.
 */
export function filtrarSugestoes(opcoes: string[], digitado: string, limite = 5) {
  const busca = normalizar(digitado);
  if (!busca) return [];
  const inicio: string[] = [];
  const palavra: string[] = [];
  for (const opcao of opcoes) {
    const alvo = normalizar(opcao);
    if (alvo === busca) return [];
    if (alvo.startsWith(busca)) inicio.push(opcao);
    else if (alvo.split(/\s+/).some((parte) => parte.startsWith(busca))) palavra.push(opcao);
  }
  return [...inicio, ...palavra].slice(0, limite);
}
