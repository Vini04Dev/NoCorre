"use client";

import Image from "next/image";
import Link from "next/link";
import { sair } from "@/app/(auth)/acoes";
import { useClientes } from "@/hooks/useClientes";
import { limparEstadoDasTelas } from "@/hooks/useEstadoDaTela";
import { CirculoProgresso } from "@/components/metas/CirculoProgresso";
import { Secao } from "@/components/ui/Secao";
import { useMetas } from "@/hooks/useMetas";
import { useEstatisticasPerfil, usePerfil } from "@/hooks/usePerfil";
import { corDaMeta, textoProgresso } from "@/lib/metas";

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const compacto = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });

const CLASSE_ITEM = "flex w-full items-center gap-3 py-[7px] text-left";
const CLASSE_ICONE = "grid size-7 shrink-0 place-items-center rounded-full";

function ItemConfiguracao({ href, icone, rotulo }: { href: string; icone: string; rotulo: string }) {
  return (
    <li className="border-b border-cinza-claro">
      <Link href={href} className={CLASSE_ITEM}>
        <span className={`${CLASSE_ICONE} bg-dourado-claro`}>
          <Image src={icone} alt="" width={16} height={16} />
        </span>
        <span className="flex-1 text-xs font-semibold">{rotulo}</span>
        <span aria-hidden className="text-lg font-semibold text-cinza">
          ›
        </span>
      </Link>
    </li>
  );
}

/** As três metas ativas que vencem primeiro, com atalho para a tela de Metas. */
function MetasEmAndamento() {
  const { data: metas } = useMetas();
  const ativas = (metas ?? []).filter((meta) => !meta.encerrada).slice(0, 3);

  if (ativas.length === 0) {
    return (
      <Link
        href="/metas/nova"
        className="flex items-center gap-3 rounded-[12px] border border-dashed border-cinza bg-white px-4 py-3"
      >
        <Image src="/icones/metas.svg" alt="" width={28} height={28} className="rounded-full bg-marinho p-1" />
        <p className="text-xs">
          <strong className="block">Nenhuma meta ativa</strong>
          <span className="text-cinza-escuro">Crie metas de receita, entregas, limite de despesa ou contas a pagar.</span>
        </p>
      </Link>
    );
  }

  return (
    <ul className="rounded-[12px] border border-cinza-claro bg-white px-3.5 py-1">
      {ativas.map((meta) => (
        <li key={meta.id} className="border-b border-cinza-claro last:border-b-0">
          <Link href={`/metas/${meta.id}`} className={CLASSE_ITEM}>
            <CirculoProgresso percentual={meta.percentual} traco={corDaMeta(meta).traco} tamanho={36} espessura={4} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-semibold">{meta.nome}</span>
              <span className="text-[10px] text-cinza-escuro">{textoProgresso(meta)}</span>
            </span>
            <span aria-hidden className="text-lg font-semibold text-cinza">
              ›
            </span>
          </Link>
        </li>
      ))}
      <li>
        <Link href="/metas" className="block py-2 text-center text-[11px] font-semibold text-dourado">
          Ver todas as metas
        </Link>
      </li>
    </ul>
  );
}

