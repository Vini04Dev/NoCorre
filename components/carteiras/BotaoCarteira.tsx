"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { fundoCarteira, IconeTipoCarteira } from "./CartaoCarteira";
import { SeletorCarteira } from "@/components/home/SeletorCarteira";
import { useSaldosCarteiras } from "@/hooks/useCarteiras";
import { useCarteiraEmFoco } from "@/hooks/useCarteiraEmFoco";
import { usePerfil } from "@/hooks/usePerfil";

/**
 * Botão de carteira (Pro, com duas ou mais): no cabeçalho do Início, entre o
 * olho e o sino, e no topo do Resumo. Com uma carteira escolhida, o botão
 * ganha a cor dela; com várias (não todas), mostra quantas. Assim nunca vira
 * um filtro esquecido.
 */
export function BotaoCarteira({ variante = "cabecalho" }: { variante?: "cabecalho" | "tela" }) {
  const { carteira, ativas, escolhidas, filtro, disponivel, salvar } = useCarteiraEmFoco();
  const { data: perfil } = usePerfil();
  const { data: saldos } = useSaldosCarteiras(disponivel);
  const [aberto, setAberto] = useState(false);
  if (!disponivel) return null;
  const varias = filtro && filtro.length > 1 ? filtro.length : 0;
  const rotulo = carteira?.nome ?? (varias ? `${varias} carteiras` : "Todas");

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
        aria-label={filtro ? `Carteiras: ${escolhidas.map((c) => c.nome).join(", ")}. Trocar` : "Escolher carteiras"}
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
        {variante === "tela" && <span className="max-w-[110px] truncate">{rotulo}</span>}
        {variante === "cabecalho" && varias > 0 && (
          <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-dourado text-[9px] font-bold text-marinho">
            {varias}
          </span>
        )}
      </button>
      {aberto &&
        createPortal(
          <SeletorCarteira
            ativas={ativas}
            saldos={saldos}
            escolhidas={escolhidas.map((c) => c.id)}
            salvando={salvar.isPending}
            erro={salvar.error?.message}
            aoSalvar={(ids) => {
              if (!perfil) return;
              // Todas marcadas = sem filtro (carteira nova também passa a contar).
              salvar.mutate(
                { perfilId: perfil.id, ids: ids.length === ativas.length ? null : ids },
                { onSuccess: () => setAberto(false) },
              );
            }}
            aoFechar={() => setAberto(false)}
          />,
          // Fora do cabeçalho (herdaria o texto branco), dentro da casca onde valem os temas.
          document.querySelector(".casca-app") ?? document.body,
        )}
    </>
  );
}
