"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CampoCarteira, campoCarteira } from "@/components/carteiras/CampoCarteira";
import { useCarteiraEmFoco } from "@/hooks/useCarteiraEmFoco";
import { CampoCategoria } from "./CampoCategoria";
import { CampoConta } from "./CampoConta";
import { CamposValor, validarValores, valoresIniciais, type Valores } from "./CamposValor";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { CampoSugestoes } from "@/components/ui/CampoSugestoes";
import { useCategorias } from "@/hooks/useCategorias";
import { useDescricoesDespesa } from "@/hooks/useDescricoesDespesa";
import { normalizar } from "@/lib/sugestoes";
import { useSalvarDespesa } from "@/hooks/useLancamentos";
import { useContasEmAberto } from "@/hooks/useMetas";
import type { ContaFixa } from "@/hooks/useContasFixas";
import type { Despesa } from "@/hooks/useMovimentacoes";
import { CATEGORIA_CONTAS, CATEGORIAS_PADRAO, doCorrePadrao } from "@/lib/categorias-padrao";
import { camposParaDataHora } from "@/lib/data";
import { ROTA_CONTAS } from "@/lib/contas-fixas";
import { formatarMoeda } from "@/lib/formatar";
import { emAbertoNaConta } from "@/lib/metas";

type Erros = { categoria?: string; quantidade?: string; valor?: string; conta?: string };

type Props = {
  despesa?: Despesa;
  /** Conta das Metas já escolhida (botão "Lançar pagamento" da conta). */
  contaInicial?: string;
  /** Conta fixa sendo paga: vem preenchida e a despesa fica ligada a ela. */
  fixa?: ContaFixa;
};

/** Lança uma despesa nova ou, recebendo `despesa`, edita a existente. */
export function FormularioDespesa({ despesa, contaInicial, fixa }: Props) {
  const router = useRouter();
  const salvar = useSalvarDespesa();
  const { data: contas } = useContasEmAberto();
  const { data: usadas } = useDescricoesDespesa();
  const { data: criadas } = useCategorias();
  const destino = despesa
    ? `/resumo/despesa/${despesa.id}`
    : contaInicial
      ? `/metas/${contaInicial}`
      : fixa
        ? ROTA_CONTAS
        : "/";

  const [descricao, setDescricao] = useState(despesa?.observacao ?? fixa?.descricao ?? "");
  const [categoria, setCategoriaBruta] = useState(despesa?.tipo ?? fixa?.tipo ?? CATEGORIAS_PADRAO.despesa[0]);
  // null = segue o padrão da categoria; true/false = a pessoa escolheu.
  const [doCorreEscolhido, setDoCorreEscolhido] = useState<boolean | null>(despesa ? (despesa.do_corre ?? true) : null);
  function setCategoria(nova: string) {
    setCategoriaBruta(nova);
    setDoCorreEscolhido(null);
  }
  const [valores, setValores] = useState<Valores>(() =>
    valoresIniciais(despesa ?? (fixa && { data_hora: new Date().toISOString(), quantidade: 1, valor_unitario: fixa.valor })),
  );
  const [contaId, setContaId] = useState<string | null>(despesa?.meta_id ?? contaInicial ?? null);
  const [erros, setErros] = useState<Erros>({});
  // undefined = ninguém mexeu (não manda a coluna); null = carteira principal.
  const [carteiraId, setCarteiraId] = useState<string | null | undefined>(
    despesa ? despesa.carteira_id : fixa ? fixa.carteira_id : undefined,
  );
  // Lançamento novo sem escolha: a carteira em foco no Início (à vista no campo Carteira).
  const { carteira: emFoco } = useCarteiraEmFoco();
  const carteiraEfetiva = carteiraId !== undefined ? carteiraId : emFoco?.id;

  // Pagamento de conta não pede categoria: vai como "Contas", descrito pelo nome da conta.
  const conta = contas.find((item) => item.id === contaId);
  const doCorre = doCorreEscolhido ?? doCorrePadrao(conta ? CATEGORIA_CONTAS : categoria, criadas ?? []);

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const novosErros: Erros = { ...validarValores(valores) };
    if (!conta && !categoria.trim()) novosErros.categoria = "Escolha ou digite a categoria.";
    // O banco também barra, mas aqui o aviso aparece antes de enviar.
    const total = (Number(valores.quantidade) * valores.centavos) / 100;
    if (conta && total > emAbertoNaConta(conta, despesa)) {
      novosErros.conta = `Passa do valor da conta. Falta pagar ${formatarMoeda(emAbertoNaConta(conta, despesa))}.`;
    }
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    salvar.mutate(
      {
        id: despesa?.id,
        dados: {
          tipo: conta ? CATEGORIA_CONTAS : categoria.trim(),
          observacao: descricao.trim() || conta?.nome || null,
          data_hora: camposParaDataHora(valores.data, valores.hora),
          quantidade: Number(valores.quantidade),
          valor_unitario: valores.centavos / 100,
          meta_id: contaId,
          do_corre: doCorre,
          ...campoCarteira(carteiraEfetiva),
          // Só manda a coluna pagando uma conta fixa: sem a migration, ela nem existe.
          ...(fixa ? { conta_fixa_id: fixa.id } : {}),
        },
      },
      { onSuccess: () => router.push(destino) },
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="flex min-h-dvh flex-col">
      <div className="flex flex-col gap-3 px-5 pt-[calc(env(safe-area-inset-top)+12px)]">
        <CabecalhoTela
          titulo={despesa ? "Editar despesa" : contaInicial || fixa ? "Pagar conta" : "Nova despesa"}
          voltarPara={destino}
        />
        <AvisoErro mensagem={salvar.error?.message} />
        <CampoConta valor={contaId} aoMudar={setContaId} despesa={despesa} erro={erros.conta} />
        <CampoSugestoes
          rotulo="Descrição"
          opcional
          valor={descricao}
          aoMudar={setDescricao}
          opcoes={usadas?.descricoes ?? []}
          // Escolher uma descrição já usada marca a mesma categoria da última vez.
          aoEscolher={(texto) => {
            const usada = usadas?.categorias.get(normalizar(texto));
            if (usada) setCategoria(usada);
          }}
          placeholder={conta ? conta.nome : "Ex.: Gasolina"}
        />
        {!conta && <CampoCategoria tipo="despesa" valor={categoria} aoMudar={setCategoria} erro={erros.categoria} />}
        <label className="flex items-start gap-2.5 rounded-[10px] bg-cinza-fundo px-3 py-2.5 text-xs">
          <input
            type="checkbox"
            checked={doCorre}
            onChange={(e) => setDoCorreEscolhido(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-marinho"
          />
          <span>
            <span className="font-semibold">Gasto do corre</span>
            <span className="block text-[11px] text-cinza-escuro">
              {doCorre
                ? "Custo do trabalho (gasolina, peças, diária): desconta do saldo do corre no Início."
                : "Gasto pessoal (mercado, contas, parcelas): não mexe no saldo do corre, mas sai da carteira."}
            </span>
          </span>
        </label>
        <CamposValor valores={valores} aoMudar={setValores} corTotal="text-negativo" erros={erros} />
        <CampoCarteira valor={carteiraEfetiva ?? null} aoMudar={setCarteiraId} />
      </div>

      <div className="sticky bottom-0 mt-auto bg-fundo px-5 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+26px)]">
        <Botao type="submit" disabled={salvar.isPending}>
          {salvar.isPending ? "Salvando..." : despesa ? "Salvar alterações" : conta || fixa ? "Salvar pagamento" : "Salvar despesa"}
        </Botao>
      </div>
    </form>
  );
}
