"use client";

import { useState } from "react";
import { BloqueioPro } from "@/components/pro/BloqueioPro";
import { SeloPro } from "@/components/pro/SeloPro";
import { AvisoErro } from "@/components/ui/AvisoErro";
import { Botao } from "@/components/ui/Botao";
import { CabecalhoTela } from "@/components/ui/CabecalhoTela";
import { CampoTexto } from "@/components/ui/CampoTexto";
import { PainelInferior } from "@/components/ui/PainelInferior";
import { useComponentes, useConfigurarMoto, useQuilometragem, useRegistrarKm, useSalvarComponente, type Componente } from "@/hooks/useMoto";
import { usePerfil } from "@/hooks/usePerfil";
import { usePlano } from "@/hooks/usePlano";
import {
  COR_SITUACAO,
  desgaste,
  ehCg160,
  ehScooter,
  formatarKm,
  parteDo,
  ROTULO_SITUACAO,
  type ParteDesenho,
  type Situacao,
} from "@/lib/moto";
import { CarrosselMoto } from "./CarrosselMoto";
import { DesenhoMoto } from "./DesenhoMoto";
import { type CalorParte, MapaCalorMoto } from "./MapaCalorMoto";

const somenteNumeros = (texto: string) => texto.replace(/\D/g, "").slice(0, 7);

/** Primeira vez: só pede o odômetro; os itens padrão são criados contando a partir daí. */
function Configurar() {
  const configurar = useConfigurarMoto();
  const [km, setKm] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (km) configurar.mutate(Number(km));
      }}
      className="flex flex-col gap-3 rounded-[14px] border border-black/8 bg-white p-4 shadow-cartao"
    >
      <p className="text-sm font-bold">Quantos km a moto está marcando agora?</p>
      <p className="text-xs text-cinza-escuro">
        Olhe o odômetro no painel. O app começa a contar óleo, relação, pneus e freios a partir daqui; depois você
        ajusta a última troca de cada um, se lembrar.
      </p>
      <AvisoErro mensagem={configurar.error?.message} />
      <CampoTexto rotulo="Quilometragem atual" inputMode="numeric" value={km} onChange={(e) => setKm(somenteNumeros(e.target.value))} placeholder="Ex.: 32500" />
      <Botao type="submit" disabled={!km || configurar.isPending}>
        {configurar.isPending ? "Salvando..." : "Começar a acompanhar"}
      </Botao>
    </form>
  );
}

/** Atualizar o odômetro (valor do painel) ou somar os km rodados desde a última vez. */
function PainelKm({ atual, aoFechar }: { atual: number; aoFechar: () => void }) {
  const registrar = useRegistrarKm();
  const [modo, setModo] = useState<"somar" | "odometro">("somar");
  const [valor, setValor] = useState("");
  const novo = modo === "somar" ? atual + Number(valor || 0) : Number(valor || 0);
  const invalido = !valor || (modo === "odometro" && novo < atual);

  return (
    <PainelInferior
      idTitulo="km-titulo"
      aoFechar={aoFechar}
      aoEnviar={(e) => {
        e.preventDefault();
        if (!invalido) registrar.mutate(novo, { onSuccess: aoFechar });
      }}
    >
      <h2 id="km-titulo" className="text-lg font-extrabold">
        Atualizar quilometragem
      </h2>
      <div className="flex rounded-[10px] bg-cinza-fundo p-1">
        {(["somar", "odometro"] as const).map((opcao) => (
          <button
            key={opcao}
            type="button"
            onClick={() => setModo(opcao)}
            className={`flex-1 rounded-lg py-1.5 text-[13px] ${modo === opcao ? "bg-white font-semibold shadow-cartao" : ""}`}
          >
            {opcao === "somar" ? "Somar km rodados" : "Valor do odômetro"}
          </button>
        ))}
      </div>
      <AvisoErro mensagem={registrar.error?.message} />
      <CampoTexto
        rotulo={modo === "somar" ? "Quantos km você rodou?" : "Quanto marca o painel?"}
        inputMode="numeric"
        value={valor}
        onChange={(e) => setValor(somenteNumeros(e.target.value))}
        placeholder={modo === "somar" ? "Ex.: 120" : String(atual)}
        erro={modo === "odometro" && valor && novo < atual ? `O odômetro não volta: o último foi ${formatarKm(atual)}.` : undefined}
      />
      <p className="text-xs text-cinza-escuro">
        Fica: <b>{formatarKm(novo)}</b>
      </p>
      <Botao type="submit" disabled={invalido || registrar.isPending}>
        {registrar.isPending ? "Salvando..." : "Salvar"}
      </Botao>
    </PainelInferior>
  );
}

