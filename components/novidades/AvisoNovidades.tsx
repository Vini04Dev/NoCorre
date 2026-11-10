"use client";

import Link from "next/link";
import { Botao } from "@/components/ui/Botao";
import { IconeCirculo } from "@/components/ui/IconeCirculo";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { useAvisoForcado } from "@/hooks/useAvisoForcado";
import { useNovidadesPendentes } from "@/hooks/useNovidades";
import { NOTAS } from "@/lib/novidades";

/**
 * Aviso padrão de atualização: abre sozinho ao entrar no app quando há uma
 * nota que a pessoa ainda não viu neste aparelho (mesmo com a sessão aberta
 * desde antes da atualização). Mostra os destaques e leva às notas completas.
 */
export function AvisoNovidades() {
  const [pendentes, marcarVistas] = useNovidadesPendentes();
  const [forcado, limparForcado] = useAvisoForcado("novidades");
  if (!pendentes && !forcado) return null;

  function marcarComoVistas() {
    marcarVistas();
    limparForcado();
  }
  const nota = NOTAS[0];

  return (
    <PainelInferior idTitulo="novidades-titulo" aoFechar={marcarComoVistas}>
      <div className="flex flex-col gap-1">
        <span className="w-fit rounded-full bg-dourado-claro px-2.5 py-0.5 text-[10px] font-bold tracking-[0.6px]">
          ATUALIZAÇÃO · v{nota.versao}
        </span>
        <h2 id="novidades-titulo" className="text-xl font-extrabold">
          {nota.titulo}
        </h2>
        <p className="text-xs text-cinza-escuro">{nota.resumo}</p>
      </div>
      <ul className="flex max-h-[45dvh] flex-col gap-2.5 overflow-y-auto">
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
      <Botao onClick={marcarComoVistas}>Entendi</Botao>
      <Link
        href="/perfil/novidades"
        onClick={marcarComoVistas}
        className="text-center text-xs font-bold text-dourado"
      >
        Ver todas as notas de atualização
      </Link>
    </PainelInferior>
  );
}
