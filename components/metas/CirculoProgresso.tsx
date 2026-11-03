type Props = {
  percentual: number;
  /** Classe de cor do traço (ex.: "stroke-positivo"). */
  traco: string;
  tamanho?: number;
  espessura?: number;
  className?: string;
};

/** Anel de progresso com o percentual no meio. Acima de 100% o anel fica cheio. */
export function CirculoProgresso({ percentual, traco, tamanho = 60, espessura = 7, className = "" }: Props) {
  const raio = (tamanho - espessura) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const preenchido = Math.min(Math.max(percentual, 0), 100) / 100;

  return (
    <div className={`relative grid shrink-0 place-items-center ${className}`} style={{ width: tamanho, height: tamanho }}>
      <svg width={tamanho} height={tamanho} className="-rotate-90" aria-hidden>
        <circle cx={tamanho / 2} cy={tamanho / 2} r={raio} fill="none" strokeWidth={espessura} className="stroke-cinza-claro" />
        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          fill="none"
          strokeWidth={espessura}
          strokeDasharray={circunferencia}
          strokeDashoffset={circunferencia * (1 - preenchido)}
          className={traco}
        />
      </svg>
      <span className="absolute font-extrabold" style={{ fontSize: tamanho * 0.22 }}>
        {percentual}%
      </span>
    </div>
  );
}
