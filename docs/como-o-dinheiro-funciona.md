# Como o dinheiro funciona no No Corre!

Guia das regras de dinheiro do app: o que cada tela responde, onde cada
lançamento entra e o que acontece com ele. Vale para quem usa e para quem
mantém o código.

## Cada pergunta tem um lugar só

| Pergunta | Onde responde | O que conta |
|---|---|---|
| Quanto eu tenho agora? | **Início › Tenho agora** (Pro, com carteiras) | Soma dos saldos das carteiras |
| Quanto sobrou no período? | **Início › Saldo** | Tudo o que entrou − tudo o que saiu |
| Quanto o corre rendeu? | Linha "Só do corre" no Início e no Resumo; **Relatórios** | Receitas pagas − despesas do corre |
| Onde está meu dinheiro? | **Carteiras** e o botão de carteira | Saldo de cada carteira |
| O que eu tenho que pagar? | **Metas › Contas do mês** e o sino | Contas mensais e parceladas |
| Aonde eu quero chegar? | **Metas** | Receita, entregas ou limite de gasto |
| Quanto deve sobrar no mês? | **Relatórios › Fim do mês** | O bolso inteiro |

## O saldo é do bolso inteiro

O **Saldo** do Início e do Resumo conta tudo: receitas pagas e outras
entradas, menos despesas do corre e pessoais. É o número que responde
"quanto eu tenho" sem abrir filtro, e serve tanto para quem vive do corre
quanto para quem faz entrega como bico.

"Do corre" e "pessoal" são um detalhe da despesa: no Início aparecem como
duas sublinhas embaixo de Despesas (tocar abre o Resumo filtrado), e o
quanto o trabalho rendeu sozinho fica na linha "Só do corre" e nos
Relatórios, que analisam apenas o corre.

## Os quatro tipos de lançamento

### 1. Receita (do corre)
Dinheiro do trabalho: entrega, corrida, gorjeta ou **Fixo**.

- Toda receita tem cliente (app, central, estabelecimento ou pessoa).
- Conta no saldo só quando está **paga**. Pendente aparece à parte.
- **Fixo** é o que o estabelecimento paga sem depender de entrega (semanal,
  mensal). Entra no saldo, mas **não conta como entrega** (nem nas
  metas de entregas, nem na média por entrega).

### 2. Despesa: do corre ou pessoal
Toda despesa é uma das duas. O app decide pela categoria e a pessoa pode
trocar no lançamento ("Gasto do corre").

- **Do corre** (custo do trabalho): combustível, alimentação no turno, peças,
  EPI, diária da central, e categorias próprias marcadas assim (ex.: lavagem).
  Desconta do saldo e do que "sobrou só do corre".
- **Pessoal**: mercado, contas, parcelas, assinaturas, saúde, lazer. Desconta
  do saldo, mas não do que "sobrou só do corre".

### 3. Outra entrada (fora do corre)
Dinheiro que entra mas não é do trabalho de entrega: **salário de outro
emprego (CLT)**, bolsa, benefício, ajuda da família, venda de algo.

- Entra na carteira e no saldo. Não é receita, não tem cliente, não conta
  entrega nem entra no que "sobrou só do corre".
- Fica num link discreto no botão (+), embaixo de Receita e Despesa.
- **Lançou como receita por engano?** No detalhe da receita: "Não é do corre?
  Mover para outra entrada". A entrada é criada primeiro, depois a receita
  sai; o valor continua na mesma carteira.

### 4. Transferência (entre carteiras)
Dinheiro mudando de lugar: depósito na lotérica (Dinheiro → Caixa), mandar
para a reserva, pagar a fatura. **Não é gasto nem ganho**: não mexe no saldo,
só nos saldos das duas carteiras.

## Carteiras (Pro)

- Uma carteira para cada lugar onde o dinheiro fica (mão, banco, reserva).
- **Principal**: lançamento sem carteira escolhida conta nela. Se nenhuma está
  marcada, vale a mais antiga (mesma regra no app e no banco).
- **Saldo da carteira** = saldo inicial + receitas pagas + outras entradas +
  transferências recebidas − despesas − transferências enviadas.
- **Acertar saldo**: em Carteiras › Editar ou acertar saldo, quando o número
  do app não bate com o do banco ou da carteira de verdade.
- **Arquivar**: some das escolhas, mas o histórico continua.

### Botão de carteira (Início e Resumo)
Aparece para quem é Pro e tem duas ou mais carteiras, entre o olho e o sino.

- **Todas as carteiras** (padrão): o Início mostra o saldo do período e, no
  topo, quanto há somando as carteiras.
- **Uma carteira**: o Início e o Resumo mostram o saldo dela agora e o que
  entrou e saiu por ela no período (do corre ou não). O botão fica com a cor
  dela, para nunca virar um filtro esquecido.
- Lançamentos novos já abrem com a carteira escolhida marcada no campo
  Carteira, à vista e trocável.
- Ao fechar o app, volta para Todas.

## Contas do mês

- **Mensal**: repete sem fim (celular, internet, aluguel, assinatura).
- **Parcelada**: tem fim ("12x, já paguei 4"). Mostra "parcela 5 de 12 ·
  faltam R$ ..." e se encerra sozinha depois da última.
- **Débito automático**: no dia, o sino pergunta se caiu; um toque lança.
- Pagar uma conta lança uma despesa ligada a ela (pessoal, pela categoria).
- O sino avisa de 3 dias antes até o pagamento.

## Metas

Só objetivos: faturar R$ X, fazer N entregas, gastar no máximo R$ Y numa
categoria. Conta a pagar não é meta: mora em Contas do mês. As metas de conta
antigas continuam funcionando até a última parcela.

Meta pausada ou encerrada mostra um símbolo no lugar do percentual (✓ deu
certo, ‖ pausada, — encerrada sem bater). O cálculo não muda.

## Exemplo: o fixo da pizzaria e a bolsa

| Situação | Lançar como |
|---|---|
| R$ 6 por entrega na pizzaria | Receita › Entrega, cliente Pizzaria |
| R$ 300 fixos por semana da pizzaria | Receita › **Fixo**, cliente Pizzaria |
| Salário do emprego CLT | **Outra entrada › Salário** |
| Bolsa de iniciação científica | **Outra entrada › Bolsa** |
| Depositar o dinheiro na lotérica | **Transferência** Dinheiro → Caixa |
| Gasolina | Despesa › Combustível (do corre) |
| Mercado | Despesa › Mercado (pessoal) |
| Parcela do notebook | Contas do mês › Parcelada › Pagar |
