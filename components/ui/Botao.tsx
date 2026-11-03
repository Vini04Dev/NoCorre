import type { ButtonHTMLAttributes } from "react";

/** Botão principal (gradiente dourado), como o "Salvar cliente" do Figma. */
export function Botao({ className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`w-full rounded-[10px] bg-linear-to-r from-dourado-claro to-dourado py-[13px] text-[15px] font-extrabold text-marinho disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
