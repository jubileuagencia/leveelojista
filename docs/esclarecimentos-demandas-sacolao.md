# Esclarecimentos — Demandas Reuniao Sacolao B2B

**Data da reuniao:** 2026-03-12
**Documento:** Perguntas de esclarecimento para validar entendimento
**Status:** Aguardando respostas

---
DIego: @aios-master gere um documento com as duvidas não respondidas para que eu esclareca posteriormente

## 1. Janela de Entrega e Corte de Pedidos

**Demanda original:**
> Janela de entrega de 8 horas. Aceitar pedidos ate 18h para entregar no dia seguinte (entre 8 as 18). A partir de 18h01: somente daqui a 2 dias.

**Nosso entendimento:**
- Pedido feito ate 18:00 de segunda → entrega na terca (entre 8h-18h)
- Pedido feito as 18:01 de segunda → entrega na quarta (entre 8h-18h)
- A "janela de 8 horas" se refere ao intervalo 8h-16h ou 8h-18h para o cliente receber?

r A entrega ainda não tem horario, mas será feita no dia seguinte se o pedido foi feito ate as 18 hrs

**Perguntas:**

| # | Pergunta | Por que precisamos saber |
|---|----------|--------------------------|
| 1.1 | A janela de 8h e exatamente das 8h as 16h, ou das 8h as 18h (10h)? Ha uma inconsistencia entre "janela de 8 horas" e o horario "8 as 18" (que sao 10h). Qual e o correto? | Define o que mostramos ao cliente como prazo de entrega |
8 as 18 hrs, 10 hrs, mas isso será administrado pela separação de pedidos para separação, pelo horario de compra
| 1.2 | O cliente pode escolher uma faixa horaria dentro da janela (ex: manha 8-12, tarde 12-18) ou e janela unica? | Impacta a UX do checkout e a logistica |
sem resposta disso no momento
| 1.3 | Entrega funciona nos finais de semana e feriados? Se pedido for feito sexta as 17h, entrega e sabado ou segunda? | Regra de calculo de datas precisa considerar dias uteis vs corridos |
sem esta resposta no momento
| 1.4 | O horario de corte (18h) e fixo ou o gestor quer poder alterar pelo admin? Ex: mudar para 17h em determinadas epocas | Define se e config dinamica ou hardcoded |
esta questão será definida na guia de separação de pedidos para separação, quanto a previsão de entrega será sim definida com a regra das 18 hrs mas será dinamica podendo ser alterada no menu de configuração do admin
| 1.5 | Existe pedido minimo para entrega? (Alem do frete gratis acima de R$300) | Pode haver valor minimo de pedido separado do frete gratis |
não há valor minimo
| 1.6 | Ha limite de pedidos por dia/rota? Ex: se ja tem 50 entregas amanha, bloqueia novos pedidos para esse dia? | Impacta se precisamos de sistema de capacidade/slots |
sem resposta no momento 
---

## 2. Variacao de Produtos — KG e Volume (Caixa)

**Demanda original:**
> Variacao de produtos B2B. Comprar por KG ou Volume (caixa).

**Nosso entendimento:**
- Um mesmo produto pode ser vendido por KG ou por caixa
- Ex: Tomate → R$8,90/kg OU R$45,00/caixa (5kg)

**Perguntas:**

| # | Pergunta | Por que precisamos saber |
|---|----------|--------------------------|
| 2.1 | O cliente escolhe se quer comprar por KG ou por caixa no momento da compra, ou cada produto tem uma unica unidade de venda? | Define se e um toggle no card do produto ou se ja vem definido |
de acordo com o relatado pelo gestor ha clientes acostumados a comprar por caixa logo o cliente podera comprar tanto por kg quanto por caixa, grande parte dos produtos terão essa opção de kg ou caixa, mas nao serão todos, informarei quando subirmos a planilha de produtos real
| 2.2 | Existe relacao fixa entre KG e caixa? Ex: 1 caixa = sempre X kg? Ou varia por produto? | Precisamos saber se armazenamos o peso por caixa em cada produto |
sem resposta no momento
| 2.3 | O preco por KG e o preco por caixa sao independentes, ou o preco da caixa e calculado automaticamente (ex: preco_kg * peso_caixa)? | Define modelagem do banco — 1 preco ou 2 precos por produto |
o preço da caixa será fixo de cada produto
| 2.4 | Existem outras unidades alem de KG e caixa? Ex: unidade, bandeja, saco, engradado? | Precisamos de um campo "tipo de unidade" flexivel ou so KG/caixa |
teremos bandejas tb, unidade etc, deverá ser flexivel
| 2.5 | O estoque e controlado em qual unidade? Se o cliente compra 2 caixas, baixa X kg do estoque? | Impacta a logica de estoque e relatorios |
ainda não entramos na etapa de gestão de estoque, crie uma questão no novo doc sobre como será gerido o estque
| 2.6 | Ha quantidade minima por produto? Ex: minimo 5kg ou 1 caixa? | Validacao no carrinho |
não ha pedido minimo, o cleinte deverá pagar o frete de qualquer maneira
| 2.7 | Produtos fracionados (ex: 2,5kg) sao permitidos, ou so quantidades inteiras? | Define se o input e inteiro ou decimal |
fracionado épossivel, desde que tenha o alerta de que o produto pode variar alguns gramas

