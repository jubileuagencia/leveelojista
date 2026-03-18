# Tarefas — Evolucao novob2b (Sacolao B2B)

**Data:** 2026-03-12
**Base:** Respostas da reuniao com gestor + analise AIOS
**Nomenclatura Tier:** Ouro / Platina / Diamante (substituindo Bronze/Silver/Gold)

---

## Visao Geral das Fases

```
FASE 5 — Fundacao (schema + cadastro + config)          ← PRIMEIRO
FASE 6 — Pagamentos (Mercado Pago + split)              ← SEGUNDO
FASE 7 — Entrega + Frete                                ← TERCEIRO
FASE 8 — UX Pricing (desconto PIX + Tier visual)        ← QUARTO
FASE 9 — Tier Automatico + Campanhas                    ← QUINTO
FASE 10 — NF/ERP Bling                                  ← POS-MVP (90%+)
FASE 11 — Notificacoes (email + futuro WhatsApp)         ← POS-MVP
```

---

## FASE 5 — Fundacao: Schema de Produtos + Cadastro PF/PJ

> Tudo que muda a base de dados e o fluxo de cadastro. Deve ser feito primeiro pois as outras fases dependem.

### ~~T5.0 — Importacao da Base Real de Produtos (1014 itens)~~ ✅ CONCLUIDA (2026-03-18)
**Agente:** @data-engineer
**Dependencia:** T5.1 (schema precisa estar pronto antes da importacao)
**Fonte:** `docs/export_All-Produtos-modified--_2026-03-11_14-43-10.json`
**Descricao:**
Base real do Bubble exportada com 1014 produtos (735 visiveis). Estrutura atual:

| Campo origem | Valores | Mapeamento destino |
|---|---|---|
| `tipo_unidade` | KG (160), UN (679), BJ (73), PC (101), CX (1) | `product_variants.unit_type` |
| `preço novo` | Preco principal | `product_variants.unit_price` (variante primaria) |
| `preço antigo` | Preco anterior | `products.original_price` (exibir riscado) |
| `preço por kg` | Preenchido em 196 produtos | `product_variants.unit_price` (variante KG quando disponivel) |
| `peso por unidade` | Peso em gramas | `product_variants.weight_grams` |
| `qtd por unidade` | Texto (ex: "300g") | Parse para `weight_grams` |
| `categorias_produto` | Multi-valor separado por ` , ` | Criar/mapear categorias (split) |
| `cod` | Codigo interno (ex: "019250") | `products.sku` |
| `ean` | Codigo de barras | `products.ean` |
| `foto` | URL CDN Bubble | Migrar para Supabase Storage ou manter URL |
| `descriçao` | Texto rico | `products.description` |
| `info nutricional` | Texto formatado | `products.nutritional_info` (novo campo) |
| `como armazenar` | Texto | `products.storage_instructions` (novo campo) |
| `visivel` | "sim"/"nao" | `products.is_active` |
| `em oferta` | "sim"/"nao" | `products.on_sale` (novo campo) |
| `desconto` | % desconto | `products.sale_discount_pct` (novo campo) |
| `ordem_prateleira` | Inteiro | `products.sort_order` |
| `relacionados` | Nomes de produtos | `product_relations` (futuro, nao MVP) |

**O que FALTA na base para B2B (gestor precisa preencher):**
- `preco_caixa` — preco fixo quando vendido por caixa (para produtos que aceitam)
- `peso_caixa_kg` — quantos KG tem 1 caixa daquele produto
- `aceita_caixa` — flag boolean: este produto pode ser vendido por caixa?
- (mesma logica para bandeja se aplicavel)

**Tarefas:**
1. Criar script Node.js de importacao (`scripts/import-products-bubble.ts`)
2. Mapear campos conforme tabela acima
3. Tratar multi-categorias (split por ` , ` e criar/linkar)
4. Popular `product_variants` com variante primaria (tipo_unidade atual)
5. Gerar relatorio de importacao: sucesso/erro/warnings
6. Rodar em dry-run primeiro, depois commit real

