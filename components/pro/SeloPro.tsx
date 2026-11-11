/** Selo "PRO" ao lado de títulos e itens de recursos do plano Pro. */
export function SeloPro({ className = "" }: { className?: string }) {
  return (
    <span className={`rounded-md bg-marinho px-1.5 py-0.5 text-[9px] font-bold tracking-[0.6px] text-dourado-claro ${className}`}>
      PRO
    </span>
  );
}
