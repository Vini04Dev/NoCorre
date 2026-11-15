import { Valor } from "@/components/ui/Valor";
import type { Carteira } from "@/hooks/useCarteiras";
import { iconeDoTipo } from "@/lib/carteiras";
import { corDoEvento } from "@/lib/cores";
import { formatarMoeda } from "@/lib/formatar";

/** Ícone de linha do tipo da carteira, na cor do texto em volta. */
export function IconeTipoCarteira({ tipo, tamanho = 20 }: { tipo: string | null | undefined; tamanho?: number }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={iconeDoTipo(tipo)} />
    </svg>
  );
}

/**
 * Degradê escurecido a partir da cor da carteira: o texto branco fica legível
 * mesmo nas cores claras (amarelo, verde).
 */
export function fundoCarteira(cor: Carteira["cor"]) {
  const forte = corDoEvento(cor).forte;
  return `linear-gradient(135deg, color-mix(in srgb, ${forte} 88%, #000) 0%, color-mix(in srgb, ${forte} 58%, #000) 100%)`;
}

type Props = {
  carteira: Carteira;
  saldo: number;
  selecionada?: boolean;
  aoTocar: () => void;
};

/** Cartão pequeno do carrossel de carteiras: nome, tipo e saldo. */
export function CartaoCarteira({ carteira, saldo, selecionada = false, aoTocar }: Props) {
  return (
    <button
      type="button"
      onClick={aoTocar}
      aria-pressed={selecionada}
      className={`relative flex h-[104px] w-[150px] shrink-0 snap-start flex-col justify-between rounded-[14px] p-3 text-left text-white shadow-cartao transition-transform active:scale-[0.98] ${
        selecionada ? "ring-2 ring-marinho ring-offset-2 ring-offset-fundo" : ""
      }`}
      style={{ background: fundoCarteira(carteira.cor) }}
    >
      <span className="absolute top-3 right-3 opacity-90">
        <IconeTipoCarteira tipo={carteira.tipo} tamanho={18} />
      </span>
      <span className="flex min-w-0 flex-col pr-6">
        <span className="truncate text-sm font-bold">{carteira.nome}</span>
        <span className="truncate text-[10px] text-white/80">
          {carteira.tipo ?? "Carteira"}
          {carteira.padrao && " · principal"}
        </span>
      </span>
      <span className="text-[15px] font-extrabold">
        <Valor texto={formatarMoeda(saldo)} />
      </span>
    </button>
  );
}
