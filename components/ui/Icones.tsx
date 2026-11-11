/**
 * Ícones que acompanham o tema do app. Em vez de arquivos com a cor gravada
 * (o dourado não mudaria com o tema), são desenhados com a cor do CSS:
 * - IconeNav: os quatro da navegação, em linha (currentColor).
 * - IconeTingido: qualquer SVG de uma cor só, usado como máscara e pintado
 *   pela classe de fundo (ex.: bg-dourado-icone).
 */

const CAMINHOS_NAV = {
  "/icones/inicio.svg":
    "M9 21V14.1528C9 13.5226 9.53726 13.0116 10.2 13.0116H13.8C14.4627 13.0116 15 13.5226 15 14.1528V21M11.3046 3.21117L3.50457 8.48603C3.18802 8.7001 3 9.04665 3 9.41605V19.2882C3 20.2336 3.80589 21 4.8 21H19.2C20.1941 21 21 20.2336 21 19.2882V9.41605C21 9.04665 20.812 8.70011 20.4954 8.48603L12.6954 3.21117C12.2791 2.92961 11.7209 2.92961 11.3046 3.21117Z",
  "/icones/resumo.svg":
    "M11.4 21.6H5.39999C4.0745 21.6 2.99999 20.5254 3 19.2L3.00009 4.80001C3.0001 3.47454 4.07462 2.40003 5.40009 2.40003H16.2004C17.5258 2.40003 18.6004 3.47454 18.6004 4.80003V9.60003M19.8 19.8L21 21M7.20037 7.20003H14.4004M7.20037 10.8H14.4004M7.20037 14.4H10.8004M20.4 17.4C20.4 19.0569 19.0569 20.4 17.4 20.4C15.7431 20.4 14.4 19.0569 14.4 17.4C14.4 15.7432 15.7431 14.4 17.4 14.4C19.0569 14.4 20.4 15.7432 20.4 17.4Z",
  "/icones/relatorios.svg":
    "M20.4706 12.8471C20.4706 17.8372 16.4253 21.8825 11.4353 21.8825C6.44524 21.8825 2.4 17.8372 2.4 12.8471C2.4 7.85706 6.44527 3.81179 11.4353 3.81182L11.4353 12.8471H20.4706ZM15.3882 8.80713V2.11754C18.8189 2.11754 21.6 4.89864 21.6 8.3293V8.80713H15.3882Z",
  "/icones/perfil.svg":
    "M20.3995 21.6L20.3998 18.0003C20.4 16.012 18.7882 14.4 16.7998 14.4H7.20057C5.2125 14.4 3.60079 16.0115 3.60057 17.9996L3.60016 21.6M15.6002 6C15.6002 7.98822 13.9884 9.6 12.0002 9.6C10.0119 9.6 8.40016 7.98822 8.40016 6C8.40016 4.01177 10.0119 2.4 12.0002 2.4C13.9884 2.4 15.6002 4.01177 15.6002 6Z",
} as const;

/** Ícones de arquivo desenhados em dourado: viram máscara na cor de destaque do tema. */
const ICONES_DOURADOS = new Set([
  "/icones/agenda.svg",
  "/icones/metas.svg",
  "/icones/cadastro.svg",
  "/icones/admin.svg",
  "/icones/carteira-modulo.svg",
  "/icones/moto-modulo.svg",
  "/icones/pro-dourado.svg",
]);

export function ehIconeNav(src: string): src is keyof typeof CAMINHOS_NAV {
  return src in CAMINHOS_NAV;
}

/**
 * Ícone da navegação. Ativo: quadrado na cor de destaque com o traço marinho
 * (contraste de 5:1 ou mais em todos os temas; ver testes/contraste.test.mjs).
 */
export function IconeNav({ src, ativo }: { src: keyof typeof CAMINHOS_NAV; ativo: boolean }) {
  return (
    <span
      aria-hidden
      className={`grid size-6 shrink-0 place-items-center rounded-[5px] ${ativo ? "bg-dourado-icone text-marinho" : "text-marinho"}`}
    >
      <svg width={ativo ? 18 : 24} height={ativo ? 18 : 24} viewBox="0 0 24 24" fill="none">
        <path d={CAMINHOS_NAV[src]} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/**
 * SVG de uma cor só pintado pela classe de fundo (`cor`, ex.: "bg-dourado-icone").
 * O desenho vira máscara: a forma vem do arquivo, a cor vem do tema.
 */
export function IconeTingido({ src, tamanho, cor, className = "" }: { src: string; tamanho: number; cor: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 ${cor} ${className}`}
      style={{
        width: tamanho,
        height: tamanho,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

/** Ícone de item de menu: nav em linha, dourados na cor de destaque, o resto na cor do texto. */
export function IconeMenu({ src, ativo, tamanho = 24 }: { src: string; ativo: boolean; tamanho?: number }) {
  if (ehIconeNav(src)) return <IconeNav src={src} ativo={ativo} />;
  return <IconeTingido src={src} tamanho={tamanho} cor={ICONES_DOURADOS.has(src) ? "bg-dourado-icone" : "bg-current"} />;
}
