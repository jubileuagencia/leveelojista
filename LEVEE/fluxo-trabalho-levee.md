# Fluxo de Trabalho — Levee Hortiplus

**Versão:** 1.0
**Data:** 2026-03-04
**Responsável:** Fernando (AIOS Master)

---

## 1. Áreas de Trabalho

### 1.1 B2C Operação
**Escopo:** App delivery (Bubble.io), gestão de catálogo, pedidos, promoções, análise de dados

| Responsável | Função |
|-------------|--------|
| Fernando | Tech lead, análise de dados, integrações, Bubble MCP |
| Karol | Calendário promocional, ofertas, comunicação com cliente |

**Ferramentas:** Bubble.io, App Ordenação Produtos (Vercel), Scripts de análise (CJS/Python)

**Atividades recorrentes:**
- Monitorar pedidos e entregas (diário)
- Atualizar catálogo de produtos e preços (semanal)
- Gerenciar promoções e cupons (semanal)
- Análise de métricas B2C — ticket médio, abandono, sazonalidade (quinzenal)
- Dump atualizado do banco de dados via Bubble MCP (mensal)

### 1.2 B2B Desenvolvimento
**Escopo:** App e-commerce atacado (em desenvolvimento), PRD, pesquisas, MVP

| Responsável | Função |
|-------------|--------|
| Fernando | Tech lead, arquitetura, desenvolvimento (Supabase/N8N/Asaas) |
| Gabriel | Design UI/UX, wireframes, protótipos |

**Ferramentas:** Supabase (planejado), N8N (planejado), Asaas (planejado), Figma

**Atividades recorrentes:**
- Sprints de desenvolvimento (quando ativo)
- Review de PRD e ajustes de escopo (quinzenal quando ativo)
- Pesquisa de mercado e validação (sob demanda)

### 1.3 Marketing & Social
**Escopo:** Instagram, conteúdo visual, campanhas, crescimento de audiência

| Responsável | Função |
|-------------|--------|
| Karol | Social media, copy, calendário editorial, stories/reels |
| Gabriel | Design de posts, vídeos, edição |

**Ferramentas:** Instagram Business, Canva/Figma, ManyChat (futuro)

**Atividades recorrentes:**
- Planejamento editorial semanal (segunda)
- Criação de conteúdo visual (terça-quinta)
- Publicação e gestão de posts (diário)
- Relatório de métricas de engajamento (semanal)
- Análise de crescimento da audiência (mensal)

### 1.4 Vendas & Atendimento
**Escopo:** iFood, WhatsApp, atendimento ao cliente, SAC

| Responsável | Função |
|-------------|--------|
| Karol | Atendimento WhatsApp, gestão iFood, SAC |
| Fernando | Automações, integrações, chatbot (futuro) |

**Ferramentas:** WhatsApp Business, iFood Partner, Evolution API (planejado)

**Atividades recorrentes:**
- Atendimento WhatsApp (diário)
- Gestão de pedidos iFood (diário)
- Revisão de avaliações e feedback (semanal)
- Ajuste de cardápio iFood (quinzenal)

---

## 2. Calendário de Recorrência

### Diário
- [ ] Monitorar pedidos e entregas no app B2C
- [ ] Responder mensagens WhatsApp
- [ ] Gestão pedidos iFood

### Semanal (Segunda)
- [ ] Reunião de planejamento semanal (pauta: promoções, conteúdo, operação)
- [ ] Definir promoções da semana no app
- [ ] Planejamento editorial Instagram

### Quinzenal (1ª e 3ª segunda do mês)
- [ ] Análise de dados B2C (dashboard métricas)
  - Pedidos vs semana anterior
  - Ticket médio
  - Top produtos
  - Taxa de cancelamento
  - Novos clientes vs recorrentes
- [ ] Revisão catálogo de produtos (preços, visibilidade, estoque)
- [ ] Ajuste cardápio iFood

### Mensal (Primeiro dia útil)
- [ ] Dump banco de dados produção via Bubble MCP
- [ ] Relatório mensal de performance
  - Receita total e comparativo MoM
  - Crescimento de clientes
  - Análise de abandono de carrinho
  - Métricas Instagram (seguidores, alcance, engajamento)
- [ ] Calendário promocional do mês seguinte
  - Datas comemorativas
  - Produtos sazonais
  - Ofertas especiais
- [ ] Revisão de estoque e fornecedores

### Trimestral
- [ ] Análise estratégica completa (cohort, LTV, churn)
- [ ] Revisão e atualização do PRD B2B
- [ ] Benchmark de concorrentes
- [ ] Atualização do perfil AIOS e documentação

---

## 3. Workflow por Tipo de Tarefa

### Promoção/Oferta no App
```
1. Karol define oferta (produto, desconto, duração)
2. Fernando ativa no Bubble (preço antigo, preço novo, flag "em oferta")
3. Karol cria post Instagram + stories
4. Gabriel produz arte/vídeo se necessário
5. Publicação e monitoramento
6. Análise de resultados pós-promoção
```

### Análise de Dados B2C
```
1. Fernando executa dump via Bubble MCP
2. Fernando roda scripts de análise (CJS/Python)
3. Fernando gera relatório com métricas-chave
4. Compartilha insights com equipe
5. Karol e Fernando definem ações baseadas nos dados
```

### Nova Feature no App B2C
```
1. Karol ou cliente identifica necessidade
2. Fernando avalia viabilidade no Bubble
3. Fernando implementa no version-test
4. Teste e validação
5. Deploy para produção
```

### Conteúdo Instagram
```
1. Karol define pauta da semana (segunda)
2. Gabriel cria artes/vídeos (terça-quinta)
3. Karol escreve copy
4. Review e aprovação
5. Publicação nos horários definidos
6. Engajamento e respostas
```

---

## 4. Métricas de Acompanhamento (KPIs)

### B2C App
| KPI | Meta Mensal | Baseline (Fev/2026) |
|-----|-------------|---------------------|
| Pedidos | 500+ | 550 |
| Receita | R$75.000+ | ~R$84.000 |
| Ticket médio | R$150+ | R$153 |
| Taxa entrega | >92% | 92,8% |
| Taxa cancelamento | <7% | 6,9% |
| Novos clientes | 50+ | a medir |

### Instagram
| KPI | Meta Mensal | Baseline |
|-----|-------------|----------|
| Seguidores | +500/mês | 23.8k |
| Alcance | a definir | a medir |
| Engajamento | >3% | a medir |

### iFood
| KPI | Meta Mensal | Baseline |
|-----|-------------|----------|
| Avaliação | >4.5 | a medir |
| Pedidos | a definir | a medir |

---

## 5. Ferramentas AIOS Ativas

| Ferramenta | Status | Uso |
|------------|--------|-----|
| Bubble MCP | Ativo (produção) | Acesso direto ao banco B2C |
| ClickUp | Ativo | Gestão de tarefas (tags: levee, levee-b2c, levee-b2b) |
| Notion | Ativo | Documentação centralizada |
| Scripts de análise | Ativo | Análises demográficas e comportamentais |
| App Ordenação | Ativo | Gestão de prateleira virtual |

---

## 6. Contatos e Responsáveis

| Pessoa | Área Principal | ClickUp ID |
|--------|---------------|------------|
| Fernando | Tecnologia, Dados, Estratégia | 466187 |
| Karol | Marketing, Operação, Atendimento | 3161900 |
| Gabriel | Design, Vídeo, Assets | 3212457 |

---

*Documento gerado pelo AIOS Master (Orion) como parte do cadastro Levee no AIOS — Task 86afxcp98*
