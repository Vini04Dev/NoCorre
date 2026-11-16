"use client";

import { useState } from "react";
import { Alternador } from "@/components/ui/Alternador";
import { Botao } from "@/components/ui/Botao";

/**
 * DESENHO do módulo de exportar e importar (ainda sem função): serve para
 * discutir o fluxo antes de implementar. Nada aqui lê ou grava dados; os
 * números são de exemplo. As decisões estão em docs/exportar-importar.md.
 */

const CARTAO = "rounded-[12px] border border-black/8 bg-white p-3.5 shadow-cartao";
const CHIP = "rounded-full border px-3 py-1.5 text-xs";
const chip = (ativo: boolean) =>
  `${CHIP} ${ativo ? "border-marinho bg-marinho font-semibold text-white" : "border-cinza-claro bg-white font-medium"}`;

function Icone({ d }: { d: string }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-dourado-claro">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={d} />
      </svg>
    </span>
  );
}

/** Opção de escolha única em formato de cartão, com título e explicação. */
function Opcao({ ativo, titulo, texto, d, aoEscolher }: { ativo: boolean; titulo: string; texto: string; d: string; aoEscolher: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={ativo}
      onClick={aoEscolher}
      className={`flex items-center gap-3 rounded-[12px] border bg-white p-3 text-left shadow-cartao ${ativo ? "border-marinho ring-1 ring-marinho" : "border-black/8"}`}
    >
      <Icone d={d} />
      <span className="flex flex-col gap-0.5">
        <span className="text-[13px] font-bold">{titulo}</span>
        <span className="text-[11px] text-cinza-escuro">{texto}</span>
      </span>
    </button>
  );
}

const PERIODOS = ["Este mês", "Mês passado", "Este ano", "Escolher datas"];

