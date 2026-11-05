-- Módulo de administração: marca de ADM no perfil e métricas gerais do sistema.

-- 1. Quem é ADM. Só se liga direto no banco (SQL Editor ou CLI), nunca pelo app.
alter table public.perfis
  add column admin boolean not null default false;

comment on column public.perfis.admin is 'Libera o painel de administração. Não é editável pelo app.';

-- 2. Até aqui o usuário podia dar update em qualquer coluna da própria linha.
--    Com a coluna admin, isso deixaria qualquer pessoa se promover. A permissão
--    de update passa a valer só para as colunas que o app edita.
revoke update on public.perfis from authenticated;
grant update (nome, telefone, tipo_sanguineo, veiculo, ano_veiculo, placa, foto)
  on public.perfis to authenticated;

-- 3. Métricas do sistema.
--    Roda como dona (security definer) para contar linhas de todos, mas só
--    responde a quem tem admin = true. Devolve apenas contagens e datas: nenhum
--    valor em dinheiro e nenhum lançamento de ninguém.
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
  if not coalesce((select p.admin from public.perfis p where p.id = auth.uid()), false) then
    raise exception 'Acesso restrito à administração' using errcode = '42501';
  end if;

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

revoke all on function public.metricas_admin() from public, anon;
grant execute on function public.metricas_admin() to authenticated;
