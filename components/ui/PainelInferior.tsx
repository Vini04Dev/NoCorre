"use client";

import { useEffect } from "react";

type Props = {
  /** id do título, para o leitor de tela anunciar o painel. */
  idTitulo: string;
  aoFechar: () => void;
  children: React.ReactNode;
  /** Renderiza o painel como <form> para o Enter enviar. */
  aoEnviar?: (evento: React.FormEvent<HTMLFormElement>) => void;
};

/**
 * Painel que sobe do rodapé sobre o fundo escurecido. Tocar fora ou apertar Esc fecha.
 * No computador vira uma janela centralizada.
 */
export function PainelInferior({ idTitulo, aoFechar, children, aoEnviar }: Props) {
  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") aoFechar();
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aoFechar]);

  const classe =
    "relative mx-auto flex max-h-dvh w-full max-w-[430px] flex-col gap-3.5 overflow-y-auto rounded-t-[24px] bg-white px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+28px)] lg:max-h-[85dvh] lg:max-w-[480px] lg:rounded-[24px] lg:px-7 lg:pt-6 lg:pb-7 lg:shadow-2xl";
  const conteudo = (
    <>
      <span aria-hidden className="mx-auto h-1 w-10 rounded-full bg-cinza-claro lg:hidden" />
      {children}
    </>
  );

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end bg-black/45 backdrop-blur-[3px] lg:items-center lg:justify-center lg:p-6">
      <button type="button" aria-label="Fechar" onClick={aoFechar} className="absolute inset-0 cursor-default" />
      {aoEnviar ? (
        <form onSubmit={aoEnviar} noValidate role="dialog" aria-modal="true" aria-labelledby={idTitulo} className={classe}>
          {conteudo}
        </form>
      ) : (
        <div role="dialog" aria-modal="true" aria-labelledby={idTitulo} className={classe}>
          {conteudo}
        </div>
      )}
    </div>
  );
}
