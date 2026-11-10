import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { VERSAO_ATUAL } from "@/lib/novidades";

export const metadata: Metadata = { title: "Sobre | No Corre!" };

const REPOSITORIO = "https://github.com/Vini04Dev/NoCorre";
const EMAIL = "vini0102033@gmail.com";

const PERFIS = ["Entrega por aplicativo", "Central de motoboy", "Pizzaria e comércio", "Mototáxi", "Corrida avulsa"];

const RECURSOS = [
  { icone: "💰", texto: "Saldo do dia, da semana e do mês" },
  { icone: "➕", texto: "Receita e despesa em poucos toques" },
  { icone: "📊", texto: "Relatórios com o dia e o horário que mais rendem" },
  { icone: "🎯", texto: "Metas e contas parceladas" },
  { icone: "👥", texto: "Seus clientes e categorias" },
];

function Cartao({ titulo, icone, children }: { titulo: string; icone: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2 rounded-[14px] border border-black/8 bg-white p-4 shadow-cartao">
      <h2 className="flex items-center gap-2 text-sm font-extrabold">
        <span aria-hidden className="grid size-7 place-items-center rounded-full bg-dourado-claro/40 text-sm">
          {icone}
        </span>
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

      <div className="relative flex flex-col items-center gap-1 overflow-hidden rounded-[18px] bg-linear-to-br from-marinho to-[#3d405b] px-5 py-6 text-center text-white">
        <div aria-hidden className="pointer-events-none absolute -bottom-16 left-1/2 size-48 -translate-x-1/2 rounded-full bg-dourado/30 blur-3xl" />
        <span className="relative size-20 overflow-hidden rounded-[22px] bg-white shadow-cartao">
          <Image src="/imagens/logo.png" alt="" width={80} height={80} />
        </span>
        <p className="relative mt-2 text-xl font-black">No Corre!</p>
        <p className="relative text-xs text-dourado-claro">De Entregador para Entregador</p>
        <Link
          href="/perfil/novidades"
          className="relative mt-2 rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold text-cinza-claro transition-colors hover:bg-white/20"
        >
          versão {VERSAO_ATUAL} · ver novidades ›
        </Link>
      </div>

      <Cartao titulo="O que é" icone="🏍️">
        Um app para quem vive do corre. Você anota o que entra e o que sai e, na hora, sabe quanto sobrou no
        dia, na semana e no mês. Sem planilha e sem caderninho.
      </Cartao>

      <Cartao titulo="Feito para quem roda" icone="🤝">
        <p>Serve para qualquer jeito de trabalhar, sem telas separadas para cada um:</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {PERFIS.map((perfil) => (
            <li key={perfil} className="rounded-full bg-cinza-fundo px-2.5 py-1 text-[11px] font-medium text-marinho">
              {perfil}
            </li>
          ))}
        </ul>
      </Cartao>

      <Cartao titulo="O que dá para fazer" icone="✨">
        <ul className="flex flex-col gap-1.5">
          {RECURSOS.map(({ icone, texto }) => (
            <li key={texto} className="flex items-center gap-2">
              <span aria-hidden>{icone}</span>
              {texto}
            </li>
          ))}
        </ul>
      </Cartao>

      <Cartao titulo="Seu dinheiro, só seu" icone="🔒">
        O que você lança aqui é só seu: ninguém mais vê suas receitas, despesas ou clientes, nem outros
        entregadores. Quer esconder os valores na frente de alguém? Toque no olhinho do Início. E se um dia
        quiser sair, você apaga a conta em Senha e segurança e tudo vai junto, na hora.
      </Cartao>

      <Cartao titulo="Nascido no corre" icone="📍">
        O No Corre! nasceu em São Sebastião do Paraíso (MG), criado por um entregador de pizzaria que cansou de
        perder as contas no caderno. O teste piloto roda com entregadores da cidade, e cada ideia deles vira
        melhoria no app.
      </Cartao>

      <Cartao titulo="Código aberto" icone="💻">
        O No Corre! é um projeto de portfólio com código aberto no GitHub. Sinta-se à vontade para olhar como
        ele é feito, abrir issues e sugerir melhorias.
        <a href={REPOSITORIO} target="_blank" rel="noreferrer" className="mt-2 block font-bold text-dourado">
          Ver o código no GitHub ↗
        </a>
      </Cartao>

      <Cartao titulo="Fale com a gente" icone="💬">
        Achou um erro ou teve uma ideia? Mande um e-mail que a gente responde.
        <a href={`mailto:${EMAIL}`} className="mt-2 block font-bold break-all text-dourado">
          {EMAIL}
        </a>
      </Cartao>

      <p className="pt-2 text-center text-[11px] text-cinza-escuro">Feito com 🧡 em São Sebastião do Paraíso</p>
    </main>
  );
}
