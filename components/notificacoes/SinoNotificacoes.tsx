"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ICONES, Icone, PainelNotificacoes } from "./PainelNotificacoes";
import { useAvisoForcado } from "@/hooks/useAvisoForcado";
import {
  abrirNotificacoes,
  useNotificacoes,
  useNotificacoesAbertas,
} from "@/hooks/useNotificacoes";

/**
 * Sininho do cabeçalho do Início. O número conta só o que pede ação e some
 * sozinho quando o motivo some; tocar abre a lista.
 */
export function SinoNotificacoes() {
  const itens = useNotificacoes();
  const aberto = useNotificacoesAbertas();
  const [forcado, limpar] = useAvisoForcado("vencimento");

  // Prévia do Painel do sistema: já abre a lista com o exemplo.
  useEffect(() => {
    if (forcado) abrirNotificacoes(true);
  }, [forcado]);

  const total = itens.length;
  return (
    <>
      <button
        type="button"
        onClick={() => abrirNotificacoes(true)}
        aria-label={
          total
            ? `Notificações: ${total} ${total > 1 ? "pedem" : "pede"} atenção`
            : "Notificações"
        }
        className="relative grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-white"
      >
        <Icone d={ICONES.sino} tamanho={20} />
        {total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-negativo px-1 text-[10px] font-bold text-white ring-2 ring-marinho">
            {total > 9 ? "9+" : total}
          </span>
        )}
      </button>
      {/* Fora do cabeçalho (herdaria o texto branco dele), mas dentro da casca, onde valem os temas. */}
      {aberto &&
        createPortal(
          <PainelNotificacoes
            itens={itens}
            aoFechar={() => {
              abrirNotificacoes(false);
              limpar();
            }}
          />,
          document.querySelector(".casca-app") ?? document.body,
        )}
    </>
  );
}
