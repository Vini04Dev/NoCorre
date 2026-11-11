import { COR_SITUACAO, type ParteDesenho, type Situacao } from "@/lib/moto";

const CORPO = "#2b2d42";
const METAL = "#9196a2";
const NEUTRO = "#c9cdd4";

type Props = {
  /** Situação de cada parte; parte sem item acompanhado fica neutra. */
  partes: Partial<Record<ParteDesenho, Situacao>>;
  /** Biz, Pop e scooters têm o quadro aberto, sem tanque entre as pernas. */
  scooter?: boolean;
  descricao: string;
};

function Roda({ x, y, r, corPneu, corFreio, classePneu, classeFreio }: {
  x: number;
  y: number;
  r: number;
  corPneu: string;
  corFreio: string;
  classePneu: string;
  classeFreio: string;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={corPneu} strokeWidth="8" className={classePneu} />
      <circle cx={x} cy={y} r={r - 7} fill="#fff" stroke={METAL} strokeWidth="1.5" />
      {/* Raios */}
      {[0, 60, 120].map((angulo) => {
        const rad = (angulo * Math.PI) / 180;
        const dx = Math.cos(rad) * (r - 8);
        const dy = Math.sin(rad) * (r - 8);
        return <line key={angulo} x1={x - dx} y1={y - dy} x2={x + dx} y2={y + dy} stroke={METAL} strokeWidth="1.5" />;
      })}
      {/* Disco/tambor de freio */}
      <circle cx={x} cy={y} r={r * 0.36} fill={corFreio} className={classeFreio} />
      <circle cx={x} cy={y} r="3" fill={CORPO} />
    </g>
  );
}

/**
 * Moto de lado, desenhada em SVG (leve e sem depender de modelo 3D): cada peça
 * acompanhada ganha a cor da situação — verde em dia, amarelo de olho, laranja
 * trocar logo, vermelho passou da hora — e pulsa quando precisa de troca.
 * Dois formatos: moto de rua (CG, Factor) e cub/scooter (Biz, Pop).
 */
