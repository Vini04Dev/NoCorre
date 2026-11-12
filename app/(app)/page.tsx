import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Suspense } from "react";
import { AvisoPrimeiroUso } from "@/components/home/AvisoPrimeiroUso";
import { AvisoProChegou } from "@/components/pro/AvisoProChegou";
import { CabecalhoHome } from "@/components/home/CabecalhoHome";
import { CartaoModulo } from "@/components/home/CartaoModulo";
import { ProximoEvento } from "@/components/home/ProximoEvento";
import { ResumoPeriodo } from "@/components/home/ResumoPeriodo";
import { classeFontesLanding } from "@/components/landing/fontes";
import { COOKIE_IDIOMA, COOKIE_TEMA, escolherIdioma, TEXTOS } from "@/components/landing/idiomas";
import { TelaApresentacao } from "@/components/landing/TelaApresentacao";
import { Secao } from "@/components/ui/Secao";
import { AvisoMoto } from "@/components/moto/AvisoMoto";
import { ehAdmin } from "@/lib/admin-servidor";
import { estaLogado } from "@/lib/sessao";
import { criarClienteServidor } from "@/lib/supabase/servidor";

/** Idioma e tema da landing: escolhidos na página (cookies) ou pelo idioma do navegador. */
async function preferenciasLanding() {
  const [armazenados, cabecalhos] = await Promise.all([cookies(), headers()]);
  const idioma = escolherIdioma(armazenados.get(COOKIE_IDIOMA)?.value, cabecalhos.get("accept-language"));
  const tema = armazenados.get(COOKIE_TEMA)?.value === "claro" ? "claro" : "escuro";
  return { idioma, tema } as const;
}

export async function generateMetadata(): Promise<Metadata> {
  if (await estaLogado()) return {};
  const { meta } = TEXTOS[(await preferenciasLanding()).idioma];
  return { title: meta.titulo, description: meta.descricao };
}

/**
 * "/" serve duas telas: a landing para visitantes e a Home para quem está logado.
 * A escolha é feita aqui no servidor, e não com rewrite no proxy: com rewrite o
 * cache de rotas do Next se confundia e Entrar/Cadastrar ficavam carregando.
 */
export default async function Pagina() {
  if (!(await estaLogado())) {
    const { idioma, tema } = await preferenciasLanding();
    return (
      <div className={classeFontesLanding}>
        <TelaApresentacao logado={false} idioma={idioma} tema={tema} />
      </div>
    );
  }
  return <Home />;
}

async function Home() {
  // A RLS de perfis só devolve a linha do próprio usuário, então não precisa de filtro.
  const supabase = await criarClienteServidor();
  // Em paralelo: cada ida ao banco custa uma viagem de rede.
  const [{ data: perfil }, admin] = await Promise.all([
    // "*" e não ("nome, plano"): antes da migration do plano a coluna não existe e a consulta falharia.
    supabase.from("perfis").select("*").maybeSingle(),
    ehAdmin(),
  ]);
  const primeiroNome = perfil?.nome.split(" ")[0];

  return (
    <>
      <CabecalhoHome nome={primeiroNome} />
      <main className="flex flex-col gap-7 px-[17px] pt-6 lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start lg:gap-8 lg:px-0 lg:pt-8">
        <div className="flex flex-col gap-7">
          <ProximoEvento />
          <Secao titulo="MEU SALDO">
            <ResumoPeriodo />
          </Secao>
        </div>
        <div className="flex flex-col gap-7">
          {/* useSearchParams (?aviso=moto) precisa de Suspense em volta. */}
          <Suspense>
            <AvisoMoto />
          </Suspense>
          <Secao titulo="MÓDULOS">
            <nav aria-label="Módulos" className="flex flex-col gap-4">
              <CartaoModulo
                href="/agenda"
                titulo="Agenda"
                descricao="Crie rotinas e agendamentos e mantenha-se atualizado pra não perder a hora."
                icone="/icones/agenda.svg"
                tamanhoIcone={40}
              />
              <CartaoModulo
                href="/metas"
                titulo="Metas"
                descricao="Defina metas através de parâmetros pessoais e alcance-as com sucesso!"
                icone="/icones/metas.svg"
                tamanhoIcone={39}
              />
              <CartaoModulo
                href="/cadastro"
                titulo="Cadastro"
                descricao="Crie cadastro de Comércios e Clientes."
                icone="/icones/cadastro.svg"
                tamanhoIcone={41}
              />
              {perfil?.plano === "pro" && (
                <CartaoModulo
                  href="/moto"
                  titulo="Saúde da moto"
                  descricao="Quilometragem, troca de óleo, pneus, relação e freios no tempo certo."
                  icone="/icones/moto-modulo.svg"
                  tamanhoIcone={38}
                />
              )}
              <p className="text-center text-xs text-cinza-escuro">Mais módulos em breve.</p>
            </nav>
          </Secao>
          {/* Só para o e-mail em ADMIN_EMAIL. No computador o atalho também fica no menu lateral. */}
          {admin && (
            <Secao titulo="ADMINISTRAÇÃO">
              <CartaoModulo
                href="/admin"
                titulo="Painel do sistema"
                descricao="Usuários, cadastros, lançamentos e uso do banco."
                icone="/icones/admin.svg"
                tamanhoIcone={30}
              />
            </Secao>
          )}
        </div>
      </main>
      <Suspense>
        <AvisoPrimeiroUso />
        <AvisoProChegou />
      </Suspense>
    </>
  );
}
