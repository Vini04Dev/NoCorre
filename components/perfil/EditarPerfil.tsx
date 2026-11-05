"use client";

import { FormularioPerfil } from "./FormularioPerfil";
import { FormularioVeiculo } from "./FormularioVeiculo";
import { usePerfil } from "@/hooks/usePerfil";

/** Carrega o perfil e abre o formulário da parte pedida: dados pessoais ou veículo. */
export function EditarPerfil({ parte = "dados" }: { parte?: "dados" | "veiculo" }) {
  const { data: perfil, isPending, error } = usePerfil();
  if (isPending) return <p className="p-6 text-center text-[13px] text-cinza-escuro">Carregando...</p>;
  if (!perfil) return <p className="p-6 text-center text-[13px] text-negativo">{error?.message ?? "Perfil não encontrado."}</p>;
  const Formulario = parte === "veiculo" ? FormularioVeiculo : FormularioPerfil;
  return <Formulario key={perfil.id} perfil={perfil} />;
}
