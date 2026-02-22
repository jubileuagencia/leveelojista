# KPIs e Dashboard de Métricas — Spoiler Astrológico da Semana
## Acompanhamento semanal do funil

**Versão:** 1.0
**Responsável coleta:** Karol (Instagram) + Fernando (ManyChat, Substack, GA)
**Frequência:** Toda segunda-feira
**Cliente:** Película Sideral

---

## 1. KPIs por Etapa do Funil

### TOPO — Awareness (Alcance e Engajamento)

| Métrica | Meta Mínima | Meta Ideal | Fonte | Responsável |
|---------|------------|------------|-------|-------------|
| Alcance Reels (Jornal Sideral) | 50k | 100k+ | Instagram Insights | Karol |
| Impressões Stories | 3k | 8k+ | Instagram Insights | Karol |
| Comentários com keyword nos Reels | 30 | 100+ | Instagram + ManyChat | Karol |
| Respostas na caixinha | 50 | 150+ | Instagram Insights | Karol |
| Salvamentos Reels | 100 | 500+ | Instagram Insights | Karol |
| Compartilhamentos Reels | 20 | 100+ | Instagram Insights | Karol |

### MEIO — Consideration (Engajamento Qualificado)

| Métrica | Meta Mínima | Meta Ideal | Fonte | Responsável |
|---------|------------|------------|-------|-------------|
| DMs ManyChat acionados | 30 | 100+ | ManyChat Analytics | Fernando |
| Taxa de resposta ManyChat | 70% | 85%+ | ManyChat Analytics | Fernando |
| Caminho A (sabe ascendente) | 20 | 70+ | ManyChat Analytics | Fernando |
| Caminho B (não sabe) | 10 | 30+ | ManyChat Analytics | Fernando |
| Cliques LP via ManyChat | 15 | 50+ | ManyChat + UTM | Fernando |
| Aberturas post Substack | 100 | 300+ | Substack Dashboard | Fernando |
| Cliques CTA Substack | 10 | 30+ | Substack Dashboard | Fernando |
| Taxa abertura email | 40% | 60%+ | Substack Dashboard | Fernando |

### FUNDO — Conversão

| Métrica | Meta Mínima | Meta Ideal | Fonte | Responsável |
|---------|------------|------------|-------|-------------|
| Visitas LP Camarin | 20 | 60+ | Google Analytics | Fernando |
| Visitas LP Curso | 10 | 30+ | Google Analytics | Fernando |
| Taxa conversão LP Camarin | 2% | 5%+ | GA + Checkout | Fernando |
| Taxa conversão LP Curso | 2% | 5%+ | GA + Checkout | Fernando |
| Novas assinaturas Camarin/sem | 3 | 10+ | Substack + Kiwify | Fernando |
| Vendas Curso/sem | 2 | 5+ | Kiwify | Fernando |
| Receita semanal total | R$200 | R$500+ | Kiwify + Substack | Fernando |

### SAÚDE — Métricas de Qualidade

| Métrica | Meta Mínima | Meta Ideal | Fonte | Responsável |
|---------|------------|------------|-------|-------------|
| Churn Camarin (cancelamentos/mês) | <10% | <5% | Substack + Kiwify | Fernando |
| NPS / Satisfação aula | 7/10 | 9/10 | Pesquisa pós-aula | Karol |
| Depoimentos coletados/sem | 1 | 3+ | Instagram DM | Karol |

---

## 2. Estrutura do Dashboard (Google Sheets)

### Aba 1: "Semanal" — Visão Geral

| Coluna | Conteúdo |
|--------|----------|
| A | Semana (ex: "Sem 1 — 02/03 a 08/03") |
| B | Tema astrológico |
| C | Alcance Reels |
| D | Impressões Stories |
| E | Comentários keyword |
| F | Respostas caixinha |
| G | DMs ManyChat |
| H | Caminho A |
| I | Caminho B |
| J | Cliques LP ManyChat |
| K | Aberturas Substack |
| L | Cliques CTA Substack |
| M | Visitas LP Camarin |
| N | Visitas LP Curso |
| O | Assinaturas Camarin |
| P | Vendas Curso |
| Q | Receita Total |
| R | Observações |

**Formatação condicional sugerida:**
- Verde: atingiu meta ideal
- Amarelo: entre meta mínima e ideal
- Vermelho: abaixo da meta mínima

### Aba 2: "Diário" — Métricas Dia a Dia

