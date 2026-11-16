/**
 * Enfeites de data comemorativa (Natal e, depois, outras datas). Entram
 * sozinhos no tema Clássico, no período da data (ENFEITES em lib/tema-app.ts),
 * sem trocar cor: só estes desenhos por cima das telas. Ficam sempre no HTML e
 * aparecem pelo CSS quando o enfeite está ligado no <html> (classe
 * .enfeite-natal em app/globals.css), sem piscar na primeira pintura. São
 * decorativos: aria-hidden e sem toque.
 */

const CORES_LUZ = ["#e5383b", "#ffd36a", "#38b000", "#4ea8de"];

/** Um gomo do fio: a barriga do fio e uma lâmpada pendurada no meio. */
function Lampada({ indice, fio, pequeno }: { indice: number; fio: string; pequeno: boolean }) {
  const cor = CORES_LUZ[indice % CORES_LUZ.length];
  return (
    <svg width={pequeno ? 27 : 34} height={pequeno ? 19 : 24} viewBox="0 0 34 24" fill="none" className="shrink-0">
      <path d="M0 2 Q17 11 34 2" stroke={fio} strokeWidth="1.3" />
      <rect x="15" y="6" width="4" height="4" rx="1" fill={fio} />
      <ellipse
        cx="17"
        cy="15.5"
        rx="4.2"
        ry="6"
        fill={cor}
        className="luz-pisca"
        style={{ animationDelay: `${(indice % 4) * 0.45}s`, filter: `drop-shadow(0 0 4px ${cor})` }}
      />
    </svg>
  );
}

type PropsPisca = {
  /** "topo": pendurado na borda de cima, por dentro. "base": pendurado embaixo, por fora. */
  local: "topo" | "base";
  /** Fio claro para fundo escuro (faixas marinho); escuro para fundo claro. */
  fio?: "claro" | "escuro";
  pequeno?: boolean;
  className?: string;
};

/**
 * Fio de pisca-pisca preso a quem o contém (que precisa ser `relative`). Sobra
 * lâmpada de propósito: o que passa da largura é cortado.
 */
export function PiscaPisca({ local, fio = "escuro", pequeno = false, className = "" }: PropsPisca) {
  const posicao = local === "topo" ? "top-[env(safe-area-inset-top)]" : "top-full -mt-1";
  return (
    <div aria-hidden className={`enfeite-natal pointer-events-none absolute inset-x-0 z-[1] overflow-hidden ${posicao} ${className}`}>
      <div className="flex justify-center">
        {Array.from({ length: 60 }, (_, indice) => (
          <Lampada key={indice} indice={indice} fio={fio === "claro" ? "#c9cdd6" : "#2b2d42"} pequeno={pequeno} />
        ))}
      </div>
    </div>
  );
}

/** Posição (% da largura), tamanho (px), atraso e duração (s) de cada floco. */
const FLOCOS = [
  [6, 9, 0, 9],
  [17, 6, 3.5, 11],
  [29, 8, 6, 10],
  [41, 5, 1.5, 12],
  [53, 9, 4.5, 9.5],
  [64, 6, 7.5, 11.5],
  [76, 8, 2.5, 10.5],
  [88, 5, 5.5, 12.5],
  [95, 7, 8.5, 9],
];

/**
 * Flocos de neve caindo devagar por dentro de uma faixa escura (o pai precisa
 * ser `relative`). Ficam atrás do conteúdo e somem ao chegar embaixo.
 */
export function Neve({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`enfeite-natal pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] ${className}`}>
      {FLOCOS.map(([esquerda, tamanho, atraso, duracao], indice) => (
        <svg
          key={indice}
          viewBox="0 0 24 24"
          width={tamanho}
          height={tamanho}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          className="floco-cai absolute top-0"
          style={{ left: `${esquerda}%`, animationDelay: `${atraso}s`, animationDuration: `${duracao}s` }}
        >
          <path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Gorro do Noel para pôr no canto de um ícone, foto ou botão (o pai precisa ser
 * `relative`). A posição e o tamanho vêm de `className`.
 */
export function Gorro({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 48 40" className={`enfeite-natal pointer-events-none absolute z-[1] ${className}`}>
      <path d="M8 30C10 14 22 4 34 6c6 1 10 6 10 12-4-4-8-5-11-3 4 5 6 10 7 15Z" fill="#d62828" />
      <path d="M8 30C10 14 22 4 34 6" fill="none" stroke="#a61e1e" strokeWidth="1" />
      <circle cx="44" cy="19" r="4.5" fill="#ffffff" stroke="#cfd4dc" strokeWidth="0.8" />
      <rect x="4" y="27" width="40" height="9" rx="4.5" fill="#ffffff" stroke="#cfd4dc" strokeWidth="0.8" />
    </svg>
  );
}
