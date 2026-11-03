"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import { apagarFoto, enviarFoto, urlsAssinadas } from "@/lib/supabase/fotos";
import type { Enums, Tables } from "@/types/database";

const BUCKET = "fotos-clientes" as const;
const CHAVE = ["clientes"] as const;

export type TipoCliente = Enums<"tipo_cliente">;
export type Cliente = Tables<"clientes"> & { fotoUrl: string | null };

export const ROTULO_TIPO_CLIENTE: Record<TipoCliente, string> = {
  pessoa_fisica: "Pessoa Física",
  empresa: "Empresa",
};

async function buscarClientes(): Promise<Cliente[]> {
  const supabase = criarClienteNavegador();
  const { data, error } = await supabase.from("clientes").select("*").order("nome");
  if (error) throw new Error(traduzirErroBanco(error));

  // O bucket é privado: troca o caminho salvo por uma URL temporária.
  const urls = await urlsAssinadas(
    BUCKET,
    data.flatMap((cliente) => (cliente.foto ? [cliente.foto] : [])),
  );

  return data.map((cliente) => ({
    ...cliente,
    fotoUrl: cliente.foto ? (urls.get(cliente.foto) ?? null) : null,
  }));
}

export function useClientes() {
  return useQuery({ queryKey: CHAVE, queryFn: buscarClientes });
}

export type DadosCliente = {
  nome: string;
  tipo: TipoCliente;
  telefone: string | null;
  observacao: string | null;
};

type SalvarCliente = {
  /** Ausente ao criar. */
  id?: string;
  dados: DadosCliente;
  /** Caminho da foto que já está salva, para apagar do Storage se for trocada. */
  fotoAtual: string | null;
  /** `undefined` mantém a foto atual, `null` remove, um arquivo substitui. */
  novaFoto?: File | null;
};

async function salvarCliente({ id, dados, fotoAtual, novaFoto }: SalvarCliente) {
  const supabase = criarClienteNavegador();
  const fotoEnviada = novaFoto ? await enviarFoto(BUCKET, novaFoto) : null;
  const foto = novaFoto === undefined ? fotoAtual : fotoEnviada;
  const linha = { ...dados, foto };

  const { error } = id
    ? await supabase.from("clientes").update(linha).eq("id", id)
    : await supabase.from("clientes").insert(linha);

  if (error) {
    await apagarFoto(BUCKET, fotoEnviada);
    throw new Error(traduzirErroBanco(error));
  }
  if (novaFoto !== undefined) await apagarFoto(BUCKET, fotoAtual);
}

async function excluirCliente(cliente: Cliente) {
  const supabase = criarClienteNavegador();
  const { error } = await supabase.from("clientes").delete().eq("id", cliente.id);
  if (error) {
    throw new Error(
      traduzirErroBanco(error, {
        vinculo: "Não é possível excluir: esse cliente tem receitas registradas ou está numa meta.",
      }),
    );
  }
  await apagarFoto(BUCKET, cliente.foto);
}

export function useSalvarCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: salvarCliente,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHAVE }),
  });
}

export function useExcluirCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: excluirCliente,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHAVE }),
  });
}
