# Campanha de Divulgacao — Spoiler Astrologico da Semana

**Status:** Em Planejamento
**Responsavel:** Fernando Queiroz
**Criado:** 2026-02-20
**Cliente:** Pelicula Sideral

---

## Objetivo

Criar um funil semanal recorrente que transforma o alcance organico do Jornal Sideral (100k+) e Stories em vendas da **Comunidade Camarin Sideral** e do **Curso Decifrando o Mapa Astral**.

## Produtos no Funil

| Produto | Tipo | Preco | LP | Checkout |
|---------|------|-------|-----|----------|
| Camarin Sideral | Assinatura mensal | A confirmar | https://optimizeformobile.vercel.app/ | Substack (mensal) / Kiwify (anual) |
| Curso Decifrando Mapa Astral | Produto unico | A confirmar | Em construcao | Kiwify |

## Ativos Existentes

- **Jornal Sideral** — Reels 2x/semana, 100k+ alcance organico, Victor interpreta o ceu de forma poetica
- **Pelicula do Dia** — Stories diarios com interpretacao do ceu
- **Spoiler da Semana** — Aula semanal da comunidade (roteiro feito por Sylvia/Victor)
- **LP Camarin Sideral** — Pronta (Vercel)
- **ManyChat** — Conta conectada ao Instagram
- **Substack** — Conta configurada

---

## Arquitetura do Funil

```
TOPO — Awareness (100k+ alcance organico)
│
├── Reels: Jornal Sideral (2x/sem)
│   └── CTA na legenda: "Comenta seu ascendente que eu te conto..."
│       └── Trigger ManyChat por comentario
│
├── Stories: Teaser do Spoiler da Semana
│   ├── Sequencia de 6-8 stories (gancho → valor → caixinha → CTA)
│   └── Caixinha de perguntas: "Qual seu ascendente?"
│       └── Trigger ManyChat por resposta
│
└── Reels: Cortes/highlights do Spoiler anterior
    └── CTA: "Quer ver a aula completa? Link na bio"

         │
         ▼

MEIO — Consideration (DM automatico via ManyChat)
│
├── Caminho A: Sabe o ascendente
│   1. ManyChat detecta signo no comentario/resposta
│   2. Envia mini-interpretacao personalizada do tema da semana
│   3. Transicao natural: "Toda semana eu aprofundo isso no Camarin..."
│   4. CTA: link LP Camarin Sideral
│
├── Caminho B: Nao sabe o ascendente
│   1. ManyChat detecta "nao sei" ou similar
│   2. Envia video tutorial "Como descobrir seu ascendente" (60-90s)
│   3. Apos assistir: "Agora que voce sabe, quer entender como funciona?"
│   4. CTA: link LP Curso Decifrando Mapa Astral
│
└── Substack: Post semanal expandido
    1. Conteudo gratuito: panorama astrologico da semana (valor real)
    2. Paywall: antes das interpretacoes por signo
    3. CTA final: convite para Camarin Sideral

         │
         ▼

FUNDO — Conversao
│
├── LP Camarin Sideral → Checkout Substack (mensal) ou Kiwify (anual)
└── LP Curso Decifrando Mapa Astral → Checkout Kiwify
```

---

## Calendario Semanal Proposto

> Ajustar conforme dia real da aula (Spoiler)

| Dia | Conteudo | Responsavel | Papel no Funil |
|-----|---------|-------------|----------------|
| **Segunda** | Post Substack: conteudo expandido da semana | Fernando (prepara) + IA | MEIO — Nurturing + CTA Camarin |
| **Terca** | Reels: Jornal Sideral #1 + CTA ManyChat | Victor (grava) + Gabriel (edita) | TOPO — Alcance + trigger ManyChat |
| **Quarta** | Stories: Teaser do Spoiler + caixinha de perguntas | Victor (grava) | TOPO — Engajamento + trigger ManyChat |
| **Quinta** | Reels: Jornal Sideral #2 + CTA ManyChat | Victor (grava) + Gabriel (edita) | TOPO — Alcance + trigger ManyChat |
| **Sexta** | Stories: Lembrete da aula + prova social | Victor ou Karol | TOPO — Urgencia |
| **Sabado** | **AULA: Spoiler da Semana** (Camarin Sideral) | Victor + Sylvia | Entrega de valor para assinantes |
| **Domingo** | Stories: Highlights da aula + CTA | Karol | TOPO — FOMO + conversao |

