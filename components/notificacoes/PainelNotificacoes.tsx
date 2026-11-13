"use client";

import Link from "next/link";
import { CartaoConta } from "@/components/contas/CartaoConta";
import { CartaoAviso } from "./CartaoAviso";
import { CartaoEvento } from "./CartaoEvento";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { DIAS_PENDENTE, type Notificacao } from "@/hooks/useNotificacoes";
import { formatarMoeda } from "@/lib/formatar";
import { COR_SITUACAO, formatarKm } from "@/lib/moto";

/** Ícones de linha (24 × 24), na cor do texto em volta. */
export const ICONES = {
  sino: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0",
  relogio: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  alvo: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  certo: "M20 6 9 17l-5-5",
  fechar: "M18 6 6 18M6 6l12 12",
  moto: "M5.5 20a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18.5 20a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.5 16.5 9 10h5l2.5 6.5M14 10l1.5-3H18M9 10 7.5 7H5",
};

export function Icone({ d, tamanho = 16 }: { d: string; tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

/** Linha simples para o que não tem cartão próprio (entregas pendentes, metas). */
function Linha({ href, icone, titulo, detalhe, aoAbrir }: { href: string; icone: string; titulo: string; detalhe: string; aoAbrir: () => void }) {
  return (
    <Link
      href={href}
      onClick={aoAbrir}
      className="flex items-center gap-2.5 rounded-[12px] border border-black/8 bg-white py-2 pr-3 pl-2.5 shadow-cartao"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-cinza-fundo text-cinza-escuro">
        <Icone d={icone} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[13px] font-bold">{titulo}</span>
        <span className="truncate text-[11px] text-cinza-escuro">{detalhe}</span>
      </span>
      <span aria-hidden className="text-lg text-cinza">
        ›
      </span>
    </Link>
  );
}

function Item({ notificacao: n, aoAbrir }: { notificacao: Notificacao; aoAbrir: () => void }) {
  switch (n.tipo) {
    case "conta":
      return <CartaoConta conta={n.conta} situacao={n.situacao} aoAbrir={aoAbrir} />;
    case "evento":
      return <CartaoEvento evento={n.evento} agora={n.agora} aoAbrir={aoAbrir} />;
    case "pendentes":
      return (
        <Linha
          href="/resumo"
          icone={ICONES.relogio}
          titulo={`${n.quantidade} ${n.quantidade > 1 ? "entregas ainda não pagas" : "entrega ainda não paga"}`}
          detalhe={`Há mais de ${DIAS_PENDENTE} dias · ${formatarMoeda(n.valor)} a receber`}
          aoAbrir={aoAbrir}
        />
      );
    case "moto":
      return (
        <CartaoAviso
          href="/moto"
          cor={COR_SITUACAO[n.situacao]}
          icone={ICONES.moto}
          titulo={n.nome}
          situacao={n.faltam >= 0 ? `Trocar logo · faltam ${formatarKm(n.faltam)}` : `Passou ${formatarKm(-n.faltam)} da troca`}
          rotulo={`Saúde da moto: ${n.nome}`}
          aoAbrir={aoAbrir}
        />
      );
    case "meta":
      return <Linha href={`/metas/${n.meta.id}`} icone={ICONES.alvo} titulo={n.meta.nome} detalhe={n.texto} aoAbrir={aoAbrir} />;
  }
}

/**
 * Lista das notificações: sobe do rodapé no celular (como os outros painéis)
 * e vira gaveta na lateral direita no computador. Urgentes primeiro.
 */
export function PainelNotificacoes({ itens, aoFechar }: { itens: Notificacao[]; aoFechar: () => void }) {
  const urgentes = itens.filter((n) => n.urgente);
  const outras = itens.filter((n) => !n.urgente);
  const grupos = [
    { titulo: "PRECISA DE ATENÇÃO", lista: urgentes },
    { titulo: urgentes.length ? "EM BREVE" : "", lista: outras },
  ].filter((g) => g.lista.length);

  return (
    <PainelInferior idTitulo="notificacoes-titulo" aoFechar={aoFechar} lateral>
      <div className="flex items-center justify-between">
        <h2 id="notificacoes-titulo" className="text-lg font-extrabold">
          Notificações
        </h2>
        <button type="button" onClick={aoFechar} aria-label="Fechar notificações" className="grid size-8 place-items-center rounded-full text-cinza-escuro">
          <Icone d={ICONES.fechar} tamanho={18} />
        </button>
      </div>

      {itens.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <span className="grid size-11 place-items-center rounded-full bg-cinza-fundo text-positivo">
            <Icone d={ICONES.certo} tamanho={20} />
          </span>
          <p className="text-sm font-bold">Tudo em dia</p>
          <p className="text-xs text-cinza-escuro">Contas, compromissos, entregas a receber e a saúde da moto aparecem aqui quando pedirem atenção.</p>
        </div>
      ) : (
        grupos.map((grupo) => (
          <section key={grupo.titulo || "lista"} className="flex flex-col gap-1.5">
            {grupo.titulo && <h3 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">{grupo.titulo}</h3>}
            <ul className="flex flex-col gap-2">
              {grupo.lista.map((n) => (
                <li key={n.id}>
                  <Item notificacao={n} aoAbrir={aoFechar} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </PainelInferior>
  );
}
