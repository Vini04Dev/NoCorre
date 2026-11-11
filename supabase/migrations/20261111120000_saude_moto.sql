-- Saúde da moto (recurso Pro): quilometragem e manutenção por km.
--
-- Pensado para dar pouco trabalho: a pessoa informa o odômetro de vez em
-- quando (ou soma os km rodados) e marca quando fez uma troca. O app calcula
-- quanto falta para cada manutenção e avisa no Início.
-- Para desfazer: veja docs/der-fisico.md, seção Saúde da moto.

-- Leituras do odômetro. A quilometragem atual é a leitura mais recente.
create table public.moto_quilometragem (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  km integer not null check (km >= 0 and km <= 2000000),
  registrado_em timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index moto_quilometragem_usuario on public.moto_quilometragem (usuario_id, registrado_em desc);

-- Itens de manutenção acompanhados (óleo, relação, pneus, freios...), cada um
-- com o intervalo que a pessoa usa e o km da última troca.
create table public.moto_componentes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tipo varchar(30) not null check (length(trim(tipo)) > 0),
  nome varchar(50) not null check (length(trim(nome)) > 0),
  intervalo_km integer not null check (intervalo_km > 0 and intervalo_km <= 200000),
  km_ultima_troca integer not null default 0 check (km_ultima_troca >= 0),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  unique (usuario_id, tipo)
);

alter table public.moto_quilometragem enable row level security;
alter table public.moto_componentes enable row level security;

revoke all on public.moto_quilometragem, public.moto_componentes from anon, authenticated;
grant select, insert, update, delete on public.moto_quilometragem, public.moto_componentes to authenticated;

-- Ler e apagar o que é seu; criar e editar só sendo Pro.
create policy "moto_quilometragem: ler as próprias" on public.moto_quilometragem
  for select to authenticated using ((select auth.uid()) = usuario_id);
create policy "moto_quilometragem: criar sendo pro" on public.moto_quilometragem
  for insert to authenticated with check ((select auth.uid()) = usuario_id and (select public.eh_pro()));
create policy "moto_quilometragem: editar sendo pro" on public.moto_quilometragem
  for update to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id and (select public.eh_pro()));
create policy "moto_quilometragem: excluir as próprias" on public.moto_quilometragem
  for delete to authenticated using ((select auth.uid()) = usuario_id);

create policy "moto_componentes: ler os próprios" on public.moto_componentes
  for select to authenticated using ((select auth.uid()) = usuario_id);
create policy "moto_componentes: criar sendo pro" on public.moto_componentes
  for insert to authenticated with check ((select auth.uid()) = usuario_id and (select public.eh_pro()));
create policy "moto_componentes: editar sendo pro" on public.moto_componentes
  for update to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id and (select public.eh_pro()));
create policy "moto_componentes: excluir os próprios" on public.moto_componentes
  for delete to authenticated using ((select auth.uid()) = usuario_id);
