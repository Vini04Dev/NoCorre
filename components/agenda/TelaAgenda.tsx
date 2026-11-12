"use client";

import Link from "next/link";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { useEstadoDaTela } from "@/hooks/useEstadoDaTela";
import { useEventos, type Evento } from "@/hooks/useEventos";
import {
  CORES_EVENTO,
  corDoEvento,
  DIAS_CURTOS,
  deCampoData,
  diasDaSemana,
  inicioDoDia,
  MESES_LONGOS,
  mesmoDia,
  paraCampoData,
  rotuloDiaLongo,
  semanasDoMes,
  somarDias,
} from "@/lib/agenda";
import { horaCurta } from "@/lib/data";
import { LinhaDoTempo } from "./LinhaDoTempo";

type Visao = "dia" | "semana" | "mes";

const VISOES: { valor: Visao; rotulo: string }[] = [
  { valor: "dia", rotulo: "Dia" },
  { valor: "semana", rotulo: "Semana" },
  { valor: "mes", rotulo: "Mês" },
];

/** Eventos que tocam o dia `dia` (inclusive os que vêm do dia anterior). */
function doDia(eventos: Evento[], dia: Date) {
  const inicio = inicioDoDia(dia);
  const fim = somarDias(inicio, 1);
  return eventos.filter((e) => new Date(e.data_hora_inicial) < fim && new Date(e.data_hora_final) >= inicio);
}

function Pontos({ eventos }: { eventos: Evento[] }) {
  // Até 3 pontos: um por cor diferente do dia.
  const cores = [...new Set(eventos.map((e) => e.cor))].slice(0, 3);
  return (
    <span aria-hidden className="flex h-1.5 justify-center gap-0.5">
      {cores.map((cor) => (
        <span key={cor} className="size-1.5 rounded-full" style={{ background: corDoEvento(cor).forte }} />
      ))}
    </span>
  );
}

/** Faixa com os 7 dias da semana; o escolhido fica em azul-marinho, como no Figma. */
function TiraDaSemana({ dias, escolhido, eventos, aoEscolher }: {
  dias: Date[];
  escolhido: Date;
  eventos: Evento[];
  aoEscolher: (dia: Date) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {dias.map((dia, i) => {
        const ativo = mesmoDia(dia, escolhido);
        return (
          <button
            key={dia.toISOString()}
            type="button"
            onClick={() => aoEscolher(dia)}
            aria-pressed={ativo}
            aria-label={rotuloDiaLongo(dia)}
            className={`flex flex-col items-center gap-0.5 rounded-[10px] py-1.5 ${ativo ? "bg-marinho text-white" : ""}`}
          >
            <span className={`text-[11px] ${ativo ? "text-cinza-claro" : "text-cinza-escuro"}`}>{DIAS_CURTOS[i]}</span>
            <span className="text-base font-bold">{dia.getDate()}</span>
            <Pontos eventos={doDia(eventos, dia)} />
          </button>
        );
      })}
    </div>
  );
}

