import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Versão alta das telas de acesso ("Entrar", "Criar Conta"). */
  grande?: boolean;
};

/** Botão principal (gradiente dourado), como o "Salvar cliente" do Figma. */
export function Botao({ className = "", type = "button", grande, ...props }: Props) {
  const tamanho = grande ? "h-12 text-xl" : "py-[13px] text-[15px]";

  return (
    <button
      type={type}
      className={`w-full rounded-[10px] bg-linear-to-r from-dourado-claro to-dourado font-extrabold text-marinho disabled:opacity-50 ${tamanho} ${className}`}
      {...props}
    />
  );
}
