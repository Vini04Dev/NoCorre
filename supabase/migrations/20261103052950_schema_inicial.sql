-- Schema inicial do No Corre!
-- Referência completa e decisões em docs/der-fisico.md

-- ============================================================
-- Enums
-- ============================================================

create type public.tipo_cliente as enum ('pessoa_fisica', 'empresa');
create type public.forma_pagamento as enum ('pix', 'dinheiro');
create type public.status_pagamento as enum ('pago', 'pendente');
create type public.tipo_categoria as enum ('receita', 'despesa');
create type public.cor_evento as enum ('amarelo', 'verde', 'vermelho', 'azul', 'roxo', 'cinza');
create type public.parametro_meta as enum ('quantidade', 'receita', 'despesa');
create type public.status_meta as enum ('ativa', 'inativa');

-- ============================================================
-- Tabelas
-- ============================================================

create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome varchar(100) not null check (length(trim(nome)) > 0),
  telefone varchar(20),
  tipo_sanguineo varchar(3)
    check (tipo_sanguineo in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  veiculo varchar(60),
  placa varchar(10),
  created_at timestamptz not null default now()
);

create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome varchar(100) not null check (length(trim(nome)) > 0),
  tipo public.tipo_cliente not null,
  telefone varchar(20),
  foto text,
  observacao text,
  created_at timestamptz not null default now(),
  -- Alvo da FK composta de receitas: garante que o cliente é do mesmo dono.
  unique (id, usuario_id)
);

create table public.receitas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  cliente_id uuid not null,
  data_hora timestamptz not null default now(),
  tipo varchar(50) not null check (length(trim(tipo)) > 0),
  quantidade integer not null default 1 check (quantidade > 0),
  valor_unitario numeric(10, 2) not null check (valor_unitario >= 0),
  valor_total numeric(12, 2) generated always as (quantidade * valor_unitario) stored,
  status_pagamento public.status_pagamento not null default 'pago',
  forma_pagamento public.forma_pagamento,
  observacao text,
  created_at timestamptz not null default now(),
  -- "no action" em vez de "restrict": bloqueia a exclusão de cliente com
  -- receitas, mas deixa a exclusão da conta apagar tudo em cascata, já que a
  -- verificação acontece só no fim do comando.
  foreign key (cliente_id, usuario_id)
    references public.clientes (id, usuario_id) on delete no action
);

create table public.despesas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  data_hora timestamptz not null default now(),
  tipo varchar(50) not null check (length(trim(tipo)) > 0),
  quantidade integer not null default 1 check (quantidade > 0),
  valor_unitario numeric(10, 2) not null check (valor_unitario >= 0),
  valor_total numeric(12, 2) generated always as (quantidade * valor_unitario) stored,
  observacao text,
  created_at timestamptz not null default now()
);

create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome varchar(50) not null check (length(trim(nome)) > 0),
  tipo public.tipo_categoria not null,
  created_at timestamptz not null default now()
);

create table public.eventos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  data_hora_inicial timestamptz not null,
  data_hora_final timestamptz not null,
  descricao varchar(200) not null check (length(trim(descricao)) > 0),
  cor public.cor_evento not null default 'amarelo',
  created_at timestamptz not null default now(),
  check (data_hora_final >= data_hora_inicial)
);

create table public.metas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome varchar(100) not null check (length(trim(nome)) > 0),
  parametro public.parametro_meta not null,
  valor_alvo numeric(12, 2) not null check (valor_alvo > 0),
  data_inicio date not null,
  data_fim date not null,
  status public.status_meta not null default 'ativa',
  created_at timestamptz not null default now(),
  check (data_fim >= data_inicio)
);

-- ============================================================
-- Índices
-- ============================================================

-- Extrato, Home e Relatórios sempre filtram por dono e período.
create index receitas_usuario_data_idx on public.receitas (usuario_id, data_hora);
create index despesas_usuario_data_idx on public.despesas (usuario_id, data_hora);
create index eventos_usuario_inicio_idx on public.eventos (usuario_id, data_hora_inicial);

-- Postgres não indexa FKs sozinho; sem este índice, excluir um cliente
-- varre a tabela de receitas inteira.
create index receitas_cliente_idx on public.receitas (cliente_id, usuario_id);

create index clientes_usuario_idx on public.clientes (usuario_id);
create index metas_usuario_idx on public.metas (usuario_id);

-- Impede "Lanche" e "lanche" duplicados no mesmo tipo.
create unique index categorias_nome_unico_idx
  on public.categorias (usuario_id, tipo, lower(nome));

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.perfis enable row level security;
alter table public.clientes enable row level security;
alter table public.receitas enable row level security;
alter table public.despesas enable row level security;
alter table public.categorias enable row level security;
alter table public.eventos enable row level security;
alter table public.metas enable row level security;

