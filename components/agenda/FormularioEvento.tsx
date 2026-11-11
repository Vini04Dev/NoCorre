"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { CampoSugestoes } from "@/components/ui/CampoSugestoes";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { ConfirmarExclusao } from "@/components/ui/ConfirmarExclusao";
import { useDescricoesEventos, useExcluirEvento, useSalvarEvento, type Evento } from "@/hooks/useEventos";
import { CORES_EVENTO, corDoEvento, paraCampoData, type CorEvento } from "@/lib/agenda";
import { camposParaDataHora, dataHoraParaCampos } from "@/lib/data";
import { contarUsos } from "@/lib/sugestoes";

type Erros = { descricao?: string; data?: string; horario?: string };

/**
 * Novo evento ou, recebendo `evento`, edição. Um evento é de um dia só, com
 * início e fim (o banco também garante fim >= início). A prévia mostra como ele
 * vai aparecer na Agenda.
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
  const [erros, setErros] = useState<Erros>({});
  const [confirmando, setConfirmando] = useState(false);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const novos: Erros = {};
    if (!descricao.trim()) novos.descricao = "Descreva o compromisso.";
    if (!data) novos.data = "Escolha a data.";
    if (!horaInicio || !horaFim || horaFim < horaInicio) novos.horario = "O fim precisa ser igual ou depois do início.";
    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    salvar.mutate(
      {
        id: evento?.id,
        dados: {
          descricao: descricao.trim(),
          data_hora_inicial: camposParaDataHora(data, horaInicio),
          data_hora_final: camposParaDataHora(data, horaFim),
          cor,
        },
      },
      { onSuccess: () => router.push("/agenda") },
    );
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

        <CampoTexto rotulo="Data" type="date" value={data} onChange={(e) => setData(e.target.value)} erro={erros.data} />

        <div className="flex flex-col gap-1">
          <div className="grid grid-cols-2 gap-2.5">
            <CampoTexto rotulo="Início" type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
            <CampoTexto rotulo="Fim" type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} />
          </div>
          <span className={`text-[11px] ${erros.horario ? "text-negativo" : "text-cinza-escuro"}`}>
            O fim precisa ser igual ou depois do início.
          </span>
        </div>

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
        </div>
      </div>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-2.5 bg-fundo px-5 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+26px)]">
        <Botao type="submit" disabled={salvar.isPending}>
          {salvar.isPending ? "Salvando..." : evento ? "Salvar alterações" : "Salvar evento"}
        </Botao>
        {evento && (
          <Botao type="button" variante="perigo" onClick={() => setConfirmando(true)}>
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
          aoConfirmar={() => excluir.mutate(evento.id, { onSuccess: () => router.push("/agenda") })}
        />
      )}
    </form>
  );
}
