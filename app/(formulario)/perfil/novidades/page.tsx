import type { Metadata } from "next";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { IconeCirculo } from "@/components/ui/IconeCirculo";
import { dataDaNota, NOTAS, VERSAO_ATUAL } from "@/lib/novidades";

export const metadata: Metadata = { title: "Notas de atualização | No Corre!" };

/** Histórico de versões, da mais nova para a mais antiga, em forma de linha do tempo. */
export default function Pagina() {
  return (
    <main className="flex flex-col gap-5 px-5 pt-[calc(env(safe-area-inset-top)+12px)] pb-10">
      <CabecalhoTela titulo="Notas de atualização" voltarPara="/perfil" />

      <section className="relative overflow-hidden rounded-[18px] bg-linear-to-br from-marinho to-[#3d405b] px-5 py-6 text-white">
        <div aria-hidden className="pointer-events-none absolute -top-16 -right-10 size-44 rounded-full bg-dourado/30 blur-3xl" />
        <p className="relative text-[11px] font-semibold tracking-[0.66px] text-dourado-claro">VERSÃO ATUAL</p>
        <p className="relative mt-1 text-4xl font-black">v{VERSAO_ATUAL}</p>
        <p className="relative mt-1 text-xs text-cinza-claro">Histórico de mudanças do No Corre!, versão por versão.</p>
      </section>

      <ol className="relative flex flex-col gap-8 border-l-2 border-dashed border-cinza-claro pl-5">
        {NOTAS.map((nota, indice) => (
          <li key={nota.versao} className="relative flex flex-col gap-3">
            <span
              aria-hidden
              className={`absolute top-1 -left-[29px] size-4 rounded-full ring-4 ring-fundo ${indice === 0 ? "bg-dourado" : "bg-cinza"}`}
            />
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="rounded-md bg-marinho px-2 py-0.5 text-[11px] font-bold text-dourado-claro">v{nota.versao}</span>
              <span className="text-[11px] text-cinza-escuro">{dataDaNota(nota.data)}</span>
            </div>
            <div>
              <h2 className="text-lg font-extrabold">{nota.titulo}</h2>
              <p className="text-xs text-cinza-escuro">{nota.resumo}</p>
            </div>
            <ul className="grid gap-2.5">
              {nota.destaques.map(({ icone, titulo, texto }) => (
                <li key={titulo} className="flex items-start gap-3 rounded-[12px] border border-black/8 bg-white p-3.5 shadow-cartao">
                  <IconeCirculo src={icone} />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold">{titulo}</span>
                    <span className="text-[11px] leading-relaxed text-cinza-escuro">{texto}</span>
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </main>
  );
}
