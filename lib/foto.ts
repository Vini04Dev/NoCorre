const LADO_MAXIMO = 512;
const QUALIDADE = 0.82;

/**
 * Reduz a foto no próprio celular antes do envio. Foto de câmera tem vários MB;
 * para um avatar de 40 px, 512 px em JPEG basta e cabe no limite de 1 MB do bucket.
 */
export async function reduzirFoto(arquivo: File): Promise<Blob> {
  const imagem = await createImageBitmap(arquivo);
  const escala = Math.min(1, LADO_MAXIMO / Math.max(imagem.width, imagem.height));

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(imagem.width * escala);
  canvas.height = Math.round(imagem.height * escala);
  canvas.getContext("2d")?.drawImage(imagem, 0, 0, canvas.width, canvas.height);
  imagem.close();

  return new Promise((resolver, rejeitar) =>
    canvas.toBlob(
      (blob) => (blob ? resolver(blob) : rejeitar(new Error("Não foi possível ler a foto."))),
      "image/jpeg",
      QUALIDADE,
    ),
  );
}
