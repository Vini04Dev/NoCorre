"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CampoCategoria } from "./CampoCategoria";
import { CamposValor, validarValores, type Valores } from "./CamposValor";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { useNovaDespesa } from "@/hooks/useLancamentos";
import { CATEGORIAS_PADRAO } from "@/lib/categorias-padrao";
import { camposParaDataHora, dataHoraParaCampos } from "@/lib/data";

type Erros = { categoria?: string; quantidade?: string; valor?: string };

export function FormularioDespesa() {
  const router = useRouter();
  const salvar = useNovaDespesa();

  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS_PADRAO.despesa[0]);
  const [valores, setValores] = useState<Valores>(() => ({
    ...dataHoraParaCampos(new Date()),
    quantidade: "1",
    centavos: 0,
  }));
  const [erros, setErros] = useState<Erros>({});

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const novosErros: Erros = { ...validarValores(valores) };
    if (!categoria.trim()) novosErros.categoria = "Escolha ou digite a categoria.";
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    salvar.mutate(
      {
        tipo: categoria.trim(),
        observacao: descricao.trim() || null,
        data_hora: camposParaDataHora(valores.data, valores.hora),
        quantidade: Number(valores.quantidade),
        valor_unitario: valores.centavos / 100,
      },
      { onSuccess: () => router.push("/") },
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="flex min-h-dvh flex-col">
      <div className="flex flex-col gap-3 px-5 pt-[calc(env(safe-area-inset-top)+12px)]">
        <CabecalhoTela titulo="Nova despesa" voltarPara="/" />
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
          {salvar.isPending ? "Salvando..." : "Salvar despesa"}
        </Botao>
      </div>
    </form>
  );
}
