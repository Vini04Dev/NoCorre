"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CarrosselMoto } from "./CarrosselMoto";
import { EmBreve } from "./EmBreveMoto";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { useConfigurarMoto } from "@/hooks/useMoto";
import { COMPONENTES_PADRAO, ehCg160, formatarKm } from "@/lib/moto";

/**
 * Pontos da régua de cada peça: quanto do intervalo de troca já foi rodado.
 * "Na metade" é o padrão e serve para quem não sabe. `cor` é a variável do
 * tema (fica suave e legível no claro e no escuro).
 */
export const ESTADOS_PECA = [
  { rotulo: "Troquei há pouco", fracao: 0.05, cor: "var(--color-positivo)" },
  { rotulo: "Na metade", fracao: 0.5, cor: "var(--color-positivo)" },
  { rotulo: "Fique de olho", fracao: 0.8, cor: "var(--color-pendente)" },
  { rotulo: "Já tá na hora", fracao: 0.95, cor: "var(--color-pendente)" },
  { rotulo: "Passou da hora", fracao: 1.1, cor: "var(--color-negativo)" },
];
const PADRAO = 1;
const TOTAL_PASSOS = 1 + COMPONENTES_PADRAO.length;

const somenteNumeros = (texto: string) => texto.replace(/\D/g, "").slice(0, 7);
const suave = (cor: string) => `color-mix(in srgb, ${cor} 45%, var(--t-superficie, #ffffff))`;

