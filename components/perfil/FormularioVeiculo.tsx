"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { useSalvarPerfil, type Perfil } from "@/hooks/usePerfil";
import { formatarPlaca } from "@/lib/formatar";

const ANO_MINIMO = 1950;

/** Modelo, ano e placa do veículo. Salva só essas colunas do perfil. */
export function FormularioVeiculo({ perfil }: { perfil: Perfil }) {
  const router = useRouter();
  const salvar = useSalvarPerfil();

  const [veiculo, setVeiculo] = useState(perfil.veiculo ?? "");
  const [ano, setAno] = useState(perfil.ano_veiculo ? String(perfil.ano_veiculo) : "");
  const [placa, setPlaca] = useState(perfil.placa ?? "");
  const [erroAno, setErroAno] = useState<string>();

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const anoNumero = ano ? Number(ano) : null;
    const invalido = anoNumero !== null && (anoNumero < ANO_MINIMO || anoNumero > new Date().getFullYear() + 1);
    setErroAno(invalido ? "Ano inválido." : undefined);
    if (invalido) return;

    salvar.mutate(
      {
        id: perfil.id,
        dados: { veiculo: veiculo.trim() || null, ano_veiculo: anoNumero, placa: placa || null },
        fotoAtual: perfil.foto,
      },
      { onSuccess: () => router.push("/perfil") },
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="flex min-h-dvh flex-col">
      <div className="flex flex-col gap-3 px-5 pt-[calc(env(safe-area-inset-top)+12px)]">
        <CabecalhoTela titulo="Meu veículo" voltarPara="/perfil" />
        <AvisoErro mensagem={salvar.error?.message} />

        <CampoTexto
          rotulo="Modelo"
          opcional
          value={veiculo}
          onChange={(e) => setVeiculo(e.target.value)}
          maxLength={60}
          placeholder="Ex.: Honda CG 160"
        />
        <div className="grid grid-cols-2 gap-2.5">
          <CampoTexto
            rotulo="Ano"
            opcional
            inputMode="numeric"
            value={ano}
            onChange={(e) => setAno(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="2022"
            erro={erroAno}
          />
          <CampoTexto
            rotulo="Placa"
            opcional
            value={placa}
            onChange={(e) => setPlaca(formatarPlaca(e.target.value))}
            autoCapitalize="characters"
            placeholder="ABC-1D23"
          />
        </div>
      </div>

      <div className="sticky bottom-0 mt-auto bg-fundo px-5 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+26px)]">
        <Botao type="submit" disabled={salvar.isPending}>
          {salvar.isPending ? "Salvando..." : "Salvar veículo"}
        </Botao>
      </div>
    </form>
  );
}