/** Editar um item: marcar a troca de agora, corrigir a última troca ou mudar o intervalo. */
function PainelComponente({ componente, kmAtual, aoFechar }: { componente: Componente; kmAtual: number; aoFechar: () => void }) {
  const salvar = useSalvarComponente();
  const [intervalo, setIntervalo] = useState(String(componente.intervalo_km));
  const [ultima, setUltima] = useState(String(componente.km_ultima_troca));

  return (
    <PainelInferior
      idTitulo="componente-titulo"
      aoFechar={aoFechar}
      aoEnviar={(e) => {
        e.preventDefault();
        salvar.mutate(
          { id: componente.id, dados: { intervalo_km: Number(intervalo) || componente.intervalo_km, km_ultima_troca: Number(ultima) } },
          { onSuccess: aoFechar },
        );
      }}
    >
      <h2 id="componente-titulo" className="text-lg font-extrabold">
        {componente.nome}
      </h2>
      <AvisoErro mensagem={salvar.error?.message} />
      <Botao
        type="button"
        variante="contorno"
        disabled={salvar.isPending}
        onClick={() => salvar.mutate({ id: componente.id, dados: { km_ultima_troca: kmAtual } }, { onSuccess: aoFechar })}
      >
        Troquei agora ({formatarKm(kmAtual)})
      </Botao>
      <div className="grid grid-cols-2 gap-2.5">
        <CampoTexto rotulo="Trocar a cada (km)" inputMode="numeric" value={intervalo} onChange={(e) => setIntervalo(somenteNumeros(e.target.value))} />
        <CampoTexto rotulo="Última troca (km)" inputMode="numeric" value={ultima} onChange={(e) => setUltima(somenteNumeros(e.target.value))} />
      </div>
      <Botao type="submit" disabled={salvar.isPending}>
        {salvar.isPending ? "Salvando..." : "Salvar"}
      </Botao>
    </PainelInferior>
  );
}

/**
 * Saúde da moto (Pro): desenho com as peças coloridas pelo desgaste, odômetro
 * e a lista de manutenções com quanto falta para cada troca.
 */
