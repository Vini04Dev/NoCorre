"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Botao, classeBotao } from "@/components/ui/Botao";
import { TelaAviso } from "@/components/ui/TelaAviso";

/**
 * Erro inesperado em qualquer tela. Em vez da tela branca do navegador, explica
 * o que houve e oferece tentar de novo (recarrega só a parte que falhou).
 */
const CHAVE_RECARREGOU = "nocorre:recarregou-versao";

/** Pedaço do app que não existe mais: a tela foi aberta antes de uma atualização. */
function ehVersaoAntiga(error: Error) {
  return /ChunkLoadError|Loading chunk|Failed to load chunk|dynamically imported module|Failed to find Server Action/i.test(
    `${error.name} ${error.message}`,
  );
}

export default function Erro({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    // Depois de uma atualização, recarrega para pegar a versão nova em vez de
    // mostrar erro. A marca (com a hora) evita recarregar sem parar se não resolver.
    if (!ehVersaoAntiga(error)) return;
    try {
      const ultima = Number(sessionStorage.getItem(CHAVE_RECARREGOU) ?? 0);
      if (Date.now() - ultima < 60_000) return;
      sessionStorage.setItem(CHAVE_RECARREGOU, String(Date.now()));
    } catch {
      return;
    }
    window.location.reload();
  }, [error]);

  return (
    <TelaAviso
      desenho="erro"
      titulo="Algo deu errado"
      texto="Esta tela não carregou. Pode ser a internet oscilando; tente de novo em alguns segundos."
    >
      <Botao onClick={reset}>Tentar de novo</Botao>
      <Link href="/" className={classeBotao("contorno")}>
        Voltar ao Início
      </Link>
      {error.digest && <p className="text-[11px] text-cinza-escuro">Código do erro: {error.digest}</p>}
    </TelaAviso>
  );
}
