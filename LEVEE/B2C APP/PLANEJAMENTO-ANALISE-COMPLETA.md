# 📊 PLANEJAMENTO ESTRATÉGICO - ANÁLISE COMPLETA DO BANCO DE DADOS LEVEE HORTIPLUS

**Data:** 02/01/2026
**Objetivo:** Criar análise 360º do negócio com todas as correlações possíveis

---

## 🗂️ ESTRUTURA DO BANCO DE DADOS

### **Tabelas Disponíveis (8 tabelas)**

| Tabela | Registros | Tamanho | Descrição |
|--------|-----------|---------|-----------|
| **export-users** | 3.239 | 5,0 MB | Usuários cadastrados |
| **export-enderecos** | 4.737 | 2,6 MB | Endereços de entrega |
| **export_produtos** | 961 | 928 KB | Catálogo de produtos |
| **export_pedidos** | 4.004 | 6,7 MB | Histórico de pedidos |
| **export_sacola-itens** | ~200k+ | 77 MB | Itens adicionados em sacolas |
| **export_avaliacaos** | 543 | 226 KB | Avaliações de pedidos |
| **export_cupons** | 43 | 238 KB | Cupons de desconto |
| **export_timeslot-entregas** | 31 | 13 KB | Horários de entrega |

**Total:** ~215.000 registros | ~93 MB de dados

---

## 🔗 MAPA DE RELACIONAMENTOS

### **Modelo de Dados (ERD Simplificado)**

```
┌─────────────┐
│   USERS     │─────┐
│ (3.239)     │     │ 1:N
└─────────────┘     │
       │            ├──────> ┌──────────────┐
       │ 1:N        │        │  ENDEREÇOS   │
       │            │        │  (4.737)     │
       │            │        └──────────────┘
       │            │                │
       │            │                │ N:1
       │            │                ▼
       │            │        ┌──────────────┐
       │            └──────> │   PEDIDOS    │<────┐
       │ 1:N                 │   (4.004)    │     │ N:1
       │                     └──────────────┘     │
       │                            │             │
       │                            │ 1:N         │
       │                            ▼             │
       │                     ┌──────────────┐     │
       │                     │ SACOLA-ITENS │     │
       │                     │  (~200k+)    │─────┘
       │                     └──────────────┘
       │                            │
       │                            │ N:1
       │                            ▼
       │                     ┌──────────────┐
       │                     │   PRODUTOS   │
       │                     │    (961)     │
       │                     └──────────────┘
       │
       │ 1:N                 ┌──────────────┐
       └──────────────────> │ AVALIAÇÕES   │
                             │    (543)     │
                             └──────────────┘
                                    │ N:1
                                    ▼
                             ┌──────────────┐
                             │   PEDIDOS    │
                             └──────────────┘

┌──────────────┐             ┌──────────────┐
│    CUPONS    │────────────>│   PEDIDOS    │
│     (43)     │   N:1       │              │
└──────────────┘             └──────────────┘

┌──────────────┐             ┌──────────────┐
│  TIMESLOTS   │────────────>│   PEDIDOS    │
│     (31)     │   N:1       │              │
└──────────────┘             └──────────────┘
```

### **Chaves de Relacionamento**

| Tabela Origem | Campo | Tabela Destino | Campo | Tipo |
|---------------|-------|----------------|-------|------|
| ENDEREÇOS | `user` | USERS | `email` | N:1 |
| PEDIDOS | `user` | USERS | `email` | N:1 |
| PEDIDOS | `endereço_entrega` | ENDEREÇOS | `unique id` | N:1 |
| PEDIDOS | `cupom_usado` | CUPONS | `codigo` | N:1 |
| PEDIDOS | `horario_entrega` | TIMESLOTS | `timestlot nome` | N:1 |
| SACOLA-ITENS | `user` | USERS | `email` | N:1 |
| SACOLA-ITENS | `pedido` | PEDIDOS | `unique id` | N:1 |
| SACOLA-ITENS | `produto` | PRODUTOS | `unique id` | N:1 |
| AVALIAÇÕES | `user` | USERS | `email` | N:1 |
| AVALIAÇÕES | `pedido` | PEDIDOS | `unique id` | N:1 |

---

## 📈 ANÁLISES ESTRATÉGICAS PLANEJADAS

### **FASE 1: ANÁLISE DEMOGRÁFICA (✅ CONCLUÍDA)**

