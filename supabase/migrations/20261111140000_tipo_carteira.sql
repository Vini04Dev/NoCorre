-- Tipo da carteira (conta corrente, poupança, dinheiro...). Texto livre como o
-- tipo de receitas e despesas: as opções vivem no app (lib/carteiras.ts).
-- Só define o ícone e o rótulo do cartão; não muda nenhum cálculo de saldo.
alter table public.carteiras add column tipo varchar(30);
