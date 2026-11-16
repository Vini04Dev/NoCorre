/**
 * Enfeites dos temas temáticos (Natal e, depois, outras datas). Um tema
 * temático usa as cores do Clássico e só soma estes desenhos por cima das
 * telas. Ficam sempre no HTML e aparecem pelo CSS quando o tema está ligado
 * (classe .enfeite-natal em app/globals.css), sem JavaScript e sem piscar na
 * primeira pintura. São decorativos: aria-hidden e sem toque.
 */

const CORES_LUZ = ["#e5383b", "#ffd36a", "#38b000", "#4ea8de"];

/** Um gomo do fio: a barriga do fio e uma lâmpada pendurada no meio. */
function Lampada({ indice }: { indice: number }) {
  const cor = CORES_LUZ[indice % CORES_LUZ.length];
  return (
    <svg width="34" height="24" viewBox="0 0 34 24" fill="none" className="shrink-0">
      <path d="M0 2 Q17 11 34 2" stroke="#2b2d42" strokeWidth="1.3" />
      <rect x="15" y="6" width="4" height="4" rx="1" fill="#2b2d42" />
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

/**
 * Fio de pisca-pisca pendurado na borda de baixo de quem o contém (que precisa
 * ser `relative`). Sobra lâmpada de propósito: o que passa da largura é cortado.
 */
export function PiscaPisca({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`enfeite-natal pointer-events-none absolute inset-x-0 top-full z-[1] -mt-1 overflow-hidden ${className}`}>
      <div className="flex justify-center">
        {Array.from({ length: 48 }, (_, indice) => (
          <Lampada key={indice} indice={indice} />
        ))}
      </div>
    </div>
  );
}

/** Desenho do gorro do Noel, sem a classe que o esconde (prévia na tela de tema). */
export function DesenhoGorro({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 48 40" className={className}>
      <path d="M8 30C10 14 22 4 34 6c6 1 10 6 10 12-4-4-8-5-11-3 4 5 6 10 7 15Z" fill="#d62828" />
      <path d="M8 30C10 14 22 4 34 6" fill="none" stroke="#a61e1e" strokeWidth="1" />
      <circle cx="44" cy="19" r="4.5" fill="#ffffff" stroke="#cfd4dc" strokeWidth="0.8" />
      <rect x="4" y="27" width="40" height="9" rx="4.5" fill="#ffffff" stroke="#cfd4dc" strokeWidth="0.8" />
    </svg>
  );
}

/**
 * Gorro do Noel para pôr no canto de um ícone, foto ou botão (o pai precisa ser
 * `relative`). A posição e o tamanho vêm de `className`.
 */
export function Gorro({ className = "" }: { className?: string }) {
  return <DesenhoGorro className={`enfeite-natal pointer-events-none absolute z-[1] ${className}`} />;
}
