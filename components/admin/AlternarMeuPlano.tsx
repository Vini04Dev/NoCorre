"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { alternarMeuPlano } from "@/app/(app)/admin/acoes";
import { usePlano } from "@/hooks/usePlano";

/**
 * Atalho do ADM para ver o app como Pro ou como Grátis na própria conta.
 * A troca acontece no servidor (a pessoa não pode mudar o próprio plano).
 */
export function AlternarMeuPlano() {
  const { ehPro, carregando } = usePlano();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [enviando, iniciar] = useTransition();
  const [erro, setErro] = useState<string>();

  function alternar() {
    setErro(undefined);
    iniciar(async () => {
      const resposta = await alternarMeuPlano();
      if (resposta.erro) {
        setErro(resposta.erro);
        return;
      }
      // Perfil no navegador (selo, telas Pro) e o que o servidor monta (módulos do Início).
      await queryClient.invalidateQueries({ queryKey: ["perfil"] });
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2 rounded-[14px] border border-black/8 bg-white px-4 py-3 shadow-cartao">
      <div className="flex items-center justify-between gap-3">
        <span className="flex flex-col">
          <span className="text-[11px] text-cinza-escuro">Minha conta está no plano</span>
          <span className="text-base font-extrabold">{carregando ? "–" : ehPro ? "Pro" : "Grátis"}</span>
        </span>
        <button
          type="button"
          onClick={alternar}
          disabled={carregando || enviando}
          className="shrink-0 rounded-[10px] bg-marinho px-3.5 py-2 text-xs font-bold text-white disabled:opacity-50"
        >
          {enviando ? "Trocando..." : ehPro ? "Passar para Grátis" : "Passar para Pro"}
        </button>
      </div>
      {erro && <p className="text-xs text-negativo">{erro}</p>}
      <p className="text-[11px] text-cinza-escuro">Só muda a sua conta, para testar o app dos dois jeitos.</p>
    </div>
  );
}
