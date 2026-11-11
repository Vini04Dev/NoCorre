"use client";

import { useId, useState } from "react";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CampoMoeda } from "@/components/ui/CampoMoeda";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { useTransferir, type Carteira } from "@/hooks/useCarteiras";
import { camposParaDataHora, dataHoraParaCampos } from "@/lib/data";

const CLASSE_SELECT =
  "w-full appearance-none rounded-[10px] border border-cinza-claro bg-white bg-[url('/icones/seta-baixo.svg')] bg-[right_14px_center] bg-no-repeat px-[14px] py-[11px] text-[13px] outline-none focus:border-dourado";

/** Dinheiro que muda de carteira, como um saque do banco para a mão. Não é receita nem despesa. */
export function PainelTransferencia({ carteiras, aoFechar }: { carteiras: Carteira[]; aoFechar: () => void }) {
  const transferir = useTransferir();
  const idOrigem = useId();
  const idDestino = useId();
  const agora = dataHoraParaCampos(new Date());
  const [origem, setOrigem] = useState(carteiras[0]?.id ?? "");
  const [destino, setDestino] = useState(carteiras[1]?.id ?? "");
  const [centavos, setCentavos] = useState(0);
  const [data, setData] = useState(agora.data);
  const [erro, setErro] = useState<string>();

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!origem || !destino || origem === destino) return setErro("Escolha duas carteiras diferentes.");
    if (centavos <= 0) return setErro("Informe o valor.");
    setErro(undefined);
    transferir.mutate(
      { origem_id: origem, destino_id: destino, valor: centavos / 100, data_hora: camposParaDataHora(data, agora.hora) },
      { onSuccess: aoFechar },
    );
  }

  return (
    <PainelInferior idTitulo="transferencia-titulo" aoFechar={aoFechar} aoEnviar={enviar}>
      <h2 id="transferencia-titulo" className="text-lg font-extrabold">
        Transferir entre carteiras
      </h2>
      <p className="-mt-2 text-xs text-cinza-escuro">Ex.: sacar do banco para o dinheiro em mão.</p>
      <AvisoErro mensagem={erro ?? transferir.error?.message} />
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-[5px]">
          <label htmlFor={idOrigem} className="text-xs font-semibold">
            De
          </label>
          <select id={idOrigem} value={origem} onChange={(e) => setOrigem(e.target.value)} className={CLASSE_SELECT}>
            {carteiras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-[5px]">
          <label htmlFor={idDestino} className="text-xs font-semibold">
            Para
          </label>
          <select id={idDestino} value={destino} onChange={(e) => setDestino(e.target.value)} className={CLASSE_SELECT}>
            {carteiras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
      </div>
      <CampoMoeda rotulo="Valor" centavos={centavos} aoMudar={setCentavos} />
      <CampoTexto rotulo="Data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
      <Botao type="submit" disabled={transferir.isPending}>
        {transferir.isPending ? "Salvando..." : "Transferir"}
      </Botao>
    </PainelInferior>
  );
}