const FORMATOS = [
  { valor: "pdf", titulo: "PDF", texto: "Para mostrar ou imprimir. Bom para comprovar renda.", d: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" },
  { valor: "xlsx", titulo: "Planilha (Excel)", texto: "Abre no Excel ou no Google Planilhas, com uma aba por tipo.", d: "M4 5h16v14H4zM4 10h16M4 15h16M10 5v14" },
  { valor: "csv", titulo: "CSV", texto: "Texto simples, aceito por outros apps de finanças.", d: "M4 6h16M4 12h16M4 18h10" },
];

const CONTEUDOS = [
  { valor: "extrato", titulo: "Extrato", texto: "Receitas, despesas e outras entradas, linha por linha." },
  { valor: "relatorio", titulo: "Relatório", texto: "O resumo do período: recebido, despesas, saldo e por cliente." },
  { valor: "copia", titulo: "Cópia de tudo", texto: "Todos os seus dados, para guardar ou trazer de volta depois." },
];

function Exportar() {
  const [conteudo, setConteudo] = useState("extrato");
  const [periodo, setPeriodo] = useState(PERIODOS[0]);
  const [formato, setFormato] = useState("pdf");
  const copia = conteudo === "copia";
  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-[13px] font-semibold">O que exportar</legend>
        <div role="radiogroup" className="flex flex-col gap-2">
          {CONTEUDOS.map((c) => (
            <Opcao key={c.valor} ativo={conteudo === c.valor} titulo={c.titulo} texto={c.texto} d="M6 4h12v16H6zM9 9h6M9 13h6" aoEscolher={() => setConteudo(c.valor)} />
          ))}
        </div>
      </fieldset>

      {!copia && (
        <>
          <fieldset>
            <legend className="mb-2 text-[13px] font-semibold">Período</legend>
            <div className="flex flex-wrap gap-2">
              {PERIODOS.map((p) => (
                <button key={p} type="button" aria-pressed={periodo === p} onClick={() => setPeriodo(p)} className={chip(periodo === p)}>
                  {p}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-[13px] font-semibold">Formato</legend>
            <div role="radiogroup" className="flex flex-col gap-2">
              {FORMATOS.map((f) => (
                <Opcao key={f.valor} ativo={formato === f.valor} titulo={f.titulo} texto={f.texto} d={f.d} aoEscolher={() => setFormato(f.valor)} />
              ))}
            </div>
          </fieldset>
        </>
      )}

      <div className={`${CARTAO} flex flex-col gap-1 text-xs`}>
        <p className="font-bold">O arquivo vai ter</p>
        <p className="text-cinza-escuro">
          {copia
            ? "Clientes, categorias, receitas, despesas, outras entradas, metas, contas do mês e agenda."
            : conteudo === "relatorio"
              ? `Resumo de ${periodo.toLowerCase()}: 1 página com saldo, recebido, despesas do corre e pessoais, e os clientes.`
              : `128 lançamentos de ${periodo.toLowerCase()}: 96 receitas, 29 despesas e 3 outras entradas.`}
        </p>
      </div>
      <Botao disabled>Exportar (em desenho)</Botao>
      <p className="text-center text-[11px] text-cinza-escuro">No celular, abre o compartilhar (WhatsApp, e-mail, arquivos). No computador, baixa o arquivo.</p>
    </div>
  );
}

const ORIGENS = [
  { valor: "planilha", titulo: "Planilha (CSV ou Excel)", texto: "De outro app ou do seu controle no Excel. Tem modelo para baixar.", d: "M4 5h16v14H4zM4 10h16M4 15h16M10 5v14" },
  { valor: "banco", titulo: "Extrato do banco (OFX)", texto: "O arquivo que o banco gera no extrato. Entra como despesas e entradas.", d: "M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" },
  { valor: "copia", titulo: "Cópia do No Corre!", texto: "Arquivo feito em Exportar › Cópia de tudo.", d: "M12 4v12M7 11l5 5 5-5M4 20h16" },
];

const PASSOS = ["Arquivo", "Colunas", "Conferir", "Pronto"];

function Importar() {
  const [passo, setPasso] = useState(0);
  const [origem, setOrigem] = useState("planilha");
  return (
    <div className="flex flex-col gap-4">
      <ol className="flex items-center gap-1.5" aria-label={`Passo ${passo + 1} de ${PASSOS.length}`}>
        {PASSOS.map((nome, i) => (
          <li key={nome} className="flex flex-1 flex-col gap-1">
            <span className={`h-1.5 rounded-full ${i <= passo ? "bg-marinho" : "bg-cinza-claro"}`} />
            <span className={`text-[10px] ${i === passo ? "font-bold" : "text-cinza-escuro"}`}>{nome}</span>
          </li>
        ))}
      </ol>

      {passo === 0 && (
        <>
          <div role="radiogroup" aria-label="De onde vem o arquivo" className="flex flex-col gap-2">
            {ORIGENS.map((o) => (
              <Opcao key={o.valor} ativo={origem === o.valor} titulo={o.titulo} texto={o.texto} d={o.d} aoEscolher={() => setOrigem(o.valor)} />
            ))}
          </div>
          <div className="grid place-items-center gap-1 rounded-[12px] border border-dashed border-cinza-claro px-4 py-6 text-center text-xs">
            <p className="font-bold">Escolher arquivo</p>
            <p className="text-cinza-escuro">O arquivo é lido no seu aparelho. Nada é gravado antes de você conferir.</p>
          </div>
          {origem === "planilha" && <p className="text-center text-xs font-bold text-dourado-texto">Baixar planilha modelo</p>}
        </>
      )}

      {passo === 1 && (
        <div className={`${CARTAO} flex flex-col gap-2 text-xs`}>
          <p className="font-bold">O app reconheceu as colunas. Confira:</p>
          {[
            ["Data", "Data"],
            ["Histórico", "Descrição"],
            ["Valor", "Valor (negativo = despesa)"],
            ["Categoria", "Categoria"],
          ].map(([coluna, campo]) => (
            <div key={coluna} className="flex items-center justify-between gap-2 rounded-[10px] bg-cinza-fundo px-3 py-2">
              <span className="text-cinza-escuro">Coluna &quot;{coluna}&quot;</span>
              <span className="font-semibold">{campo}</span>
            </div>
          ))}
          <p className="text-[11px] text-cinza-escuro">Toque numa linha para trocar. Colunas não usadas ficam de fora.</p>
        </div>
      )}

      {passo === 2 && (
        <div className="flex flex-col gap-2 text-xs">
          <div className={`${CARTAO} grid grid-cols-3 gap-2 text-center`}>
            {[
              ["84", "novos", "text-positivo"],
              ["6", "talvez repetidos", "text-pendente"],
              ["2", "com erro", "text-negativo"],
            ].map(([n, rotulo, cor]) => (
              <div key={rotulo}>
                <p className={`text-lg font-extrabold ${cor}`}>{n}</p>
                <p className="text-[11px] text-cinza-escuro">{rotulo}</p>
              </div>
            ))}
          </div>
          <div className={`${CARTAO} flex flex-col gap-1`}>
            <p className="font-bold">Talvez repetidos</p>
            <p className="text-cinza-escuro">Mesma data, valor e descrição de um lançamento que já existe. Ficam desmarcados; marque os que quiser trazer.</p>
          </div>
          <div className={`${CARTAO} flex flex-col gap-1`}>
            <p className="font-bold">Cliente das receitas</p>
            <p className="text-cinza-escuro">Toda receita precisa de um cliente. Escolha um para as que vierem sem (ex.: &quot;Importado&quot;).</p>
          </div>
        </div>
      )}

      {passo === 3 && (
        <div className={`${CARTAO} flex flex-col gap-1 text-xs`}>
          <p className="text-sm font-extrabold text-positivo">84 lançamentos importados</p>
          <p className="text-cinza-escuro">Eles já aparecem no Resumo. Importou errado? Dá para desfazer esta importação inteira por 7 dias.</p>
          <p className="mt-1 font-bold text-dourado-texto">Desfazer importação</p>
        </div>
      )}

      <div className={`grid gap-2.5 ${passo > 0 && passo < 3 ? "grid-cols-2" : "grid-cols-1"}`}>
        {passo > 0 && passo < 3 && (
          <Botao variante="contorno" onClick={() => setPasso(passo - 1)}>
            Voltar
          </Botao>
        )}
        <Botao onClick={() => setPasso(passo === 3 ? 0 : passo + 1)}>
          {passo === 2 ? "Importar 84 lançamentos" : passo === 3 ? "Ver o desenho de novo" : "Continuar"}
        </Botao>
      </div>
    </div>
  );
}

export function DesenhoExportarImportar() {
  const [aba, setAba] = useState<"exportar" | "importar">("exportar");
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-[10px] bg-dourado-claro/30 px-3 py-2 text-[11px]">
        Desenho para discutir o fluxo. Nada aqui lê ou grava dados; os números são de exemplo.
      </p>
      <Alternador
        rotulo="Exportar ou importar"
        opcoes={[
          { valor: "exportar", rotulo: "Exportar" },
          { valor: "importar", rotulo: "Importar" },
        ]}
        valor={aba}
        aoMudar={setAba}
      />
      {aba === "exportar" ? <Exportar /> : <Importar />}
    </div>
  );
}