**Entregavel:** Script de importacao + relatorio + base populada

**Resultado (2026-03-18):**
- 1014 produtos importados, 1087 variantes criadas, 23 categorias sincronizadas
- 915/917 imagens migradas do Bubble CDN → Supabase Storage (`product-images`)
- 2 imagens com 403 (Ovos Caipirao SKU 002409 e 002511) — upload manual necessario
- Arquivos: `scripts/import-products-bubble.mjs`, `scripts/migrate-images-to-supabase.mjs`
- Relatorios: `docs/relatorio-importacao-commit.md`, `docs/relatorio-migracao-imagens.md`

---

### ~~T5.1 — Migration: Schema de Produtos com Variantes de Unidade~~ ✅ CONCLUIDA (2026-03-18)
**Agente:** @data-engineer
**Dependencia:** Nenhuma
**Descricao:**
Schema redesenhado com base nos dados reais (5 tipos: KG, UN, BJ, PC, CX):

- Tabela `product_variants` (1 produto → N variantes de venda):
  - `id` UUID PK
  - `product_id` FK → products
  - `unit_type` TEXT — 'kg', 'un', 'bj' (bandeja), 'pc' (pacote), 'cx' (caixa)
  - `unit_label` TEXT — label de exibicao (ex: "Caixa 20kg", "Bandeja 500g", "Pacote 300g")
  - `unit_price` DECIMAL(10,2) — preco fixo desta variante
  - `weight_grams` INTEGER nullable — peso em gramas desta variante
  - `allows_fractional` BOOLEAN default false — permite 2,5kg? (true so para KG)
  - `is_default` BOOLEAN default false — variante padrao exibida no card
  - `sort_order` INTEGER default 0
- Novos campos em `products`:
  - `sku` TEXT (codigo interno, ex: "019250")
  - `ean` TEXT (codigo de barras)
  - `original_price` DECIMAL(10,2) nullable (preco antigo, para exibir riscado)
  - `nutritional_info` TEXT nullable
  - `storage_instructions` TEXT nullable
  - `on_sale` BOOLEAN default false
  - `sale_discount_pct` DECIMAL(5,2) nullable
- Manter campos atuais (name, description, price, category_id, image_url, is_active, sort_order)
- Campo `products.price` se torna o preco de referencia; precos reais vem das variantes
- RLS: mesmas regras atuais (clientes leem ativos, admins CRUD)
- Atualizar RPC `bulk_upsert_products` para suportar variantes
- Indices: product_id + unit_type UNIQUE, product_id + is_default

**Entregavel:** Migration SQL + RPC atualizada + indices

**Resultado (2026-03-18):**
- Migration 009: `supabase/migrations/009_product_variants_schema.sql`
- Migration 010: `supabase/migrations/010_fix_product_unit_enum.sql` (adicionou 'bj' e 'pc' ao enum)
- Tabela `product_variants` criada com RLS, indices UNIQUE e partial
- Novos campos em `products`: sku, ean, original_price, nutritional_info, storage_instructions, on_sale, sale_discount_pct, sort_order

---

### ~~T5.2 — Migration: Cadastro PF (CPF) + Renomear Tiers~~ ✅ CONCLUIDA (2026-03-18)
**Agente:** @data-engineer
**Dependencia:** Nenhuma
**Descricao:**
- Alterar tabela `profiles`:
  - `document_type` enum: 'cpf' | 'cnpj'
  - `document_number` (campo unificado — substitui campo cnpj)
  - `company_name` nullable (obrigatorio so para PJ)
  - `trade_name` nullable (razao social — so PJ)
- Renomear enum de Tier: bronze→ouro, silver→platina, gold→diamante
- Migration para converter dados existentes
- Manter `is_admin` / `is_super_admin` RPCs funcionando

