"use client";

import Link from "next/link";
import { FormularioDespesa } from "@/components/lancamentos/FormularioDespesa";
import { FormularioReceita } from "@/components/lancamentos/FormularioReceita";
import { useDespesa, useReceita } from "@/hooks/useMovimentacoes";

type Props = { tipo: "receita" | "despesa"; id: string };

/** Carrega o lançamento e abre o mesmo formulário do cadastro, já preenchido. */
export function EditarLancamento({ tipo, id }: Props) {
  const receita = useReceita(tipo === "receita" ? id : "");
  const despesa = useDespesa(tipo === "despesa" ? id : "");
  const consulta = tipo === "receita" ? receita : despesa;

  if (consulta.isPending) {
    return <p className="p-6 text-center text-[13px] text-cinza-escuro">Carregando...</p>;
  }
  if (receita.data) return <FormularioReceita key={receita.data.id} receita={receita.data} />;
  if (despesa.data) return <FormularioDespesa key={despesa.data.id} despesa={despesa.data} />;

  return (
    <div className="flex flex-col items-center gap-3 p-6 text-center text-[13px]">
      <p>{consulta.error?.message ?? "Lançamento não encontrado."}</p>
      <Link href="/resumo" className="font-black text-dourado">
        Voltar para o Resumo
      </Link>
    </div>
  );
}
