-- Módulo de administração: métricas gerais do sistema.
--
-- Quem é ADM não fica no banco: o app compara o e-mail da sessão com a variável
-- ADMIN_EMAIL do servidor (fora do Git), então trocar o ADM é só mudar a
-- variável. Por isso a função não pode ser chamada por usuários comuns: só o
-- papel service_role (Secret key, usada apenas no servidor do app) executa.

-- Devolve só contagens e datas: nenhum valor em dinheiro e nenhum lançamento de ninguém.
create function public.metricas_admin()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  fuso constant text := 'America/Sao_Paulo';
  hoje date := (now() at time zone fuso)::date;
  resultado jsonb;
begin
  select jsonb_build_object(
    'gerado_em', now(),
    'usuarios', (
      select jsonb_build_object(
        'total', count(*),
        'confirmados', count(*) filter (where u.email_confirmed_at is not null),
        'novos_7d', count(*) filter (where u.created_at >= now() - interval '7 days'),
        'novos_30d', count(*) filter (where u.created_at >= now() - interval '30 days'),
        'acessaram_7d', count(*) filter (where u.last_sign_in_at >= now() - interval '7 days'),
        'acessaram_30d', count(*) filter (where u.last_sign_in_at >= now() - interval '30 days')
      )
      from auth.users u
    ),
    'lancaram_7d', (
      select count(distinct l.usuario_id) from (
        select r.usuario_id from public.receitas r where r.created_at >= now() - interval '7 days'
        union all
        select d.usuario_id from public.despesas d where d.created_at >= now() - interval '7 days'
      ) l
    ),
    'registros', jsonb_build_object(
      'receitas', (select count(*) from public.receitas),
      'despesas', (select count(*) from public.despesas),
      'clientes', (select count(*) from public.clientes),
      'categorias', (select count(*) from public.categorias),
      'eventos', (select count(*) from public.eventos),
      'metas', (select count(*) from public.metas)
    ),
    -- Últimos 30 dias, um ponto por dia (dias sem nada entram com zero).
    'por_dia', (
      select jsonb_agg(jsonb_build_object('dia', s.dia, 'cadastros', s.cadastros, 'lancamentos', s.lancamentos) order by s.dia)
      from (
        select
          dia::date as dia,
          (select count(*) from auth.users u where (u.created_at at time zone fuso)::date = dia::date) as cadastros,
          (select count(*) from public.receitas r where (r.created_at at time zone fuso)::date = dia::date)
            + (select count(*) from public.despesas d where (d.created_at at time zone fuso)::date = dia::date) as lancamentos
        from generate_series(hoje - 29, hoje, interval '1 day') as dia
      ) s
    ),
    'armazenamento', jsonb_build_object(
      'banco_bytes', pg_database_size(current_database()),
      'fotos', (
        select jsonb_build_object(
          'arquivos', count(*),
          'bytes', coalesce(sum((o.metadata ->> 'size')::bigint), 0)
        )
        from storage.objects o
        where o.bucket_id in ('fotos-clientes', 'fotos-perfil')
      )
    ),
    -- Só nome e datas, para acompanhar o piloto. E-mail e dados financeiros ficam de fora.
    'ultimos_cadastros', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'nome', c.nome, 'criado_em', c.created_at, 'ultimo_acesso', c.last_sign_in_at
      ) order by c.created_at desc), '[]'::jsonb)
      from (
        select p.nome, u.created_at, u.last_sign_in_at
        from auth.users u join public.perfis p on p.id = u.id
        order by u.created_at desc
        limit 10
      ) c
    )
  ) into resultado;

  return resultado;
end;
$$;

-- Funções novas nascem executáveis por todos; aqui só o service_role chama.
revoke all on function public.metricas_admin() from public, anon, authenticated;
grant execute on function public.metricas_admin() to service_role;