**Status:** ✅ Completa
**Arquivos:** `relatorio-demografico.html`, `RESUMO-EXECUTIVO-DEMOGRAFICO.md`

**Métricas:**
- ✅ Distribuição por gênero (88% mulheres)
- ✅ Distribuição por faixa etária (70% entre 25-44 anos)
- ✅ Cobertura geográfica (572 bairros, 38 cidades)
- ✅ Métricas logísticas (15,41 km médio, 24,7 min)

---

### **FASE 2: ANÁLISE DE COMPORTAMENTO DE COMPRA** 🆕

**Objetivo:** Entender padrões de compra, frequência, ticket médio e jornada do cliente

#### **2.1. Métricas de Pedidos**

**Dados de `export_pedidos`:**
- Total de pedidos realizados (4.004)
- Status dos pedidos (concluído, cancelado, em andamento)
- Ticket médio por pedido
- Ticket médio por cliente
- Distribuição de pedidos ao longo do tempo (tendência)
- Taxa de conversão (usuários → compradores)
- Taxa de recompra (clientes recorrentes)

#### **2.2. Análise RFM (Recência, Frequência, Valor Monetário)**

**Segmentação de Clientes:**
- **Champions** (R: alto, F: alto, M: alto) - Clientes VIP
- **Loyal Customers** (F: alto) - Clientes fiéis
- **At Risk** (R: baixo, F: alto histórico) - Em risco de churn
- **New Customers** (R: alto, F: baixo) - Novos clientes
- **Lost** (R: muito baixo) - Clientes perdidos

**Métricas:**
- Tempo médio entre compras
- Frequência de compra (semanal, quinzenal, mensal)
- Lifetime Value (LTV) por cliente
- Churn rate (taxa de abandono)

#### **2.3. Análise de Formas de Pagamento**

- Distribuição por forma de pagamento (Pix, Cartão, Dinheiro)
- Ticket médio por forma de pagamento
- Taxa de conversão por forma de pagamento

#### **2.4. Análise Temporal**

- Pedidos por dia da semana
- Pedidos por hora do dia
- Sazonalidade (meses com mais/menos pedidos)
- Tendência de crescimento mês a mês

---

### **FASE 3: ANÁLISE DE PRODUTOS E MIX** 🆕

**Objetivo:** Otimizar catálogo, identificar best-sellers e oportunidades

#### **3.1. Performance de Produtos**

**Dados de `export_produtos` + `export_sacola-itens`:**
- Top 20 produtos mais vendidos (por quantidade)
- Top 20 produtos por faturamento
- Top 20 produtos por frequência (% de pedidos que contém)
- Produtos com maior ticket médio
- Produtos menos vendidos (candidatos a descontinuar)

#### **3.2. Análise de Categorias**

- Distribuição de vendas por categoria
- Crescimento de categorias ao longo do tempo
- Margem de contribuição por categoria
- Cross-sell: Produtos frequentemente comprados juntos

#### **3.3. Análise de Preços**

- Distribuição de produtos por faixa de preço
- Elasticidade de preço (produtos em oferta vs. normais)
- Análise de descontos (efetividade)

#### **3.4. Análise de Estoque**

- Produtos em falta (zero estoque)
- Produtos com baixo giro
- Produtos com alta demanda (estocar mais)

#### **3.5. Análise Específica - Picadinhos**

**Foco especial nos produtos "Picadinhos" (diferencial da Levee):**
- Penetração: % de pedidos que incluem picadinhos
- Ticket médio de pedidos com picadinhos vs. sem
- Top picadinhos mais vendidos
- Taxa de conversão do "Kit 10 Picadinhos por R$ 5,99"

---

### **FASE 4: ANÁLISE DE ENGAJAMENTO** 🆕

**Objetivo:** Medir efetividade de cupons, programa de indicação e satisfação

#### **4.1. Análise de Cupons**

**Dados de `export_cupons` + `export_pedidos`:**
- Taxa de uso de cupons (% de pedidos com cupom)
- Cupons mais utilizados
- ROI de cupons (desconto dado vs. incremento de vendas)
- Efetividade por tipo de cupom:
  - FRETECASHBACK (7% do carrinho)
  - BEMVINDO (novos clientes)
  - Cupons de parceria
- Valor médio de pedido com cupom vs. sem cupom

#### **4.2. Programa de Indicação**

**Dados de `export_pedidos` (campo "indicado"):**
- Total de clientes indicados
- Taxa de conversão de indicados
- Clientes com mais indicações (embaixadores)
- Cashback gerado por indicações
- ROI do programa de indicação

