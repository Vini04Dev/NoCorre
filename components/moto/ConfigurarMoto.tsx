"use client";

import { useState } from "react";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { useConfigurarMoto } from "@/hooks/useMoto";
import { COMPONENTES_PADRAO, COR_SITUACAO, type Situacao } from "@/lib/moto";

/**
 * Pontos da régua de cada peça: quanto do intervalo de troca já foi rodado.
 * "Na metade" é o padrão e serve para quem não sabe.
 */
export const ESTADOS_PECA: { rotulo: string; fracao: number; situacao: Situacao }[] = [
  { rotulo: "Troquei há pouco", fracao: 0.05, situacao: "ok" },
  { rotulo: "Na metade", fracao: 0.5, situacao: "ok" },
  { rotulo: "Fique de olho", fracao: 0.8, situacao: "atencao" },
  { rotulo: "Já tá na hora", fracao: 0.95, situacao: "trocar" },
  { rotulo: "Passou da hora", fracao: 1.1, situacao: "vencido" },
];
const PADRAO = 1;

const somenteNumeros = (texto: string) => texto.replace(/\D/g, "").slice(0, 7);

/** Régua de verde a vermelho para dizer como a peça está hoje. */
function ReguaPeca({ nome, valor, aoMudar }: { nome: string; valor: number; aoMudar: (v: number) => void }) {
  const estado = ESTADOS_PECA[valor];
  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-semibold">{nome}</span>
        <span className="font-bold" style={{ color: COR_SITUACAO[estado.situacao] }}>
          {estado.rotulo}
        </span>
      </span>
      <input
        type="range"
        min={0}
        max={ESTADOS_PECA.length - 1}
        step={1}
        value={valor}
        onChange={(e) => aoMudar(Number(e.target.value))}
        aria-valuetext={estado.rotulo}
        className="h-2 w-full cursor-pointer appearance-none rounded-full accent-marinho"
        style={{
          background: `linear-gradient(90deg, ${COR_SITUACAO.ok} 0%, ${COR_SITUACAO.ok} 35%, ${COR_SITUACAO.atencao} 60%, ${COR_SITUACAO.trocar} 80%, ${COR_SITUACAO.vencido} 100%)`,
        }}
      />
    </label>
  );
}

/**
 * Primeira visita à Saúde da moto: o odômetro de agora e, para cada peça, como
 * ela está hoje. Com isso o app já começa sabendo que a relação passou da hora,
 * em vez de achar que tudo acabou de ser trocado. `previa` (Painel do sistema)
 * mostra a tela sem salvar nada.
 */
export function ConfigurarMoto({ previa = false }: { previa?: boolean }) {
  const configurar = useConfigurarMoto();
  const [km, setKm] = useState("");
  const [estados, setEstados] = useState<Record<string, number>>(() =>
    Object.fromEntries(COMPONENTES_PADRAO.map((c) => [c.tipo, PADRAO])),
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!km || previa) return;
        configurar.mutate({
          km: Number(km),
          fracoes: Object.fromEntries(Object.entries(estados).map(([tipo, i]) => [tipo, ESTADOS_PECA[i].fracao])),
        });
      }}
      className="flex flex-col gap-3 rounded-[14px] border border-black/8 bg-white p-4 shadow-cartao"
    >
      <p className="text-sm font-bold">1. Quantos km a moto está marcando agora?</p>
      <p className="-mt-1.5 text-xs text-cinza-escuro">Olhe o odômetro no painel da moto.</p>
      <AvisoErro mensagem={configurar.error?.message} />
      <CampoTexto
        rotulo="Quilometragem atual"
        inputMode="numeric"
        value={km}
        onChange={(e) => setKm(somenteNumeros(e.target.value))}
        placeholder="Ex.: 32500"
      />

      <p className="mt-1 text-sm font-bold">2. Como estão as peças hoje?</p>
      <p className="-mt-1.5 text-xs text-cinza-escuro">
        Arraste cada uma. Não sabe? Deixe em &quot;Na metade&quot;; dá para ajustar depois, peça por peça.
      </p>
      {COMPONENTES_PADRAO.map((c) => (
        <ReguaPeca
          key={c.tipo}
          nome={c.nome}
          valor={estados[c.tipo]}
          aoMudar={(v) => setEstados((atual) => ({ ...atual, [c.tipo]: v }))}
        />
      ))}

      <Botao type="submit" disabled={!km || configurar.isPending || previa}>
        {previa ? "Prévia: nada é salvo" : configurar.isPending ? "Salvando..." : "Começar a acompanhar"}
      </Botao>
    </form>
  );
}
