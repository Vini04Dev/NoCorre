import Link from "next/link";
import { Comparacao } from "./Comparacao";
import { Valor } from "@/components/ui/Valor";
import { formatarMoeda } from "@/lib/formatar";
import type { Fonte } from "@/lib/renda";

/**
 * Cores das fontes de renda: o corre sempre em marinho; as outras em dourados
 * e cinza, na ordem do maior para o menor. A cor nunca é a única pista: cada
 * fonte tem nome, valor e porcentagem na lista.
 */
const COR_CORRE = "#2b2d42";
const CORES_OUTRAS = ["#b07d12", "#ffd36a", "#8a909c", "#e0a92e", "#c9ccd3"];

export type Dinheiro = { entrou: number; saiu: number; sobrou: number };

/**
 * "Seu dinheiro": o que entrou (do corre e de fora dele), o que saiu e o que
 * sobrou no período, com os mesmos números do Início. Embaixo, de onde veio a
 * renda: o corre e cada outra entrada (salário, bolsa, benefício...).
 */
export function ResumoDinheiro({
  nomePeriodo,
  comparado,
  atual,
  anterior,
  fontes,
}: {
  nomePeriodo: string;
  comparado: string;
  atual: Dinheiro;
  anterior: Dinheiro;
  fontes: Fonte[];
}) {
  let outra = 0;
  const comCor = fontes.map((f) => ({ ...f, cor: f.doCorre ? COR_CORRE : CORES_OUTRAS[outra++ % CORES_OUTRAS.length] }));
  const temOutras = fontes.some((f) => !f.doCorre);

  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">SEU DINHEIRO {nomePeriodo.toUpperCase()}</h2>
      <div className="flex flex-col gap-3 rounded-[14px] border border-black/8 bg-white px-4 py-3.5 shadow-cartao">
        <dl className="grid grid-cols-3 gap-2">
          {[
            { rotulo: "Entrou", valor: atual.entrou, antes: anterior.entrou, cor: "text-recebido", menosEhBom: false },
            { rotulo: "Saiu", valor: atual.saiu, antes: anterior.saiu, cor: "text-negativo", menosEhBom: true },
            {
              rotulo: "Sobrou",
              valor: atual.sobrou,
              antes: anterior.sobrou,
              cor: atual.sobrou < 0 ? "text-negativo" : "text-positivo",
              menosEhBom: false,
            },
          ].map(({ rotulo, valor, antes, cor, menosEhBom }) => (
            <div key={rotulo} className="flex min-w-0 flex-col gap-0.5">
              <dt className="text-[11px] text-cinza-escuro">{rotulo}</dt>
              <dd className={`truncate text-base font-extrabold lg:text-lg ${cor}`}>
                <Valor texto={formatarMoeda(valor)} />
              </dd>
              <dd className="leading-tight">
                <Comparacao atual={valor} antes={antes} comparado={comparado} menosEhBom={menosEhBom} />
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-2 border-t border-cinza-claro pt-3">
          <h3 className="text-xs font-bold">De onde veio</h3>
          {fontes.length === 0 ? (
            <p className="text-xs text-cinza-escuro">Nenhuma renda no período.</p>
          ) : (
            <>
              {/* Barra única dividida pelas fontes: o tamanho de cada parte é a fatia da renda. */}
              <div className="flex h-2.5 gap-[2px] overflow-hidden rounded-full" aria-hidden>
                {comCor.map((f) => (
                  <span key={f.nome} className="h-full" style={{ width: `${Math.max(f.percentual, 1)}%`, background: f.cor }} />
                ))}
              </div>
              <ul className="flex flex-col gap-1.5">
                {comCor.map((f) => (
                  <li key={f.nome} className="flex items-center gap-2 text-xs">
                    <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: f.cor }} />
                    <span className="flex-1 truncate">
                      {f.nome}
                      {f.doCorre && <span className="hidden text-cinza-escuro sm:inline"> (entregas, corridas, fixo)</span>}
                    </span>
                    <span className="text-cinza-escuro">{f.percentual}%</span>
                    <b className="min-w-[84px] text-right">
                      <Valor texto={formatarMoeda(f.valor)} />
                    </b>
                  </li>
                ))}
              </ul>
            </>
          )}
          {!temOutras && (
            <p className="text-[11px] text-cinza-escuro">
              Tem salário, bolsa ou outra renda? Lance em{" "}
              <Link href="/novo/entrada" className="font-semibold text-dourado">
                Outra entrada
              </Link>{" "}
              para ver aqui quanto vem de fora do corre.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
