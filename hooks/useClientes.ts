"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reduzirFoto } from "@/lib/foto";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import type { Enums, Tables } from "@/types/database";

const BUCKET = "fotos-clientes";
const CHAVE = ["clientes"] as const;
/** Validade das URLs assinadas das fotos. A lista é recarregada bem antes disso. */
const VALIDADE_FOTO_SEGUNDOS = 60 * 60;

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

  // O bucket é privado: troca o caminho salvo por uma URL temporária, todas numa chamada só.
  const caminhos = data.flatMap((cliente) => (cliente.foto ? [cliente.foto] : []));
  const urls = new Map<string, string>();
  if (caminhos.length > 0) {
    const { data: assinadas } = await supabase.storage
      .from(BUCKET)
      .createSignedUrls(caminhos, VALIDADE_FOTO_SEGUNDOS);
    assinadas?.forEach(({ path, signedUrl }) => path && signedUrl && urls.set(path, signedUrl));
  }

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

async function enviarFoto(arquivo: File) {
  const supabase = criarClienteNavegador();
  const { data: sessao } = await supabase.auth.getClaims();
  const usuarioId = sessao?.claims.sub;
  if (!usuarioId) throw new Error("Sua sessão expirou. Entre de novo.");

  // A primeira pasta precisa ser o id do usuário: é o que as políticas do bucket conferem.
  const caminho = `${usuarioId}/${crypto.randomUUID()}.jpg`;
  const foto = await reduzirFoto(arquivo);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(caminho, foto, { contentType: "image/jpeg" });
  if (error) throw new Error("Não foi possível enviar a foto. Tente de novo.");
  return caminho;
}

async function apagarFoto(caminho: string | null) {
  if (!caminho) return;
  // Falhar aqui só deixa um arquivo órfão no bucket; não vale interromper quem está usando.
  await criarClienteNavegador().storage.from(BUCKET).remove([caminho]);
}

async function salvarCliente({ id, dados, fotoAtual, novaFoto }: SalvarCliente) {
  const supabase = criarClienteNavegador();
  const fotoEnviada = novaFoto ? await enviarFoto(novaFoto) : null;
  const foto = novaFoto === undefined ? fotoAtual : fotoEnviada;
  const linha = { ...dados, foto };

  const { error } = id
    ? await supabase.from("clientes").update(linha).eq("id", id)
    : await supabase.from("clientes").insert(linha);

  if (error) {
    await apagarFoto(fotoEnviada);
    throw new Error(traduzirErroBanco(error));
  }
  if (novaFoto !== undefined) await apagarFoto(fotoAtual);
}

async function excluirCliente(cliente: Cliente) {
  const supabase = criarClienteNavegador();
  const { error } = await supabase.from("clientes").delete().eq("id", cliente.id);
  if (error) {
    throw new Error(
      traduzirErroBanco(error, {
        vinculo: "Não é possível excluir: esse cliente tem receitas registradas.",
      }),
    );
  }
  await apagarFoto(cliente.foto);
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
