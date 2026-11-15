"use client";

import Image from "next/image";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { usePerfil } from "@/hooks/usePerfil";
import { linkPedirPro, RECURSOS_PRO } from "@/lib/pro";
import { BotaoPedirPro } from "./BotaoPedirPro";

/**
 * Convite do Pro para quem está no plano grátis. Abre logo depois de a pessoa
 * confirmar a nota de atualização (uma vez por versão) e leva ao WhatsApp para
 * pedir acesso. Fecha tocando fora, em Esc ou em "Agora não".
 */
export function ConvitePro({ aoFechar, previa = false }: { aoFechar: () => void; previa?: boolean }) {
  const { data: perfil } = usePerfil();
  return (
    <PainelInferior idTitulo="convite-pro-titulo" aoFechar={aoFechar} centralizado>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-marinho">
          <Image src="/icones/pro-dourado.svg" alt="" width={34} height={34} />
        </span>
        <span className="rounded-md bg-marinho px-2 py-0.5 text-[10px] font-bold tracking-[0.6px] text-dourado-claro">
          NO CORRE! PRO{previa ? " · PRÉVIA" : ""}
        </span>
        <h2 id="convite-pro-titulo" className="text-xl font-extrabold">
          Conheça o Pro
        </h2>
        <p className="text-xs text-cinza-escuro">
          O essencial continua grátis. O Pro soma recursos para quem quer mais controle:
        </p>
      </div>
      <ul className="flex max-h-[38dvh] flex-col gap-2 overflow-y-auto">
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
      <p className="text-center text-[11px] text-cinza-escuro">
        O Pro está em fase de testes e ainda não há assinatura. Peça acesso pelo WhatsApp.
      </p>
      <BotaoPedirPro href={linkPedirPro(perfil?.email)} aoClicar={aoFechar} />
      <button type="button" onClick={aoFechar} className="text-center text-xs font-semibold text-cinza-escuro">
        Agora não
      </button>
    </PainelInferior>
  );
}
