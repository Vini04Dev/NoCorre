# Modelo físico do banco

Schema do No Corre! no Postgres do Supabase. É a referência para migrations,
queries e tipos TypeScript: nenhuma coluna existe fora deste documento.

O diagrama original (`der-fisico.png`) foi o ponto de partida. As diferenças em
relação a ele estão explicadas em [Decisões](#decisões).

## Visão geral

```
auth.users (Supabase Auth)
   │ 1:1
   ├── perfis
   │ 1:N
   ├── clientes ──┐ 1:N
   ├── receitas ◄─┘
   ├── despesas
   ├── categorias
   ├── eventos
   └── metas
```

Toda tabela tem `usuario_id` (exceto `perfis`, cuja chave já é o próprio id do
usuário) e RLS ligada: cada pessoa só lê e altera as próprias linhas.

## Tipos enumerados

| Enum               | Valores                                                  |
|--------------------|----------------------------------------------------------|
| `tipo_cliente`     | `pessoa_fisica`, `empresa`                               |
| `forma_pagamento`  | `pix`, `dinheiro`                                        |
| `status_pagamento` | `pago`, `pendente`                                       |
| `tipo_categoria`   | `receita`, `despesa`                                     |
| `cor_evento`       | `amarelo`, `verde`, `vermelho`, `azul`, `roxo`, `cinza`  |
| `plano_conta`      | `gratis`, `pro`                                          |
| `parametro_meta`   | `quantidade`, `receita`, `despesa`, `conta`              |
| `status_meta`      | `ativa`, `inativa`                                       |

## Tabelas

Convenções que valem para todas:

- `id uuid primary key default gen_random_uuid()`
- `usuario_id uuid not null default auth.uid() references auth.users on delete cascade`
- `created_at timestamptz not null default now()`
- Valores em dinheiro são `numeric(10,2)`, nunca `float`.

### perfis

Dados do entregador além do que o Supabase Auth já guarda (e-mail e senha
ficam em `auth.users`).

| Coluna           | Tipo          | Regras                                              |
|------------------|---------------|-----------------------------------------------------|
| `id`             | `uuid`        | PK, `references auth.users on delete cascade`       |
| `nome`           | `varchar(100)`| not null                                            |
| `telefone`       | `varchar(20)` | opcional                                            |
| `tipo_sanguineo` | `varchar(3)`  | opcional, `check` em A+, A-, B+, B-, AB+, AB-, O+, O- |
| `veiculo`        | `varchar(60)` | opcional                                            |
| `ano_veiculo`    | `smallint`    | opcional, `check` entre 1950 e 2100                 |
| `placa`          | `varchar(10)` | opcional                                            |
| `foto`           | `text`        | opcional, caminho no bucket `fotos-perfil`          |
| `plano`          | `plano_conta` | not null, default `gratis`; só o servidor altera    |
| `created_at`     | `timestamptz` | default `now()`                                     |

Criada automaticamente pelo trigger `ao_criar_usuario` quando alguém se
cadastra. O nome vem do formulário de cadastro (`raw_user_meta_data.nome`).

A foto fica no bucket privado `fotos-perfil`, com as mesmas regras do
`fotos-clientes` (pasta com o id do usuário, 1 MB, URL assinada para exibir).

**Excluir a conta:** a função `public.excluir_minha_conta()` (security definer,
`search_path` vazio, execução só para `authenticated`) apaga de `auth.users` a
linha de quem chamou (`auth.uid()`); o resto some pelo cascade. Assim o app
não precisa da Secret key para isso. As fotos no Storage são removidas pelo
app antes da chamada.

### clientes

| Coluna       | Tipo           | Regras                                  |
|--------------|----------------|-----------------------------------------|
| `id`         | `uuid`         | PK                                      |
| `usuario_id` | `uuid`         | FK `auth.users`                         |
| `nome`       | `varchar(100)` | not null                                |
| `tipo`       | `tipo_cliente` | not null                                |
| `telefone`   | `varchar(20)`  | opcional                                |
| `foto`       | `text`         | opcional, caminho do arquivo no Storage |
| `observacao` | `text`         | opcional                                |
| `created_at` | `timestamptz`  |                                         |

`unique (id, usuario_id)` existe só para servir de alvo da FK composta de
`receitas` (ver Decisões).

**Fotos (Storage).** Ficam no bucket privado `fotos-clientes`, no caminho
`<usuario_id>/<arquivo>.jpg`. A coluna `foto` guarda esse caminho, não uma URL:
como o bucket é privado, o app gera na hora uma URL assinada (temporária) para
exibir a imagem. As políticas de `storage.objects` só liberam leitura e escrita
quando a primeira pasta do caminho é o `auth.uid()` de quem pede. Limite de
1 MB por arquivo; o app reduz a foto para 512 px antes de enviar.

### receitas

Entregas, corridas, gorjetas: tudo o que entra de dinheiro.

| Coluna             | Tipo               | Regras                                              |
|--------------------|--------------------|-----------------------------------------------------|
| `id`               | `uuid`             | PK                                                  |
| `usuario_id`       | `uuid`             | FK `auth.users`                                     |
| `cliente_id`       | `uuid`             | not null                                            |
| `data_hora`        | `timestamptz`      | not null, default `now()`                           |
| `tipo`             | `varchar(50)`      | not null (Entrega, Corrida, Gorjeta, ou personalizada) |
| `quantidade`       | `integer`          | not null, default 1, `> 0`                          |
| `valor_unitario`   | `numeric(10,2)`    | not null, `>= 0`                                    |
| `valor_total`      | `numeric(12,2)`    | **generated**: `quantidade * valor_unitario`        |
| `status_pagamento` | `status_pagamento` | not null, default `pago`                            |
| `forma_pagamento`  | `forma_pagamento`  | opcional                                            |
| `observacao`       | `text`             | opcional                                            |
| `created_at`       | `timestamptz`      |                                                     |

- FK composta `(cliente_id, usuario_id) references clientes (id, usuario_id) on delete no action`.
- Índices em `(usuario_id, data_hora)` e `(cliente_id, usuario_id)`.

### despesas

| Coluna           | Tipo            | Regras                                          |
|------------------|-----------------|-------------------------------------------------|
| `id`             | `uuid`          | PK                                              |
| `usuario_id`     | `uuid`          | FK `auth.users`                                 |
| `data_hora`      | `timestamptz`   | not null, default `now()`                       |
| `tipo`           | `varchar(50)`   | not null (Combustível, Alimentação, Diária da central, ou personalizada) |
| `quantidade`     | `integer`       | not null, default 1, `> 0`                      |
| `valor_unitario` | `numeric(10,2)` | not null, `>= 0`                                |
| `valor_total`    | `numeric(12,2)` | **generated**: `quantidade * valor_unitario`    |
| `observacao`     | `text`          | opcional                                        |
| `meta_id`        | `uuid`          | opcional, conta a pagar que esta despesa abate  |
| `created_at`     | `timestamptz`   |                                                 |

- FK composta `(meta_id, usuario_id) references metas (id, usuario_id) on delete set null (meta_id)`:
  excluir a conta mantém a despesa no histórico, só sem o vínculo.
- Trigger `conferir_pagamento_conta` (before insert/update): a meta ligada precisa
  ser do parâmetro `conta`, e a soma das despesas ligadas não pode passar do
  `valor_alvo`. Erro `23514` com `message` `meta_nao_e_conta` ou
  `pagamento_acima_da_conta` (o `detail` traz quanto ainda falta pagar).
- Índices em `(usuario_id, data_hora)` e `(meta_id, usuario_id)`.

### categorias

Categorias personalizadas que o usuário cadastra no módulo Cadastro. As
sugeridas (Entrega, Combustível etc.) ficam fixas no frontend e não vão para
o banco.

| Coluna       | Tipo             | Regras            |
|--------------|------------------|-------------------|
| `id`         | `uuid`           | PK                |
| `usuario_id` | `uuid`           | FK `auth.users`   |
| `nome`       | `varchar(50)`    | not null          |
| `tipo`       | `tipo_categoria` | not null          |
| `created_at` | `timestamptz`    |                   |

- `unique (usuario_id, tipo, lower(nome))`: não deixa cadastrar "Lanche" e
  "lanche" duas vezes no mesmo tipo.

### eventos

| Coluna              | Tipo           | Regras                                  |
|---------------------|----------------|-----------------------------------------|
| `id`                | `uuid`         | PK                                      |
| `usuario_id`        | `uuid`         | FK `auth.users`                         |
| `data_hora_inicial` | `timestamptz`  | not null                                |
| `data_hora_final`   | `timestamptz`  | not null, `>= data_hora_inicial`        |
| `descricao`         | `varchar(200)` | not null                                |
| `cor`               | `cor_evento`   | not null, default `amarelo`             |
| `created_at`        | `timestamptz`  |                                         |

- Índice em `(usuario_id, data_hora_inicial)`.

### metas

| Coluna        | Tipo             | Regras                          |
|---------------|------------------|---------------------------------|
| `id`          | `uuid`           | PK                              |
| `usuario_id`  | `uuid`           | FK `auth.users`                 |
| `nome`        | `varchar(100)`   | not null                        |
| `parametro`   | `parametro_meta` | not null                        |
| `valor_alvo`  | `numeric(12,2)`  | not null, `> 0`                 |
| `data_inicio` | `date`           | not null                        |
| `data_fim`    | `date`           | not null, `>= data_inicio`      |
| `status`      | `status_meta`    | not null, default `ativa` (`inativa` = pausada) |
| `categoria`   | `varchar(50)`    | opcional, filtro pelo `tipo` da receita/despesa |
| `cliente_id`  | `uuid`           | opcional, filtro de receitas por cliente |
| `parcela_atual` | `smallint`     | opcional, só em `conta`         |
| `parcela_total` | `smallint`     | opcional, só em `conta`, `>= parcela_atual` |
| `created_at`  | `timestamptz`    |                                 |

- `unique (id, usuario_id)`, alvo da FK composta de `despesas.meta_id`.
- FK composta `(cliente_id, usuario_id) references clientes (id, usuario_id) on delete no action`.
- `conta` não tem filtro (`categoria` e `cliente_id` nulos); `despesa` não filtra por cliente.
- Parcelas vão juntas (as duas nulas ou `1 <= parcela_atual <= parcela_total`).
- Trigger `conferir_edicao_conta` (before update): conta com pagamentos não
  muda de parâmetro (`conta_com_pagamentos`) e o `valor_alvo` não fica abaixo
  do já pago (`valor_abaixo_do_pago`).

O progresso não é coluna: é calculado na hora.

| Parâmetro    | O que soma                                                      |
|--------------|-----------------------------------------------------------------|
| `receita`    | `valor_total` das receitas **pagas** do período (e do filtro)   |
| `quantidade` | `quantidade` de todas as receitas do período (e do filtro)      |
| `despesa`    | `valor_total` das despesas do período (e da categoria): é um limite |
| `conta`      | `valor_total` das despesas com `meta_id` igual à conta, de qualquer data |

"Encerrada" também é calculado, não é um valor de `status`: receita e entregas
encerram quando batem o alvo ou quando o período termina; limite de despesa só
no fim do período; conta a pagar quando é quitada (enquanto não for, continua
ativa, e passa a "em atraso" depois do fim do período).

## Plano Pro

`perfis.plano` diz se a conta é `gratis` ou `pro`. Não há cobrança ainda: o
ADM liga o Pro pelo painel do sistema (servidor, com a Secret key).

- Desde a migration `20261111100000_plano_pro`, o `update` em `perfis` vale só
  para as colunas que o app edita (`nome`, `telefone`, `tipo_sanguineo`,
  `veiculo`, `ano_veiculo`, `placa`, `foto`), por permissão de coluna. Assim
  ninguém se dá o Pro pela API. **Coluna nova editável pela pessoa precisa
  entrar nesse `grant`.**
- `public.eh_pro()` (security definer, `search_path` vazio) devolve se quem
  chamou é Pro. As tabelas de recursos Pro usam essa função na política de
  RLS de escrita, então o banco recusa gravação de quem não é Pro.

## Carteiras (Pro)

Migration `20261111110000_carteiras`. Separa o dinheiro por onde ele está
(conta do banco, dinheiro em mão, conta do salário).

### carteiras

| Coluna          | Tipo            | Regras                                              |
|-----------------|-----------------|-----------------------------------------------------|
| `id`            | `uuid`          | PK; `unique (id, usuario_id)` para FKs compostas    |
| `usuario_id`    | `uuid`          | FK `auth.users`, `on delete cascade`                |
| `nome`          | `varchar(40)`   | not null, único por pessoa                          |
| `cor`           | `cor_evento`    | default `azul`                                      |
| `saldo_inicial` | `numeric(10,2)` | default 0 (quanto tinha ao começar a usar)          |
| `padrao`        | `boolean`       | no máximo uma por pessoa (índice único parcial)     |
| `arquivada`     | `boolean`       | some das escolhas, mantém o histórico               |

### transferencias

| Coluna       | Tipo            | Regras                                          |
|--------------|-----------------|-------------------------------------------------|
| `origem_id`  | `uuid`          | FK composta `(origem_id, usuario_id)`            |
| `destino_id` | `uuid`          | FK composta; `check (origem_id <> destino_id)`   |
| `valor`      | `numeric(10,2)` | `> 0`                                            |
| `data_hora`  | `timestamptz`   | default `now()`                                  |
| `observacao` | `varchar(120)`  | opcional                                         |

- `receitas.carteira_id` e `despesas.carteira_id`: opcionais, FK composta com
  `on delete no action` (carteira com lançamentos não é excluída; arquiva-se).
  Lançamento sem carteira conta na principal.
- RLS: ler e excluir os próprios; criar e editar só com `eh_pro()`.
- `public.saldos_carteiras()` (security invoker): saldo inicial + receitas
  pagas − despesas ± transferências, por carteira.
- **Para desfazer** (se o recurso não for adiante):
  `drop function public.saldos_carteiras(); drop table public.transferencias;
  alter table public.receitas drop column carteira_id; alter table
  public.despesas drop column carteira_id; drop table public.carteiras;` e
  `supabase migration repair --status reverted 20261111110000`.

## Administração

O painel `/admin` do app abre só para o e-mail definido em `ADMIN_EMAIL`,
variável do servidor (em `.env.local` e na Vercel, nunca no Git). Trocar o
ADM é só mudar a variável; o banco não guarda quem é ADM. Aceita mais de um
e-mail, separado por vírgula.

As métricas vêm da função `public.metricas_admin()` (security definer,
`search_path` vazio). Como o banco não sabe quem é ADM, a execução é
liberada **só para o `service_role`**: nenhum usuário logado consegue
chamá-la pela API. O app chama com a Secret key (`SUPABASE_SECRET_KEY`), que
fica apenas no servidor (`lib/supabase/admin.ts`, protegido por
`import "server-only"`), depois de conferir o e-mail da sessão.

Ela devolve um `jsonb` só com contagens e datas: usuários (total,
confirmados, novos e que acessaram em 7 e 30 dias), quantos lançaram na
semana, total de registros por tabela, cadastros e lançamentos por dia nos
últimos 30 dias, tamanho do banco e das fotos, e nome e datas dos últimos 10
cadastros. Nenhum valor em dinheiro nem lançamento de outra pessoa sai dela.

A migration `20261110120000_mais_metricas_admin` recriou a função com mais
dados: uso real pelas sessões (`auth.sessions.updated_at`, renovada a cada hora
com o app aberto; `last_sign_in_at` só muda no login e subestima quem fica
logado no PWA), ativos hoje/7/30 dias,
retenção de 7 dias, contas que nunca lançaram, receitas pendentes, metas
ativas, categorias mais usadas (por contagem), tamanho de cada tabela e
pessoas lançando por dia. Tudo é contado na hora em que o painel abre. A função também devolve
celular x computador pelo user agent das sessões, mas o painel não mostra:
login e renovação de sessão passam pelo servidor do app, então o user agent
gravado é o do servidor, não o do aparelho da pessoa.

Número de requisições à API não está no banco (só na Management API do
Supabase, que exige token de acesso à conta) e por isso ficou de fora.

## Segurança (RLS)

Todas as tabelas têm RLS ligada e quatro políticas (select, insert, update,
delete) para o papel `authenticated`:

```sql
using ((select auth.uid()) = usuario_id)
with check ((select auth.uid()) = usuario_id)
```

Em `perfis` a comparação é com `id`, e não há política de insert nem de
delete: a linha é criada pelo trigger e removida junto com o usuário.

O `(select auth.uid())` entre parênteses é recomendação do Supabase: o Postgres
calcula o valor uma vez por consulta, e não uma vez por linha.

## Trigger

`ao_criar_usuario`: `after insert on auth.users`, chama a função
`criar_perfil()` (`security definer`, `search_path` vazio), que insere a linha
em `perfis` com o mesmo `id` e o nome enviado no cadastro. Sem nome, usa a
parte do e-mail antes do `@`, para a linha nunca deixar de ser criada.

## Como aplicar e testar

O SQL do banco vive em `supabase/migrations/`, em ordem de data. Com o projeto
vinculado pela CLI (`npx supabase login` e `npx supabase link`):

| Comando              | O que faz                                                    |
|----------------------|--------------------------------------------------------------|
| `npx supabase db push --remote` | Aplica no projeto as migrations que ainda não rodaram |
| `npm run db:tipos`   | Gera `types/database.ts` a partir do banco                    |
| `npm run db:testar`  | Roda `supabase/testes/rls.sql`, que tenta furar o RLS e as constraints e desfaz tudo no final |

Toda mudança no banco é uma migration nova. Migration já aplicada não é editada.

## Decisões

- **`receitas` no lugar de `entregas`.** O app registra entregas, corridas
  e gorjetas, e a interface usa sempre "Receita". O nome da tabela
  acompanha a interface.
- **`uuid` em vez de `int`.** Ids sequenciais revelam quantos registros existem
  e são fáceis de adivinhar. `uuid` é o padrão do Supabase e casa com o id do
  `auth.users`.
- **`numeric(10,2)` em vez de `float`.** `float` tem erro de arredondamento
  (0,1 + 0,2 ≠ 0,3), inaceitável para dinheiro.
- **`usuario_id default auth.uid()`.** O frontend não precisa enviar o dono do
  registro, e não consegue mentir sobre ele: a política de RLS recusa qualquer
  valor diferente do usuário logado.
- **FK composta em `receitas`.** RLS não é verificada na checagem de chave
  estrangeira. Sem a FK composta, alguém poderia vincular uma receita ao
  `cliente_id` de outra pessoa, se descobrisse o id. Com
  `(cliente_id, usuario_id)`, o cliente precisa ser do mesmo dono.
- **`on delete no action` em `cliente_id`.** Cliente com receitas não pode ser
  excluído (regra de negócio 5). O app traduz o erro para uma mensagem clara.
  Não é `restrict` porque `restrict` verifica na hora e quebraria a exclusão
  da conta: o cascade apagaria o cliente antes das receitas. `no action`
  verifica só no fim do comando, quando as receitas já foram junto.
- **`valor_total` gerado pelo banco.** Nunca diverge de quantidade × valor
  unitário, e o frontend não pode enviar um total errado.
- **`tipo` como texto, não FK para `categorias`.** O registro guarda o nome da
  categoria no momento do lançamento. Excluir ou renomear uma categoria não
  altera o histórico, e as categorias sugeridas não precisam existir no banco.
- **`data_hora` em `timestamptz`.** Data e hora juntas, com fuso. O filtro de
  "dia" e a semana começando na segunda são calculados no fuso
  `America/Sao_Paulo`.
- **E-mail, senha e data de cadastro saíram de `perfis`.** O Supabase Auth já
  guarda isso em `auth.users`, com a senha criptografada. Duplicar seria risco
  sem ganho.
- **Conta a pagar ligada à despesa, e não ao período.** Duas contas no mesmo
  mês somariam o mesmo pagamento se o progresso viesse do período. O vínculo
  `despesas.meta_id` diz qual conta cada pagamento abate. O teto (não pagar
  acima do valor) fica num trigger com `for update` na conta, para valer também
  com dois lançamentos simultâneos.
- **`on delete cascade` em `usuario_id`.** Se a conta for excluída, os dados
  da pessoa vão junto.
