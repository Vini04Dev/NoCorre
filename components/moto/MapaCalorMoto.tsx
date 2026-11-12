import { useId } from "react";
import { COR_SITUACAO, type ParteDesenho, type Situacao } from "@/lib/moto";

export type CalorParte = { situacao: Situacao; fracao: number };

type Props = {
  /** Situação e quanto do intervalo já rodou, por parte; parte sem item fica sem calor. */
  partes: Partial<Record<ParteDesenho, CalorParte>>;
  descricao: string;
};

/** Onde o calor de cada parte aparece no desenho (viewBox 375 × 255). */
const MANCHAS: Record<ParteDesenho, { cx: number; cy: number; rx: number; ry: number }[]> = {
  motor: [{ cx: 204, cy: 160, rx: 40, ry: 36 }],
  corrente: [{ cx: 130, cy: 184, rx: 58, ry: 14 }],
  roda_traseira: [{ cx: 80, cy: 188, rx: 50, ry: 50 }],
  roda_dianteira: [{ cx: 298, cy: 188, rx: 52, ry: 52 }],
  freios: [
    { cx: 298, cy: 188, rx: 22, ry: 22 },
    { cx: 80, cy: 188, rx: 17, ry: 17 },
  ],
};

const TRASEIRA = { x: 80, y: 188, r: 44 };
const DIANTEIRA = { x: 298, y: 188, r: 46 };

function Roda({ x, y, r, cor }: { x: number; y: number; r: number; cor?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={cor ?? "currentColor"} strokeWidth="9" />
      <circle cx={x} cy={y} r={r - 8} fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="2.5" />
      {/* Roda de liga leve: cinco braços */}
      {[18, 90, 162, 234, 306].map((angulo) => {
        const rad = (angulo * Math.PI) / 180;
        return (
          <line
            key={angulo}
            x1={x + Math.cos(rad) * 8}
            y1={y + Math.sin(rad) * 8}
            x2={x + Math.cos(rad) * (r - 9)}
            y2={y + Math.sin(rad) * (r - 9)}
            stroke="currentColor"
            strokeOpacity="0.5"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx={x} cy={y} r="7" fill="currentColor" />
    </g>
  );
}

/**
 * Moto de rua de lado (proporções de uma CG 160) com mapa de calor do desgaste:
 * cada peça acompanhada ganha uma mancha na cor da situação, mais forte quanto
 * mais perto da troca, e pulsa quando já é hora de trocar.
 *
 * SVG de propósito: poucos KB, nada para baixar, sem 3D, e acompanha o tema
 * (o corpo usa a cor do texto, currentColor).
 */
export function MapaCalorMoto({ partes, descricao }: Props) {
  const id = useId();
  const filtro = `calor-${id.replace(/[^a-zA-Z0-9]/g, "")}`;
  const corDa = (parte: ParteDesenho) => (partes[parte] ? COR_SITUACAO[partes[parte]!.situacao] : undefined);
  const metal = (parte: ParteDesenho) => ({
    stroke: corDa(parte) ?? "currentColor",
    strokeOpacity: corDa(parte) ? 1 : 0.55,
  });

  return (
    <svg viewBox="0 0 375 255" role="img" aria-label={descricao} className="h-auto w-full max-w-md text-marinho">
      <defs>
        <filter id={filtro} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <ellipse cx="190" cy="240" rx="172" ry="5" fill="currentColor" opacity="0.08" />

      {/* Escapamento, balança e amortecedor */}
      <path
        d="M212 200 Q160 216 72 207 L42 197"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <line x1={TRASEIRA.x} y1={TRASEIRA.y} x2="172" y2="176" stroke="currentColor" strokeOpacity="0.85" strokeWidth="7" strokeLinecap="round" />
      <line x1="106" y1="110" x2="88" y2="174" stroke="currentColor" strokeOpacity="0.5" strokeWidth="5" strokeLinecap="round" />

      {/* Relação: coroa na roda de trás, corrente e pinhão no motor */}
      <g fill="none" strokeWidth="3" strokeLinecap="round" {...metal("corrente")}>
        <circle cx={TRASEIRA.x} cy={TRASEIRA.y} r="14" />
        <line x1={TRASEIRA.x} y1={TRASEIRA.y - 14} x2="178" y2="174" />
        <line x1={TRASEIRA.x} y1={TRASEIRA.y + 14} x2="178" y2="186" />
        <circle cx="178" cy="180" r="6" />
      </g>

      <Roda {...TRASEIRA} cor={corDa("roda_traseira")} />
      <Roda {...DIANTEIRA} cor={corDa("roda_dianteira")} />
      {/* Disco de freio dianteiro e pinça */}
      <circle cx={DIANTEIRA.x} cy={DIANTEIRA.y} r="20" fill="none" strokeWidth="3" {...metal("freios")} />
      <rect x="306" y="162" width="10" height="16" rx="3" fill="currentColor" opacity="0.8" transform="rotate(-20 311 170)" />

      {/* Garfo, para-lama, guidão e retrovisor */}
      <line x1={DIANTEIRA.x} y1={DIANTEIRA.y} x2="262" y2="72" stroke="currentColor" strokeOpacity="0.55" strokeWidth="7" strokeLinecap="round" />
      <path d="M268 146 Q298 128 332 146" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M234 64 L262 60" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="252" y1="60" x2="246" y2="26" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="246" cy="21" rx="6" ry="7" fill="currentColor" />

      {/* Carenagem do farol, tanque, tampa lateral, banco e rabeta */}
      <path d="M260 70 L284 64 Q298 78 291 100 L270 110 Z" fill="currentColor" />
      <path d="M166 94 Q176 68 214 62 L258 66 Q268 82 256 114 Q222 118 200 120 L168 114 Z" fill="currentColor" />
      <path d="M190 74 Q214 66 244 70" fill="none" stroke="var(--color-white)" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 112 L168 108 L178 132 L112 142 Z" fill="currentColor" opacity="0.85" />
      <path d="M46 100 Q58 86 100 88 L172 92 L168 110 Q120 110 58 114 Z" fill="currentColor" />
      <path d="M18 112 L48 98 L60 114 L28 126 Z" fill="currentColor" opacity="0.9" />
      <rect x="14" y="110" width="12" height="7" rx="2" fill="#cc0000" transform="rotate(-24 20 113)" />
      <path d="M22 132 Q22 150 36 160" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />

      {/* Motor sob o tanque: cilindro com aletas e cárter (onde fica o óleo) */}
      <path
        d="M170 122 L234 118 L240 150 Q238 196 206 200 L178 196 Q164 168 170 122 Z"
        fill={corDa("motor") ?? "currentColor"}
        opacity={corDa("motor") ? 0.9 : 0.6}
      />
      {[130, 139, 148].map((y) => (
        <line key={y} x1="180" y1={y} x2="230" y2={y - 2} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      ))}

      {/* Calor: manchas desfocadas, mais fortes quanto mais perto da troca */}
      <g filter={`url(#${filtro})`}>
        {(Object.keys(MANCHAS) as ParteDesenho[]).map((parte) => {
          const calor = partes[parte];
          if (!calor) return null;
          const forte = calor.situacao === "trocar" || calor.situacao === "vencido";
          return MANCHAS[parte].map((m, i) => (
            <ellipse
              key={`${parte}-${i}`}
              {...m}
              fill={COR_SITUACAO[calor.situacao]}
              opacity={0.2 + 0.45 * Math.min(calor.fracao, 1)}
              className={forte ? "animate-pulse motion-reduce:animate-none" : undefined}
            />
          ));
        })}
      </g>
    </svg>
  );
}
