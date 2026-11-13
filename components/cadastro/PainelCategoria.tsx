"use client";

import { useState } from "react";
import { Alternador } from "@/components/ui/Alternador";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { ConfirmarExclusao } from "@/components/ui/ConfirmarExclusao";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { useExcluirCategoria, useSalvarCategoria, type Categoria } from "@/hooks/useCategorias";
import { CATEGORIAS_PADRAO, ROTULO_TIPO_CATEGORIA, type TipoCategoria } from "@/lib/categorias-padrao";

const OPCOES_TIPO = (Object.keys(ROTULO_TIPO_CATEGORIA) as TipoCategoria[]).map((valor) => ({
  valor,
  rotulo: ROTULO_TIPO_CATEGORIA[valor],
}));

type Props = {
  /** Ausente ao criar. */
  categoria?: Categoria;
  aoFechar: () => void;
};

/** Painel que sobe do rodapé para criar, renomear ou excluir uma categoria. */
export function PainelCategoria({ categoria, aoFechar }: Props) {
  const salvar = useSalvarCategoria();
  const excluir = useExcluirCategoria();
  const [nome, setNome] = useState(categoria?.nome ?? "");
  const [tipo, setTipo] = useState<TipoCategoria>(categoria?.tipo ?? "receita");
  const [doCorre, setDoCorre] = useState(categoria?.do_corre ?? false);
  const [erroNome, setErroNome] = useState<string>();
  const [confirmando, setConfirmando] = useState(false);

  function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) {
      setErroNome("Informe o nome da categoria.");
      return;
    }
    // As padrão não estão no banco, então a constraint unique não pega essa repetição.
    const repeteSugerida = CATEGORIAS_PADRAO[tipo].some(
      (padrao) => padrao.toLowerCase() === nomeLimpo.toLowerCase(),
    );
    if (repeteSugerida) {
      setErroNome("Essa categoria já existe entre as padrão.");
      return;
    }
    salvar.mutate({ id: categoria?.id, nome: nomeLimpo, tipo, do_corre: tipo === "despesa" && doCorre }, { onSuccess: aoFechar });
  }

  return (
    <>
      <PainelInferior idTitulo="painel-categoria-titulo" aoFechar={aoFechar} aoEnviar={enviar}>
        <div className="flex items-center justify-between">
          <h2 id="painel-categoria-titulo" className="text-lg font-extrabold">
            {categoria ? "Editar categoria" : "Nova categoria"}
          </h2>
          {categoria && (
            <button type="button" onClick={() => setConfirmando(true)} className="text-xs font-semibold text-negativo">
              Excluir
            </button>
          )}
        </div>
        <AvisoErro mensagem={salvar.error?.message ?? excluir.error?.message} />
        <CampoTexto
          rotulo="Nome"
          value={nome}
          onChange={(evento) => {
            setNome(evento.target.value);
            setErroNome(undefined);
          }}
          maxLength={50}
          placeholder="Ex.: Frete"
          erro={erroNome}
          autoFocus
        />
        <Alternador rotulo="Usar em" opcoes={OPCOES_TIPO} valor={tipo} aoMudar={setTipo} />
        {tipo === "despesa" && (
          <label className="flex items-start gap-2.5 text-xs">
            <input
              type="checkbox"
              checked={doCorre}
              onChange={(e) => setDoCorre(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-marinho"
            />
            <span>
              <span className="font-semibold">Gasto do corre</span>
              <span className="block text-[11px] text-cinza-escuro">
                Marque se é custo do trabalho (ex.: lavagem da moto). Desmarcado, conta como gasto pessoal.
              </span>
            </span>
          </label>
        )}
        <div className="mt-1 grid grid-cols-2 gap-2.5">
          <Botao variante="contorno" onClick={aoFechar}>
            Cancelar
          </Botao>
          <Botao type="submit" disabled={salvar.isPending}>
            {salvar.isPending ? "Salvando..." : "Salvar"}
          </Botao>
        </div>
      </PainelInferior>

      {confirmando && categoria && (
        <ConfirmarExclusao
          titulo="Excluir esta categoria?"
          mensagem={`"${categoria.nome}" deixa de aparecer nas opções. Lançamentos antigos continuam com esse nome.`}
          excluindo={excluir.isPending}
          aoCancelar={() => setConfirmando(false)}
          aoConfirmar={() =>
            excluir.mutate(categoria.id, { onSuccess: aoFechar, onSettled: () => setConfirmando(false) })
          }
        />
      )}
    </>
  );
}