#### **4.3. Análise de Avaliações**

**Dados de `export_avaliacaos`:**
- Taxa de avaliação (% de pedidos avaliados)
- Distribuição de notas (NPS - Net Promoter Score)
- Sentimento das avaliações:
  - Impressões positivas (top 10)
  - Impressões negativas (top 10 problemas)
- Correlação entre nota e:
  - Tempo de entrega
  - Valor do pedido
  - Entregador
  - Horário de entrega

#### **4.4. Programa "Compartilhe e Ganhe Cashback"**

- Taxa de compartilhamento no Instagram
- Cashback médio gerado
- ROI da campanha

---

### **FASE 5: ANÁLISE DE LOGÍSTICA E OPERAÇÕES** 🆕

**Objetivo:** Otimizar rotas, horários e eficiência operacional

#### **5.1. Análise de Horários de Entrega**

**Dados de `export_timeslot-entregas` + `export_pedidos`:**
- Horários mais demandados
- Horários com menor utilização (oportunidade)
- Distribuição de pedidos por timeslot
- Taxa de ocupação por horário
- Tempo médio de preparação + entrega por horário

#### **5.2. Análise de Entregadores**

**Dados de `export_pedidos` (campo "entregador"):**
- Performance por entregador:
  - Quantidade de entregas
  - Avaliação média
  - Tempo médio de entrega
  - Taxa de problemas
- Otimização de rotas por entregador

#### **5.3. Análise de Rotas**

- Rotas mais eficientes (bairros próximos)
- Custo de frete médio por distância
- Oportunidade de consolidação de entregas

#### **5.4. Análise de "Entrega Especial"**

- Taxa de uso da entrega especial
- Perfil de clientes que usam
- Satisfação com o serviço
- Precificação adequada?

---

### **FASE 6: ANÁLISE DE SACOLA (ABANDONO)** 🆕

**Objetivo:** Reduzir abandono de carrinho e aumentar conversão

#### **6.1. Taxa de Abandono**

**Dados de `export_sacola-itens`:**
- Total de sacolas criadas
- Total de sacolas convertidas em pedido
- Taxa de abandono de carrinho
- Valor médio de carrinhos abandonados

#### **6.2. Análise de Abandono**

- Produtos mais abandonados
- Etapa do funil onde abandonam (produto, endereço, pagamento)
- Tempo médio entre adicionar item e finalizar compra
- Correlação entre abandono e:
  - Horário do dia
  - Dia da semana
  - Valor total do carrinho
  - Frete alto

#### **6.3. Oportunidade de Recuperação**

- Campanhas de recuperação de carrinho
- Estimativa de receita recuperável
- Usuários com sacolas ativas (não finalizadas)

---

## 🎯 ANÁLISES CRUZADAS (CORRELAÇÕES)

### **1. Perfil Demográfico × Comportamento de Compra**

- Ticket médio por faixa etária
- Frequência de compra por gênero
- Produtos preferidos por região geográfica
- Horários de entrega preferidos por perfil

### **2. Produtos × Avaliações**

- Produtos com melhores avaliações
- Produtos com mais reclamações
- Correlação entre preço e satisfação

### **3. Cupons × LTV**

- LTV de clientes adquiridos com cupom vs. orgânicos
- Dependência de cupons (clientes que só compram com desconto)

### **4. Indicação × Retenção**

- Taxa de recompra de clientes indicados vs. orgânicos
- LTV de clientes indicados

### **5. Logística × Satisfação**

- Correlação entre distância e avaliação
- Correlação entre horário e satisfação
- Impacto da "entrega especial" na nota

---

## 📊 DASHBOARDS E RELATÓRIOS FINAIS

### **Dashboard 1: Visão Executiva (KPIs Principais)**
- Faturamento total
- Ticket médio
- Clientes ativos
- Taxa de recompra
- NPS
- Crescimento mês a mês

### **Dashboard 2: Análise de Clientes**
- Segmentação RFM
- LTV por segmento
- Churn rate
- Novos clientes vs. recorrentes

### **Dashboard 3: Análise de Produtos**
- Top sellers
- Crescimento de categorias
- Produtos para descontinuar
- Oportunidades de cross-sell

### **Dashboard 4: Análise de Marketing**
- ROI de cupons
- Performance de indicações
- Custo de Aquisição de Cliente (CAC)
- Canais de aquisição (UTM)

