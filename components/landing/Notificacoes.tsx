"use client";

import { useVisivel } from "./animacao";

const NOTIFICACOES = [
  { titulo: "Sexta é o seu melhor dia.", texto: "Você faz 59% mais entregas que a média da semana." },
  { titulo: "Combustível é sua maior despesa.", texto: "Ele leva 44% de tudo o que você gastou no mês." },
];

const SUAVE = "ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

/**
 * Prévia das notificações (recurso futuro): a campainha sobe, "estoura" num anel
 * e o texto entra ao lado, solto, na mesma cor da campainha. Desfaz ao rolar
 * para cima e toca de novo na descida.
 */
function Notificacao({ titulo, texto, atraso }: { titulo: string; texto: string; atraso: number }) {
  const [ref, visivel] = useVisivel<HTMLDivElement>("0px 0px -20% 0px");
  const depois = (ms: number) => ({ transitionDelay: visivel ? `${atraso + ms}ms` : "0ms" });

  return (
    <div ref={ref} className="flex items-center gap-4">
      <span className="relative grid size-12 shrink-0 place-items-center">
        {/* Anel do "estouro": cresce e some logo depois que a campainha chega. */}
        <span
          aria-hidden
          style={depois(450)}
          className={`absolute inset-0 rounded-full border-2 border-dourado-claro transition-[transform,opacity] duration-700 ${SUAVE} ${
            visivel ? "scale-[1.9] opacity-0" : "scale-50 opacity-100"
          }`}
        />
        <span
          aria-hidden
          style={depois(0)}
          className={`text-3xl transition-[transform,opacity] duration-500 ${SUAVE} ${
            visivel ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-75 opacity-0"
          }`}
        >
          <span className={`inline-block ${visivel ? "animate-[balanco_700ms_ease-out_500ms_1]" : ""}`}>🔔</span>
        </span>
      </span>
      <p
        style={depois(650)}
        className={`text-lg leading-snug text-dourado-claro transition-[transform,opacity] duration-700 sm:text-xl ${SUAVE} ${
          visivel ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
        }`}
      >
        <b className="font-semibold">{titulo}</b> <span className="text-dourado-claro/70">{texto}</span>
      </p>
    </div>
  );
}

export function Notificacoes() {
  return (
    <div className="flex flex-col gap-6 py-4 sm:flex-row sm:gap-10 lg:col-span-3">
      {NOTIFICACOES.map((item, indice) => (
        <Notificacao key={item.titulo} {...item} atraso={indice * 500} />
      ))}
    </div>
  );
}
