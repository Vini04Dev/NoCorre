/**
 * Esqueleto mostrado na hora em que se toca num item do menu, enquanto a tela
 * nova vem do servidor. Ele é pré-carregado junto com os links, então a troca
 * de aba responde na hora mesmo com internet lenta.
 */
export default function Carregando() {
  return (
    <div aria-busy="true" aria-label="Carregando" className="flex animate-pulse flex-col gap-4 px-[17px] pt-[calc(env(safe-area-inset-top)+16px)] lg:px-0 lg:pt-2">
      <div className="h-7 w-40 rounded-lg bg-cinza-claro" />
      <div className="h-10 rounded-[10px] bg-cinza-claro/70" />
      <div className="h-28 rounded-[14px] bg-cinza-claro/70" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-12 rounded-[10px] bg-cinza-claro/50" />
        ))}
      </div>
    </div>
  );
}