export function TelaPerfil() {
  const { data: perfil, isPending, isError, error } = usePerfil();
  const { data: estatisticas } = useEstatisticasPerfil();
  const { data: clientes } = useClientes();
  const { data: metas } = useMetas();

  if (isPending) return <p className="p-6 text-center text-[13px] text-cinza-escuro">Carregando...</p>;
  if (isError || !perfil) {
    return <p className="p-6 text-center text-[13px] text-negativo">{error?.message ?? "Perfil não encontrado."}</p>;
  }

  const desde = new Date(perfil.created_at);
  const numeros = [
    { valor: estatisticas ? estatisticas.entregas.toLocaleString("pt-BR") : "–", rotulo: "entregas" },
    {
      valor: metas ? String(metas.filter((meta) => meta.situacao === "batida" || meta.situacao === "quitada").length) : "–",
      rotulo: "metas batidas",
    },
    { valor: clientes ? String(clientes.length) : "–", rotulo: "clientes" },
    { valor: estatisticas ? `R$ ${compacto.format(estatisticas.receitaTotal)}` : "–", rotulo: "receita total" },
  ];
  const veiculo = [perfil.veiculo, perfil.ano_veiculo].filter(Boolean).join(" · ");

  return (
    <main className="flex flex-col gap-4 px-[17px] pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
      <h1 className="text-[22px] font-extrabold">Perfil</h1>

      <section className="flex flex-col gap-2.5 rounded-[14px] bg-marinho px-[18px] py-3.5 text-white">
        <div className="flex items-center gap-3.5">
          <span className="size-16 shrink-0 overflow-hidden rounded-[27px] bg-white">
            <Image
              src={perfil.fotoUrl ?? "/imagens/logo.png"}
              alt=""
              width={64}
              height={64}
              unoptimized={Boolean(perfil.fotoUrl)}
              className="size-16 object-cover"
            />
          </span>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
            <p className="w-full truncate text-[17px] font-extrabold">{perfil.nome}</p>
            <p className="text-[11px] text-cinza">
              Entregador desde {MESES[desde.getMonth()]}/{desde.getFullYear()}
            </p>
            {perfil.tipo_sanguineo && (
              <span className="rounded-[10px] bg-dourado-claro px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.54px] text-marinho">
                SANGUE {perfil.tipo_sanguineo}
              </span>
            )}
          </div>
          <Link
            href="/perfil/editar"
            className="shrink-0 rounded-lg border border-cinza px-3 py-1.5 text-[11px] font-semibold text-cinza-claro"
          >
            Editar
          </Link>
        </div>
        <hr className="border-white/12" />
        <dl className="grid grid-cols-4 text-center">
          {numeros.map(({ valor, rotulo }) => (
            <div key={rotulo} className="flex flex-col-reverse">
              <dt className="text-[9px] text-cinza">{rotulo}</dt>
              <dd className="text-base font-extrabold text-dourado-claro">{valor}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Secao titulo="METAS EM ANDAMENTO">
        <MetasEmAndamento />
      </Secao>

      <Secao titulo="MEU VEÍCULO">
        <Link
          href="/perfil/veiculo"
          className="flex items-center gap-3 rounded-[12px] border border-cinza-claro bg-white px-3.5 py-2"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-dourado-claro">
            <Image src="/icones/perfil-moto.svg" alt="" width={22} height={22} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-xs font-semibold">{veiculo || "Adicionar veículo"}</span>
            <span className="text-[10px] text-cinza">
              {perfil.placa ? `Placa ${perfil.placa}` : "Modelo, ano e placa"}
            </span>
          </span>
          <span aria-hidden className="text-lg font-semibold text-cinza">
            ›
          </span>
        </Link>
      </Secao>

      <Secao titulo="CONFIGURAÇÕES">
        <ul className="rounded-[12px] border border-cinza-claro bg-white px-3.5 py-1">
          <ItemConfiguracao href="/perfil/editar" icone="/icones/perfil-dados.svg" rotulo="Dados pessoais" />
          <ItemConfiguracao href="/perfil/sobre" icone="/icones/perfil-sobre.svg" rotulo="Sobre o No Corre!" />
          <ItemConfiguracao href="/perfil/seguranca" icone="/icones/perfil-seguranca.svg" rotulo="Senha e segurança" />
          <li>
            <form action={sair} onSubmit={limparEstadoDasTelas}>
              <button type="submit" className={CLASSE_ITEM}>
                <span className={`${CLASSE_ICONE} bg-cinza-claro`}>
                  <Image src="/icones/perfil-sair.svg" alt="" width={16} height={16} />
                </span>
                <span className="flex-1 text-xs font-semibold text-cinza-escuro">Sair da conta</span>
              </button>
            </form>
          </li>
        </ul>
      </Secao>
    </main>
  );
}
