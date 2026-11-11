/**
 * Saúde da moto: itens de manutenção, intervalos sugeridos e cálculo do desgaste.
 *
 * Intervalos sugeridos para uso severo (entrega e mototáxi). O manual da CG 160
 * indica óleo a cada 6.000 km em uso normal; para uso severo a regra é cortar pela
 * metade, então a sugestão é 3.000 km. A pessoa ajusta tudo do jeito que costuma fazer.
 */

export type TipoComponente = "oleo" | "relacao" | "pneu_dianteiro" | "pneu_traseiro" | "freios";

/** Parte da moto que acende no desenho. */
export type ParteDesenho = "motor" | "corrente" | "roda_dianteira" | "roda_traseira" | "freios";

export const COMPONENTES_PADRAO: { tipo: TipoComponente; nome: string; intervalo_km: number; parte: ParteDesenho }[] = [
  { tipo: "oleo", nome: "Óleo do motor", intervalo_km: 3000, parte: "motor" },
  { tipo: "relacao", nome: "Relação (coroa, pinhão e corrente)", intervalo_km: 15000, parte: "corrente" },
  { tipo: "pneu_traseiro", nome: "Pneu traseiro", intervalo_km: 15000, parte: "roda_traseira" },
  { tipo: "pneu_dianteiro", nome: "Pneu dianteiro", intervalo_km: 20000, parte: "roda_dianteira" },
  { tipo: "freios", nome: "Freios (pastilha e lona)", intervalo_km: 10000, parte: "freios" },
];

export function parteDo(tipo: string): ParteDesenho | null {
  return COMPONENTES_PADRAO.find((c) => c.tipo === tipo)?.parte ?? null;
}

export type Situacao = "ok" | "atencao" | "trocar" | "vencido";

/** Quanto do intervalo já foi rodado (0 a 1+) e a situação correspondente. */
export function desgaste(kmAtual: number, kmUltimaTroca: number, intervaloKm: number) {
  const rodado = Math.max(0, kmAtual - kmUltimaTroca);
  const fracao = intervaloKm > 0 ? rodado / intervaloKm : 0;
  const situacao: Situacao = fracao >= 1 ? "vencido" : fracao >= 0.9 ? "trocar" : fracao >= 0.7 ? "atencao" : "ok";
  return { rodado, fracao, faltam: intervaloKm - rodado, situacao };
}

/** Cores da situação (verde, amarelo, laranja, vermelho), as mesmas do app. */
export const COR_SITUACAO: Record<Situacao, string> = {
  ok: "#4caf00",
  atencao: "#e0a92e",
  trocar: "#e8590c",
  vencido: "#cc0000",
};

export const ROTULO_SITUACAO: Record<Situacao, string> = {
  ok: "Em dia",
  atencao: "Fique de olho",
  trocar: "Trocar logo",
  vencido: "Passou da hora",
};

export function formatarKm(km: number) {
  return `${Math.round(km).toLocaleString("pt-BR")} km`;
}

/** Moto pequena tipo cub/scooter (Biz, Pop, Lead, NMax...) muda o desenho. */
export function ehScooter(modelo: string | null | undefined) {
  return /\b(biz|pop|lead|nmax|pcx|neo|fluo|elite|burgman|scooter|cub)\b/i.test(modelo ?? "");
}
