import Image from "next/image";
import Link from "next/link";
import { Contador } from "./Contador";
import { DEPOIMENTOS, LINKS_NAVEGACAO, NUMEROS, PERFIS, PERGUNTAS, PLANO_GRATIS, PLANO_PRO } from "./dados";
import { Frase } from "./Frase";
import { Graficos } from "./Graficos";
import { Hero } from "./Hero";
import { HistoriaApp } from "./HistoriaApp";
import { MapaCidade } from "./MapaCidade";
import { Passos } from "./Passos";
import { Revelar } from "./Revelar";

const CONTEUDO = "mx-auto w-full max-w-6xl px-5 sm:px-8";
const BOTAO_PRINCIPAL =
  "inline-flex items-center justify-center rounded-full bg-[linear-gradient(90deg,var(--color-dourado-claro),var(--color-dourado))] px-7 py-3 text-sm font-extrabold text-marinho transition hover:brightness-105";
const BOTAO_SECUNDARIO =
  "inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10";

function Marca() {
  return (
    <Link href="/apresentacao" className="flex items-center gap-2.5">
      <span className="size-8 overflow-hidden rounded-[9px] bg-white">
        <Image src="/imagens/logo.png" alt="" width={32} height={32} />
      </span>
      <span className="text-base font-black text-white">No Corre!</span>
    </Link>
  );
}

