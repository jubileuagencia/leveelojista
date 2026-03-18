# Pendencias Internas — Decisoes Jubileu (Diego)

**Data:** 2026-03-12
**Status:** Aguardando respostas do Diego
**Contexto:** Duvidas que surgiram da analise das respostas do doc de esclarecimentos

---

## PI-1. Mercado Pago Split — Comissao Jubileu

Para configurar o split de pagamento no Mercado Pago precisamos de:

- [ ] Conta MP do sacolao (Erick) como seller/vendedor — ja existe?
- [ ] Conta MP da Jubileu como marketplace/collector — ja existe?
- [ ] Percentual da comissao da Jubileu (ex: 5%? 10%? valor fixo por pedido?)

> Sem isso nao conseguimos configurar o split na T6.2.

---

## PI-2. Desconto PIX — Aplicado no Sistema ou no Mercado Pago?

Voce mencionou que ao alterar o % de desconto PIX no admin, "devera aparecer notificacao avisando para atualizar no MP tambem".

Duas opcoes:

| Opcao | Como funciona | Implicacao |
|-------|---------------|------------|
| **A) Desconto no nosso sistema** | Calculamos o preco com desconto e enviamos o valor ja reduzido para o MP | Nosso sistema controla, MP so cobra o valor final. Mais flexivel. |
| **B) Desconto configurado no MP** | MP aplica desconto automatico para PIX, nos so exibimos | Menos controle, mas MP garante consistencia. |

**Qual opcao?** Recomendamos a **Opcao A** (desconto no sistema) porque:
- Temos controle total do percentual
- Funciona com acumulo de Tier + PIX
- Nao depende de config manual no painel do MP

---

## PI-3. Fotos dos Produtos — Migrar ou Manter CDN Bubble?

A base tem 1014 fotos hospedadas em `cdn.bubble.io`. Opcoes:

| Opcao | Prós | Contras |
|-------|------|---------|
| **A) Manter URLs do Bubble** | Zero trabalho, funciona imediato | Se cancelar o Bubble, perde TODAS as fotos. Dependencia externa. |
| **B) Migrar para Supabase Storage** | Fotos nossas, sem dependencia. URLs estaveis. | Task extra (~2-3h): script para baixar e reupar. |

**Recomendacao:** Opcao B (migrar). A task T5.0 (importacao) ja pode incluir isso.

**Decisao:**
- [ ] Manter Bubble (opcao A)
- [ ] Migrar para Supabase (opcao B) — recomendado

---

## PI-4. Categorias Multi-Valor — Mudar Schema?

Varios produtos na base tem categorias compostas:
- `"Legumes , Higienizados , Kit Processados"`
- `"Verduras , Kit Processados , Higienizados"`
- `"Bebidas , Laticíneos"`

Isso significa que 1 produto pertence a N categorias. O schema atual do novob2b e **1 categoria por produto** (FK `category_id`).

Opcoes:

| Opcao | Schema | Impacto |
|-------|--------|---------|
| **A) Manter 1 categoria** | Usar a primeira categoria do split como principal | Simples, sem mudanca no schema. Perde sub-categorias. |
| **B) Multi-categoria (N:N)** | Tabela `product_categories` (product_id, category_id) | Mais preciso, permite filtrar por "Higienizados" por exemplo. Muda schema + frontend. |
| **C) Categoria principal + tags** | 1 FK principal + campo `tags[]` para as demais | Meio-termo: filtro principal funciona, tags para busca/filtro secundario. |

**Recomendacao:** Opcao C (categoria principal + tags). Menor impacto no schema atual e resolve o problema.

**Decisao:**
- [ ] Opcao A — 1 categoria (simples)
- [ ] Opcao B — Multi-categoria N:N
- [ ] Opcao C — Categoria principal + tags — recomendado

---

## Resumo

| # | Pergunta | Bloqueia | Urgencia |
|---|----------|----------|----------|
| PI-1 | % comissao Jubileu no split MP | T6.2 Backend MP | ALTA |
| PI-2 | Desconto PIX no sistema ou MP? | T6.2 + T8.1 | ALTA |
| PI-3 | Migrar fotos do Bubble? | T5.0 Importacao | MEDIA |
| PI-4 | Multi-categorias? | T5.1 Schema + T5.0 | MEDIA |

---

*Gerado por @aios-master — AIOS v2.0*