### **Dashboard 5: Análise Operacional**
- Eficiência de entregas
- Performance de entregadores
- Ocupação de timeslots
- Custos logísticos

---

## 🛠️ STACK TÉCNICA

### **Ferramentas de Análise:**
- **Node.js** - Processamento de dados
- **Chart.js** - Visualizações interativas
- **HTML/CSS** - Dashboards web
- **JSON** - Formato de dados

### **Bibliotecas Auxiliares:**
- **date-fns** - Manipulação de datas
- **lodash** - Operações em arrays/objetos
- **simple-statistics** - Cálculos estatísticos

---

## 📅 CRONOGRAMA DE EXECUÇÃO

| Fase | Descrição | Prioridade | Status |
|------|-----------|------------|--------|
| **Fase 1** | Análise Demográfica | Alta | ✅ Concluída |
| **Fase 2** | Comportamento de Compra (RFM, Pedidos) | Alta | ⏳ Próxima |
| **Fase 3** | Produtos e Mix | Alta | 🔜 Planejada |
| **Fase 4** | Engajamento (Cupons, Avaliações) | Média | 🔜 Planejada |
| **Fase 5** | Logística e Operações | Média | 🔜 Planejada |
| **Fase 6** | Análise de Sacola (Abandono) | Alta | 🔜 Planejada |
| **Final** | Dashboard Unificado 360º | Alta | 🔜 Planejada |

---

## 🎯 RESULTADOS ESPERADOS

### **Impactos no Negócio:**

1. **Aumento de Receita (10-20%)**
   - Otimização de mix de produtos
   - Recuperação de carrinhos abandonados
   - Upsell e cross-sell baseados em dados

2. **Redução de Custos (5-15%)**
   - Otimização de rotas de entrega
   - Redução de produtos sem giro
   - Eficiência operacional

3. **Melhoria de Retenção (15-25%)**
   - Campanhas personalizadas por segmento RFM
   - Redução de churn
   - Programa de fidelidade data-driven

4. **Aumento de Satisfação**
   - NPS acima de 70
   - Resolução proativa de problemas
   - Experiência personalizada

---

## 📄 ESTRUTURA DE ARQUIVOS

```
LEVEE/
├── banco de dados/
│   ├── export-users.json
│   ├── export-enderecos.json
│   ├── export_produtos.json
│   ├── export_pedidos.json
│   ├── export_sacola-itens.json
│   ├── export_avaliacaos.json
│   ├── export_cupons.json
│   └── export_timeslot-entregas.json
│
├── analises/
│   ├── 1-demografica/
│   │   ├── analise-demografica.cjs
│   │   ├── analise-demografica-resultado.json
│   │   ├── relatorio-demografico.html
│   │   └── RESUMO-EXECUTIVO-DEMOGRAFICO.md
│   │
│   ├── 2-comportamento-compra/
│   │   ├── analise-rfm.cjs
│   │   ├── analise-pedidos.cjs
│   │   ├── analise-temporal.cjs
│   │   └── relatorio-comportamento.html
│   │
│   ├── 3-produtos-mix/
│   │   ├── analise-produtos.cjs
│   │   ├── analise-categorias.cjs
│   │   ├── analise-cross-sell.cjs
│   │   └── relatorio-produtos.html
│   │
│   ├── 4-engajamento/
│   │   ├── analise-cupons.cjs
│   │   ├── analise-avaliacoes.cjs
│   │   ├── analise-indicacoes.cjs
│   │   └── relatorio-engajamento.html
│   │
│   ├── 5-logistica/
│   │   ├── analise-horarios.cjs
│   │   ├── analise-entregadores.cjs
│   │   ├── analise-rotas.cjs
│   │   └── relatorio-logistica.html
│   │
│   └── 6-sacola/
│       ├── analise-abandono.cjs
│       └── relatorio-abandono.html
│
├── dashboard-360.html (unificado)
├── PLANEJAMENTO-ANALISE-COMPLETA.md (este arquivo)
└── README-GERAL.md
```

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. ✅ Validar estrutura de todas as tabelas
2. 🔄 Criar script de análise de comportamento de compra (Fase 2)
3. 📊 Gerar relatório HTML com gráficos de RFM
4. 🎯 Identificar oportunidades quick-wins
5. 📈 Criar dashboard executivo com KPIs principais

---

**Criado em:** 02/01/2026
**Versão:** 1.0
**Próxima Atualização:** Após conclusão da Fase 2

🍉 **Levee Hortiplus - Análise 360º do Negócio**
