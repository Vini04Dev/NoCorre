-- Contas fixas: despesas que se repetem todo mês no mesmo dia (plano de
-- celular, internet, assinatura, parcela). O app avisa no Início quando uma
-- está para vencer e ainda não foi paga no mês.
--
-- Nada é lançado sozinho: o pagamento continua sendo uma despesa comum, que
-- a pessoa confirma com um toque. A despesa guarda de qual conta fixa veio
-- (conta_fixa_id), e é assim que o app sabe se a conta do mês já foi paga.
-- Débito automático (automatico = true) só muda o aviso: em vez de "vai
-- vencer", pergunta se o débito já caiu.
-- Para desfazer: veja docs/der-fisico.md, seção Contas fixas.

create table public.contas_fixas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  descricao varchar(60) not null check (length(trim(descricao)) > 0),
  -- Categoria da despesa lançada no pagamento (mesmo varchar livre de despesas.tipo).
  tipo varchar(50) not null check (length(trim(tipo)) > 0),
  valor numeric(10, 2) not null check (valor > 0),
  -- Dia 29, 30 ou 31 em mês mais curto vence no último dia do mês (regra do app).
  dia_vencimento smallint not null check (dia_vencimento between 1 and 31),
  -- Carteira de onde o pagamento sai (Pro). Sem carteira: a principal.
  carteira_id uuid,
  automatico boolean not null default false,
  ativa boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, usuario_id),
  -- Carteira excluída: a conta fixa continua e passa a sair da principal.
  foreign key (carteira_id, usuario_id) references public.carteiras (id, usuario_id) on delete set null (carteira_id)
);

create index contas_fixas_usuario on public.contas_fixas (usuario_id);

-- De qual conta fixa veio a despesa. Conta fixa excluída: a despesa fica no histórico.
alter table public.despesas
  add column conta_fixa_id uuid,
  add foreign key (conta_fixa_id, usuario_id)
    references public.contas_fixas (id, usuario_id) on delete set null (conta_fixa_id);

create index despesas_conta_fixa on public.despesas (conta_fixa_id, data_hora) where conta_fixa_id is not null;

comment on table public.contas_fixas is 'Despesas que se repetem todo mês; avisam no Início perto do vencimento.';
comment on column public.despesas.conta_fixa_id is 'Conta fixa paga por esta despesa (marca a conta do mês como paga).';

alter table public.contas_fixas enable row level security;

revoke all on public.contas_fixas from anon, authenticated;
grant select, insert, update, delete on public.contas_fixas to authenticated;

create policy "contas_fixas: ler as próprias" on public.contas_fixas
  for select to authenticated using ((select auth.uid()) = usuario_id);
create policy "contas_fixas: criar as próprias" on public.contas_fixas
  for insert to authenticated with check ((select auth.uid()) = usuario_id);
create policy "contas_fixas: editar as próprias" on public.contas_fixas
  for update to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);
create policy "contas_fixas: excluir as próprias" on public.contas_fixas
  for delete to authenticated using ((select auth.uid()) = usuario_id);

notify pgrst, 'reload schema';
