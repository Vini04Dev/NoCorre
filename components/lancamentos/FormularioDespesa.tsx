"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CampoCategoria } from "./CampoCategoria";
import { CamposValor, validarValores, valoresIniciais, type Valores } from "./CamposValor";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { useSalvarDespesa } from "@/hooks/useLancamentos";
import type { Despesa } from "@/hooks/useMovimentacoes";
import { CATEGORIAS_PADRAO } from "@/lib/categorias-padrao";
import { camposParaDataHora } from "@/lib/data";

type Erros = { categoria?: string; quantidade?: string; valor?: string };

/** Lança uma despesa nova ou, recebendo `despesa`, edita a existente. */
export function FormularioDespesa({ despesa }: { despesa?: Despesa }) {
  const router = useRouter();
  const salvar = useSalvarDespesa();
  const destino = despesa ? `/resumo/despesa/${despesa.id}` : "/";

  const [descricao, setDescricao] = useState(despesa?.observacao ?? "");
  const [categoria, setCategoria] = useState(despesa?.tipo ?? CATEGORIAS_PADRAO.despesa[0]);
  const [valores, setValores] = useState<Valores>(() => valoresIniciais(despesa));
  const [erros, setErros] = useState<Erros>({});

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const novosErros: Erros = { ...validarValores(valores) };
    if (!categoria.trim()) novosErros.categoria = "Escolha ou digite a categoria.";
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    salvar.mutate(
      {
        id: despesa?.id,
        dados: {
          tipo: categoria.trim(),
          observacao: descricao.trim() || null,
          data_hora: camposParaDataHora(valores.data, valores.hora),
          quantidade: Number(valores.quantidade),
          valor_unitario: valores.centavos / 100,
        },
      },
      { onSuccess: () => router.push(destino) },
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="flex min-h-dvh flex-col">
      <div className="flex flex-col gap-3 px-5 pt-[calc(env(safe-area-inset-top)+12px)]">
        <CabecalhoTela titulo={despesa ? "Editar despesa" : "Nova despesa"} voltarPara={destino} />
        <AvisoErro mensagem={salvar.error?.message} />
        <CampoTexto
          rotulo="Descrição"
          opcional
          value={descricao}
          onChange={(evento) => setDescricao(evento.target.value)}
          placeholder="Ex.: Gasolina"
        />
        <CampoCategoria tipo="despesa" valor={categoria} aoMudar={setCategoria} erro={erros.categoria} />
        <CamposValor valores={valores} aoMudar={setValores} corTotal="text-negativo" erros={erros} />
      </div>

      <div className="sticky bottom-0 mt-auto bg-fundo px-5 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+26px)]">
        <Botao type="submit" disabled={salvar.isPending}>
          {salvar.isPending ? "Salvando..." : despesa ? "Salvar alterações" : "Salvar despesa"}
        </Botao>
      </div>
    </form>
  );
}
