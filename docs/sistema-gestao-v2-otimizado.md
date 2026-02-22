# Sistema de Gestao Jubileu v2.0 — Plano Otimizado

**Data:** 2026-02-19
**Autor:** Orion (AIOS Master)
**Base:** Analise completa do workspace atual + PRD v1.0 + Resumo da Agencia

---

## Diagnostico: O Que Temos vs. O Que Falta

### O que esta funcionando
- 4 Spaces criados com estrutura hibrida (3 clientes + interno)
- 24 Lists organizados por funcao
- 27 tarefas iniciais com prioridades e tags
- MCP do ClickUp configurado no Claude Code
- API key funcional e testada
- PRD completo com schema Supabase definido

### 10 Problemas Criticos Identificados

| # | Problema | Impacto | Severidade |
|---|---------|---------|------------|
| 1 | **Apenas 2 status (to do / complete)** | Impossivel rastrear progresso, sem visibilidade de "em andamento" ou "em revisao" | CRITICO |
| 2 | **Zero membros alem do Fernando** | Ninguem pode ser assignado, workspace inutilizavel pela equipe | CRITICO |
| 3 | **Zero due dates** | Sem prazos = sem urgencia real, sem alertas, sem cobranca | CRITICO |
| 4 | **Zero assignees** | Tarefas orfas, ninguem sabe o que fazer | CRITICO |
| 5 | **Zero custom fields** | Sem tipo de tarefa, sem estimativa de tempo, sem tracking de cliente | ALTO |
| 6 | **Espaco default com lixo** | "Get Started" e "Projeto 1/2" poluem o workspace | MEDIO |
| 7 | **Statuses em ingles (client spaces) vs portugues (default)** | Inconsistencia confunde a equipe | MEDIO |
| 8 | **Sem subtasks/checklists nos tasks** | Tarefas complexas sem breakdown, impossivel validar entrega | ALTO |
| 9 | **GitHub KB nao criado** | Prompts, SOPs, brand DNA existem apenas na cabeca do Fernando | ALTO |
| 10 | **Supabase nao configurado** | Sem analytics, sem tracking financeiro, sem metricas | MEDIO |

---

## Plano de Otimizacao — 5 Blocos

### BLOCO 1: Correcoes Criticas do ClickUp (Imediato)

**1.1 Workflow de Status Padronizado (todos os Spaces)**

```
Backlog → A Fazer → Em Progresso → Em Revisao → Aprovado → Concluido
```

| Status | Tipo | Cor | Quando Usar |
|--------|------|-----|-------------|
| Backlog | open | #95999f | Ideia registrada, sem previsao de execucao |
| A Fazer | open | #4ea7fc | Proxima na fila, pronta para pegar |
| Em Progresso | custom | #5f55ee | Alguem esta trabalhando agora |
| Em Revisao | custom | #ff7800 | Feito, esperando aprovacao (Karol→Fernando ou Cliente) |
| Aprovado | custom | #6bc950 | Aprovado, pronto para publicar/entregar |
| Concluido | closed | #008844 | Entregue e finalizado |

**Por que 6 e nao 2:** Com apenas "to do / complete" a Karol nao sabe o que o Gabriel esta fazendo, Fernando nao sabe o que precisa aprovar, e ninguem sabe o que esta travado.

**1.2 Custom Fields Essenciais (workspace-level)**

| Field | Tipo | Opcoes | Propósito |
|-------|------|--------|-----------|
| Tipo de Tarefa | Dropdown | Post, Video/Reels, Story, Arte, Estrategia, Desenvolvimento, Reuniao, Admin | Filtrar por tipo de trabalho |
| Cliente | Dropdown | Levee, Caracol, Pelicula, Interno | Cross-space tracking (util no interno) |
| Responsavel Aprovacao | Dropdown | Fernando, Karol, Cliente | Quem aprova antes de "Concluido" |
| Tempo Estimado | Number (horas) | - | Planejamento de capacidade |
| Tempo Real | Number (horas) | - | Tracking de rentabilidade |
| Plataforma | Dropdown | Instagram Feed, Instagram Stories, Instagram Reels, WhatsApp, Substack, Site, ManyChat | Para conteudo: onde vai ser publicado |
| Data de Publicacao | Date | - | Diferente da due date — quando o conteudo vai ao ar |

**1.3 Assignees e Due Dates em Todas as Tarefas**

Regra de atribuicao baseada no tipo:

| Tipo de Tarefa | Assignee Default | Aprovador |
|----------------|-----------------|-----------|
| Post / Arte / Story | Karol | Fernando (estrategico) ou auto-aprovacao (rotina) |
| Video / Reels | Gabriel | Fernando |
| Estrategia | Fernando | - |
| Automacao / Funil | Gabriel | Fernando |
| Desenvolvimento | Diego | Fernando |
| Admin / Financeiro | Karol | Fernando |

**1.4 Limpar Espaco Default**

- Arquivar "Espaco da equipe" (ou deletar Get Started e Projeto 1/2)
- Manter apenas os 4 spaces reais

---

### BLOCO 2: Templates e Automacoes de Tarefas Recorrentes

