# Análise do Sprint — Funil Perpétuo Película Sideral

**Data:** 2026-02-24
**Analista:** AIOS System
**Escopo:** 24 tasks (Sprint 1: 13 tasks/34pts | Sprint 2: 11 tasks/27pts)

---

## 1. LACUNAS IDENTIFICADAS (Tasks Faltantes)

### 1.1 PRE-REQUISITOS NÃO MAPEADOS

| # | Task Faltante | Bloqueia | Severidade | Sprint |
|---|---------------|----------|------------|--------|
| A1 | **Definir preço do Curso Decifrando** | Kiwify produto (#13) | CRITICA | S1 |
| A2 | **Definir preço/modelo do Camarim Sideral** | LP Camarim (#16), ManyChat (#24) | CRITICA | S1 |
| A3 | **Criar/confirmar conta Kiwify para Película** | Criar curso (#12), Produto (#13) | CRITICA | S1 |
| A4 | **Configurar Pixel Facebook na conta Película** | Pixels LP Decifrando (#6), Pixels LP Camarim (#17) | ALTA | S1 |
| A5 | **Configurar Pixel X (Twitter) na conta Película** | Pixels LP Decifrando (#6), Pixels LP Camarim (#17) | ALTA | S1 |
| A6 | **Gravar vídeo tutorial "Como descobrir ascendente"** (60-90s) | ManyChat Caminho B (#24) | ALTA | S2 |
| A7 | **Definir tema astrológico semana 01-08/03** | Briefing Semana 1, ManyChat conteúdo (#24) | ALTA | S1 |
| A8 | **Escrever 12 mini-interpretações por signo** (semana 1) | ManyChat Caminho A (#24) | ALTA | S2 |

### 1.2 TASKS OPERACIONAIS FALTANTES

| # | Task Faltante | Justificativa | Sprint |
|---|---------------|--------------|--------|
| B1 | **Configurar UTM tracking padrão** | Todos os links do funil precisam de UTM. Sem isso não há atribuição de conversão. | S1 |
| B2 | **Criar página de bio Instagram (atualizar link)** | Linktree precisa ser colocado na bio do Instagram. Depende de Linktree. | S2 |
| B3 | **QA completo do funil end-to-end** | Testar todo o fluxo: Reels → Comentário → ManyChat DM → LP → Checkout. Não coberto por nenhuma task individual. | S2 |
| B4 | **Configurar e-mail de boas-vindas Kiwify** | Aluno compra → precisa receber acesso automático. Na checklist do #13 mas deveria ser task separada. | S1 |
| B5 | **Testar ManyChat com 13 cenários** | Documentado no `manychat-spoiler-semanal.md` como obrigatório. Não existe como task. | S2 |

### 1.3 TASKS DE CONTEÚDO RECORRENTE (Setup Inicial)

| # | Task Faltante | Justificativa | Sprint |
|---|---------------|--------------|--------|
| C1 | **Criar template de caption Reels (Jornal Sideral)** | Doc especifica formato. Template evita retrabalho semanal. | S1 |
| C2 | **Criar template de Stories (sequência 6-8)** | Estrutura padronizada para stories semanais. | S1 |
| C3 | **Primeiro post Substack (semana 01-08/03)** | Substack é canal do meio-funil. Precisa estar ativo no lançamento. | S2 |
| C4 | **Configurar Substack para Película** | Conta + formatação + paywall precisa existir antes do primeiro post. | S1 |

---

## 2. DEPENDÊNCIAS NÃO ESCRITAS

### 2.1 Dependências Cross-Epic (CRÍTICAS)

```
Kiwify Produto (#13) ──────→ LP Decifrando (#5) [checkout URL necessária no botão CTA]
Kiwify Produto (#13) ──────→ ManyChat (#24) [link checkout no Caminho B]
LP Decifrando deploy (#7) ──→ Linktree (#20) [link para LP no Linktree]
LP Camarim deploy (#18) ───→ Linktree (#20) [link para LP no Linktree]
LP Decifrando deploy (#7) ──→ ManyChat (#24) [link LP no Caminho A/B]
LP Camarim deploy (#18) ───→ ManyChat (#24) [link LP Camarim no Caminho A]
Cloudflare (#2) ───────────→ LP Camarim DNS (#18) [usa mesmo Cloudflare]
```

### 2.2 Dependências Implícitas Dentro dos Epics

```
# Epic Kiwify - Falta:
Conta Kiwify (A3) → Criar curso (#12)
Definir preço (A1) → Produto Kiwify (#13)

# Epic LP Decifrando - Falta:
Kiwify checkout URL (#13) → Criar LP (#5) [precisa do link real no botão]
Pixel Facebook (A4) → Instalar Pixels (#6) [precisa da conta de ads configurada]

# Epic ManyChat - Falta:
LP Decifrando publicada (#7) → Funil ManyChat (#24) [links nos botões]
LP Camarim publicada (#18) → Funil ManyChat (#24) [links nos botões]
Vídeo tutorial (A6) → Funil ManyChat (#24) [caminho B envia vídeo]
12 interpretações (A8) → Funil ManyChat (#24) [conteúdo personalizado]

# Cross-Sprint:
Sprint 1 LPs → Sprint 2 Linktree [links precisam existir]
Sprint 1 LPs → Sprint 2 ManyChat [links precisam existir]
```

---

## 3. TASKS COMPLEXAS — QUEBRA RECOMENDADA

### 3.1 Task #24: "Criar funil ManyChat 2 caminhos" (3 pts → deveria ser 8-13 pts)

**Problema:** Esta é a task mais complexa do funil inteiro. Configurar ManyChat envolve:
- Keyword detection para 12 signos + variações ortográficas
- Caminho A: 12 variações de mensagem personalizada + delays + botões
- Caminho B: Mensagem educacional + envio de vídeo + redirect
- Fallback: Mensagem padrão
- 13 custom fields no ManyChat
- 6 tags de rastreamento
- Integração com Instagram
- Teste de todos os fluxos

**Quebra sugerida:**
| Sub-task | Pts | Descrição |
|----------|-----|-----------|
| 24a: Configurar keywords e triggers | 2 | 12 signos + variações + "não sei" + fallback |
| 24b: Criar Caminho A (12 variações) | 3 | Mensagens personalizadas por signo + delays + botões CTA |
| 24c: Criar Caminho B (educacional) | 2 | Fluxo "não sei" + vídeo tutorial + redirect |
| 24d: Criar custom fields e tags | 1 | 13 campos + 6 tags de rastreamento |
| 24e: Testar 13 cenários ManyChat | 2 | QA com checklist do doc |
| **Total** | **10** | vs 3 pts original |

### 3.2 Task #5: "Criar LP Decifrando @dev" (5 pts — OK mas precisa pré-requisitos)

**Dependências não mapeadas:**
- Precisa da checkout URL do Kiwify (#13) para o botão CTA
- Precisa de imagens/assets finalizados (#4)
- Precisa da copy finalizada (#3)
- Precisa da paleta de cores e brand assets (`kb/brand-dna/pelicula-sideral.md`)

### 3.3 Task #16: "Criar LP Camarim @dev" (5 pts — mesma situação)

### 3.4 Task #10: "Finalizar edição aula final" (5 pts)

**Problema:** Assignee é Fernando, mas quem edita é Gabriel. Victor precisa aprovar conteúdo. Responsabilidade fragmentada.

---

## 4. OTIMIZAÇÕES SUGERIDAS

### 4.1 Reorganização de Timeline

**Problema atual:** Todas as 13 tasks do Sprint 1 têm o MESMO due_date (01/03). Isso não reflete a cadeia de dependências real.

**Sugestão:** Escalonar due_dates dentro do sprint:

```
Sprint 1 — Semana 24/02 a 01/03:
├── Seg 24/02: Infra Cloudflare (#1,#2), Definir preços (A1,A2), Conta Kiwify (A3)
├── Ter 25/02: Copy LP Decifrando (#3), Ref estética (#4), Edição aula (#10)
├── Qua 26/02: Criar LP Decifrando (#5), Pixel config (A4,A5)
├── Qui 27/02: Publicar LP (#7), Pixels (#6), Aprovar curso (#11)
├── Sex 28/02: DNS (#9), Testes LP (#8), Criar curso Kiwify (#12)
├── Sab 01/03: Produto Kiwify (#13), QA final Sprint 1
```

### 4.2 Paralelização

**Tasks que podem rodar em paralelo (sem dependências entre si):**
- Toda a cadeia Kiwify (#10→#11→#12→#13) ║ Toda a cadeia LP Decifrando (#3,#4→#5→#6,#7→#8,#9)
- Copy LP Camarim (#14) ║ Ref estética (#15) — ambas são inputs para LP Camarim
- Wireframe Linktree (#19) ║ Copy LP Camarim (#14) — sprints diferentes

### 4.3 Risk Mitigation

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Kiwify checkout URL não pronta a tempo | LP Decifrando sem botão funcional | Criar LP com placeholder URL, atualizar depois |
| Vídeo tutorial não gravado | ManyChat Caminho B sem vídeo | Usar workaround texto (já documentado no doc) |
| LP Curso (Decifrando) atrasada | ManyChat Caminho B aponta para vazio | Usar link direto Kiwify (workaround documentado) |
| Cloudflare demora para propagar | DNS não resolve a tempo | Configurar com antecedência (24h+) |

### 4.4 Tasks que Deveriam Existir como Recorrentes

Após Sprint 2, o funil entra em operação semanal. Criar templates de tasks recorrentes:
1. **Briefing semanal** (toda segunda)
2. **Atualizar ManyChat** (13 campos, toda segunda)
3. **Post Substack** (toda segunda)
4. **Coleta de métricas** (toda segunda)
5. **Revisão de performance** (toda sexta)

---

## 5. MAPA DE DEPENDÊNCIAS COMPLETO (Corrigido)

```
SPRINT 1:
                    ┌─ A3 (Conta Kiwify)
                    │
A1 (Preço curso) ───┤
                    │    ┌─ #12 (Criar curso) ─→ #13 (Produto) ──┐
#10 (Edição) ─→ #11 (Aprovar) ─┘                                  │
                                                                    │
#1 (MCP CF) ─→ #2 (Conectar CF) ──────────────────────────┐       │
                                                            │       │
#3 (Copy) ──┐                                              │       │
            ├─→ #5 (Criar LP) ─┬─→ #6 (Pixels) ──┐       │       │
#4 (Ref) ──┘     ↑             │                   ├→ #8 (QA LP)  │
                  │             └─→ #7 (Deploy) ──┤       │       │
           A4 (Pixel FB) ──┘                       └→ #9 (DNS) ←──┘
           A5 (Pixel X)                                    ↑
                                                           │
                                                    #2 (Cloudflare)

SPRINT 2:
#14 (Copy Camarim) ──┐
                      ├─→ #16 (Criar LP Camarim) ─┬→ #17 (Pixels)
#15 (Ref Camarim) ──┘                              └→ #18 (Deploy+DNS)
                                                           │
                                                           ↓
#19 (Wireframe LT) → #20 (Criar LT) → #21 (Deploy LT) → #22 (QA LT)
         ↑                    ↑               ↑
    #7 (LP Dec)          #18 (LP Cam)    #2 (Cloudflare)

A7 (Tema) → A8 (12 interps) ──┐
A6 (Vídeo tutorial) ──────────┤
#23 (MCP ManyChat) ───────────┤
#7 (LP Decifrando) ───────────┼─→ #24 (Funil ManyChat) → B5 (QA ManyChat)
#18 (LP Camarim) ─────────────┤
#13 (Checkout Kiwify) ────────┘

B3 (QA Funil E2E) ← depende de TUDO acima
```

---

## 6. RESUMO DE AÇÕES

### Novas Tasks a Criar: 13
- A1-A8 (pré-requisitos): 8 tasks
- B1-B5 (operacionais): 5 tasks

### Dependências a Adicionar: 11
- Cross-epic: 7 novas dependências
- Intra-epic: 4 novas dependências

### Tasks a Quebrar: 1
- #24 ManyChat → 5 subtasks (ou manter como 1 task com 10pts e checklist expandido)

### Descrições a Reescrever: 24
- Todas as tasks precisam de descrição detalhada com passo-a-passo AIOS

---

_Análise gerada pelo AIOS System em 2026-02-24_
