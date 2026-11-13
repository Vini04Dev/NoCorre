-- Três ajustes para o dinheiro fazer sentido para quem tem mais de uma fonte
-- e mais de um destino (pesquisa e conversa com o autor, nov/2026):
--
-- 1. Despesa "do corre" ou "pessoal". O Início responde "quanto o corre
--    rendeu": gasolina e óleo pesam, a parcela do notebook e o mercado não.
--    O padrão vem da categoria (categorias padrão no código; as criadas pela
--    pessoa guardam o próprio padrão) e cada despesa pode trocar.
-- 2. Conta fixa parcelada: "12x de R$ 386,08, já paguei 4". A conta se
--    encerra sozinha depois da última parcela.
-- 3. Entradas que não são do corre (bolsa, salário, ajuda da família): entram
--    na carteira, mas não contam como receita do trabalho nem como entrega.
--
-- Tudo só acrescenta: código antigo continua funcionando.
-- Para desfazer: veja docs/der-fisico.md, seção Do corre, parcelas e entradas.

-- 1. Do corre ou pessoal --------------------------------------------------

alter table public.despesas add column do_corre boolean not null default true;
alter table public.categorias add column do_corre boolean not null default false;

comment on column public.despesas.do_corre is 'true: custo do trabalho (entra no saldo do corre); false: gasto pessoal.';
comment on column public.categorias.do_corre is 'Padrão das despesas desta categoria (só vale para categorias de despesa).';

-- Despesas antigas: pessoal quando a categoria é claramente pessoal; o resto
-- continua contando no saldo, como sempre contou.
update public.despesas
  set do_corre = false
  where conta_fixa_id is not null
     or meta_id is not null
     or tipo in ('Contas', 'Mercado', 'Saúde', 'Lazer', 'Casa', 'Assinaturas', 'Educação');

-- 2. Contas parceladas ------------------------------------------------------

alter table public.contas_fixas
  add column parcelas_total smallint check (parcelas_total between 2 and 120),
  add column parcelas_antes smallint not null default 0 check (parcelas_antes >= 0);

alter table public.contas_fixas
  add constraint contas_fixas_parcelas_antes_menor check (parcelas_total is null or parcelas_antes < parcelas_total);

comment on column public.contas_fixas.parcelas_total is 'Número de parcelas; vazio = conta sem fim (mensal).';
comment on column public.contas_fixas.parcelas_antes is 'Parcelas pagas antes de cadastrar no app.';

-- 3. Entradas que não são do corre ----------------------------------------

create table public.entradas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  descricao varchar(60) not null check (length(trim(descricao)) > 0),
  -- Sugestões no app: Bolsa, Salário, Benefício, Ajuda da família, Venda, Outro.
  tipo varchar(50) not null check (length(trim(tipo)) > 0),
  valor numeric(10, 2) not null check (valor > 0),
  data_hora timestamptz not null default now(),
  -- Sem carteira: conta na principal (mesma regra de receitas e despesas).
  carteira_id uuid,
  created_at timestamptz not null default now(),
  foreign key (carteira_id, usuario_id) references public.carteiras (id, usuario_id) on delete no action
);

create index entradas_usuario on public.entradas (usuario_id, data_hora);

comment on table public.entradas is 'Dinheiro que entra mas não é do corre (bolsa, salário, ajuda). Fora do saldo do corre.';

alter table public.entradas enable row level security;

revoke all on public.entradas from anon, authenticated;
grant select, insert, update, delete on public.entradas to authenticated;

create policy "entradas: ler as próprias" on public.entradas
  for select to authenticated using ((select auth.uid()) = usuario_id);
create policy "entradas: criar as próprias" on public.entradas
  for insert to authenticated with check ((select auth.uid()) = usuario_id);
create policy "entradas: editar as próprias" on public.entradas
  for update to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);
create policy "entradas: excluir as próprias" on public.entradas
  for delete to authenticated using ((select auth.uid()) = usuario_id);

-- O saldo das carteiras passa a somar as entradas.
create or replace function public.saldos_carteiras()
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
    select coalesce(e.carteira_id, (select id from principal)), e.valor from public.entradas e
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

notify pgrst, 'reload schema';
