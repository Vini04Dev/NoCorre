import type { calcularTotais } from "@/lib/totais";
import { Valor } from "@/components/ui/Valor";
import { formatarMoeda } from "@/lib/formatar";

type Props = {
  /** "da semana", "do mês"... */
  nomePeriodo: string;
  totais: ReturnType<typeof calcularTotais> | null;
  /** Lista filtrada (ex.: só um cliente): soma só o que está nela. */
  filtro?: { titulo: string; recebidos: number; pendentes: number; despesas: number; entregas: number };
};

/** Saldo do período em destaque e, abaixo, recebidos, pendentes e despesas. */
export function CartaoSaldo({ nomePeriodo, totais, filtro }: Props) {
  const moeda = (valor: number | undefined) => (!totais ? "–" : <Valor texto={formatarMoeda(valor ?? 0)} />);

  if (filtro) {
    const gastos = filtro.despesas;
    return (
      <section className="flex flex-col gap-3 rounded-[10px] border border-black/8 bg-white px-4 py-3.5 shadow-cartao">
        <div>
          <h2 className="text-[11px] font-semibold text-cinza-escuro uppercase">
            {filtro.titulo} · recebido {nomePeriodo}
          </h2>
          <p className="text-[26px] font-extrabold text-recebido">
            <Valor texto={formatarMoeda(filtro.recebidos)} />
          </p>
        </div>
        <hr className="border-black/8" />
        <dl className="grid grid-cols-3 gap-2">
          {[
            { rotulo: "A receber", texto: <Valor texto={formatarMoeda(filtro.pendentes)} />, cor: "text-pendente" },
            { rotulo: "Entregas", texto: String(filtro.entregas), cor: "text-positivo" },
            // Filtro de cliente não traz despesa: no lugar, quanto esse cliente paga por entrega.
            gastos > 0 || filtro.entregas === 0
              ? { rotulo: "Despesas", texto: <Valor texto={formatarMoeda(gastos)} />, cor: "text-negativo" }
              : {
                  rotulo: "Por entrega",
                  texto: <Valor texto={formatarMoeda((filtro.recebidos + filtro.pendentes) / filtro.entregas)} />,
                  cor: "",
                },
          ].map(({ rotulo, texto, cor }) => (
            <div key={rotulo}>
              <dt className="text-[11px] text-cinza-escuro">{rotulo}</dt>
              <dd className={`text-sm font-extrabold ${cor}`}>{texto}</dd>
            </div>
          ))}
        </dl>
        <p className="text-[11px] leading-snug text-cinza-escuro">Soma só o que está na lista, com os filtros de agora.</p>
      </section>
    );
  }

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
          { rotulo: "Recebidos", valor: totais?.recebidosTotal, cor: "text-recebido" },
          { rotulo: "Pendentes", valor: totais?.pendentes, cor: "text-pendente" },
          { rotulo: "Despesas", valor: totais?.despesas, cor: "text-negativo" },
        ].map(({ rotulo, valor, cor }) => (
          <div key={rotulo}>
            <dt className="text-[11px] text-cinza-escuro">{rotulo}</dt>
            <dd className={`text-sm font-extrabold ${cor}`}>{moeda(valor)}</dd>
          </div>
        ))}
      </dl>
      {totais && (totais.despesas > 0 || totais.entradas > 0) && (
        <>
          <hr className="border-black/8" />
          {/* Detalhe do saldo: de onde veio a despesa e quanto o corre rendeu sozinho. */}
          <dl className="flex flex-col gap-1 text-[11px]">
            {[
              { rotulo: "Recebidos do corre", valor: totais.recebidos, cor: "text-recebido" },
              { rotulo: "Recebidos pessoais", valor: totais.entradas, cor: "text-recebido" },
              { rotulo: "Despesas do corre", valor: totais.despesasCorre, cor: "text-negativo" },
              { rotulo: "Despesas pessoais", valor: totais.despesasPessoais, cor: "text-negativo" },
              {
                rotulo: "Sobrou só do corre",
                valor: totais.sobrouDoCorre,
                cor: totais.sobrouDoCorre < 0 ? "text-negativo" : "text-positivo",
              },
            ].map(({ rotulo, valor, cor }) => (
              <div key={rotulo} className="flex justify-between gap-2">
                <dt className="text-cinza-escuro">{rotulo}</dt>
                <dd className={`font-bold ${cor}`}>
                  <Valor texto={formatarMoeda(valor)} />
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </section>
  );
}
