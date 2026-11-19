"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AtalhoMoto } from "./AtalhoMoto";
import { Calendario } from "./Calendario";
import { PainelLancamento } from "@/components/lancamentos/PainelLancamento";
import { LinhaValor, SubLinhaValor } from "@/components/ui/LinhaValor";
import { SeletorPeriodoAmplo } from "@/components/ui/SeletorPeriodoAmplo";
import { useCarteiraEmFoco } from "@/hooks/useCarteiraEmFoco";
import { useSaldosCarteiras, useTransferenciasDoPeriodo } from "@/hooks/useCarteiras";
import { useOrdemPeriodos } from "@/hooks/useOrdemPeriodos";
import { gravarEstadoDaTela, useEstadoDaTela } from "@/hooks/useEstadoDaTela";
import { usePreferencia } from "@/hooks/usePreferencia";
import { FILTROS_VAZIOS, type FiltroRapido, type Filtros } from "@/lib/filtros";
import { useMovimentacoes } from "@/hooks/useMovimentacoes";
import { Valor } from "@/components/ui/Valor";
import { formatarMoeda } from "@/lib/formatar";
import { MESES_LONGOS } from "@/lib/agenda";
import { lancamentosDaCarteira, saldoTransferencias } from "@/lib/carteiras";
import { dataHoraParaCampos } from "@/lib/data";
import { intervaloDoPeriodo, type FiltroPeriodo } from "@/lib/periodo";
import { calcularTotais } from "@/lib/totais";

type Visao = "lista" | "calendario";

const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Dia de referência `passo` semanas ou meses antes (negativo) ou depois de hoje. */
function referencia(tipo: FiltroPeriodo["tipo"], passo: number) {
  const hoje = new Date();
  if (tipo === "mes") return new Date(hoje.getFullYear(), hoje.getMonth() + passo, 1);
  return new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + passo * 7);
}

/** "Outubro de 2026" ou "16 a 22 de nov." (semana que vira o mês: "30 de nov. a 6 de dez."). */
function tituloDoIntervalo(tipo: FiltroPeriodo["tipo"], inicio: Date, fim: Date) {
  if (tipo === "mes") return `${MESES_LONGOS[inicio.getMonth()]} de ${inicio.getFullYear()}`;
  const ultimo = new Date(fim.getFullYear(), fim.getMonth(), fim.getDate() - 1);
  return inicio.getMonth() === ultimo.getMonth()
    ? `${inicio.getDate()} a ${ultimo.getDate()} de ${MESES_CURTOS[ultimo.getMonth()]}.`
    : `${inicio.getDate()} de ${MESES_CURTOS[inicio.getMonth()]}. a ${ultimo.getDate()} de ${MESES_CURTOS[ultimo.getMonth()]}.`;
}

/**
 * Filtro de período e totais da Home. Em períodos de mais de um dia, um botão
 * troca as linhas de totais pelo calendário com o que entrou e saiu em cada
 * dia; semana e mês andam para trás e para a frente (setas ou arrastando o
 * calendário). Com uma carteira escolhida, as linhas e o calendário são os
 * mesmos, só com o que passou por ela.
 *
 * Os números batem entre si: Saldo = Recebidos - Despesas, e somar os dias do
 * calendário dá o Recebidos e o Despesas de cima. Por isso saiu o "Tenho
 * agora" (soma das carteiras desde sempre), que confundia com o saldo.
 */