---

## 3. Pagamento: Pix, Cartao, Pagar na Entrega

**Demanda original:**
> Pagamento: Pix/cartao/pagar na entrega.

**Perguntas:**

| # | Pergunta | Por que precisamos saber |
|---|----------|--------------------------|
| 3.1 | PIX: sera gerado QR Code/copia-e-cola automatico no checkout, ou o cliente paga manualmente para uma chave fixa? | Define se precisamos integrar gateway de pagamento (ex: Mercado Pago, Stripe, Asaas) ou so mostrar chave PIX |
utilizaremos mercadopago com split de pagamento para pegar parte para nossa agencia
| 3.2 | Cartao: credito, debito, ou ambos? Aceita parcelamento? Se sim, ate quantas vezes? | Define configuracao do gateway |
sera definido no mercado pago, mas aceitará nos dois
| 3.3 | Pagar na entrega: aceita quais formas? (dinheiro, maquininha, PIX na hora?) | Impacta o fluxo — pedido fica como "pendente" ate entrega | pedido podera ser alterado status manualmente pelo admin para aprovado e etc, aceitara dinehiro, cartões e pix na hora, é importante ter um filtro na pagina de gestão de pedidos que separe peiddos pagos para pedidos para pagar na entrega
| 3.4 | Ja usa algum gateway de pagamento ou maquininha especifica? (Mercado Pago, Stone, Cielo, PagSeguro?) | Precisamos integrar com o que ele ja usa |
sera mercadopago no b2b
| 3.5 | Pedido com "pagar na entrega" tem limite de valor? Ex: ate R$500 pode pagar na entrega, acima so PIX/cartao? | Regra de negocio para mitigar risco de calote |
sem respotsa no momento
| 3.6 | Se o PIX nao for confirmado em X minutos, o pedido cancela automaticamente? Qual o timeout? | Define logica de expiracao |
isso é definidp no mercadopago? confirmar
| 3.7 | Ha necessidade de comprovante automatico (recibo/email) apos pagamento confirmado? | Escopo do MVP de pagamentos | sim claro, trabalharemos com email de confirmação e futuramente notificações pelo wpp

---

## 4. Nota Fiscal e Integracao ERP

**Demanda original:**
> Quer que emita nota fiscal? Integracao do ERP/Emissor de nota.

**Perguntas:**

| # | Pergunta | Por que precisamos saber |
|---|----------|--------------------------|
| 4.1 | Ja usa algum ERP ou emissor de NF atualmente? Qual? (Bling, Tiny, Omie, Nuvemshop, Sefaz direto?) | Define qual integracao construir | usaremos o bling provavelmente, a decidr a plataforma, mas provaelmente bling
| 4.2 | A nota fiscal e NF-e (produto) ou NFC-e (consumidor)? Ou ambas dependendo se o cliente e PJ/PF? | Tipos diferentes de integracao | não sei a difeerença, me esclareça pro favor
| 4.3 | A NF deve ser emitida automaticamente ao confirmar pedido, ou manualmente pelo gestor? | Define se e automacao total ou botao no admin | 
os pedidos serão enviados para o bling e de la serão emitidas manualmente, posteriormente trabalharemos automações para essa questão
| 4.4 | O cliente recebe a NF por email automaticamente? Ou so disponivel para download no historico? | Escopo da feature de NF |
no email tb
| 4.5 | Essa integracao e prioridade para o MVP ou pode vir em fase posterior? | Ajuda a priorizar o roadmap |
após a construção de 90% + do app, focaremos nas nfs
| 4.6 | Tem certificado digital A1 ativo para emissao de NF? | Pre-requisito tecnico | não sei, provavel, caso não tenha cobraremos, coloque como quetsão de confirmação no novo doc

---

## 5. Cadastro Aberto — Sem Pre-Aprovacao

**Demanda original:**
> Nao tera pre-aprovacao, qualquer CNPJ ou CPF pode comprar.

**Nosso entendimento:**
- Qualquer pessoa (PF ou PJ) pode se cadastrar e comprar imediatamente
- Sem necessidade de aprovacao manual pelo admin

**Perguntas:**

| # | Pergunta | Por que precisamos saber |
|---|----------|--------------------------|
| 5.1 | O cadastro atual do novob2b exige CNPJ. Agora aceitara tambem CPF (pessoa fisica). O formulario de cadastro muda — quais dados sao obrigatorios para PF vs PJ? | PF nao tem razao social, inscricao estadual, etc. | caso pj razaão social, caso cpf nome 
| 5.2 | PF e PJ terao os mesmos precos e condicoes? Ou PJ tem preco diferenciado? | Pode impactar o sistema de pricing |
mesmo preço
| 5.3 | Existe algum limite para novos cadastros? Ex: limite de valor no 1o pedido, ou bloqueio de "pagar na entrega" para novos clientes? | Protecao contra fraude/calote | boa questão, coloque no novo doc
| 5.4 | O sistema de Tier se aplica tanto para PF quanto PJ? | Define se tiers sao universais | sim

