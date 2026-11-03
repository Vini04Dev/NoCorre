import type { Metadata } from "next";
import { ListaClientes } from "@/components/cadastro/ListaClientes";
import { TopoCadastro } from "@/components/cadastro/TopoCadastro";

export const metadata: Metadata = { title: "Cadastro | No Corre!" };

export default function Pagina() {
  return (
    <main className="flex flex-col gap-3 px-5 pt-[calc(env(safe-area-inset-top)+12px)]">
      <TopoCadastro abaAtiva="/cadastro" novo={{ href: "/cadastro/clientes/novo" }} />
      <ListaClientes />
    </main>
  );
}
