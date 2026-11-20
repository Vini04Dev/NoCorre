-- Quais carteiras contam no Início e no Resumo (botão de carteira, Pro).
--
-- A pessoa marca uma ou várias carteiras e a escolha fica na conta, não no
-- aparelho: sair e entrar de novo (ou abrir no celular e no computador) mantém
-- a mesma seleção. Antes ficava no sessionStorage e voltava para "Todas" a
-- cada vez que o app era fechado.
--
-- Vazia (null) = todas as carteiras, que é o comportamento de antes. Ids de
-- carteiras arquivadas ou excluídas que sobrarem na lista são ignorados pelo
-- app, por isso não há chave estrangeira (array não aceita FK).
--
-- Aditiva: ninguém perde nada. Para desfazer:
-- alter table public.perfis drop column carteiras_visiveis;

alter table public.perfis
  add column carteiras_visiveis uuid[];

comment on column public.perfis.carteiras_visiveis is
  'Carteiras que contam no Início e no Resumo. Vazio: todas.';

-- A edição do perfil é por coluna (o plano não pode ser editado pela pessoa).
grant update (carteiras_visiveis) on public.perfis to authenticated;

notify pgrst, 'reload schema';
