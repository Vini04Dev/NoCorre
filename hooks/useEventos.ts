"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { criarClienteNavegador } from "@/lib/supabase/cliente";
import { traduzirErroBanco } from "@/lib/supabase/erros-banco";
import { comHora, diasDaRepeticao, type DiaSemana, type RegraRepeticao } from "@/lib/repeticao";
import type { Tables, TablesInsert } from "@/types/database";

export type Evento = Tables<"eventos">;
export type DadosEvento = Omit<TablesInsert<"eventos">, "id" | "usuario_id" | "created_at" | "serie_id" | "repeticao">;

/** O que o formulário manda salvar: o evento, os horários e a repetição escolhida. */
export type EventoParaSalvar = {
  descricao: string;
  cor: DadosEvento["cor"];
  /** Data escolhida: o evento, ou o começo da repetição. */
  dia: Date;
  horaInicio: string;
  horaFim: string;
  /** null: não repete. */
  repeticao: RegraRepeticao | null;
  /** Último dia da repetição (inclusive). */
  ate: Date | null;
};

/** Numa série, a mudança vale só para este dia ou para ele e os seguintes. */
export type Escopo = "este" | "proximos";

const CHAVE = ["eventos"] as const;

/**
 * Eventos que aparecem no intervalo [inicio, fim): começam antes do fim e
 * terminam depois do início, então um turno que atravessa a meia-noite aparece
 * nos dois dias. A RLS só devolve os da própria pessoa.
 */
export function useEventos(inicio: Date, fim: Date) {
  return useQuery({
    queryKey: [...CHAVE, inicio.toISOString(), fim.toISOString()],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("eventos")
        .select("*")
        .lt("data_hora_inicial", fim.toISOString())
        .gte("data_hora_final", inicio.toISOString())
        .order("data_hora_inicial");
      if (error) throw new Error(traduzirErroBanco(error));
      return data;
    },
  });
}

export function useEvento(id: string) {
  return useQuery({
    queryKey: [...CHAVE, "id", id],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador().from("eventos").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(traduzirErroBanco(error));
      return data;
    },
  });
}

/** Descrições já usadas, das mais recentes, para sugerir no formulário. */
export function useDescricoesEventos() {
  return useQuery({
    queryKey: [...CHAVE, "descricoes"],
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("eventos")
        .select("descricao")
        .order("data_hora_inicial", { ascending: false })
        .limit(300);
      if (error) throw new Error(traduzirErroBanco(error));
      return data.map((linha) => linha.descricao);
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Como a série está hoje, para abrir a edição já preenchida: o último dia (o
 * "Até") e os dias da semana e do mês em que ela cai. Os dias saem dos próprios
 * eventos, sem coluna à parte. O 30 de abril que veio de um "31" (o mês não
 * tem 31) não conta como dia 30 marcado.
 */
export function useSerie(serieId: string | null | undefined) {
  return useQuery({
    queryKey: [...CHAVE, "serie", serieId],
    enabled: Boolean(serieId),
    queryFn: async () => {
      const { data, error } = await criarClienteNavegador()
        .from("eventos")
        .select("data_hora_inicial")
        .eq("serie_id", serieId!)
        .order("data_hora_inicial");
      if (error) throw new Error(traduzirErroBanco(error));
      const datas = data.map((linha) => new Date(linha.data_hora_inicial));
      return {
        fim: datas.at(-1) ?? null,
        diasSemana: [...new Set(datas.map((d) => d.getDay() as DiaSemana))],
        diasMes: [
          ...new Set(
            datas
              .filter((d) => {
                const ultimo = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
                return d.getDate() < ultimo || ultimo === 31;
              })
              .map((d) => d.getDate()),
          ),
        ].sort((a, b) => a - b),
      };
    },
  });
}

/** As linhas de um evento em cada dia da repetição (ou só a do dia, sem repetição). */
function linhasDaSerie(e: EventoParaSalvar, serieId: string | null) {
  const dias = e.repeticao && e.ate ? diasDaRepeticao(e.dia, e.repeticao, e.ate) : [e.dia];
  return dias.map((dia) => ({
    descricao: e.descricao,
    cor: e.cor,
    data_hora_inicial: comHora(dia, e.horaInicio).toISOString(),
    data_hora_final: comHora(dia, e.horaFim).toISOString(),
    serie_id: e.repeticao ? serieId : null,
    repeticao: e.repeticao?.tipo ?? null,
  }));
}

function useMutacaoEvento<T>(executar: (variaveis: T) => Promise<void>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: executar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAVE });
    },
  });
}

/**
 * Salva um evento novo (com as repetições, se houver) ou uma edição.
 *
 * Numa edição de série, `escopo` decide o alcance:
 * - "este": muda só este dia; ele continua na série.
 * - "proximos": muda este dia e refaz os seguintes pela regra escolhida (apaga
 *   os próximos da série e gera de novo). Os anteriores ficam como estão.
 *   Escolher "Nunca" aqui para a série neste dia.
 * Um evento avulso que ganha repetição vira o primeiro de uma série nova.
 */
export function useSalvarEvento() {
  return useMutacaoEvento(async ({ evento, dados, escopo = "este" }: { evento?: Evento; dados: EventoParaSalvar; escopo?: Escopo }) => {
    const supabase = criarClienteNavegador();
    const tabela = () => supabase.from("eventos");

    if (!evento) {
      const linhas = linhasDaSerie(dados, dados.repeticao ? crypto.randomUUID() : null);
      const { error } = await tabela().insert(linhas);
      if (error) throw new Error(traduzirErroBanco(error));
      return;
    }

    const [esteDia, ...seguintes] = linhasDaSerie(dados, evento.serie_id ?? crypto.randomUUID());
    if (escopo === "este") {
      // Só este dia: mantém a série e a regra que ele já tinha.
      const { error } = await tabela()
        .update({ ...esteDia, serie_id: evento.serie_id, repeticao: evento.repeticao })
        .eq("id", evento.id);
      if (error) throw new Error(traduzirErroBanco(error));
      return;
    }

    // Este e os próximos: apaga os seguintes da série, atualiza este e gera os novos.
    if (evento.serie_id) {
      const { error } = await tabela()
        .delete()
        .eq("serie_id", evento.serie_id)
        .gt("data_hora_inicial", evento.data_hora_inicial);
      if (error) throw new Error(traduzirErroBanco(error));
    }
    const { error } = await tabela().update(esteDia).eq("id", evento.id);
    if (error) throw new Error(traduzirErroBanco(error));
    if (seguintes.length) {
      const { error: erroNovos } = await tabela().insert(seguintes);
      if (erroNovos) throw new Error(traduzirErroBanco(erroNovos));
    }
  });
}

/** Exclui só este dia ou, numa série, este e os seguintes. */
export function useExcluirEvento() {
  return useMutacaoEvento(async ({ evento, escopo = "este" }: { evento: Evento; escopo?: Escopo }) => {
    const tabela = criarClienteNavegador().from("eventos");
    const { error } =
      escopo === "proximos" && evento.serie_id
        ? await tabela.delete().eq("serie_id", evento.serie_id).gte("data_hora_inicial", evento.data_hora_inicial)
        : await tabela.delete().eq("id", evento.id);
    if (error) throw new Error(traduzirErroBanco(error));
  });
}
