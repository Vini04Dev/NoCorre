"use client";

import Link from "next/link";
import { useState } from "react";
import { ROTULO_TIPO_CLIENTE, useClientes } from "@/hooks/useClientes";
import { AvatarCliente } from "./AvatarCliente";

/** Compara ignorando maiúsculas e acentos ("jose" encontra "José"). */
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function ListaClientes() {
  const { data: clientes, isPending, isError, error } = useClientes();
  const [busca, setBusca] = useState("");

  const filtrados = clientes?.filter((cliente) => normalizar(cliente.nome).includes(normalizar(busca)));

  return (
    <>
      <label className="flex items-center gap-2 rounded-[10px] border border-cinza-claro bg-white px-[14px] py-[11px] text-cinza-escuro focus-within:border-dourado">
        <span aria-hidden className="text-sm font-medium">
          ⌕
        </span>
        <input
          type="search"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
          placeholder="Buscar cliente..."
          aria-label="Buscar cliente"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-marinho outline-none placeholder:text-cinza-escuro"
        />
      </label>

      {isPending && <p className="py-6 text-center text-[13px] text-cinza-escuro">Carregando clientes...</p>}
      {isError && <p className="py-6 text-center text-[13px] text-negativo">{error.message}</p>}

      {clientes?.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-[12px] border border-black/8 bg-white px-6 py-8 text-center shadow-cartao">
          <p className="text-sm font-semibold">Nenhum cliente ainda</p>
          <p className="text-xs text-cinza-escuro">
            Cadastre quem paga pelo seu corre: um app, uma central, um estabelecimento ou uma pessoa.
            Para corridas avulsas, crie um cliente Pessoa Física.
          </p>
          <Link href="/cadastro/clientes/novo" className="mt-2 text-sm font-black text-dourado">
            Cadastrar primeiro cliente
          </Link>
        </div>
      )}

      {clientes && clientes.length > 0 && filtrados?.length === 0 && (
        <p className="py-6 text-center text-[13px] text-cinza-escuro">Nenhum cliente encontrado.</p>
      )}

      {filtrados && filtrados.length > 0 && (
        <ul className="rounded-[12px] border border-black/8 bg-white px-[14px] py-0.5 shadow-cartao">
          {filtrados.map((cliente) => (
            <li key={cliente.id} className="border-b border-black/6 last:border-b-0">
              <Link href={`/cadastro/clientes/${cliente.id}`} className="flex items-center gap-3 py-2.5">
                <AvatarCliente nome={cliente.nome} fotoUrl={cliente.fotoUrl} tamanho={40} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-semibold">{cliente.nome}</span>
                  <span className="truncate text-[11px] text-cinza-escuro">
                    {[ROTULO_TIPO_CLIENTE[cliente.tipo], cliente.telefone].filter(Boolean).join(" · ")}
                  </span>
                </span>
                <span aria-hidden className="text-xl font-medium text-cinza-escuro">
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
