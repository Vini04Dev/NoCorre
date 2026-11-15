/**
 * "Pedir acesso ao Pro": abre o WhatsApp (app no celular, web no computador)
 * numa aba nova, com a mensagem já escrita. Só redireciona; nada é enviado sem
 * a pessoa tocar em enviar lá.
 */
export function BotaoPedirPro({ href, aoClicar }: { href: string; aoClicar?: () => void }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={aoClicar}
      className="flex items-center justify-center gap-2 rounded-[10px] bg-linear-to-r from-dourado-claro to-dourado py-3 text-center text-sm font-extrabold text-black"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.6-5.4A8.4 8.4 0 1 1 21 11.5Z" />
      </svg>
      Pedir acesso pelo WhatsApp
    </a>
  );
}
