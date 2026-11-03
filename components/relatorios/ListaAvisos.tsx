import Image from "next/image";
import type { Aviso } from "@/lib/relatorio";

const ICONES: Record<Aviso["icone"], string> = {
  alta: "/icones/seta-extrato-receita.svg",
  horario: "/icones/saldo.svg",
  pendente: "/icones/pendente.svg",
};

/** "Atenção na operação": avisos calculados a partir dos lançamentos. */
export function ListaAvisos({ avisos }: { avisos: Aviso[] }) {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <h2 className="tracking-[0.66px] text-cinza">ATENÇÃO NA OPERAÇÃO</h2>
        <span>
          {avisos.length} {avisos.length === 1 ? "alerta" : "alertas"}
        </span>
      </div>
      <ul className="flex flex-col gap-2 rounded-[12px] border border-cinza-claro bg-white px-3.5 py-2.5">
        {avisos.length === 0 && (
          <li className="py-3 text-center text-xs text-cinza-escuro">Nenhum alerta. Segue o corre!</li>
        )}
        {avisos.map((aviso) => (
          <li key={aviso.titulo} className="flex items-center gap-2.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-dourado-claro">
              <Image src={ICONES[aviso.icone]} alt="" width={16} height={16} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-[11px] leading-[14px] font-semibold">{aviso.titulo}</span>
              <span className="text-[10px] leading-3 text-cinza-escuro">{aviso.detalhe}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
