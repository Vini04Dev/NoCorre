"use client";

import { useId, useState } from "react";
import { Botao } from "@/components/ui/Botao";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { useCategorias } from "@/hooks/useCategorias";
import { useClientes } from "@/hooks/useClientes";
import { CATEGORIAS_PADRAO, type TipoCategoria } from "@/lib/categorias-padrao";
import { FILTROS_VAZIOS, type Filtros } from "@/lib/filtros";

type Props = {
  filtros: Filtros;
  aoAplicar: (filtros: Filtros) => void;
  aoFechar: () => void;
};

const CHIP = "rounded-full border px-[13px] py-1.5 text-xs";

/** Pílulas de múltipla escolha: cada toque liga ou desliga a opção. */
function Chips<T extends string>({
  rotulo,
  opcoes,
  marcados,
  aoMudar,
}: {
  rotulo: string;
  opcoes: { valor: T; rotulo: string }[];
  marcados: T[];
  aoMudar: (marcados: T[]) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-[13px] font-semibold">{rotulo}</legend>
      <div className="flex flex-wrap gap-[7px]">
        {opcoes.map((opcao) => {
          const ativo = marcados.includes(opcao.valor);
          return (
            <button
              key={opcao.valor}
              type="button"
              aria-pressed={ativo}
              onClick={() => aoMudar(ativo ? marcados.filter((v) => v !== opcao.valor) : [...marcados, opcao.valor])}
              className={`${CHIP} ${
                ativo ? "border-marinho bg-marinho font-semibold text-white" : "border-cinza-claro bg-white font-medium"
              }`}
            >
              {opcao.rotulo}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function PainelFiltros({ filtros, aoAplicar, aoFechar }: Props) {
  const idCliente = useId();
  const { data: clientes } = useClientes();
  const { data: categorias } = useCategorias();
  // Rascunho: só vale quando tocar em "Aplicar filtros".
  const [rascunho, setRascunho] = useState(filtros);
  const mudar = (parte: Partial<Filtros>) => setRascunho({ ...rascunho, ...parte });

  const opcoesCategoria = (tipo: TipoCategoria) =>
    [...CATEGORIAS_PADRAO[tipo], ...(categorias ?? []).filter((c) => c.tipo === tipo).map((c) => c.nome)].map(
      (nome) => ({ valor: nome, rotulo: nome }),
    );

  return (
    <PainelInferior idTitulo="painel-filtros-titulo" aoFechar={aoFechar}>
      <div className="flex items-center justify-between">
        <h2 id="painel-filtros-titulo" className="text-lg font-extrabold">
          Filtrar movimentações
        </h2>
        <button type="button" onClick={() => setRascunho(FILTROS_VAZIOS)} className="text-[13px] font-semibold text-dourado">
          Limpar
        </button>
      </div>

      <div className="flex max-h-[55dvh] flex-col gap-3.5 overflow-y-auto">
        <Chips
          rotulo="Categorias de receita"
          opcoes={opcoesCategoria("receita")}
          marcados={rascunho.categorias}
          aoMudar={(categorias) => mudar({ categorias })}
        />
        <Chips
          rotulo="Categorias de despesa"
          opcoes={opcoesCategoria("despesa")}
          marcados={rascunho.categorias}
          aoMudar={(categorias) => mudar({ categorias })}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor={idCliente} className="text-[13px] font-semibold">
            Cliente
          </label>
          <select
            id={idCliente}
            value={rascunho.clienteId}
            onChange={(evento) => mudar({ clienteId: evento.target.value })}
            className="appearance-none rounded-[10px] border border-cinza-claro bg-white bg-[url('/icones/seta-baixo.svg')] bg-[right_14px_center] bg-no-repeat px-[14px] py-[11px] text-[13px] outline-none focus:border-dourado"
          >
            <option value="">Todos os clientes</option>
            {clientes?.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Chips
            rotulo="Pagamento"
            opcoes={[
              { valor: "pix", rotulo: "Pix" },
              { valor: "dinheiro", rotulo: "Dinheiro" },
            ]}
            marcados={rascunho.formas}
            aoMudar={(formas) => mudar({ formas })}
          />
          <Chips
            rotulo="Situação"
            opcoes={[
              { valor: "pago", rotulo: "Pago" },
              { valor: "pendente", rotulo: "Pendente" },
            ]}
            marcados={rascunho.situacoes}
            aoMudar={(situacoes) => mudar({ situacoes })}
          />
        </div>
      </div>

      <Botao
        onClick={() => {
          aoAplicar(rascunho);
          aoFechar();
        }}
      >
        Aplicar filtros
      </Botao>
    </PainelInferior>
  );
}
