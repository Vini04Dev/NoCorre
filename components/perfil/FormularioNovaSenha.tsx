"use client";

import { useState } from "react";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { useTrocarSenha } from "@/hooks/usePerfil";

const SENHA_MINIMA = 6;

/**
 * Nova senha digitada duas vezes. Usado em "Senha e segurança" e na tela de
 * redefinir senha que o link do email abre.
 */
export function FormularioNovaSenha({ aoConcluir }: { aoConcluir: () => void }) {
  const trocar = useTrocarSenha();
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState<string>();

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (senha.length < SENHA_MINIMA) return setErro(`A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`);
    if (senha !== confirmacao) return setErro("As duas senhas não são iguais.");
    setErro(undefined);
    trocar.mutate(senha, {
      onSuccess: () => {
        setSenha("");
        setConfirmacao("");
        aoConcluir();
      },
    });
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-3">
      <AvisoErro mensagem={erro ?? trocar.error?.message} />
      <CampoTexto
        rotulo="Nova senha"
        type="password"
        autoComplete="new-password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <CampoTexto
        rotulo="Repita a nova senha"
        type="password"
        autoComplete="new-password"
        value={confirmacao}
        onChange={(e) => setConfirmacao(e.target.value)}
      />
      <Botao type="submit" disabled={trocar.isPending}>
        {trocar.isPending ? "Salvando..." : "Salvar nova senha"}
      </Botao>
    </form>
  );
}