**Entregavel:** Migration SQL + backfill de dados existentes

**Resultado (2026-03-18):**
- Migration 011: `supabase/migrations/011_cadastro_pf_rename_tiers.sql`
- Enum `user_tier` renomeado: bronze→ouro, silver→platina, gold→diamante
- Novos campos em `profiles`: document_type, document_number, trade_name
- Backfill de cnpj existente → document_number
- Trigger `handle_new_user` atualizado para novos campos
- `app_config.tier_discounts` atualizado com novas chaves
- 20 arquivos TS/TSX atualizados (tipos, stores, hooks, components, pages)
- TypeScript build: 0 erros

---

### ~~T5.3 — Frontend: Formulario de Cadastro PF/PJ~~ ✅ CONCLUIDA (2026-03-18)
**Agente:** @dev
**Dependencia:** T5.2
**Descricao:**
- Toggle "Pessoa Fisica / Pessoa Juridica" no formulario de registro
- PF: nome, CPF (mascara), email, telefone, endereco (CEP auto-fill)
- PJ: razao social, nome fantasia, CNPJ (mascara), email, telefone, endereco
- Validacao Zod diferenciada por tipo
- Manter fluxo multi-step existente, adaptando campos

**Entregavel:** RegisterForm atualizado + tipos TypeScript

**Resultado (2026-03-18):**
- Toggle PF/PJ no Step 2 com visual claro (botões com ícones)
- PF: nome completo + CPF (máscara XXX.XXX.XXX-XX) + validação algorítmica
- PJ: razão social + nome fantasia (opcional) + CNPJ (máscara existente)
- Schemas Zod separados: `step2PFSchema` e `step2PJSchema`
- Ao trocar tipo, limpa campos do documento anterior
- Signup envia: document_type, document_number, company_name, trade_name
- Migration 012: corrige trigger para restaurar criação de endereço (removida pela 011)
- TypeScript build: 0 erros
- Arquivos: `RegisterForm.tsx`, `012_fix_handle_new_user_address.sql`

---

### ~~T5.4 — Frontend: Card de Produto com Variantes de Unidade~~ ✅ CONCLUIDA (2026-03-18)
**Agente:** @dev
**Dependencia:** T5.1
**Descricao:**
- Seletor de unidade no ProductCard (ex: toggle "KG | Caixa | Bandeja")
- Preco atualiza conforme unidade selecionada
- Input de quantidade: decimal para KG (step 0.1), inteiro para caixa/unidade
- Alerta visual: "O peso pode variar alguns gramas" para produtos fracionados
- Adaptar carrinho para registrar: produto + variante + quantidade + unidade
- Adaptar checkout e historico de pedidos para exibir unidade corretamente

**Entregavel:** ProductCard, Cart, Checkout atualizados

**Resultado (2026-03-18):**
- Migration 013: `cart_items` e `order_items` com `variant_id`, quantity NUMERIC, RPC atualizada
- Tipos: `ProductVariant` interface, CartItem/OrderItem com variant_id/unit_type
- Services: queries com `variants:product_variants(*)` em todos os fetches
- **ProductCard**: seletor de variante (botões), quantidade fracionária 0.1 para KG, alerta "peso pode variar"
- **ProductPage**: seletor de variante expandido com preço por unidade, info nutricional/armazenamento
- **Cart Store**: addItem com variant, unique por (product_id + variant_id), preço da variante
- **CartPage**: exibe label da variante, quantidade formatada (fracionária para kg)
- **StepReview**: exibe badge de unidade por item, preço da variante
- **OrderDetailsPage**: exibe unit_type no histórico
- **CartSheet**: corrigido para usar preço da variante
- Helper: `src/lib/unit-labels.ts` com UNIT_LABELS e UNIT_SHORT
- TypeScript build: 0 erros
- Arquivos alterados: 12 (migration + 11 TS/TSX)

---