---

## 6. Frete Gratis Acima de R$300

**Demanda original:**
> Frete gratis acima de 300.

**Perguntas:**

| # | Pergunta | Por que precisamos saber |
|---|----------|--------------------------|
| 6.1 | Qual o valor do frete quando abaixo de R$300? E fixo ou varia por regiao/distancia? | Define se precisamos de tabela de frete ou valor unico | coloque no novo doc
| 6.2 | A regiao de entrega e limitada? (Ex: so Belo Horizonte, so Grande BH, raio de X km?) | Precisamos de validacao por CEP |será por distancia de km que poderá ser definido no menu de conifg do admin
| 6.3 | O gestor quer poder alterar o valor minimo para frete gratis (R$300) pelo admin? | Config dinamica vs fixa | sim
| 6.4 | O valor de R$300 e sobre o subtotal (antes do desconto PIX) ou total final? | Impacta calculo do carrinho | sem resposta no momento

---

## 7. Sistema de Tier — Campanhas e Fidelidade

**Demanda original:**
> Sistema de Tier: campanhas para estimular o aumento do ticket e fidelidade.

**Nosso entendimento:**
- Ja existe Tier no novob2b (Bronze 0%, Silver 4%, Gold 8% de desconto)
- Gestor quer expandir com campanhas

**Perguntas:**

| # | Pergunta | Por que precisamos saber |
|---|----------|--------------------------|
| 7.1 | O sistema de Tier atual (Bronze/Silver/Gold com % de desconto) atende, ou quer algo diferente? | Validar se reaproveitamos ou redesenhamos | vamos deixar assim por enquanto
| 7.2 | Como o cliente sobe de Tier? Automatico por volume de compras (ex: comprou R$5000 no mes → Gold) ou manual pelo gestor? | Define se e regra automatica ou promocao manual | será por valor gasto num x intervalo de tempo
| 7.3 | "Campanhas" se refere a que tipo? Exemplos: cupom de desconto, "compre X ganhe Y", frete gratis por tempo limitado, desconto progressivo? | Cada tipo e uma feature diferente | pelo valor gasto será liberado premiações, isso nao definido ainda o que seria, mas é bom que consideremos
| 7.4 | O gestor quer criar/gerenciar campanhas pelo admin panel, ou nos criamos as campanhas fixas? | Define se e um modulo de campanhas no admin ou configs manuais | sem resposta 
| 7.5 | Campanhas tem prazo de validade (inicio/fim)? | Impacta modelagem e automacao | sem resposta
| 7.6 | Ha ideia de quais sao os Tiers e beneficios? Ex: Bronze (0-1000/mes), Silver (1000-3000), Gold (3000+)? | Precisamos dos thresholds e beneficios de cada nivel | sem resposta

---

## 8. Preco PIX com Desconto no Card

**Demanda original:**
> Mostrar preco do PIX com desconto de 5% no card do produto.

**Nosso entendimento:**
- No card do produto, exibir dois precos: preco cheio e preco com 5% de desconto (PIX)
- Ex: ~~R$10,00~~ **R$9,50 no PIX**

**Perguntas:**

| # | Pergunta | Por que precisamos saber |
|---|----------|--------------------------|
| 8.1 | O desconto de 5% e fixo ou o gestor quer poder alterar a %? | Config dinamica vs fixa | poderá alterar no admin, mas acredito que isso deverá ser alterado na config do mercadopago em conjunto, se confirmado que sim, uma notificação no painel do adminn deverá aparecer avisando essa necessidade
| 8.2 | O desconto PIX acumula com o desconto do Tier? Ex: Gold (8%) + PIX (5%) = 13%? Ou e so o maior? | Regra de acumulo de descontos | acumulo de descontos
| 8.3 | O desconto PIX aparece so no card ou tambem no carrinho e checkout? | Define onde aplicar visualmente | em ambos
| 8.4 | Se o cliente muda de PIX para cartao no checkout, o preco atualiza automaticamente (perde o desconto)? | UX do checkout |
sim

---

## Resumo — Decisoes Criticas para Priorizar

| Tema | Impacto | Urgencia |
|------|---------|----------|
| Gateway de pagamento (qual?) | Bloqueia PIX automatico e cartao | Alta — define toda a stack de pagamento |
| ERP/NF (qual sistema?) | Bloqueia emissao de NF | Media — pode ser fase 2 |
| Regiao de entrega (CEPs validos) | Bloqueia calculo de frete | Alta — validacao no checkout |
| Regras de Tier (thresholds) | Necessario para campanhas | Media — Tier basico ja existe |
| KG vs Caixa (modelagem) | Muda schema do banco | Alta — impacta toda a experiencia de compra |

---

diego: @aios-master mudaremos a nomeclatura de bronze/prata/ouro para ouro/platina/diamante 

*Documento gerado por @aios-master — AIOS v2.0*
*Aguardando respostas para gerar tasks no ClickUp*
