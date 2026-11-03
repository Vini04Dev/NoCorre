"use client";

import Link from "next/link";
import { useClientes } from "@/hooks/useClientes";
import { FormularioCliente } from "./FormularioCliente";

/** Busca o cliente na lista em cache (normalmente já carregada) e abre o formulário. */
export function EditarCliente({ id }: { id: string }) {
  const { data: clientes, isPending } = useClientes();
  const cliente = clientes?.find((item) => item.id === id);

  if (isPending) {
    return <p className="p-6 text-center text-[13px] text-cinza-escuro">Carregando...</p>;
  }
  if (!cliente) {
    return (
      <div className="flex flex-col items-center gap-3 p-6 text-center text-[13px]">
        <p>Cliente não encontrado.</p>
        <Link href="/cadastro" className="font-black text-dourado">
          Voltar para o Cadastro
        </Link>
      </div>
    );
  }

  // key: se a lista recarregar com outro cliente, o formulário recomeça do zero.
  return <FormularioCliente key={cliente.id} cliente={cliente} />;
}
