/** Recursos do No Corre! Pro, mostrados na tela do plano e nos bloqueios. */
export const RECURSOS_PRO = [
  {
    chave: "carteiras",
    icone: "/icones/carteira-linha.svg",
    titulo: "Carteiras",
    texto: "Separe o dinheiro por onde ele está: conta do banco, dinheiro em mão, conta do salário. Cada carteira com o próprio saldo.",
  },
  {
    chave: "moto",
    icone: "/icones/moto-linha.svg",
    titulo: "Saúde da moto",
    texto: "Quilometragem, troca de óleo, pneus e relação: o app avisa quando estiver chegando a hora de cada manutenção.",
  },
  {
    chave: "tema",
    icone: "/icones/tema.svg",
    titulo: "Tema do app",
    texto: "Temas completos para o app: Clássico, Neblina (cinza claro com azul), Noturno (escuro com lilás) e Asfalto (cinza com laranja).",
  },
] as const;

export type RecursoPro = (typeof RECURSOS_PRO)[number]["chave"];
