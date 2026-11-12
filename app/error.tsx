"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Botao, classeBotao } from "@/components/ui/Botao";
import { TelaAviso } from "@/components/ui/TelaAviso";

/**
 * Erro inesperado em qualquer tela. Em vez da tela branca do navegador, explica
 * o que houve e oferece tentar de novo (recarrega só a parte que falhou).
 */
export default function Erro({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
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
