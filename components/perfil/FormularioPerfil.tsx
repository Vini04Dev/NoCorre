"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { SeletorChips } from "@/components/ui/SeletorChips";
import { SeletorFoto } from "@/components/ui/SeletorFoto";
import { useSalvarPerfil, type Perfil } from "@/hooks/usePerfil";
import { formatarPlaca, formatarTelefone } from "@/lib/formatar";

/** Os mesmos valores do check da coluna tipo_sanguineo. */
const TIPOS_SANGUINEOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((valor) => ({
  valor,
  rotulo: valor,
}));

const ANO_MINIMO = 1950;

/** Dados pessoais e do veículo. E-mail e senha ficam em "Senha e segurança". */
export function FormularioPerfil({ perfil }: { perfil: Perfil }) {
  const router = useRouter();
  const salvar = useSalvarPerfil();

  const [nome, setNome] = useState(perfil.nome);
  const [telefone, setTelefone] = useState(perfil.telefone ?? "");
  const [tipoSanguineo, setTipoSanguineo] = useState<string | null>(perfil.tipo_sanguineo);
  const [veiculo, setVeiculo] = useState(perfil.veiculo ?? "");
  const [ano, setAno] = useState(perfil.ano_veiculo ? String(perfil.ano_veiculo) : "");
  const [placa, setPlaca] = useState(perfil.placa ?? "");
  const [novaFoto, setNovaFoto] = useState<File | null>();
  const [erros, setErros] = useState<{ nome?: string; ano?: string }>({});

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const anoNumero = ano ? Number(ano) : null;
    const novosErros: typeof erros = {};
    if (!nome.trim()) novosErros.nome = "Informe seu nome.";
    if (anoNumero !== null && (anoNumero < ANO_MINIMO || anoNumero > new Date().getFullYear() + 1)) {
      novosErros.ano = "Ano inválido.";
    }
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    salvar.mutate(
      {
        id: perfil.id,
        dados: {
          nome: nome.trim(),
          telefone: telefone.trim() || null,
          tipo_sanguineo: tipoSanguineo,
          veiculo: veiculo.trim() || null,
          ano_veiculo: anoNumero,
          placa: placa || null,
        },
        fotoAtual: perfil.foto,
        novaFoto,
      },
      {
        onSuccess: () => {
          router.push("/perfil");
          // A saudação da Home é renderizada no servidor; refresh traz o nome novo.
          router.refresh();
        },
      },
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="flex min-h-dvh flex-col">
      <div className="flex flex-col gap-3 px-5 pt-[calc(env(safe-area-inset-top)+12px)]">
        <CabecalhoTela titulo="Dados pessoais" voltarPara="/perfil" />
        <AvisoErro mensagem={salvar.error?.message} />
        <SeletorFoto fotoSalva={perfil.fotoUrl} novaFoto={novaFoto} aoMudar={setNovaFoto} />

        <CampoTexto
          rotulo="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={100}
          autoComplete="name"
          erro={erros.nome}
        />
        <CampoTexto rotulo="Email" value={perfil.email ?? ""} disabled readOnly className="text-cinza-escuro" />
        <CampoTexto
          rotulo="Telefone"
          opcional
          type="tel"
          inputMode="numeric"
          value={telefone}
          onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
          placeholder="(35) 9 9999-8888"
        />
        <SeletorChips
          rotulo="Tipo sanguíneo"
          opcional
          opcoes={TIPOS_SANGUINEOS}
          valor={tipoSanguineo}
          aoMudar={setTipoSanguineo}
          desmarcavel
        />

        <h2 id="veiculo" className="mt-2 text-[11px] font-semibold tracking-[0.66px] text-cinza">
          MEU VEÍCULO
        </h2>
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
            erro={erros.ano}
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
          {salvar.isPending ? "Salvando..." : "Salvar alterações"}
        </Botao>
      </div>
    </form>
  );
}
