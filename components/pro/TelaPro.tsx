"use client";

import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { IconeCirculo } from "@/components/ui/IconeCirculo";
import { usePlano } from "@/hooks/usePlano";
import { RECURSOS_PRO } from "@/lib/pro";
import { SeloPro } from "./SeloPro";

const EMAIL = "vini0102033@gmail.com";

/**
 * Tela do plano Pro: o que ele inclui e a situação da conta. Ainda não há
 * cobrança; o Pro é liberado pelo ADM para quem participa dos testes.
 */
export function TelaPro() {
  const { ehPro, carregando } = usePlano();
  return (
    <main className="flex flex-col gap-4 px-5 pt-[calc(env(safe-area-inset-top)+12px)] pb-10">
      <CabecalhoTela titulo="No Corre! Pro" voltarPara="/perfil" />

      <section className="relative overflow-hidden rounded-[18px] bg-linear-to-r from-marinho from-40% to-cinza-escuro to-130% px-5 py-6 text-white">
        <div className="flex items-center gap-2">
          <SeloPro />
          <span className="text-[11px] font-semibold tracking-[0.66px] text-cinza-claro">SEU PLANO</span>
        </div>
        <p className="mt-2 text-2xl font-extrabold">{carregando ? "–" : ehPro ? "Pro ativo" : "Grátis"}</p>
        <p className="mt-1 text-xs text-cinza-claro">
          {ehPro
            ? "Você tem acesso a todos os recursos abaixo."
            : "O essencial continua grátis. O Pro soma recursos para quem quer mais controle."}
        </p>
      </section>

      <section className="flex flex-col gap-2.5">
        <h2 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">O QUE O PRO INCLUI</h2>
        {RECURSOS_PRO.map(({ chave, icone, titulo, texto }) => (
          <div key={chave} className="flex items-start gap-3 rounded-[12px] border border-black/8 bg-white p-3.5 shadow-cartao">
            <IconeCirculo src={icone} />
            <span className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold">{titulo}</span>
              <span className="text-[11px] leading-relaxed text-cinza-escuro">{texto}</span>
            </span>
          </div>
        ))}
        <p className="text-center text-[11px] text-cinza-escuro">Mais recursos serão adicionados ao Pro.</p>
      </section>

      {!ehPro && !carregando && (
        <section className="flex flex-col gap-2 rounded-[14px] border border-dourado bg-dourado-claro/20 p-4 text-xs">
          <p className="font-bold">O Pro está em fase de testes</p>
          <p className="text-cinza-escuro">
            Ainda não há assinatura. Quem quiser testar os recursos Pro pode pedir acesso por e-mail.
          </p>
          <a
            href={`mailto:${EMAIL}?subject=Quero%20testar%20o%20No%20Corre!%20Pro`}
            className="mt-1 rounded-[10px] bg-linear-to-r from-dourado-claro to-dourado py-3 text-center text-sm font-extrabold"
          >
            Pedir acesso ao Pro
          </a>
        </section>
      )}
    </main>
  );
}
