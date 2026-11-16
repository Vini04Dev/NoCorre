# Exportar e importar (desenho)

Proposta do módulo de exportar e importar dados. **Nada está implementado**:
existe só um desenho navegável, sem função, no Painel do sistema
(`/admin/previa/exportar`). Este arquivo registra o que a pesquisa mostrou e as
decisões que faltam.

## O que os outros apps fazem

| App | Exporta | Importa |
|---|---|---|
| Mobills | PDF, XLS e CSV | XLS, XLSX e CSV |
| Minhas Finanças | Excel, PDF e CSV | OFX (extrato do banco) |
| Minhas Economias | Excel e PDF (na versão paga) | não confirmado |
| Organizze | Excel | não confirmado |

O padrão do mercado é: **PDF** para mostrar a alguém, **planilha** (Excel ou
CSV) para mexer nos números e **OFX** para trazer o extrato do banco. Em
sistemas de conciliação, as boas práticas de importação são: mapear as colunas
do arquivo para os campos do sistema com um teste antes de gravar, conferir
sinal de débito e crédito, separador decimal e formato de data, e avisar de
possível repetição quando data, valor e descrição coincidem com um lançamento
que já existe.

Fontes: [Mobills: exportar dados](https://mobills.zendesk.com/hc/en-us/articles/360051811854-How-to-export-my-data-on-Mobills),
[Mobills: apps de controle financeiro](https://www.mobills.com.br/blog/apps-de-controle-financeiro/),
[Minhas Finanças na App Store](https://apps.apple.com/BR/app/id1662639047),
[Creditas: aplicativos de controle financeiro](https://www.creditas.com/exponencial/aplicativo-controle-financeiro/),
[Odoo: transações bancárias](https://www.odoo.com/documentation/18.0/pt_BR/applications/finance/accounting/bank/transactions.html),
[Contabilidade Zen: duplicatas em CSV e OFX](https://www.contabilidadezen.com.br/blog/como-evitar-duplicatas-na-conciliacao-de-csv-e-ofx/).

## Para que serve no No Corre!

- **Comprovar renda**: o entregador não tem holerite. Um PDF do mês, com o que
  recebeu por cliente, serve para aluguel, crediário e financiamento.
- **Levar os números para a planilha** ou para o contador (MEI).
- **Guardar uma cópia** de tudo e poder trazer de volta.
- **Trazer o histórico** de quem controlava em planilha ou em outro app.

## Exportar

Três escolhas, nesta ordem, com o resumo do que vai sair antes do botão:

1. **O que**: Extrato (linha por linha), Relatório (resumo do período) ou
   Cópia de tudo.
2. **Período**: este mês, mês passado, este ano ou datas escolhidas. A cópia
   de tudo não tem período.
3. **Formato**: PDF, Planilha (Excel) ou CSV. A cópia de tudo usa um formato
   próprio (JSON), que só o No Corre! lê de volta.

No celular o arquivo abre o compartilhar do aparelho (WhatsApp, e-mail,
arquivos); no computador, baixa.

## Importar

Quatro passos, com barra de progresso, e nada é gravado antes do terceiro:

1. **Arquivo**: planilha (CSV ou Excel, com modelo para baixar), extrato do
   banco (OFX) ou cópia do No Corre!.
2. **Colunas**: o app reconhece Data, Descrição, Valor e Categoria e a pessoa
   confere ou troca.
3. **Conferir**: quantos são novos, quantos parecem repetidos (desmarcados por
   padrão) e quantos têm erro. Como toda receita precisa de cliente, a pessoa
   escolhe um cliente para as receitas que vierem sem.
4. **Pronto**: quantos entraram e a opção de desfazer a importação inteira.

## Como seria feito (proposta técnica)

- **Tudo no aparelho**: gerar e ler arquivos no navegador, sem custo de
  servidor. A gravação passa pela RLS, como qualquer lançamento.
- **CSV**: escrito à mão, com ponto e vírgula e vírgula decimal (o Excel em
  português abre direto).
- **PDF**: página de impressão própria (`window.print` com CSS de impressão),
  sem biblioteca.
- **Excel e OFX**: precisam de biblioteca nova para ler e escrever `.xlsx` e de
  um leitor de OFX. Dependência nova só entra depois de combinada.
- **Desfazer importação**: exige marcar os lançamentos de cada importação (uma
  coluna nova nas tabelas de lançamentos). Mudança de schema: propor e
  atualizar `docs/der-fisico.md` antes.
- **Repetidos**: comparar data, valor e descrição; no OFX, usar também o
  identificador da transação que o banco manda.

## Decisões em aberto

1. **Grátis ou Pro?** A landing já prometeu "Exportar relatórios" no Pro.
   Sugestão: CSV do extrato grátis (os dados são da pessoa); PDF, Excel e
   importação no Pro.
2. **Onde fica no app**: sugestão de entrada em Perfil ("Exportar e importar")
   e um atalho "Exportar" nos Relatórios, já com o período da tela.
3. **Extrato do banco (OFX)**: entra na primeira versão ou depois? É o que mais
   exige cuidado com repetidos e com o que é do corre ou pessoal.
4. **PDF de comprovação de renda**: mostrar só o que foi recebido (por cliente
   e por mês) ou também as despesas?
