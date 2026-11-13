"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { CampoCarteira, campoCarteira } from "@/components/carteiras/CampoCarteira";
import { CampoCategoria } from "./CampoCategoria";
import { CamposValor, validarValores, valoresIniciais, type Valores } from "./CamposValor";
import { PrimeiroCliente } from "./PrimeiroCliente";
import { Alternador } from "@/components/ui/Alternador";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { SeletorChips } from "@/components/ui/SeletorChips";
import { useCategoriaPorCliente } from "@/hooks/useCategoriaPorCliente";
import { useClientes } from "@/hooks/useClientes";
import { useSalvarReceita } from "@/hooks/useLancamentos";
import type { Receita } from "@/hooks/useMovimentacoes";
import { CATEGORIAS_PADRAO } from "@/lib/categorias-padrao";
import { camposParaDataHora } from "@/lib/data";
import type { Enums } from "@/types/database";

type FormaPagamento = Enums<"forma_pagamento">;
type StatusPagamento = Enums<"status_pagamento">;

const FORMAS: { valor: FormaPagamento; rotulo: string }[] = [
  { valor: "pix", rotulo: "Pix" },
  { valor: "dinheiro", rotulo: "Dinheiro" },
];

const SITUACOES: { valor: StatusPagamento; rotulo: string; cor: string }[] = [
  { valor: "pago", rotulo: "Pago", cor: "text-recebido" },
  { valor: "pendente", rotulo: "Pendente", cor: "text-pendente" },
];

type Erros = { cliente?: string; categoria?: string; quantidade?: string; valor?: string };

/** Lança uma receita nova ou, recebendo `receita`, edita a existente. */
export function FormularioReceita({ receita }: { receita?: Receita }) {
  const router = useRouter();
  const idCliente = useId();
  const { data: clientes, isPending: carregandoClientes } = useClientes();
  const salvar = useSalvarReceita();
  const destino = receita ? `/resumo/receita/${receita.id}` : "/";

  // Com um cliente só, ele já vem escolhido.
  const [clienteEscolhido, setClienteEscolhido] = useState(receita?.cliente_id);
  const clienteId = clienteEscolhido ?? (clientes?.length === 1 ? clientes[0].id : "");
  // Sem escolha da pessoa, vale a categoria de costume do cliente (última receita dele).
  const { data: categoriaDoCliente } = useCategoriaPorCliente();
  const [categoriaEscolhida, setCategoria] = useState<string | null>(receita?.tipo ?? null);
  const categoria = categoriaEscolhida ?? categoriaDoCliente?.get(clienteId) ?? CATEGORIAS_PADRAO.receita[0];
  const [valores, setValores] = useState<Valores>(() => valoresIniciais(receita));
  const [forma, setForma] = useState<FormaPagamento | null>(receita?.forma_pagamento ?? null);
  const [situacao, setSituacao] = useState<StatusPagamento>(receita?.status_pagamento ?? "pago");
  const [observacao, setObservacao] = useState(receita?.observacao ?? "");
  // undefined = ninguém mexeu (não manda a coluna); null = carteira principal.
  const [carteiraId, setCarteiraId] = useState<string | null | undefined>(receita?.carteira_id);
  const [erros, setErros] = useState<Erros>({});

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const novosErros: Erros = { ...validarValores(valores) };
    if (!clienteId) novosErros.cliente = "Escolha o cliente.";
    if (!categoria.trim()) novosErros.categoria = "Escolha ou digite a categoria.";
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    salvar.mutate(
      {
        id: receita?.id,
        dados: {
          cliente_id: clienteId,
          tipo: categoria.trim(),
          data_hora: camposParaDataHora(valores.data, valores.hora),
          quantidade: Number(valores.quantidade),
          valor_unitario: valores.centavos / 100,
          forma_pagamento: forma,
          status_pagamento: situacao,
          observacao: observacao.trim() || null,
          ...campoCarteira(carteiraId),
        },
      },
      { onSuccess: () => router.push(destino) },
    );
  }

  const cabecalho = (
    <CabecalhoTela titulo={receita ? "Editar receita" : "Nova receita"} voltarPara={destino} />
  );

  if (!carregandoClientes && clientes?.length === 0) {
    return (
      <main className="flex flex-col gap-8 px-5 pt-[calc(env(safe-area-inset-top)+12px)]">
        {cabecalho}
        <PrimeiroCliente aoFechar={() => router.push("/")} />
      </main>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="flex min-h-dvh flex-col">
      <div className="flex flex-col gap-3 px-5 pt-[calc(env(safe-area-inset-top)+12px)]">
        {cabecalho}
        <AvisoErro mensagem={salvar.error?.message} />

        <div className="flex flex-col gap-[5px]">
          <label htmlFor={idCliente} className="text-xs font-semibold">
            Cliente
          </label>
          <select
            id={idCliente}
            value={clienteId}
            onChange={(evento) => {
              const id = evento.target.value;
              setClienteEscolhido(id);
              // Trocar o cliente traz a categoria que costuma acompanhar ele.
              const deCostume = categoriaDoCliente?.get(id);
              if (deCostume) setCategoria(deCostume);
            }}
            aria-invalid={erros.cliente ? true : undefined}
            className={`appearance-none rounded-[10px] border bg-white bg-[url('/icones/seta-baixo.svg')] bg-[right_14px_center] bg-no-repeat px-[14px] py-[11px] text-[13px] outline-none focus:border-dourado ${
              erros.cliente ? "border-negativo" : "border-cinza-claro"
            }`}
          >
            <option value="" disabled>
              {carregandoClientes ? "Carregando..." : "Escolha o cliente"}
            </option>
            {clientes?.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
          {erros.cliente && <span className="text-[11px] text-negativo">{erros.cliente}</span>}
        </div>

        <CampoCategoria tipo="receita" valor={categoria} aoMudar={setCategoria} erro={erros.categoria} />
        <CamposValor valores={valores} aoMudar={setValores} corTotal="text-positivo" erros={erros} />
        <SeletorChips
          rotulo="Forma de pagamento"
          opcional
          opcoes={FORMAS}
          valor={forma}
          aoMudar={(valor) => setForma(valor as FormaPagamento | null)}
          desmarcavel
        />
        <CampoCarteira valor={carteiraId ?? null} aoMudar={setCarteiraId} />
        <Alternador rotulo="Situação" opcoes={SITUACOES} valor={situacao} aoMudar={setSituacao} />
        <CampoTexto
          rotulo="Observação"
          opcional
          value={observacao}
          onChange={(evento) => setObservacao(evento.target.value)}
          placeholder="Ex.: entrega no bairro Centro"
        />
      </div>

      <div className="sticky bottom-0 mt-auto bg-fundo px-5 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+26px)]">
        <Botao type="submit" disabled={salvar.isPending}>
          {salvar.isPending ? "Salvando..." : receita ? "Salvar alterações" : "Salvar receita"}
        </Botao>
      </div>
    </form>
  );
}
