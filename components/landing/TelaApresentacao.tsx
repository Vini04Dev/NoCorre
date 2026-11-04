import Image from "next/image";
import Link from "next/link";
import {
  DEPOIMENTOS,
  LINKS_NAVEGACAO,
  NUMEROS,
  PASSOS,
  PERFIS,
  PERGUNTAS,
  PLANO_GRATIS,
  PLANO_PRO,
  RECURSOS,
} from "./dados";
import { MockupCelular } from "./MockupCelular";

const CONTEUDO = "mx-auto w-full max-w-6xl px-5 sm:px-8";
const BOTAO_PRINCIPAL =
  "inline-flex items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--color-dourado-claro),var(--color-dourado))] px-6 py-3 text-sm font-extrabold text-marinho shadow-cartao transition hover:brightness-105";
const BOTAO_SECUNDARIO =
  "inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10";

function Marca({ clara = false }: { clara?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="size-9 overflow-hidden rounded-[10px] bg-white ring-1 ring-black/5">
        <Image src="/imagens/logo.png" alt="" width={36} height={36} />
      </span>
      <span className={`text-lg font-black ${clara ? "text-white" : "text-marinho"}`}>No Corre!</span>
    </Link>
  );
}

function Titulo({ selo, titulo, texto }: { selo: string; titulo: string; texto?: string }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
      <span className="rounded-full bg-dourado-claro/40 px-3 py-1 text-[11px] font-semibold tracking-[0.66px] text-marinho">
        {selo}
      </span>
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{titulo}</h2>
      {texto && <p className="text-base text-cinza-escuro">{texto}</p>}
    </div>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="size-5 shrink-0" aria-hidden>
      <circle cx="10" cy="10" r="10" className="fill-positivo/15" />
      <path d="M6 10.5l2.5 2.5L14 7.5" fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-recebido" />
    </svg>
  );
}

function BarraSuperior() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-fundo/85 backdrop-blur">
      <nav aria-label="Navegação do site" className={`${CONTEUDO} flex h-16 items-center justify-between gap-6`}>
        <Marca />
        <ul className="hidden items-center gap-7 text-sm font-medium text-marinho/80 md:flex">
          {LINKS_NAVEGACAO.map(({ href, rotulo }) => (
            <li key={href}>
              <a href={href} className="transition hover:text-marinho">
                {rotulo}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link href="/entrar" className="rounded-xl px-4 py-2 text-sm font-semibold transition hover:bg-cinza-fundo">
            Entrar
          </Link>
          <Link
            href="/cadastrar"
            className="hidden rounded-xl bg-marinho px-4 py-2 text-sm font-semibold text-white transition hover:bg-marinho/90 sm:inline-flex"
          >
            Criar conta grátis
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-marinho text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] size-[620px] rounded-full bg-dourado/25 blur-[120px]"
      />
      <div aria-hidden className="pointer-events-none absolute bottom-[-30%] left-[-10%] size-[480px] rounded-full bg-cinza/20 blur-[120px]" />
      <div className={`${CONTEUDO} relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-28`}>
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-cinza-claro">
            De entregador para entregador
          </span>
          <h1 className="text-4xl leading-[1.1] font-black tracking-tight sm:text-5xl lg:text-6xl">
            Seu corre organizado, <span className="text-dourado-claro">do primeiro pedido</span> ao fim do mês.
          </h1>
          <p className="max-w-xl text-base text-cinza-claro sm:text-lg">
            Registre entregas, corridas e despesas em segundos. Saiba quanto sobrou, quanto falta receber e se a meta
            da semana vai bater.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/cadastrar" className={BOTAO_PRINCIPAL}>
              Começar grátis
            </Link>
            <a href="#como-funciona" className={BOTAO_SECUNDARIO}>
              Ver como funciona
            </a>
          </div>
          <dl className="mt-4 grid w-full max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {NUMEROS.map(({ valor, rotulo }) => (
              <div key={rotulo} className="flex flex-col-reverse gap-0.5">
                <dt className="text-[11px] text-cinza sm:text-xs">{rotulo}</dt>
                <dd className="text-xl font-extrabold text-dourado-claro sm:text-2xl">{valor}</dd>
              </div>
            ))}
          </dl>
        </div>
        <MockupCelular />
      </div>
    </section>
  );
}