-- Visitante sem login não acessa nada; só usuários autenticados, e cada um
-- apenas as próprias linhas (garantido pelas políticas abaixo).
revoke all on public.perfis, public.clientes, public.receitas, public.despesas,
  public.categorias, public.eventos, public.metas from anon;

grant select, update on public.perfis to authenticated;
grant select, insert, update, delete on public.clientes, public.receitas,
  public.despesas, public.categorias, public.eventos, public.metas to authenticated;

-- perfis: criado pelo trigger e apagado junto com a conta, por isso não há
-- políticas de insert e delete.
create policy "perfis: ler o próprio" on public.perfis
  for select to authenticated using ((select auth.uid()) = id);
create policy "perfis: editar o próprio" on public.perfis
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Demais tabelas: as mesmas quatro políticas, sempre por usuario_id.
-- (select auth.uid()) é avaliado uma vez por consulta, não uma vez por linha.
create policy "clientes: ler os próprios" on public.clientes
  for select to authenticated using ((select auth.uid()) = usuario_id);
create policy "clientes: criar os próprios" on public.clientes
  for insert to authenticated with check ((select auth.uid()) = usuario_id);
create policy "clientes: editar os próprios" on public.clientes
  for update to authenticated
  using ((select auth.uid()) = usuario_id) with check ((select auth.uid()) = usuario_id);
create policy "clientes: excluir os próprios" on public.clientes
  for delete to authenticated using ((select auth.uid()) = usuario_id);

create policy "receitas: ler as próprias" on public.receitas
  for select to authenticated using ((select auth.uid()) = usuario_id);
create policy "receitas: criar as próprias" on public.receitas
  for insert to authenticated with check ((select auth.uid()) = usuario_id);
create policy "receitas: editar as próprias" on public.receitas
  for update to authenticated
  using ((select auth.uid()) = usuario_id) with check ((select auth.uid()) = usuario_id);
create policy "receitas: excluir as próprias" on public.receitas
  for delete to authenticated using ((select auth.uid()) = usuario_id);

create policy "despesas: ler as próprias" on public.despesas
  for select to authenticated using ((select auth.uid()) = usuario_id);
create policy "despesas: criar as próprias" on public.despesas
  for insert to authenticated with check ((select auth.uid()) = usuario_id);
create policy "despesas: editar as próprias" on public.despesas
  for update to authenticated
  using ((select auth.uid()) = usuario_id) with check ((select auth.uid()) = usuario_id);
create policy "despesas: excluir as próprias" on public.despesas
  for delete to authenticated using ((select auth.uid()) = usuario_id);

create policy "categorias: ler as próprias" on public.categorias
  for select to authenticated using ((select auth.uid()) = usuario_id);
create policy "categorias: criar as próprias" on public.categorias
  for insert to authenticated with check ((select auth.uid()) = usuario_id);
create policy "categorias: editar as próprias" on public.categorias
  for update to authenticated
  using ((select auth.uid()) = usuario_id) with check ((select auth.uid()) = usuario_id);
create policy "categorias: excluir as próprias" on public.categorias
  for delete to authenticated using ((select auth.uid()) = usuario_id);

create policy "eventos: ler os próprios" on public.eventos
  for select to authenticated using ((select auth.uid()) = usuario_id);
create policy "eventos: criar os próprios" on public.eventos
  for insert to authenticated with check ((select auth.uid()) = usuario_id);
create policy "eventos: editar os próprios" on public.eventos
  for update to authenticated
  using ((select auth.uid()) = usuario_id) with check ((select auth.uid()) = usuario_id);
create policy "eventos: excluir os próprios" on public.eventos
  for delete to authenticated using ((select auth.uid()) = usuario_id);

create policy "metas: ler as próprias" on public.metas
  for select to authenticated using ((select auth.uid()) = usuario_id);
create policy "metas: criar as próprias" on public.metas
  for insert to authenticated with check ((select auth.uid()) = usuario_id);
create policy "metas: editar as próprias" on public.metas
  for update to authenticated
  using ((select auth.uid()) = usuario_id) with check ((select auth.uid()) = usuario_id);
create policy "metas: excluir as próprias" on public.metas
  for delete to authenticated using ((select auth.uid()) = usuario_id);

-- ============================================================
-- Perfil automático no cadastro
-- ============================================================

-- security definer: roda com permissão do dono da função, porque quem
-- dispara o trigger é o Supabase Auth, não o usuário. search_path vazio
-- obriga nomes completos (public.perfis) e evita sequestro de schema.
create function public.criar_perfil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfis (id, nome)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'nome'), ''),
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

revoke execute on function public.criar_perfil() from public, anon, authenticated;

create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil();
