import type { ButtonHTMLAttributes } from "react";

const VARIANTES = {
  /** Gradiente dourado, como o "Salvar cliente" do Figma. */
  primario: "bg-linear-to-r from-dourado-claro to-dourado font-extrabold text-marinho",
  /** Contorno azul-marinho, como o "Cancelar". */
  contorno: "border-[1.5px] border-marinho bg-white font-semibold text-marinho",
  /** Contorno vermelho, como o "Excluir" das telas de edição. */
  perigo: "border-[1.5px] border-negativo bg-white font-semibold text-negativo",
  /** Vermelho cheio, para confirmar uma exclusão. */
  perigoCheio: "bg-negativo font-semibold text-white",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: keyof typeof VARIANTES;
  /** Versão alta das telas de acesso ("Entrar", "Criar Conta"). */
  grande?: boolean;
};

export function Botao({ className = "", type = "button", variante = "primario", grande, ...props }: Props) {
  const tamanho = grande ? "h-12 text-xl" : "py-[13px] text-[15px]";

  return (
    <button
      type={type}
      className={`w-full rounded-[10px] disabled:opacity-50 ${VARIANTES[variante]} ${tamanho} ${className}`}
      {...props}
    />
  );
}
