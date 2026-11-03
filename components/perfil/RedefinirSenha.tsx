"use client";

import { useRouter } from "next/navigation";
import { FormularioNovaSenha } from "./FormularioNovaSenha";

/** Aberta pelo link de "Esqueci minha senha": o link já deixa a pessoa logada. */
export function RedefinirSenha() {
  const router = useRouter();
  return (
    <main className="flex flex-col gap-4 px-5 pt-[calc(env(safe-area-inset-top)+24px)]">
      <h1 className="text-xl font-extrabold">Criar nova senha</h1>
      <p className="text-xs text-cinza-escuro">Escolha a senha que você vai usar para entrar daqui em diante.</p>
      <FormularioNovaSenha aoConcluir={() => router.replace("/")} />
    </main>
  );
}
