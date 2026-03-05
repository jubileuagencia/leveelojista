# Snapshot Banco de Dados B2C — Bubble.io
**Data:** 2026-03-04
**Ambiente:** version-test
**API:** https://leveehort.com.br/version-test/api/1.1/obj
**Autenticação:** Bearer token (configurado no AIOS MCP)

---

## Contagem de Registros

| Tabela | Registros | Descrição |
|--------|-----------|-----------|
| produtos | 546 | Catálogo de produtos |
| pedidos | 94 | Pedidos realizados |
| sacolaitens | 333 | Itens no carrinho |
| cobranças | 114 | Cobranças/pagamentos |
| cupons | 6 | Cupons de desconto |
| timeslot_entrega | 27 | Slots de entrega |
| **TOTAL** | **1.120** | |

> **NOTA:** Este é o ambiente `version-test`. Os números são menores que os dados históricos (análises de 2025 usaram exports com ~215k registros incluindo Users e Endereços). Users e Endereços NÃO estão expostos na Data API.

---

## Schema Completo

### cobranças (22 campos)
| Campo | Tipo |
|-------|------|
| cartao_salvo | custom.cartaosalvo |
| charge_id | text |
| creator | option.creator |
| erro | text |
| forma de pagamento | option.formas_de_pagamento |
| id_cobrança | text |
| numero_pedido | number |
| pago | boolean |
| payment_Intent_id | text |
| payment_metodh_id | text |
| pedido | custom.pedidos |
| pix_code | text |
| qr_code_64 | text |
| status | text |
| user | user |
| valor_pos | number |
| valor_pre | number |
| Created Date | date |
| Modified Date | date |
| Created By | user |
| unique ID | text |
| Slug | text |

### cupons (24 campos)
| Campo | Tipo |
|-------|------|
| codigo | text |
| desconto no frete | boolean |
| valor desconto | number |
| descrição | text |
| destinatarios | option.destinatario_cupom |
| expiração | date |
| max por user | number |
| parceria | boolean |
| porcentagem sob | text |
| quantidade | number |
| status | boolean |
| tipo_desconto | option.tipo_desconto_cupom |
| titulo popup | text |
| user | list.user |
| usos | list.custom.usodecupons |
| usou maximo | list.user |
| tem maximo | boolean |
| desconto maximo | number |
| valor min compra | number |
| Created Date | date |
| Modified Date | date |
| Created By | user |
| unique ID | text |
| Slug | text |

### pedidos (46 campos)
| Campo | Tipo |
|-------|------|
| action logs | list.custom.actionlog |
| avaliaçao | custom.avaliacao |
| campaign medium | text |
| campaign name | text |
| campaign source | text |
| cartao_selecionado | custom.cartaosalvo |
| cobranças | list.custom.cobranças |
| cupom_usado | custom.cupons |
| desconto | number |
| em_rota | boolean |
| endereço_entrega | custom.endereços |
| entrega | boolean |
| entrega_hoje | boolean |
| entrega padrao | boolean |
| entregador | user |
| estimativa_entrega | number |
| forma de pagamento | option.formas_de_pagamento |
| horario_entrega | custom.timeslot_entrega |
| indicado | user |
| itens pedido | list.custom.pedidositens |
| justificativa | text |
| lançamento cashback | custom.extratosaldo |
| lançamento indicação | custom.extratosaldo |
| nota para entrega | text |
| nota | text |
| numero pedido | number |
| pago | boolean |
| payment_intent | text |
| prazo_entrega | date |
| prazo_entrega_final | date |
| sacola_itens | list.custom.sacolaitens |
| status_pedido | option.status_pedido |
| subtotal | number |
| taxa de entrega | number |
| teste | boolean |
| total | number |
| total pos pesagem | number |
| troco | boolean |
| troco valor | number |
| user | user |
| uso do saldo | number |
| Created Date | date |
| Modified Date | date |
| Created By | user |
| unique ID | text |
| Slug | text |

### produtos (29 campos)
| Campo | Tipo |
|-------|------|
| categorias_produto | list.option.categorias |
| cod | text |
| como armazenar | text |
| demanda | number |
| desconto | number |
| descriçao | text |
| ean | text |
| em oferta | boolean |
| estoque | number |
| foto | list.image |
| info nutricional | text |
| nome | text |
| ordem_prateleira | number |
| peso por unidade | number |
| peso/und | option.und_peso |
| preço novo | number |
| preço por kg | number |
| preço antigo | number |
| relacionados | list.custom.produtos |
| qtd por unidade | text |
| subcategorias | list.option.subcategoria_produto |
| tag | list.text |
| tipo_unidade | option.tipo_unidade |
| visivel | boolean |
| Created Date | date |
| Modified Date | date |
| Created By | user |
| unique ID | text |
| Slug | text |

### sacolaitens (21 campos)
| Campo | Tipo |
|-------|------|
| att_separacao | boolean |
| criador da lista | user |
| nota | text |
| pedido | custom.pedidos |
| quantidade_g | number |
| preço pós pesagem | number |
| produto | custom.produtos |
| quantidade_g pós pesagem | number |
| quantidade | number |
| quantidade pós pesagem | number |
| sacola compartilhada | custom.sacolacompartilhada |
| status item | option.status_sacola_item |
| tem_pedido | boolean |
| und/peso | option.und_peso |
| user | user |
| valor | number |
| Created Date | date |
| Modified Date | date |
| Created By | user |
| unique ID | text |
| Slug | text |

### timeslot_entrega (16 campos)
| Campo | Tipo |
|-------|------|
| add hora | number |
| cod | text |
| compartilhada | boolean |
| dia | text |
| hora final date | date |
| hora final num | number |
| hora inicial date | date |
| hora inicial num | number |
| ordem | number |
| ponto de retirada | custom.pontosderetirada |
| timestlot nome | text |
| Created Date | date |
| Modified Date | date |
| Created By | user |
| unique ID | text |
| Slug | text |

---

## Tabelas NÃO expostas na Data API
- **Users** (3.239 no export histórico)
- **Endereços** (4.737 no export histórico)
- **Avaliações** (543 no export histórico)

Estas tabelas precisam ser habilitadas no Bubble Editor: Settings > API > Data API > marcar checkbox para cada tipo.

---

## Comparativo com Análises Históricas (exports 2025)

| Tabela | Export 2025 | API Atual | Diferença |
|--------|-------------|-----------|-----------|
| Produtos | 961 | 546 | -415 (possível: produtos inativos removidos) |
| Pedidos | 4.004 | 94 | -3.910 (version-test tem menos dados) |
| Sacola-Itens | ~200.000 | 333 | Muito menor (test env) |
| Cupons | 43 | 6 | -37 |
| Timeslot | 31 | 27 | -4 |
