import Image from "next/image";

/**
 * Ícone de linha do app dentro do círculo dourado claro, o mesmo padrão dos
 * itens do Perfil. Usar sempre este no lugar de emojis.
 */
export function IconeCirculo({ src, tamanho = "md" }: { src: string; tamanho?: "sm" | "md" }) {
  const caixa = tamanho === "sm" ? "size-7" : "size-9";
  const icone = tamanho === "sm" ? 16 : 18;
  return (
    <span aria-hidden className={`grid ${caixa} shrink-0 place-items-center rounded-full bg-dourado-claro`}>
      <Image src={src} alt="" width={icone} height={icone} />
    </span>
  );
}
