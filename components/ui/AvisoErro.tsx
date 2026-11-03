/** Faixa vermelha de erro no topo dos formulários. Não renderiza nada sem mensagem. */
export function AvisoErro({ mensagem }: { mensagem?: string | null }) {
  if (!mensagem) return null;

  return (
    <p
      role="alert"
      className="flex gap-2.5 rounded-[10px] border border-negativo/40 bg-negativo/8 px-3 py-2.5 text-xs font-medium text-negativo"
    >
      <span aria-hidden className="text-base leading-4 font-black">
        !
      </span>
      {mensagem}
    </p>
  );
}