**2.1 Task Templates com Checklists**

#### Template: Post Instagram (Feed)

```
Nome: [CLIENTE] Post Feed - {tema}
Tipo: Post
Plataforma: Instagram Feed
Checklist:
  [ ] Briefing/tema definido
  [ ] Copy criada (legenda)
  [ ] Arte/design criado
  [ ] Aprovacao do Fernando (se estrategico)
  [ ] Agendado no Instagram
  [ ] Publicado
  [ ] Metricas registradas (24h depois)
Tempo Estimado: 1.5h
Assignee: Karol
```

#### Template: Video/Reels

```
Nome: [CLIENTE] Reels - {tema}
Tipo: Video/Reels
Checklist:
  [ ] Roteiro criado
  [ ] Gravacao realizada
  [ ] Edicao concluida
  [ ] Legenda/copy escrita
  [ ] Thumbnail definida
  [ ] Aprovacao do Fernando
  [ ] Publicado
  [ ] Metricas registradas (48h depois)
Tempo Estimado: 3h
Assignee: Gabriel
```

#### Template: Campanha/Funil

```
Nome: [CLIENTE] Campanha - {nome}
Tipo: Estrategia
Checklist:
  [ ] Objetivo definido
  [ ] Persona mapeada
  [ ] Copy principal criada
  [ ] Criativos (artes/videos) produzidos
  [ ] Landing page pronta (se aplicavel)
  [ ] ManyChat configurado (se aplicavel)
  [ ] Trafego pago configurado (se aplicavel)
  [ ] Aprovacao do Fernando
  [ ] Lancamento executado
  [ ] Acompanhamento D+1
  [ ] Acompanhamento D+7
  [ ] Relatorio de resultados
Tempo Estimado: 10h
Assignee: Fernando (estrategia) + Gabriel (execucao)
```

**2.2 Tarefas Recorrentes por Contrato**

| Cliente | Tarefa Recorrente | Frequencia | Assignee |
|---------|------------------|------------|----------|
| **Levee** | Stories com link delivery | Diario | Karol |
| **Levee** | Post feed | 3x/semana | Karol |
| **Levee** | Revisao de metricas | Semanal | Fernando |
| **Caracol** | Post feed (20/mes) | ~5x/semana | Karol |
| **Caracol** | Captacao presencial | 1x/semana (4h) | Gabriel |
| **Caracol** | Video roteirizado | 1x/semana | Gabriel |
| **Caracol** | Revisao de metricas | Semanal | Karol |
| **Pelicula** | Pelicula do Dia (stories) | Diario | Gabriel |
| **Pelicula** | Jornal Sideral (reels) | 2x/semana | Gabriel |
| **Pelicula** | Spoiler da Semana | Semanal | Gabriel |
| **Todos** | Relatorio semanal interno | Semanal (sexta) | Karol |

---

### BLOCO 3: Estrutura de Delegacao (Resolver Bottleneck Fernando)

**3.1 Matriz de Decisao — O que Fernando PRECISA aprovar vs. O que a equipe decide**

#### Nivel 1: Autonomia Total (Karol + Gabriel decidem)
- Posts de rotina (feed, stories) que seguem o DNA da marca
- Agendamento de conteudo ja aprovado no calendario
- Respostas a comentarios/DMs padrao
- Atualizacao de status no ClickUp
- Upload de conteudo ja editado

#### Nivel 2: Aprovacao Karol (Fernando nao precisa ver)
- Artes e designs dentro do guideline
- Edicao final de videos curtos (stories, reels rotina)
- Pequenos ajustes de copy
- Respostas a clientes sobre entregas

#### Nivel 3: Aprovacao Fernando (deve responder em 24h)
- Novos roteiros de campanha/funil
- Estrategia de trafego pago (budget > R$500)
- Novo posicionamento ou tom de voz
- Propostas para clientes
- Mudancas no app Bubble
- Novos produtos/ofertas

#### Nivel 4: Decisao Conjunta (reuniao semanal)
- Onboarding de novo cliente
- Mudanca de escopo contratual
- Investimentos em ferramentas
- Contratacao de freelancers

**3.2 Regra do Timeout (Auto-Escalation)**

> Se Fernando nao responder uma aprovacao Nivel 3 em **48 horas**, a tarefa e automaticamente aprovada com nota: "Auto-aprovado por timeout. Fernando: revise quando possivel."

Isso resolve o gargalo mais critico da agencia.

---

### BLOCO 4: GitHub Knowledge Base (Executar Agora)

**4.1 Estrutura de Pastas**

