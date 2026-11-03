"use client";

import { FormularioPerfil } from "./FormularioPerfil";
import { usePerfil } from "@/hooks/usePerfil";

export function EditarPerfil() {
  const { data: perfil, isPending, error } = usePerfil();
  if (isPending) return <p className="p-6 text-center text-[13px] text-cinza-escuro">Carregando...</p>;
  if (!perfil) return <p className="p-6 text-center text-[13px] text-negativo">{error?.message ?? "Perfil não encontrado."}</p>;
  return <FormularioPerfil key={perfil.id} perfil={perfil} />;
}
