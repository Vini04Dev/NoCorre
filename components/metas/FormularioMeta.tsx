"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alternador } from "@/components/ui/Alternador";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { CampoMoeda } from "@/components/ui/CampoMoeda";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { SeletorChips } from "@/components/ui/SeletorChips";
import { useCategorias } from "@/hooks/useCategorias";
import { useClientes } from "@/hooks/useClientes";
import { useSalvarMeta, type DadosMeta } from "@/hooks/useMetas";
import { CATEGORIAS_PADRAO } from "@/lib/categorias-padrao";
import { ROTA_CONTAS } from "@/lib/contas-fixas";
import { datasDoAtalho, proximoPeriodo, type Meta, type Parametro } from "@/lib/metas";

const PARAMETROS: { valor: Parametro; rotulo: string }[] = [
  { valor: "receita", rotulo: "Receita" },
  { valor: "quantidade", rotulo: "Quantidade de entregas" },
  { valor: "despesa", rotulo: "Limite de despesa" },
  { valor: "conta", rotulo: "Conta a pagar" },
];

/**
 * Meta é objetivo (receita, entregas, limite de gasto). Conta a pagar, com ou
 * sem parcelas, mora em Contas do mês; a opção só aparece para editar as
 * metas de conta que já existiam.
 */
const PARAMETROS_NOVOS = PARAMETROS.filter((p) => p.valor !== "conta");

const ATALHOS = [
  { valor: "semana", rotulo: "Esta semana" },
  { valor: "mes", rotulo: "Este mês" },
  { valor: "personalizado", rotulo: "Personalizado" },
] as const;
type Atalho = (typeof ATALHOS)[number]["valor"];

const PLACEHOLDER: Record<Parametro, string> = {
  receita: "Ex.: Faturar R$ 1.000 na semana",
  quantidade: "Ex.: 120 entregas no mês",
  despesa: "Ex.: Lanche: no máximo R$ 100",
  conta: "Ex.: Sicoob",
};

type Erros = { nome?: string; valor?: string; datas?: string; parcela?: string };

type Props = {
  /** Meta sendo editada. */
  meta?: Meta;
  /** Meta encerrada que está sendo repetida: copia tudo para o próximo período. */
  repetir?: Meta;
};

function atalhoDas(datas: { inicio: string; fim: string }): Atalho {
  for (const atalho of ["semana", "mes"] as const) {
    const padrao = datasDoAtalho(atalho);
    if (padrao.inicio === datas.inicio && padrao.fim === datas.fim) return atalho;
  }
  return "personalizado";
}

