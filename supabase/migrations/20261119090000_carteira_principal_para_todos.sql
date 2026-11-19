-- Toda conta tem uma carteira principal, sendo Pro ou não.
--
-- Antes, só quem criava carteiras (Pro) tinha uma. Quem não é Pro lançava sem
-- carteira, e ao virar Pro precisava montar tudo do zero, o que confundia.
-- Agora a principal já existe para todo mundo: os lançamentos sem carteira
-- continuam contando nela (mesma regra de saldos_carteiras), e criar outras
-- carteiras, transferir e editar continua sendo do Pro (RLS sem mudança).

-- 1. Quem já tem carteiras ativas, mas nenhuma marcada como principal: a mais
--    antiga vira a principal (é a que o app já tratava como principal).
update public.carteiras c
set padrao = true
where c.id in (
  select distinct on (usuario_id) id
  from public.carteiras
  where not arquivada
    and usuario_id not in (select usuario_id from public.carteiras where padrao)
  order by usuario_id, created_at
);

-- 2. Quem não tem nenhuma carteira ativa: ganha a "Principal".
insert into public.carteiras (usuario_id, nome, padrao)
select u.id, 'Principal', true
from auth.users u
where not exists (
  select 1 from public.carteiras c where c.usuario_id = u.id and not c.arquivada
)
and not exists (
  select 1 from public.carteiras c where c.usuario_id = u.id and c.padrao
)
on conflict (usuario_id, nome) do nothing;

-- 3. Contas novas: o trigger do cadastro cria o perfil e a principal juntos.
create or replace function public.criar_perfil()
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
  insert into public.carteiras (usuario_id, nome, padrao)
  values (new.id, 'Principal', true);
  return new;
end;
$$;

revoke execute on function public.criar_perfil() from public, anon, authenticated;

-- 4. A principal não pode ser excluída (para trocar, marca-se outra como
--    principal antes). Assim ninguém fica sem ela.
drop policy "carteiras: excluir as próprias" on public.carteiras;
create policy "carteiras: excluir as próprias" on public.carteiras
  for delete to authenticated using ((select auth.uid()) = usuario_id and not padrao);
