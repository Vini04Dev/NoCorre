import Link from "next/link";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { Secao } from "@/components/ui/Secao";
import { formatarBytes, type MetricasAdmin } from "@/lib/admin";
import { BotaoAtualizar } from "./BotaoAtualizar";
import { TabelaCadastros } from "./TabelaCadastros";

// Limites do plano gratuito do Supabase, para mostrar quanto já foi usado.
const LIMITE_BANCO = 500 * 1024 * 1024;
const LIMITE_STORAGE = 1024 * 1024 * 1024;

const FUSO = "America/Sao_Paulo";
const dataCurta = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: FUSO });
const dataHora = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: FUSO });
const numero = (valor: number) => valor.toLocaleString("pt-BR");

const CARTAO = "rounded-[14px] border border-black/8 bg-white p-4 shadow-cartao";

/** Card de número do painel: rótulo em cima, valor, detalhe embaixo. Todos os cards de número usam este. */
function Indicador({ rotulo, valor, detalhe }: { rotulo: string; valor: number | string; detalhe: string }) {
  return (
    <div className={`${CARTAO} flex flex-col gap-1`}>
      <span className="text-[11px] font-semibold tracking-[0.66px] text-cinza">{rotulo}</span>
      <span className="text-3xl font-extrabold">{typeof valor === "number" ? numero(valor) : valor}</span>
      <span className="text-xs text-cinza-escuro">{detalhe}</span>
    </div>
  );
}

