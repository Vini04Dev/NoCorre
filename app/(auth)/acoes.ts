"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import { traduzirErroAuth } from "@/lib/supabase/erros-auth";

export type EstadoAcesso = {
  erro?: string;
  aviso?: string;
  campos?: { nome?: string; email?: string };
};

const SENHA_MINIMA = 6;

function texto(dados: FormData, campo: string) {
  return String(dados.get(campo) ?? "").trim();
}

export async function entrar(_anterior: EstadoAcesso, dados: FormData): Promise<EstadoAcesso> {
  const email = texto(dados, "email");
  const senha = String(dados.get("senha") ?? "");

  if (!email || !senha) {
    return { erro: "Preencha email e senha.", campos: { email } };
  }

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) {
    return { erro: traduzirErroAuth(error), campos: { email } };
  }

  redirect("/");
}

export async function cadastrar(_anterior: EstadoAcesso, dados: FormData): Promise<EstadoAcesso> {
  const nome = texto(dados, "nome");
  const email = texto(dados, "email");
  const senha = String(dados.get("senha") ?? "");
  const campos = { nome, email };

  if (!nome || !email || !senha) {
    return { erro: "Preencha nome, email e senha.", campos };
  }
  if (senha.length < SENHA_MINIMA) {
    return { erro: `A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`, campos };
  }

  // O link do email de confirmação volta para este mesmo endereço (local, preview
  // ou produção), desde que ele esteja liberado nas Redirect URLs do Supabase.
  const origem = (await headers()).get("origin") ?? "";

  const supabase = await criarClienteServidor();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    // O trigger criar_perfil lê esse "nome" para preencher a tabela perfis.
    options: { data: { nome }, emailRedirectTo: `${origem}/auth/confirmar` },
  });
  if (error) {
    return { erro: traduzirErroAuth(error), campos };
  }

  // Com confirmação de email ligada, o Supabase não devolve sessão até o clique no link.
  if (!data.session) {
    return { aviso: `Enviamos um link de confirmação para ${email}. Abra o email para ativar sua conta.` };
  }

  redirect("/");
}

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  redirect("/entrar");
}
