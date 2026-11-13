"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CampoCarteira, campoCarteira } from "@/components/carteiras/CampoCarteira";
import { useCarteiraEmFoco } from "@/hooks/useCarteiraEmFoco";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { CampoMoeda } from "@/components/ui/CampoMoeda";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { ConfirmarExclusao } from "@/components/ui/ConfirmarExclusao";
import { SeletorChips } from "@/components/ui/SeletorChips";
import { useExcluirEntrada, useSalvarEntrada } from "@/hooks/useEntradas";
import type { Entrada } from "@/hooks/useMovimentacoes";
import { camposParaDataHora, dataHoraParaCampos } from "@/lib/data";

/** Origens mais comuns de dinheiro fora do corre (perfil dos entregadores: muitos têm outra renda). */
export const TIPOS_ENTRADA = ["Salário", "Bolsa", "Benefício", "Ajuda da família", "Venda", "Outro"];

type Erros = { descricao?: string; valor?: string; data?: string };

/**
 * Entrada que não é do corre: bolsa, salário, benefício, ajuda, venda de algo.
 * Vai para a carteira, mas não conta como receita do trabalho nem como entrega,
 * e fica fora do saldo do corre do Início.
 */
export function FormularioEntrada({ entrada }: { entrada?: Entrada }) {
  const router = useRouter();
  const salvar = useSalvarEntrada();
  const excluir = useExcluirEntrada();
  const inicio = dataHoraParaCampos(entrada ? new Date(entrada.data_hora) : new Date());
  const [tipo, setTipo] = useState(entrada?.tipo ?? TIPOS_ENTRADA[0]);
  const [descricao, setDescricao] = useState(entrada?.descricao ?? "");
  const [centavos, setCentavos] = useState(Math.round((entrada?.valor ?? 0) * 100));
  const [data, setData] = useState(inicio.data);
  // undefined = ninguém mexeu (não manda a coluna); null = carteira principal.
  const [carteiraId, setCarteiraId] = useState<string | null | undefined>(entrada ? entrada.carteira_id : undefined);
  // Lançamento novo sem escolha: a carteira em foco no Início (à vista no campo Carteira).
  const { carteira: emFoco } = useCarteiraEmFoco();
  const carteiraEfetiva = carteiraId !== undefined ? carteiraId : emFoco?.id;
  const [erros, setErros] = useState<Erros>({});
  const [confirmando, setConfirmando] = useState(false);
  const destino = entrada ? "/resumo" : "/";

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const novos: Erros = {};
    if (centavos <= 0) novos.valor = "Informe o valor que entrou.";
    if (!data) novos.data = "Informe a data.";
    setErros(novos);
    if (Object.keys(novos).length) return;
    salvar.mutate(
      {
        id: entrada?.id,
        dados: {
          tipo,
          descricao: descricao.trim() || tipo,
          valor: centavos / 100,
          data_hora: camposParaDataHora(data, inicio.hora),
          ...campoCarteira(carteiraEfetiva),
        },
      },
      { onSuccess: () => router.push(destino) },
    );
  }

  if (confirmando && entrada) {
    return (
      <ConfirmarExclusao
        titulo="Excluir esta entrada?"
        mensagem={`"${entrada.descricao}" sai do extrato e do saldo da carteira.`}
        excluindo={excluir.isPending}
        aoCancelar={() => setConfirmando(false)}
        aoConfirmar={() => excluir.mutate(entrada.id, { onSuccess: () => router.push("/resumo") })}
      />
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="flex min-h-dvh flex-col">
      <div className="flex flex-col gap-3 px-5 pt-[calc(env(safe-area-inset-top)+12px)]">
        <CabecalhoTela titulo={entrada ? "Editar entrada" : "Outra entrada"} voltarPara={destino} />
        <p className="-mt-1 text-xs text-cinza-escuro">
          Dinheiro que não vem do corre, como salário, bolsa ou ajuda. Entra na carteira, mas fica fora do saldo do corre e
          das entregas.
        </p>
        <AvisoErro mensagem={salvar.error?.message ?? excluir.error?.message} />
        <SeletorChips
          rotulo="De onde veio"
          opcoes={TIPOS_ENTRADA.map((valor) => ({ valor, rotulo: valor }))}
          valor={tipo}
          aoMudar={(valor) => valor && setTipo(valor)}
        />
        <CampoTexto
          rotulo="Descrição"
          opcional
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          maxLength={60}
          placeholder={tipo === "Bolsa" ? "Ex.: Bolsa de iniciação científica" : `Ex.: ${tipo}`}
        />
        <div className="grid grid-cols-2 gap-3">
          <CampoMoeda rotulo="Valor" centavos={centavos} aoMudar={setCentavos} erro={erros.valor} />
          <CampoTexto rotulo="Data" type="date" value={data} onChange={(e) => setData(e.target.value)} erro={erros.data} />
        </div>
        <CampoCarteira valor={carteiraEfetiva ?? null} aoMudar={setCarteiraId} />
      </div>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-2 bg-fundo px-5 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+26px)]">
        <Botao type="submit" disabled={salvar.isPending}>
          {salvar.isPending ? "Salvando..." : entrada ? "Salvar alterações" : "Salvar entrada"}
        </Botao>
        {entrada && (
          <Botao variante="perigo" onClick={() => setConfirmando(true)}>
            Excluir
          </Botao>
        )}
      </div>
    </form>
  );
}