function FaixaPerfis() {
  return (
    <section aria-label="Para quem é" className="border-b border-black/5 bg-white">
      <div className={`${CONTEUDO} flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between`}>
        <p className="text-xs font-semibold tracking-[0.66px] text-cinza-escuro">FEITO PARA QUEM RODA EM</p>
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-marinho/70">
          {PERFIS.map((perfil) => (
            <li key={perfil}>{perfil}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Recursos() {
  return (
    <section id="recursos" className="scroll-mt-16 py-20 sm:py-24">
      <div className={`${CONTEUDO} flex flex-col gap-12`}>
        <Titulo
          selo="RECURSOS"
          titulo="Tudo o que o seu caixa precisa, sem complicação"
          texto="Pensado para quem não tem tempo de planilha: telas simples, poucos toques e números que fazem sentido."
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RECURSOS.map(({ icone, titulo, texto }) => (
            <li
              key={titulo}
              className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-6 shadow-cartao transition hover:-translate-y-0.5"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-marinho">
                <Image src={icone} alt="" width={24} height={24} className="brightness-0 invert" />
              </span>
              <h3 className="text-lg font-bold">{titulo}</h3>
              <p className="text-sm text-cinza-escuro">{texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ComoFunciona() {
  return (
    <section id="como-funciona" className="scroll-mt-16 bg-white py-20 sm:py-24">
      <div className={`${CONTEUDO} flex flex-col gap-12`}>
        <Titulo selo="COMO FUNCIONA" titulo="Em 3 passos você já está no controle" />
        <ol className="grid gap-6 md:grid-cols-3">
          {PASSOS.map(({ titulo, texto }, indice) => (
            <li key={titulo} className="relative flex flex-col gap-3 rounded-2xl bg-fundo p-6">
              <span className="grid size-10 place-items-center rounded-full bg-dourado-claro text-base font-black">
                {indice + 1}
              </span>
              <h3 className="text-lg font-bold">{titulo}</h3>
              <p className="text-sm text-cinza-escuro">{texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Depoimentos() {
  return (
    <section id="depoimentos" className="scroll-mt-16 py-20 sm:py-24">
      <div className={`${CONTEUDO} flex flex-col gap-12`}>
        <Titulo selo="DEPOIMENTOS" titulo="Quem usa não volta pro caderninho" />
        <ul className="grid gap-5 md:grid-cols-3">
          {DEPOIMENTOS.map(({ nome, papel, texto }) => (
            <li key={nome} className="flex flex-col gap-5 rounded-2xl border border-black/5 bg-white p-6 shadow-cartao">
              <span aria-label="5 de 5 estrelas" className="text-dourado">
                ★★★★★
              </span>
              <blockquote className="flex-1 text-[15px] leading-relaxed">“{texto}”</blockquote>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-marinho text-sm font-bold text-dourado-claro">
                  {nome[0]}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold">{nome}</span>
                  <span className="text-xs text-cinza-escuro">{papel}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Planos() {
  return (
    <section id="planos" className="scroll-mt-16 bg-white py-20 sm:py-24">
      <div className={`${CONTEUDO} flex flex-col gap-12`}>
        <Titulo selo="PLANOS" titulo="Grátis para começar. Grátis para continuar." />
        <div className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-2">
          <div className="relative flex flex-col gap-6 rounded-3xl bg-marinho p-8 text-white shadow-[0_30px_60px_-20px_rgba(43,45,66,0.6)]">
            <span className="absolute top-6 right-6 rounded-full bg-dourado-claro px-3 py-1 text-[11px] font-bold text-marinho">
              DISPONÍVEL
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold">Grátis</h3>
              <p className="text-4xl font-black">
                R$ 0<span className="text-base font-medium text-cinza">/mês</span>
              </p>
            </div>
            <ul className="flex flex-col gap-3 text-sm">
              {PLANO_GRATIS.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/cadastrar" className={`${BOTAO_PRINCIPAL} mt-auto`}>
              Criar minha conta
            </Link>
          </div>
          <div className="flex flex-col gap-6 rounded-3xl border border-cinza-claro bg-fundo p-8">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold">Pro</h3>
              <p className="text-4xl font-black text-cinza-escuro">Em breve</p>
            </div>
            <ul className="flex flex-col gap-3 text-sm">
              {PLANO_PRO.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
            <span className="mt-auto inline-flex items-center justify-center rounded-xl border border-cinza-claro px-6 py-3 text-sm font-semibold text-cinza-escuro">
              Avisaremos no app
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Perguntas() {
  return (
    <section id="perguntas" className="scroll-mt-16 py-20 sm:py-24">
      <div className={`${CONTEUDO} flex flex-col gap-10`}>
        <Titulo selo="DÚVIDAS" titulo="Perguntas frequentes" />
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
          {PERGUNTAS.map(({ pergunta, resposta }) => (
            <details
              key={pergunta}
              className="group rounded-2xl border border-black/5 bg-white px-6 py-4 shadow-cartao open:pb-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold">
                {pergunta}
                <span aria-hidden className="text-xl text-cinza-escuro transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-cinza-escuro">{resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChamadaFinal() {
  return (
    <section id="entrar" className="scroll-mt-16 px-5 pb-20 sm:px-8">
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 overflow-hidden rounded-3xl bg-marinho px-6 py-14 text-center text-white sm:py-16">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-dourado/25 blur-[100px]" />
        <h2 className="relative max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">Bora pro corre organizado?</h2>
        <p className="relative max-w-xl text-cinza-claro">
          Crie sua conta em menos de um minuto, ou entre para continuar de onde parou.
        </p>
        <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/cadastrar" className={BOTAO_PRINCIPAL}>
            Criar conta grátis
          </Link>
          <Link href="/entrar" className={BOTAO_SECUNDARIO}>
            Já tenho conta, entrar
          </Link>
        </div>
      </div>
    </section>
  );
}

function Rodape() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className={`${CONTEUDO} flex flex-col items-center gap-4 py-8 text-sm text-cinza-escuro sm:flex-row sm:justify-between`}>
        <Marca />
        <p>© {new Date().getFullYear()} No Corre! · Feito por entregador, para entregador.</p>
      </div>
    </footer>
  );
}

/** Landing page para quem ainda não está logado. */
export function TelaApresentacao() {
  return (
    <div className="min-h-dvh scroll-smooth bg-fundo">
      <BarraSuperior />
      <main>
        <Hero />
        <FaixaPerfis />
        <Recursos />
        <ComoFunciona />
        <Depoimentos />
        <Planos />
        <Perguntas />
        <ChamadaFinal />
      </main>
      <Rodape />
    </div>
  );
}
