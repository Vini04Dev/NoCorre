import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CarrosselMoto } from "@/components/moto/CarrosselMoto";
import { PrimeiraVisitaMoto } from "@/components/moto/ConfigurarMoto";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { ehAdmin } from "@/lib/admin-servidor";
import { COR_SITUACAO, fotosDaMoto, ROTULO_SITUACAO, type Situacao } from "@/lib/moto";

export const metadata: Metadata = { title: "Prévia: Saúde da moto | No Corre!" };

/** Modelos para conferir na prévia, inclusive os ainda não liberados. */
const MODELOS = {
  fan160: "Honda CG 160 Fan",
  titan150: "Honda CG Titan 150 2006",
} as const;
type Modelo = keyof typeof MODELOS;

/**
 * Prévia da Saúde da moto, aberta pelo Painel do sistema, sem salvar nada. Só
 * para o ADM. `?modelo=` escolhe a moto (inclusive modelo ainda não liberado
 * para quem usa) e `?tela=primeira` abre a primeira visita (odômetro e estado
 * das peças); sem ele, mostra a moto com um mapa de calor de exemplo.
 */
export default async function PreviaMoto({ searchParams }: { searchParams: Promise<{ modelo?: string; tela?: string }> }) {
  if (!(await ehAdmin())) notFound();
  const parametros = await searchParams;
  const modelo: Modelo = parametros.modelo === "titan150" ? "titan150" : "fan160";
  const veiculo = MODELOS[modelo];
  const pasta = fotosDaMoto(veiculo, true);

  return (
    <main className="flex flex-col gap-4 px-[17px] pt-[calc(env(safe-area-inset-top)+12px)] pb-6 lg:max-w-3xl lg:px-0 lg:pt-2">
      <CabecalhoTela titulo="Saúde da moto" voltarPara="/admin" tituloGrande />
      {parametros.tela === "primeira" ? (
        <PrimeiraVisitaMoto veiculo={veiculo} previa />
      ) : (
        <>
          <nav aria-label="Modelo" className="flex gap-2">
            {(Object.keys(MODELOS) as Modelo[]).map((m) => (
              <Link
                key={m}
                href={`/admin/previa/moto?modelo=${m}`}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${m === modelo ? "bg-marinho text-white" : "border border-cinza-claro"}`}
              >
                {MODELOS[m]}
              </Link>
            ))}
          </nav>
          <section className="flex flex-col items-center gap-2 rounded-[14px] border border-black/8 bg-white px-4 pt-4 pb-3 shadow-cartao">
            <div className="flex w-full items-start justify-between">
              <span className="flex flex-col">
                <span className="text-sm font-bold">{veiculo}</span>
                <span className="text-[11px] text-cinza-escuro">Exemplo: relação e pneu de trás na hora de trocar</span>
              </span>
              <span className="flex flex-col items-end">
                <span className="text-[11px] text-cinza-escuro">Odômetro</span>
                <span className="text-lg font-extrabold">48.320 km</span>
              </span>
            </div>
            {pasta && (
              <CarrosselMoto
                pasta={pasta}
                descricao={`Prévia da ${veiculo}`}
                partes={{
                  motor: { situacao: "atencao", fracao: 0.75 },
                  corrente: { situacao: "vencido", fracao: 1.1 },
                  roda_traseira: { situacao: "trocar", fracao: 0.95 },
                  roda_dianteira: { situacao: "ok", fracao: 0.4 },
                  freios: { situacao: "ok", fracao: 0.3 },
                }}
              />
            )}
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-cinza-escuro">
              {(Object.keys(COR_SITUACAO) as Situacao[]).map((s) => (
                <span key={s} className="flex items-center gap-1">
                  <span className="size-2.5 rounded-full" style={{ background: COR_SITUACAO[s] }} />
                  {ROTULO_SITUACAO[s]}
                </span>
              ))}
            </div>
          </section>
          <Link
            href={`/admin/previa/moto?modelo=${modelo}&tela=primeira`}
            className="rounded-[10px] border border-cinza-claro px-3 py-2.5 text-center text-[13px] font-semibold"
          >
            Ver a primeira visita com esta moto
          </Link>
        </>
      )}
    </main>
  );
}
