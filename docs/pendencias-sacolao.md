# Pendencias — Perguntas Sem Resposta (Sacolao B2B)

**Data:** 2026-03-12
**Status:** Aguardando esclarecimento com o gestor
**Instrucao:** Responda cada item e retorne este doc para gerarmos as tasks correspondentes.

---

## ENTREGA

| # | Pergunta | Contexto |
|---|----------|----------|
| P1 | O cliente podera escolher faixa horaria (manha/tarde) ou a entrega e janela unica 8-18h? | Impacta UX do checkout — se for janela unica, nao precisamos de picker de horario |
| P2 | Entrega funciona sabado, domingo e feriados? Se pedido for feito sexta 17h, entrega e sabado ou segunda? | Precisamos saber se o calculo de data usa dias uteis ou corridos |
| P3 | Existe limite de entregas por dia? Ex: lotou 50 entregas amanha, bloqueia novos pedidos para esse dia? | Se sim, precisamos de sistema de capacidade/slots |

## PRODUTOS

| # | Pergunta | Contexto |
|---|----------|----------|
| P4 | Qual a relacao entre KG e caixa em cada produto? Ex: 1 caixa de tomate = 20kg (fixo por produto)? Ou nao ha relacao? | Precisamos saber se armazenamos "peso_por_caixa" em cada produto |
| P5 | Como sera gerido o estoque? Controle por unidade (KG)? Ou sem controle de estoque no sistema (gerido externamente)? | Define se construimos modulo de estoque ou se o sistema nao controla estoque |

## PAGAMENTO

| # | Pergunta | Contexto |
|---|----------|----------|
| P6 | "Pagar na entrega" tem limite de valor? Ex: ate R$500 pode pagar na entrega, acima so PIX/cartao? | Protecao contra calote — recomendamos ter um limite configuravel |
| P7 | Confirmar: o timeout do PIX (ex: 30min para pagar) e definido na config do Mercado Pago ou queremos controlar no sistema tambem? | Se o MP ja cancela automaticamente, so precisamos ouvir o webhook |

## NOTA FISCAL

| # | Pergunta | Contexto |
|---|----------|----------|
| P8 | **NF-e vs NFC-e — Esclarecimento:** NF-e (modelo 55) e para vendas entre empresas (PJ→PJ), exige dados completos do comprador. NFC-e (modelo 65) e para venda ao consumidor final (PJ→PF), como cupom fiscal eletronico. Como o sacolao vendera para PF e PJ, provavelmente precisara de ambas. **Confirmar com o contador do gestor qual modelo(s) sera(ao) usado(s).** | O Bling suporta ambos, mas a config muda |
| P9 | O gestor possui certificado digital A1 ativo? Se nao, precisara adquirir (~R$150-300/ano). | Pre-requisito para emissao de NF via Bling |

## CADASTRO / SEGURANCA

| # | Pergunta | Contexto |
|---|----------|----------|
| P10 | Para clientes novos, ha alguma restricao de seguranca? Sugestoes: (a) bloquear "pagar na entrega" nos primeiros X pedidos, (b) limite de valor no 1o pedido, (c) nenhuma restricao. Qual prefere? | Protecao contra fraude. Recomendamos ao menos bloquear "pagar na entrega" para contas com 0 pedidos |

## FRETE

| # | Pergunta | Contexto |
|---|----------|----------|
| P11 | Qual o valor do frete para pedidos abaixo de R$300? E um valor fixo (ex: R$15) ou varia por distancia? | Se varia por distancia, precisamos de tabela de faixas de KM com precos |
| P12 | O frete gratis de R$300 e calculado sobre o subtotal (antes do desconto PIX/Tier) ou sobre o valor final com descontos? | Ex: carrinho R$310 com desconto PIX vira R$294,50 — tem frete gratis ou nao? |

## TIER / CAMPANHAS

| # | Pergunta | Contexto |
|---|----------|----------|
| P13 | Quais sao os thresholds de cada Tier? Ex: Ouro (0-R$2000/mes), Platina (R$2000-R$5000/mes), Diamante (R$5000+/mes)? E quais os descontos de cada? | Sem esses numeros nao podemos implementar a subida automatica |
| P14 | O gestor quer um modulo no admin para criar/gerenciar campanhas (cupons, promocoes), ou campanhas serao feitas manualmente por nos quando necessario? | Define se construimos um CRUD de campanhas ou se e config manual |
| P15 | Campanhas terao prazo de validade (data inicio/fim)? | Se sim, precisamos de automacao para ativar/desativar |

---

**Total: 15 perguntas pendentes**
Prioridade: P4, P5, P6, P11, P13 sao as mais criticas para iniciar o desenvolvimento.
