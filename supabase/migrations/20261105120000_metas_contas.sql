-- Metas: filtro por categoria/cliente e "conta a pagar" com pagamentos vinculados.
--
-- Metas de receita, entregas e despesa somam sozinhas tudo o que cai no período
-- (e bate com o filtro). A conta a pagar é diferente: só conta o que o usuário
-- ligou a ela ao lançar a despesa. Assim, duas contas no mesmo mês nunca
-- recebem o mesmo pagamento. O valor pago continua sem coluna: é a soma das
-- despesas ligadas, calculada na hora.

-- 1. Novo parâmetro. O valor só pode ser usado como literal depois do commit,
--    por isso as regras abaixo comparam `parametro::text`.
alter type public.parametro_meta add value 'conta';

-- 2. Filtros e parcelas em metas.
alter table public.metas
  add column categoria varchar(50) check (length(trim(categoria)) > 0),
  add column cliente_id uuid,
  add column parcela_atual smallint,
  add column parcela_total smallint,
  -- Alvo das FKs compostas (mesmo esquema de clientes/receitas).
  add constraint metas_id_usuario_unico unique (id, usuario_id),
  -- Cliente da meta precisa ser do mesmo dono. "no action" pelo mesmo motivo
  -- de receitas: não quebra a exclusão da conta, que apaga tudo junto.
  add constraint metas_cliente_fk foreign key (cliente_id, usuario_id)
    references public.clientes (id, usuario_id) on delete no action,
  -- Conta a pagar não tem filtro; meta de despesa não filtra por cliente.
  add constraint metas_filtro_por_parametro check (
    (parametro::text <> 'conta' or (categoria is null and cliente_id is null))
    and (parametro::text <> 'despesa' or cliente_id is null)
  ),
  -- Parcela "2/12": as duas juntas, só em conta a pagar.
  add constraint metas_parcela_valida check (
    (parcela_atual is null and parcela_total is null)
    or (parametro::text = 'conta' and parcela_atual between 1 and parcela_total)
  );

comment on column public.metas.categoria is 'Filtro opcional: só conta receitas/despesas com este tipo.';
comment on column public.metas.cliente_id is 'Filtro opcional: só conta receitas deste cliente.';

create index metas_cliente_idx on public.metas (cliente_id, usuario_id);

-- 3. Despesa pode pagar uma conta.
--    Se a conta for excluída, a despesa continua no histórico e só perde o vínculo.
alter table public.despesas
  add column meta_id uuid,
  add constraint despesas_meta_fk foreign key (meta_id, usuario_id)
    references public.metas (id, usuario_id) on delete set null (meta_id);

comment on column public.despesas.meta_id is 'Conta a pagar (meta com parametro conta) que esta despesa abate.';

create index despesas_meta_idx on public.despesas (meta_id, usuario_id);

-- 4. Pagamento não pode passar do valor da conta.
--    A checagem fica no banco, e não só na tela, para valer também em dois
--    lançamentos ao mesmo tempo: o "for update" trava a conta até o fim da
--    transação. Roda como quem chamou (sem security definer), então o RLS vale.
--    Os códigos em "message" são traduzidos pelo app.
create function public.conferir_pagamento_conta()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  parametro_conta text;
  valor_conta numeric;
  ja_pago numeric;
begin
  if new.meta_id is null then
    return new;
  end if;

  select parametro::text, valor_alvo into parametro_conta, valor_conta
  from public.metas
  where id = new.meta_id
  for update;

  if parametro_conta is distinct from 'conta' then
    raise exception using errcode = '23514', message = 'meta_nao_e_conta';
  end if;

  select coalesce(sum(valor_total), 0) into ja_pago
  from public.despesas
  where meta_id = new.meta_id and id <> new.id;

  -- valor_total ainda não foi gerado num trigger "before": calcula aqui.
  if ja_pago + new.quantidade * new.valor_unitario > valor_conta then
    raise exception using
      errcode = '23514',
      message = 'pagamento_acima_da_conta',
      detail = (valor_conta - ja_pago)::text;
  end if;

  return new;
end;
$$;

create trigger conferir_pagamento_conta
  before insert or update of meta_id, quantidade, valor_unitario on public.despesas
  for each row execute function public.conferir_pagamento_conta();

-- 5. Editar a conta sem contradizer os pagamentos já feitos.
create function public.conferir_edicao_conta()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  ja_pago numeric;
begin
  if old.parametro::text <> 'conta' then
    return new;
  end if;

  select coalesce(sum(valor_total), 0) into ja_pago
  from public.despesas
  where meta_id = old.id;

  if ja_pago > 0 and new.parametro::text <> 'conta' then
    raise exception using errcode = '23514', message = 'conta_com_pagamentos';
  end if;

  if new.valor_alvo < ja_pago then
    raise exception using
      errcode = '23514',
      message = 'valor_abaixo_do_pago',
      detail = ja_pago::text;
  end if;

  return new;
end;
$$;

create trigger conferir_edicao_conta
  before update of parametro, valor_alvo on public.metas
  for each row execute function public.conferir_edicao_conta();
