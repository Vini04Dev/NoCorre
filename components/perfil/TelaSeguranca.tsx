"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormularioNovaSenha } from "./FormularioNovaSenha";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { useExcluirConta } from "@/hooks/usePerfil";

/** Palavra que a pessoa digita para confirmar: excluir a conta não tem volta. */
const PALAVRA_CONFIRMACAO = "EXCLUIR";

export function TelaSeguranca() {
  const router = useRouter();
  const excluir = useExcluirConta();
  const [senhaTrocada, setSenhaTrocada] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [digitado, setDigitado] = useState("");

  function excluirConta() {
    excluir.mutate(undefined, {
      onSuccess: () => {
        router.replace("/entrar");
        router.refresh();
      },
    });
  }

  return (
    <main className="flex flex-col gap-5 px-5 pt-[calc(env(safe-area-inset-top)+12px)] pb-8">
      <CabecalhoTela titulo="Senha e segurança" voltarPara="/perfil" />

      <section className="flex flex-col gap-3 rounded-[12px] border border-black/8 bg-white p-4 shadow-cartao">
        <h2 className="text-sm font-extrabold">Trocar senha</h2>
        {senhaTrocada && (
          <p role="status" className="rounded-[10px] bg-positivo/12 px-3 py-2 text-xs font-medium text-recebido">
            Senha alterada.
          </p>
        )}
        <FormularioNovaSenha aoConcluir={() => setSenhaTrocada(true)} />
      </section>

      <section className="flex flex-col gap-3 rounded-[12px] border border-negativo/40 bg-white p-4">
        <h2 className="text-sm font-extrabold text-negativo">Excluir conta</h2>
        <p className="text-xs text-cinza-escuro">
          Apaga sua conta e tudo o que está nela: clientes, receitas, despesas, categorias e fotos. Não dá para
          desfazer.
        </p>
        {!confirmando ? (
          <Botao variante="perigo" onClick={() => setConfirmando(true)}>
            Excluir minha conta
          </Botao>
        ) : (
          <div className="flex flex-col gap-2.5">
            <AvisoErro mensagem={excluir.error?.message} />
            <label className="flex flex-col gap-1.5 text-xs font-semibold">
              Para confirmar, digite {PALAVRA_CONFIRMACAO}
              <input
                value={digitado}
                onChange={(e) => setDigitado(e.target.value.toUpperCase())}
                autoCapitalize="characters"
                autoComplete="off"
                className="rounded-[10px] border border-cinza-claro bg-white px-[14px] py-[11px] text-[13px] font-normal outline-none focus:border-negativo"
              />
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <Botao
                variante="contorno"
                onClick={() => {
                  setConfirmando(false);
                  setDigitado("");
                }}
                disabled={excluir.isPending}
              >
                Cancelar
              </Botao>
              <Botao
                variante="perigoCheio"
                onClick={excluirConta}
                disabled={digitado !== PALAVRA_CONFIRMACAO || excluir.isPending}
              >
                {excluir.isPending ? "Excluindo..." : "Excluir"}
              </Botao>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
