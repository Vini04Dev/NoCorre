# Versão 0.0.4: plano de publicação

Checklist da grande atualização (Pro, carteiras, contas, notificações, moto).
Nada vai para a `main` antes de cada item estar marcado.

## O que entra

| Branch | Conteúdo |
|---|---|
| `plano-pro` | Plano Pro, "O Pro chegou!", selo no Perfil, troca do próprio plano no painel |
| `tema-app` | Temas (Clássico, Neblina, Noturno lilás, escuro) |
| `carteiras` | Carteiras, transferências, acerto de saldo |
| `saude-moto` | Saúde da moto, fotos da CG 160, "Em breve" para outros modelos |
| `contas-fixas` | Contas do mês dentro de Metas, débito automático |
| `ideias-recta` | Fim do mês nos Relatórios |
| `notificacoes` | Sininho e linha do urgente no Início |
| `casos-comuns` | Saldo do corre, despesa pessoal, outras entradas, contas parceladas |
| `carteira-em-foco`, `revisao-pro`, `ajustes-004` | Botão de carteira, revisão com dados sintéticos, Fixo, mover receita, primeira visita da moto |

Hoje tudo isso está junto na `previa-local` (só local).

## Banco de dados

Todas as migrations já estão aplicadas na produção e **só acrescentam**
(colunas novas com padrão, tabelas novas com RLS). O app atual da `main`
continua funcionando com elas.

- `20261111100000_plano_pro` … `20261111140000_tipo_carteira`
- `20261112090000_contas_fixas`
- `20261113090000_corre_pessoal_parcelas_entradas`

A única mudança em dados existentes: a migration de 13/11 marcou como
**pessoais** as despesas já ligadas a contas/metas ou de categorias claramente
pessoais. Os valores não mudaram; só o saldo do corre do Início deixa de
descontar esses gastos (que passam a aparecer em "Fora dele").

## Dados de usuários reais: o que precisa continuar igual

- [ ] **Metas**: progresso de cada meta ativa igual antes e depois (receita,
      entregas, limite e conta). Só lançamentos novos do tipo "Fixo" deixam
      de contar entrega; conferir que ninguém usa uma categoria própria
      chamada "Fixo":
      `select count(*) from receitas where tipo = 'Fixo';` (deve dar 0).
- [ ] **Saldos**: soma de receitas e despesas por pessoa igual à de antes.
- [ ] **Metas de conta antigas**: continuam abrindo, pagando e encerrando.
- [ ] **Quem não é Pro**: Início igual ao de hoje (uma carteira, sem botão de
      carteira, sem linha "Fora dele" se não tiver gasto pessoal).

## Testes antes do merge

- [ ] Build (`npm run build`), lint e testes de contraste dos temas.
- [ ] Celular e computador, temas claro e escuro.
- [ ] Conta grátis: lançar receita, despesa, meta; nenhuma tela Pro aparece.
- [ ] Conta Pro (teste): carteiras, transferência, botão de carteira no Início
      e no Resumo, conta parcelada, débito automático, outra entrada, mover
      receita, Fixo, moto (primeira visita e carrossel), sino.
- [ ] Painel do sistema: todas as prévias de aviso abrem sozinhas.
- [ ] Varredura de chaves antes de cada envio.

## Publicação

1. Juntar as branches na `dev` (na ordem da tabela) e conferir cada merge.
2. Nota da versão 0.0.4 em `lib/novidades.ts` e `version` no `package.json`.
3. `dev` → `main`, conferir na URL de produção (páginas públicas e a conta de
   teste).
4. Deploy privado para testar no celular antes, se der tempo (ver memória do
   projeto).
