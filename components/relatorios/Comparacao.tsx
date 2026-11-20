import { Valor } from "@/components/ui/Valor";
import { formatarMoeda } from "@/lib/formatar";

/**
 * Diferença contra o período anterior, em reais ou em quantidade:
 * "R$ 30 a mais que na semana passada". Verde quando subiu, vermelho quando
 * caiu (`menosEhBom` inverte, para gastos). Sem nada antes, não mostra nada:
 * a tela avisa uma vez só que não há com o que comparar. Sem porcentagem, que
 * confunde.
 */
export function Comparacao({
  atual,
  antes,
  dinheiro = true,
  comparado,
  unidade,
  menosEhBom = false,
}: {
  atual: number;
  antes: number;
  dinheiro?: boolean;
  /** "que no mês passado", "que até este dia no mês passado"... */
  comparado: string;
  /** Singular e plural, para quantidades: ["entrega", "entregas"]. */
  unidade?: [string, string];
  menosEhBom?: boolean;
}) {
  if (antes === 0) return null;
  const diferenca = Math.round((atual - antes) * 100) / 100;
  if (diferenca === 0) return <span className="text-[11px] text-cinza-escuro">O mesmo {comparado}</span>;
  const mais = diferenca > 0;
  const bom = mais !== menosEhBom;
  const valor = Math.abs(diferenca);
  return (
    <span className={`text-[11px] ${bom ? "text-recebido" : "text-negativo"}`}>
      <b>
        {dinheiro ? (
          <Valor texto={formatarMoeda(valor)} />
        ) : (
          `${valor.toLocaleString("pt-BR")}${unidade ? ` ${valor === 1 ? unidade[0] : unidade[1]}` : ""}`
        )}{" "}
        a {mais ? "mais" : "menos"}
      </b>{" "}
      <span className="text-cinza-escuro">{comparado}</span>
    </span>
  );
}
