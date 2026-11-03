import Image from "next/image";
import { useId, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  rotulo: string;
  icone: string;
};

/** Campo com ícone à esquerda, usado nas telas de Entrar e Cadastrar. */
export function CampoAcesso({ rotulo, icone, ...props }: Props) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="pl-1 text-sm font-semibold">
        {rotulo}
      </label>
      <div className="flex h-[35px] items-center gap-2.5 rounded-[10px] border border-[#bdbdbd]/58 bg-white px-1.5 focus-within:border-dourado">
        <Image src={icone} alt="" width={24} height={24} />
        <input
          id={id}
          required
          className="min-w-0 flex-1 bg-transparent text-xs font-semibold outline-none placeholder:text-[#b4b4b4]"
          {...props}
        />
      </div>
    </div>
  );
}
