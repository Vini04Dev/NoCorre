"use client";

import { Fragment, useState, useTransition } from "react";
import { buscarDetalheUsuario } from "@/app/(app)/admin/acoes";
import type { MetricasAdmin, MetricasUsuario } from "@/lib/admin";

const FUSO = "America/Sao_Paulo";
const dataHora = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: FUSO });
const quando = (valor: string | null) => (valor ? dataHora.format(new Date(valor)) : "–");

type Pessoa = MetricasAdmin["ultimos_cadastros"][number];

function Detalhe({ dados }: { dados: MetricasUsuario }) {
  const contagens = [
    { rotulo: "Receitas", valor: dados.receitas, extra: dados.receitas_pendentes ? `${dados.receitas_pendentes} pendentes` : "" },
    { rotulo: "Entregas", valor: dados.entregas },
    { rotulo: "Despesas", valor: dados.despesas },
    { rotulo: "Clientes", valor: dados.clientes },
    { rotulo: "Categorias", valor: dados.categorias },
    { rotulo: "Metas", valor: dados.metas, extra: dados.metas_ativas ? `${dados.metas_ativas} ativas` : "" },
    { rotulo: "Eventos", valor: dados.eventos },
    { rotulo: "Fotos", valor: dados.fotos },
  ];
  return (
    <div className="flex flex-col gap-3 bg-cinza-fundo/60 px-4 py-3">
      <dl className="grid grid-cols-4 gap-x-2 gap-y-3 text-center">
        {contagens.map(({ rotulo, valor, extra }) => (
          <div key={rotulo} className="flex flex-col-reverse">
            <dt className="text-[10px] text-cinza-escuro">
              {rotulo}
              {extra && <span className="block">{extra}</span>}
            </dt>
            <dd className="text-base font-extrabold">{valor.toLocaleString("pt-BR")}</dd>
          </div>
        ))}
      </dl>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] lg:grid-cols-3">
        {[
          ["Primeiro lançamento", quando(dados.primeiro_lancamento)],
          ["Último lançamento", quando(dados.ultimo_lancamento)],
          ["Último uso do app", quando(dados.ultimo_uso)],
        ].map(([rotulo, valor]) => (
          <div key={rotulo}>
            <dt className="text-cinza-escuro">{rotulo}</dt>
            <dd className="font-semibold">{valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * Últimos cadastros. Tocar numa pessoa abre, logo abaixo, quantos registros ela
 * tem em cada tabela (contagens, nunca valores) e quando usou o app.
 */
export function TabelaCadastros({ pessoas }: { pessoas: Pessoa[] }) {
  const [aberta, setAberta] = useState<string | null>(null);
  const [detalhes, setDetalhes] = useState<Record<string, { dados?: MetricasUsuario; erro?: string }>>({});
  const [carregando, iniciar] = useTransition();

  function alternar(id: string) {
    if (aberta === id) return setAberta(null);
    setAberta(id);
    if (!detalhes[id]) {
      iniciar(async () => {
        const resposta = await buscarDetalheUsuario(id);
        setDetalhes((atuais) => ({ ...atuais, [id]: resposta }));
      });
    }
  }

  return (
    <table className="w-full text-left text-xs">
      <thead className="text-[11px] text-cinza-escuro">
        <tr className="border-b border-cinza-claro">
          <th className="px-4 py-2.5 font-semibold">Nome</th>
          <th className="px-4 py-2.5 font-semibold">Cadastro</th>
          <th className="px-4 py-2.5 font-semibold">Último uso</th>
        </tr>
      </thead>
      <tbody>
        {pessoas.map((pessoa) => {
          const id = pessoa.id;
          const estaAberta = id !== undefined && aberta === id;
          const detalhe = id ? detalhes[id] : undefined;
          return (
            <Fragment key={id ?? `${pessoa.nome}-${pessoa.criado_em}`}>
              <tr className="border-b border-cinza-claro last:border-0">
                <td className="max-w-44 px-4 py-2.5">
                  {id ? (
                    <button
                      type="button"
                      onClick={() => alternar(id)}
                      aria-expanded={estaAberta}
                      className="flex w-full items-center gap-1.5 truncate text-left font-semibold underline-offset-2 hover:underline"
                    >
                      <span aria-hidden className={`text-cinza transition-transform ${estaAberta ? "rotate-90" : ""}`}>
                        ›
                      </span>
                      <span className="truncate">{pessoa.nome}</span>
                    </button>
                  ) : (
                    <span className="truncate font-semibold">{pessoa.nome}</span>
                  )}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">{quando(pessoa.criado_em)}</td>
                <td className="px-4 py-2.5 whitespace-nowrap text-cinza-escuro">
                  {/* Mesmo dado do detalhe ("Último uso do app"); antes da migration, o último login. */}
                  {(pessoa.ultimo_uso ?? pessoa.ultimo_acesso) ? quando(pessoa.ultimo_uso ?? pessoa.ultimo_acesso) : "Nunca entrou"}
                </td>
              </tr>
              {estaAberta && (
                <tr className="border-b border-cinza-claro">
                  <td colSpan={3} className="p-0">
                    {detalhe?.dados ? (
                      <Detalhe dados={detalhe.dados} />
                    ) : (
                      <p className={`px-4 py-3 text-xs ${detalhe?.erro ? "text-negativo" : "text-cinza-escuro"}`}>
                        {detalhe?.erro ?? (carregando ? "Carregando..." : "")}
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