export function TelaMoto() {
  const { ehPro, carregando } = usePlano();
  const { data: perfil } = usePerfil();
  const quilometragem = useQuilometragem(ehPro);
  const componentes = useComponentes(ehPro);
  const [painel, setPainel] = useState<{ tipo: "km" } | { tipo: "componente"; componente: Componente } | null>(null);

  const cabecalho = <CabecalhoTela titulo="Saúde da moto" voltarPara="/perfil" tituloGrande acao={<SeloPro />} />;
  const casca = (conteudo: React.ReactNode) => (
    <main className="flex flex-col gap-4 px-[17px] pt-[calc(env(safe-area-inset-top)+12px)] pb-6 lg:max-w-3xl lg:px-0 lg:pt-2">
      {cabecalho}
      {conteudo}
    </main>
  );

  if (carregando) return casca(<p className="text-center text-[13px] text-cinza-escuro">Carregando...</p>);
  if (!ehPro) return casca(<BloqueioPro recurso="moto" />);
  if (quilometragem.isPending || componentes.isPending) return casca(<p className="text-center text-[13px] text-cinza-escuro">Carregando...</p>);

  const kmAtual = quilometragem.data?.atual;
  const itens = (componentes.data ?? []).filter((c) => c.ativo);
  if (kmAtual == null || itens.length === 0) return casca(<Configurar />);

  const calculados = itens.map((c) => ({ componente: c, ...desgaste(kmAtual, c.km_ultima_troca, c.intervalo_km) }));
  // Duas peças na mesma parte (ex.: freio da frente e de trás): vale a mais gasta.
  const calor: Partial<Record<ParteDesenho, CalorParte>> = {};
  for (const item of calculados) {
    const parte = parteDo(item.componente.tipo);
    if (parte && item.fracao >= (calor[parte]?.fracao ?? -1)) calor[parte] = { situacao: item.situacao, fracao: item.fracao };
  }
  const partes: Partial<Record<ParteDesenho, Situacao>> = Object.fromEntries(
    Object.entries(calor).map(([parte, c]) => [parte, c.situacao]),
  );
  const descricaoDesenho = calculados.map((i) => `${i.componente.nome}: ${ROTULO_SITUACAO[i.situacao]}`).join("; ");
  const urgentes = calculados.filter((i) => i.situacao === "trocar" || i.situacao === "vencido").length;
  const modelo = perfil?.veiculo ?? "Sua moto";

  return casca(
    <>
      <section className="flex flex-col items-center gap-2 rounded-[14px] border border-black/8 bg-white px-4 pt-4 pb-3 shadow-cartao">
        <div className="flex w-full items-start justify-between">
          <span className="flex flex-col">
            <span className="text-sm font-bold">{modelo}</span>
            <span className="text-[11px] text-cinza-escuro">
              {urgentes ? `${urgentes} ${urgentes > 1 ? "itens precisam" : "item precisa"} de troca` : "Tudo em dia"}
            </span>
          </span>
          <button type="button" onClick={() => setPainel({ tipo: "km" })} className="flex flex-col items-end">
            <span className="text-[11px] text-cinza-escuro">Odômetro</span>
            <span className="text-lg font-extrabold">{formatarKm(kmAtual)}</span>
          </button>
        </div>
        {ehScooter(perfil?.veiculo) ? (
          <DesenhoMoto partes={partes} scooter descricao={descricaoDesenho} />
        ) : ehCg160(perfil?.veiculo) ? (
          <CarrosselMoto partes={calor} descricao={descricaoDesenho} />
        ) : (
          <MapaCalorMoto partes={calor} descricao={descricaoDesenho} />
        )}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-cinza-escuro">
          {(Object.keys(COR_SITUACAO) as Situacao[]).map((s) => (
            <span key={s} className="flex items-center gap-1">
              <span className="size-2.5 rounded-full" style={{ background: COR_SITUACAO[s] }} />
              {ROTULO_SITUACAO[s]}
            </span>
          ))}
        </div>
      </section>

      <Botao type="button" onClick={() => setPainel({ tipo: "km" })}>
        Atualizar quilometragem
      </Botao>

      <section className="flex flex-col gap-1.5">
        <h2 className="text-[11px] font-semibold tracking-[0.66px] text-cinza">MANUTENÇÃO · TOQUE PARA AJUSTAR</h2>
        <ul className="flex flex-col gap-2">
          {calculados.map(({ componente, fracao, faltam, situacao }) => (
            <li key={componente.id}>
              <button
                type="button"
                onClick={() => setPainel({ tipo: "componente", componente })}
                className="flex w-full flex-col gap-1.5 rounded-[12px] border border-black/8 bg-white px-3.5 py-3 text-left shadow-cartao"
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] font-semibold">{componente.nome}</span>
                  <span className="text-[11px] font-semibold" style={{ color: COR_SITUACAO[situacao] }}>
                    {ROTULO_SITUACAO[situacao]}
                  </span>
                </span>
                <span className="h-2 overflow-hidden rounded-full bg-cinza-fundo">
                  <span
                    className="block h-full rounded-full transition-[width] duration-500"
                    style={{ width: `${Math.min(fracao, 1) * 100}%`, background: COR_SITUACAO[situacao] }}
                  />
                </span>
                <span className="text-[11px] text-cinza-escuro">
                  {faltam >= 0 ? `Faltam ${formatarKm(faltam)}` : `Passou ${formatarKm(-faltam)}`} · troca a cada{" "}
                  {formatarKm(componente.intervalo_km)}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="px-2 text-center text-[11px] text-cinza-escuro">
          Intervalos sugeridos para uso de entrega. Ajuste cada um do jeito que você costuma trocar.
        </p>
      </section>

      {painel?.tipo === "km" && <PainelKm atual={kmAtual} aoFechar={() => setPainel(null)} />}
      {painel?.tipo === "componente" && (
        <PainelComponente componente={painel.componente} kmAtual={kmAtual} aoFechar={() => setPainel(null)} />
      )}
    </>,
  );
}
