"use client";

import { useState } from "react";
import { CampoCarteira } from "@/components/carteiras/CampoCarteira";
import { CampoCategoria } from "@/components/lancamentos/CampoCategoria";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CampoMoeda } from "@/components/ui/CampoMoeda";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { ConfirmarExclusao } from "@/components/ui/ConfirmarExclusao";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { useExcluirContaFixa, useSalvarContaFixa, type ContaFixa } from "@/hooks/useContasFixas";
import { CATEGORIA_CONTAS } from "@/lib/categorias-padrao";

/** Sugestões do dia a dia de quem roda, já com valor em branco para a pessoa completar. */
const SUGESTOES = ["Plano de celular", "Internet", "Aluguel", "Parcela da moto", "Seguro da moto", "Streaming"];

type Erros = { descricao?: string; valor?: string; dia?: string };

/** Nova conta fixa ou edição. Excluir não apaga as despesas já pagas. */
export function PainelContaFixa({ conta, aoFechar }: { conta?: ContaFixa; aoFechar: () => void }) {
  const salvar = useSalvarContaFixa();
  const excluir = useExcluirContaFixa();
  const [descricao, setDescricao] = useState(conta?.descricao ?? "");
  const [categoria, setCategoria] = useState(conta?.tipo ?? CATEGORIA_CONTAS);
  const [centavos, setCentavos] = useState(Math.round((conta?.valor ?? 0) * 100));
  const [dia, setDia] = useState(conta ? String(conta.dia_vencimento) : "");
  const [carteiraId, setCarteiraId] = useState<string | null>(conta?.carteira_id ?? null);
  const [automatico, setAutomatico] = useState(conta?.automatico ?? false);
  const [ativa, setAtiva] = useState(conta?.ativa ?? true);
  const [erros, setErros] = useState<Erros>({});
  const [confirmando, setConfirmando] = useState(false);

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const numeroDia = Number(dia);
    const novos: Erros = {};
    if (!descricao.trim()) novos.descricao = "Diga que conta é essa.";
    if (centavos <= 0) novos.valor = "Informe o valor da conta.";
    if (!Number.isInteger(numeroDia) || numeroDia < 1 || numeroDia > 31) novos.dia = "Use um dia de 1 a 31.";
    setErros(novos);
    if (Object.keys(novos).length) return;
    salvar.mutate(
      {
        id: conta?.id,
        dados: {
          descricao: descricao.trim(),
          tipo: categoria.trim() || CATEGORIA_CONTAS,
          valor: centavos / 100,
          dia_vencimento: numeroDia,
          carteira_id: carteiraId,
          automatico,
          ativa,
        },
      },
      { onSuccess: aoFechar },
    );
  }

  if (confirmando && conta) {
    return (
      <ConfirmarExclusao
        titulo="Excluir conta fixa?"
        mensagem={`"${conta.descricao}" para de avisar no Início. As despesas já lançadas continuam no Resumo.`}
        excluindo={excluir.isPending}
        aoCancelar={() => setConfirmando(false)}
        aoConfirmar={() => excluir.mutate(conta.id, { onSuccess: aoFechar })}
      />
    );
  }

  return (
    <PainelInferior idTitulo="conta-fixa-titulo" aoFechar={aoFechar} aoEnviar={enviar}>
      <h2 id="conta-fixa-titulo" className="text-lg font-extrabold">
        {conta ? "Editar conta fixa" : "Nova conta fixa"}
      </h2>
      <AvisoErro mensagem={salvar.error?.message ?? excluir.error?.message} />
      <CampoTexto
        rotulo="Conta"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        maxLength={60}
        placeholder="Ex.: Plano de celular"
        erro={erros.descricao}
      />
      {!conta && (
        <div className="-mt-1 flex flex-wrap gap-1.5">
          {SUGESTOES.map((sugestao) => (
            <button
              key={sugestao}
              type="button"
              onClick={() => setDescricao(sugestao)}
              className="rounded-full border border-cinza-claro bg-white px-3 py-1 text-[11px] font-medium"
            >
              {sugestao}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-[1fr_96px] gap-3">
        <CampoMoeda rotulo="Valor por mês" centavos={centavos} aoMudar={setCentavos} erro={erros.valor} />
        <CampoTexto
          rotulo="Vence dia"
          inputMode="numeric"
          value={dia}
          onChange={(e) => setDia(e.target.value.replace(/\D/g, "").slice(0, 2))}
          placeholder="20"
          erro={erros.dia}
        />
      </div>
      <CampoCategoria tipo="despesa" valor={categoria} aoMudar={setCategoria} />
      <CampoCarteira valor={carteiraId} aoMudar={setCarteiraId} />
      <label className="flex items-start gap-2.5 text-xs">
        <input
          type="checkbox"
          checked={automatico}
          onChange={(e) => setAutomatico(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-marinho"
        />
        <span>
          <span className="font-semibold">Débito automático</span>
          <span className="block text-[11px] text-cinza-escuro">
            O banco ou o cartão paga sozinho. No dia, o Início pergunta se caiu e lança com um toque.
          </span>
        </span>
      </label>
      {conta && (
        <label className="flex items-start gap-2.5 text-xs">
          <input
            type="checkbox"
            checked={!ativa}
            onChange={(e) => setAtiva(!e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-marinho"
          />
          <span>
            <span className="font-semibold">Pausar avisos</span>
            <span className="block text-[11px] text-cinza-escuro">Para contas canceladas ou suspensas por um tempo.</span>
          </span>
        </label>
      )}
      <Botao type="submit" disabled={salvar.isPending}>
        {salvar.isPending ? "Salvando..." : conta ? "Salvar alterações" : "Salvar conta fixa"}
      </Botao>
      {conta && (
        <Botao variante="perigo" onClick={() => setConfirmando(true)}>
          Excluir
        </Botao>
      )}
    </PainelInferior>
  );
}
