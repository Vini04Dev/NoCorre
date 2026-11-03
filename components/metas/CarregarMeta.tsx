"use client";

import Link from "next/link";
import { FormularioMeta } from "./FormularioMeta";
import { useMeta } from "@/hooks/useMetas";

type Props = { modo: "editar" | "repetir"; id: string };

/** Carrega a meta e abre o formulário já preenchido, para editar ou repetir. */
export function CarregarMeta({ modo, id }: Props) {
  const { data: meta, isPending, error } = useMeta(id);

  if (isPending) return <p className="p-6 text-center text-[13px] text-cinza-escuro">Carregando...</p>;
  if (!meta) {
    return (
      <div className="flex flex-col items-center gap-3 p-6 text-center text-[13px]">
        <p>{error?.message ?? "Meta não encontrada."}</p>
        <Link href="/metas" className="font-black text-dourado">
          Voltar para Metas
        </Link>
      </div>
    );
  }
  return modo === "editar" ? <FormularioMeta key={meta.id} meta={meta} /> : <FormularioMeta key={meta.id} repetir={meta} />;
}

