-- Repetição de eventos da Agenda: "toda sexta até 20/02" ou "todo mês", como
-- no Google Agenda e no Calendário da Apple.
--
-- Cada repetição é um evento de verdade (uma linha), ligado aos outros pelo
-- mesmo serie_id. Assim a Agenda, o sininho e o próximo compromisso continuam
-- funcionando sem mudança, e cada dia pode ser editado ou excluído sozinho.
-- Regras de geração (dias da semana, limite de 1 ano e de 120 eventos, dia 31
-- no mês curto) ficam em lib/repeticao.ts. Os dias da semana escolhidos não
-- têm coluna: saem das datas dos próprios eventos da série.
--
-- Aditiva: eventos que já existem ficam com as duas colunas vazias (não se
-- repetem) e nada muda para eles. A RLS da tabela continua valendo.
-- Para desfazer: drop index eventos_serie; alter table public.eventos
-- drop column serie_id, drop column repeticao;

alter table public.eventos
  add column serie_id uuid,
  add column repeticao varchar(10)
    check (repeticao in ('semanal', 'mensal')),
  -- As duas andam juntas: ou o evento é de uma série (com a regra), ou é avulso.
  add constraint eventos_serie_com_repeticao check ((serie_id is null) = (repeticao is null));

-- "Este e os próximos" busca a série a partir de um dia.
create index eventos_serie on public.eventos (usuario_id, serie_id, data_hora_inicial)
  where serie_id is not null;

comment on column public.eventos.serie_id is 'Mesmo valor em todas as repetições de um evento. Vazio: evento avulso.';
comment on column public.eventos.repeticao is 'Regra da série: semanal (nos dias da semana escolhidos) ou mensal.';

notify pgrst, 'reload schema';
