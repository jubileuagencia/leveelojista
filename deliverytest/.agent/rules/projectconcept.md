---
trigger: always_on
---

# 🍎 Concept: B2B Sacolão (Wholesale Produce)

**Cliente/Marca**: Levee Hortifruti
**Nome do App**: Levee Lojista (Provisório)

Este documento define o **Escopo Funcional** do projeto. 
Itens marcados como `[ASD]` ("A Ser Decidido") são pontos em aberto que requerem definição futura, mas não bloqueiam o desenvolvimento inicial (assumiremos defaults sensatos).

## 1. Visão do Produto
Um **E-commerce B2B Híbrido** focado em atacado (restaurantes, mercados, padarias).
O sistema deve ser robusto para alta rotatividade de estoque e variação de preços, funcionando multi-dispositivo (Desktop no escritório, Mobile no chão de loja).

## 2. Mecânicas Confirmadas (Hard Rules)

### 2.1 Público & Acesso
*   **Público**: PJ/Comércios (compra recorrente e em volume).
*   **Cadastro**: Aberto (Self-service).
*   **Aprovação**: Fluxo de aprovação manual `[ASD]`.
    *   *Default Temp*: Aprovação automática ou flag "Pendente" que permite navegar mas não comprar.

### 2.2 Precificação Dinâmica (Tiers)
*   **Lógica**: Sistema de Níveis (Tier System) já existente.
*   **Níveis**: `Bronze` (Base), `Prata`, `Ouro`.
*   **Mecânica**: Desconto percentual (%) sobre o preço base, definido no `ConfigContext` e aplicado via `useTierPrice`.
*   **Fonte da Verdade**: `profiles.tier` no Supabase.

### 2.3 Financeiro
*   **Pagamento**: Boleto Bancário.
*   **Outros Métodos**: `[ASD]`.
*   **Faturamento**: `[ASD]` (Pré-pago ou Pós-pago/Faturado 30 dias).

## 3. Matriz de Decisões (ASD - Reference Board)

Estes itens estão pendentes. Assumiremos os **Defaults Sugeridos** até ordem contrária:

| Área | Questão | Status | Default Sugerido (MVP) |
| :--- | :--- | :--- | :--- |
| **Produtos** | Unidade de Venda (Kg vs Cx)? | `ASD` | **Unidade Híbrida**: Vender por "Unidade" (ex: 1 Caixa, 1 Maço) para simplificar UI. Evitar decimais (1.5kg) no MVP se possível. |
| **Estoque** | Travamento de Venda? | `ASD` | **Soft Stop**: Avisar "Estoque Baixo" mas permitir venda (furo), gerando alerta para admin. B2B prefere comprar e negociar a falta depois a ser bloqueado. |
| **Logística** | Roteirização? | `ASD` | **Simples**: Status "Em Separação", "Saiu para Entrega", "Entregue". Sem roteirização inteligente por mapa por enquanto. |
| **Picking** | Painel de Separação? | `ASD` | **Lista Simples**: Uma view de admin "Pedidos do Dia" que serve como checklist digital. |
| **Pedido** | Mínimo de Compra? | `ASD` | **R$ 0,00**: Sem travas iniciais para facilitar testes. |

## 4. Stack & UX
*   **Responsividade**: **Crítica**. O Admin deve operar 100% em Mobile (separação/estoque) e Desktop (gestão/financeiro).
*   **Performance**: Lista de produtos deve aguentar scroll infinito sem travar (virtualização se necessário).

---
*Este documento evolui conforme os `[ASD]` são matados.*