```
JUBILEU-AGENCIA/
├── kb/                          # Knowledge Base
│   ├── README.md                # Indice navegavel
│   ├── brand-dna/
│   │   ├── levee-hortiplus.md   # Tom, visual, guidelines
│   │   ├── caracol.md
│   │   └── pelicula-sideral.md
│   ├── personas/
│   │   ├── levee-personas.md
│   │   ├── caracol-personas.md
│   │   └── pelicula-personas.md
│   ├── sops/
│   │   ├── criacao-conteudo-ia.md
│   │   ├── onboarding-cliente.md
│   │   ├── producao-video.md
│   │   ├── gestao-trafego-pago.md
│   │   └── workflow-clickup.md
│   └── playbooks/
│       ├── lancamento-instagram.md
│       └── funil-manychat.md
├── prompts/
│   ├── README.md
│   ├── content/
│   │   ├── copy-instagram-post.md
│   │   ├── roteiro-reels.md
│   │   ├── legendas-stories.md
│   │   └── ideias-conteudo.md
│   ├── strategy/
│   │   ├── analise-concorrente.md
│   │   ├── persona-mapping.md
│   │   └── planejamento-campanha.md
│   └── automation/
│       ├── manychat-flows.md
│       └── substack-newsletter.md
├── templates/
│   ├── proposta-comercial.md
│   ├── relatorio-mensal-cliente.md
│   ├── calendario-editorial.md
│   └── briefing-conteudo.md
└── code/
    ├── supabase/
    │   └── schema.sql           # DDL completo do Supabase
    ├── scripts/
    │   ├── clickup-sync.js      # Sync ClickUp → Supabase
    │   └── weekly-report.js     # Geracao de relatorio via MCP
    └── integrations/
        └── whatsapp-notify.js   # Notificacoes WhatsApp
```

---

### BLOCO 5: Automacao com IA/MCP (Pos-Restart)

**5.1 Comandos MCP que o Fernando pode usar no Claude Code**

Apos reiniciar o Claude Code com o MCP ativo:

```
"Crie as tarefas do calendario de conteudo do Levee para a proxima semana"
→ MCP cria 5 tasks no Calendario de Conteudo com template de Post

"Qual o status das tarefas urgentes de todos os clientes?"
→ MCP busca tasks com priority=urgent em todos os spaces

"Gere o relatorio semanal da agencia"
→ MCP le tasks completed/overdue, gera markdown

"Mova a task 86afjwe6q para Em Progresso e assigne para Karol"
→ MCP atualiza status + assignee

"Crie a producao mensal de abril para o Caracol com base no contrato"
→ MCP cria 20 tasks de post + 4 de video + 1 revisao semanal x 4
```

**5.2 Automacoes Recorrentes (script scheduled)**

| Automacao | Frequencia | Acao |
|-----------|-----------|------|
| Criar tarefas recorrentes | 1o dia do mes | Gera tasks mensais por contrato |
| Alerta de deadline | Diario 9h | Lista tasks vencendo em 24h → WhatsApp |
| Alerta de timeout aprovacao | Diario 9h | Tasks "Em Revisao" > 48h → auto-aprova |
| Relatorio semanal | Sexta 17h | Gera sumario semanal → ClickUp + WhatsApp |
| Sync ClickUp → Supabase | A cada 6h | Sincroniza tasks completed para analytics |

---

## Ordem de Execucao (Priorizada)

### Fase Imediata (Hoje)

| # | Acao | Tempo | Bloqueador? |
|---|------|-------|-------------|
| 1 | Atualizar statuses para 6-stage em todos os spaces | 15 min | SIM — sem isso nenhum tracking funciona |
| 2 | Criar custom fields no workspace | 10 min | SIM — sem isso tarefas nao tem contexto |
| 3 | Adicionar due dates + assignees em todas as 27 tasks | 20 min | SIM — sem isso ninguem sabe o que fazer |
| 4 | Arquivar/limpar "Espaco da equipe" | 2 min | NAO |

### Fase Curto Prazo (Esta Semana)

| # | Acao | Tempo |
|---|------|-------|
| 5 | Convidar Gabriel, Karol, Diego para ClickUp | 5 min |
| 6 | Criar estrutura GitHub KB (pastas + READMEs) | 30 min |
| 7 | Documentar matrix de delegacao no ClickUp (doc interno) | 15 min |
| 8 | Criar tarefas recorrentes para marco de todos os clientes | 20 min |

### Fase Media (Proximas 2 Semanas)

| # | Acao | Tempo |
|---|------|-------|
| 9 | Setup Supabase + schema | 1h |
| 10 | Criar SOPs iniciais (conteudo com IA, onboarding) | 2h |
| 11 | Criar brand DNA basico para cada cliente | 3h |
| 12 | Script de sync ClickUp → Supabase | 2h |
| 13 | Treinar equipe no ClickUp (video PT-BR) | 1h |

---

## Metricas de Sucesso v2.0

| Metrica | Atual | 7 dias | 30 dias | 90 dias |
|---------|-------|--------|---------|---------|
| Tasks com assignee | 0% | 100% | 100% | 100% |
| Tasks com due date | 0% | 100% | 100% | 100% |
| Tasks concluidas no prazo | N/A | 50% | 70% | 85% |
| Tempo medio aprovacao Fernando | Dias | 48h | 24h | 4h |
| Mensagens de task no WhatsApp | ~50/dia | 30/dia | 10/dia | 3/dia |
| SOPs documentados | 0 | 2 | 5 | 10 |
| Brand DNA documentados | 0 | 1 | 3 | 3 |
| Relatorios gerados por IA | 0 | 0 | 1/semana | 1/semana + 1/mes |

---

*— Orion, orquestrando o sistema 🎯*