export function FormularioMeta({ meta, repetir }: Props) {
  const router = useRouter();
  const salvar = useSalvarMeta();
  const { data: categorias } = useCategorias();
  const { data: clientes } = useClientes();
  const base = meta ?? repetir;
  const destino = meta ? `/metas/${meta.id}` : "/metas";

  const datasIniciais = meta
    ? { inicio: meta.data_inicio, fim: meta.data_fim }
    : repetir
      ? proximoPeriodo(repetir)
      : datasDoAtalho("semana");

  const [nome, setNome] = useState(base?.nome ?? "");
  const [parametro, setParametro] = useState<Parametro>(base?.parametro ?? "receita");
  const [centavos, setCentavos] = useState(base ? Math.round(base.valor_alvo * 100) : 0);
  const [categoria, setCategoria] = useState<string | null>(base?.categoria ?? null);
  const [clienteId, setClienteId] = useState<string | null>(base?.cliente_id ?? null);
  const [atalho, setAtalho] = useState<Atalho>(() => atalhoDas(datasIniciais));
  const [inicio, setInicio] = useState(datasIniciais.inicio);
  const [fim, setFim] = useState(datasIniciais.fim);
  const [parcelaAtual, setParcelaAtual] = useState(
    base?.parcela_atual ? String(base.parcela_atual + (repetir ? 1 : 0)) : "",
  );
  const [parcelaTotal, setParcelaTotal] = useState(base?.parcela_total ? String(base.parcela_total) : "");
  const [ativa, setAtiva] = useState<"ativa" | "inativa">(meta?.status ?? "ativa");
  const [erros, setErros] = useState<Erros>({});

  const quantidade = parametro === "quantidade";
  const tipoCategoria = parametro === "despesa" ? "despesa" : "receita";
  const nomesCategoria = [
    ...CATEGORIAS_PADRAO[tipoCategoria],
    ...(categorias ?? []).filter((item) => item.tipo === tipoCategoria).map((item) => item.nome),
  ];
  // Uma categoria escolhida antes que não existe mais na lista continua visível.
  if (categoria && !nomesCategoria.includes(categoria)) nomesCategoria.push(categoria);

  function escolherParametro(novo: Parametro) {
    // Filtros que não fazem sentido no novo parâmetro são limpos (o banco também recusa).
    if (novo === "conta" || (novo === "despesa") !== (parametro === "despesa")) setCategoria(null);
    if (novo === "conta" || novo === "despesa") setClienteId(null);
    if (novo !== "conta") {
      setParcelaAtual("");
      setParcelaTotal("");
    }
    // Entregas são inteiras: 120 entregas, e não R$ 1,20.
    if ((novo === "quantidade") !== quantidade) setCentavos(0);
    setParametro(novo);
  }

  function escolherAtalho(novo: Atalho) {
    setAtalho(novo);
    if (novo !== "personalizado") {
      const datas = datasDoAtalho(novo);
      setInicio(datas.inicio);
      setFim(datas.fim);
    }
  }

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const novosErros: Erros = {};
    if (!nome.trim()) novosErros.nome = "Dê um nome para a meta.";
    if (centavos <= 0) novosErros.valor = quantidade ? "Informe quantas entregas." : "Informe um valor.";
    if (!inicio || !fim) novosErros.datas = "Informe o início e o fim.";
    else if (fim < inicio) novosErros.datas = "O fim não pode ser antes do início.";
    const atual = Number(parcelaAtual);
    const total = Number(parcelaTotal);
    if ((parcelaAtual || parcelaTotal) && !(atual >= 1 && total >= atual)) {
      novosErros.parcela = "Use, por exemplo, 2 de 12. A parcela não pode passar do total.";
    }
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    const dados: DadosMeta = {
      nome: nome.trim(),
      parametro,
      valor_alvo: quantidade ? centavos : centavos / 100,
      data_inicio: inicio,
      data_fim: fim,
      status: ativa,
      categoria,
      cliente_id: clienteId,
      parcela_atual: parcelaAtual ? atual : null,
      parcela_total: parcelaTotal ? total : null,
    };
    salvar.mutate({ id: meta?.id, dados }, { onSuccess: () => router.push(destino) });
  }

  return (
    <form onSubmit={enviar} noValidate className="flex min-h-dvh flex-col">
      <div className="flex flex-col gap-3 px-5 pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
        <CabecalhoTela titulo={meta ? "Editar meta" : "Nova meta"} voltarPara={destino} />
        <AvisoErro mensagem={salvar.error?.message} />

        <SeletorChips
          rotulo="O que vou medir"
          opcoes={base?.parametro === "conta" ? PARAMETROS : PARAMETROS_NOVOS}
          valor={parametro}
          aoMudar={(valor) => valor && escolherParametro(valor as Parametro)}
        />
        {base?.parametro !== "conta" && (
          <p className="-mt-1 text-[11px] text-cinza-escuro">
            Tem uma conta para pagar, mensal ou parcelada?{" "}
            <Link href={ROTA_CONTAS} className="font-bold text-dourado">
              Cadastre em Contas do mês
            </Link>
          </p>
        )}

        <CampoTexto
          rotulo={parametro === "conta" ? "Nome da conta" : "Nome da meta"}
          value={nome}
          maxLength={100}
          onChange={(evento) => setNome(evento.target.value)}
          placeholder={PLACEHOLDER[parametro]}
          erro={erros.nome}
        />

        {quantidade ? (
          <CampoTexto
            rotulo="Quantidade de entregas"
            inputMode="numeric"
            value={centavos ? String(centavos) : ""}
            onChange={(evento) => setCentavos(Number(evento.target.value.replace(/\D/g, "").slice(0, 7)))}
            placeholder="Ex.: 120"
            erro={erros.valor}
          />
        ) : (
          <CampoMoeda
            rotulo={parametro === "conta" ? "Valor da conta" : parametro === "despesa" ? "Limite" : "Valor alvo"}
            centavos={centavos}
            aoMudar={setCentavos}
            erro={erros.valor}
          />
        )}

        {parametro === "conta" ? (
          <div className="flex flex-col gap-1.5">
            <span className="flex gap-1">
              <span className="text-xs font-semibold">Parcela</span>
              <span className="text-[11px] text-cinza-escuro">(opcional)</span>
            </span>
            <div className="flex items-center gap-2 text-[13px]">
              <input
                aria-label="Parcela atual"
                inputMode="numeric"
                value={parcelaAtual}
                onChange={(evento) => setParcelaAtual(evento.target.value.replace(/\D/g, "").slice(0, 3))}
                placeholder="2"
                className="w-16 rounded-[10px] border border-cinza-claro bg-white px-3 py-[11px] text-center outline-none focus:border-dourado"
              />
              de
              <input
                aria-label="Total de parcelas"
                inputMode="numeric"
                value={parcelaTotal}
                onChange={(evento) => setParcelaTotal(evento.target.value.replace(/\D/g, "").slice(0, 3))}
                placeholder="12"
                className="w-16 rounded-[10px] border border-cinza-claro bg-white px-3 py-[11px] text-center outline-none focus:border-dourado"
              />
            </div>
            {erros.parcela && <span className="text-[11px] text-negativo">{erros.parcela}</span>}
          </div>
        ) : (
          <>
            <SeletorChips
              rotulo="Só contar a categoria"
              opcional
              desmarcavel
              opcoes={nomesCategoria.map((item) => ({ valor: item, rotulo: item }))}
              valor={categoria}
              aoMudar={setCategoria}
            />
            {parametro !== "despesa" && clientes && clientes.length > 0 && (
              <SeletorChips
                rotulo="Só contar o cliente"
                opcional
                desmarcavel
                opcoes={clientes.map((cliente) => ({ valor: cliente.id, rotulo: cliente.nome }))}
                valor={clienteId}
                aoMudar={setClienteId}
              />
            )}
          </>
        )}

        <SeletorChips
          rotulo="Período"
          opcoes={[...ATALHOS]}
          valor={atalho}
          aoMudar={(valor) => valor && escolherAtalho(valor as Atalho)}
        />
        <div className="grid grid-cols-2 gap-2.5">
          <CampoTexto
            rotulo="Início"
            type="date"
            value={inicio}
            onChange={(evento) => {
              setAtalho("personalizado");
              setInicio(evento.target.value);
            }}
            className="w-full"
          />
          <CampoTexto
            rotulo={parametro === "conta" ? "Vencimento" : "Fim"}
            type="date"
            value={fim}
            onChange={(evento) => {
              setAtalho("personalizado");
              setFim(evento.target.value);
            }}
            className="w-full"
          />
        </div>
        {erros.datas && <span className="-mt-2 text-[11px] text-negativo">{erros.datas}</span>}

        <Alternador
          rotulo="Status"
          opcoes={[
            { valor: "ativa", rotulo: "Ativa" },
            { valor: "inativa", rotulo: "Pausada" },
          ]}
          valor={ativa}
          aoMudar={setAtiva}
        />
      </div>

      <div className="sticky bottom-0 mt-auto bg-fundo px-5 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+26px)]">
        <Botao type="submit" disabled={salvar.isPending}>
          {salvar.isPending ? "Salvando..." : meta ? "Salvar alterações" : parametro === "conta" ? "Salvar conta" : "Salvar meta"}
        </Botao>
      </div>
    </form>
  );
}
