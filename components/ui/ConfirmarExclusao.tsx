"use client";

import { Botao } from "./Botao";

type Props = {
  titulo: string;
  mensagem: string;
  excluindo?: boolean;
  aoCancelar: () => void;
  aoConfirmar: () => void;
};

/** Pergunta "Tem certeza?" antes de qualquer exclusão, sobre o fundo escurecido. */
export function ConfirmarExclusao({ titulo, mensagem, excluindo, aoCancelar, aoConfirmar }: Props) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-[25px] backdrop-blur-[2px]">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmar-titulo"
        className="flex w-full max-w-[340px] flex-col items-center gap-2.5 rounded-[16px] bg-white px-[18px] pt-5 pb-[18px] text-center"
      >
        <span className="grid size-[54px] place-items-center rounded-full bg-negativo/12 text-[26px] font-black text-negativo">
          !
        </span>
        <h2 id="confirmar-titulo" className="text-lg font-extrabold">
          {titulo}
        </h2>
        <p className="text-[13px] text-cinza-escuro">{mensagem}</p>
        <div className="mt-2 grid w-full grid-cols-2 gap-2.5">
          <Botao variante="contorno" onClick={aoCancelar} disabled={excluindo}>
            Cancelar
          </Botao>
          <Botao variante="perigoCheio" onClick={aoConfirmar} disabled={excluindo}>
            {excluindo ? "Excluindo..." : "Excluir"}
          </Botao>
        </div>
      </div>
    </div>
  );
}
