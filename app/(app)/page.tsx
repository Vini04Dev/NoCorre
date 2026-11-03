import { AvisoPrimeiroUso } from "@/components/home/AvisoPrimeiroUso";
import { CabecalhoHome } from "@/components/home/CabecalhoHome";
import { CartaoModulo } from "@/components/home/CartaoModulo";
import { ResumoPeriodo } from "@/components/home/ResumoPeriodo";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export default async function Home() {
  // A RLS de perfis só devolve a linha do próprio usuário, então não precisa de filtro.
  const supabase = await criarClienteServidor();
  const { data: perfil } = await supabase.from("perfis").select("nome").maybeSingle();
  const primeiroNome = perfil?.nome.split(" ")[0];

  return (
    <>
      <CabecalhoHome nome={primeiroNome} />
      <main className="flex flex-col gap-[9px] px-[17px] pt-7">
        <ResumoPeriodo />
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
        </nav>
      </main>
      <AvisoPrimeiroUso />
    </>
  );
}
