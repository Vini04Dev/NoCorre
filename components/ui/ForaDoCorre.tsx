import { Valor } from "./Valor";
import { formatarMoeda } from "@/lib/formatar";

/**
 * Linha discreta embaixo do saldo: o que mexeu no bolso mas não é do corre.
 * Sem gasto pessoal nem outra entrada no período, não aparece (quem só faz
 * entregas não vê nada diferente).
 */
export function ForaDoCorre({ pessoais, entradas }: { pessoais: number; entradas: number }) {
  if (pessoais <= 0 && entradas <= 0) return null;
  const partes = [
    pessoais > 0 && (
      <span key="p">
        <Valor texto={formatarMoeda(pessoais)} /> em gastos pessoais
      </span>
    ),
    entradas > 0 && (
      <span key="e">
        <Valor texto={formatarMoeda(entradas)} /> em outras entradas
      </span>
    ),
  ].filter(Boolean);

  return (
    <p className="text-[11px] leading-snug text-cinza-escuro">
      Saldo e despesas contam só o corre. Fora dele:{" "}
      {partes.map((parte, i) => (
        <span key={i}>
          {i > 0 && " · "}
          {parte}
        </span>
      ))}
      .
    </p>
  );
}