| Coluna | Conteúdo |
|--------|----------|
| A | Data |
| B | Dia da semana |
| C | Conteúdo publicado |
| D | Alcance |
| E | Impressões |
| F | Engajamento (likes + comments + saves + shares) |
| G | Novos seguidores |
| H | DMs recebidos |
| I | Observações |

### Aba 3: "Gráficos" — Tendências

Criar gráficos automáticos com os dados da aba Semanal:

1. **Gráfico de linha:** Alcance Reels (semana a semana)
2. **Gráfico de linha:** DMs ManyChat vs Cliques LP (conversão do meio)
3. **Gráfico de barras:** Assinaturas + Vendas por semana
4. **Gráfico de pizza:** Distribuição Caminho A vs Caminho B
5. **Gráfico de linha:** Receita semanal acumulada

### Aba 4: "CTA Tracking" — Performance por Variação

| Coluna | Conteúdo |
|--------|----------|
| A | Semana |
| B | CTA usado no Reel #1 |
| C | CTA usado no Reel #2 |
| D | Comentários Reel #1 |
| E | Comentários Reel #2 |
| F | CTA Substack usado |
| G | Cliques CTA Substack |
| H | Melhor CTA da semana |

> Essa aba ajuda a identificar quais variações de CTA performam melhor ao longo do tempo.

---

## 3. UTM Parameters Padrão

Todos os links do funil devem seguir essa convenção:

```
?utm_source={fonte}&utm_medium={meio}&utm_campaign=spoiler-semanal&utm_content={conteudo}
```

| Contexto | utm_source | utm_medium | utm_content |
|----------|-----------|-----------|-------------|
| Reel → comentário → ManyChat → Camarin | manychat | dm | caminho-a |
| Reel → comentário → ManyChat → Curso | manychat | dm | caminho-b |
| Stories → caixinha → ManyChat → Camarin | manychat | dm | caminho-a |
| Post Substack → CTA Camarin | substack | email | cta-substack |
| Post Substack → CTA Curso | substack | email | cta-curso-substack |
| Stories → link direto | instagram | stories | cta-stories |
| Bio link → Camarin | instagram | bio | link-bio |

---

## 4. Rotina de Análise Semanal

### Toda segunda-feira (antes das 10h)

**Karol:**
1. Abrir Instagram Insights → anotar métricas da semana passada
2. Exportar dados de alcance, impressões, engajamento por post
3. Coletar prints de depoimentos/reações de membros
4. Preencher aba "Semanal" (colunas C-F) e "Diário"

**Fernando:**
1. Abrir ManyChat Analytics → anotar DMs, caminhos, cliques
2. Abrir Substack Dashboard → anotar aberturas, cliques
3. Abrir Google Analytics → filtrar por UTM `spoiler-semanal`
4. Abrir Kiwify → anotar vendas e receita
5. Preencher aba "Semanal" (colunas G-Q)
6. Escrever observações (coluna R)

### Reunião rápida (segunda 10h — 15 minutos)

**Pauta fixa:**
1. O que funcionou melhor na semana passada? (2 min)
2. O que não atingiu meta? Por quê? (3 min)
3. Qual ajuste fazemos essa semana? (5 min)
4. Confirmar tema astrológico e prazos (5 min)

**Participantes:** Fernando + Karol (Gabriel e Victor quando necessário)

---

## 5. Critérios de Otimização

### Quando mudar o quê

| Situação | Ação |
|----------|------|
| Alcance Reels caindo | Testar novo formato de gancho (Tipo A-E do template) |
| Poucos comentários com keyword | Reforçar CTA oral do Victor no final do Reel |
| ManyChat com poucas respostas | Verificar se triggers estão configurados corretamente |
| Taxa de clique LP baixa (<10%) | Revisar copy da mensagem 2 do ManyChat |
| Conversão LP baixa (<2%) | Revisar LP (copy, velocidade, CTA) |
| Substack com poucas aberturas | Testar subject lines diferentes |
| Caminho B muito maior que A | Criar mais conteúdo educativo sobre ascendente |
| Churn alto (>10%) | Pesquisar satisfação, melhorar conteúdo das aulas |

### Ciclos de teste

- **Semanal:** Trocar variação de CTA nos Reels e Stories
- **Quinzenal:** Analisar performance das variações e escolher a melhor
- **Mensal:** Review completo do funil — ajustar metas se necessário

---

*Documento referência para acompanhamento de métricas. Atualizar metas conforme resultados das primeiras semanas.*
