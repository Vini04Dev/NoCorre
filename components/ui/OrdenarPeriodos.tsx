"use client";

import { useRef, useState } from "react";
import { Botao } from "./Botao";
import { PainelInferior } from "./PainelInferior";
import { useOrdemPeriodos } from "@/hooks/useOrdemPeriodos";
import type { Periodo } from "@/lib/periodo";

const NOMES: Record<Periodo, { titulo: string; descricao: string }> = {
  dia: { titulo: "Dia", descricao: "Hoje" },
  semana: { titulo: "Semana", descricao: "Esta semana, de segunda a domingo" },
  mes: { titulo: "Mês", descricao: "Este mês inteiro" },
};

const ALTURA_ITEM = 64; // h-14 + gap-2

function mover(lista: Periodo[], de: number, para: number) {
  const nova = [...lista];
  const [item] = nova.splice(de, 1);
  nova.splice(para, 0, item);
  return nova;
}

/**
 * Painel para pôr Dia, Semana e Mês na ordem que a pessoa prefere: arrasta pela
 * alça (ou usa as setas). O primeiro é o que abre sozinho ao entrar no app.
 */
export function OrdenarPeriodos({ aoFechar }: { aoFechar: () => void }) {
  const [ordem, mudarOrdem] = useOrdemPeriodos();
  const [lista, setLista] = useState(ordem);
  const [arrastando, setArrastando] = useState<{ indice: number; deslocamento: number } | null>(null);
  const inicioY = useRef(0);

  function soltar() {
    setArrastando(null);
  }

  function aoMover(evento: React.PointerEvent) {
    if (!arrastando) return;
    const deslocamento = evento.clientY - inicioY.current;
    const passos = Math.round(deslocamento / ALTURA_ITEM);
    const alvo = Math.max(0, Math.min(lista.length - 1, arrastando.indice + passos));
    if (alvo !== arrastando.indice) {
      // Trocou de lugar: a referência anda junto para o item seguir o dedo.
      setLista(mover(lista, arrastando.indice, alvo));
      inicioY.current += (alvo - arrastando.indice) * ALTURA_ITEM;
      setArrastando({ indice: alvo, deslocamento: deslocamento - (alvo - arrastando.indice) * ALTURA_ITEM });
    } else {
      setArrastando({ ...arrastando, deslocamento });
    }
  }

  function salvar() {
    mudarOrdem(lista);
    aoFechar();
  }

  return (
    <PainelInferior idTitulo="ordem-titulo" aoFechar={aoFechar}>
      <div className="flex flex-col gap-0.5">
        <h2 id="ordem-titulo" className="text-lg font-extrabold">
          Ordem dos períodos
        </h2>
        <p className="text-xs text-cinza-escuro">
          Arraste para mudar. O primeiro é o que aparece sempre que você abre o app, no Início, no Resumo, nos
          Relatórios e na Agenda.
        </p>
      </div>
      <ol className="flex touch-none flex-col gap-2" onPointerMove={aoMover} onPointerUp={soltar} onPointerCancel={soltar}>
        {lista.map((periodo, indice) => {
          const ativo = arrastando?.indice === indice;
          return (
            <li
              key={periodo}
              className={`flex h-14 items-center gap-3 rounded-[12px] border bg-white pr-2 pl-1 ${
                ativo ? "relative z-10 border-marinho shadow-cartao" : "border-cinza-claro"
              }`}
              style={ativo ? { transform: `translateY(${arrastando.deslocamento}px)` } : undefined}
            >
              <button
                type="button"
                aria-label={`Arrastar ${NOMES[periodo].titulo}`}
                onPointerDown={(evento) => {
                  evento.currentTarget.setPointerCapture(evento.pointerId);
                  inicioY.current = evento.clientY;
                  setArrastando({ indice, deslocamento: 0 });
                }}
                className="grid h-full w-10 cursor-grab place-items-center text-cinza-escuro active:cursor-grabbing"
              >
                <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  {[6, 12, 18].map((y) => (
                    <g key={y}>
                      <circle cx="9" cy={y} r="1.6" />
                      <circle cx="15" cy={y} r="1.6" />
                    </g>
                  ))}
                </svg>
              </button>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-bold">{NOMES[periodo].titulo}</span>
                <span className="truncate text-[11px] text-cinza-escuro">{NOMES[periodo].descricao}</span>
              </span>
              {indice === 0 && (
                <span className="rounded-full bg-marinho px-2 py-0.5 text-[10px] font-semibold text-white">Abre primeiro</span>
              )}
              <span className="flex flex-col">
                <button
                  type="button"
                  aria-label={`Subir ${NOMES[periodo].titulo}`}
                  disabled={indice === 0}
                  onClick={() => setLista(mover(lista, indice, indice - 1))}
                  className="grid size-6 place-items-center text-cinza-escuro disabled:opacity-25"
                >
                  <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 15l6-6 6 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label={`Descer ${NOMES[periodo].titulo}`}
                  disabled={indice === lista.length - 1}
                  onClick={() => setLista(mover(lista, indice, indice + 1))}
                  className="grid size-6 place-items-center text-cinza-escuro disabled:opacity-25"
                >
                  <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </span>
            </li>
          );
        })}
      </ol>
      <Botao type="button" onClick={salvar}>
        Salvar ordem
      </Botao>
    </PainelInferior>
  );
}