/** Barras dos últimos 30 dias. Passar o mouse (ou tocar) mostra o dia e o valor. */
function BarrasPorDia({
  titulo,
  dias,
  campo,
}: {
  titulo: string;
  dias: MetricasAdmin["por_dia"];
  campo: "cadastros" | "lancamentos" | "usuarios";
}) {
  const valorDe = (dia: MetricasAdmin["por_dia"][number]) => dia[campo] ?? 0;
  const maior = Math.max(...dias.map(valorDe), 1);
  const total = dias.reduce((soma, dia) => soma + valorDe(dia), 0);
  return (
    <figure className={`${CARTAO} flex flex-col gap-3`}>
      <figcaption className="flex items-baseline justify-between">
        <span className="text-sm font-bold">{titulo}</span>
        <span className="text-xs text-cinza-escuro">{numero(total)} em 30 dias</span>
      </figcaption>
      <div className="flex h-32 items-end gap-[3px] border-b border-cinza-claro">
        {dias.map((dia) => {
          const valor = valorDe(dia);
          const rotulo = `${dataCurta.format(new Date(`${dia.dia}T12:00:00`))}: ${numero(valor)}`;
          return (
            <div key={dia.dia} className="group relative flex h-full flex-1 items-end" aria-label={rotulo} role="img">
              <div
                className="w-full rounded-t-[4px] bg-dourado-claro transition-colors group-hover:bg-dourado"
                style={{ height: valor ? `${Math.max((valor / maior) * 100, 4)}%` : "2px" }}
              />
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-md bg-marinho px-2 py-1 text-[11px] whitespace-nowrap text-white group-hover:block">
                {rotulo}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-cinza-escuro">
        <span>{dias[0] && dataCurta.format(new Date(`${dias[0].dia}T12:00:00`))}</span>
        <span>hoje</span>
      </div>
    </figure>
  );
}

/**
 * Segunda linha de números: retenção, quem nunca lançou e pendências.
 * Aparelho (celular x computador) não entra: o login e a renovação da sessão
 * passam pelo servidor, então o Supabase guarda o navegador do servidor, não o da pessoa.
 */
function Saude({ metricas }: { metricas: MetricasAdmin }) {
  const retencao = metricas.retencao_7d;
  const percentual = retencao && retencao.base ? Math.round((retencao.voltaram / retencao.base) * 100) : null;
  const itens = [
    {
      rotulo: "VOLTARAM NA SEMANA",
      valor: percentual === null ? "–" : `${percentual}%`,
      detalhe: retencao ? `${numero(retencao.voltaram)} de ${numero(retencao.base)} com conta há +7 dias` : "",
    },
    { rotulo: "NUNCA LANÇARAM", valor: numero(metricas.sem_lancamento ?? 0), detalhe: "contas sem receita nem despesa" },
    { rotulo: "RECEITAS PENDENTES", valor: numero(metricas.receitas_pendentes ?? 0), detalhe: "a receber, de todos" },
    { rotulo: "METAS ATIVAS", valor: numero(metricas.metas_ativas ?? 0), detalhe: "em andamento" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {itens.map((item) => (
        <Indicador key={item.rotulo} rotulo={item.rotulo} valor={item.valor} detalhe={item.detalhe} />
      ))}
    </div>
  );
}

function Ranking({ titulo, itens }: { titulo: string; itens: { nome: string; total: number }[] }) {
  const maior = Math.max(...itens.map((item) => item.total), 1);
  return (
    <Secao titulo={titulo}>
      <ol className={`${CARTAO} flex flex-col gap-2`}>
        {itens.length === 0 && <li className="text-xs text-cinza-escuro">Nada lançado ainda.</li>}
        {itens.map((item) => (
          <li key={item.nome} className="flex flex-col gap-1 text-xs">
            <span className="flex justify-between">
              <span className="font-semibold">{item.nome}</span>
              <span className="text-cinza-escuro">{numero(item.total)} lançamentos</span>
            </span>
            <span className="h-1.5 overflow-hidden rounded-full bg-cinza-fundo">
              <span className="block h-full rounded-full bg-dourado" style={{ width: `${(item.total / maior) * 100}%` }} />
            </span>
          </li>
        ))}
      </ol>
    </Secao>
  );
}

function Uso({ rotulo, usado, limite, detalhe }: { rotulo: string; usado: number; limite: number; detalhe?: string }) {
  const parte = Math.min(usado / limite, 1);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-semibold">{rotulo}</span>
        <span className="text-cinza-escuro">
          {formatarBytes(usado)} de {formatarBytes(limite)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-cinza-fundo">
        <div
          className={`h-full rounded-full ${parte > 0.8 ? "bg-negativo" : "bg-positivo"}`}
          style={{ width: `${Math.max(parte * 100, 1)}%` }}
        />
      </div>
      {detalhe && <span className="text-[11px] text-cinza-escuro">{detalhe}</span>}
    </div>
  );
}

/** Painel do sistema: usuários, uso do app e do banco. Só contagens, nenhum valor de ninguém. */
export function TelaAdmin({ metricas, erro }: { metricas: MetricasAdmin | null; erro?: string }) {
  return (
    <main className="flex flex-col gap-5 px-[17px] pt-[calc(env(safe-area-inset-top)+12px)] pb-4 lg:px-0 lg:pt-2">
      <CabecalhoTela
        titulo="Painel do sistema"
        voltarPara="/perfil"
        tituloGrande
        acao={<BotaoAtualizar />}
      />

      {(erro || !metricas) && (
        <p className="rounded-[12px] bg-negativo/10 px-4 py-3 text-[13px] text-negativo">
          Não foi possível carregar as métricas{erro ? `: ${erro}` : "."}
        </p>
      )}

      {metricas && (
        <>
          <p className="-mt-3 text-xs text-cinza-escuro">Atualizado em {dataHora.format(new Date(metricas.gerado_em))}</p>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <Indicador
              rotulo="USUÁRIOS"
              valor={metricas.usuarios.total}
              detalhe={`${numero(metricas.usuarios.confirmados)} com e-mail confirmado`}
            />
            <Indicador
              rotulo="NOVOS NA SEMANA"
              valor={metricas.usuarios.novos_7d}
              detalhe={`${numero(metricas.usuarios.novos_30d)} nos últimos 30 dias`}
            />
            {metricas.uso ? (
              <Indicador
                rotulo="USARAM HOJE"
                valor={metricas.uso.ativos_hoje}
                detalhe={`${numero(metricas.uso.ativos_7d)} na semana · ${numero(metricas.uso.ativos_30d)} no mês`}
              />
            ) : (
              <Indicador
                rotulo="ENTRARAM NA SEMANA"
                valor={metricas.usuarios.acessaram_7d}
                detalhe={`${numero(metricas.usuarios.acessaram_30d)} nos últimos 30 dias`}
              />
            )}
            <Indicador rotulo="LANÇARAM NA SEMANA" valor={metricas.lancaram_7d} detalhe="com receita ou despesa nova" />
          </div>

          {metricas.uso && <Saude metricas={metricas} />}

          <div className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-3 lg:gap-4">
            <BarrasPorDia titulo="Cadastros por dia" dias={metricas.por_dia} campo="cadastros" />
            <BarrasPorDia titulo="Lançamentos por dia" dias={metricas.por_dia} campo="lancamentos" />
            {metricas.por_dia[0]?.usuarios !== undefined && (
              <BarrasPorDia titulo="Pessoas lançando por dia" dias={metricas.por_dia} campo="usuarios" />
            )}
          </div>

          {metricas.categorias_receita && metricas.categorias_despesa && (
            <div className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-2 lg:gap-4">
              <Ranking titulo="CATEGORIAS DE RECEITA MAIS USADAS" itens={metricas.categorias_receita} />
              <Ranking titulo="CATEGORIAS DE DESPESA MAIS USADAS" itens={metricas.categorias_despesa} />
            </div>
          )}

          <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start lg:gap-4">
            <div className="flex flex-col gap-5">
              <Secao titulo="REGISTROS NO BANCO">
                <dl className={`${CARTAO} grid grid-cols-3 gap-y-3 text-center`}>
                  {Object.entries(metricas.registros).map(([tabela, total]) => (
                    <div key={tabela} className="flex flex-col-reverse">
                      <dt className="text-[11px] text-cinza-escuro capitalize">{tabela}</dt>
                      <dd className="text-xl font-extrabold">{numero(total)}</dd>
                    </div>
                  ))}
                </dl>
              </Secao>

              <Secao titulo="ARMAZENAMENTO (PLANO GRATUITO)">
                <div className={`${CARTAO} flex flex-col gap-4`}>
                  <Uso rotulo="Banco de dados" usado={metricas.armazenamento.banco_bytes} limite={LIMITE_BANCO} />
                  <Uso
                    rotulo="Fotos"
                    usado={metricas.armazenamento.fotos.bytes}
                    limite={LIMITE_STORAGE}
                    detalhe={`${numero(metricas.armazenamento.fotos.arquivos)} arquivos de clientes e perfis`}
                  />
                  {metricas.tabelas && (
                    <ul className="flex flex-col gap-1 border-t border-cinza-claro pt-3 text-xs">
                      {metricas.tabelas.map((tabela) => (
                        <li key={tabela.nome} className="flex justify-between">
                          <span className="text-cinza-escuro">{tabela.nome}</span>
                          <span className="font-semibold">{formatarBytes(tabela.bytes)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Secao>
            </div>

            <Secao titulo="ÚLTIMOS CADASTROS · TOQUE PARA VER OS REGISTROS">
              <div className={`${CARTAO} overflow-x-auto p-0`}>
                <TabelaCadastros pessoas={metricas.ultimos_cadastros} />
              </div>
            </Secao>
          </div>

          <Secao titulo="AVISOS DO APP">
            <div className={`${CARTAO} flex flex-col gap-2 text-xs`}>
              <p className="text-cinza-escuro">
                Telas que só aparecem sob condição. Abra para conferir como cada pessoa vê.
              </p>
              {[
                { href: "/?aviso=novidades", rotulo: "Aviso de atualização", quando: "abre a cada versão nova, ao entrar" },
                { href: "/?aviso=pro", rotulo: "O Pro chegou!", quando: "uma vez, quando a conta vira Pro" },
                { href: "/?aviso=primeiro-uso", rotulo: "Aviso de primeiro cliente", quando: "abre no Início enquanto não há cliente" },
                { href: "/?aviso=vencimento", rotulo: "Contas a vencer", quando: "conta fixa a 3 dias do vencimento, atrasada ou débito do dia" },
                { href: "/admin/previa/confirmacao", rotulo: "Confirme seu email", quando: "logo depois de criar a conta" },
                { href: "/admin/previa/erro", rotulo: "Algo deu errado", quando: "quando uma tela falha ao carregar" },
                { href: "/endereco-que-nao-existe", rotulo: "Página não encontrada", quando: "endereço errado ou antigo" },
              ].map(({ href, rotulo, quando }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between gap-3 rounded-[10px] border border-cinza-claro px-3 py-2.5 transition-colors hover:bg-cinza-fundo"
                >
                  <span className="flex flex-col">
                    <span className="font-semibold">{rotulo}</span>
                    <span className="text-[11px] text-cinza-escuro">{quando}</span>
                  </span>
                  <span aria-hidden className="text-lg text-cinza">
                    ›
                  </span>
                </Link>
              ))}
            </div>
          </Secao>

          <p className="text-[11px] text-cinza-escuro">
            Requisições à API e tráfego ficam no painel do Supabase (Reports), fora do app.
          </p>
        </>
      )}
    </main>
  );
}
