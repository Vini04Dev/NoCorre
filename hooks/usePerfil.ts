"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroAuth } from "@/lib/supabase/erros-auth";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import { apagarFoto, apagarPastaDoUsuario, enviarFoto, urlsAssinadas } from "@/lib/supabase/fotos";
import type { Tables, TablesUpdate } from "@/types/database";

const BUCKET = "fotos-perfil" as const;
const CHAVE = ["perfil"] as const;

export type Perfil = Tables<"perfis"> & { fotoUrl: string | null; email: string | null };

async function buscarPerfil(): Promise<Perfil | null> {
  const supabase = criarClienteNavegador();
  // RLS: só a linha do próprio usuário volta, então não precisa de filtro.
  const [{ data, error }, { data: sessao }] = await Promise.all([
    supabase.from("perfis").select("*").maybeSingle(),
    supabase.auth.getClaims(),
  ]);
  if (error) throw new Error(traduzirErroBanco(error));
  if (!data) return null;
  const urls = await urlsAssinadas(BUCKET, data.foto ? [data.foto] : []);
  return {
    ...data,
    fotoUrl: data.foto ? (urls.get(data.foto) ?? null) : null,
    email: (sessao?.claims.email as string | undefined) ?? null,
  };
}

export function usePerfil() {
  return useQuery({ queryKey: CHAVE, queryFn: buscarPerfil });
}

/** Números do cartão do Perfil, de todo o histórico. */
export function useEstatisticasPerfil() {
  return useQuery({
    // Começa com "movimentacoes" para recarregar quando um lançamento muda.
    queryKey: ["movimentacoes", "estatisticas-perfil"],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("receitas")
        .select("quantidade, valor_total, status_pagamento");
      if (error) throw new Error(traduzirErroBanco(error));
      let entregas = 0;
      let centavos = 0;
      for (const r of data) {
        entregas += r.quantidade;
        if (r.status_pagamento === "pago") centavos += Math.round((r.valor_total ?? 0) * 100);
      }
      return { entregas, receitaTotal: centavos / 100 };
    },
  });
}

export type DadosPerfil = Pick<
  TablesUpdate<"perfis">,
  "nome" | "telefone" | "tipo_sanguineo" | "veiculo" | "ano_veiculo" | "placa"
>;

type SalvarPerfil = {
  id: string;
  dados: DadosPerfil;
  fotoAtual: string | null;
  /** `undefined` mantém a foto atual, `null` remove, um arquivo substitui. */
  novaFoto?: File | null;
};

export function useSalvarPerfil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dados, fotoAtual, novaFoto }: SalvarPerfil) => {
      const fotoEnviada = novaFoto ? await enviarFoto(BUCKET, novaFoto) : null;
      const foto = novaFoto === undefined ? fotoAtual : fotoEnviada;
      const { error } = await criarClienteNavegador()
        .from("perfis")
        .update({ ...dados, foto })
        .eq("id", id);
      if (error) {
        await apagarFoto(BUCKET, fotoEnviada);
        throw new Error(traduzirErroBanco(error));
      }
      if (novaFoto !== undefined) await apagarFoto(BUCKET, fotoAtual);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHAVE }),
  });
}

export function useTrocarSenha() {
  return useMutation({
    mutationFn: async (senha: string) => {
      const { error } = await criarClienteNavegador().auth.updateUser({ password: senha });
      if (error) {
        // "same_password" não está no tradutor geral porque só acontece aqui.
        throw new Error(
          error.code === "same_password" ? "A nova senha precisa ser diferente da atual." : traduzirErroAuth(error),
        );
      }
    },
  });
}

/**
 * Apaga as fotos da pessoa, depois a conta (o banco remove o resto em cascata)
 * e encerra a sessão neste aparelho.
 */
export function useExcluirConta() {
  return useMutation({
    mutationFn: async () => {
      const supabase = criarClienteNavegador();
      await Promise.all([apagarPastaDoUsuario("fotos-clientes"), apagarPastaDoUsuario(BUCKET)]);
      const { error } = await supabase.rpc("excluir_minha_conta");
      if (error) throw new Error("Não foi possível excluir a conta. Tente de novo.");
      await supabase.auth.signOut();
    },
  });
}
