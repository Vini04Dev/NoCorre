"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroAuth } from "@/lib/supabase/erros-auth";

/**
 * Intervalo entre tentativas. O Supabase limita logins por IP; 15 s fica bem
 * abaixo do limite e ainda parece imediato para quem volta do email.
 */
const INTERVALO_MS = 15_000;

type Props = {
  email: string;
  senha: string;
  /** Prévia do Painel do sistema: só mostra a tela, sem tentar entrar nem reenviar. */
  previa?: boolean;
};

/**
 * Depois do cadastro, fica tentando entrar com o email e a senha recém-criados.
 * Enquanto o email não é confirmado, o Supabase responde "email_not_confirmed";
 * quando a pessoa clica no link (mesmo no celular), a próxima tentativa entra e
 * leva direto para a Home. Também tenta na hora em que a aba volta a ficar visível.
 */
export function AguardandoConfirmacao({ email, senha, previa = false }: Props) {
  const router = useRouter();
  const [erro, setErro] = useState<string>();
  const [reenvio, setReenvio] = useState<"pronto" | "enviando" | "enviado">("pronto");

  useEffect(() => {
    if (previa) return;
    const supabase = criarClienteNavegador();
    let parado = false;

    async function tentarEntrar() {
      if (parado || document.visibilityState !== "visible") return;
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (parado) return;
      if (!error) {
        parado = true;
        router.replace("/");
        router.refresh();
      } else if (error.code !== "email_not_confirmed") {
        // Outro erro (ex.: a conta já existia com outra senha): parar e avisar.
        parado = true;
        setErro(traduzirErroAuth(error));
      }
    }

    const intervalo = window.setInterval(tentarEntrar, INTERVALO_MS);
    document.addEventListener("visibilitychange", tentarEntrar);
    return () => {
      parado = true;
      window.clearInterval(intervalo);
      document.removeEventListener("visibilitychange", tentarEntrar);
    };
  }, [email, senha, router, previa]);

  async function reenviar() {
    if (previa) return;
    setReenvio("enviando");
    const { error } = await criarClienteNavegador().auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirmar` },
    });
    if (error) setErro(traduzirErroAuth(error));
    setReenvio(error ? "pronto" : "enviado");
  }

  return (
    <div role="status" className="flex flex-col items-center gap-3 rounded-[10px] bg-white p-5 text-center">
      <span aria-hidden className="size-6 animate-spin rounded-full border-[3px] border-cinza-claro border-t-dourado" />
      <p className="text-sm font-semibold">Confirme seu email</p>
      <p className="text-xs text-cinza-escuro">
        Enviamos um link para <strong className="text-marinho">{email}</strong>. Assim que você clicar nele, mesmo
        pelo celular, esta tela entra sozinha no app.
      </p>
      {erro && <p className="text-xs font-medium text-negativo">{erro}</p>}
      <button
        type="button"
        onClick={reenviar}
        disabled={reenvio !== "pronto"}
        className="text-xs font-semibold text-dourado disabled:text-cinza-escuro"
      >
        {reenvio === "enviado" ? "Email reenviado" : reenvio === "enviando" ? "Reenviando..." : "Não chegou? Reenviar email"}
      </button>
    </div>
  );
}
