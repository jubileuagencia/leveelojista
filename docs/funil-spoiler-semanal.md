# Funil Semanal — Spoiler Astrológico da Semana
## Documento Estratégico v1.0

**Cliente:** Película Sideral
**Responsável:** Fernando Queiroz
**Data:** 20/02/2026
**Status:** Aprovado para execução

---

## 1. Visão Geral

O funil transforma o alcance orgânico do Jornal Sideral (100k+) e dos Stories em vendas recorrentes dos dois produtos da Película Sideral.

**Produtos:**
| Produto | Tipo | Preço | Checkout |
|---------|------|-------|----------|
| Comunidade Camarin Sideral | Assinatura | A confirmar | Substack (mensal) / Kiwify (anual) |
| Curso Decifrando Mapa Astral | Produto único | A confirmar | Kiwify |

---

## 2. Arquitetura do Funil

```
┌─────────────────────────────────────────────────────────┐
│                    TOPO — AWARENESS                      │
│                  (100k+ alcance orgânico)                │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────────────────┐ │
│  │ REELS             │  │ STORIES                      │ │
│  │ Jornal Sideral    │  │ Teaser do Spoiler            │ │
│  │ 2x/semana         │  │ + Caixinha de perguntas      │ │
│  │ CTA na legenda:   │  │ "Qual seu ascendente?"       │ │
│  │ "Comenta teu      │  │                              │ │
│  │  ascendente"      │  │ + Highlights pós-aula (FOMO) │ │
│  └────────┬─────────┘  └──────────────┬───────────────┘ │
│           │                            │                  │
└───────────┼────────────────────────────┼──────────────────┘
            │    Comentário / Resposta   │
            └────────────┬───────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   MEIO — CONSIDERATION                   │
│                   (DM automático ManyChat)               │
│                                                          │
│  ┌─────────────────────┐  ┌───────────────────────────┐ │
│  │ CAMINHO A            │  │ CAMINHO B                 │ │
│  │ Sabe o ascendente    │  │ Não sabe o ascendente     │ │
│  │                      │  │                           │ │
│  │ 1. Detecta signo     │  │ 1. Detecta "não sei"     │ │
│  │ 2. Mini-interpretação│  │ 2. Vídeo tutorial (90s)  │ │
│  │    personalizada     │  │    "Como descobrir seu    │ │
│  │ 3. Transição natural │  │     ascendente"          │ │
│  │ 4. CTA → Camarin     │  │ 3. CTA → Curso           │ │
│  └──────────┬───────────┘  └─────────────┬─────────────┘ │
│             │                             │               │
│  ┌──────────┴─────────────────────────────┴─────────────┐│
│  │ SUBSTACK — Post semanal expandido                    ││
│  │ Conteúdo gratuito → Paywall → CTA Camarin            ││
│  └──────────────────────────┬───────────────────────────┘│
└─────────────────────────────┼────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────┐
│                    FUNDO — CONVERSÃO                     │
│                                                          │
│  ┌────────────────────┐  ┌────────────────────────────┐ │
│  │ LP Camarin Sideral  │  │ LP Curso Decifrando       │ │
│  │ (já existe)         │  │ Mapa Astral (construir)   │ │
│  │                     │  │                            │ │
│  │ → Checkout Substack │  │ → Checkout Kiwify          │ │
│  │   (mensal)          │  │                            │ │
│  │ → Checkout Kiwify   │  │                            │ │
│  │   (anual)           │  │                            │ │
│  └─────────────────────┘  └────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Detalhamento por Etapa

### 3.1 TOPO — Reels (Jornal Sideral)

| Campo | Detalhe |
|-------|---------|
| Frequência | 2x/semana (terça e quinta) |
| Responsável gravação | Victor |
| Responsável edição | Gabriel |
| Alcance esperado | 50k-100k+ por Reels |
| CTA no vídeo | Victor fala nos últimos 10s: "Comenta teu ascendente que eu te conto como isso chega pra você" |
| CTA na legenda | Texto + palavra-chave que aciona ManyChat |
| Hashtags | #astrologia #mapastral #signos #{signo_destaque} #jornalsideral |

**Gatilho de transição:** Comentário com signo ou "não sei" → ManyChat detecta e envia DM.

### 3.2 TOPO — Stories (Divulgação do Spoiler)

| Campo | Detalhe |
|-------|---------|
| Frequência | Quarta (teaser) + Sexta (lembrete) + Domingo (pós-aula) |
| Responsável | Victor (quarta), Karol (sexta/domingo) |
| Formato | 6-8 stories sequenciais |
| Story crítico | Story 4: Caixinha de perguntas "Qual seu ascendente?" |

**Gatilho de transição:** Resposta na caixinha → ManyChat detecta e envia DM.

### 3.3 MEIO — ManyChat (Caminho A: Sabe ascendente)

| Etapa | Mensagem | Delay |
|-------|---------|-------|
| 1 | "Oi! Vi que seu ascendente é **{signo}** {emoji}. Essa semana, com {tema_semana}, isso significa que {interpretação_signo}" | Imediato |
| 2 | "Toda semana eu aprofundo isso ao vivo no **Camarin Sideral**. Quer conhecer?" | 30s |
| 3 | Botão: "Quero fazer parte ✨" → LP Camarin | — |
| 3b | Botão: "Agora não" → Tag remarketing | — |

**Palavras-chave trigger:** áries, touro, gêmeos, câncer, leão, virgem, libra, escorpião, sagitário, capricórnio, aquário, peixes

**Atualização semanal:** Trocar {tema_semana} e 12 {interpretação_signo} toda segunda-feira.

### 3.4 MEIO — ManyChat (Caminho B: Não sabe ascendente)

| Etapa | Mensagem | Delay |
|-------|---------|-------|
| 1 | "Sem problema! Muita gente não sabe 😊 Fiz um vídeo rapidinho te mostrando como descobrir." | Imediato |
| 2 | [Enviar vídeo tutorial — 60-90s] | — |
| 3 | "Conseguiu descobrir? Saber seu ascendente muda tudo na astrologia!" | 2 min |
| 4a | Botão: "Quero aprender mais" → LP Curso | — |
| 4b | Botão: "Descobri! Meu ascendente é..." → Volta pro Caminho A | — |

**Palavras-chave trigger:** não sei, nao sei, n sei, não tenho certeza

**Dependência:** Vídeo tutorial precisa ser gravado pelo Victor.

### 3.5 MEIO — Substack

| Campo | Detalhe |
|-------|---------|
| Frequência | 1x/semana (segunda-feira) |
| Estrutura | Título → Intro gratuita → Conteúdo principal → PAYWALL → Interpretações por signo → CTA Camarin |
| Ponto do paywall | Após dar valor real, antes das interpretações por ascendente |
| Cross-posting | Substack → Email automático para lista |

### 3.6 FUNDO — Landing Pages + Checkout

| LP | URL | Status | Checkout |
|----|-----|--------|----------|
| Camarin Sideral | optimizeformobile.vercel.app | ✅ Pronta | Substack (mensal) + Kiwify (anual) |
| Curso Decifrando Mapa Astral | — | ❌ Em construção | Kiwify |

**UTM Parameters padrão:**
```
?utm_source={instagram|manychat|substack}
&utm_medium={reels|stories|dm|email}
&utm_campaign=spoiler-semanal
&utm_content={caminho-a|caminho-b|cta-post|cta-substack}
```

---

## 4. Grade Semanal de Publicação

> Aula no **domingo**. Toda a semana constrói antecipação para o domingo.

| Dia | Conteúdo | Responsável | Papel no Funil |
|-----|---------|-------------|----------------|
| **Segunda** | Post Substack expandido + Atualizar ManyChat | Fernando | MEIO — Nurturing |
| **Terça** | Reels: Jornal Sideral #1 + CTA | Victor (grava) + Gabriel (edita) | TOPO — Alcance |
| **Quarta** | Stories: Teaser Spoiler + Caixinha de perguntas | Victor | TOPO — Engajamento + Trigger ManyChat |
| **Quinta** | Reels: Jornal Sideral #2 + CTA | Victor (grava) + Gabriel (edita) | TOPO — Alcance |
| **Sexta** | Stories: Lembrete da aula + prova social | Karol | TOPO — Urgência |
| **Sábado** | Stories: Último CTA + urgência | Victor ou Karol | TOPO — Conversão final |
| **Domingo** | **AULA: Spoiler da Semana** + Stories pós-aula com highlights | Victor + Sylvia / Karol | Entrega + FOMO |

### Prazos Internos

| Entrega | Responsável | Prazo |
|---------|-------------|-------|
| Briefing da semana seguinte | Fernando | Sexta-feira |
| Roteiros Reels e Stories | Fernando + IA | Segunda |
| Atualização ManyChat (tema) | Fernando ou Gabriel | Segunda |
| Gravações Victor | Victor | Segunda/Terça |
| Edição Reels | Gabriel | Terça (Reel #1) / Quarta (Reel #2) |
| Post Substack | Fernando | Segunda |
| Coleta de métricas semana anterior | Karol | Segunda |

---

## 5. Dependências Críticas

| Dependência | Status | Impacto |
|-------------|--------|---------|
| Vídeo tutorial "Como descobrir ascendente" (Victor) | ❌ Precisa gravar | Bloqueia Caminho B do ManyChat |
| LP Curso Decifrando Mapa Astral | ❌ Em construção | Caminho B leva para link direto Kiwify (workaround) |
| Depoimentos de membros do Camarin | ❌ Coletar | Sem prova social nos Stories |
| Aprovação do formato CTA com Victor | ❌ Pendente | CTA nos Reels pode afetar autenticidade |

---

## 6. KPIs Semanais

### TOPO
| Métrica | Meta Mínima | Meta Ideal |
|---------|------------|------------|
| Alcance Reels | 50k | 100k+ |
| Impressões Stories | 3k | 8k+ |
| Comentários com keyword | 30 | 100+ |
| Respostas na caixinha | 50 | 150+ |

### MEIO
| Métrica | Meta Mínima | Meta Ideal |
|---------|------------|------------|
| DMs ManyChat | 30 | 100+ |
| Taxa resposta ManyChat | 70% | 85%+ |
| Cliques LP via ManyChat | 15 | 50+ |
| Aberturas Substack | 100 | 300+ |

### FUNDO
| Métrica | Meta Mínima | Meta Ideal |
|---------|------------|------------|
| Visitas LP Camarin | 20 | 60+ |
| Conversão LP | 2% | 5%+ |
| Assinaturas Camarin/sem | 3 | 10+ |
| Vendas Curso/sem | 2 | 5+ |

---

*Documento referência para toda a equipe. Atualizar conforme iterações semanais.*
