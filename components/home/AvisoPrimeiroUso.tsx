"use client";

import { useState } from "react";
import { PrimeiroCliente } from "@/components/lancamentos/PrimeiroCliente";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { useClientes } from "@/hooks/useClientes";

const CHAVE_DISPENSADO = "nocorre:primeiro-uso-dispensado";

function lerDispensado() {
  try {
    return sessionStorage.getItem(CHAVE_DISPENSADO) === "1";
  } catch {
    return false;
  }
}

/**
 * Abre o painel "Bora começar o corre!" na Home enquanto não houver cliente.
 * "Agora não" esconde até a próxima vez que o app for aberto.
 */
export function AvisoPrimeiroUso() {
  const { data: clientes } = useClientes();
  // Só roda no navegador: no servidor a lista ainda não existe e nada é exibido.
  const [dispensado, setDispensado] = useState(() => typeof window !== "undefined" && lerDispensado());

  if (dispensado || clientes?.length !== 0) return null;

  function dispensar() {
    setDispensado(true);
    try {
      sessionStorage.setItem(CHAVE_DISPENSADO, "1");
    } catch {
      // Navegação privada pode bloquear o storage; o aviso só volta a aparecer.
    }
  }

  return (
    <PainelInferior idTitulo="primeiro-cliente-titulo" aoFechar={dispensar}>
      <PrimeiroCliente aoFechar={dispensar} />
    </PainelInferior>
  );
}
