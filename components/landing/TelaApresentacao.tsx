import Image from "next/image";
import Link from "next/link";
import { Contador } from "./Contador";
import { ProvedorLanding } from "./ContextoLanding";
import { ANCORAS, NUMEROS } from "./dados";
import { Frase } from "./Frase";
import { FundoAnimado } from "./FundoAnimado";
import { Graficos } from "./Graficos";
import { Hero } from "./Hero";
import { HistoriaApp } from "./HistoriaApp";
import { TEXTOS, type Idioma, type Tema, type Textos } from "./idiomas";
import { MapaCidade } from "./MapaCidade";
import { Passos } from "./Passos";
import { Revelar } from "./Revelar";
import { SeletoresLanding } from "./SeletoresLanding";
import { Terminal } from "./Terminal";

const CONTEUDO = "mx-auto w-full max-w-6xl px-5 sm:px-8";
const BOTAO_PRINCIPAL =
  "inline-flex items-center justify-center rounded-lg bg-dourado-claro px-6 py-3 text-sm font-bold text-marinho transition hover:bg-[#ffdd85]";
const BOTAO_SECUNDARIO =
  "inline-flex items-center justify-center rounded-lg border border-l-tinta/20 px-6 py-3 text-sm font-semibold text-l-titulo transition hover:bg-l-tinta/10";

function Marca() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="size-8 overflow-hidden rounded-[9px] bg-white">
        <Image src="/imagens/logo.png" alt="" width={32} height={32} />
      </span>
      <span className="font-titulo text-lg font-bold tracking-[-0.02em] text-l-titulo">No Corre!</span>
    </Link>
  );
}

function Titulo({ selo, titulo, texto }: { selo: string; titulo: string; texto?: string }) {
  return (
    <Revelar className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
      <span className="text-xs font-semibold tracking-[0.14em] text-l-destaque uppercase">{selo}</span>
      <h2 className="text-4xl font-titulo font-bold tracking-[-0.03em] text-l-titulo sm:text-6xl">{titulo}</h2>
      {texto && <p className="max-w-2xl text-base text-l-texto sm:text-xl">{texto}</p>}
    </Revelar>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="size-5 shrink-0" aria-hidden>
      <circle cx="10" cy="10" r="10" className="fill-positivo/20" />
      <path d="M6 10.5l2.5 2.5L14 7.5" fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-positivo" />
    </svg>
  );
}

