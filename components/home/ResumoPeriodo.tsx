"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendario } from "./Calendario";
import { ResumoCarteira } from "./ResumoCarteira";
import { LinhaValor, SubLinhaValor } from "@/components/ui/LinhaValor";
import { SeletorPeriodoAmplo } from "@/components/ui/SeletorPeriodoAmplo";
import { useCarteiraEmFoco } from "@/hooks/useCarteiraEmFoco";
import { useSaldosCarteiras } from "@/hooks/useCarteiras";
import { useOrdemPeriodos } from "@/hooks/useOrdemPeriodos";
import { gravarEstadoDaTela, useEstadoDaTela } from "@/hooks/useEstadoDaTela";
import { usePreferencia } from "@/hooks/usePreferencia";
import { FILTROS_VAZIOS, type FiltroRapido, type Filtros } from "@/lib/filtros";
import { useMovimentacoes } from "@/hooks/useMovimentacoes";
import { Valor } from "@/components/ui/Valor";
import { formatarMoeda } from "@/lib/formatar";
import { intervaloDoPeriodo, type FiltroPeriodo } from "@/lib/periodo";
import { calcularTotais } from "@/lib/totais";

type Visao = "lista" | "calendario";

/**
 * Filtro de período e totais da Home. Em períodos de mais de um dia, um botão
 * troca as linhas de totais pelo calendário com receita e despesa de cada dia.
 */
export function ResumoPeriodo() {
  const [ordem] = useOrdemPeriodos();
  const [periodo, setPeriodo] = useEstadoDaTela<FiltroPeriodo>("home:periodo", { tipo: ordem[0] });
  const [visao, setVisao] = useEstadoDaTela<Visao>("home:visao", "lista");
  const { data, isError } = useMovimentacoes(periodo);
  const emFoco = useCarteiraEmFoco();
  // Quem não quer ver o detalhe recolhe as sublinhas; a escolha fica guardada no aparelho.
  const [recebidosAbertos, abrirRecebidos] = usePreferencia("home:detalhe-recebidos", true);
  const [despesasAbertas, abrirDespesas] = usePreferencia("home:detalhe-despesas", true);
  // "Quanto eu tenho agora": soma das carteiras (Pro), que não depende do período escolhido.
  const { data: saldos } = useSaldosCarteiras(emFoco.ativas.length > 0);
  const tenhoAgora = saldos && emFoco.ativas.reduce((soma, c) => soma + Math.round((saldos.get(c.id) ?? 0) * 100), 0) / 100;
  const totais = calcularTotais(data?.receitas ?? [], data?.despesas ?? [], data?.entradas ?? []);
  // Enquanto carrega, mostra "–" em vez de um R$ 0,00 que pareceria verdadeiro.
  const moeda = (valor: number) => (!data ? "–" : <Valor texto={formatarMoeda(valor)} />);

  // "Hoje" é sempre a lista: um calendário de um quadrado só não diz nada.
  // Com uma carteira escolhida também: o calendário é de todas as carteiras.
  const permiteCalendario = periodo.tipo !== "dia" && !emFoco.carteira;
  const mostrarCalendario = permiteCalendario && visao === "calendario";

  // Tocar numa linha abre o Resumo no mesmo período, já com o filtro daquela linha.
  const router = useRouter();
  const abrirResumo = (rapido: FiltroRapido, filtros: Filtros = FILTROS_VAZIOS) => () => {
    gravarEstadoDaTela("resumo:periodo", periodo);
    gravarEstadoDaTela("resumo:rapido", rapido);
    gravarEstadoDaTela("resumo:filtros", filtros);
    router.push("/resumo");
  };

  return (
    <section className="flex flex-col gap-[21px]">
      {tenhoAgora !== undefined && !emFoco.carteira && (
        <button
          type="button"
          onClick={() => router.push("/carteiras")}
          className="flex items-center justify-between gap-3 rounded-[12px] bg-marinho px-3.5 py-3 text-left text-white transition-transform active:scale-[0.99]"
        >
          <span className="flex flex-col">
            <span className="text-[11px] font-semibold tracking-[0.66px] text-white/75">TENHO AGORA</span>
            <span className="text-[11px] text-white/75">
              Somando {emFoco.ativas.length === 1 ? "a carteira" : `as ${emFoco.ativas.length} carteiras`}
            </span>
          </span>
          <span className={`text-2xl font-extrabold ${tenhoAgora < 0 ? "text-[#f08a7a]" : "text-dourado-claro"}`}>
            <Valor texto={formatarMoeda(tenhoAgora)} />
          </span>
        </button>
      )}
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
      {isError && <p className="text-center text-xs text-negativo">Não foi possível carregar os totais.</p>}

      {emFoco.carteira ? (
        <ResumoCarteira
          carteira={emFoco.carteira}
          principalId={emFoco.principalId}
          {...intervaloDoPeriodo(periodo)}
          dados={data}
        />
      ) : mostrarCalendario ? (
        <div className="flex flex-col gap-2">
          <dl className="grid grid-cols-3 rounded-[10px] border border-black/8 bg-white px-3 py-2 text-center shadow-cartao">
            {[
              { rotulo: "Recebidos", valor: totais.recebidosTotal, cor: "text-recebido" },
              { rotulo: "Despesas", valor: totais.despesas, cor: "text-negativo" },
              { rotulo: "Saldo", valor: totais.saldo, cor: totais.saldo < 0 ? "text-negativo" : "text-positivo" },
            ].map(({ rotulo, valor, cor }) => (
              <div key={rotulo}>
                <dt className="text-[10px] text-cinza-escuro">{rotulo}</dt>
                <dd className={`text-[13px] font-extrabold ${cor}`}>{moeda(valor)}</dd>
              </div>
            ))}
          </dl>
          {data && <Calendario {...intervaloDoPeriodo(periodo)} receitas={data.receitas} despesas={data.despesas} />}
        </div>
      ) : (
        <div className="flex flex-col gap-[5px]">
          <LinhaValor
            rotulo="Saldo"
            valor={moeda(totais.saldo)}
            icone="/icones/saldo.svg"
            corValor={totais.saldo < 0 ? "text-negativo" : "text-positivo"}
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
            valor={data ? String(totais.entregas) : "–"}
            icone="/icones/moto.svg"
            corValor="text-positivo"
            aoTocar={abrirResumo("receitas")}
          />
          {/* Repasse semanal (iFood) ainda não caiu: o negativo assusta sem motivo. */}
          {data && totais.saldo < 0 && totais.pendentes > 0 && (
            <p className="text-[11px] leading-snug text-cinza-escuro">
              Quando os pendentes forem pagos, o saldo vai para{" "}
              <span className={`font-semibold ${totais.saldo + totais.pendentes < 0 ? "text-negativo" : "text-positivo"}`}>
                <Valor texto={formatarMoeda(totais.saldo + totais.pendentes)} />
              </span>
              .
            </p>
          )}
        </div>
      )}
    </section>
  );
}
