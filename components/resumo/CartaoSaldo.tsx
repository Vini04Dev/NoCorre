import type { calcularTotais } from "@/lib/totais";
import { ForaDoCorre } from "@/components/ui/ForaDoCorre";
import { Valor } from "@/components/ui/Valor";
import { formatarMoeda } from "@/lib/formatar";

type Props = {
  /** "da semana", "do mês"... */
  nomePeriodo: string;
  totais: ReturnType<typeof calcularTotais> | null;
  /** Soma das entradas fora do corre no período. */
  entradas?: number;
  /** Carteira em foco: mostra o saldo dela agora e o que entrou e saiu por ela. */
  carteira?: { nome: string; saldo?: number; entrou: number; saiu: number; pendentes: number };
};

/** Saldo do período em destaque e, abaixo, recebidos, pendentes e despesas. */
export function CartaoSaldo({ nomePeriodo, totais, entradas = 0, carteira }: Props) {
  const moeda = (valor: number | undefined) => (!totais ? "–" : <Valor texto={formatarMoeda(valor ?? 0)} />);

  if (carteira) {
    return (
      <section className="flex flex-col gap-3 rounded-[10px] border border-black/8 bg-white px-4 py-3.5 shadow-cartao">
        <div>
          <h2 className="text-[11px] font-semibold text-cinza-escuro uppercase">{carteira.nome} · saldo agora</h2>
          <p className={`text-[26px] font-extrabold ${(carteira.saldo ?? 0) < 0 ? "text-negativo" : "text-positivo"}`}>
            {carteira.saldo === undefined ? "–" : <Valor texto={formatarMoeda(carteira.saldo)} />}
          </p>
        </div>
        <hr className="border-black/8" />
        <dl className="grid grid-cols-3 gap-2">
          {[
            { rotulo: `Entrou ${nomePeriodo}`, valor: carteira.entrou, cor: "text-recebido" },
            { rotulo: "Saiu", valor: carteira.saiu, cor: "text-negativo" },
            { rotulo: "Pendentes", valor: carteira.pendentes, cor: "text-pendente" },
          ].map(({ rotulo, valor, cor }) => (
            <div key={rotulo}>
              <dt className="text-[11px] text-cinza-escuro">{rotulo}</dt>
              <dd className={`text-sm font-extrabold ${cor}`}>
                <Valor texto={formatarMoeda(valor)} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-[11px] leading-snug text-cinza-escuro">
          Só o que passou por {carteira.nome}. Transferências entre carteiras aparecem na tela Carteiras.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3 rounded-[10px] border border-black/8 bg-white px-4 py-3.5 shadow-cartao">
      <div>
        <h2 className="text-[11px] font-semibold text-cinza-escuro uppercase">Saldo do corre {nomePeriodo}</h2>
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
      {totais && <ForaDoCorre pessoais={totais.pessoais} entradas={entradas} />}
    </section>
  );
}
