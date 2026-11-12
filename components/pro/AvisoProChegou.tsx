"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Botao } from "@/components/ui/Botao";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { useAvisoForcado } from "@/hooks/useAvisoForcado";
import { useNovidadesPendentes } from "@/hooks/useNovidades";
import { usePlano } from "@/hooks/usePlano";
import { RECURSOS_PRO } from "@/lib/pro";

const CHAVE_VISTO = "nocorre:pro-boas-vindas";

const ouvintes = new Set<() => void>();

function jaViu() {
  try {
    return localStorage.getItem(CHAVE_VISTO) === "1";
  } catch {
    return true;
  }
}

function marcarVisto() {
  try {
    localStorage.setItem(CHAVE_VISTO, "1");
  } catch {
    // Sem armazenamento: o aviso volta na próxima abertura, sem prejuízo.
  }
  ouvintes.forEach((ouvinte) => ouvinte());
}

function inscrever(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

/**
 * "O Pro chegou!": abre uma vez no Início quando a conta vira Pro, com o que
 * foi liberado. Espera o aviso de novidades, se houver. Fecha tocando fora,
 * em Esc ou em Entendi; depois disso não volta neste aparelho.
 */
export function AvisoProChegou() {
  const { ehPro } = usePlano();
  const [novidadesPendentes] = useNovidadesPendentes();
  const [forcado, limparForcado] = useAvisoForcado("pro");
  // No servidor (e na hidratação) conta como visto: o aviso só entra depois, sem divergir do HTML.
  const visto = useSyncExternalStore(inscrever, jaViu, () => true);

  const normal = ehPro && !visto && !novidadesPendentes;
  if (!normal && !forcado) return null;

  function fechar() {
    limparForcado();
    if (!forcado) marcarVisto();
  }

  return (
    <PainelInferior idTitulo="pro-chegou-titulo" aoFechar={fechar} centralizado>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-marinho">
          <Image src="/icones/pro-dourado.svg" alt="" width={34} height={34} />
        </span>
        <span className="rounded-md bg-marinho px-2 py-0.5 text-[10px] font-bold tracking-[0.6px] text-dourado-claro">
          NO CORRE! PRO
        </span>
        <h2 id="pro-chegou-titulo" className="text-xl font-extrabold">
          O Pro chegou!
        </h2>
        <p className="text-xs text-cinza-escuro">Sua conta agora é Pro. Estes recursos já estão liberados:</p>
      </div>
      <ul className="flex flex-col gap-2">
        {RECURSOS_PRO.map(({ chave, icone, titulo, texto }) => (
          <li key={chave} className="flex items-start gap-3 rounded-[12px] bg-cinza-fundo p-3">
            <Image src={icone} alt="" width={22} height={22} className="mt-0.5 shrink-0" />
            <span className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold">{titulo}</span>
              <span className="text-[11px] text-cinza-escuro">{texto}</span>
            </span>
          </li>
        ))}
      </ul>
      <Botao onClick={fechar}>Entendi</Botao>
      <Link href="/pro" onClick={fechar} className="text-center text-xs font-bold text-dourado">
        Ver tudo do plano Pro
      </Link>
    </PainelInferior>
  );
}
