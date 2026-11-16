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
    texto: "Temas completos para o app: Clássico, Neblina (cinza claro com azul), Noturno (escuro com lilás) e Asfalto (cinza com laranja). Nas datas comemorativas, enfeites como os de Natal.",
  },
] as const;

export type RecursoPro = (typeof RECURSOS_PRO)[number]["chave"];

/** WhatsApp do autor (DDI + DDD + número), para quem quer pedir acesso ao Pro. */
const WHATSAPP_PRO = "5535910221632";

/**
 * Link do WhatsApp com a mensagem já escrita. O e-mail da conta vai junto para
 * achar a pessoa no Painel do sistema; ela vê o texto antes de enviar.
 */
export function linkPedirPro(email?: string | null) {
  const mensagem = [
    "Olá! Uso o No Corre! e quero pedir acesso ao plano Pro.",
    email ? `O e-mail da minha conta é ${email}.` : null,
  ]
    .filter(Boolean)
    .join(" ");
  return `https://wa.me/${WHATSAPP_PRO}?text=${encodeURIComponent(mensagem)}`;
}