/** Fundo do popup: o esquema da tela de verdade, ainda sem dados. */
function EsquemaMoto({ veiculo }: { veiculo: string | null | undefined }) {
  return (
    <div aria-hidden className="flex flex-col gap-4">
      <section className="flex flex-col items-center gap-2 rounded-[14px] border border-black/8 bg-white px-4 pt-4 pb-3 shadow-cartao">
        <div className="flex w-full items-start justify-between">
          <span className="text-sm font-bold">{veiculo ?? "Sua moto"}</span>
          <span className="flex flex-col items-end">
            <span className="text-[11px] text-cinza-escuro">Odômetro</span>
            <span className="text-lg font-extrabold">– km</span>
          </span>
        </div>
        {ehCg160(veiculo) ? <CarrosselMoto partes={{}} descricao="Moto" /> : <EmBreve modelo={veiculo} />}
      </section>
      <ul className="flex flex-col gap-2">
        {COMPONENTES_PADRAO.map((c) => (
          <li key={c.tipo} className="flex flex-col gap-1.5 rounded-[12px] border border-black/8 bg-white px-3.5 py-3 shadow-cartao">
            <span className="text-[13px] font-semibold">{c.nome}</span>
            <span className="h-2 rounded-full bg-cinza-fundo" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Primeira visita à Saúde da moto: popup (como o "O Pro chegou!") que pergunta
 * uma coisa por vez, o odômetro e depois cada peça, com a tela de verdade ao
 * fundo. Com isso o app já começa sabendo, por exemplo, que a relação passou
 * da hora, em vez de achar que tudo acabou de ser trocado. `previa` (Painel do
 * sistema) percorre os passos sem salvar nada.
 */
export function PrimeiraVisitaMoto({ veiculo, previa = false }: { veiculo: string | null | undefined; previa?: boolean }) {
  const router = useRouter();
  const configurar = useConfigurarMoto();
  const [passo, setPasso] = useState(0);
  const [km, setKm] = useState("");
  const [estados, setEstados] = useState<Record<string, number>>(() =>
    Object.fromEntries(COMPONENTES_PADRAO.map((c) => [c.tipo, PADRAO])),
  );
  const sair = () => router.push(previa ? "/admin" : "/");
  const peca = passo > 0 ? COMPONENTES_PADRAO[passo - 1] : null;
  const ultimo = passo === TOTAL_PASSOS - 1;

  function avancar() {
    if (!ultimo) return setPasso(passo + 1);
    if (previa) return sair();
    configurar.mutate({
      km: Number(km),
      fracoes: Object.fromEntries(Object.entries(estados).map(([tipo, i]) => [tipo, ESTADOS_PECA[i].fracao])),
    });
  }

  const estado = peca ? ESTADOS_PECA[estados[peca.tipo]] : null;

  return (
    <>
      <EsquemaMoto veiculo={veiculo} />
      <PainelInferior idTitulo="moto-titulo" aoFechar={sair} centralizado>
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-marinho text-dourado-claro">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="5.5" cy="16.5" r="3.5" />
              <circle cx="18.5" cy="16.5" r="3.5" />
              <path d="M5.5 16.5 9 10h5l2.5 6.5M14 10l1.5-3H18M9 10 7.5 7H5" />
            </svg>
          </span>
          <span className="rounded-md bg-marinho px-2 py-0.5 text-[10px] font-bold tracking-[0.6px] text-dourado-claro">
            SAÚDE DA MOTO{previa ? " · PRÉVIA" : ""}
          </span>
          <span className="flex gap-1.5" aria-label={`Passo ${passo + 1} de ${TOTAL_PASSOS}`}>
            {Array.from({ length: TOTAL_PASSOS }, (_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === passo ? "w-5 bg-marinho" : i < passo ? "w-1.5 bg-marinho/50" : "w-1.5 bg-cinza-claro"}`} />
            ))}
          </span>
          <h2 id="moto-titulo" className="text-lg font-extrabold">
            {peca ? peca.nome : "Quantos km a moto está marcando?"}
          </h2>
          <p className="text-xs text-cinza-escuro">
            {peca
              ? `Troca a cada ${formatarKm(peca.intervalo_km)}. Como ela está hoje? Não sabe? Deixe em "Na metade".`
              : "Olhe o odômetro no painel da moto. É dele que o app conta quando trocar cada peça."}
          </p>
        </div>

        <AvisoErro mensagem={configurar.error?.message} />

        {peca && estado ? (
          <div className="flex flex-col gap-3 rounded-[12px] bg-cinza-fundo px-4 py-4">
            <p className="text-center text-base font-extrabold" style={{ color: `color-mix(in srgb, ${estado.cor} 85%, currentColor)` }}>
              {estado.rotulo}
            </p>
            <input
              type="range"
              min={0}
              max={ESTADOS_PECA.length - 1}
              step={1}
              value={estados[peca.tipo]}
              onChange={(e) => setEstados((atual) => ({ ...atual, [peca.tipo]: Number(e.target.value) }))}
              aria-label={`Estado de ${peca.nome}`}
              aria-valuetext={estado.rotulo}
              className="h-2 w-full cursor-pointer appearance-none rounded-full accent-marinho"
              style={{
                background: `linear-gradient(90deg, ${suave("var(--color-positivo)")} 0%, ${suave("var(--color-positivo)")} 35%, ${suave(
                  "var(--color-pendente)",
                )} 65%, ${suave("var(--color-negativo)")} 100%)`,
              }}
            />
            <span className="flex justify-between text-[10px] text-cinza-escuro">
              <span>Troquei há pouco</span>
              <span>Passou da hora</span>
            </span>
          </div>
        ) : (
          <CampoTexto
            rotulo="Quilometragem atual"
            inputMode="numeric"
            value={km}
            onChange={(e) => setKm(somenteNumeros(e.target.value))}
            placeholder="Ex.: 32500"
            autoFocus
          />
        )}

        <div className={`grid gap-2.5 ${passo > 0 ? "grid-cols-2" : "grid-cols-1"}`}>
          {passo > 0 && (
            <Botao variante="contorno" onClick={() => setPasso(passo - 1)}>
              Voltar
            </Botao>
          )}
          <Botao onClick={avancar} disabled={(!km && !previa) || configurar.isPending}>
            {configurar.isPending ? "Salvando..." : ultimo ? (previa ? "Fechar prévia" : "Concluir") : passo === 0 ? "Continuar" : "Confirmar"}
          </Botao>
        </div>
        <button type="button" onClick={sair} className="text-center text-xs font-semibold text-cinza-escuro">
          Agora não
        </button>
      </PainelInferior>
    </>
  );
}
