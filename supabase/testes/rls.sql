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

  -- exclusão da conta apaga tudo em cascata
  reset role;
  delete from auth.users where id = ana;
  select count(*) into n from public.receitas where usuario_id = ana;
  if n <> 0 then raise exception 'FALHA 11'; end if;
  log := log || '11 exclusao da conta em cascata ok';

  raise exception 'TESTES OK: %', log;
end $$;