### ~~T5.5 — Admin: CRUD de Variantes no Produto~~ ✅ CONCLUIDA (2026-03-18)
**Agente:** @dev
**Dependencia:** T5.1
**Descricao:**
- No ProductFormModal (admin), adicionar secao "Variantes de Venda":
  - Adicionar/remover variantes (unidade, preco, peso, permite fracionado)
  - Pelo menos 1 variante obrigatoria
- Na planilha Google Sheets, adicionar colunas para variantes (se ja existir integracao)
- Atualizar service `products.ts` e hooks

**Entregavel:** Admin ProductForm atualizado + service

**Resultado (2026-03-18):**
- ProductFormModal reescrito com secao "Variantes de Venda": add/remove variantes, tipo de unidade, rotulo, preco, peso, permite fracionado, padrao
- UNITS expandido: adicionados `bj` (Bandeja) e `pc` (Pacote)
- Admin services: queries incluem `variants:product_variants(*)`, novas funcoes `fetchVariants()` e `saveVariants()` (upsert + delete)
- Novo hook `useSaveVariants()` com invalidacao de cache
- Variantes salvas em sequencia apos salvar produto (create ou update)
- Arquivos: `ProductFormModal.tsx`, `admin/services/products.ts`, `admin/hooks/useProducts.ts`

---

### ~~T5.6 — Admin: Config Dinamica Expandida~~ ✅ CONCLUIDA (2026-03-18)
**Agente:** @dev
**Dependencia:** T5.2
**Descricao:**
- Adicionar na ConfigPage (admin):
  - Horario de corte para pedidos (default: 18:00) — editavel
  - Valor minimo para frete gratis (default: R$300) — editavel
  - Percentual desconto PIX (default: 5%) — editavel, com aviso: "Lembre-se de atualizar tambem no Mercado Pago"
  - Raio maximo de entrega em KM (editavel)
- Salvar em `app_config` no Supabase

**Entregavel:** ConfigPage expandida + migration para novos campos app_config

**Resultado (2026-03-18):**
- ConfigPage refatorada: secao "Descontos por Tier" (existente) + nova secao "Entrega & Pagamento"
- Novos campos: horario de corte (time input), frete gratis minimo (R$), desconto PIX (%) com aviso Mercado Pago, raio de entrega (km)
- Service generico `getConfigValue`/`setConfigValue` com upsert
- Hooks: `useDeliveryConfig()` e `useUpdateDeliveryConfig()`
- Config-store expandido: `delivery` com real-time subscription
- Migration 014: seed `delivery_config` em `app_config`
- Lint fix: refatorado useEffect+setState → pattern de form separado (React Compiler friendly)
- Arquivos: `ConfigPage.tsx`, `admin/services/config.ts`, `admin/hooks/useConfig.ts`, `config-store.ts`, `014_delivery_config.sql`

---

## FASE 6 — Pagamentos: Mercado Pago com Split

> Integracao com Mercado Pago. Requer conta MP do gestor + conta MP da Jubileu para split.

### ~~T6.1 — Arquitetura de Pagamentos~~ ✅ CONCLUIDA (2026-03-18)
**Agente:** @architect
**Dependencia:** Nenhuma
**Descricao:**
- Documentar arquitetura da integracao Mercado Pago:
  - Checkout Pro (redirect) vs Checkout Bricks (inline) vs API direta
  - Split de pagamento: marketplace (sacolao recebe, Jubileu recebe comissao)
  - Webhooks para confirmacao (IPN / Webhooks v2)
  - Fluxo PIX: gerar QR → webhook confirma → atualizar pedido
  - Fluxo Cartao: tokenizar → cobrar → webhook confirma
  - Fluxo "Pagar na Entrega": pedido criado como "pendente_pagamento_entrega"
- Decidir: Edge Function (Supabase) ou API Route (servidor) para backend do MP
- Modelagem de status do pedido atualizada

**Entregavel:** Documento de arquitetura `docs/architecture/mercadopago-integration.md`

