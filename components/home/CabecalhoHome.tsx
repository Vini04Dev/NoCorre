import Image from "next/image";

export function CabecalhoHome({ nome }: { nome?: string }) {
  const saudacao = nome ? `Seja bem vindo ${nome}!` : "Seja bem vindo!";

  return (
    <header className="rounded-b-[10px] bg-linear-to-t from-marinho from-7% to-cinza-escuro to-70% px-[13px] pt-[calc(env(safe-area-inset-top)+14px)] pb-[18px] text-white shadow-cabecalho lg:flex lg:items-center lg:gap-5 lg:rounded-[20px] lg:bg-linear-to-r lg:from-marinho lg:from-40% lg:to-cinza-escuro lg:to-130% lg:px-8 lg:py-7">
      <div className="size-[39px] overflow-hidden rounded-[5px] bg-white lg:hidden">
        <Image src="/imagens/logo.png" alt="No Corre!" width={39} height={39} priority />
      </div>
      <div>
      <h1 className="mt-[7px] flex items-center gap-1.5 text-xl font-black uppercase lg:mt-0 lg:text-3xl">
        {saudacao}
        <Image src="/imagens/foguete.png" alt="" width={21} height={21} />
      </h1>
      <p className="mt-0.5 text-[13px] font-medium lg:text-base lg:text-cinza-claro">Bora pro corre!?</p>
      </div>
    </header>
  );
}