export function ResumoPeriodo() {
  const [ordem] = useOrdemPeriodos();
  const [periodo, setPeriodoEscolhido] = useEstadoDaTela<FiltroPeriodo>("home:periodo", { tipo: ordem[0] });
  // Quantas semanas ou meses antes (negativo) ou depois de agora.
  const [passo, setPasso] = useEstadoDaTela("home:passo", 0);
  const [visao, setVisao] = useEstadoDaTela<Visao>("home:visao", "lista");
  const [diaParaLancar, setDiaParaLancar] = useState<string | null>(null);
  const navegavel = periodo.tipo === "semana" || periodo.tipo === "mes";
  const { inicio, fim } = intervaloDoPeriodo(periodo, navegavel ? referencia(periodo.tipo, passo) : undefined);
  // Fora de "agora" a busca é pelo intervalo exato (o Resumo também abre nele).
  const periodoVisto: FiltroPeriodo =
    navegavel && passo !== 0
      ? { tipo: "personalizado", de: dataHoraParaCampos(inicio).data, ate: dataHoraParaCampos(new Date(fim.getTime() - 1)).data }
      : periodo;
  const { data: todos, isError } = useMovimentacoes(periodoVisto);
  const emFoco = useCarteiraEmFoco();
  const carteira = emFoco.carteira;
  // Quem não quer ver o detalhe recolhe as sublinhas; a escolha fica guardada no aparelho.
  const [recebidosAbertos, abrirRecebidos] = usePreferencia("home:detalhe-recebidos", true);
  const [despesasAbertas, abrirDespesas] = usePreferencia("home:detalhe-despesas", true);
  const { data: saldos } = useSaldosCarteiras(Boolean(carteira));
  const { data: transferencias } = useTransferenciasDoPeriodo(inicio, fim, Boolean(carteira));
  const data = todos && carteira ? lancamentosDaCarteira(todos, carteira.id, emFoco.principalId) : todos;
  const transferido = carteira && transferencias ? saldoTransferencias(transferencias, carteira.id) : 0;
  const totais = calcularTotais(data?.receitas ?? [], data?.despesas ?? [], data?.entradas ?? []);
  const saldo = Math.round((totais.saldo + transferido) * 100) / 100;
  const pronto = Boolean(data && (!carteira || transferencias));
  // Enquanto carrega, mostra "-" em vez de um R$ 0,00 que pareceria verdadeiro.
  const moeda = (valor: number) => (!pronto ? "–" : <Valor texto={formatarMoeda(valor)} />);

  function setPeriodo(novo: FiltroPeriodo) {
    setPeriodoEscolhido(novo);
    setPasso(0);
  }

  // "Hoje" é sempre a lista: um calendário de um quadrado só não diz nada.
  const permiteCalendario = periodo.tipo !== "dia";
  const mostrarCalendario = permiteCalendario && visao === "calendario";

  // Tocar numa linha abre o Resumo no mesmo período, já com o filtro daquela linha.
  const router = useRouter();
  const abrirResumo = (rapido: FiltroRapido, filtros: Filtros = FILTROS_VAZIOS) => () => {
    gravarEstadoDaTela("resumo:periodo", periodoVisto);
    gravarEstadoDaTela("resumo:rapido", rapido);
    gravarEstadoDaTela("resumo:filtros", filtros);
    router.push("/resumo");
  };

  return (
    <section className="flex flex-col gap-[21px]">
      <AtalhoMoto />
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <SeletorPeriodoAmplo valor={periodo} aoMudar={setPeriodo} />
        </div>
        {permiteCalendario && (
          <button
            type="button"
            onClick={() => setVisao(mostrarCalendario ? "lista" : "calendario")}
            aria-label={mostrarCalendario ? "Ver em lista" : "Ver em calendário"}
            className="grid size-[38px] shrink-0 place-items-center rounded-[10px] bg-cinza-fundo shadow-segmento"
          >
            <Image
              src={mostrarCalendario ? "/icones/vista-lista.svg" : "/icones/vista-calendario.svg"}
              alt=""
              width={20}
              height={20}
            />
          </button>
        )}
      </div>
      {navegavel && (
        <div className="-mt-2 flex items-center justify-between">
          <button type="button" onClick={() => setPasso(passo - 1)} aria-label="Anterior" className="px-2 py-1 text-xl font-semibold">
            ‹
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[13px] font-bold">{tituloDoIntervalo(periodo.tipo, inicio, fim)}</span>
            {passo !== 0 && (
              <button type="button" onClick={() => setPasso(0)} className="text-[11px] font-semibold text-dourado">
                Voltar para {periodo.tipo === "mes" ? "este mês" : "esta semana"}
              </button>
            )}
          </div>
          <button type="button" onClick={() => setPasso(passo + 1)} aria-label="Próximo" className="px-2 py-1 text-xl font-semibold">
            ›
          </button>
        </div>
      )}
      {isError && <p className="text-center text-xs text-negativo">Não foi possível carregar os totais.</p>}

      {mostrarCalendario ? (
        <div className="flex flex-col gap-2">
          <dl className="grid grid-cols-3 rounded-[10px] border border-black/8 bg-white px-3 py-2 text-center shadow-cartao">
            {[
              { rotulo: "Recebidos", valor: totais.recebidosTotal, cor: "text-recebido" },
              { rotulo: "Despesas", valor: totais.despesas, cor: "text-negativo" },
              { rotulo: "Saldo", valor: saldo, cor: saldo < 0 ? "text-negativo" : "text-positivo" },
            ].map(({ rotulo, valor, cor }) => (
              <div key={rotulo}>
                <dt className="text-[10px] text-cinza-escuro">{rotulo}</dt>
                <dd className={`text-[13px] font-extrabold ${cor}`}>{moeda(valor)}</dd>
              </div>
            ))}
          </dl>
          {data && (
            <Calendario
              inicio={inicio}
              fim={fim}
              receitas={data.receitas}
              despesas={data.despesas}
              entradas={data.entradas}
              aoPassar={(sentido) => setPasso(passo + sentido)}
              aoTocarDiaVazio={setDiaParaLancar}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-[5px]">
          <LinhaValor
            rotulo="Saldo"
            valor={moeda(saldo)}
            icone="/icones/saldo.svg"
            corValor={saldo < 0 ? "text-negativo" : "text-positivo"}
            aoTocar={abrirResumo("todos")}
          />
          <LinhaValor
            rotulo="Recebidos"
            valor={moeda(totais.recebidosTotal)}
            icone="/icones/receita.svg"
            corValor="text-recebido"
            aoTocar={abrirResumo("todos")}
            recuo={{ aberto: recebidosAbertos, aoAlternar: () => abrirRecebidos(!recebidosAbertos) }}
          />
          {/* Do corre: entregas, corridas e fixo. Pessoais: salário, bolsa, ajuda (outras entradas). */}
          {recebidosAbertos && (
            <>
              <SubLinhaValor
                rotulo="Do corre"
                valor={moeda(totais.recebidos)}
                corValor="text-recebido"
                aoTocar={abrirResumo("receitas", { ...FILTROS_VAZIOS, situacoes: ["pago"] })}
              />
              <SubLinhaValor
                rotulo="Pessoais"
                valor={moeda(totais.entradas)}
                corValor="text-recebido"
                aoTocar={abrirResumo("todos")}
              />
            </>
          )}
          <LinhaValor
            rotulo="Pendentes"
            valor={moeda(totais.pendentes)}
            icone="/icones/pendente.svg"
            corValor="text-pendente"
            aoTocar={abrirResumo("pendentes")}
          />
          <LinhaValor
            rotulo="Despesas"
            valor={moeda(totais.despesas)}
            icone="/icones/despesa.svg"
            corValor="text-negativo"
            aoTocar={abrirResumo("despesas")}
            recuo={{ aberto: despesasAbertas, aoAlternar: () => abrirDespesas(!despesasAbertas) }}
          />
          {/* Do corre e pessoais são partes da despesa, não totais à parte (pedido de quem usa). */}
          {despesasAbertas && (
            <>
              <SubLinhaValor
                rotulo="Do corre"
                valor={moeda(totais.despesasCorre)}
                corValor="text-negativo"
                aoTocar={abrirResumo("despesas", { ...FILTROS_VAZIOS, gastos: ["corre"] })}
              />
              <SubLinhaValor
                rotulo="Pessoais"
                valor={moeda(totais.despesasPessoais)}
                corValor="text-negativo"
                aoTocar={abrirResumo("despesas", { ...FILTROS_VAZIOS, gastos: ["pessoal"] })}
              />
            </>
          )}
          <LinhaValor
            rotulo="Entregas"
            valor={pronto ? String(totais.entregas) : "–"}
            icone="/icones/moto.svg"
            corValor="text-positivo"
            aoTocar={abrirResumo("receitas")}
          />
          {/* Repasse semanal (iFood) ainda não caiu: o negativo assusta sem motivo. */}
          {carteira && transferido !== 0 && (
            <LinhaValor
              rotulo="Transferências"
              valor={moeda(transferido)}
              icone="/icones/carteira-linha.svg"
              corValor={transferido < 0 ? "text-negativo" : "text-positivo"}
              aoTocar={() => router.push("/carteiras")}
            />
          )}
          {pronto && saldo < 0 && totais.pendentes > 0 && (
            <p className="text-[11px] leading-snug text-cinza-escuro">
              Quando os pendentes forem pagos, o saldo vai para{" "}
              <span className={`font-semibold ${saldo + totais.pendentes < 0 ? "text-negativo" : "text-positivo"}`}>
                <Valor texto={formatarMoeda(saldo + totais.pendentes)} />
              </span>
              .
            </p>
          )}
        </div>
      )}
      {carteira && (
        <p className="-mt-3 text-[11px] leading-snug text-cinza-escuro">
          Mostrando só <b className="text-marinho">{carteira.nome}</b>
          {saldos?.has(carteira.id) && (
            <>
              , que tem <Valor texto={formatarMoeda(saldos.get(carteira.id)!)} /> hoje (somando desde o começo)
            </>
          )}
          . Para ver tudo, toque no botão de carteira no topo.
        </p>
      )}
      {diaParaLancar && <PainelLancamento dia={diaParaLancar} aoFechar={() => setDiaParaLancar(null)} />}
    </section>
  );
}