**Resultado (2026-03-18):**
- Decisao: **Checkout Pro** (redirect) para PIX/Boleto + "Pagar na Entrega" (interno, sem MP)
- Backend: **Express API Routes** (`/api/mp/*`) no `server.js` — nao Edge Functions (cold start, limites)
- Split: **Application Fee** (marketplace Jubileu recebe comissao por transacao)
- Novos status: `pending_payment`, `pending_delivery_payment`
- Nova tabela: `payment_transactions` (historico completo de transacoes)
- Webhook com validacao HMAC-SHA256 + idempotencia
- Documento: `docs/architecture/mercadopago-integration.md` (14 secoes, ~300 linhas)

---

### T6.2 — Backend: Integracao Mercado Pago
**Agente:** @dev
**Dependencia:** T6.1
**Descricao:**
- Criar backend (Edge Function ou API Route) para:
  - Criar preferencia de pagamento (PIX / Cartao)
  - Configurar split (marketplace_fee para Jubileu)
  - Receber webhook de confirmacao
  - Atualizar status do pedido no Supabase
- Secrets: `MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`, `JUBILEU_MP_COLLECTOR_ID`
- Tabela `payment_transactions` para historico de pagamentos

**Entregavel:** Backend de pagamento + migration tabela transactions

---

### T6.3 — Frontend: Checkout com Mercado Pago
**Agente:** @dev
**Dependencia:** T6.2
**Descricao:**
- Tela de pagamento no checkout com 3 opcoes:
  - **PIX**: gera QR Code/copia-cola, tela de "aguardando pagamento" com polling/websocket
  - **Cartao**: formulario Mercado Pago Bricks (credito/debito)
  - **Pagar na Entrega**: confirmacao direta, pedido fica como "pendente_entrega"
- Preco atualiza em tempo real conforme metodo (PIX tem desconto)
- Timeout visual para PIX (ex: "Pague em ate 30 minutos")

**Entregavel:** Checkout flow atualizado com 3 metodos

---

### T6.4 — Admin: Filtro de Pedidos por Metodo de Pagamento
**Agente:** @dev
**Dependencia:** T6.2
**Descricao:**
- Na pagina de Pedidos (admin), adicionar filtro:
  - "Pagos" (PIX confirmado, cartao aprovado)
  - "Pagar na Entrega" (pendente_pagamento_entrega)
  - "Aguardando Pagamento" (PIX gerado mas nao confirmado)
- Badges visuais diferenciados para cada status de pagamento
- Acao manual do admin: marcar pedido "pagar na entrega" como "pago"

**Entregavel:** OrdersPage com filtros de pagamento + status manual

---

## FASE 7 — Entrega e Frete

### T7.1 — Backend: Logica de Data de Entrega
**Agente:** @dev
**Dependencia:** T5.6 (config dinamica)
**Descricao:**
- Funcao que calcula data de entrega baseada em:
  - Hora do pedido vs horario de corte (config admin, default 18h)
  - Se antes do corte → dia seguinte
  - Se depois do corte → daqui a 2 dias
- Exibir data estimada no checkout antes de finalizar
- Salvar `estimated_delivery_date` no pedido

**Entregavel:** Funcao de calculo + campo no pedido + exibicao no checkout

---

### T7.2 — Backend: Calculo de Frete por Distancia
**Agente:** @dev
**Dependencia:** T5.6 (config raio KM), depende de P11 (valor do frete)
**Descricao:**
- Calcular distancia entre endereco do sacolao e endereco do cliente
  - Opcao 1: Google Maps Distance Matrix API
  - Opcao 2: Calculo por CEP com tabela de faixas
- Regra: se subtotal >= R$300 (config) → frete gratis; senao → cobrar frete
- Validar se endereco esta dentro do raio maximo (config admin)
- Se fora do raio → mensagem "Nao entregamos nesse endereco"

