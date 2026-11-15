/**
 * Lugar da imagem quando o modelo da moto ainda não tem fotos no app (hoje só
 * a CG 160 tem). A lista de manutenção continua funcionando igual.
 */
export function EmBreve({ modelo }: { modelo: string | null | undefined }) {
  return (
    <div className="flex aspect-[950/466] w-full max-w-md flex-col items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-cinza-claro px-6 text-center">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="text-cinza" aria-hidden>
        <circle cx="5.5" cy="16.5" r="3.5" />
        <circle cx="18.5" cy="16.5" r="3.5" />
        <path d="M5.5 16.5 9 10h5l2.5 6.5M14 10l1.5-3H18M9 10 7.5 7H5" />
      </svg>
      <p className="text-sm font-bold">Em breve</p>
      <p className="text-[11px] text-cinza-escuro">
        {modelo ? `A imagem da ${modelo} ainda não está no app.` : "Cadastre o modelo da moto no Perfil."} As manutenções abaixo já
        funcionam normalmente.
      </p>
    </div>
  );
}
