"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { fundoCarteira, IconeTipoCarteira } from "./CartaoCarteira";
import { SeletorCarteira } from "@/components/home/SeletorCarteira";
import { useSaldosCarteiras } from "@/hooks/useCarteiras";
import { useCarteiraEmFoco } from "@/hooks/useCarteiraEmFoco";

/**
 * Botão de carteira (Pro, com duas ou mais): no cabeçalho do Início, entre o
 * olho e o sino, e no topo do Resumo. Com uma carteira escolhida, o botão
 * ganha a cor dela, para nunca virar um filtro esquecido.
 */
export function BotaoCarteira({ variante = "cabecalho" }: { variante?: "cabecalho" | "tela" }) {
  const { carteira, ativas, disponivel, escolher } = useCarteiraEmFoco();
  const { data: saldos } = useSaldosCarteiras(disponivel);
  const [aberto, setAberto] = useState(false);
  if (!disponivel) return null;

  const classe =
    variante === "cabecalho"
      ? "relative grid size-10 shrink-0 place-items-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/20"
      : "relative flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-cinza-claro bg-white pr-3 pl-2 text-xs font-semibold";

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-haspopup="dialog"
        aria-label={carteira ? `Carteira: ${carteira.nome}. Trocar` : "Escolher carteira"}
        className={classe}
        style={carteira && variante === "cabecalho" ? { background: fundoCarteira(carteira.cor) } : undefined}
      >
        {variante === "tela" && carteira ? (
          <span className="grid size-6 place-items-center rounded-full text-white" style={{ background: fundoCarteira(carteira.cor) }}>
            <IconeTipoCarteira tipo={carteira.tipo} tamanho={14} />
          </span>
        ) : (
          <IconeTipoCarteira tipo={carteira?.tipo ?? null} tamanho={variante === "cabecalho" ? 20 : 16} />
        )}
        {variante === "tela" && <span className="max-w-[110px] truncate">{carteira?.nome ?? "Todas"}</span>}
      </button>
      {aberto &&
        createPortal(
          <SeletorCarteira
            ativas={ativas}
            saldos={saldos}
            valor={carteira?.id ?? null}
            aoEscolher={escolher}
            aoFechar={() => setAberto(false)}
          />,
          // Fora do cabeçalho (herdaria o texto branco), dentro da casca onde valem os temas.
          document.querySelector(".casca-app") ?? document.body,
        )}
    </>
  );
}
