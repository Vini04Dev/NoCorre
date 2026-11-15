-- O painel do sistema (servidor, Secret key = service_role) liga e desliga o
-- Pro de cada pessoa. Neste projeto as tabelas não dão acesso automático ao
-- service_role, então a permissão vai só nas colunas necessárias.
grant select (id, plano) on public.perfis to service_role;
grant update (plano) on public.perfis to service_role;
