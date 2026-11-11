"use client";

import { useState } from "react";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CampoMoeda } from "@/components/ui/CampoMoeda";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { SeletorChips } from "@/components/ui/SeletorChips";
import { useExcluirCarteira, useSalvarCarteira, type Carteira } from "@/hooks/useCarteiras";
import { TIPOS_CARTEIRA } from "@/lib/carteiras";
import { CORES_EVENTO, type CorEvento } from "@/lib/cores";

/** Sugestões de nome, do jeito que o entregador fala, já com o tipo que combina. */
const SUGESTOES: { nome: string; tipo: string }[] = [
  { nome: "Dinheiro em mão", tipo: "Dinheiro" },
  { nome: "Nubank", tipo: "Conta corrente" },
  { nome: "Caixa", tipo: "Poupança" },
  { nome: "Conta do salário", tipo: "Conta salário" },
];

/**
 * Nova carteira ou edição. "Quanto tem nela hoje" acerta o saldo sem mexer nos
 * lançamentos. Excluir só funciona sem lançamentos; com lançamentos, arquivar
 * tira a carteira das escolhas e mantém o histórico.
 */
export function PainelCarteira({
  carteira,
  saldo = 0,
  primeira = false,
  aoFechar,
}: {
  carteira?: Carteira;
  /** Saldo calculado hoje (edição). */
  saldo?: number;
  /** Sem nenhuma carteira ainda: a nova já nasce como principal. */
  primeira?: boolean;
  aoFechar: () => void;
}) {
  const salvar = useSalvarCarteira();
  const excluir = useExcluirCarteira();
  const [nome, setNome] = useState(carteira?.nome ?? "");
  const [tipo, setTipo] = useState<string | null>(carteira?.tipo ?? null);
  // Campo só aceita valor positivo; saldo negativo aparece zerado até a pessoa mexer.
  const [centavos, setCentavos] = useState(Math.max(0, Math.round(saldo * 100)));
  const [mexeuSaldo, setMexeuSaldo] = useState(false);
  const [cor, setCor] = useState<CorEvento>(carteira?.cor ?? "azul");
  const [padrao, setPadrao] = useState(carteira?.padrao ?? primeira);
  const [erroNome, setErroNome] = useState<string>();

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!nome.trim()) return setErroNome("Dê um nome para a carteira.");
    setErroNome(undefined);
    salvar.mutate(
      {
        id: carteira?.id,
        dados: { nome: nome.trim(), tipo, cor, padrao },
        // Na edição, só acerta o saldo se a pessoa mudou o valor.
        saldoAtual: !carteira || mexeuSaldo ? centavos / 100 : undefined,
      },
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
              key={sugestao.nome}
              type="button"
              onClick={() => {
                setNome(sugestao.nome);
                setTipo(sugestao.tipo);
              }}
              className="rounded-full border border-cinza-claro bg-white px-3 py-1 text-[11px] font-medium"
            >
              {sugestao.nome}
            </button>
          ))}
        </div>
      )}
      <SeletorChips
        rotulo="Tipo"
        opcional
        desmarcavel
        opcoes={TIPOS_CARTEIRA.map((t) => ({ valor: t.valor, rotulo: t.valor }))}
        valor={tipo}
        aoMudar={setTipo}
      />
      <div className="flex flex-col gap-1">
        <CampoMoeda
          rotulo="Quanto tem nela hoje"
          centavos={centavos}
          aoMudar={(valor) => {
            setCentavos(valor);
            setMexeuSaldo(true);
          }}
        />
        <p className="text-[11px] text-cinza-escuro">
          O saldo passa a ser esse valor. Seus lançamentos não mudam; dali em diante, cada receita, despesa e
          transferência atualiza o saldo.
        </p>
      </div>
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
      <label className="flex items-start gap-2.5 text-xs">
        <input
          type="checkbox"
          checked={padrao}
          onChange={(e) => setPadrao(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-marinho"
        />
        <span>
          <strong className="font-semibold">Carteira principal</strong>
          <span className="block text-[11px] text-cinza-escuro">
            Os lançamentos em que você não escolhe carteira entram nela.
          </span>
        </span>
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
