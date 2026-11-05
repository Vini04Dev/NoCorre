"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { cadastrar, entrar, type EstadoAcesso } from "@/app/(auth)/acoes";
import { Botao } from "@/components/ui/Botao";
import { useLimparDadosLocais } from "@/hooks/useLimparDadosLocais";
import { AguardandoConfirmacao } from "./AguardandoConfirmacao";
import { CampoAcesso } from "./CampoAcesso";

type Props = {
  modo: "entrar" | "cadastrar";
  /** Mensagem vinda da URL, ex.: link de confirmação expirado. */
  erroInicial?: string;
};

/** Formulário de login ou de cadastro. As duas telas só mudam o campo Nome e os textos. */
export function FormularioAcesso({ modo, erroInicial }: Props) {
  const cadastro = modo === "cadastrar";
  // A senha fica só na memória desta aba, para entrar sozinho assim que o email for confirmado.
  const [senha, setSenha] = useState("");
  const limparDadosLocais = useLimparDadosLocais();
  const [estado, acao, enviando] = useActionState<EstadoAcesso, FormData>(
    (anterior, dados) => {
      setSenha(String(dados.get("senha") ?? ""));
      limparDadosLocais();
      return (cadastro ? cadastrar : entrar)(anterior, dados);
    },
    { erro: erroInicial },
  );

  if (estado.emailPendente) {
    return <AguardandoConfirmacao email={estado.emailPendente} senha={senha} />;
  }

  return (
    <form action={acao} className="flex flex-col">
      <div className="flex flex-col gap-[11px]">
        {cadastro && (
          <CampoAcesso
            rotulo="Nome"
            icone="/icones/usuario.svg"
            name="nome"
            placeholder="Seu Nome"
            autoComplete="name"
            defaultValue={estado.campos?.nome}
          />
        )}
        <CampoAcesso
          rotulo="Email"
          icone="/icones/email.svg"
          name="email"
          type="email"
          placeholder="entregador@nocorre.com"
          autoComplete="email"
          inputMode="email"
          defaultValue={estado.campos?.email}
        />
        <CampoAcesso
          rotulo="Senha"
          icone="/icones/cadeado.svg"
          name="senha"
          type="password"
          placeholder="***********"
          autoComplete={cadastro ? "new-password" : "current-password"}
          minLength={cadastro ? 6 : undefined}
        />
      </div>

      {!cadastro && (
        <Link href="/esqueci-senha" className="self-end pt-2 text-xs font-semibold text-cinza-escuro">
          Esqueci minha senha
        </Link>
      )}
      <p role="alert" className="min-h-[33px] pt-2 text-xs font-medium text-negativo">
        {estado.erro}
      </p>

      <Botao type="submit" grande disabled={enviando}>
        {enviando ? "Aguarde..." : cadastro ? "Criar Conta" : "Entrar"}
      </Botao>

      <p className="mt-9 text-center text-sm">
        {cadastro ? "Já tem uma conta? " : "Não tem conta? "}
        <Link href={cadastro ? "/entrar" : "/cadastrar"} className="font-black text-dourado">
          {cadastro ? "Entrar" : "Cadastre-se"}
        </Link>
      </p>
    </form>
  );
}
