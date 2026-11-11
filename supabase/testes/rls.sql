-- Teste de segurança do banco: RLS, trigger de perfil e constraints.
-- Cria duas usuárias fictícias, tenta acessar e alterar os dados uma da outra
-- e termina com um erro proposital ("TESTES OK: ...") para desfazer tudo.
-- Qualquer outra mensagem de erro ("FALHA n") indica uma regra quebrada.
--
-- Rodar: npm run db:testar

do $$
declare
  ana uuid := '11111111-1111-1111-1111-111111111111';
  bia uuid := '22222222-2222-2222-2222-222222222222';
  cli uuid;
  rec uuid;
  conta uuid;
  n int;
  v numeric;
  nome_txt text;
  ok bool;
  log text := '';
begin
  insert into auth.users (id, email, raw_user_meta_data, aud, role)
  values (ana, 'ana@teste.local', '{"nome":"Ana"}', 'authenticated', 'authenticated'),
         (bia, 'bia@teste.local', '{}', 'authenticated', 'authenticated');

  -- 1. trigger cria perfis
  select nome into nome_txt from public.perfis where id = ana;
  if nome_txt is distinct from 'Ana' then raise exception 'FALHA 1a: %', nome_txt; end if;
  select nome into nome_txt from public.perfis where id = bia;
  if nome_txt is distinct from 'bia' then raise exception 'FALHA 1b: %', nome_txt; end if;
  log := log || '1 trigger ok; ';

  -- como Ana
  perform set_config('request.jwt.claims', json_build_object('sub', ana, 'role', 'authenticated')::text, true);
  set local role authenticated;

  insert into public.clientes (nome, tipo) values ('Pizzaria', 'empresa') returning id into cli;
  insert into public.receitas (cliente_id, tipo, quantidade, valor_unitario)
    values (cli, 'Entrega', 3, 10.50) returning id, valor_total into rec, v;
  if v <> 31.50 then raise exception 'FALHA 2: valor_total %', v; end if;
  select count(*) into n from public.clientes where usuario_id = ana;
  if n <> 1 then raise exception 'FALHA 2b'; end if;
  log := log || '2 insert e valor_total ok; ';

  ok := false;
  begin
    delete from public.clientes where id = cli;
  exception when foreign_key_violation then ok := true;
  end;
  if not ok then raise exception 'FALHA 3: excluiu cliente com receitas'; end if;
  log := log || '3 cliente com receita protegido; ';

  ok := false;
  begin
    insert into public.receitas (cliente_id, tipo, valor_unitario, valor_total) values (cli, 'X', 1, 999);
  exception when generated_always or others then ok := true;
  end;
  if not ok then raise exception 'FALHA 4: aceitou valor_total'; end if;
  log := log || '4 valor_total bloqueado; ';

  ok := false;
  begin
    insert into public.eventos (data_hora_inicial, data_hora_final, descricao)
      values (now(), now() - interval '1 hour', 'Errado');
  exception when check_violation then ok := true;
  end;
  if not ok then raise exception 'FALHA 5: evento invertido'; end if;
  log := log || '5 evento check ok; ';

  -- conta a pagar: pagamentos ligados não passam do valor
  insert into public.metas (nome, parametro, valor_alvo, data_inicio, data_fim)
    values ('Sicoob', 'conta', 100, current_date, current_date + 30) returning id into conta;
  insert into public.despesas (tipo, valor_unitario, meta_id) values ('Banco', 60, conta);
  ok := false;
  begin
    insert into public.despesas (tipo, valor_unitario, meta_id) values ('Banco', 50, conta);
  exception when check_violation then ok := true;
  end;
  if not ok then raise exception 'FALHA 13: pagou acima do valor da conta'; end if;
  ok := false;
  begin
    update public.metas set valor_alvo = 50 where id = conta;
  exception when check_violation then ok := true;
  end;
  if not ok then raise exception 'FALHA 13b: valor da conta abaixo do já pago'; end if;
  ok := false;
  begin
    insert into public.metas (nome, parametro, valor_alvo, data_inicio, data_fim, categoria)
      values ('Errada', 'conta', 10, current_date, current_date, 'Lanche');
  exception when check_violation then ok := true;
  end;
  if not ok then raise exception 'FALHA 13c: conta aceitou filtro de categoria'; end if;
  log := log || '13 conta a pagar ok; ';

  -- como Bia
  reset role;
  perform set_config('request.jwt.claims', json_build_object('sub', bia, 'role', 'authenticated')::text, true);
  set local role authenticated;

  select count(*) into n from public.clientes;
  if n <> 0 then raise exception 'FALHA 6: Bia viu % clientes da Ana', n; end if;
  select count(*) into n from public.receitas;
  if n <> 0 then raise exception 'FALHA 6b'; end if;
  select count(*) into n from public.perfis;
  if n <> 1 then raise exception 'FALHA 6c: Bia viu % perfis', n; end if;
  log := log || '6 isolamento de leitura ok; ';

  update public.receitas set valor_unitario = 0 where id = rec;
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FALHA 7: Bia alterou receita da Ana'; end if;
  delete from public.clientes where id = cli;
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FALHA 7b: Bia excluiu cliente da Ana'; end if;
  log := log || '7 update/delete alheio bloqueado; ';

  ok := false;
  begin
    insert into public.receitas (cliente_id, tipo, valor_unitario) values (cli, 'Entrega', 5);
  exception when foreign_key_violation then ok := true;
  end;
  if not ok then raise exception 'FALHA 8: Bia usou cliente da Ana'; end if;
  log := log || '8 FK composta ok; ';

  ok := false;
  begin
    insert into public.clientes (usuario_id, nome, tipo) values (ana, 'Falso', 'empresa');
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FALHA 9: Bia criou cliente em nome da Ana'; end if;
  log := log || '9 insert em nome de outro bloqueado; ';

  ok := false;
  begin
    insert into public.despesas (tipo, valor_unitario, meta_id) values ('Banco', 1, conta);
  exception when foreign_key_violation or check_violation then ok := true;
  end;
  if not ok then raise exception 'FALHA 14: Bia pagou conta da Ana'; end if;
  log := log || '14 conta alheia bloqueada; ';

  -- visitante sem login
  reset role;
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  set local role anon;
  ok := false;
  begin
    perform 1 from public.clientes;
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FALHA 10: anon leu clientes'; end if;
  log := log || '10 anon sem acesso; ';

  -- saúde da moto (Pro): só Pro grava, cada um só vê o seu
  reset role;
  perform set_config('request.jwt.claims', json_build_object('sub', ana, 'role', 'authenticated')::text, true);
  set local role authenticated;
  ok := false;
  begin
    insert into public.moto_quilometragem (km) values (1000);
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FALHA 17a: conta grátis gravou quilometragem'; end if;
  reset role;
  update public.perfis set plano = 'pro' where id = ana;
  set local role authenticated;
  insert into public.moto_quilometragem (km) values (1000);
  insert into public.moto_componentes (tipo, nome, intervalo_km, km_ultima_troca) values ('oleo', 'Óleo', 3000, 1000);
  reset role;
  perform set_config('request.jwt.claims', json_build_object('sub', bia, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*) into n from public.moto_componentes;
  if n <> 0 then raise exception 'FALHA 17b: viu manutenção alheia'; end if;
  reset role;
  log := log || '17 saude da moto ok; ';

  -- módulo admin: métricas só para o service_role, nunca para usuário logado
  reset role;
  perform set_config('request.jwt.claims', json_build_object('sub', ana, 'role', 'authenticated')::text, true);
  set local role authenticated;
  ok := false;
  begin
    perform public.metricas_admin();
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FALHA 15a: usuário logado leu as métricas'; end if;
  ok := false;
  begin
    perform public.metricas_usuario_admin(bia);
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FALHA 15c: usuário logado leu o detalhe de outra pessoa'; end if;
  reset role;
  set local role service_role;
  if (public.metricas_admin() -> 'usuarios' ->> 'total')::int < 2 then raise exception 'FALHA 15b'; end if;
  reset role;
  log := log || '15 metricas_admin restrita ok; ';

  -- carteiras (Pro): só Pro cria, cada um só vê as suas, lançamento não usa carteira alheia
  reset role;
  perform set_config('request.jwt.claims', json_build_object('sub', ana, 'role', 'authenticated')::text, true);
  set local role authenticated;
  ok := false;
  begin
    insert into public.carteiras (nome) values ('Banco');
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FALHA 16a: conta grátis criou carteira'; end if;
  reset role;
  update public.perfis set plano = 'pro' where id = ana;
  set local role authenticated;
  insert into public.carteiras (nome, saldo_inicial, padrao) values ('Banco', 100, true) returning id into conta;
  select count(*) into n from public.saldos_carteiras();
  if n <> 1 then raise exception 'FALHA 16b: saldos_carteiras'; end if;
  ok := false;
  begin
    update public.perfis set plano = 'gratis' where id = ana;
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FALHA 16c: usuária alterou o próprio plano'; end if;
  reset role;
  perform set_config('request.jwt.claims', json_build_object('sub', bia, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*) into n from public.carteiras;
  if n <> 0 then raise exception 'FALHA 16d: viu carteira alheia'; end if;
  ok := false;
  begin
    insert into public.despesas (tipo, valor_unitario, carteira_id) values ('X', 1, conta);
  exception when foreign_key_violation then ok := true;
  end;
  if not ok then raise exception 'FALHA 16e: usou carteira alheia'; end if;
  reset role;
  log := log || '16 carteiras ok; ';

  -- exclusão da conta apaga tudo em cascata
  reset role;
  delete from auth.users where id = ana;
  select count(*) into n from public.receitas where usuario_id = ana;
  if n <> 0 then raise exception 'FALHA 11'; end if;
  log := log || '11 exclusao da conta em cascata ok; ';

  -- a própria pessoa exclui a conta pela função, e só a dela
  perform set_config('request.jwt.claims', json_build_object('sub', bia, 'role', 'authenticated')::text, true);
  set local role authenticated;
  perform public.excluir_minha_conta();
  reset role;
  select count(*) into n from auth.users where id = bia;
  if n <> 0 then raise exception 'FALHA 12: excluir_minha_conta não apagou a Bia'; end if;
  log := log || '12 excluir_minha_conta ok';

  raise exception 'TESTES OK: %', log;
end $$;