**Entregavel:** Funcao de frete + validacao de area + exibicao no carrinho/checkout

**BLOQUEADO POR:** P11 (valor do frete abaixo de R$300)

---

## FASE 8 — UX de Pricing: Desconto PIX + Tier Visual

### T8.1 — Frontend: Preco PIX nos Cards e Carrinho
**Agente:** @dev
**Dependencia:** T5.6 (config % desconto PIX)
**Descricao:**
- ProductCard exibe dois precos:
  - Preco cheio (riscado)
  - Preco PIX com desconto (destacado): "R$9,50 no PIX"
- Carrinho mostra subtotal com e sem desconto PIX
- Checkout: preco atualiza ao trocar metodo de pagamento
  - PIX selecionado → desconto aplicado
  - Cartao/Entrega selecionado → preco cheio
- Desconto PIX ACUMULA com desconto de Tier
  - Ex: Platina (4%) + PIX (5%) = 9% de desconto

**Entregavel:** ProductCard, Cart, Checkout com pricing dinamico

---

### ~~T8.2 — Frontend: Renomear Tiers para Ouro/Platina/Diamante~~ ✅ CONCLUIDA (2026-03-18)
**Agente:** @dev
**Dependencia:** T5.2 (migration rename)
**Descricao:**
- Atualizar todos os componentes visuais:
  - TierBadge: cores e labels (Ouro=amarelo, Platina=cinza-prata, Diamante=azul)
  - AdminClientDetailsModal: exibir novo nome
  - ConfigPage: labels dos descontos por Tier
- Atualizar textos e tooltips

**Resultado (2026-03-18):** Realizada junto com T5.2 — 20 arquivos TS/TSX atualizados com novos nomes e cores de tier.

**Entregavel:** Componentes visuais de Tier atualizados

---

## FASE 9 — Tier Automatico + Base para Campanhas

> Depende das respostas P13-P15 para detalhamento completo.

### T9.1 — Backend: Subida Automatica de Tier
**Agente:** @data-engineer + @dev
**Dependencia:** T5.2, depende de P13 (thresholds)
**Descricao:**
- RPC ou cron job que avalia total gasto por cliente em intervalo (ex: ultimo mes)
- Se atingiu threshold → promover Tier automaticamente
- Se caiu abaixo → rebaixar (ou manter — definir politica)
- Notificar cliente por email ao subir de Tier

**BLOQUEADO POR:** P13 (thresholds de cada Tier)

---

### T9.2 — Admin: Modulo de Campanhas (base)
**Agente:** @dev
**Dependencia:** Depende de P14, P15
**Descricao:**
- CRUD basico de campanhas no admin:
  - Nome, descricao, tipo (desconto %, valor fixo, frete gratis)
  - Data inicio / data fim
  - Condicoes (valor minimo, Tier minimo, produto especifico)
  - Status (ativa/inativa)
- Aplicar campanhas ativas no checkout

**BLOQUEADO POR:** P14, P15 (detalhes de campanhas)

---

## FASE 10 — Integracao Bling (NF) — Pos-MVP

> So iniciar apos 90%+ do app construido, conforme orientacao do gestor.

### T10.1 — Arquitetura Integracao Bling
**Agente:** @architect
**Dependencia:** Nenhuma (pode ser feita em paralelo como research)
**Descricao:**
- Documentar integracao Bling v3 API:
  - Criar pedido de venda no Bling a partir do pedido do novob2b
  - Mapear campos: produtos, quantidades, cliente, enderecos
  - NF sera emitida manualmente no Bling (fase 1)
  - Envio de NF por email ao cliente (fase 2)
- Avaliar: NF-e (PJ→PJ) vs NFC-e (PJ→PF) — configurar ambas no Bling

**Entregavel:** `docs/architecture/bling-integration.md`

---

