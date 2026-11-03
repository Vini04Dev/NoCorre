/** Bloco com título pequeno em caixa alta, como "MEU VEÍCULO" no Perfil e "MÓDULOS" na Home. */
export function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5">
      <h2 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">{titulo}</h2>
      {children}
    </section>
  );
}