### Prazos Internos

| Entrega | Prazo |
|---------|-------|
| Briefing da semana seguinte | Sexta-feira |
| Roteiros de Reels e Stories | Segunda-feira |
| Gravacoes de Victor | Segunda/Terca |
| Edicao dos Reels (Gabriel) | Terca (Reel #1) e Quarta (Reel #2) |
| Atualizacao do ManyChat (tema da semana) | Segunda-feira |
| Post Substack | Segunda-feira |

---

## Tarefas — Setup Inicial (uma vez)

### 1. [ESTRATEGIA] Mapear e documentar funil completo
**Responsavel:** Fernando
**Prazo:** 24/02
**Prioridade:** URGENTE

Checklist:
- [ ] Documentar fluxo TOPO: Reels Jornal Sideral → CTA nos comentarios (palavra-chave ManyChat)
- [ ] Documentar fluxo TOPO: Stories teaser → Caixinha de perguntas (ascendente)
- [ ] Documentar fluxo TOPO: Reels cortes/highlights do Spoiler anterior
- [ ] Documentar fluxo MEIO: ManyChat Caminho A (sabe ascendente → interpretacao → Camarin)
- [ ] Documentar fluxo MEIO: ManyChat Caminho B (nao sabe → tutorial → Curso)
- [ ] Documentar fluxo MEIO: Substack expandido → CTA Camarin
- [ ] Documentar fluxo FUNDO: LPs → Checkout
- [x] Criar diagrama visual do funil → `docs/diagrama-funil-pelicula.md`
- [ ] Aprovar estrategia com equipe

---

### 2. [MANYCHAT] Configurar fluxo semanal de automacao
**Responsavel:** Fernando + Gabriel
**Prazo:** 27/02
**Prioridade:** ALTA

**Caminho A — Sabe o ascendente:**
1. Usuario comenta signo (aries, touro, gemeos...)
2. ManyChat envia: mini-interpretacao do tema da semana para aquele signo
3. Transicao: "Toda semana eu mergulho mais fundo nisso no Camarin Sideral..."
4. Botao CTA → LP Camarin Sideral

**Caminho B — Nao sabe o ascendente:**
1. Usuario comenta "nao sei" ou similar
2. ManyChat envia: video tutorial "Como descobrir seu ascendente" (60-90s)
3. Transicao: "Agora que voce sabe, quer entender como usar esse conhecimento?"
4. Botao CTA → LP Curso Decifrando Mapa Astral

Checklist:
- [ ] Definir palavras-chave de trigger: 12 signos + "nao sei" + "quero" + "spoiler"
- [ ] Criar fluxo Caminho A: 12 variacoes de mensagem (uma por signo) com placeholder {tema_semana}
- [ ] Escrever transicao natural para oferta Camarin (nao pode parecer propaganda)
- [ ] Botao CTA Camarin → link LP
- [ ] Criar fluxo Caminho B: mensagem acolhedora + envio video tutorial
- [ ] Transicao para oferta Curso
- [ ] Botao CTA Curso → link LP
- [ ] Criar mensagem fallback (comentario nao reconhecido)
- [ ] Configurar variaveis dinamicas: {tema_semana}, {signo}, {nome_usuario}
- [ ] Criar doc de instrucoes: "Como atualizar o tema semanal no ManyChat"
- [ ] Integrar ManyChat + Pixel Facebook (eventos de clique)
- [ ] Testar Caminho A com 3 signos
- [ ] Testar Caminho B
- [ ] Testar fallback

---

### 3. [SUBSTACK] Criar template de post semanal
**Responsavel:** Fernando
**Prazo:** 27/02
**Prioridade:** ALTA

Estrutura do post:
1. **Titulo chamativo** — Tema astrologico da semana
2. **Intro gratuita** — Panorama geral (valor real, nao teaser vazio)
3. **Conteudo principal** — Interpretacao por elemento/modalidade
4. **>>> PAYWALL <<<** — No momento de maior curiosidade
5. **Conteudo pago** — Interpretacao por ascendente + conselhos praticos
6. **CTA final** — Convite para Camarin Sideral

Checklist:
- [ ] Criar template com placeholders: {tema_semana}, {signo_destaque}, {transitos}
- [ ] Definir ponto do paywall (apos valor real, antes das interpretacoes por signo)
- [ ] Escrever 3 variacoes de CTA para Camarin (rotacionar)
- [ ] Escrever CTA alternativo para Curso (para iniciantes)
- [ ] Configurar cross-posting: Substack → email automatico
- [ ] Publicar post piloto

---

### 4. [TEMPLATE] Roteiro padrao — Reels Jornal Sideral com CTA
**Responsavel:** Fernando
**Prazo:** 25/02
**Prioridade:** ALTA

O desafio: adicionar CTA sem comprometer a autenticidade que gera o engajamento de 100k+.

Estrategia de CTA:
- **No video (Victor fala):** "Se voce quer saber como isso afeta SEU mapa, comenta seu ascendente"
- **Na legenda:** "Comenta seu ascendente que eu te conto como essa energia chega pra voce 👇"
- **No final:** "Quer mergulhar mais fundo? Te espero no Camarin"

Checklist:
- [ ] Analisar 5 ultimos Reels do Jornal Sideral (formato, duracao, engajamento)
- [ ] Identificar momentos naturais de insercao de CTA
- [ ] Criar modelo de CTA para dentro do video (fala do Victor)
- [ ] Criar modelo de CTA para legenda (com palavra-chave ManyChat)
- [ ] Criar 5 variacoes de CTA para rotacionar semanalmente
- [ ] Definir hashtags padrao
- [ ] Criar template de roteiro: [INTRO] → [CONTEUDO] → [CTA]
- [ ] Validar com Victor: CTA parece natural?
- [ ] Testar primeiro Reels com novo CTA

---

### 5. [TEMPLATE] Roteiro padrao — Stories divulgacao Spoiler
**Responsavel:** Fernando
**Prazo:** 25/02
**Prioridade:** ALTA

Sequencia de 6-8 Stories:

| # | Tipo | Conteudo | Objetivo |
|---|------|---------|----------|
| 1 | Video/texto | "Essa semana o ceu ta {intenso/magico/desafiador}..." | Gancho — curiosidade |
| 2-3 | Video | Conteudo real sobre o tema astrologico da semana | Valor — entregar algo util |
| 4 | Caixinha | "Qual seu ascendente? Comenta que eu te conto como chega pra voce" | Trigger ManyChat |
| 5 | Video | Victor responde algumas perguntas ao vivo | Autenticidade |
| 6 | Imagem/video | Depoimento de membro do Camarin sobre aula passada | Prova social |
| 7-8 | Texto + link | "A aula dessa semana e {dia}. Nao perde." + CTA | Urgencia + conversao |

Checklist:
- [ ] Definir sequencia completa com objetivo de cada story
- [ ] Criar 3 modelos de abertura/gancho para rotacionar
- [ ] Definir nivel de profundidade do teaser (valor real sem entregar tudo)
- [ ] Texto exato da caixinha de perguntas
- [ ] Guidelines para Victor responder ao vivo
- [ ] Coletar depoimentos de membros do Camarin (prints, videos)
- [ ] Criar 3 variacoes de CTA final com urgencia sutil
- [ ] Criar versoes para temas: Lua Nova, Lua Cheia, Retrogrado, Eclipse, Ingressos
- [ ] Definir melhor horario de publicacao (analytics do perfil)
- [ ] Aprovar modelo com Victor e Sylvia

---

### 6. [CALENDARIO] Definir grade semanal de publicacao
**Responsavel:** Fernando + Karol
**Prazo:** 24/02
**Prioridade:** URGENTE

Checklist:
- [ ] Confirmar dia/horario da aula (Spoiler da Semana) com Victor/Sylvia
- [ ] Definir dias fixos dos 2 Reels do Jornal Sideral
- [ ] Definir dia dos Stories de divulgacao
- [ ] Definir dia do post Substack
- [ ] Definir dia dos Stories pos-aula (highlights/FOMO)
- [ ] Criar grade visual semanal e compartilhar com equipe
- [ ] Definir prazos internos (briefing, roteiro, gravacao, edicao)
- [ ] Testar grade na primeira semana e ajustar

---

### 7. [BRIEFING] Modelo de briefing semanal para Victor e Sylvia
**Responsavel:** Fernando
**Prazo:** 26/02
**Prioridade:** ALTA

Estrutura do briefing:

**1. Tema Astrologico da Semana**
- Transitos relevantes
- Signo em destaque
- Evento astrologico principal

**2. Roteiro Jornal Sideral (2 Reels)**
- Reel #1: tema + CTA sugerido
- Reel #2: tema + CTA sugerido
- Talking points para Victor

**3. Roteiro Stories de Divulgacao**
- Sequencia de 6-8 stories
- Texto da caixinha
- CTAs

**4. Conteudo Substack**
- Tema do post expandido
- Key points

**5. Prazos de gravacao e publicacao**

**6. Links e materiais de apoio**

Checklist:
- [ ] Criar template do briefing (Google Doc / Notion / ClickUp)
- [ ] Preencher todas as secoes com instrucoes claras
- [ ] Definir quem prepara o briefing semanalmente
- [ ] Definir prazo de entrega (sexta para semana seguinte)
- [ ] Validar formato com Victor e Sylvia
- [ ] Criar primeiro briefing real (semana piloto)

---

## Tarefas — Execucao Recorrente

### 8. [EXECUCAO] Semana Piloto — Primeiro ciclo completo
**Responsavel:** Fernando + Gabriel + Karol + Victor + Sylvia
**Prazo:** 02/03 a 07/03
**Prioridade:** URGENTE

Pre-requisitos: Tarefas 1-7 concluidas.

Checklist:
- [ ] Enviar briefing da semana para Victor/Sylvia (sexta anterior)
- [ ] Victor grava 2 Reels do Jornal Sideral com CTA integrado
- [ ] Gabriel edita Reels (legenda, cortes, musica)
- [ ] Publicar Reels #1 com legenda e palavra-chave ManyChat
- [ ] Victor grava sequencia de Stories de divulgacao
- [ ] Publicar Stories com caixinha de perguntas (ManyChat ativo)
- [ ] Monitorar ManyChat nas primeiras 2 horas
- [ ] Verificar Caminho A funciona (ascendente → resposta → oferta Camarin)
- [ ] Verificar Caminho B funciona (nao sei → tutorial → oferta Curso)
- [ ] Publicar Reels #2
- [ ] Publicar post Substack com conteudo expandido + CTA
- [ ] Publicar Stories pos-aula (highlights + CTA)
- [ ] Coletar metricas do ciclo completo
- [ ] Reuniao de analise com equipe
- [ ] Documentar licoes aprendidas e ajustes

---

### 9. [METRICAS] KPIs e tracking semanal
**Responsavel:** Fernando
**Prazo:** 28/02
**Prioridade:** NORMAL

#### KPIs por Etapa

**TOPO (Awareness)**
| Metrica | Meta Minima | Meta Ideal |
|---------|------------|------------|
| Alcance Reels (Jornal Sideral) | 50k | 100k+ |
| Impressoes Stories | 3k | 8k+ |
| Comentarios com keyword nos Reels | 30 | 100+ |
| Respostas na caixinha | 50 | 150+ |

**MEIO (Consideration)**
| Metrica | Meta Minima | Meta Ideal |
|---------|------------|------------|
| DMs ManyChat acionados | 30 | 100+ |
| Taxa de resposta ManyChat | 70% | 85%+ |
| Cliques no link LP via ManyChat | 15 | 50+ |
| Aberturas post Substack | 100 | 300+ |
| Cliques CTA Substack | 10 | 30+ |

**FUNDO (Conversao)**
| Metrica | Meta Minima | Meta Ideal |
|---------|------------|------------|
| Visitas LP Camarin | 20 | 60+ |
| Visitas LP Curso | 10 | 30+ |
| Taxa conversao LP | 2% | 5%+ |
| Vendas Camarin (assinaturas) | 3/sem | 10+/sem |
| Vendas Curso | 2/sem | 5+/sem |

Checklist:
- [ ] Criar planilha Google Sheets para tracking semanal
- [ ] Configurar Google Analytics nas LPs
- [ ] Definir UTM parameters padrao para todos os links
- [ ] Definir responsavel por coleta de dados (segunda-feira)
- [ ] Agendar reuniao semanal de review

---

## Equipe e Responsabilidades

| Nome | Funcao na Campanha | Entregas Semanais |
|------|-------------------|-------------------|
| **Fernando** | Estrategia, ManyChat, briefings, coordenacao | Briefing semanal, atualizacao ManyChat, post Substack |
| **Gabriel** | Edicao de video, suporte tecnico, automacoes | Edicao 2 Reels, suporte ManyChat |
| **Karol** | Publicacao, monitoramento, organizacao | Publicar stories, monitorar metricas, cobrar prazos |
| **Victor** | Gravacao, conteudo, comunicacao com audiencia | Gravar 2 Reels + stories, fazer a aula |
| **Sylvia** | Roteiros, edicao, apoio | Apoio em roteiros e gravacoes |

---

## Dependencia Critica: Roteiro do Spoiler

> Atualmente o roteiro do Spoiler da Semana e feito por Sylvia e Victor.
> A agencia quer assumir essa demanda para estruturar as estrategias com antecedencia.

**Proposta:** Fernando prepara o briefing astrologico da semana (com apoio de IA) e Victor/Sylvia ajustam com a visao artistica deles. Isso permite:
1. Integrar o conteudo ao funil desde a concepcao
2. Ter os CTAs planejados com antecedencia
3. Alinhar Reels + Stories + Substack em torno do mesmo tema
4. Nao depender de Victor para iniciar o planejamento

---

## Plano de Contingencia (MVP)

Se nao der tempo de tudo na semana piloto, o minimo para lancar:

1. ✅ LP Camarin Sideral funcionando (ja tem)
2. ✅ 1 Reels do Jornal Sideral com CTA na legenda
3. ✅ Stories com caixinha de perguntas
4. ✅ ManyChat com pelo menos Caminho B (nao sei → tutorial → curso)

**Pode ser adiado:**
- Fluxo completo dos 12 ascendentes no ManyChat
- Post Substack
- Stories pos-aula com highlights
- LP do Curso (usar link direto Kiwify)

---

## Proximos Passos

1. **Hoje (20/02):** Aprovar estrategia e calendario com equipe
2. **21-25/02:** Criar templates de roteiro e configurar ManyChat
3. **26/02:** Criar primeiro briefing semanal
4. **27/02:** Victor/Sylvia gravam conteudo da semana piloto
5. **02-07/03:** Semana piloto — executar ciclo completo
6. **07/03:** Reuniao de analise e ajustes
7. **A partir de 09/03:** Operacao recorrente

---

*Baseado no roadmap do Funil Eclipse Solar em Aquario (13/02/2026)*
*Adaptado para operacao semanal recorrente*
