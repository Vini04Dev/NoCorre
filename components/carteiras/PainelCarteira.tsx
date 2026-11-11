"use client";

import { useState } from "react";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CampoMoeda } from "@/components/ui/CampoMoeda";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { useExcluirCarteira, useSalvarCarteira, type Carteira } from "@/hooks/useCarteiras";
import { CORES_EVENTO, type CorEvento } from "@/lib/cores";

/** Sugestões de nome para a primeira carteira, do jeito que o entregador fala. */
const SUGESTOES = ["Dinheiro em mão", "Nubank", "Caixa", "Conta do salário"];

/**
 * Nova carteira ou edição. Excluir só funciona sem lançamentos; com lançamentos,
 * arquivar tira a carteira das escolhas e mantém o histórico.
 */
export function PainelCarteira({
  carteira,
  primeira = false,
  aoFechar,
}: {
  carteira?: Carteira;
  /** Sem nenhuma carteira ainda: a nova já nasce como principal. */
  primeira?: boolean;
  aoFechar: () => void;
}) {
  const salvar = useSalvarCarteira();
  const excluir = useExcluirCarteira();
  const [nome, setNome] = useState(carteira?.nome ?? "");
  const [centavos, setCentavos] = useState(Math.round((carteira?.saldo_inicial ?? 0) * 100));
  const [cor, setCor] = useState<CorEvento>(carteira?.cor ?? "azul");
  const [padrao, setPadrao] = useState(carteira?.padrao ?? primeira);
  const [erroNome, setErroNome] = useState<string>();

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!nome.trim()) return setErroNome("Dê um nome para a carteira.");
    setErroNome(undefined);
    salvar.mutate(
      { id: carteira?.id, dados: { nome: nome.trim(), saldo_inicial: centavos / 100, cor, padrao } },
      { onSuccess: aoFechar },
    );
  }

  function arquivar() {
    if (!carteira) return;
    salvar.mutate(
      { id: carteira.id, dados: { nome: carteira.nome, arquivada: !carteira.arquivada, padrao: false } },
      { onSuccess: aoFechar },
    );
  }

  return (
    <PainelInferior idTitulo="carteira-titulo" aoFechar={aoFechar} aoEnviar={enviar}>
      <h2 id="carteira-titulo" className="text-lg font-extrabold">
        {carteira ? "Editar carteira" : "Nova carteira"}
      </h2>
      <AvisoErro mensagem={salvar.error?.message ?? excluir.error?.message} />
      <CampoTexto
        rotulo="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        maxLength={40}
        placeholder="Ex.: Dinheiro em mão"
        erro={erroNome}
      />
      {!carteira && (
        <div className="-mt-1 flex flex-wrap gap-1.5">
          {SUGESTOES.map((sugestao) => (
            <button
              key={sugestao}
              type="button"
              onClick={() => setNome(sugestao)}
              className="rounded-full border border-cinza-claro bg-white px-3 py-1 text-[11px] font-medium"
            >
              {sugestao}
            </button>
          ))}
        </div>
      )}
      <CampoMoeda rotulo="Saldo de quando começou a usar" centavos={centavos} aoMudar={setCentavos} />
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-xs font-semibold">Cor</legend>
        <div className="flex gap-3">
          {CORES_EVENTO.map((opcao) => (
            <button
              key={opcao.valor}
              type="button"
              onClick={() => setCor(opcao.valor)}
              aria-label={opcao.rotulo}
              aria-pressed={opcao.valor === cor}
              className={`size-8 rounded-full ${opcao.valor === cor ? "ring-2 ring-marinho ring-offset-2" : ""}`}
              style={{ background: opcao.forte }}
            />
          ))}
        </div>
      </fieldset>
      <label className="flex items-center gap-2.5 text-xs">
        <input
          type="checkbox"
          checked={padrao}
          onChange={(e) => setPadrao(e.target.checked)}
          className="size-4 accent-marinho"
        />
        Carteira principal (recebe os lançamentos sem carteira escolhida)
      </label>
      <Botao type="submit" disabled={salvar.isPending}>
        {salvar.isPending ? "Salvando..." : "Salvar carteira"}
      </Botao>
      {carteira && (
        <div className="grid grid-cols-2 gap-2">
          <Botao type="button" variante="contorno" onClick={arquivar} disabled={salvar.isPending}>
            {carteira.arquivada ? "Desarquivar" : "Arquivar"}
          </Botao>
          <Botao
            type="button"
            variante="perigo"
            disabled={excluir.isPending}
            onClick={() => excluir.mutate(carteira.id, { onSuccess: aoFechar })}
          >
            Excluir
          </Botao>
        </div>
      )}
    </PainelInferior>
  );
}