function CabecalhoSemana({ dias, escolhido }: { dias: Date[]; escolhido: Date }) {
  const hoje = new Date();
  return (
    <div className="flex pr-2">
      <span className="w-11 shrink-0" />
      <div className="grid flex-1 grid-cols-7 gap-[3px] text-center">
        {dias.map((dia, i) => {
          const destaque = mesmoDia(dia, escolhido) || mesmoDia(dia, hoje);
          return (
            <span key={dia.toISOString()} className={`flex flex-col rounded-[8px] py-1 ${destaque ? "bg-marinho text-white" : ""}`}>
              <span className={`text-[10px] ${destaque ? "text-cinza-claro" : "text-cinza-escuro"}`}>{DIAS_CURTOS[i]}</span>
              <span className="text-sm font-bold">{dia.getDate()}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function GradeDoMes({ referencia, escolhido, eventos, aoEscolher }: {
  referencia: Date;
  escolhido: Date;
  eventos: Evento[];
  aoEscolher: (dia: Date) => void;
}) {
  return (
    <div className="rounded-[12px] border border-black/8 bg-white p-3 shadow-cartao">
      <div className="grid grid-cols-7 pb-1 text-center text-[11px] text-cinza-escuro">
        {DIAS_CURTOS.map((dia) => (
          <span key={dia}>{dia}</span>
        ))}
      </div>
      {semanasDoMes(referencia).map((semana) => (
        <div key={semana[0].toISOString()} className="grid grid-cols-7">
          {semana.map((dia) => {
            const ativo = mesmoDia(dia, escolhido);
            const doMes = dia.getMonth() === referencia.getMonth();
            return (
              <button
                key={dia.toISOString()}
                type="button"
                onClick={() => aoEscolher(dia)}
                aria-pressed={ativo}
                aria-label={rotuloDiaLongo(dia)}
                className="flex flex-col items-center gap-0.5 py-1.5"
              >
                <span
                  className={`grid size-8 place-items-center rounded-full text-sm ${
                    ativo ? "bg-marinho font-bold text-white" : doMes ? "" : "text-cinza"
                  }`}
                >
                  {dia.getDate()}
                </span>
                <Pontos eventos={doDia(eventos, dia)} />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ListaDoDia({ dia, eventos }: { dia: Date; eventos: Evento[] }) {
  const lista = doDia(eventos, dia);
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-bold">{rotuloDiaLongo(dia)}</h2>
      {lista.length === 0 ? (
        <p className="rounded-[12px] border border-cinza-claro bg-white py-6 text-center text-xs text-cinza-escuro">
          Nenhum compromisso neste dia.{" "}
          <Link href={`/agenda/novo?data=${paraCampoData(dia)}`} className="font-bold text-dourado">
            Adicionar
          </Link>
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {lista.map((evento) => (
            <li key={evento.id}>
              <Link
                href={`/agenda/${evento.id}`}
                className="flex items-center gap-3 rounded-[12px] border border-black/8 border-l-4 bg-white py-2.5 pr-3 pl-3 shadow-cartao"
                style={{ borderLeftColor: corDoEvento(evento.cor).forte }}
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-semibold">{evento.descricao}</span>
                  <span className="text-xs text-cinza-escuro">
                    {horaCurta(new Date(evento.data_hora_inicial))} – {horaCurta(new Date(evento.data_hora_final))}
                  </span>
                </span>
                <span aria-hidden className="text-lg text-cinza">
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * Agenda: visões Dia (linha do tempo do dia), Semana (sete colunas) e Mês
 * (grade com pontos e a lista do dia escolhido), como no Figma. A visão e o
 * dia escolhido ficam guardados enquanto o app está aberto.
 */
export function TelaAgenda() {
  const [visao, setVisao] = useEstadoDaTela<Visao>("agenda:visao", "dia");
  const [campoData, setCampoData] = useEstadoDaTela("agenda:data", paraCampoData(new Date()));
  const escolhido = deCampoData(campoData) ?? inicioDoDia(new Date());
  const escolher = (dia: Date) => setCampoData(paraCampoData(dia));

  const semana = diasDaSemana(escolhido);
  const semanasMes = semanasDoMes(escolhido);
  const [inicio, fim] =
    visao === "mes"
      ? [semanasMes[0][0], somarDias(semanasMes[semanasMes.length - 1][6], 1)]
      : [semana[0], somarDias(semana[6], 1)];
  const { data: eventos = [], isError, error } = useEventos(inicio, fim);

  // Setas: Dia e Semana andam de semana em semana; Mês, de mês em mês.
  function andar(passo: 1 | -1) {
    if (visao === "mes") {
      const alvo = new Date(escolhido.getFullYear(), escolhido.getMonth() + passo, 1);
      escolher(alvo);
    } else {
      escolher(somarDias(escolhido, passo * 7));
    }
  }

  const hoje = inicioDoDia(new Date());
  const ehHoje = mesmoDia(escolhido, hoje);

  return (
    <main className="flex flex-col gap-3.5 px-[17px] pt-[calc(env(safe-area-inset-top)+12px)] pb-6 lg:px-0 lg:pt-2">
      <CabecalhoTela
        titulo="Agenda"
        voltarPara="/"
        tituloGrande
        acao={
          <Link
            href={`/agenda/novo?data=${campoData}`}
            aria-label="Novo evento"
            className="grid size-[38px] place-items-center rounded-full bg-linear-to-r from-dourado-claro to-dourado text-[22px] font-semibold"
          >
            +
          </Link>
        }
      />

      <div role="tablist" className="flex rounded-[10px] bg-cinza-fundo p-1 lg:max-w-sm">
        {VISOES.map(({ valor, rotulo }) => (
          <button
            key={valor}
            type="button"
            role="tab"
            aria-selected={visao === valor}
            onClick={() => setVisao(valor)}
            className={`flex-1 rounded-lg py-1.5 text-[13px] ${visao === valor ? "bg-white font-semibold shadow-cartao" : "font-medium"}`}
          >
            {rotulo}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button type="button" onClick={() => andar(-1)} aria-label="Anterior" className="px-2 py-1 text-xl font-semibold">
          ‹
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[15px] font-bold">
            {MESES_LONGOS[escolhido.getMonth()]} {escolhido.getFullYear()}
          </span>
          {!ehHoje && (
            <button type="button" onClick={() => escolher(hoje)} className="text-[11px] font-semibold text-dourado">
              Voltar para hoje
            </button>
          )}
        </div>
        <button type="button" onClick={() => andar(1)} aria-label="Próximo" className="px-2 py-1 text-xl font-semibold">
          ›
        </button>
      </div>

      {isError && <p className="text-center text-xs text-negativo">{error.message}</p>}

      {visao === "dia" && (
        <>
          <TiraDaSemana dias={semana} escolhido={escolhido} eventos={eventos} aoEscolher={escolher} />
          <LinhaDoTempo dias={[escolhido]} eventos={doDia(eventos, escolhido)} />
          <div className="flex items-center gap-2 text-[11px] text-cinza-escuro">
            Cores:
            {CORES_EVENTO.map(({ valor, rotulo, forte }) => (
              <span key={valor} title={rotulo} className="size-3 rounded-full" style={{ background: forte }} />
            ))}
          </div>
        </>
      )}

      {visao === "semana" && (
        <div className="flex flex-col gap-1">
          <CabecalhoSemana dias={semana} escolhido={escolhido} />
          <LinhaDoTempo dias={semana} eventos={eventos} />
        </div>
      )}

      {visao === "mes" && (
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start lg:gap-6">
          <GradeDoMes referencia={escolhido} escolhido={escolhido} eventos={eventos} aoEscolher={escolher} />
          <ListaDoDia dia={escolhido} eventos={eventos} />
        </div>
      )}
    </main>
  );
}
