import { sair } from "@/app/(auth)/acoes";
import { EmConstrucao } from "@/components/ui/EmConstrucao";

export default function Pagina() {
  return (
    <>
      <EmConstrucao titulo="Perfil" />
      {/* Saída provisória até a tela de Perfil completa. */}
      <form action={sair} className="px-[17px] pt-8">
        <button
          type="submit"
          className="w-full rounded-[10px] border border-negativo py-[13px] text-[15px] font-semibold text-negativo"
        >
          Sair da conta
        </button>
      </form>
    </>
  );
}
