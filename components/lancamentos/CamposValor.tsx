"use client";

import { CampoMoeda } from "@/components/ui/CampoMoeda";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { formatarMoeda } from "@/lib/formatar";

export type Valores = {
  data: string;
  hora: string;
  /** Texto do input, para permitir apagar e redigitar. */
  quantidade: string;
  centavos: number;
};

type Props = {
  valores: Valores;
  aoMudar: (valores: Valores) => void;
  /** Cor do total: verde em receita, vermelho em despesa. */
  corTotal: string;
  erros: { quantidade?: string; valor?: string };
};

/** Data, hora, quantidade, valor unitário e o total calculado enquanto digita. */
export function CamposValor({ valores, aoMudar, corTotal, erros }: Props) {
  const mudar = (campo: Partial<Valores>) => aoMudar({ ...valores, ...campo });
  // Só para exibir. O valor que vale é o valor_total que o banco calcula.
  const total = (Number(valores.quantidade) || 0) * valores.centavos;

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        <CampoTexto rotulo="Data" type="date" value={valores.data} onChange={(e) => mudar({ data: e.target.value })} required />
        <CampoTexto rotulo="Hora" type="time" value={valores.hora} onChange={(e) => mudar({ hora: e.target.value })} required />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <CampoTexto
          rotulo="Quantidade"
          inputMode="numeric"
          value={valores.quantidade}
          onChange={(e) => mudar({ quantidade: e.target.value.replace(/\D/g, "").slice(0, 5) })}
          erro={erros.quantidade}
        />
        <CampoMoeda
          rotulo="Valor unitário"
          centavos={valores.centavos}
          aoMudar={(centavos) => mudar({ centavos })}
          erro={erros.valor}
        />
      </div>
      <div className="flex flex-col gap-[5px]">
        <span className="text-xs font-semibold">Total (calculado)</span>
        <output
          aria-live="polite"
          className={`rounded-[10px] border border-cinza-claro bg-cinza-fundo px-[14px] py-[9px] text-base font-extrabold ${corTotal}`}
        >
          {formatarMoeda(total / 100)}
        </output>
      </div>
    </>
  );
}

/** Confere quantidade e valor; devolve as mensagens de erro (vazio se estiver tudo certo). */
export function validarValores(valores: Valores) {
  const erros: { quantidade?: string; valor?: string } = {};
  if (!(Number(valores.quantidade) > 0)) erros.quantidade = "Mínimo 1.";
  if (valores.centavos <= 0) erros.valor = "Informe o valor.";
  return erros;
}
