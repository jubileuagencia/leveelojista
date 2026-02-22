const https = require('https');
const TOKEN = 'pk_284457202_BHCMWP2K2UGRXHO39XSZP9XD4120W9HF';
const FERNANDO = 284457202;

// Current workspace lists
const LIST = {
  planejamento: '901325668052',  // Planejamento & Estratégia
  redacao:      '901325668053',  // Redação / Copy
  design:       '901325668054',  // Design / Audiovisual
  publicacao:   '901325668055',  // Publicação
  funis:        '901325668058',  // Criação de LPs / Funis
  campanhas:    '901325668059',  // Gestão de Campanhas
};
const SPACE_ID = '901313356803';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function apiCall(method, path, body) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.clickup.com',
      path: '/api/v2' + path,
      method,
      headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    };
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => (d += c));
      res.on('end', () => {
        try { resolve({ s: res.statusCode, d: JSON.parse(d) }); }
        catch { resolve({ s: res.statusCode, d }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function createTag(name, bgColor) {
  const r = await apiCall('POST', `/space/${SPACE_ID}/tag`, {
    tag: { name, tag_bg: bgColor, tag_fg: '#ffffff' }
  });
  if (r.s === 200) console.log(`  Tag "${name}" OK`);
  else console.log(`  Tag "${name}": ${r.s} ${JSON.stringify(r.d).substring(0, 80)}`);
  await sleep(200);
}

async function createTask(listId, data) {
  const r = await apiCall('POST', `/list/${listId}/task`, data);
  if (r.s === 200) {
    console.log(`  OK: ${data.name} (${r.d.id})`);
    return r.d;
  }
  console.error(`  ERRO: ${data.name} -> ${JSON.stringify(r.d).substring(0, 120)}`);
  return null;
}

async function addChecklist(taskId, name, items) {
  const r = await apiCall('POST', `/task/${taskId}/checklist`, { name });
  if (r.s !== 200) { console.error(`    CL ERRO: ${name}`); return; }
  const clId = r.d.checklist.id;
  for (const item of items) {
    await apiCall('POST', `/checklist/${clId}/checklist_item`, { name: item });
    await sleep(150);
  }
  console.log(`    CL: "${name}" (${items.length} itens)`);
}

function ms(dateStr) { return new Date(dateStr + 'T12:00:00Z').getTime(); }

// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log('══════════════════════════════════════════════════');
  console.log(' CAMPANHA: Spoiler Astrologico da Semana');
  console.log(' Space: OPERAÇÃO / Folders: Máquina de Conteúdo + Growth & Ads');
  console.log('══════════════════════════════════════════════════\n');

  // ── TAGS ──
  console.log('[0] Criando tags...');
  await createTag('pelicula-sideral', '#6C3FC5');
  await createTag('spoiler-semanal', '#FF6900');
  await createTag('funil', '#0B8043');
  await createTag('manychat', '#E91E63');
  await createTag('conteudo', '#1976D2');
  await createTag('estrategia', '#F9A825');
  await createTag('automacao', '#00ACC1');
  await createTag('substack', '#FF5722');

  // ═══════════════════════════════════════════════════
  // TASK 1: Mapear Funil (Planejamento)
  // ═══════════════════════════════════════════════════
  console.log('\n[1/9] SP1: Mapear Funil Semanal...');
  const sp1 = await createTask(LIST.planejamento, {
    name: 'SP1: Mapear Funil Semanal — Spoiler Astrológico da Semana',
    markdown_description: `# Objetivo
Criar o documento estratégico completo do funil de divulgação semanal do **Spoiler Astrológico da Semana**, conectando o alcance orgânico do Jornal Sideral (100k+) com vendas dos produtos.

# Contexto
A Película Sideral já tem ativos poderosos: o **Jornal Sideral** (Reels 2x/semana, 100k+ alcance orgânico) e os **Stories diários**. O funil transforma esse alcance em vendas recorrentes da **Comunidade Camarin Sideral** e do **Curso Decifrando o Mapa Astral**.

# Produtos no Funil
| Produto | Tipo | LP | Checkout |
|---------|------|-----|----------|
| Camarin Sideral | Assinatura mensal | optimizeformobile.vercel.app | Substack / Kiwify |
| Curso Decifrando Mapa Astral | Produto único | Em construção | Kiwify |

# Arquitetura do Funil
\`\`\`
TOPO — Awareness (100k+ alcance orgânico)
├── Reels: Jornal Sideral (2x/sem) → CTA "comenta seu ascendente"
├── Stories: Teaser do Spoiler → Caixinha de perguntas
└── Reels: Cortes/highlights do Spoiler anterior

MEIO — Consideration (DM automático via ManyChat)
├── Caminho A: Sabe ascendente → interpretação personalizada → oferta Camarin
├── Caminho B: Não sabe → tutorial → oferta Curso
└── Substack: conteúdo expandido → CTA Camarin

FUNDO — Conversão
├── LP Camarin Sideral → Checkout
└── LP Curso → Checkout
\`\`\`

# Como Fazer
1. **Documentar cada etapa** do funil com: objetivo, conteúdo, CTA, destino do link, e métrica de sucesso
2. **Mapear gatilhos de transição** entre etapas (o que faz a pessoa avançar)
3. **Criar diagrama visual** (Figma, Miro ou whiteboard) para compartilhar com a equipe
4. **Validar com equipe** — todos precisam entender o fluxo de ponta a ponta

# Entregável Final
Documento + diagrama visual do funil aprovado pela equipe.

---
**Cliente:** Película Sideral
**Campanha:** Spoiler Astrológico da Semana`,
    assignees: [FERNANDO],
    priority: 1,
    due_date: ms('2026-02-24'),
    start_date: ms('2026-02-20'),
    tags: ['pelicula-sideral', 'spoiler-semanal', 'estrategia', 'funil'],
  });
  await sleep(250);

  if (sp1) {
    // Subtasks for SP1
    const sub1a = await createTask(LIST.planejamento, {
      name: 'SP1.1: Documentar fluxo do TOPO (Reels + Stories)',
      parent: sp1.id,
      markdown_description: `# O que fazer
Documentar em detalhe como cada peça de conteúdo do TOPO do funil funciona:

## Reels — Jornal Sideral (2x/semana)
- **Formato atual:** Victor interpreta o céu da semana de forma poética e criativa
- **Alcance:** 100k+ orgânico por Reels
- **CTA a adicionar:** Fala final + legenda com palavra-chave ManyChat
- **Exemplos de CTA:**
  - No vídeo: "Se você quer saber como isso afeta SEU mapa, comenta seu ascendente"
  - Na legenda: "Comenta seu ascendente que eu te conto como essa energia chega pra você 👇"
- **Palavra-chave ManyChat:** Os 12 signos + "não sei" + "quero"

## Stories — Teaser do Spoiler da Semana
- **Sequência:** 6-8 stories (gancho → valor → caixinha → CTA)
- **Story 4 (caixinha):** "Qual seu ascendente?" → trigger ManyChat
- **Frequência:** 1x/semana (antes do dia da aula)

## Reels — Cortes do Spoiler anterior
- **Formato:** Melhores momentos da aula passada
- **CTA:** "Quer ver a aula completa? Link na bio"
- **Objetivo:** Gerar FOMO e converter quem já engajou

# Entregável
Seção "TOPO" do documento do funil, com descrição detalhada de cada peça.`,
      assignees: [FERNANDO],
      priority: 2,
      tags: ['pelicula-sideral', 'spoiler-semanal', 'conteudo'],
    });
    await sleep(250);

    const sub1b = await createTask(LIST.planejamento, {
      name: 'SP1.2: Documentar fluxo do MEIO (ManyChat + Substack)',
      parent: sp1.id,
      markdown_description: `# O que fazer
Documentar como o ManyChat e o Substack nutrem e convertem os leads do TOPO.

## ManyChat — Caminho A (Sabe o ascendente)
1. Usuário comenta signo nos Reels/Stories
2. ManyChat envia DM automático com mini-interpretação personalizada do tema da semana
3. Transição natural: "Toda semana eu mergulho mais fundo nisso no Camarin Sideral..."
4. Botão CTA → LP Camarin Sideral
- **12 variações de mensagem** (uma por signo)
- **Placeholder semanal:** {tema_semana} muda toda semana

## ManyChat — Caminho B (Não sabe o ascendente)
1. Usuário comenta "não sei" ou similar
2. ManyChat envia vídeo tutorial "Como descobrir seu ascendente" (60-90s)
3. Transição: "Agora que você sabe, quer entender como usar?"
4. Botão CTA → LP Curso Decifrando Mapa Astral

## Substack — Post semanal expandido
1. Conteúdo gratuito: panorama astrológico da semana (valor real)
2. Paywall: antes das interpretações por signo/ascendente
3. CTA final: convite para Camarin Sideral

# Entregável
Seção "MEIO" do documento do funil com fluxogramas de cada caminho.`,
      assignees: [FERNANDO],
      priority: 2,
      tags: ['pelicula-sideral', 'spoiler-semanal', 'manychat'],
    });
    await sleep(250);

    const sub1c = await createTask(LIST.planejamento, {
      name: 'SP1.3: Documentar fluxo do FUNDO (LPs + Checkout) e criar diagrama',
      parent: sp1.id,
      markdown_description: `# O que fazer

## Landing Pages
- **LP Camarin Sideral:** Já existe (optimizeformobile.vercel.app) — verificar se checkout funciona
- **LP Curso Decifrando Mapa Astral:** Em construção — definir prazo

## Checkout
- **Camarin mensal:** Link Substack
- **Camarin anual:** Link Kiwify
- **Curso:** Link Kiwify

## UTM Parameters
Definir padrão de UTM para rastrear origem:
- \`?utm_source=instagram&utm_medium=reels&utm_campaign=spoiler-semanal\`
- \`?utm_source=instagram&utm_medium=stories&utm_campaign=spoiler-semanal\`
- \`?utm_source=manychat&utm_medium=dm&utm_campaign=spoiler-semanal\`
- \`?utm_source=substack&utm_medium=email&utm_campaign=spoiler-semanal\`

## Diagrama Visual
Criar diagrama do funil completo em Figma ou Miro mostrando:
- Todas as peças de conteúdo
- Setas de transição entre etapas
- Ferramentas usadas em cada etapa (Instagram, ManyChat, Substack, Vercel)

# Entregável
Seção "FUNDO" + diagrama visual compartilhável.`,
      assignees: [FERNANDO],
      priority: 2,
      tags: ['pelicula-sideral', 'spoiler-semanal', 'funil'],
    });
    await sleep(250);
  }

  // ═══════════════════════════════════════════════════
  // TASK 2: Grade Semanal (Planejamento)
  // ═══════════════════════════════════════════════════
  console.log('\n[2/9] SP2: Grade Semanal...');
  const sp2 = await createTask(LIST.planejamento, {
    name: 'SP2: Definir Grade Semanal de Publicação do Funil',
    markdown_description: `# Objetivo
Definir o calendário semanal fixo de publicações que alimentam o funil. Todos os conteúdos devem estar sincronizados entre si e com o dia da aula (Spoiler).

# Grade Proposta (ajustar conforme dia real da aula)

| Dia | Conteúdo | Responsável | Papel no Funil |
|-----|---------|-------------|----------------|
| **Segunda** | Post Substack expandido | Fernando + IA | MEIO — Nurturing + CTA |
| **Terça** | Reels: Jornal Sideral #1 + CTA | Victor (grava) + Gabriel (edita) | TOPO — Alcance |
| **Quarta** | Stories: Teaser Spoiler + caixinha | Victor | TOPO — Engajamento |
| **Quinta** | Reels: Jornal Sideral #2 + CTA | Victor (grava) + Gabriel (edita) | TOPO — Alcance |
| **Sexta** | Stories: Lembrete + prova social | Victor ou Karol | TOPO — Urgência |
| **Sábado** | **AULA: Spoiler da Semana** | Victor + Sylvia | Entrega de valor |
| **Domingo** | Stories: Highlights da aula + CTA | Karol | TOPO — FOMO |

# Prazos Internos

| Entrega | Prazo |
|---------|-------|
| Briefing da semana seguinte | Sexta-feira |
| Roteiros de Reels e Stories | Segunda-feira |
| Gravações do Victor | Segunda/Terça |
| Edição dos Reels (Gabriel) | Terça (Reel #1) / Quarta (Reel #2) |
| Atualização do ManyChat (tema) | Segunda-feira |
| Post Substack | Segunda-feira |

# Como Fazer
1. Confirmar dia/horário da aula com Victor e Sylvia
2. Ajustar grade conforme dia real
3. Definir prazos internos realistas
4. Criar visualização compartilhável (tabela no ClickUp ou Google Sheets)
5. Testar na primeira semana e iterar

---
**Cliente:** Película Sideral
**Campanha:** Spoiler Astrológico da Semana`,
    assignees: [FERNANDO],
    priority: 1,
    due_date: ms('2026-02-24'),
    start_date: ms('2026-02-20'),
    tags: ['pelicula-sideral', 'spoiler-semanal', 'estrategia'],
  });
  await sleep(250);

  if (sp2) {
    await addChecklist(sp2.id, 'Definição do Calendário', [
      'Confirmar dia/horário da aula (Spoiler da Semana) com Victor e Sylvia',
      'Definir 2 dias fixos para Reels do Jornal Sideral',
      'Definir dia dos Stories de divulgação (antes da aula)',
      'Definir dia do post no Substack',
      'Definir dia dos Stories pós-aula (highlights/FOMO)',
      'Definir prazos internos: briefing → roteiro → gravação → edição → publicação',
      'Criar grade visual e compartilhar com equipe inteira',
      'Testar grade na semana piloto e ajustar',
    ]);
  }

  // ═══════════════════════════════════════════════════
  // TASK 3: Briefing Model (Planejamento)
  // ═══════════════════════════════════════════════════
  console.log('\n[3/9] SP3: Briefing Semanal...');
  const sp3 = await createTask(LIST.planejamento, {
    name: 'SP3: Criar Modelo de Briefing Semanal para Victor e Sylvia',
    markdown_description: `# Objetivo
Criar um modelo padrão de briefing semanal que será enviado a Victor e Sylvia com antecedência. O briefing centraliza TUDO que eles precisam para gravar na semana.

# Por que isso é importante
Atualmente os roteiros são feitos por Sylvia e Victor de forma independente. Ao criar o briefing, a agência:
- Integra o conteúdo ao funil desde a concepção
- Planeja CTAs com antecedência
- Alinha Reels + Stories + Substack no mesmo tema
- Reduz dependência do Fernando para cada decisão

# Estrutura do Briefing

## 1. Tema Astrológico da Semana
- Trânsitos relevantes (Lua Nova, Retrógrado, Ingresso, etc.)
- Signo em destaque
- Evento astrológico principal
- Tom emocional sugerido (intenso, leve, reflexivo, motivacional)

## 2. Roteiro Jornal Sideral (2 Reels)
- **Reel #1:** Tema + talking points + CTA sugerido
- **Reel #2:** Tema + talking points + CTA sugerido
- Palavra-chave ManyChat da semana

## 3. Roteiro Stories de Divulgação
- Sequência de 6-8 stories com objetivo de cada um
- Texto da caixinha de perguntas
- CTAs de cada story

## 4. Conteúdo Substack
- Tema do post expandido
- Key points para desenvolver
- Ponto sugerido para paywall

## 5. Prazos
- Data limite para gravação
- Data de publicação de cada peça

## 6. Links e Materiais
- Links de checkout atualizados
- Depoimentos/provas sociais para usar na semana

# Como Fazer
1. Escolher formato (Google Doc, Notion, ou ClickUp Doc)
2. Criar template com todas as seções acima
3. Preencher o primeiro briefing real (semana piloto)
4. Enviar para Victor/Sylvia e pedir feedback
5. Ajustar conforme retorno deles
6. Definir quem prepara semanalmente (Fernando ou IA + revisão)

---
**Cliente:** Película Sideral
**Campanha:** Spoiler Astrológico da Semana`,
    assignees: [FERNANDO],
    priority: 2,
    due_date: ms('2026-02-26'),
    start_date: ms('2026-02-22'),
    tags: ['pelicula-sideral', 'spoiler-semanal', 'conteudo'],
  });
  await sleep(250);

  if (sp3) {
    await addChecklist(sp3.id, 'Modelo de Briefing', [
      'Definir formato do briefing (Google Doc / Notion / ClickUp Doc)',
      'Criar seção: Tema Astrológico da Semana',
      'Criar seção: Roteiro dos 2 Reels (com CTA integrado)',
      'Criar seção: Roteiro dos Stories (6-8 stories + caixinha)',
      'Criar seção: Conteúdo Substack (tema + key points)',
      'Criar seção: Prazos de gravação e publicação',
      'Criar seção: Links atualizados e materiais de apoio',
      'Definir quem prepara o briefing semanalmente',
      'Definir prazo de entrega (sexta para semana seguinte)',
      'Validar formato com Victor e Sylvia',
      'Criar primeiro briefing real para semana piloto',
    ]);
  }

  // ═══════════════════════════════════════════════════
  // TASK 4: Roteiro Reels (Redação)
  // ═══════════════════════════════════════════════════
  console.log('\n[4/9] SP4: Roteiro Reels...');
  const sp4 = await createTask(LIST.redacao, {
    name: 'SP4: Criar Roteiro Padrão — Reels Jornal Sideral com CTA para Funil',
    markdown_description: `# Objetivo
Adaptar o roteiro do Jornal Sideral para incluir CTA que direciona ao funil, de forma **natural e integrada** ao conteúdo. O Jornal já tem 100k+ de alcance — o CTA NÃO pode comprometer essa autenticidade.

# Regra de Ouro
> O CTA deve parecer uma extensão natural da conversa, nunca uma propaganda.

# Estrutura do Roteiro

## [INTRO] — 0 a 5 segundos
Gancho forte que prende atenção:
- "Essa semana o céu tá pedindo atenção..."
- "Se você tem planetas em [signo], presta atenção..."
- "O que acontece quando [trânsito] ativa o [signo]..."

## [CONTEÚDO] — 5 a 50 segundos
Interpretação poética e criativa do Victor (manter essência atual):
- Explicar o tema astrológico da semana
- Conectar com situações reais da vida
- Manter tom acessível e envolvente

## [CTA] — últimos 10 segundos
Transição natural:
- "Se você quer saber como isso afeta SEU mapa, comenta seu ascendente aqui embaixo"
- "Comenta seu signo que eu te mando uma mensagem sobre isso"
- "Quer ir mais fundo? Comenta QUERO"

## [LEGENDA]
Template:
\`\`\`
[Texto curto sobre o tema da semana]

Comenta seu ascendente que eu te conto como essa energia chega pra você 👇

#astrologia #mapastral #signos #[signo da semana]
\`\`\`

# 5 Variações de CTA (rotacionar semanalmente)
1. "Comenta seu ascendente que eu te conto como isso chega pra você"
2. "Quer saber o que o céu reserva pro seu signo? Comenta aqui"
3. "Comenta QUERO que eu te mando uma surpresa no DM"
4. "Qual seu ascendente? Me conta que eu te explico"
5. "Isso afeta cada signo diferente. Comenta o seu que eu te conto"

# Instruções para Victor
- Manter a essência poética e criativa
- CTA deve ser falado como se estivesse conversando com um amigo
- NÃO usar linguagem de vendas ("compre", "assine", "link na bio")
- Variar CTAs para não ficar repetitivo
- Olhar para câmera no momento do CTA (conexão)

---
**Cliente:** Película Sideral
**Campanha:** Spoiler Astrológico da Semana`,
    assignees: [FERNANDO],
    priority: 2,
    due_date: ms('2026-02-25'),
    start_date: ms('2026-02-21'),
    tags: ['pelicula-sideral', 'spoiler-semanal', 'conteudo'],
  });
  await sleep(250);

  if (sp4) {
    await addChecklist(sp4.id, 'Roteiro Reels', [
      'Analisar 5 últimos Reels do Jornal Sideral (formato, duração, engajamento)',
      'Identificar o momento natural de inserção do CTA (sem quebrar ritmo)',
      'Criar modelo de CTA para DENTRO do vídeo (fala do Victor)',
      'Criar modelo de CTA para LEGENDA (com palavra-chave ManyChat)',
      'Escrever 5 variações de CTA para rotacionar',
      'Definir hashtags padrão',
      'Montar template de roteiro completo: [INTRO] → [CONTEÚDO] → [CTA]',
      'Validar com Victor: o CTA parece natural? Ele se sente confortável?',
      'Publicar primeiro Reels com novo CTA e medir resultado',
    ]);
  }

  // ═══════════════════════════════════════════════════
  // TASK 5: Roteiro Stories (Redação)
  // ═══════════════════════════════════════════════════
  console.log('\n[5/9] SP5: Roteiro Stories...');
  const sp5 = await createTask(LIST.redacao, {
    name: 'SP5: Criar Roteiro Padrão — Stories Divulgação Spoiler da Semana',
    markdown_description: `# Objetivo
Criar template de roteiro para a sequência de Stories que divulga a aula semanal. Os Stories devem **engajar, entregar valor e direcionar para o ManyChat**.

# Sequência de 6-8 Stories

| # | Tipo | Conteúdo | Objetivo |
|---|------|---------|----------|
| 1 | Vídeo (selfie) | "Essa semana o céu tá {intenso/mágico/desafiador}..." | **Gancho** — curiosidade |
| 2 | Vídeo | Explicação breve do tema astrológico | **Valor** — entregar algo útil |
| 3 | Vídeo/texto | "Se você tem planetas em {signo}, presta atenção..." | **Valor** — aprofundar |
| 4 | **Caixinha** | "Qual seu ascendente? Comenta que eu te conto como chega pra você" | **Trigger ManyChat** |
| 5 | Vídeo | Victor responde 2-3 perguntas ao vivo | **Autenticidade** |
| 6 | Imagem/vídeo | Depoimento de membro do Camarin | **Prova social** |
| 7 | Texto + link | "A aula dessa semana é {dia}. Não perde." | **Urgência** |
| 8 | Vídeo | Convite direto para comunidade | **CTA final** |

# Detalhamento por Story

## Story 1 — Gancho (3 modelos para rotacionar)
**Modelo A:** "Gente, essa semana o céu tá PEDINDO atenção. Sabe por quê?"
**Modelo B:** "Vocês não tão prontos pro que tá vindo essa semana..."
**Modelo C:** "Se eu pudesse resumir essa semana em uma palavra seria: {palavra}"

## Story 4 — Caixinha de Perguntas (CRÍTICO)
**Texto exato:** "Qual seu ascendente? Comenta aqui que eu te conto como essa energia chega pra você essa semana ✨"
**Alternativa:** "Seu ascendente é qual? Me conta que eu te mando algo especial"
> Este story é o trigger do ManyChat. A resposta do usuário aciona o fluxo automático.

## Story 6 — Prova Social
**Fonte:** Coletar prints/vídeos de membros do Camarin falando sobre a aula da semana passada
**Formato:** Repost de story do membro OU print de comentário
**Texto:** "Olha o que a {nome} falou da aula passada 🥹"

## Story 7-8 — CTA Final (3 variações)
**V1:** "A aula dessa semana é {dia} às {hora}. Se você quer entender de verdade o que o céu tá dizendo, o Camarin te espera. Link na bio ✨"
**V2:** "Semana passada quem tava no Camarin já sabia de tudo isso antes. Quer fazer parte? Comenta QUERO"
**V3:** "Toda semana eu abro o céu pra vocês no Camarin. Se faz sentido pra você, o link tá na bio 💜"

# Versões por Tema Astrológico
Criar adaptações para:
- **Lua Nova** — tom de começo, intenção, plantio
- **Lua Cheia** — tom de culminação, revelação, colheita
- **Retrógrado** — tom de revisão, paciência, introspecção
- **Eclipse** — tom de transformação, virada, intensidade
- **Ingresso** — tom de mudança de energia, novo ciclo

# Instruções para Victor/Sylvia
- Gravar com celular em modo selfie (autenticidade > produção)
- Boa iluminação natural, áudio claro
- Energia alinhada com o tema da semana
- Stories 1-3: podem ser mais espontâneos
- Story 4 (caixinha): texto preparado com cuidado
- NÃO precisa ser perfeito, precisa ser REAL

---
**Cliente:** Película Sideral
**Campanha:** Spoiler Astrológico da Semana`,
    assignees: [FERNANDO],
    priority: 2,
    due_date: ms('2026-02-25'),
    start_date: ms('2026-02-21'),
    tags: ['pelicula-sideral', 'spoiler-semanal', 'conteudo'],
  });
  await sleep(250);

  if (sp5) {
    await addChecklist(sp5.id, 'Roteiro Stories', [
      'Definir sequência completa de 6-8 stories com objetivo de cada um',
      'Escrever 3 modelos de abertura/gancho para rotacionar',
      'Escrever texto exato da caixinha de perguntas (Story 4 — trigger ManyChat)',
      'Coletar depoimentos de membros do Camarin para prova social (Story 6)',
      'Escrever 3 variações de CTA final com urgência sutil (Story 7-8)',
      'Criar versões adaptadas por tema: Lua Nova, Lua Cheia, Retrógrado, Eclipse, Ingresso',
      'Definir melhor horário de publicação (consultar analytics do perfil)',
      'Definir quem publica: Victor ao vivo ou equipe agenda via Meta Business',
      'Aprovar modelo com Victor e Sylvia',
    ]);
  }

  // ═══════════════════════════════════════════════════
  // TASK 6: Template Substack (Redação)
  // ═══════════════════════════════════════════════════
  console.log('\n[6/9] SP6: Template Substack...');
  const sp6 = await createTask(LIST.redacao, {
    name: 'SP6: Criar Template de Post Substack Semanal com CTA',
    markdown_description: `# Objetivo
Criar template reutilizável no Substack para publicar semanalmente uma versão expandida do conteúdo astrológico, com CTA para Camarin Sideral.

# Estratégia de Conversão
- Conteúdo gratuito entrega **valor real** para gerar confiança
- Paywall posicionado no momento de **maior curiosidade** (antes das interpretações por signo)
- CTA posicionado como **upgrade natural** da experiência

# Estrutura do Post

## 1. Título (chamativo + SEO)
Padrão: "{Evento astrológico}: O que esperar na semana de {data}"
Exemplo: "Lua Nova em Peixes: O que esperar na semana de 3 a 9 de março"

## 2. Introdução gratuita (3-4 parágrafos)
- Panorama geral da semana
- Tom acessível, como conversa
- Entregar insight genuíno (não teaser vazio)
- Conectar com situações práticas da vida

## 3. Conteúdo principal gratuito
- Trânsitos importantes da semana
- Interpretação por elemento (Fogo, Terra, Ar, Água)
- Dicas práticas gerais

## 4. >>> PAYWALL <<<
**Texto antes do paywall:**
"Agora, vamos ao que interessa: como isso afeta CADA ascendente. Continue lendo para descobrir o que o céu reserva especificamente pra você esta semana."

## 5. Conteúdo pago (exclusivo assinantes)
- Interpretação por ascendente (12 seções)
- Conselho prático para cada signo
- "Dica da semana" personalizada

## 6. CTA final
**Opção A:** "Se esse conteúdo fez sentido pra você, imagina ter isso toda semana ao vivo, com espaço pra tirar dúvidas e aprofundar. É isso que acontece no Camarin Sideral. [Link]"
**Opção B:** "Toda semana eu mergulho mais fundo no Camarin. Se você quer ir além do horóscopo, te espero lá. [Link]"
**Opção C (para iniciantes):** "Não sabe ler seu mapa? No curso Decifrando o Mapa Astral eu te ensino do zero. [Link]"

# Como Fazer
1. Criar template no Substack com placeholders
2. Definir ponto do paywall
3. Escrever 3 variações de CTA para rotacionar
4. Configurar cross-posting (Substack → email automático)
5. Publicar primeiro post piloto
6. Medir: aberturas, cliques no CTA, conversões

---
**Cliente:** Película Sideral
**Campanha:** Spoiler Astrológico da Semana`,
    assignees: [FERNANDO],
    priority: 2,
    due_date: ms('2026-02-27'),
    start_date: ms('2026-02-24'),
    tags: ['pelicula-sideral', 'spoiler-semanal', 'substack', 'conteudo'],
  });
  await sleep(250);

  if (sp6) {
    await addChecklist(sp6.id, 'Template Substack', [
      'Criar template com placeholders: {tema_semana}, {signo_destaque}, {transitos}',
      'Escrever introdução modelo (tom acessível, valor real)',
      'Definir ponto exato do paywall',
      'Escrever texto de transição para paywall (gerar curiosidade)',
      'Escrever 3 variações de CTA para Camarin (rotacionar semanalmente)',
      'Escrever CTA alternativo para Curso (para iniciantes)',
      'Configurar cross-posting: Substack → email automático',
      'Publicar post piloto e medir resultado',
    ]);
  }

  // ═══════════════════════════════════════════════════
  // TASK 7: ManyChat (Campanhas) — COM SUBTASKS
  // ═══════════════════════════════════════════════════
  console.log('\n[7/9] SP7: ManyChat...');
  const sp7 = await createTask(LIST.campanhas, {
    name: 'SP7: Configurar Fluxo ManyChat — Spoiler Astrológico Semanal',
    markdown_description: `# Objetivo
Configurar o ManyChat para responder automaticamente quando pessoas interagirem nos Stories/Reels sobre o Spoiler. O fluxo é **reutilizável** — mesma estrutura toda semana, só muda o tema astrológico.

# Visão Geral dos Fluxos

## Trigger
Comentário ou resposta nos Stories/Reels com palavra-chave.
**Palavras-chave:** áries, touro, gêmeos, câncer, leão, virgem, libra, escorpião, sagitário, capricórnio, aquário, peixes, não sei, nao sei, quero, spoiler

## Caminho A — Sabe o ascendente
\`\`\`
Usuário comenta "áries" (ou qualquer signo)
  → DM: "Oi! Vi que seu ascendente é Áries ♈ {mini-interpretação da semana para Áries}"
  → Delay 30s
  → DM: "Toda semana eu aprofundo isso ao vivo no Camarin Sideral. Quer conhecer?"
  → Botão: "Quero fazer parte ✨" → Link LP Camarin
  → Botão: "Agora não, obrigado" → Tag: remarketing
\`\`\`

## Caminho B — Não sabe o ascendente
\`\`\`
Usuário comenta "não sei"
  → DM: "Sem problema! Muita gente não sabe. Fiz um vídeo rápido te mostrando como descobrir 😊"
  → Enviar vídeo tutorial (60-90s)
  → Delay 2min
  → DM: "Conseguiu descobrir? Saber seu ascendente muda tudo na astrologia!"
  → Botão: "Quero aprender mais" → Link LP Curso
  → Botão: "Descobri! Meu ascendente é..." → Redireciona para Caminho A
\`\`\`

## Fallback
\`\`\`
Comentário não reconhecido
  → DM: "Oi! Não consegui identificar seu signo. Pode me dizer qual seu ascendente? (ex: Áries, Touro, Gêmeos...) Se não sabe, responde 'não sei' que eu te ajudo 😊"
\`\`\`

# Atualização Semanal
Toda segunda-feira, trocar APENAS o conteúdo das mini-interpretações:
- Variável \`{tema_semana}\` → descrição do tema (ex: "Lua Nova em Peixes")
- 12 variáveis \`{interp_aries}\` a \`{interp_peixes}\` → mini-interpretação por signo

**Doc de instrução** para equipe: passo a passo de como atualizar o tema no ManyChat.

---
**Cliente:** Película Sideral
**Campanha:** Spoiler Astrológico da Semana`,
    assignees: [FERNANDO],
    priority: 1,
    due_date: ms('2026-02-28'),
    start_date: ms('2026-02-24'),
    tags: ['pelicula-sideral', 'spoiler-semanal', 'manychat', 'automacao', 'funil'],
  });
  await sleep(250);

  if (sp7) {
    // Subtasks for ManyChat
    await createTask(LIST.campanhas, {
      name: 'SP7.1: Configurar Caminho A — 12 ascendentes',
      parent: sp7.id,
      markdown_description: `# O que fazer
Criar no ManyChat o fluxo completo para quem comenta seu signo ascendente.

# Passo a passo
1. Criar trigger de palavra-chave: áries, touro, gêmeos, câncer, leão, virgem, libra, escorpião, sagitário, capricórnio, aquário, peixes
2. Para cada signo, criar mensagem personalizada:
   - Saudação com nome do signo + emoji
   - Mini-interpretação do tema da semana ({interp_signo})
   - Delay de 30 segundos
   - Transição para oferta Camarin
   - Botão CTA → link LP Camarin + UTM
   - Botão "agora não" → aplicar tag "remarketing"
3. Configurar variável dinâmica {tema_semana} para facilitar atualização
4. Testar com pelo menos 3 signos diferentes

# Modelo de Mensagem
"Oi! Vi que seu ascendente é **{signo}** {emoji}

Essa semana, com {tema_semana}, isso significa que {interp_signo}

✨ Cuida dessa energia e aproveita o momento."

[Delay 30s]

"Toda semana eu aprofundo isso ao vivo no **Camarin Sideral**, com espaço pra tirar dúvidas e entender como cada trânsito afeta seu mapa. Quer conhecer?"

[Botão: Quero fazer parte ✨] → Link LP
[Botão: Agora não, obrigado]`,
      assignees: [FERNANDO],
      priority: 2,
      tags: ['pelicula-sideral', 'manychat', 'automacao'],
    });
    await sleep(250);

    await createTask(LIST.campanhas, {
      name: 'SP7.2: Configurar Caminho B — "não sei" + tutorial',
      parent: sp7.id,
      markdown_description: `# O que fazer
Criar no ManyChat o fluxo para quem responde "não sei" quando perguntado sobre ascendente.

# Passo a passo
1. Criar trigger: "não sei", "nao sei", "n sei", "não tenho certeza"
2. Mensagem 1: Acolhimento + envio de vídeo tutorial
3. Delay de 2 minutos (tempo de assistir o vídeo)
4. Mensagem 2: Pergunta se conseguiu descobrir
5. Botão A: "Quero aprender mais" → link LP Curso + UTM
6. Botão B: "Descobri! Meu ascendente é..." → redireciona para Caminho A

# Modelo de Mensagem

**Mensagem 1:**
"Sem problema! Muita gente não sabe e tá tudo bem 😊

Fiz um vídeo rapidinho (1 minuto) te mostrando como descobrir. É super fácil!"

[Enviar vídeo tutorial]

[Delay 2 min]

**Mensagem 2:**
"E aí, conseguiu descobrir? 🌟

Saber seu ascendente muda TUDO na astrologia. É a chave pra entender como os trânsitos afetam sua vida de verdade."

[Botão: Quero aprender mais sobre meu mapa] → LP Curso
[Botão: Descobri! Meu ascendente é...] → Caminho A

# Vídeo Tutorial Necessário
- Gravar com Victor: "Como descobrir seu ascendente em 1 minuto"
- Formato: vertical (9:16), 60-90 segundos
- Mostrar passo a passo (site astro.com ou app)
- CTA suave no final`,
      assignees: [FERNANDO],
      priority: 2,
      tags: ['pelicula-sideral', 'manychat', 'automacao'],
    });
    await sleep(250);

    await createTask(LIST.campanhas, {
      name: 'SP7.3: Configurar Fallback + Pixel + Doc de atualização',
      parent: sp7.id,
      markdown_description: `# O que fazer
Finalizar a configuração do ManyChat com fallback, integração com Pixel, e documentação.

# 1. Mensagem de Fallback
Para comentários que o ManyChat não reconhece:
"Oi! Não consegui identificar seu signo 😅 Pode me dizer qual seu ascendente? (ex: Áries, Touro, Gêmeos...) Se não sabe, responde **não sei** que eu te ajudo a descobrir!"

# 2. Integração com Pixel do Facebook
Configurar eventos customizados no ManyChat:
- **Evento 1:** "manychat_caminho_a" → quando recebe interpretação do signo
- **Evento 2:** "manychat_caminho_b" → quando recebe vídeo tutorial
- **Evento 3:** "manychat_clique_camarin" → quando clica no botão da LP Camarin
- **Evento 4:** "manychat_clique_curso" → quando clica no botão da LP Curso
→ Esses eventos permitem criar públicos de remarketing no Meta Ads

# 3. Documento de Atualização Semanal
Criar doc com passo a passo para a equipe atualizar o tema toda segunda:
1. Abrir ManyChat → Flows → "Spoiler Semanal"
2. Editar variável {tema_semana}
3. Editar 12 variáveis de interpretação ({interp_aries} a {interp_peixes})
4. Salvar e publicar
5. Testar com um comentário de teste
→ Tempo estimado: 15-20 minutos por semana

# 4. Testes Finais
- Testar Caminho A com 3 signos diferentes
- Testar Caminho B completo
- Testar Fallback
- Verificar eventos do Pixel no Pixel Helper (Chrome)`,
      assignees: [FERNANDO],
      priority: 2,
      tags: ['pelicula-sideral', 'manychat', 'automacao'],
    });
    await sleep(250);
  }

  // ═══════════════════════════════════════════════════
  // TASK 8: Semana Piloto (Campanhas)
  // ═══════════════════════════════════════════════════
  console.log('\n[8/9] SP8: Semana Piloto...');
  const sp8 = await createTask(LIST.campanhas, {
    name: 'SP8: Semana Piloto — Primeiro Ciclo Completo do Funil',
    markdown_description: `# Objetivo
Executar o **primeiro ciclo completo** do funil de divulgação do Spoiler da Semana. Esta é a semana de teste para validar TUDO antes de tornar recorrente.

# Pré-requisitos (tudo deve estar pronto antes)
- ✅ Funil mapeado e aprovado (SP1)
- ✅ Grade semanal definida (SP2)
- ✅ Briefing semanal criado (SP3)
- ✅ Templates de roteiro prontos (SP4 + SP5)
- ✅ ManyChat configurado e testado (SP7)
- ✅ Template Substack pronto (SP6)

# Cronograma da Semana Piloto

| Dia | Ação | Responsável |
|-----|------|-------------|
| Sexta (anterior) | Enviar briefing para Victor/Sylvia | Fernando |
| Segunda | Publicar post Substack + Atualizar ManyChat | Fernando |
| Segunda/Terça | Victor grava 2 Reels + Stories | Victor |
| Terça | Gabriel edita Reel #1 | Gabriel |
| Terça | Publicar Reel #1 (com CTA) | Gabriel/Karol |
| Quarta | Gabriel edita Reel #2 | Gabriel |
| Quarta | Publicar Stories (teaser + caixinha) | Victor |
| Quarta | **ATIVAR ManyChat** e monitorar | Fernando + Gabriel |
| Quinta | Publicar Reel #2 | Gabriel/Karol |
| Sexta | Stories: lembrete + prova social | Karol |
| Sábado | **AULA (Spoiler da Semana)** | Victor + Sylvia |
| Domingo | Stories: highlights da aula | Karol |

# Monitoramento (CRÍTICO nas primeiras 2h após cada publicação)
- ManyChat está respondendo? DMs chegam?
- Links estão corretos? Checkout funciona?
- Pixel está disparando?
- Algum erro nos fluxos?

# Após a Semana
1. Coletar TODAS as métricas (ver SP9)
2. Reunião de análise com equipe inteira
3. Documentar: o que funcionou, o que falhou, o que ajustar
4. Iterar para semana 2

---
**Cliente:** Película Sideral
**Campanha:** Spoiler Astrológico da Semana`,
    assignees: [FERNANDO],
    priority: 1,
    due_date: ms('2026-03-07'),
    start_date: ms('2026-03-02'),
    tags: ['pelicula-sideral', 'spoiler-semanal', 'funil'],
  });
  await sleep(250);

  if (sp8) {
    await addChecklist(sp8.id, 'Execução Semana Piloto', [
      'Enviar briefing da semana para Victor/Sylvia (sexta anterior)',
      'Atualizar tema da semana no ManyChat (segunda)',
      'Publicar post no Substack (segunda)',
      'Victor grava 2 Reels do Jornal Sideral com CTA',
      'Victor grava sequência de Stories de divulgação',
      'Gabriel edita e entrega Reel #1',
      'Publicar Reel #1 com legenda + palavra-chave ManyChat',
      'Gabriel edita e entrega Reel #2',
      'Publicar Stories com caixinha de perguntas',
      'ATIVAR ManyChat — monitorar primeiras 2 horas',
      'Verificar Caminho A funciona (ascendente → resposta → CTA Camarin)',
      'Verificar Caminho B funciona (não sei → tutorial → CTA Curso)',
      'Publicar Reel #2',
      'Publicar Stories de lembrete + prova social (sexta)',
      'AULA: Spoiler da Semana (sábado)',
      'Publicar Stories pós-aula com highlights (domingo)',
      'Coletar métricas completas do ciclo',
      'Reunião de análise com equipe',
      'Documentar lições aprendidas e ajustes para semana 2',
    ]);
  }

  // ═══════════════════════════════════════════════════
  // TASK 9: KPIs (Campanhas)
  // ═══════════════════════════════════════════════════
  console.log('\n[9/9] SP9: KPIs...');
  const sp9 = await createTask(LIST.campanhas, {
    name: 'SP9: Definir KPIs e Dashboard de Métricas Semanal',
    markdown_description: `# Objetivo
Definir KPIs e criar dashboard para acompanhar semanalmente o desempenho do funil e otimizar continuamente.

# KPIs por Etapa do Funil

## TOPO — Awareness
| Métrica | Meta Mínima | Meta Ideal | Fonte |
|---------|------------|------------|-------|
| Alcance Reels (Jornal Sideral) | 50k | 100k+ | Instagram Insights |
| Impressões Stories | 3k | 8k+ | Instagram Insights |
| Comentários com keyword nos Reels | 30 | 100+ | Instagram + ManyChat |
| Respostas na caixinha | 50 | 150+ | Instagram Insights |

## MEIO — Consideration
| Métrica | Meta Mínima | Meta Ideal | Fonte |
|---------|------------|------------|-------|
| DMs ManyChat acionados | 30 | 100+ | ManyChat Analytics |
| Taxa de resposta ManyChat | 70% | 85%+ | ManyChat Analytics |
| Cliques no link LP via ManyChat | 15 | 50+ | ManyChat + UTM |
| Aberturas post Substack | 100 | 300+ | Substack Dashboard |
| Cliques CTA Substack | 10 | 30+ | Substack Dashboard |

## FUNDO — Conversão
| Métrica | Meta Mínima | Meta Ideal | Fonte |
|---------|------------|------------|-------|
| Visitas LP Camarin | 20 | 60+ | Google Analytics |
| Visitas LP Curso | 10 | 30+ | Google Analytics |
| Taxa conversão LP | 2% | 5%+ | GA + Checkout |
| Novas assinaturas Camarin | 3/sem | 10+/sem | Substack/Kiwify |
| Vendas Curso | 2/sem | 5+/sem | Kiwify |
| Receita semanal | R$200 | R$500+ | Kiwify + Substack |

# Dashboard
Criar planilha Google Sheets com:
- Aba "Semanal": uma linha por semana, colunas = KPIs acima
- Aba "Diário": métricas dia a dia (alcance, interações)
- Gráficos automáticos de tendência
- Coluna de "Observações" para anotar o que mudou na semana

# UTM Parameters Padrão
Padronizar todos os links do funil:
- \`utm_source\`: instagram, manychat, substack
- \`utm_medium\`: reels, stories, dm, email
- \`utm_campaign\`: spoiler-semanal
- \`utm_content\`: caminho-a, caminho-b, cta-post

# Rotina de Análise
- **Toda segunda:** Preencher dashboard com dados da semana anterior
- **Toda segunda (10h):** Reunião de 15min para review de métricas
- **Responsável pela coleta:** Karol (Instagram) + Fernando (ManyChat, Substack, GA)

---
**Cliente:** Película Sideral
**Campanha:** Spoiler Astrológico da Semana`,
    assignees: [FERNANDO],
    priority: 3,
    due_date: ms('2026-02-28'),
    start_date: ms('2026-02-24'),
    tags: ['pelicula-sideral', 'spoiler-semanal', 'estrategia'],
  });
  await sleep(250);

  if (sp9) {
    await addChecklist(sp9.id, 'KPIs e Dashboard', [
      'Definir KPIs de TOPO: alcance, impressões, comentários, respostas',
      'Definir KPIs de MEIO: DMs ManyChat, taxa resposta, cliques, aberturas Substack',
      'Definir KPIs de FUNDO: visitas LP, conversão, vendas, receita',
      'Criar planilha Google Sheets com abas Semanal + Diário',
      'Configurar Google Analytics nas LPs (se não tem)',
      'Definir UTM parameters padrão para todos os links',
      'Definir responsável por coleta de dados semanais',
      'Agendar reunião semanal de review (segunda 10h, 15min)',
    ]);
  }

  // ═══════════════════════════════════════════════════
  console.log('\n══════════════════════════════════════════════════');
  console.log(' RESUMO');
  console.log('══════════════════════════════════════════════════');
  console.log(' Planejamento & Estratégia: SP1 (+ 3 subtasks), SP2, SP3');
  console.log(' Redação / Copy: SP4, SP5, SP6');
  console.log(' Gestão de Campanhas: SP7 (+ 3 subtasks), SP8, SP9');
  console.log(' Total: 9 tasks + 6 subtasks + checklists');
  console.log('══════════════════════════════════════════════════');
}

main().catch(err => { console.error('FATAL:', err.message); process.exit(1); });