export function DesenhoMoto({ partes, scooter = false, descricao }: Props) {
  const cor = (parte: ParteDesenho) => (partes[parte] ? COR_SITUACAO[partes[parte]!] : NEUTRO);
  const pulsa = (parte: ParteDesenho) =>
    partes[parte] === "trocar" || partes[parte] === "vencido" ? "animate-pulse motion-reduce:animate-none" : "";

  const traseira = scooter ? { x: 78, y: 124, r: 26 } : { x: 72, y: 120, r: 31 };
  const dianteira = scooter ? { x: 228, y: 124, r: 26 } : { x: 232, y: 120, r: 31 };
  const pinhao = scooter ? { x: 118, y: 122 } : { x: 140, y: 118 };

  return (
    <svg viewBox="0 0 300 165" role="img" aria-label={descricao} className="h-auto w-full max-w-md">
      <ellipse cx="152" cy="154" rx="128" ry="5" fill="#eceef1" />

      {/* Relação: corrente da coroa (roda traseira) ao pinhão (motor). */}
      <g className={pulsa("corrente")} stroke={cor("corrente")} strokeWidth="3.5" strokeLinecap="round" fill="none">
        <line x1={traseira.x} y1={traseira.y - 12} x2={pinhao.x} y2={pinhao.y - 5} />
        <line x1={traseira.x} y1={traseira.y + 12} x2={pinhao.x} y2={pinhao.y + 5} />
        <circle cx={traseira.x} cy={traseira.y} r="12" strokeWidth="3" />
      </g>

      <Roda
        {...traseira}
        corPneu={cor("roda_traseira")}
        corFreio={cor("freios")}
        classePneu={pulsa("roda_traseira")}
        classeFreio={pulsa("freios")}
      />
      <Roda
        {...dianteira}
        corPneu={cor("roda_dianteira")}
        corFreio={cor("freios")}
        classePneu={pulsa("roda_dianteira")}
        classeFreio={pulsa("freios")}
      />

      {scooter ? (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Balança e paralamas */}
          <line x1={traseira.x} y1={traseira.y} x2="126" y2="116" stroke={CORPO} strokeWidth="5" />
          <path d="M54 104 Q78 84 104 98" fill="none" stroke={CORPO} strokeWidth="5" />
          {/* Motor baixo, perto da roda de trás */}
          <g className={pulsa("motor")}>
            <rect x="104" y="104" width="38" height="28" rx="8" fill={cor("motor")} />
            <path d="M112 112h22M112 120h16" stroke="#fff" strokeOpacity="0.6" strokeWidth="2.5" />
          </g>
          {/* Quadro aberto: escudo dianteiro descendo ao assoalho e subindo ao banco */}
          <path d="M206 56 Q190 96 176 116 L132 116" fill="none" stroke={CORPO} strokeWidth="7" />
          <path d="M78 96 Q90 76 132 80 L140 104 L100 104 Z" fill={CORPO} />
          <path d="M84 76 Q110 66 142 74" fill="none" stroke="#3d405b" strokeWidth="9" />
          {/* Garfo, guidão e farol */}
          <line x1={dianteira.x} y1={dianteira.y} x2="206" y2="56" stroke={METAL} strokeWidth="5" />
          <path d="M196 46 L218 40" stroke={CORPO} strokeWidth="4" />
          <circle cx="214" cy="60" r="6" fill="#ffd36a" stroke={CORPO} strokeWidth="2" />
          <path d="M210 102 Q228 88 248 100" fill="none" stroke={CORPO} strokeWidth="5" />
        </g>
      ) : (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Balança traseira, amortecedor e paralama */}
          <line x1={traseira.x} y1={traseira.y} x2="142" y2="114" stroke={CORPO} strokeWidth="5" />
          <line x1="86" y1="84" x2={traseira.x + 8} y2={traseira.y - 4} stroke={METAL} strokeWidth="4" />
          <path d="M44 100 Q60 78 92 82" fill="none" stroke={CORPO} strokeWidth="5" />
          {/* Escapamento */}
          <path d="M150 130 Q120 140 66 132" fill="none" stroke={METAL} strokeWidth="6" />
          {/* Motor sob o tanque: acende com a situação do óleo */}
          <g className={pulsa("motor")}>
            <path d="M124 96 L168 92 L172 124 Q150 134 126 128 Z" fill={cor("motor")} />
            <path d="M134 102h28M134 110h30M134 118h28" stroke="#fff" strokeOpacity="0.6" strokeWidth="2.5" />
          </g>
          {/* Quadro: tubo do banco e tubo descendo até o motor */}
          <path d="M92 82 L132 84 L196 60" fill="none" stroke={CORPO} strokeWidth="5" />
          <line x1="196" y1="60" x2="168" y2="100" stroke={CORPO} strokeWidth="5" />
          {/* Banco reto e tanque, o perfil da CG */}
          <path d="M76 74 Q78 66 92 66 L138 66 Q146 66 146 74 L146 78 L80 80 Z" fill="#1d1e2c" />
          <path d="M140 64 Q150 50 178 50 Q196 52 200 62 L190 80 Q166 76 146 80 Z" fill={CORPO} />
          <path d="M152 58 Q168 54 184 58" fill="none" stroke="#ffd36a" strokeWidth="2.5" />
          {/* Lanterna traseira */}
          <rect x="60" y="72" width="12" height="6" rx="2" fill="#cc0000" />
          {/* Garfo, guidão, painel e farol */}
          <line x1={dianteira.x} y1={dianteira.y} x2="202" y2="48" stroke={METAL} strokeWidth="5" />
          <path d="M190 40 L214 36" stroke={CORPO} strokeWidth="4" />
          <circle cx="216" cy="58" r="7" fill="#ffd36a" stroke={CORPO} strokeWidth="2" />
          <path d="M214 96 Q232 82 252 96" fill="none" stroke={CORPO} strokeWidth="5" />
        </g>
      )}

      {/* Pinhão por cima do motor */}
      <circle cx={pinhao.x} cy={pinhao.y} r="5" fill={CORPO} />
    </svg>
  );
}
