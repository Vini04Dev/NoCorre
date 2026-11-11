import { COR_SITUACAO, type ParteDesenho, type Situacao } from "@/lib/moto";

const NEUTRO = "#2b2d42";
const NEUTRO_CLARO = "#b0b6bf";

type Props = {
  /** Situação de cada parte; parte sem item acompanhado fica neutra. */
  partes: Partial<Record<ParteDesenho, Situacao>>;
  /** Biz, Pop e scooters têm o quadro aberto, sem tanque entre as pernas. */
  scooter?: boolean;
  descricao: string;
};

/**
 * Moto de lado, desenhada em SVG (leve e sem depender de modelo 3D): cada peça
 * acompanhada ganha a cor da situação — verde em dia, amarelo de olho, laranja
 * trocar logo, vermelho passou da hora — e pulsa quando precisa de troca.
 */
export function DesenhoMoto({ partes, scooter = false, descricao }: Props) {
  const cor = (parte: ParteDesenho) => (partes[parte] ? COR_SITUACAO[partes[parte]!] : NEUTRO_CLARO);
  const pulsa = (parte: ParteDesenho) =>
    partes[parte] === "trocar" || partes[parte] === "vencido" ? "animate-pulse motion-reduce:animate-none" : "";

  return (
    <svg viewBox="0 0 300 170" role="img" aria-label={descricao} className="h-auto w-full max-w-md">
      {/* Chão */}
      <line x1="10" y1="152" x2="290" y2="152" stroke="#dfe1e6" strokeWidth="2" strokeLinecap="round" />

      {/* Rodas: o pneu é o anel; acende com a situação do pneu. */}
      <g className={pulsa("roda_traseira")}>
        <circle cx="68" cy="118" r="32" fill="none" stroke={cor("roda_traseira")} strokeWidth="9" />
      </g>
      <g className={pulsa("roda_dianteira")}>
        <circle cx="238" cy="118" r="32" fill="none" stroke={cor("roda_dianteira")} strokeWidth="9" />
      </g>
      <circle cx="68" cy="118" r="22" fill="none" stroke={NEUTRO} strokeWidth="2" />
      <circle cx="238" cy="118" r="22" fill="none" stroke={NEUTRO} strokeWidth="2" />

      {/* Freios: disco/tambor no centro das rodas. */}
      <g className={pulsa("freios")}>
        <circle cx="68" cy="118" r="10" fill={cor("freios")} />
        <circle cx="238" cy="118" r="10" fill={cor("freios")} />
      </g>
      <circle cx="68" cy="118" r="3" fill="#fff" />
      <circle cx="238" cy="118" r="3" fill="#fff" />

      {/* Relação: coroa na roda traseira, pinhão no motor e a corrente entre eles. */}
      <g className={pulsa("corrente")} stroke={cor("corrente")} fill="none" strokeWidth="4" strokeLinecap="round">
        <circle cx="68" cy="118" r="15" strokeWidth="3" />
        <line x1="68" y1="103" x2="134" y2="112" />
        <line x1="68" y1="133" x2="134" y2="124" />
      </g>

      {/* Balança traseira e garfo dianteiro. */}
      <line x1="68" y1="118" x2="136" y2="114" stroke={NEUTRO} strokeWidth="5" strokeLinecap="round" />
      <line x1="238" y1="118" x2="212" y2="52" stroke={NEUTRO} strokeWidth="5" strokeLinecap="round" />

      {/* Motor: acende com a situação do óleo. */}
      <g className={pulsa("motor")}>
        <rect x="118" y="96" width="46" height="38" rx="9" fill={cor("motor")} />
        <path d="M126 104h30M126 112h30M126 120h22" stroke="#fff" strokeOpacity="0.55" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <circle cx="140" cy="118" r="5" fill={NEUTRO} />

      {scooter ? (
        <>
          {/* Quadro aberto (Biz, Pop): carenagem baixa e assento sobre o motor. */}
          <path d="M98 112 Q150 140 196 92 L210 58" fill="none" stroke={NEUTRO} strokeWidth="6" strokeLinecap="round" />
          <path d="M84 84 Q120 70 150 82 L150 92 Q118 86 90 96 Z" fill={NEUTRO} />
          <path d="M92 76 h56" stroke={NEUTRO} strokeWidth="9" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Moto de rua (CG, Factor): tanque, banco e quadro. */}
          <path d="M100 98 L150 80 L206 62" fill="none" stroke={NEUTRO} strokeWidth="6" strokeLinecap="round" />
          <path d="M150 64 Q176 50 204 60 L196 82 Q172 78 152 86 Z" fill={NEUTRO} />
          <path d="M84 80 Q112 66 150 70" fill="none" stroke={NEUTRO} strokeWidth="10" strokeLinecap="round" />
          <path d="M80 88 L104 98" stroke={NEUTRO} strokeWidth="5" strokeLinecap="round" />
        </>
      )}

      {/* Guidão, farol e escapamento. */}
      <path d="M206 50 L222 42 M206 50 L198 40" stroke={NEUTRO} strokeWidth="4" strokeLinecap="round" />
      <circle cx="226" cy="62" r="6" fill="#ffd36a" stroke={NEUTRO} strokeWidth="2" />
      <path d="M150 134 Q120 146 84 140" fill="none" stroke={NEUTRO_CLARO} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
