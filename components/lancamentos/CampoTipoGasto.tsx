"use client";

import { Alternador } from "@/components/ui/Alternador";

/**
 * "Esse gasto é: Do corre | Pessoal". Do corre desconta do saldo do corre no
 * Início; pessoal sai da carteira, mas fica fora dele. Uma frase curta embaixo
 * explica a escolha atual.
 */
export function CampoTipoGasto({
  doCorre,
  aoMudar,
  rotulo = "Esse gasto é",
}: {
  doCorre: boolean;
  aoMudar: (doCorre: boolean) => void;
  rotulo?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Alternador
        rotulo={rotulo}
        opcoes={[
          { valor: "corre", rotulo: "Do corre" },
          { valor: "pessoal", rotulo: "Pessoal" },
        ]}
        valor={doCorre ? "corre" : "pessoal"}
        aoMudar={(valor) => aoMudar(valor === "corre")}
      />
      <p className="text-[11px] text-cinza-escuro">
        {doCorre
          ? "Custo do trabalho, como gasolina, peças e diária: desconta do saldo do corre."
          : "Mercado, contas, lazer: sai da carteira, mas não mexe no saldo do corre."}
      </p>
    </div>
  );
}
