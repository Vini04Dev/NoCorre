import Link from "next/link";
import type { Evento } from "@/hooks/useEventos";
import { corDoEvento, horasNoDia, inicioDoDia, somarDias } from "@/lib/agenda";
import { horaCurta } from "@/lib/data";

/** Altura de uma hora na linha do tempo, como no Figma (~30 px por hora). */
const HORA_PX = 30;

type Bloco = { evento: Evento; topo: number; altura: number; faixa: number; faixas: number };

/**
 * Posiciona os eventos de um dia. Eventos que se sobrepõem dividem a largura
 * em faixas lado a lado, para nenhum esconder o outro.
 */
function blocosDoDia(eventos: Evento[], dia: Date, horaInicial: number): Bloco[] {
  const fimDoDia = somarDias(inicioDoDia(dia), 1);
  const doDia = eventos
    .filter((e) => new Date(e.data_hora_inicial) < fimDoDia && new Date(e.data_hora_final) >= inicioDoDia(dia))
    .map((evento) => ({
      evento,
      inicio: horasNoDia(new Date(evento.data_hora_inicial), dia),
      fim: horasNoDia(new Date(evento.data_hora_final), dia),
    }))
    .sort((a, b) => a.inicio - b.inicio);

  const blocos: Bloco[] = [];
  let grupo: (typeof doDia)[number][] = [];
  let fimDoGrupo = -1;
  const fecharGrupo = () => {
    // Em cada grupo de eventos encavalados, cada um pega a primeira faixa livre.
    const finaisDasFaixas: number[] = [];
    const comFaixa = grupo.map((item) => {
      let faixa = finaisDasFaixas.findIndex((fim) => fim <= item.inicio);
      if (faixa === -1) faixa = finaisDasFaixas.length;
      finaisDasFaixas[faixa] = Math.max(item.fim, item.inicio + 0.25);
      return { item, faixa };
    });
    for (const { item, faixa } of comFaixa) {
      blocos.push({
        evento: item.evento,
        topo: (item.inicio - horaInicial) * HORA_PX,
        altura: Math.max(16, (item.fim - item.inicio) * HORA_PX - 2),
        faixa,
        faixas: finaisDasFaixas.length,
      });
    }
    grupo = [];
  };
  for (const item of doDia) {
    if (grupo.length && item.inicio >= fimDoGrupo) fecharGrupo();
    grupo.push(item);
    fimDoGrupo = Math.max(fimDoGrupo, item.fim, item.inicio + 0.25);
  }
  if (grupo.length) fecharGrupo();
  return blocos;
}

/** Faixa de horas mostrada: no mínimo das 8h às 22h, alargada se houver evento fora disso. */
function faixaDeHoras(eventos: Evento[], dias: Date[]) {
  let inicio = 8;
  let fim = 22;
  for (const dia of dias) {
    for (const e of eventos) {
      const i = horasNoDia(new Date(e.data_hora_inicial), dia);
      const f = horasNoDia(new Date(e.data_hora_final), dia);
      if (f > 0 && i < 24) {
        inicio = Math.min(inicio, Math.floor(i));
        fim = Math.max(fim, Math.ceil(f));
      }
    }
  }
  return { inicio, fim: Math.min(24, Math.max(fim, inicio + 1)) };
}

/**
 * Linha do tempo das visões Dia (uma coluna, com o horário escrito) e Semana
 * (sete colunas, só o nome). Tocar num evento abre a edição.
 */
export function LinhaDoTempo({ dias, eventos }: { dias: Date[]; eventos: Evento[] }) {
  const { inicio, fim } = faixaDeHoras(eventos, dias);
  const horas = Array.from({ length: fim - inicio }, (_, i) => inicio + i);
  const compacta = dias.length > 1;

  return (
    <div className="flex rounded-[12px] border border-black/8 bg-white py-2 pr-2 shadow-cartao">
      <ol aria-hidden className="w-11 shrink-0">
        {horas.map((hora) => (
          <li key={hora} style={{ height: HORA_PX }} className="-translate-y-1.5 pl-2 text-[10px] text-cinza-escuro">
            {compacta ? `${String(hora).padStart(2, "0")}h` : `${String(hora).padStart(2, "0")}:00`}
          </li>
        ))}
      </ol>
      <div className="flex min-w-0 flex-1 gap-[3px]">
        {dias.map((dia) => (
          <div key={dia.toISOString()} className="relative min-w-0 flex-1" style={{ height: horas.length * HORA_PX }}>
            {horas.map((hora, i) => (
              <span
                key={hora}
                aria-hidden
                className="absolute inset-x-0 border-t border-cinza-claro/70"
                style={{ top: i * HORA_PX }}
              />
            ))}
            {blocosDoDia(eventos, dia, inicio).map(({ evento, topo, altura, faixa, faixas }) => {
              const cor = corDoEvento(evento.cor);
              const horario = `${horaCurta(new Date(evento.data_hora_inicial))}–${horaCurta(new Date(evento.data_hora_final))}`;
              return (
                <Link
                  key={evento.id}
                  href={`/agenda/${evento.id}`}
                  aria-label={`${evento.descricao}, ${horario}`}
                  className="absolute overflow-hidden rounded-[6px] border-l-[3px] px-1.5 py-0.5 text-left"
                  style={{
                    top: topo + 1,
                    height: altura,
                    left: `calc(${(faixa / faixas) * 100}% + 1px)`,
                    width: `calc(${100 / faixas}% - 2px)`,
                    background: cor.fundo,
                    borderColor: cor.forte,
                  }}
                >
                  <span className={`block truncate font-semibold ${compacta ? "text-[9px]" : "text-[12px]"}`}>
                    {evento.descricao}
                    {!compacta && altura < 30 && (
                      <span className="ml-1.5 font-normal text-cinza-escuro">{horario}</span>
                    )}
                  </span>
                  {!compacta && altura >= 30 && (
                    <span className="block truncate text-[10px] text-cinza-escuro">{horario}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
