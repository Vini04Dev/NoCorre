"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { CampoSugestoes } from "@/components/ui/CampoSugestoes";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { ConfirmarExclusao } from "@/components/ui/ConfirmarExclusao";
import { CampoRepeticao } from "./CampoRepeticao";
import { EscolherEscopo } from "./EscolherEscopo";
import {
  useDescricoesEventos,
  useExcluirEvento,
  useSalvarEvento,
  useSerie,
  type Escopo,
  type Evento,
} from "@/hooks/useEventos";
import { CORES_EVENTO, corDoEvento, deCampoData, paraCampoData, type CorEvento } from "@/lib/agenda";
import { dataHoraParaCampos } from "@/lib/data";
import { diasDaRepeticao, fimPadrao, fraseRegra, type DiaSemana, type RegraRepeticao, type Repeticao } from "@/lib/repeticao";
import { contarUsos } from "@/lib/sugestoes";

type Erros = { descricao?: string; data?: string; horario?: string; ate?: string };

/**
 * Novo evento ou, recebendo `evento`, edição. Um evento é de um dia só, com
 * início e fim (o banco também garante fim >= início), e pode se repetir (regras
 * em lib/repeticao.ts). Num evento que se repete, salvar e excluir perguntam se
 * vale só para este dia ou para ele e os próximos. A prévia mostra como ele vai
 * aparecer na Agenda.
 */
