-- Perfil: foto, ano do veículo e exclusão da própria conta.

-- 1. Colunas novas em perfis.
alter table public.perfis
  add column foto text,
  add column ano_veiculo smallint check (ano_veiculo between 1950 and 2100);

comment on column public.perfis.foto is 'Caminho da foto no bucket fotos-perfil (<usuario_id>/<arquivo>).';

-- 2. Bucket privado das fotos de perfil, no mesmo esquema do fotos-clientes:
--    cada pessoa só mexe na pasta com o próprio id.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos-perfil', 'fotos-perfil', false, 1048576, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "fotos_perfil_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'fotos-perfil' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "fotos_perfil_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'fotos-perfil' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "fotos_perfil_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'fotos-perfil' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'fotos-perfil' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "fotos_perfil_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'fotos-perfil' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- 3. Excluir a própria conta.
--    Apagar de auth.users exige privilégio que o usuário logado não tem. Em vez de
--    usar a Secret key num servidor, esta função roda como dona (security definer)
--    e só consegue apagar a linha de quem chamou (auth.uid()). As demais tabelas
--    somem junto pelo "on delete cascade" das FKs para auth.users.
--    As fotos no Storage são apagadas pelo app antes de chamar a função.
create function public.excluir_minha_conta()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Sessão inválida';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.excluir_minha_conta() from public, anon;
grant execute on function public.excluir_minha_conta() to authenticated;
