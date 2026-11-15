-- Plano Pro: marca no perfil de quem tem acesso aos recursos Pro.
--
-- Por enquanto não há cobrança: o ADM liga o Pro de cada pessoa pelo painel do
-- sistema (servidor, com a Secret key). Quando houver pagamento, a mesma coluna
-- passa a ser preenchida pelo retorno do pagamento.

create type public.plano_conta as enum ('gratis', 'pro');

alter table public.perfis
  add column plano public.plano_conta not null default 'gratis';

comment on column public.perfis.plano is 'Plano da conta. Só o servidor (ADM ou pagamento) altera.';

-- Até aqui a pessoa podia dar update em qualquer coluna da própria linha, o que
-- deixaria qualquer um se dar o Pro. A edição passa a valer só para as colunas
-- que o app edita. Colunas novas editáveis precisam entrar nesta lista.
revoke update on public.perfis from authenticated;
grant update (nome, telefone, tipo_sanguineo, veiculo, ano_veiculo, placa, foto)
  on public.perfis to authenticated;

-- Usada nas políticas de RLS das tabelas Pro: o banco recusa gravação de quem
-- não é Pro, mesmo que alguém chame a API direto.
create function public.eh_pro()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select p.plano = 'pro' from public.perfis p where p.id = auth.uid()), false);
$$;

revoke all on function public.eh_pro() from public, anon;
grant execute on function public.eh_pro() to authenticated;
