import { CabecalhoHome } from "@/components/home/CabecalhoHome";
import { CartaoModulo } from "@/components/home/CartaoModulo";
import { ResumoPeriodo } from "@/components/home/ResumoPeriodo";

export default function Home() {
  return (
    <>
      <CabecalhoHome />
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
    </>
  );
}
