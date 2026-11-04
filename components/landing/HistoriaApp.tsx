"use client";

import { useEffect, useRef, useState } from "react";
import { MockupCelular, TelaConta, TelaLancamento, TelaMeta, TelaSaldo } from "./MockupCelular";

const PASSOS = [
  {
    selo: "SALDO",
    titulo: "Quanto sobrou. Agora.",
    texto: "Recebidos, pendentes e despesas do dia, da semana ou do mês. Sem planilha, sem caderninho.",
    Tela: TelaSaldo,
  },
  {
    selo: "LANÇAMENTO",
    titulo: "Dois toques por entrega.",
    texto: "Entrega, corrida, diária ou gorjeta. O total aparece enquanto você digita.",
    Tela: TelaLancamento,
  },
  {
    selo: "METAS",
    titulo: "A meta enche junto com o tanque.",
    texto: "Defina quanto quer faturar ou quantas entregas quer fazer e veja o círculo completar.",
    Tela: TelaMeta,
  },
  {
    selo: "CONTAS",
    titulo: "Cada parcela no lugar certo.",
    texto: "Financiamento, água, luz: o pagamento abate da conta escolhida e o app avisa quanto falta.",
    Tela: TelaConta,
  },
];

/**
 * Celular preso ao lado enquanto os textos passam: a tela troca conforme o
 * texto que está no meio da tela.
 */
export function HistoriaApp() {
  const [ativo, setAtivo] = useState(0);
  const passos = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) setAtivo(Number((entrada.target as HTMLElement).dataset.indice));
        });
      },
      // Só a faixa do meio da tela conta como "lendo agora".
      { rootMargin: "-45% 0px -45% 0px" },
    );
    passos.current.forEach((passo) => passo && observador.observe(passo));
    return () => observador.disconnect();
  }, []);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-2">
      <div className="sticky top-16 z-10 order-first flex h-[calc(100dvh-4rem)] items-center justify-center lg:order-last">
        <MockupCelular className="scale-[0.8] sm:scale-100">
          {PASSOS.map(({ selo, Tela }, indice) => (
            <div
              key={selo}
              aria-hidden={indice !== ativo}
              className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                indice === ativo ? "translate-y-0 opacity-100" : indice < ativo ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0"
              }`}
            >
              <Tela />
            </div>
          ))}
        </MockupCelular>
      </div>

      <div className="relative z-20 -mt-[60dvh] flex flex-col lg:mt-0">
        {PASSOS.map(({ selo, titulo, texto }, indice) => (
          <div
            key={selo}
            data-indice={indice}
            ref={(elemento) => {
              passos.current[indice] = elemento;
            }}
            className="flex min-h-[90dvh] items-end pb-[12dvh] lg:items-center lg:pb-0"
          >
            <div
              className={`flex flex-col gap-3 rounded-3xl bg-[#0d0e16]/85 p-6 backdrop-blur transition-opacity duration-500 lg:bg-transparent lg:p-0 lg:backdrop-blur-none ${
                indice === ativo ? "opacity-100" : "opacity-30"
              }`}
            >
              <span className="text-xs font-semibold tracking-[0.2em] text-dourado-claro">{selo}</span>
              <h3 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{titulo}</h3>
              <p className="max-w-md text-base text-cinza-claro sm:text-lg">{texto}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
