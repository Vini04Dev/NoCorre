"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AvatarCliente } from "./AvatarCliente";
import { Alternador } from "@/components/ui/Alternador";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { ConfirmarExclusao } from "@/components/ui/ConfirmarExclusao";
import {
  ROTULO_TIPO_CLIENTE,
  useExcluirCliente,
  useSalvarCliente,
  type Cliente,
  type TipoCliente,
} from "@/hooks/useClientes";
import { formatarTelefone } from "@/lib/formatar";

const OPCOES_TIPO = (Object.keys(ROTULO_TIPO_CLIENTE) as TipoCliente[]).map((valor) => ({
  valor,
  rotulo: ROTULO_TIPO_CLIENTE[valor],
}));

/** Cria um cliente novo ou, recebendo `cliente`, edita e permite excluir. */
export function FormularioCliente({ cliente }: { cliente?: Cliente }) {
  const router = useRouter();
  const salvar = useSalvarCliente();
  const excluir = useExcluirCliente();

  const [nome, setNome] = useState(cliente?.nome ?? "");
  const [tipo, setTipo] = useState<TipoCliente>(cliente?.tipo ?? "empresa");
  const [telefone, setTelefone] = useState(cliente?.telefone ?? "");
  const [observacao, setObservacao] = useState(cliente?.observacao ?? "");
  // undefined: mantém a foto salva; null: remove; File: troca.
  const [novaFoto, setNovaFoto] = useState<File | null>();
  const [erroNome, setErroNome] = useState<string>();
  const [confirmando, setConfirmando] = useState(false);
  const seletorFoto = useRef<HTMLInputElement>(null);

  const previa = useObjectUrl(novaFoto);
  const fotoExibida = novaFoto === undefined ? (cliente?.fotoUrl ?? null) : previa;
  const temFoto = Boolean(fotoExibida);
  const erro = salvar.error?.message ?? excluir.error?.message;

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!nome.trim()) {
      setErroNome("Informe o nome do cliente.");
      return;
    }
    salvar.mutate(
      {
        id: cliente?.id,
        dados: {
          nome: nome.trim(),
          tipo,
          telefone: telefone.trim() || null,
          observacao: observacao.trim() || null,
        },
        fotoAtual: cliente?.foto ?? null,
        novaFoto,
      },
      { onSuccess: () => router.push("/cadastro") },
    );
  }

  function confirmarExclusao() {
    if (!cliente) return;
    excluir.mutate(cliente, {
      onSuccess: () => router.push("/cadastro"),
      onSettled: () => setConfirmando(false),
    });
  }

  return (
    <form onSubmit={enviar} noValidate className="flex min-h-dvh flex-col">
      <div className="flex flex-col gap-3 px-5 pt-[calc(env(safe-area-inset-top)+12px)]">
        <CabecalhoTela titulo={cliente ? "Editar cliente" : "Novo cliente"} voltarPara="/cadastro" />
        <AvisoErro mensagem={erro} />

        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={() => seletorFoto.current?.click()}
            aria-label={temFoto ? "Trocar foto" : "Adicionar foto"}
          >
            {fotoExibida ? (
              <Image
                src={fotoExibida}
                alt=""
                width={84}
                height={84}
                unoptimized
                className="size-[84px] rounded-full object-cover"
              />
            ) : cliente && nome ? (
              <AvatarCliente nome={nome} fotoUrl={null} tamanho={84} />
            ) : (
              <span className="grid size-[84px] place-items-center rounded-full border-[1.5px] border-dashed border-cinza bg-cinza-fundo text-[28px] font-medium text-cinza-escuro">
                +
              </span>
            )}
          </button>
          <div className="flex gap-3 text-xs font-medium">
            <button
              type="button"
              onClick={() => seletorFoto.current?.click()}
              className={temFoto || cliente ? "font-semibold text-dourado" : "text-cinza-escuro"}
            >
              {temFoto || cliente ? "Trocar foto" : "Adicionar foto (opcional)"}
            </button>
            {temFoto && (
              <button type="button" onClick={() => setNovaFoto(null)} className="text-cinza-escuro">
                Remover
              </button>
            )}
          </div>
          <input
            ref={seletorFoto}
            type="file"
            accept="image/*"
            hidden
            onChange={(evento) => {
              const arquivo = evento.target.files?.[0];
              if (arquivo) setNovaFoto(arquivo);
              evento.target.value = "";
            }}
          />
        </div>

        <CampoTexto
          rotulo="Nome"
          value={nome}
          onChange={(evento) => {
            setNome(evento.target.value);
            setErroNome(undefined);
          }}
          maxLength={100}
          placeholder="Ex.: Pizzaria do Zé"
          erro={erroNome}
        />
        <Alternador rotulo="Tipo" opcoes={OPCOES_TIPO} valor={tipo} aoMudar={setTipo} />
        <CampoTexto
          rotulo="Telefone"
          opcional
          type="tel"
          inputMode="numeric"
          value={telefone}
          onChange={(evento) => setTelefone(formatarTelefone(evento.target.value))}
          placeholder="(35) 9 9999-8888"
        />
        <CampoTexto
          rotulo="Observação"
          opcional
          value={observacao}
          onChange={(evento) => setObservacao(evento.target.value)}
          placeholder="Ex.: acerto toda segunda-feira"
        />
      </div>

      <div className="sticky bottom-0 mt-auto flex gap-2.5 bg-fundo px-5 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+26px)]">
        {cliente && (
          <Botao variante="perigo" onClick={() => setConfirmando(true)} disabled={salvar.isPending}>
            Excluir
          </Botao>
        )}
        <Botao type="submit" disabled={salvar.isPending}>
          {salvar.isPending ? "Salvando..." : cliente ? "Salvar alterações" : "Salvar cliente"}
        </Botao>
      </div>

      {confirmando && cliente && (
        <ConfirmarExclusao
          titulo="Excluir este cliente?"
          mensagem={`${cliente.nome} será removido do seu cadastro.`}
          excluindo={excluir.isPending}
          aoCancelar={() => setConfirmando(false)}
          aoConfirmar={confirmarExclusao}
        />
      )}
    </form>
  );
}

/** URL local para pré-visualizar o arquivo escolhido, liberada quando ele muda. */
function useObjectUrl(arquivo: File | null | undefined) {
  const url = useMemo(() => (arquivo ? URL.createObjectURL(arquivo) : null), [arquivo]);
  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url);
  }, [url]);
  return url;
}
