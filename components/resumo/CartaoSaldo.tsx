import type { calcularTotais } from "@/lib/totais";
import { formatarMoeda } from "@/lib/formatar";

type Props = {
  /** "da semana", "do mês"... */
  nomePeriodo: string;
  totais: ReturnType<typeof calcularTotais> | null;
};

/** Saldo do período em destaque e, abaixo, recebidos, pendentes e despesas. */
export function CartaoSaldo({ nomePeriodo, totais }: Props) {
  const moeda = (valor: number | undefined) => (totais ? formatarMoeda(valor ?? 0) : "–");

  return (
    <section className="flex flex-col gap-3 rounded-[10px] border border-black/8 bg-white px-4 py-3.5 shadow-cartao">
      <div>
        <h2 className="text-[11px] font-semibold text-cinza-escuro uppercase">Saldo {nomePeriodo}</h2>
        <p className={`text-[26px] font-extrabold ${totais && totais.saldo < 0 ? "text-negativo" : "text-positivo"}`}>
          {moeda(totais?.saldo)}
        </p>
      </div>
      <hr className="border-black/8" />
      <dl className="grid grid-cols-3 gap-2">
        {[
          { rotulo: "Recebidos", valor: totais?.recebidos, cor: "text-recebido" },
          { rotulo: "Pendentes", valor: totais?.pendentes, cor: "text-pendente" },
          { rotulo: "Despesas", valor: totais?.despesas, cor: "text-negativo" },
        ].map(({ rotulo, valor, cor }) => (
          <div key={rotulo}>
            <dt className="text-[11px] text-cinza-escuro">{rotulo}</dt>
            <dd className={`text-sm font-extrabold ${cor}`}>{moeda(valor)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
