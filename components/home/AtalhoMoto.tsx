"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PainelKm } from "@/components/moto/TelaMoto";
import { useComponentes, useQuilometragem } from "@/hooks/useMoto";
import { usePlano } from "@/hooks/usePlano";
import { desgaste, formatarKm } from "@/lib/moto";

/**
 * Atalho da Saúde da moto no Início (Pro): a quilometragem de agora e um botão
 * para atualizar ali mesmo, sem abrir o módulo. Tocar no resto abre o módulo.
 * Quem ainda não configurou vê um convite para começar.
 */
export function AtalhoMoto() {
  const { ehPro } = usePlano();
  const km = useQuilometragem(ehPro);
  const componentes = useComponentes(ehPro);
  const [atualizando, setAtualizando] = useState(false);

  if (!ehPro || km.isPending || componentes.isPending) return null;

  const atual = km.data?.atual;
  const itens = (componentes.data ?? []).filter((c) => c.ativo);
  const caixa = "flex items-center gap-3 rounded-[12px] border border-black/8 bg-white px-3.5 py-2.5 shadow-cartao";

  if (atual == null || itens.length === 0) {
    return (
      <Link href="/moto" className={caixa}>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cinza-fundo">
          <Image src="/icones/moto-linha.svg" alt="" width={20} height={20} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[13px] font-bold">Saúde da moto</span>
          <span className="text-[11px] text-cinza-escuro">Cadastre a quilometragem para acompanhar as trocas</span>
        </span>
        <span aria-hidden className="text-lg text-cinza">
          ›
        </span>
      </Link>
    );
  }

  const trocar = itens.filter((c) => {
    const { situacao } = desgaste(atual, c.km_ultima_troca, c.intervalo_km);
    return situacao === "trocar" || situacao === "vencido";
  }).length;

  return (
    <div className={caixa}>
      <Link href="/moto" className="flex min-w-0 flex-1 items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cinza-fundo">
          <Image src="/icones/moto-linha.svg" alt="" width={20} height={20} />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-[11px] text-cinza-escuro">Saúde da moto</span>
          <span className="text-base leading-tight font-extrabold">{formatarKm(atual)}</span>
          <span className={`text-[11px] ${trocar ? "font-semibold text-negativo" : "text-cinza-escuro"}`}>
            {trocar ? `${trocar} ${trocar > 1 ? "itens precisam" : "item precisa"} de troca` : "Tudo em dia"}
          </span>
        </span>
      </Link>
      <button
        type="button"
        onClick={() => setAtualizando(true)}
        className="shrink-0 rounded-[10px] bg-linear-to-r from-dourado-claro to-dourado px-3 py-2 text-[12px] font-extrabold text-marinho"
      >
        Atualizar km
      </button>
      {atualizando && <PainelKm atual={atual} aoFechar={() => setAtualizando(false)} />}
    </div>
  );
}