function Titulo({ selo, titulo, texto }: { selo: string; titulo: string; texto?: string }) {
  return (
    <Revelar className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
      <span className="text-xs font-semibold tracking-[0.2em] text-dourado-claro">{selo}</span>
      <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">{titulo}</h2>
      {texto && <p className="max-w-2xl text-base text-cinza-claro sm:text-xl">{texto}</p>}
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

function BarraSuperior({ logado }: { logado: boolean }) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/8 bg-[#0d0e16]/70 backdrop-blur-xl">
      <nav aria-label="Navegação do site" className={`${CONTEUDO} flex h-14 items-center justify-between gap-6`}>
        <Marca />
        <ul className="hidden items-center gap-7 text-[13px] text-cinza-claro md:flex">
          {LINKS_NAVEGACAO.map(({ href, rotulo }) => (
            <li key={href}>
              <a href={href} className="transition hover:text-white">
                {rotulo}
              </a>
            </li>
          ))}
        </ul>
        {logado ? (
          <Link href="/" className="rounded-full bg-white px-4 py-1.5 text-[13px] font-semibold text-marinho transition hover:bg-cinza-claro">
            Abrir o app
          </Link>
        ) : (
          <div className="flex items-center gap-1.5">
            <Link href="/entrar" className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-white transition hover:bg-white/10">
              Entrar
            </Link>
            <Link
              href="/cadastrar"
              className="rounded-full bg-dourado-claro px-4 py-1.5 text-[13px] font-semibold text-marinho transition hover:brightness-105"
            >
              Criar conta
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

function Numeros() {
  return (
    <section className="border-y border-white/8">
      <dl className={`${CONTEUDO} grid gap-8 py-14 text-center sm:grid-cols-3`}>
        {NUMEROS.map(({ ate, prefixo, sufixo, rotulo, casas }, indice) => (
          <Revelar key={rotulo} atraso={indice * 120} className="flex flex-col-reverse gap-1">
            <dt className="text-sm text-cinza">{rotulo}</dt>
            <dd className="text-4xl font-black text-white sm:text-5xl">
              <Contador ate={ate} prefixo={prefixo} sufixo={sufixo} casas={casas} />
            </dd>
          </Revelar>
        ))}
      </dl>
      <ul className={`${CONTEUDO} flex flex-wrap justify-center gap-x-8 gap-y-2 pb-12 text-sm text-cinza`}>
        {PERFIS.map((perfil) => (
          <li key={perfil}>{perfil}</li>
        ))}
      </ul>
    </section>
  );
}

function ComoFunciona() {
  return (
    <section className="py-28 sm:py-36">
      <div className={`${CONTEUDO} flex flex-col gap-14`}>
        <Titulo selo="COMEÇAR É RÁPIDO" titulo="Três passos. Menos de um minuto." />
        <Passos />
      </div>
    </section>
  );
}

function Depoimentos() {
  return (
    <section className="py-28 sm:py-36">
      <div className={`${CONTEUDO} flex flex-col gap-14`}>
        <Titulo selo="QUEM JÁ RODA COM A GENTE" titulo="Adeus, caderninho." />
        <ul className="grid gap-5 md:grid-cols-3">
          {DEPOIMENTOS.map(({ nome, papel, texto }, indice) => (
            <Revelar key={nome} como="zoom" atraso={indice * 150}>
              <li className="flex h-full flex-col gap-6 rounded-[28px] bg-white p-7 text-marinho">
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

function Planos() {
  return (
    <section id="planos" className="scroll-mt-14 py-28 sm:py-36">
      <div className={`${CONTEUDO} flex flex-col gap-14`}>
        <Titulo selo="PLANOS" titulo="Grátis para começar. Grátis para continuar." />
        <div className="mx-auto grid w-full max-w-4xl gap-5 md:grid-cols-2">
          <Revelar como="esquerda">
            <div className="flex h-full flex-col gap-6 rounded-[28px] bg-[linear-gradient(150deg,#ffd36a,#e0a92e)] p-8 text-marinho">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold">Grátis</h3>
                <span className="rounded-full bg-marinho px-3 py-1 text-[11px] font-bold text-dourado-claro">DISPONÍVEL</span>
              </div>
              <p className="text-5xl font-black">
                R$ 0<span className="text-base font-medium">/mês</span>
              </p>
              <ul className="flex flex-col gap-3 text-sm font-medium">
                {PLANO_GRATIS.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span aria-hidden className="grid size-5 place-items-center rounded-full bg-marinho text-[11px] text-dourado-claro">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/cadastrar" className="mt-auto rounded-full bg-marinho px-7 py-3 text-center text-sm font-bold text-white">
                Criar minha conta
              </Link>
            </div>
          </Revelar>
          <Revelar como="direita" atraso={120}>
            <div className="flex h-full flex-col gap-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-8 text-white">
              <h3 className="text-lg font-bold">Pro</h3>
              <p className="text-5xl font-black text-cinza">Em breve</p>
              <ul className="flex flex-col gap-3 text-sm text-cinza-claro">
                {PLANO_PRO.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
              <span className="mt-auto rounded-full border border-white/15 px-7 py-3 text-center text-sm text-cinza">
                Avisaremos no app
              </span>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  );
}

function Perguntas() {
  return (
    <section id="perguntas" className="scroll-mt-14 py-28 sm:py-36">
      <div className={`${CONTEUDO} flex flex-col gap-12`}>
        <Titulo selo="DÚVIDAS" titulo="Perguntas frequentes" />
        <div className="mx-auto flex w-full max-w-3xl flex-col divide-y divide-white/10 border-y border-white/10">
          {PERGUNTAS.map(({ pergunta, resposta }) => (
            <details key={pergunta} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-white">
                {pergunta}
                <span aria-hidden className="text-2xl text-dourado-claro transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-cinza-claro">{resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChamadaFinal({ logado }: { logado: boolean }) {
  return (
    <section id="entrar" className="scroll-mt-14 px-5 pb-24 sm:px-8">
      <Revelar como="zoom">
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 overflow-hidden rounded-[36px] bg-[linear-gradient(160deg,#2b2d42,#151622)] px-6 py-20 text-center ring-1 ring-white/10 sm:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-dourado/30 blur-[120px]"
          />
          <h2 className="relative max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl">Bora pro corre</h2>
          <p className="relative max-w-xl text-lg text-cinza-claro">
            {logado ? "Sua conta já está aberta neste aparelho." : "Crie sua conta grátis ou entre para continuar de onde parou."}
          </p>
          <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {logado ? (
              <Link href="/" className={BOTAO_PRINCIPAL}>
                Abrir o app
              </Link>
            ) : (
              <>
                <Link href="/cadastrar" className={BOTAO_PRINCIPAL}>
                  Criar conta grátis
                </Link>
                <Link href="/entrar" className={BOTAO_SECUNDARIO}>
                  Já tenho conta, entrar
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

function CodigoAberto() {
  return (
    <section id="codigo" className="scroll-mt-14 py-28 sm:py-36">
      <Revelar className={`${CONTEUDO} flex flex-col items-center gap-6 text-center`}>
        <span className="text-xs font-semibold tracking-[0.2em] text-dourado-claro">CÓDIGO ABERTO</span>
        <h2 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl">Open source, à vista de todo mundo.</h2>
        <p className="max-w-2xl text-lg text-cinza-claro">
          O código do No Corre! é aberto e está no GitHub. Qualquer pessoa pode ver como o app é feito.
        </p>
        <a href={REPOSITORIO} target="_blank" rel="noreferrer" className={BOTAO_SECUNDARIO}>
          Ver no GitHub ↗
        </a>
      </Revelar>
    </section>
  );
}

function Rodape() {
  return (
    <footer className="border-t border-white/8">
      <div className={`${CONTEUDO} grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]`}>
        <div className="flex flex-col gap-3">
          <Marca />
          <p className="max-w-xs text-sm text-cinza">
            Controle de entregas e receita para motoboys e entregadores. Nascido em São Sebastião do Paraíso, MG.
          </p>
        </div>
        <nav aria-label="Produto" className="flex flex-col gap-3 text-sm">
          <span className="font-semibold text-white">Produto</span>
          {LINKS_NAVEGACAO.map(({ href, rotulo }) => (
            <a key={href} href={href} className="text-cinza transition hover:text-white">
              {rotulo}
            </a>
          ))}
        </nav>
        <nav aria-label="Acesso" className="flex flex-col gap-3 text-sm">
          <span className="font-semibold text-white">Acesso</span>
          <Link href="/entrar" className="text-cinza transition hover:text-white">
            Entrar
          </Link>
          <Link href="/cadastrar" className="text-cinza transition hover:text-white">
            Criar conta
          </Link>
          <a href={REPOSITORIO} target="_blank" rel="noreferrer" className="text-cinza transition hover:text-white">
            GitHub
          </a>
        </nav>
        <div className="flex flex-col gap-3 text-sm">
          <span className="font-semibold text-white">Contato</span>
          <a href={`mailto:${EMAIL}`} className="break-all text-cinza transition hover:text-white">
            {EMAIL}
          </a>
          <span className="text-cinza">São Sebastião do Paraíso, MG</span>
        </div>
      </div>
      <div className="border-t border-white/8">
        <p className={`${CONTEUDO} py-6 text-center text-xs text-cinza sm:text-left`}>
          © {new Date().getFullYear()} No Corre!. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

/** Landing page. Quem já está logado vê "Abrir o app" no lugar de Entrar/Criar conta. */
export function TelaApresentacao({ logado }: { logado: boolean }) {
  return (
    // overflow-x-clip (e não hidden) segura os itens que entram de lado sem quebrar o sticky.
    <div className="min-h-dvh overflow-x-clip scroll-smooth bg-[#0d0e16] text-white">
      <BarraSuperior logado={logado} />
      <main>
        <Hero logado={logado} />
        <Numeros />
        <Frase
          texto="Cada entrega, cada corrida, cada real que entra e sai. Tudo no seu bolso, do jeito que o corre flui."
          destaque={["entrega,", "corrida,", "real"]}
        />
        <section id="historia" className="scroll-mt-14 pb-20">
          <HistoriaApp />
        </section>
        <section id="relatorios" className="scroll-mt-14 py-28 sm:py-36">
          <div className={`${CONTEUDO} flex flex-col gap-14`}>
            <Titulo
              selo="RELATÓRIOS"
              titulo="Números que mostram o caminho."
              texto="Descubra o dia que mais rende, para onde vai o dinheiro e se a meta do mês vai bater."
            />
            <Graficos />
          </div>
        </section>
        <div id="cidade" className="scroll-mt-14">
          <MapaCidade />
        </div>
        <ComoFunciona />
        <Depoimentos />
        <Planos />
        <CodigoAberto />
        <Perguntas />
        <ChamadaFinal logado={logado} />
      </main>
      <Rodape />
    </div>
  );
}
