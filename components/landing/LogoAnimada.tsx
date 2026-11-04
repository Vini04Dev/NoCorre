"use client";

const N = 6;
const PECAS = Array.from({ length: N * N }, (_, i) => {
  const linha = Math.floor(i / N);
  const coluna = i % N;
  // Pseudoaleatório fixo pelo índice: servidor e navegador desenham igual (sem erro de hidratação).
  const sorteio = (semente: number) => {
    const x = Math.sin(i * 12.9898 + semente * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const centro = (N - 1) / 2;
  const distancia = Math.hypot(linha - centro, coluna - centro);
  return {
    linha,
    coluna,
    // Inteiros: o seno pode variar nas últimas casas entre Node e navegador.
    dx: Math.round((sorteio(1) - 0.5) * 520),
    dy: Math.round((sorteio(2) - 0.5) * 520),
    giro: Math.round((sorteio(3) - 0.5) * 140),
    atraso: Math.round(distancia * 90 + sorteio(4) * 160),
  };
});

/**
 * A logo é uma ilustração (PNG), não um vetor em camadas. Para animar sem isso,
 * ela é fatiada em peças que voam para o lugar e se montam; depois um brilho
 * passa por cima. Com um SVG separado por elementos, dá para animar cada parte.
 */
export function LogoAnimada({ montada }: { montada: boolean }) {
  return (
    <div className="relative size-[132px] sm:size-[160px]" role="img" aria-label="Logo do No Corre!">
      <div
        aria-hidden
        className={`absolute inset-[-30%] rounded-full bg-dourado/30 blur-3xl transition-opacity delay-[1100ms] duration-1000 ${
          montada ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="relative grid size-full" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
        {PECAS.map(({ linha, coluna, dx, dy, giro, atraso }) => (
          <span
            key={`${linha}-${coluna}`}
            style={{
              backgroundImage: "url(/imagens/logo.png)",
              backgroundSize: `${N * 100}% ${N * 100}%`,
              backgroundPosition: `${(coluna / (N - 1)) * 100}% ${(linha / (N - 1)) * 100}%`,
              transform: montada ? "none" : `translate(${dx}px, ${dy}px) rotate(${giro}deg) scale(0.4)`,
              opacity: montada ? 1 : 0,
              transitionDelay: `${atraso}ms`,
            }}
            className="aspect-square transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          />
        ))}
      </div>
      {/* Brilho que atravessa a logo, recortado no formato dela pela máscara. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:url(/imagens/logo.png)] [mask-size:100%_100%]"
      >
        <span
          className={`absolute inset-y-0 -left-full w-2/3 skew-x-[-20deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] transition-transform delay-[1300ms] duration-[1200ms] ease-out motion-reduce:hidden ${
            montada ? "translate-x-[350%]" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
}
