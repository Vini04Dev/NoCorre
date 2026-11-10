-- Mais métricas no painel de administração: uso real pelas sessões, retenção,
-- quem nunca lançou, pendentes, metas ativas, categorias mais usadas, tamanho
-- das tabelas e quantas pessoas usaram por dia. Continua só com contagens.
-- Os últimos cadastros passam a 20 e trazem o id, usado pela função
-- metricas_usuario_admin() (no fim do arquivo) para o detalhe de cada pessoa.
-- A função é recriada inteira (create or replace); as permissões continuam
-- as mesmas, mas são reaplicadas por garantia.

create or replace function public.metricas_admin()
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
    -- Uso real: a sessão é renovada a cada hora enquanto o app está aberto, então
    -- auth.sessions.updated_at mostra quem usou, mesmo sem fazer login de novo
    -- (last_sign_in_at só muda no login, e no PWA a pessoa fica logada por semanas).
    'uso', (
      with ultimo as (
        select s.user_id, max(s.updated_at) as visto, bool_or(s.user_agent ~* '(iphone|android|mobile)') as celular
        from auth.sessions s
        group by s.user_id
      )
      select jsonb_build_object(
        'ativos_hoje', count(*) filter (where (visto at time zone fuso)::date = hoje),
        'ativos_7d', count(*) filter (where visto >= now() - interval '7 days'),
        'ativos_30d', count(*) filter (where visto >= now() - interval '30 days'),
        'celular_30d', count(*) filter (where visto >= now() - interval '30 days' and celular),
        'computador_30d', count(*) filter (where visto >= now() - interval '30 days' and not celular)
      )
      from ultimo
    ),
    -- De quem tem conta há mais de 7 dias, quantos voltaram a usar na última semana.
    'retencao_7d', (
      select jsonb_build_object(
        'base', count(*),
        'voltaram', count(*) filter (where exists (
          select 1 from auth.sessions s where s.user_id = u.id and s.updated_at >= now() - interval '7 days'
        ))
      )
      from auth.users u
      where u.created_at < now() - interval '7 days'
    ),
    'sem_lancamento', (
      select count(*) from auth.users u
      where not exists (select 1 from public.receitas r where r.usuario_id = u.id)
        and not exists (select 1 from public.despesas d where d.usuario_id = u.id)
    ),
    'receitas_pendentes', (select count(*) from public.receitas where status_pagamento = 'pendente'),
    'metas_ativas', (select count(*) from public.metas where status = 'ativa'),
    -- Categorias mais usadas (contagem de lançamentos, nunca valores).
    'categorias_receita', (
      select coalesce(jsonb_agg(jsonb_build_object('nome', c.tipo, 'total', c.total) order by c.total desc), '[]'::jsonb)
      from (select tipo, count(*) as total from public.receitas group by tipo order by total desc limit 5) c
    ),
    'categorias_despesa', (
      select coalesce(jsonb_agg(jsonb_build_object('nome', c.tipo, 'total', c.total) order by c.total desc), '[]'::jsonb)
      from (select tipo, count(*) as total from public.despesas group by tipo order by total desc limit 5) c
    ),
    'tabelas', (
      select jsonb_agg(jsonb_build_object('nome', t.relname, 'bytes', pg_total_relation_size(t.oid)) order by pg_total_relation_size(t.oid) desc)
      from pg_class t join pg_namespace n on n.oid = t.relnamespace
      where n.nspname = 'public' and t.relkind = 'r'
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
      select jsonb_agg(jsonb_build_object('dia', s.dia, 'cadastros', s.cadastros, 'lancamentos', s.lancamentos, 'usuarios', s.usuarios) order by s.dia)
      from (
        select
          dia::date as dia,
          (select count(*) from auth.users u where (u.created_at at time zone fuso)::date = dia::date) as cadastros,
          (select count(*) from public.receitas r where (r.created_at at time zone fuso)::date = dia::date)
            + (select count(*) from public.despesas d where (d.created_at at time zone fuso)::date = dia::date) as lancamentos,
          (select count(distinct l.usuario_id) from (
            select r.usuario_id from public.receitas r where (r.created_at at time zone fuso)::date = dia::date
            union all
            select d.usuario_id from public.despesas d where (d.created_at at time zone fuso)::date = dia::date
          ) l) as usuarios
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
        'id', c.id, 'nome', c.nome, 'criado_em', c.created_at, 'ultimo_acesso', c.last_sign_in_at
      ) order by c.created_at desc), '[]'::jsonb)
      from (
        select u.id, p.nome, u.created_at, u.last_sign_in_at
        from auth.users u join public.perfis p on p.id = u.id
        order by u.created_at desc
        limit 20
      ) c
    )
  ) into resultado;

  return resultado;
end;
$$;

-- Funções novas nascem executáveis por todos; aqui só o service_role chama.
revoke all on function public.metricas_admin() from public, anon, authenticated;
grant execute on function public.metricas_admin() to service_role;

-- Detalhe de uma pessoa no painel: quantos registros ela tem em cada tabela e
-- quando usou o app. Mesmas regras da função geral: só contagens e datas,
-- nenhum valor em dinheiro, e só o service_role executa.
create function public.metricas_usuario_admin(p_usuario uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'receitas', (select count(*) from public.receitas where usuario_id = p_usuario),
    'receitas_pendentes', (select count(*) from public.receitas where usuario_id = p_usuario and status_pagamento = 'pendente'),
    'entregas', (select coalesce(sum(quantidade), 0) from public.receitas where usuario_id = p_usuario),
    'despesas', (select count(*) from public.despesas where usuario_id = p_usuario),
    'clientes', (select count(*) from public.clientes where usuario_id = p_usuario),
    'categorias', (select count(*) from public.categorias where usuario_id = p_usuario),
    'eventos', (select count(*) from public.eventos where usuario_id = p_usuario),
    'metas', (select count(*) from public.metas where usuario_id = p_usuario),
    'metas_ativas', (select count(*) from public.metas where usuario_id = p_usuario and status = 'ativa'),
    'fotos', (select count(*) from storage.objects o
              where o.bucket_id in ('fotos-clientes', 'fotos-perfil')
                and (storage.foldername(o.name))[1] = p_usuario::text),
    'primeiro_lancamento', (select min(created_at) from (
      select created_at from public.receitas where usuario_id = p_usuario
      union all select created_at from public.despesas where usuario_id = p_usuario) l),
    'ultimo_lancamento', (select max(created_at) from (
      select created_at from public.receitas where usuario_id = p_usuario
      union all select created_at from public.despesas where usuario_id = p_usuario) l),
    'ultimo_uso', (select max(updated_at) from auth.sessions where user_id = p_usuario),
    'aparelho', (select case
                   when bool_or(user_agent ~* '(iphone|android|mobile)') and bool_or(user_agent !~* '(iphone|android|mobile)') then 'celular e computador'
                   when bool_or(user_agent ~* '(iphone|android|mobile)') then 'celular'
                   when count(*) > 0 then 'computador'
                 end
                 from auth.sessions where user_id = p_usuario)
  );
$$;

revoke all on function public.metricas_usuario_admin(uuid) from public, anon, authenticated;
grant execute on function public.metricas_usuario_admin(uuid) to service_role;