### T10.2 — Backend: Sync Pedido → Bling
**Agente:** @dev
**Dependencia:** T10.1, T6.2
**Descricao:**
- Ao confirmar pedido pago, enviar automaticamente para o Bling:
  - Criar contato (se nao existe)
  - Criar pedido de venda
  - Mapear produtos com SKU/codigo
- Status no admin: "Enviado para Bling" com link direto

**Entregavel:** Integracao Bling + status visual no admin

---

## FASE 11 — Notificacoes

### T11.1 — Email de Confirmacao de Pedido
**Agente:** @dev
**Dependencia:** T6.2
**Descricao:**
- Email transacional ao criar pedido:
  - Resumo do pedido (itens, valores, metodo pagamento)
  - Data estimada de entrega
  - Status do pagamento
- Email ao mudar status do pedido (separando, saiu para entrega, entregue)
- Provider: Resend, SendGrid ou Supabase Auth (avaliar)

**Entregavel:** Templates de email + trigger de envio

---

## Resumo — Mapa de Dependencias

```
T5.1 (schema variantes) ──→ T5.0 (importacao 1014 produtos) ──→ T5.4 (card variantes) + T5.5 (admin variantes)
T5.2 (schema PF/Tier) ───→ T5.3 (form PF) + T8.2 (rename Tier)
T5.6 (config dinamica) ──→ T7.1 (data entrega) + T7.2 (frete) + T8.1 (preco PIX)
T6.1 (arq MP) ───────────→ T6.2 (backend MP) ──→ T6.3 (checkout) + T6.4 (filtros) + T11.1 (emails)
T5.2 + P13 ──────────────→ T9.1 (tier auto) [BLOQUEADO]
P14 + P15 ───────────────→ T9.2 (campanhas) [BLOQUEADO]
T10.1 (arq Bling) ───────→ T10.2 (sync Bling) [POS-MVP]
```

## Ordem de Execucao Recomendada

| Prioridade | Tasks | Pode comecar | Agente |
|------------|-------|--------------|--------|
| 1 | T5.1 (schema variantes) | Agora | @data-engineer |
| 1 | T5.2 (schema PF/Tier) | Agora (paralelo) | @data-engineer |
| 1 | T5.6 (config dinamica) | Agora (paralelo) | @dev |
| 1 | T6.1 (arquitetura MP) | Agora (paralelo) | @architect |
| 2 | T5.0 (importacao produtos) | Apos T5.1 | @data-engineer |
| 2 | T5.3 (form PF) | Apos T5.2 | @dev |
| 3 | T5.4 (card variantes) | Apos T5.0 | @dev |
| 3 | T5.5 (admin variantes) | Apos T5.0 | @dev |
| 4 | T6.2, T6.3, T6.4 | Apos T6.1 | @dev |
| 5 | T7.1 (data entrega) | Apos T5.6 | @dev |
| 5 | T8.1 (preco PIX) | Apos T5.6 | @dev |
| 5 | T8.2 (rename Tier) | Apos T5.2 | @dev |
| 6 | T7.2 (frete) | Apos P11 respondida | @dev |
| 7 | T9.1, T9.2 | Apos P13-P15 respondidas | @data-engineer + @dev |
| 8 | T10.1, T10.2 | Pos-MVP | @architect + @dev |
| 9 | T11.1 (emails) | Apos T6.2 | @dev |

---

## Agentes Envolvidos

| Agente | Tasks |
|--------|-------|
| @data-engineer | T5.0, T5.1, T5.2, T9.1 |
| @architect | T6.1, T10.1 |
| @dev | T5.3, T5.4, T5.5, T5.6, T6.2, T6.3, T6.4, T7.1, T7.2, T8.1, T8.2, T9.2, T10.2, T11.1 |
| @qa | Validacao de cada fase apos conclusao |

---

*Documento gerado por @aios-master — AIOS v2.0*
*15 perguntas pendentes em `docs/pendencias-sacolao.md`*
*Ao responder as pendencias, tasks bloqueadas serao desbloqueadas*
