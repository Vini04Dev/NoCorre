import { reduzirFoto } from "@/lib/foto";
import { criarClienteNavegador } from "./cliente";

/**
 * Fotos nos buckets privados (clientes e perfil). Os arquivos ficam em
 * "<usuario_id>/<arquivo>.jpg": a primeira pasta é o que as políticas conferem.
 */
export type Bucket = "fotos-clientes" | "fotos-perfil";

/** Validade das URLs assinadas. As listas são recarregadas bem antes disso. */
const VALIDADE_SEGUNDOS = 60 * 60;

async function usuarioAtual() {
  const { data } = await criarClienteNavegador().auth.getClaims();
  const id = data?.claims.sub;
  if (!id) throw new Error("Sua sessão expirou. Entre de novo.");
  return id;
}

/** Reduz a foto no celular e envia. Devolve o caminho para salvar na tabela. */
export async function enviarFoto(bucket: Bucket, arquivo: File) {
  const caminho = `${await usuarioAtual()}/${crypto.randomUUID()}.jpg`;
  const foto = await reduzirFoto(arquivo);
  const { error } = await criarClienteNavegador()
    .storage.from(bucket)
    .upload(caminho, foto, { contentType: "image/jpeg" });
  if (error) throw new Error("Não foi possível enviar a foto. Tente de novo.");
  return caminho;
}

export async function apagarFoto(bucket: Bucket, caminho: string | null) {
  if (!caminho) return;
  // Falhar aqui só deixa um arquivo órfão no bucket; não vale interromper quem está usando.
  await criarClienteNavegador().storage.from(bucket).remove([caminho]);
}

/** Troca caminhos por URLs temporárias, todas numa chamada só. */
export async function urlsAssinadas(bucket: Bucket, caminhos: string[]) {
  const urls = new Map<string, string>();
  if (caminhos.length === 0) return urls;
  const { data } = await criarClienteNavegador()
    .storage.from(bucket)
    .createSignedUrls(caminhos, VALIDADE_SEGUNDOS);
  data?.forEach(({ path, signedUrl }) => path && signedUrl && urls.set(path, signedUrl));
  return urls;
}

/** Apaga todos os arquivos da pasta do usuário no bucket (usado ao excluir a conta). */
export async function apagarPastaDoUsuario(bucket: Bucket) {
  const pasta = await usuarioAtual();
  const armazenamento = criarClienteNavegador().storage.from(bucket);
  const { data } = await armazenamento.list(pasta, { limit: 1000 });
  if (data?.length) await armazenamento.remove(data.map((arquivo) => `${pasta}/${arquivo.name}`));
}