function BarraSuperior({ logado, t }: { logado: boolean; t: Textos }) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-l-tinta/8 bg-l-fundo/70 backdrop-blur-xl">
      <nav aria-label={t.nav.rotulo} className={`${CONTEUDO} flex h-14 items-center justify-between gap-6`}>
        <Marca />
        <ul className="hidden items-center gap-7 text-[13px] text-l-texto md:flex">
          {ANCORAS.map((href, indice) => (
            <li key={href}>
              <a href={href} className="transition hover:text-l-titulo">
                {t.nav.links[indice]}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1.5">
          <SeletoresLanding />
        {logado ? (
          <Link href="/" className="rounded-md bg-white px-4 py-1.5 text-[13px] font-semibold text-marinho transition hover:bg-cinza-claro">
            {t.nav.abrirApp}
          </Link>
        ) : (
          <>
            <Link href="/entrar" className="rounded-md px-3.5 py-1.5 text-[13px] font-semibold text-l-titulo transition hover:bg-l-tinta/10">
              {t.nav.entrar}
            </Link>
            <Link
              href="/cadastrar"
              className="rounded-md bg-dourado-claro px-4 py-1.5 text-[13px] font-semibold text-marinho transition hover:bg-[#ffdd85]"
            >
              {t.nav.criarConta}
            </Link>
          </>
        )}
        </div>
      </nav>
    </header>
  );
}

function Numeros({ t }: { t: Textos }) {
  return (
    <section className="border-y border-l-tinta/8">
      <dl className={`${CONTEUDO} grid gap-8 py-14 text-center sm:grid-cols-3`}>
        {NUMEROS.map(({ ate, prefixo, sufixo, casas }, indice) => (
          <Revelar key={t.numeros[indice]} atraso={indice * 120} className="flex flex-col-reverse gap-1">
            <dt className="text-sm text-l-suave">{t.numeros[indice]}</dt>
            <dd className="font-titulo text-4xl font-bold text-l-titulo sm:text-5xl">
              <Contador ate={ate} prefixo={prefixo} sufixo={sufixo} casas={casas} />
            </dd>
          </Revelar>
        ))}
      </dl>
      <ul className={`${CONTEUDO} flex flex-wrap justify-center gap-x-8 gap-y-2 pb-12 text-sm text-l-suave`}>
        {t.perfis.map((perfil) => (
          <li key={perfil}>{perfil}</li>
        ))}
      </ul>
    </section>
  );
}

function ComoFunciona({ t }: { t: Textos }) {
  return (
    <section className="py-16 sm:py-24">
      <div className={`${CONTEUDO} flex flex-col gap-14`}>
        <Titulo selo={t.passos.selo} titulo={t.passos.titulo} />
        <Passos />
      </div>
    </section>
  );
}

function Depoimentos({ t }: { t: Textos }) {
  return (
    <section className="py-16 sm:py-24">
      <div className={`${CONTEUDO} flex flex-col gap-14`}>
        <Titulo selo={t.depoimentos.selo} titulo={t.depoimentos.titulo} />
        <ul className="grid gap-5 md:grid-cols-3">
          {t.depoimentos.itens.map(({ nome, papel, texto }, indice) => (
            <Revelar key={nome} como="zoom" atraso={indice * 150}>
              <li className="flex h-full flex-col gap-6 rounded-2xl bg-white p-7 text-marinho ring-1 ring-black/5">
                <blockquote className="flex-1 text-lg leading-relaxed font-medium">“{texto}”</blockquote>
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
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Planos({ t }: { t: Textos }) {
  return (
    <section id="planos" className="scroll-mt-14 py-16 sm:py-24">
      <div className={`${CONTEUDO} flex flex-col gap-14`}>
        <Titulo selo={t.planos.selo} titulo={t.planos.titulo} />
        <div className="mx-auto grid w-full max-w-4xl gap-5 md:grid-cols-2">
          <Revelar como="esquerda" duracao={1600}>
            <div className="flex h-full flex-col gap-6 rounded-2xl bg-dourado-claro p-8 text-marinho">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold">{t.planos.gratis}</h3>
                <span className="rounded-full bg-marinho px-3 py-1 text-[11px] font-bold text-dourado-claro">{t.planos.disponivel}</span>
              </div>
              <p className="font-titulo text-5xl font-bold">
                R$ 0<span className="text-base font-medium">{t.planos.porMes}</span>
              </p>
              <ul className="flex flex-col gap-3 text-sm font-medium">
                {t.planos.itensGratis.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span aria-hidden className="grid size-5 place-items-center rounded-full bg-marinho text-[11px] text-dourado-claro">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/cadastrar" className="mt-auto rounded-lg bg-marinho px-6 py-3 text-center text-sm font-bold text-white">
                {t.planos.criarMinhaConta}
              </Link>
            </div>
          </Revelar>
          <Revelar como="direita" atraso={250} duracao={1600}>
            <div className="flex h-full flex-col gap-6 rounded-2xl border border-l-tinta/10 bg-l-tinta/[0.04] p-8 text-l-titulo">
              <h3 className="text-lg font-bold">Pro</h3>
              <p className="font-titulo text-5xl font-bold text-l-suave">{t.planos.emBreve}</p>
              <ul className="flex flex-col gap-3 text-sm text-l-texto">
                {t.planos.itensPro.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
              <span className="mt-auto rounded-lg border border-l-tinta/15 px-6 py-3 text-center text-sm text-l-suave">
                {t.planos.avisaremos}
              </span>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  );
}

function Perguntas({ t }: { t: Textos }) {
  return (
    <section id="perguntas" className="scroll-mt-14 py-16 sm:py-24">
      <div className={`${CONTEUDO} flex flex-col gap-12`}>
        <Titulo selo={t.perguntas.selo} titulo={t.perguntas.titulo} />
        <div className="mx-auto flex w-full max-w-3xl flex-col divide-y divide-l-tinta/10 border-y border-l-tinta/10">
          {t.perguntas.itens.map(({ pergunta, resposta }) => (
            <details key={pergunta} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-l-titulo">
                {pergunta}
                <span aria-hidden className="text-2xl text-l-destaque transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-l-texto">{resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChamadaFinal({ logado, t }: { logado: boolean; t: Textos }) {
  return (
    <section id="entrar" className="scroll-mt-14 px-5 pb-20 sm:px-8">
      <Revelar como="zoom">
        {/* Cinza por padrão; a luz do fundo (FundoAnimado) para em cima dele e define
            --aceso, que acende o brilho dourado e a borda. */}
        <div
          data-luz-alvo
          className="landing-escura relative mx-auto flex max-w-6xl flex-col items-center gap-6 overflow-hidden rounded-[36px] bg-[linear-gradient(160deg,#2a2b33,#16171c)] px-6 py-20 text-center sm:py-28"
        >
          <div
            aria-hidden
            style={{ opacity: "var(--aceso, 0)" }}
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,#2b2d42,#151622)] transition-opacity duration-300"
          />
          <div
            aria-hidden
            style={{ opacity: "var(--aceso, 0)", transform: "translateX(-50%) scale(calc(0.6 + var(--aceso, 0) * 0.4))" }}
            className="pointer-events-none absolute -bottom-40 left-1/2 size-[520px] rounded-full bg-dourado/30 blur-[120px] transition-[opacity,transform] duration-300"
          />
          <div
            aria-hidden
            style={{ opacity: "calc(0.4 + var(--aceso, 0) * 0.6)" }}
            className="pointer-events-none absolute inset-0 rounded-[36px] ring-1 ring-l-tinta/10 ring-inset"
          />
          <h2 className="relative max-w-3xl font-titulo text-4xl font-bold tracking-[-0.03em] text-l-titulo sm:text-6xl">
            {t.final.titulo}
          </h2>
          <p className="relative max-w-xl text-lg text-l-texto">
            {logado ? t.final.logado : t.final.deslogado}
          </p>
          <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {logado ? (
              <Link href="/" className={BOTAO_PRINCIPAL}>
                {t.nav.abrirApp}
              </Link>
            ) : (
              <>
                <Link href="/cadastrar" className={BOTAO_PRINCIPAL}>
                  {t.final.criarGratis}
                </Link>
                <Link href="/entrar" className={BOTAO_SECUNDARIO}>
                  {t.final.jaTenho}
                </Link>
              </>
            )}
          </div>
        </div>
      </Revelar>
    </section>
  );
}

const REPOSITORIO = "https://github.com/Vini04Dev/NoCorre";
const EMAIL = "vini0102033@gmail.com";

function CodigoAberto({ t }: { t: Textos }) {
  return (
    <section id="codigo" className="scroll-mt-14 py-16 sm:py-24">
      <div className={`${CONTEUDO} grid items-center gap-12 lg:grid-cols-2`}>
        <Revelar como="esquerda" className="flex flex-col items-start gap-6">
          <span className="text-xs font-semibold tracking-[0.14em] text-l-destaque uppercase">{t.codigo.selo}</span>
          <h2 className="font-titulo text-4xl font-bold tracking-[-0.03em] text-l-titulo sm:text-6xl">
            {t.codigo.titulo}
          </h2>
          <p className="max-w-xl text-lg text-l-texto">
            {t.codigo.texto}
          </p>
          <a href={REPOSITORIO} target="_blank" rel="noreferrer" className={BOTAO_SECUNDARIO}>
            {t.codigo.botao}
          </a>
        </Revelar>
        <Revelar como="direita" atraso={150} className="min-w-0">
          <Terminal />
        </Revelar>
      </div>
    </section>
  );
}

function Rodape({ t }: { t: Textos }) {
  return (
    <footer className="border-t border-l-tinta/8">
      <div className={`${CONTEUDO} grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]`}>
        <div className="flex flex-col gap-3">
          <Marca />
          <p className="max-w-xs text-sm text-l-suave">
            {t.rodape.sobre}
          </p>
        </div>
        <nav aria-label={t.rodape.produto} className="flex flex-col gap-3 text-sm">
          <span className="font-semibold text-l-titulo">{t.rodape.produto}</span>
          {ANCORAS.map((href, indice) => (
            <a key={href} href={href} className="text-l-suave transition hover:text-l-titulo">
              {t.nav.links[indice]}
            </a>
          ))}
        </nav>
        <nav aria-label={t.rodape.acesso} className="flex flex-col gap-3 text-sm">
          <span className="font-semibold text-l-titulo">{t.rodape.acesso}</span>
          <Link href="/entrar" className="text-l-suave transition hover:text-l-titulo">
            {t.nav.entrar}
          </Link>
          <Link href="/cadastrar" className="text-l-suave transition hover:text-l-titulo">
            {t.nav.criarConta}
          </Link>
          <a href={REPOSITORIO} target="_blank" rel="noreferrer" className="text-l-suave transition hover:text-l-titulo">
            GitHub
          </a>
        </nav>
        <div className="flex flex-col gap-3 text-sm">
          <span className="font-semibold text-l-titulo">{t.rodape.contato}</span>
          <a href={`mailto:${EMAIL}`} className="break-all text-l-suave transition hover:text-l-titulo">
            {EMAIL}
          </a>
          <span className="text-l-suave">São Sebastião do Paraíso, MG</span>
        </div>
      </div>
      <div className="border-t border-l-tinta/8">
        <p className={`${CONTEUDO} py-6 text-center text-xs text-l-suave sm:text-left`}>
          © {new Date().getFullYear()} No Corre!. {t.rodape.direitos}
        </p>
      </div>
    </footer>
  );
}

type Props = { logado: boolean; idioma: Idioma; tema: Tema };

/**
 * Landing page. Quem já está logado vê "Abrir o app" no lugar de Entrar/Criar conta.
 * Idioma e tema chegam do servidor (cookies) e podem ser trocados na barra de cima.
 */
export function TelaApresentacao({ logado, idioma, tema }: Props) {
  const t = TEXTOS[idioma];
  return (
    // overflow-x-clip (e não hidden) segura os itens que entram de lado sem quebrar o sticky.
    <ProvedorLanding
      idioma={idioma}
      temaInicial={tema}
      className="relative isolate min-h-dvh overflow-x-clip scroll-smooth bg-l-fundo text-l-titulo transition-colors duration-500"
    >
      <FundoAnimado />
      <BarraSuperior logado={logado} t={t} />
      <main>
        <Hero />
        <Numeros t={t} />
        <Frase texto={t.frase.texto} destaque={t.frase.destaque} />
        <section id="historia" className="scroll-mt-14">
          <HistoriaApp />
        </section>
        <section id="relatorios" className="scroll-mt-14 py-16 sm:py-24">
          <div className={`${CONTEUDO} flex flex-col gap-14`}>
            <Titulo selo={t.relatorios.selo} titulo={t.relatorios.titulo} texto={t.relatorios.texto} />
            <Graficos />
          </div>
        </section>
        <div id="cidade" className="scroll-mt-14">
          <MapaCidade />
        </div>
        <ComoFunciona t={t} />
        <Depoimentos t={t} />
        <Planos t={t} />
        <CodigoAberto t={t} />
        <Perguntas t={t} />
        <ChamadaFinal logado={logado} t={t} />
      </main>
      <Rodape t={t} />
    </ProvedorLanding>
  );
}
