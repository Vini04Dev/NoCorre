-- Bucket das fotos de clientes.
--
-- Privado: a foto só abre por URL assinada (temporária), gerada para o dono.
-- Cada arquivo fica em "<usuario_id>/<arquivo>", e as políticas usam essa
-- primeira pasta para garantir que cada pessoa só mexe nas próprias fotos.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos-clientes', 'fotos-clientes', false, 1048576, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "fotos_clientes_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'fotos-clientes' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "fotos_clientes_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'fotos-clientes' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "fotos_clientes_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'fotos-clientes' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'fotos-clientes' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "fotos_clientes_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'fotos-clientes' and (storage.foldername(name))[1] = (select auth.uid())::text);
