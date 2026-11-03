import Image from "next/image";

type Props = { nome: string; fotoUrl: string | null; tamanho: number };

/** Foto do cliente ou, sem foto, a inicial do nome em dourado sobre azul-marinho. */
export function AvatarCliente({ nome, fotoUrl, tamanho }: Props) {
  if (fotoUrl) {
    // unoptimized: a URL assinada muda a cada carga e expira, então não vale passar
    // pelo otimizador de imagens do Next (que ainda exigiria liberar o domínio).
    return (
      <Image
        src={fotoUrl}
        alt=""
        width={tamanho}
        height={tamanho}
        unoptimized
        className="shrink-0 rounded-full object-cover"
        style={{ width: tamanho, height: tamanho }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full bg-marinho font-extrabold text-dourado-claro"
      style={{ width: tamanho, height: tamanho, fontSize: tamanho * 0.4 }}
    >
      {nome.trim().charAt(0).toUpperCase()}
    </span>
  );
}
