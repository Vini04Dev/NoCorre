"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PrimeiroCliente } from "./PrimeiroCliente";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { useClientes } from "@/hooks/useClientes";

const CLASSE_OPCAO =
  "flex w-full items-center gap-3.5 rounded-[12px] border border-cinza-claro bg-white py-3.5 pr-4 pl-3.5 text-left";

function ConteudoOpcao({ icone, fundo, titulo, descricao }: { icone: string; fundo: string; titulo: string; descricao: string }) {
  return (
    <>
      <span className={`grid size-[52px] shrink-0 place-items-center rounded-full ${fundo}`}>
        <Image src={icone} alt="" width={26} height={26} />
      </span>
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="text-base font-extrabold">{titulo}</span>
        <span className="text-xs text-[#6b7080]">{descricao}</span>
      </span>
      <span aria-hidden className="text-[22px] font-medium text-cinza-escuro">
        ›
      </span>
    </>
  );
}

/** Painel do botão (+): escolhe entre lançar Receita ou Despesa. */
export function PainelLancamento({ aoFechar }: { aoFechar: () => void }) {
  const router = useRouter();
  const { data: clientes } = useClientes();
  const [semCliente, setSemCliente] = useState(false);

  function escolherReceita() {
    if (clientes?.length === 0) {
      setSemCliente(true);
      return;
    }
    aoFechar();
    router.push("/novo/receita");
  }

  if (semCliente) {
    return (
      <PainelInferior idTitulo="primeiro-cliente-titulo" aoFechar={aoFechar}>
        <PrimeiroCliente aoFechar={aoFechar} />
      </PainelInferior>
    );
  }

  return (
    <PainelInferior idTitulo="painel-lancamento-titulo" aoFechar={aoFechar}>
      <div className="flex flex-col gap-0.5">
        <h2 id="painel-lancamento-titulo" className="text-lg font-extrabold">
          O que você quer lançar?
        </h2>
        <p className="text-xs text-cinza-escuro">Escolha o tipo de registro</p>
      </div>
      <button type="button" onClick={escolherReceita} className={CLASSE_OPCAO}>
        <ConteudoOpcao
          icone="/icones/seta-receita.svg"
          fundo="bg-positivo/12"
          titulo="Receita"
          descricao="Entrega, corrida, diária, gorjeta"
        />
      </button>
      <Link href="/novo/despesa" onClick={aoFechar} className={CLASSE_OPCAO}>
        <ConteudoOpcao
          icone="/icones/seta-despesa.svg"
          fundo="bg-negativo/12"
          titulo="Despesa"
          descricao="Combustível, peças, alimentação, taxa da central"
        />
      </Link>
      <p className="text-center text-[11px] text-cinza-escuro">
        Para cadastrar clientes e categorias, use o módulo Cadastro na tela inicial.
      </p>
      <button
        type="button"
        onClick={aoFechar}
        className="w-full rounded-[10px] border border-cinza-claro py-[13px] text-[15px] font-semibold"
      >
        Cancelar
      </button>
    </PainelInferior>
  );
}
