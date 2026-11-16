-- Zera a Saúde da moto de UMA conta só: a do autor, a pedido dele, para refazer
-- o cadastro (odômetro e estado das peças) do jeito certo. Nenhuma outra conta
-- é tocada: os dois deletes filtram pelo usuário desse e-mail. Se o e-mail não
-- existir neste banco (ex.: banco local), não apaga nada.
--
-- Depois disso, abrir a Saúde da moto mostra de novo a primeira visita.
-- Não tem como desfazer: as leituras e as trocas apagadas não voltam.

delete from public.moto_componentes
where usuario_id = (select id from auth.users where email = 'vini0102033@gmail.com');

delete from public.moto_quilometragem
where usuario_id = (select id from auth.users where email = 'vini0102033@gmail.com');
