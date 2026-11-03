import Link from "next/link";
import { CirculoProgresso } from "./CirculoProgresso";
import {
  corDaMeta,
  ROTULO_PARAMETRO,
  ROTULO_SITUACAO,
  textoPeriodo,
  textoProgresso,
  type MetaComProgresso,
} from "@/lib/metas";
import { formatarMoeda } from "@/lib/formatar";

/** Situações que ganham etiqueta no card; "Ativa" não precisa. */
const COM_ETIQUETA = new Set(["agendada", "batida", "nao_batida", "dentro_limite", "passou_limite", "quitada", "atrasada", "pausada"]);

export function CartaoMeta({ meta }: { meta: MetaComProgresso }) {
  const cor = corDaMeta(meta);
  const parcela = meta.parcela_total ? ` · ${meta.parcela_atual}/${meta.parcela_total}` : "";

  return (
    <Link
      href={`/metas/${meta.id}`}
      className="flex items-center gap-3.5 rounded-[14px] border border-black/8 bg-white px-3.5 py-3.5 shadow-cartao"
    >
      <CirculoProgresso percentual={meta.percentual} traco={cor.traco} />
      <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        <span className="w-full truncate text-[15px] font-extrabold">{meta.nome}</span>
        <span className="text-xs font-semibold">{textoProgresso(meta)}</span>
        <span className="text-[11px] text-cinza-escuro">
          {textoPeriodo(meta)} · {ROTULO_PARAMETRO[meta.parametro]}
          {parcela}
        </span>
        {meta.aReceber > 0 && !meta.encerrada && (
          <span className="text-[11px] font-medium text-pendente">+ {formatarMoeda(meta.aReceber)} a receber</span>
        )}
        {COM_ETIQUETA.has(meta.situacao) && (
          <span className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cor.fundo} ${cor.texto}`}>
            {ROTULO_SITUACAO[meta.situacao]}
          </span>
        )}
      </span>
      <span aria-hidden className="text-lg font-semibold text-cinza">
        ›
      </span>
    </Link>
  );
}
