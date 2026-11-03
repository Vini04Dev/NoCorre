"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CampoAcesso } from "./CampoAcesso";
import { recuperarSenha, type EstadoRecuperacao } from "@/app/(auth)/acoes";
import { Botao } from "@/components/ui/Botao";

/** Pede o email e manda o link para criar uma senha nova. */
export function FormularioRecuperacao() {
  const [estado, acao, enviando] = useActionState<EstadoRecuperacao, FormData>(recuperarSenha, {});

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-extrabold">Esqueci minha senha</h2>
      {estado.enviado ? (
        <p role="status" className="rounded-[10px] bg-white p-4 text-sm">
          Se existir uma conta com <strong>{estado.email}</strong>, enviamos um link para criar uma senha nova.
          Abra o email neste mesmo aparelho.
        </p>
      ) : (
        <form action={acao} className="flex flex-col gap-3">
          <p className="text-xs text-cinza-escuro">Informe o email da sua conta. Enviaremos um link para criar uma senha nova.</p>
          <CampoAcesso
            rotulo="Email"
            icone="/icones/email.svg"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="entregador@nocorre.com"
            defaultValue={estado.email}
          />
          {estado.erro && (
            <p role="alert" className="text-xs font-medium text-negativo">
              {estado.erro}
            </p>
          )}
          <Botao type="submit" grande disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar link"}
          </Botao>
        </form>
      )}
      <Link href="/entrar" className="mt-4 text-center text-sm font-black text-dourado">
        Voltar para o login
      </Link>
    </div>
  );
}
