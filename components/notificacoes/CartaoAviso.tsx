import Link from "next/link";

type Props = {
  href: string;
  /** Cor do aviso (variável de tema ou hex): tinge o fundo, o ícone e a linha de situação. */
  cor: string;
  /** Caminho SVG de um ícone de linha 24 × 24. */
  icone: string;
  titulo: string;
  situacao: string;
  valor?: string;
  acao?: string;
  rotulo?: string;
  aoAbrir?: () => void;
};

/**
 * Cartão das notificações (compromisso, moto): mesmo formato do cartão de
 * conta, com só um toque da cor no fundo para avisar sem gritar.
 */
export function CartaoAviso({ href, cor, icone, titulo, situacao, valor, acao = "Ver", rotulo, aoAbrir }: Props) {
  return (
    <Link
      href={href}
      onClick={aoAbrir}
      aria-label={rotulo}
      className="flex w-full items-center gap-2.5 rounded-[12px] border py-2 pr-3 pl-2.5 text-left shadow-cartao transition-transform active:scale-[0.99]"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${cor} 13%, var(--color-white)) 0%, color-mix(in srgb, ${cor} 4%, var(--color-white)) 100%)`,
        borderColor: `color-mix(in srgb, ${cor} 22%, transparent)`,
      }}
    >
      <span
        className="grid size-8 shrink-0 place-items-center rounded-full"
        style={{ color: cor, background: `color-mix(in srgb, ${cor} 16%, transparent)` }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d={icone} />
        </svg>
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[13px] font-bold">{titulo}</span>
        <span className="truncate text-[11px] font-semibold" style={{ color: cor }}>
          {situacao}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {valor && <span className="text-sm font-extrabold">{valor}</span>}
        <span className="rounded-full bg-marinho px-2.5 py-1 text-[10px] font-bold text-white">{acao}</span>
      </span>
    </Link>
  );
}
