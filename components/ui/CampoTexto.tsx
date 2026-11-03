import { useId, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  rotulo: string;
  opcional?: boolean;
  erro?: string;
};

/** Campo de formulário com rótulo, marcação de opcional e mensagem de erro. */
export function CampoTexto({ rotulo, opcional, erro, className = "", ...props }: Props) {
  const id = useId();
  const idErro = `${id}-erro`;

  return (
    <div className="flex flex-col gap-[5px]">
      <label htmlFor={id} className="flex gap-1">
        <span className="text-xs font-semibold">{rotulo}</span>
        {opcional && <span className="text-[11px] text-cinza-escuro">(opcional)</span>}
      </label>
      <input
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idErro : undefined}
        className={`rounded-[10px] border bg-white px-[14px] py-[11px] text-[13px] outline-none focus:border-dourado ${
          erro ? "border-negativo" : "border-cinza-claro"
        } ${className}`}
        {...props}
      />
      {erro && (
        <span id={idErro} className="text-[11px] text-negativo">
          {erro}
        </span>
      )}
    </div>
  );
}
