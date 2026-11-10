"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Botao } from "@/components/ui/Botao";
import { IconeCirculo } from "@/components/ui/IconeCirculo";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { useAvisoForcado } from "@/hooks/useAvisoForcado";
import { useNovidadesPendentes } from "@/hooks/useNovidades";
import { NOTAS } from "@/lib/novidades";

/**
 * Aviso padrão de atualização: abre sozinho ao entrar no app quando há uma
 * nota que a pessoa ainda não viu neste aparelho (mesmo com a sessão aberta
 * desde antes da atualização). Só fecha depois que ela marca que leu e está
 * ciente e toca em Entendi; tocar fora ou apertar Esc não dispensa.
 */
export function AvisoNovidades() {
  const [pendentes, marcarVistas] = useNovidadesPendentes();
  const [forcado, limparForcado] = useAvisoForcado("novidades");
  const [ciente, setCiente] = useState(false);
  const idCiente = useId();
  if (!pendentes && !forcado) return null;

  const nota = NOTAS[0];

  function confirmar() {
    if (!ciente) return;
    marcarVistas();
    limparForcado();
    setCiente(false);
  }

  return (
    // Aberto à mão (?aviso=novidades, para conferir) pode fechar tocando fora; o de verdade, não.
    <PainelInferior idTitulo="novidades-titulo" aoFechar={forcado ? limparForcado : () => {}}>
      <div className="flex flex-col gap-1">
        <span className="w-fit rounded-full bg-dourado-claro px-2.5 py-0.5 text-[10px] font-bold tracking-[0.6px]">
          ATUALIZAÇÃO · v{nota.versao}
        </span>
        <h2 id="novidades-titulo" className="text-xl font-extrabold">
          {nota.titulo}
        </h2>
        <p className="text-xs text-cinza-escuro">{nota.resumo}</p>
      </div>
      <ul className="flex max-h-[42dvh] flex-col gap-2.5 overflow-y-auto">
        {nota.destaques.slice(0, 4).map(({ icone, titulo, texto }) => (
          <li key={titulo} className="flex items-start gap-3 rounded-[12px] bg-cinza-fundo p-3">
            <IconeCirculo src={icone} tamanho="sm" />
            <span className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold">{titulo}</span>
              <span className="text-[11px] text-cinza-escuro">{texto}</span>
            </span>
          </li>
        ))}
      </ul>
      <Link href="/perfil/novidades" className="text-center text-xs font-bold text-dourado">
        Ver as notas completas
      </Link>
      <label
        htmlFor={idCiente}
        className={`flex cursor-pointer items-start gap-2.5 rounded-[12px] border p-3 text-xs transition-colors ${
          ciente ? "border-dourado bg-dourado-claro/20" : "border-cinza-claro"
        }`}
      >
        <input
          id={idCiente}
          type="checkbox"
          checked={ciente}
          onChange={(evento) => setCiente(evento.target.checked)}
          className="mt-px size-4 shrink-0 accent-marinho"
        />
        <span>Li as novidades desta atualização e estou ciente das mudanças.</span>
      </label>
      <Botao onClick={confirmar} disabled={!ciente}>
        Entendi
      </Botao>
    </PainelInferior>
  );
}
