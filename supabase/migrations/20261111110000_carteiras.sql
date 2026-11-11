-- Carteiras (recurso Pro): separar o dinheiro por onde ele está — conta do
-- banco, dinheiro em mão, conta do salário — cada uma com o próprio saldo.
--
-- Para não dar trabalho a mais em cada lançamento:
-- - carteira_id em receitas/despesas é opcional; o que não tem carteira conta na
--   carteira principal (padrao = true). Lançamentos antigos não precisam mudar.
-- - transferências registram o dinheiro que muda de carteira (ex.: saque).
-- Para desfazer: veja docs/der-fisico.md, seção Carteiras.

create table public.carteiras (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome varchar(40) not null check (length(trim(nome)) > 0),
  cor public.cor_evento not null default 'azul',
  saldo_inicial numeric(10, 2) not null default 0,
  padrao boolean not null default false,
  arquivada boolean not null default false,
  created_at timestamptz not null default now(),
  unique (usuario_id, nome),
  -- Alvo das FKs compostas: a carteira de um lançamento é sempre do mesmo dono.
  unique (id, usuario_id)
);

-- No máximo uma carteira principal por pessoa.
create unique index carteiras_uma_principal on public.carteiras (usuario_id) where padrao;

alter table public.receitas add column carteira_id uuid;
alter table public.despesas add column carteira_id uuid;

-- "no action": não deixa excluir carteira com lançamentos (arquivar resolve),
-- mas a exclusão da conta continua apagando tudo em cascata.
alter table public.receitas
  add foreign key (carteira_id, usuario_id) references public.carteiras (id, usuario_id) on delete no action;
alter table public.despesas
  add foreign key (carteira_id, usuario_id) references public.carteiras (id, usuario_id) on delete no action;

create index receitas_carteira on public.receitas (carteira_id) where carteira_id is not null;
create index despesas_carteira on public.despesas (carteira_id) where carteira_id is not null;

create table public.transferencias (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  origem_id uuid not null,
  destino_id uuid not null,
  valor numeric(10, 2) not null check (valor > 0),
  data_hora timestamptz not null default now(),
  observacao varchar(120),
  created_at timestamptz not null default now(),
  check (origem_id <> destino_id),
  foreign key (origem_id, usuario_id) references public.carteiras (id, usuario_id) on delete cascade,
  foreign key (destino_id, usuario_id) references public.carteiras (id, usuario_id) on delete cascade
);

create index transferencias_usuario on public.transferencias (usuario_id, data_hora);

-- RLS: ler e apagar o que é seu; criar e editar só sendo Pro (eh_pro()).
alter table public.carteiras enable row level security;
alter table public.transferencias enable row level security;

revoke all on public.carteiras, public.transferencias from anon, authenticated;
grant select, insert, update, delete on public.carteiras, public.transferencias to authenticated;

create policy "carteiras: ler as próprias" on public.carteiras
  for select to authenticated using ((select auth.uid()) = usuario_id);
create policy "carteiras: criar sendo pro" on public.carteiras
  for insert to authenticated with check ((select auth.uid()) = usuario_id and (select public.eh_pro()));
create policy "carteiras: editar sendo pro" on public.carteiras
  for update to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id and (select public.eh_pro()));
create policy "carteiras: excluir as próprias" on public.carteiras
  for delete to authenticated using ((select auth.uid()) = usuario_id);

create policy "transferencias: ler as próprias" on public.transferencias
  for select to authenticated using ((select auth.uid()) = usuario_id);
create policy "transferencias: criar sendo pro" on public.transferencias
  for insert to authenticated with check ((select auth.uid()) = usuario_id and (select public.eh_pro()));
create policy "transferencias: editar sendo pro" on public.transferencias
  for update to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id and (select public.eh_pro()));
create policy "transferencias: excluir as próprias" on public.transferencias
  for delete to authenticated using ((select auth.uid()) = usuario_id);

-- Saldo de cada carteira da pessoa logada. security invoker: roda com a RLS de
-- quem chamou, então só soma as próprias linhas. Regra 1: receitas só contam
-- pagas. Lançamento sem carteira conta na principal (ou na mais antiga, se
-- nenhuma estiver marcada).
create function public.saldos_carteiras()
returns table (carteira_id uuid, saldo numeric)
language sql
stable
security invoker
set search_path = ''
as $$
  with principal as (
    select c.id from public.carteiras c
    where c.usuario_id = auth.uid()
    order by c.padrao desc, c.created_at
    limit 1
  ),
  movimentos as (
    select coalesce(r.carteira_id, (select id from principal)) as carteira, r.valor_total as valor
      from public.receitas r where r.status_pagamento = 'pago'
    union all
    select coalesce(d.carteira_id, (select id from principal)), -d.valor_total from public.despesas d
    union all
    select t.destino_id, t.valor from public.transferencias t
    union all
    select t.origem_id, -t.valor from public.transferencias t
  )
  select c.id, c.saldo_inicial + coalesce(sum(m.valor), 0)
  from public.carteiras c
  left join movimentos m on m.carteira = c.id
  where c.usuario_id = auth.uid()
  group by c.id, c.saldo_inicial;
$$;

revoke all on function public.saldos_carteiras() from public, anon;
grant execute on function public.saldos_carteiras() to authenticated;
