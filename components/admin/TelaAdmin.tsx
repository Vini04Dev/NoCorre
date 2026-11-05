import Link from "next/link";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { Secao } from "@/components/ui/Secao";
import { formatarBytes, type MetricasAdmin } from "@/lib/admin";

// Limites do plano gratuito do Supabase, para mostrar quanto já foi usado.
const LIMITE_BANCO = 500 * 1024 * 1024;
const LIMITE_STORAGE = 1024 * 1024 * 1024;

const FUSO = "America/Sao_Paulo";
const dataCurta = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: FUSO });
const dataHora = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: FUSO });
const numero = (valor: number) => valor.toLocaleString("pt-BR");

const CARTAO = "rounded-[14px] border border-black/8 bg-white p-4 shadow-cartao";

function Indicador({ rotulo, valor, detalhe }: { rotulo: string; valor: number; detalhe: string }) {
  return (
    <div className={`${CARTAO} flex flex-col gap-1`}>
      <span className="text-[11px] font-semibold tracking-[0.66px] text-cinza">{rotulo}</span>
      <span className="text-3xl font-extrabold">{numero(valor)}</span>
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
  campo: "cadastros" | "lancamentos";
}) {
  const maior = Math.max(...dias.map((dia) => dia[campo]), 1);
  const total = dias.reduce((soma, dia) => soma + dia[campo], 0);
  return (
    <figure className={`${CARTAO} flex flex-col gap-3`}>
      <figcaption className="flex items-baseline justify-between">
        <span className="text-sm font-bold">{titulo}</span>
        <span className="text-xs text-cinza-escuro">{numero(total)} em 30 dias</span>
      </figcaption>
      <div className="flex h-32 items-end gap-[3px] border-b border-cinza-claro">
        {dias.map((dia) => {
          const valor = dia[campo];
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
        acao={
          <Link href="/admin" className="rounded-lg border border-cinza-claro bg-white px-3 py-1.5 text-xs font-semibold">
            Atualizar
          </Link>
        }
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
            <Indicador
              rotulo="ENTRARAM NA SEMANA"
              valor={metricas.usuarios.acessaram_7d}
              detalhe={`${numero(metricas.usuarios.acessaram_30d)} nos últimos 30 dias`}
            />
            <Indicador rotulo="LANÇARAM NA SEMANA" valor={metricas.lancaram_7d} detalhe="com receita ou despesa nova" />
          </div>

          <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
            <BarrasPorDia titulo="Cadastros por dia" dias={metricas.por_dia} campo="cadastros" />
            <BarrasPorDia titulo="Lançamentos por dia" dias={metricas.por_dia} campo="lancamentos" />
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start lg:gap-4">
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
                </div>
              </Secao>
            </div>

            <Secao titulo="ÚLTIMOS CADASTROS">
              <div className={`${CARTAO} overflow-x-auto p-0`}>
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] text-cinza-escuro">
                    <tr className="border-b border-cinza-claro">
                      <th className="px-4 py-2.5 font-semibold">Nome</th>
                      <th className="px-4 py-2.5 font-semibold">Cadastro</th>
                      <th className="px-4 py-2.5 font-semibold">Último acesso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metricas.ultimos_cadastros.map((pessoa) => (
                      <tr key={`${pessoa.nome}-${pessoa.criado_em}`} className="border-b border-cinza-claro last:border-0">
                        <td className="max-w-40 truncate px-4 py-2.5 font-semibold">{pessoa.nome}</td>
                        <td className="px-4 py-2.5 whitespace-nowrap">{dataHora.format(new Date(pessoa.criado_em))}</td>
                        <td className="px-4 py-2.5 whitespace-nowrap text-cinza-escuro">
                          {pessoa.ultimo_acesso ? dataHora.format(new Date(pessoa.ultimo_acesso)) : "Nunca entrou"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Secao>
          </div>

          <p className="text-[11px] text-cinza-escuro">
            Requisições à API e tráfego ficam no painel do Supabase (Reports), fora do app.
          </p>
        </>
      )}
    </main>
  );
}
