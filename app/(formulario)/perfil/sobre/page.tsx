import type { Metadata } from "next";
import Image from "next/image";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import pacote from "@/package.json";

export const metadata: Metadata = { title: "Sobre | No Corre!" };

const TOPICOS = [
  {
    titulo: "O que é",
    texto:
      "Um app para quem vive do corre: entregador por aplicativo, por central, fixo em estabelecimento ou mototáxi. Registre receitas e despesas e veja quanto sobrou no dia, na semana e no mês.",
  },
  {
    titulo: "Seus dados",
    texto:
      "Cada conta só enxerga os próprios dados: a regra fica no banco, não só no app. Você pode excluir a conta e tudo o que está nela em Senha e segurança.",
  },
  {
    titulo: "Código aberto",
    texto: "O No Corre! é um projeto de portfólio com código aberto no GitHub.",
  },
];

export default function Pagina() {
  return (
    <main className="flex flex-col gap-4 px-5 pt-[calc(env(safe-area-inset-top)+12px)] pb-8">
      <CabecalhoTela titulo="Sobre o No Corre!" voltarPara="/perfil" />
      <div className="flex flex-col items-center gap-1 py-2">
        <span className="size-20 overflow-hidden rounded-[22px] bg-white shadow-cartao">
          <Image src="/imagens/logo.png" alt="" width={80} height={80} />
        </span>
        <p className="mt-1 text-lg font-black">No Corre!</p>
        <p className="text-xs text-cinza-escuro">De Entregador para Entregador · versão {pacote.version}</p>
      </div>
      {TOPICOS.map(({ titulo, texto }) => (
        <section key={titulo} className="rounded-[12px] border border-black/8 bg-white p-4 shadow-cartao">
          <h2 className="text-sm font-extrabold">{titulo}</h2>
          <p className="mt-1 text-xs text-cinza-escuro">{texto}</p>
        </section>
      ))}
      <a
        href="https://github.com/Vini04Dev/NoCorre"
        target="_blank"
        rel="noreferrer"
        className="text-center text-sm font-black text-dourado"
      >
        Ver o código no GitHub
      </a>
    </main>
  );
}
