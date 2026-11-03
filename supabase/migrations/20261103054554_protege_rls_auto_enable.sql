-- rls_auto_enable é criada pelo Supabase quando o projeto é criado com a opção
-- de ligar RLS automaticamente em tabelas novas. Ela roda como gatilho de
-- evento e não deve ficar exposta na API (/rest/v1/rpc/rls_auto_enable).
-- O "if exists" deixa a migration segura para projetos criados sem essa opção.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end;
$$;
