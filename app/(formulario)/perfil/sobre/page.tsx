import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { IconeCirculo } from "@/components/ui/IconeCirculo";
import { VERSAO_ATUAL } from "@/lib/novidades";

export const metadata: Metadata = { title: "Sobre | No Corre!" };

const REPOSITORIO = "https://github.com/Vini04Dev/NoCorre";
const EMAIL = "vini0102033@gmail.com";

const PERFIS = ["Aplicativo de entrega", "Central de motoboy", "Estabelecimento", "Mototáxi", "Corrida avulsa"];

const RECURSOS = [
  "Saldo do dia, da semana e do mês",
  "Lançamento de receitas e despesas",
  "Relatórios por dia, horário, cliente e categoria",
  "Metas e contas parceladas",
  "Cadastro de clientes e categorias",
];

function Cartao({ titulo, icone, children }: { titulo: string; icone: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2 rounded-[14px] border border-black/8 bg-white p-4 shadow-cartao">
      <h2 className="flex items-center gap-2.5 text-sm font-extrabold">
        <IconeCirculo src={icone} tamanho="sm" />
        {titulo}
      </h2>
      <div className="text-xs leading-relaxed text-cinza-escuro">{children}</div>
    </section>
  );
}

export default function Pagina() {
  return (
    <main className="flex flex-col gap-4 px-5 pt-[calc(env(safe-area-inset-top)+12px)] pb-10">
      <CabecalhoTela titulo="Sobre o No Corre!" voltarPara="/perfil" />

      <div className="relative flex flex-col items-center gap-1 overflow-hidden rounded-[18px] bg-linear-to-r from-marinho from-40% to-cinza-escuro to-130% px-5 py-6 text-center text-white">
        <span className="size-20 overflow-hidden rounded-[22px] bg-white shadow-cartao">
          <Image src="/imagens/logo.png" alt="" width={80} height={80} />
        </span>
        <p className="mt-2 text-xl font-extrabold">No Corre!</p>
        <p className="text-xs text-cinza-claro">De Entregador para Entregador</p>
        <Link
          href="/perfil/novidades"
          className="mt-2 rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold text-cinza-claro transition-colors hover:bg-white/20"
        >
          Versão {VERSAO_ATUAL} · Notas de atualização ›
        </Link>
      </div>

      <Cartao titulo="O que é" icone="/icones/info.svg">
        Controle financeiro para quem trabalha com entrega e mototáxi. Você registra o que recebe e o que
        gasta e acompanha o saldo do dia, da semana e do mês.
      </Cartao>

      <Cartao titulo="Para quem é" icone="/icones/perfil-moto.svg">
        <p>Funciona para qualquer forma de trabalho:</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {PERFIS.map((perfil) => (
            <li key={perfil} className="rounded-full bg-cinza-fundo px-2.5 py-1 text-[11px] font-medium text-marinho">
              {perfil}
            </li>
          ))}
        </ul>
      </Cartao>

      <Cartao titulo="Recursos" icone="/icones/relatorios.svg">
        <ul className="flex flex-col gap-1.5">
          {RECURSOS.map((recurso) => (
            <li key={recurso} className="flex items-center gap-2">
              <Image src="/icones/check.svg" alt="" width={14} height={14} />
              {recurso}
            </li>
          ))}
        </ul>
      </Cartao>

      <Cartao titulo="Privacidade" icone="/icones/perfil-seguranca.svg">
        Seus lançamentos, clientes e metas são visíveis só para você. O olho no Início esconde os valores da
        tela. Para encerrar, exclua a conta em Senha e segurança: todos os dados são apagados.
      </Cartao>

      <Cartao titulo="Origem" icone="/icones/local.svg">
        Desenvolvido em São Sebastião do Paraíso (MG) por um entregador, a partir da rotina de quem trabalha
        na rua. O teste piloto acontece com entregadores da cidade.
      </Cartao>

      <Cartao titulo="Código aberto" icone="/icones/codigo.svg">
        O código do No Corre! é aberto e está no GitHub. Contribuições, relatos de erro e sugestões são bem-vindos.
        <a href={REPOSITORIO} target="_blank" rel="noreferrer" className="mt-2 block font-bold text-dourado">
          Ver o código no GitHub
        </a>
      </Cartao>

      <Cartao titulo="Contato" icone="/icones/contato.svg">
        Encontrou um erro ou tem uma sugestão? Envie um e-mail.
        <a href={`mailto:${EMAIL}`} className="mt-2 block font-bold break-all text-dourado">
          {EMAIL}
        </a>
      </Cartao>
    </main>
  );
}