export function FormularioEvento({ evento, dataInicial }: { evento?: Evento; dataInicial?: string }) {
  const router = useRouter();
  const salvar = useSalvarEvento();
  const excluir = useExcluirEvento();
  const { data: usadas = [] } = useDescricoesEventos();

  const inicio = evento ? dataHoraParaCampos(new Date(evento.data_hora_inicial)) : null;
  const fim = evento ? dataHoraParaCampos(new Date(evento.data_hora_final)) : null;
  const [descricao, setDescricao] = useState(evento?.descricao ?? "");
  const [data, setData] = useState(inicio?.data ?? dataInicial ?? paraCampoData(new Date()));
  const [horaInicio, setHoraInicio] = useState(inicio?.hora ?? "18:00");
  const [horaFim, setHoraFim] = useState(fim?.hora ?? "22:00");
  const [cor, setCor] = useState<CorEvento>(evento?.cor ?? "amarelo");
  const tipoInicial = (evento?.repeticao as Repeticao | null) ?? "nunca";
  const [tipo, setTipo] = useState<Repeticao | "nunca">(tipoInicial);
  // "Até" e os dias só viram estado quando a pessoa mexe. Antes disso valem os da
  // série (na edição) ou o padrão: o dia da semana da data escolhida.
  const [ateEscolhido, setAteEscolhido] = useState<string | null>(null);
  const [diasEscolhidos, setDiasEscolhidos] = useState<DiaSemana[] | null>(null);
  const { data: serie } = useSerie(evento?.serie_id);
  const [erros, setErros] = useState<Erros>({});
  const [confirmando, setConfirmando] = useState(false);
  const [perguntando, setPerguntando] = useState<"salvar" | "excluir" | null>(null);

  const dia = deCampoData(data);
  const repete = tipo !== "nunca";
  const mesmaRegra = tipo === tipoInicial && Boolean(serie);
  const diasSemana: DiaSemana[] =
    diasEscolhidos ?? (mesmaRegra && serie ? serie.diasSemana : dia ? [dia.getDay() as DiaSemana] : []);
  const ate =
    ateEscolhido ??
    (mesmaRegra && serie?.fim ? paraCampoData(serie.fim) : repete && dia ? paraCampoData(fimPadrao(dia, tipo)) : "");
  const dataAte = deCampoData(ate);
  const regra: RegraRepeticao | null = repete ? { tipo, diasSemana } : null;
  const quantos = regra && dia && dataAte ? diasDaRepeticao(dia, regra, dataAte).length : 1;
  // Mudar a regra só faz sentido "deste em diante": "Só este" não é oferecido.
  const mudouRepeticao = tipo !== tipoInicial || ateEscolhido !== null || diasEscolhidos !== null;

  function validar() {
    const novos: Erros = {};
    if (!descricao.trim()) novos.descricao = "Descreva o compromisso.";
    if (!dia) novos.data = "Escolha a data.";
    if (!horaInicio || !horaFim || horaFim < horaInicio) novos.horario = "O fim precisa ser igual ou depois do início.";
    if (repete && (!dataAte || (dia && dataAte < dia))) novos.ate = "Escolha um dia igual ou depois da data do evento.";
    setErros(novos);
    return Object.keys(novos).length === 0;
  }

  function salvarCom(escopo: Escopo) {
    if (!dia) return;
    salvar.mutate(
      {
        evento,
        escopo,
        dados: {
          descricao: descricao.trim(),
          cor,
          dia,
          horaInicio,
          horaFim,
          repeticao: regra,
          ate: regra ? dataAte : null,
        },
      },
      { onSuccess: () => router.push("/agenda") },
    );
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;
    if (evento?.serie_id) return setPerguntando("salvar");
    // Evento avulso que ganhou repetição: ele vira o primeiro da série.
    salvarCom(evento && repete ? "proximos" : "este");
  }

  function excluirCom(escopo: Escopo) {
    if (!evento) return;
    excluir.mutate({ evento, escopo }, { onSuccess: () => router.push("/agenda") });
  }

  const destaque = corDoEvento(cor);

  return (
    <form onSubmit={enviar} noValidate className="flex min-h-dvh flex-col">
      <div className="flex flex-col gap-3 px-5 pt-[calc(env(safe-area-inset-top)+12px)]">
        <CabecalhoTela titulo={evento ? "Editar evento" : "Novo evento"} voltarPara="/agenda" />
        <AvisoErro mensagem={salvar.error?.message ?? excluir.error?.message} />

        <div className="flex flex-col gap-1">
          <CampoSugestoes
            rotulo="Descrição"
            valor={descricao}
            aoMudar={setDescricao}
            opcoes={contarUsos(usadas)}
            placeholder="Ex.: Turno na pizzaria"
            maxLength={200}
          />
          {erros.descricao && <span className="text-[11px] text-negativo">{erros.descricao}</span>}
        </div>

        <CampoTexto
          rotulo={repete && !evento ? "A partir de" : "Data"}
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          erro={erros.data}
        />

        <div className="flex flex-col gap-1">
          <div className="grid grid-cols-2 gap-2.5">
            <CampoTexto rotulo="Início" type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
            <CampoTexto rotulo="Fim" type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} />
          </div>
          <span className={`text-[11px] ${erros.horario ? "text-negativo" : "text-cinza-escuro"}`}>
            O fim precisa ser igual ou depois do início.
          </span>
        </div>

        <CampoRepeticao
          tipo={tipo}
          aoMudarTipo={(valor) => {
            setTipo(valor);
            setAteEscolhido(null);
          }}
          diasSemana={diasSemana}
          aoMudarDias={setDiasEscolhidos}
          ate={ate}
          aoMudarAte={setAteEscolhido}
          inicio={dia}
          quantos={quantos}
          erroAte={erros.ate}
        />

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-xs font-semibold">Cor</legend>
          <div className="flex justify-between">
            {CORES_EVENTO.map((opcao) => {
              const ativa = opcao.valor === cor;
              return (
                <button
                  key={opcao.valor}
                  type="button"
                  onClick={() => setCor(opcao.valor)}
                  aria-pressed={ativa}
                  className="flex flex-col items-center gap-1"
                >
                  <span
                    className={`grid size-10 place-items-center rounded-full ${ativa ? "ring-2 ring-marinho ring-offset-2 ring-offset-fundo" : ""}`}
                  >
                    <span className="size-8 rounded-full" style={{ background: opcao.forte }} />
                  </span>
                  <span className={`text-[11px] ${ativa ? "font-semibold" : "text-cinza-escuro"}`}>{opcao.rotulo}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div
          className="rounded-[10px] border-l-4 px-3.5 py-2.5"
          style={{ background: destaque.fundo, borderColor: destaque.forte }}
        >
          <span className="block text-[11px] text-cinza-escuro">Prévia</span>
          <span className="block truncate text-sm font-bold">
            {descricao.trim() || "Seu compromisso"} · {horaInicio} – {horaFim}
          </span>
          {regra && <span className="block text-[11px] text-cinza-escuro">{fraseRegra(regra, dia ?? undefined)}{ate && dataAte ? ` até ${dataAte.toLocaleDateString("pt-BR")}` : ""}</span>}
        </div>
      </div>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-2.5 bg-fundo px-5 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+26px)]">
        <Botao type="submit" disabled={salvar.isPending}>
          {salvar.isPending ? "Salvando..." : evento ? "Salvar alterações" : "Salvar evento"}
        </Botao>
        {evento && (
          <Botao type="button" variante="perigo" onClick={() => (evento.serie_id ? setPerguntando("excluir") : setConfirmando(true))}>
            Excluir evento
          </Botao>
        )}
      </div>

      {confirmando && evento && (
        <ConfirmarExclusao
          titulo="Excluir este evento?"
          mensagem={`"${evento.descricao}" sai da sua agenda.`}
          excluindo={excluir.isPending}
          aoCancelar={() => setConfirmando(false)}
          aoConfirmar={() => excluirCom("este")}
        />
      )}

      {perguntando && (
        <EscolherEscopo
          acao={perguntando}
          soProximos={perguntando === "salvar" && mudouRepeticao}
          ocupado={salvar.isPending || excluir.isPending}
          aoEscolher={(escopo) => (perguntando === "salvar" ? salvarCom(escopo) : excluirCom(escopo))}
          aoCancelar={() => setPerguntando(null)}
        />
      )}
    </form>
  );
}
