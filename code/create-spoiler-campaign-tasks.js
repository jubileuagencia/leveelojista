/**
 * Create ClickUp tasks for "Campanha Divulgação Spoiler Astrológico da Semana"
 * Uses ClickUp REST API v2
 */

const https = require('https');

const API_TOKEN = 'pk_284457202_BHCMWP2K2UGRXHO39XSZP9XD4120W9HF';
const FERNANDO_ID = 284457202;

// Pelicula Sideral lists
const LISTS = {
  calendario: '901325630680',
  tarefas: '901325630685',
  funis: '901325630690',
  produtos: '901325630697',
};

function apiCall(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.clickup.com',
      path: `/api/v2${path}`,
      method,
      headers: {
        'Authorization': API_TOKEN,
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function createTask(listId, task) {
  const res = await apiCall('POST', `/list/${listId}/task`, task);
  if (res.status !== 200) {
    console.error(`  ERRO criando task "${task.name}":`, JSON.stringify(res.data));
    return null;
  }
  console.log(`  OK: "${task.name}" (${res.data.id})`);
  return res.data;
}

async function addChecklist(taskId, name, items) {
  const clRes = await apiCall('POST', `/task/${taskId}/checklist`, { name });
  if (clRes.status !== 200) {
    console.error(`  ERRO checklist "${name}":`, JSON.stringify(clRes.data));
    return;
  }
  const checklistId = clRes.data.checklist.id;
  for (const item of items) {
    await apiCall('POST', `/checklist/${checklistId}/checklist_item`, { name: item });
    await sleep(150);
  }
  console.log(`    Checklist "${name}" (${items.length} itens)`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Convert date string to ms timestamp
function toMs(dateStr) { return new Date(dateStr + 'T12:00:00Z').getTime(); }

async function main() {
  console.log('=== CAMPANHA: Divulgacao Spoiler Astrologico da Semana ===\n');

  // ──────────────────────────────────────────────
  // TASK 1: Estrategia do Funil (Funis & Automacoes)
  // ──────────────────────────────────────────────
  console.log('[1/9] Criando estrategia do funil...');
  const t1 = await createTask(LISTS.funis, {
    name: '[ESTRATEGIA] Mapear Funil Semanal: Spoiler Astrologico da Semana',
    description: `## Objetivo\nDocumentar o fluxo completo do funil de divulgacao semanal do Spoiler Astrologico da Semana.\n\n## Contexto\nO funil conecta o alcance organico do Jornal Sideral (100k+ por Reels) e Stories com automacao ManyChat para converter em vendas do Camarin Sideral e Curso Decifrando o Mapa Astral.\n\n## Estrutura do Funil\n\`\`\`\nTOPO (Awareness)\n├── Reels: Jornal Sideral (2x/sem, 100k+ reach) → CTA comentarios\n├── Stories: Teaser do Spoiler → Caixinha de perguntas\n└── Reels: Cortes/highlights do Spoiler anterior\n\nMEIO (Consideration)\n├── ManyChat: Caminho A (sabe ascendente) → Conteudo personalizado → Oferta Camarin\n├── ManyChat: Caminho B (nao sabe) → Tutorial ascendente → Oferta Curso\n└── Substack: Versao expandida do conteudo astro → CTA Camarin\n\nFUNDO (Conversion)\n├── LP Camarin Sideral → Checkout Substack/Kiwify\n└── LP Curso Decifrando Mapa Astral → Checkout Kiwify\n\`\`\`\n\n## Entregavel\nDocumento estrategico com diagrama visual do funil, descricao de cada etapa, e metricas esperadas.`,
    assignees: [FERNANDO_ID],
    priority: 1,
    due_date: toMs('2026-02-24'),
    start_date: toMs('2026-02-20'),
    tags: ['estrategia', 'funil', 'spoiler-semana'],
  });
  if (t1) {
    await addChecklist(t1.id, 'Mapeamento do Funil', [
      'Documentar fluxo TOPO: Reels Jornal Sideral → CTA nos comentarios (palavra-chave ManyChat)',
      'Documentar fluxo TOPO: Stories teaser do Spoiler → Caixinha de perguntas (ascendente)',
      'Documentar fluxo TOPO: Reels com cortes/highlights do Spoiler anterior',
      'Documentar fluxo MEIO: ManyChat Caminho A → sabe ascendente → conteudo personalizado → oferta Camarin',
      'Documentar fluxo MEIO: ManyChat Caminho B → nao sabe ascendente → video tutorial → oferta Curso',
      'Documentar fluxo MEIO: Substack versao expandida do conteudo → CTA Camarin no final',
      'Documentar fluxo FUNDO: LP Camarin Sideral → Checkout (Substack mensal / Kiwify anual)',
      'Documentar fluxo FUNDO: LP Curso Decifrando Mapa Astral → Checkout Kiwify',
      'Criar diagrama visual do funil (Figma, Miro ou similar)',
      'Definir gatilhos de transicao entre etapas (o que faz a pessoa avancar)',
      'Aprovar estrategia com equipe (Fernando + Gabriel + Karol)',
    ]);
  }
  await sleep(200);

  // ──────────────────────────────────────────────
  // TASK 2: ManyChat Setup (Funis & Automacoes)
  // ──────────────────────────────────────────────
  console.log('[2/9] Criando setup ManyChat...');
  const t2 = await createTask(LISTS.funis, {
    name: '[MANYCHAT] Configurar Fluxo Semanal - Divulgacao Spoiler da Semana',
    description: `## Objetivo\nConfigurar o ManyChat para responder automaticamente quando pessoas interagirem nos Stories/Reels sobre o Spoiler da Semana.\n\n## Base\nAdaptar o modelo do funil Eclipse Solar para uso RECORRENTE semanal. A diferenca principal e que o conteudo muda toda semana (tema astrologico), mas a ESTRUTURA do fluxo permanece a mesma.\n\n## Fluxo\n**Trigger:** Comentario/resposta nos stories ou reels com palavra-chave\n\n**Caminho A — Sabe o ascendente:**\n1. Usuario comenta signo do ascendente (ex: "aries", "touro"...)\n2. ManyChat envia mensagem personalizada + mini-interpretacao do tema da semana para aquele ascendente\n3. Transicao natural: "Quer se aprofundar toda semana? No Camarin Sideral..."\n4. CTA com link para LP Camarin Sideral\n\n**Caminho B — Nao sabe o ascendente:**\n1. Usuario comenta "nao sei" ou similar\n2. ManyChat envia video tutorial rapido "Como descobrir seu ascendente"\n3. Apos assistir: "Agora que voce sabe, quer entender como funciona?"\n4. CTA com link para LP Curso Decifrando Mapa Astral\n\n**Fallback:** Mensagem amigavel redirecionando para opcoes validas.\n\n## Importante\n- Templates de mensagem devem ser REUTILIZAVEIS (mudar so o tema astro da semana)\n- Usar variaveis dinamicas onde possivel (nome do signo, tema)\n- Incluir integracao com Pixel do Facebook`,
    assignees: [FERNANDO_ID],
    priority: 2,
    due_date: toMs('2026-02-27'),
    start_date: toMs('2026-02-24'),
    tags: ['manychat', 'automacao', 'spoiler-semana'],
  });
  if (t2) {
    await addChecklist(t2.id, 'Configuracao ManyChat', [
      'Definir palavras-chave de trigger: 12 signos + "nao sei" + "quero" + "spoiler"',
      'Criar fluxo Caminho A: usuario comenta ascendente → mensagem personalizada com mini-interpretacao',
      'Criar 12 variacoes de mensagem (uma por signo) com placeholder para tema semanal',
      'Criar transicao natural para oferta Camarin Sideral (nao parecer propaganda)',
      'Incluir botao CTA: "Quero fazer parte" → link LP Camarin',
      'Criar fluxo Caminho B: usuario comenta "nao sei" → mensagem acolhedora',
      'Enviar video tutorial "Como descobrir seu ascendente" (gravar com Victor)',
      'Apos tutorial, transicao para oferta Curso Decifrando Mapa Astral',
      'Incluir botao CTA: "Quero aprender" → link LP Curso',
      'Criar mensagem de fallback para comentarios nao reconhecidos',
      'Configurar variaveis dinamicas: {tema_semana}, {signo}, {nome_usuario}',
      'Criar template de atualizacao semanal (doc com instrucoes de como trocar o tema)',
      'Configurar integracao ManyChat + Pixel Facebook (eventos de clique)',
      'Testar fluxo completo: Caminho A com 3 signos diferentes',
      'Testar fluxo completo: Caminho B',
      'Testar fallback',
      'Documentar processo de atualizacao semanal para equipe',
    ]);
  }
  await sleep(200);

  // ──────────────────────────────────────────────
  // TASK 3: Substack Template (Funis & Automacoes)
  // ──────────────────────────────────────────────
  console.log('[3/9] Criando setup Substack...');
  const t3 = await createTask(LISTS.funis, {
    name: '[SUBSTACK] Criar Template de Post Semanal com CTA para Funil',
    description: `## Objetivo\nCriar um template reutilizavel no Substack para publicar semanalmente uma versao expandida do conteudo astrologico, com CTA para Camarin Sideral.\n\n## Estrutura do Post\n1. **Titulo chamativo** - Tema astrologico da semana\n2. **Intro gratuita** - Panorama geral da semana (valor real, nao teaser vazio)\n3. **Conteudo principal** - Interpretacao detalhada por elemento/modalidade\n4. **Paywall** - Aqui comecar conteudo exclusivo\n5. **Conteudo pago** - Interpretacao por ascendente + conselhos praticos\n6. **CTA final** - Convite para Camarin Sideral (comunidade completa)\n\n## Logica de Conversao\n- Conteudo gratuito entrega VALOR REAL para gerar confianca\n- Paywall no momento de maior curiosidade (antes das interpretacoes por signo)\n- CTA para Camarin posicionado como "upgrade natural" da experiencia`,
    assignees: [FERNANDO_ID],
    priority: 2,
    due_date: toMs('2026-02-27'),
    start_date: toMs('2026-02-24'),
    tags: ['substack', 'conteudo', 'spoiler-semana'],
  });
  if (t3) {
    await addChecklist(t3.id, 'Template Substack', [
      'Definir estrutura padrao do post: titulo + intro + conteudo + paywall + CTA',
      'Criar template com placeholders: {tema_semana}, {signo_destaque}, {transitos}',
      'Definir ponto exato do paywall (apos dar valor real, antes das interpretacoes por signo)',
      'Escrever CTA padrao para Camarin Sideral (3 variacoes para rotacionar)',
      'Escrever CTA alternativo para Curso (para quem e iniciante)',
      'Definir estrategia de cross-posting: Substack → email automatico',
      'Configurar SEO basico do post (titulo, descricao, tags)',
      'Criar primeiro post piloto seguindo o template',
      'Revisar e aprovar com equipe',
    ]);
  }
  await sleep(200);

  // ──────────────────────────────────────────────
  // TASK 4: Template Roteiro Reels (Calendario)
  // ──────────────────────────────────────────────
  console.log('[4/9] Criando template roteiro Reels...');
  const t4 = await createTask(LISTS.calendario, {
    name: '[TEMPLATE] Roteiro Padrao - Reels Jornal Sideral com CTA para Funil',
    description: `## Objetivo\nAdaptar o roteiro do Jornal Sideral (Reels publicados 2x/semana com alcance de 100k+) para incluir CTA que direciona ao funil de vendas, de forma natural e integrada ao conteudo.\n\n## Contexto\nO Jornal Sideral ja e um sucesso organico — Victor interpreta o ceu da semana de forma poetica e criativa. O desafio e adicionar um CTA sem comprometer a autenticidade que gera o engajamento.\n\n## Estrategia de CTA\nO CTA NAO deve ser um "compre agora" forcado. Deve ser:\n- Natural: integrado ao conteudo\n- Curioso: gerar vontade de saber mais\n- Direto: usar palavra-chave para acionar ManyChat\n\n## Exemplos de CTA\n- No video: "Se voce quer saber como isso afeta SEU mapa, comenta seu ascendente"\n- Na legenda: "Comenta seu ascendente que eu te conto como essa energia chega pra voce 👇"\n- No final: "Quer mergulhar mais fundo? Te espero no Camarin"\n\n## Instrucoes para Victor\n- Manter a essencia poetica e criativa do Jornal Sideral\n- CTA deve parecer uma extensao natural da conversa, nao uma propaganda\n- Variar os CTAs para nao ficar repetitivo\n- Testar CTAs diferentes e comparar engajamento`,
    assignees: [FERNANDO_ID],
    priority: 2,
    due_date: toMs('2026-02-25'),
    start_date: toMs('2026-02-21'),
    tags: ['template', 'reels', 'jornal-sideral', 'spoiler-semana'],
  });
  if (t4) {
    await addChecklist(t4.id, 'Roteiro Reels + CTA', [
      'Analisar 5 ultimos Reels do Jornal Sideral (formato, duracao, engajamento, comentarios)',
      'Identificar os momentos naturais de insercao de CTA (sem quebrar ritmo)',
      'Criar modelo de CTA para DENTRO do video (fala do Victor no final)',
      'Criar modelo de CTA para LEGENDA do Reels (palavra-chave ManyChat)',
      'Criar 5 variacoes de CTA para rotacionar semanalmente',
      'Definir hashtags padrao que complementam o funil',
      'Criar template de roteiro com marcacoes: [INTRO] [CONTEUDO] [CTA]',
      'Validar com Victor: o CTA parece natural? Ele se sente confortavel?',
      'Testar primeiro Reels com novo CTA e medir comentarios/interacao',
    ]);
  }
  await sleep(200);

  // ──────────────────────────────────────────────
  // TASK 5: Template Stories (Calendario)
  // ──────────────────────────────────────────────
  console.log('[5/9] Criando template roteiro Stories...');
  const t5 = await createTask(LISTS.calendario, {
    name: '[TEMPLATE] Roteiro Padrao - Stories Divulgacao Spoiler da Semana',
    description: `## Objetivo\nCriar template de roteiro para a SEQUENCIA de Stories que divulga a aula semanal (Spoiler Astrologico da Semana). Os Stories devem engajar, entregar valor e direcionar para o ManyChat.\n\n## Estrutura da Sequencia (6-8 Stories)\n\n**Story 1 — Gancho (Curiosidade)**\nTexto ou video curto: "Essa semana o ceu ta {intenso/magico/desafiador}..."\nObjetivo: Fazer a pessoa querer ver o proximo story.\n\n**Story 2-3 — Teaser (Valor)**\nConteudo real sobre o tema astrologico da semana.\nEntregar algo util: "Se voce tem planetas em {signo}, presta atencao..."\n\n**Story 4 — Caixinha de Perguntas (Trigger ManyChat)**\nCaixinha: "Qual seu ascendente? Comenta aqui que eu te conto como essa energia chega pra voce"\nIsso aciona o fluxo ManyChat.\n\n**Story 5 — Interacao**\nResponder algumas perguntas ao vivo (autenticidade).\n\n**Story 6 — Prova Social**\nPrint/video de depoimento de membro do Camarin: "Olha o que a {nome} falou da aula da semana passada"\n\n**Story 7-8 — CTA Final**\nLink direto para LP ou instrucao de comentar palavra-chave.\nUrgencia sutil: "A aula dessa semana e {dia}. Nao perde."\n\n## Instrucoes para Victor/Sylvia\n- Gravar com autenticidade (celular, selfie)\n- Nao precisa ser perfeito, precisa ser REAL\n- O teaser deve dar valor genuino, nao so "venha ver o resto"`,
    assignees: [FERNANDO_ID],
    priority: 2,
    due_date: toMs('2026-02-25'),
    start_date: toMs('2026-02-21'),
    tags: ['template', 'stories', 'spoiler-semana'],
  });
  if (t5) {
    await addChecklist(t5.id, 'Roteiro Stories', [
      'Definir sequencia de 6-8 Stories com objetivo de cada um',
      'Story 1: Gancho curiosidade — criar 3 modelos de abertura para rotacionar',
      'Story 2-3: Teaser com conteudo real — definir nivel de profundidade (dar valor sem entregar tudo)',
      'Story 4: Caixinha de perguntas — texto exato da pergunta + configuracao ManyChat trigger',
      'Story 5: Interacao — guidelines para Victor responder ao vivo',
      'Story 6: Prova social — coletar depoimentos de membros do Camarin (prints, videos)',
      'Story 7-8: CTA final — criar 3 variacoes com urgencia sutil',
      'Criar versoes de template para diferentes temas: Lua Nova, Lua Cheia, Retrogrado, Eclipse, Ingressos',
      'Definir dia e horario ideal de publicacao (baseado em analytics do perfil)',
      'Definir quem publica: Victor ao vivo ou equipe agenda via Meta Business?',
      'Aprovar modelo com Victor e Sylvia',
    ]);
  }
  await sleep(200);

  // ──────────────────────────────────────────────
  // TASK 6: Calendario semanal (Calendario)
  // ──────────────────────────────────────────────
  console.log('[6/9] Criando calendario semanal...');
  const t6 = await createTask(LISTS.calendario, {
    name: '[CALENDARIO] Definir Grade Semanal de Publicacao do Funil',
    description: `## Objetivo\nDefinir o calendario semanal fixo de publicacoes que alimentam o funil. Todos os conteudos devem estar sincronizados entre si e com o dia da aula (Spoiler).\n\n## Modelo Proposto (ajustar conforme dia real da aula)\n\n| Dia | Conteudo | Responsavel | Objetivo no Funil |\n|-----|---------|-------------|-------------------|\n| Segunda | Substack: Post semanal expandido | Fernando/IA | MEIO - Nurturing + CTA Camarin |\n| Terca | Reels: Jornal Sideral #1 | Victor + Gabriel (edicao) | TOPO - Alcance + CTA ManyChat |\n| Quarta | Stories: Teaser do Spoiler | Victor | TOPO - Engajamento + Caixinha |\n| Quinta | Reels: Jornal Sideral #2 | Victor + Gabriel (edicao) | TOPO - Alcance + CTA ManyChat |\n| Sexta | Stories: Lembrete da aula + prova social | Victor/Karol | TOPO - Urgencia + Conversao |\n| Sabado | AULA: Spoiler da Semana (Camarin) | Victor/Sylvia | FUNDO - Entrega de valor |\n| Domingo | Stories: Highlights da aula + CTA | Karol | TOPO - FOMO + Conversao |\n\n## Prazos Internos\n- Briefing da semana: entregue ate SEXTA anterior\n- Roteiros: prontos ate SEGUNDA\n- Gravacoes Reels: ate SEGUNDA\n- Edicao Reels: ate TERCA (primeiro) e QUARTA (segundo)\n- Publicacao: conforme calendario acima`,
    assignees: [FERNANDO_ID],
    priority: 1,
    due_date: toMs('2026-02-24'),
    start_date: toMs('2026-02-20'),
    tags: ['calendario', 'planejamento', 'spoiler-semana'],
  });
  if (t6) {
    await addChecklist(t6.id, 'Grade Semanal', [
      'Confirmar dia e horario da aula semanal (Spoiler da Semana) com Victor/Sylvia',
      'Definir dias fixos dos 2 Reels do Jornal Sideral',
      'Definir dia dos Stories de divulgacao (anterior a aula)',
      'Definir dia do post Substack',
      'Definir dia dos Stories pos-aula (highlights/FOMO)',
      'Definir prazos internos: briefing, roteiro, gravacao, edicao, publicacao',
      'Criar grade visual (tabela) e compartilhar com equipe',
      'Criar tasks recorrentes no ClickUp para cada publicacao semanal',
      'Testar grade na primeira semana e ajustar conforme necessidade',
    ]);
  }
  await sleep(200);

  // ──────────────────────────────────────────────
  // TASK 7: Briefing padrao (Tarefas & Entregas)
  // ──────────────────────────────────────────────
  console.log('[7/9] Criando briefing padrao...');
  const t7 = await createTask(LISTS.tarefas, {
    name: '[BRIEFING] Criar Modelo de Briefing Semanal para Victor e Sylvia',
    description: `## Objetivo\nCriar um modelo padrao de briefing semanal que sera enviado a Victor e Sylvia com antecedencia. O briefing e o documento unico que centraliza tudo que eles precisam saber para gravar e publicar na semana.\n\n## Contexto\nAtualmente, o roteiro do Spoiler da Semana e feito por Sylvia e Victor. A agencia quer assumir essa demanda para conseguir estruturar as estrategias com antecedencia e integrar o conteudo ao funil de vendas.\n\n## Estrutura do Briefing\n\n### 1. Tema Astrologico da Semana\n- Transitos relevantes (Lua Nova, Retrogrado, etc)\n- Signo em destaque\n- Evento astrologico principal\n\n### 2. Roteiro Jornal Sideral (2 Reels)\n- Reel #1: [tema + CTA]\n- Reel #2: [tema + CTA]\n- Talking points para Victor\n- CTA sugerido (com palavra-chave ManyChat)\n\n### 3. Roteiro Stories de Divulgacao\n- Sequencia de 6-8 stories\n- Texto da caixinha de perguntas\n- CTA de cada story\n\n### 4. Conteudo Substack\n- Tema do post expandido\n- Key points para desenvolver\n\n### 5. Prazos\n- Data limite para gravacao\n- Data de publicacao de cada peca\n\n### 6. Links e Materiais\n- Links de checkout atualizados\n- Depoimentos/provas sociais para usar`,
    assignees: [FERNANDO_ID],
    priority: 2,
    due_date: toMs('2026-02-26'),
    start_date: toMs('2026-02-22'),
    tags: ['briefing', 'operacao', 'spoiler-semana'],
  });
  if (t7) {
    await addChecklist(t7.id, 'Modelo de Briefing', [
      'Definir formato do briefing (Google Doc, Notion, ou ClickUp Doc)',
      'Criar secao: Tema Astrologico da Semana (transitos, signos, eventos)',
      'Criar secao: Roteiro dos 2 Reels do Jornal Sideral (com CTA integrado)',
      'Criar secao: Roteiro dos Stories de divulgacao (6-8 stories com caixinha)',
      'Criar secao: Conteudo Substack (tema + key points)',
      'Criar secao: Prazos de gravacao e publicacao',
      'Criar secao: Links atualizados e materiais de apoio',
      'Definir quem prepara o briefing semanalmente (Fernando ou IA + revisao Fernando)',
      'Definir prazo de entrega do briefing (ex: sexta-feira para semana seguinte)',
      'Validar formato com Victor e Sylvia — e pratico? Falta algo?',
      'Criar primeiro briefing real seguindo o modelo (semana piloto)',
    ]);
  }
  await sleep(200);

  // ──────────────────────────────────────────────
  // TASK 8: Semana Piloto (Tarefas & Entregas)
  // ──────────────────────────────────────────────
  console.log('[8/9] Criando semana piloto...');
  const t8 = await createTask(LISTS.tarefas, {
    name: '[EXECUCAO] Semana Piloto - Primeiro Ciclo Completo do Funil Spoiler',
    description: `## Objetivo\nExecutar o PRIMEIRO ciclo completo do funil de divulgacao do Spoiler da Semana. Esta e a semana de teste para validar todo o fluxo antes de torna-lo recorrente.\n\n## Pre-requisitos\n- Estrategia do funil aprovada\n- ManyChat configurado e testado\n- Templates de roteiro prontos\n- Calendario semanal definido\n- Briefing da semana enviado para Victor/Sylvia\n\n## Criterio de Sucesso\nO ciclo completo funciona de ponta a ponta:\nReels → Stories → ManyChat → LP → Checkout\n\n## Equipe na Semana Piloto\n- Fernando: Coordenacao, ManyChat, troubleshooting\n- Gabriel: Edicao de Reels, suporte tecnico, automacoes\n- Karol: Publicacao de Stories, monitoramento, organizacao\n- Victor: Gravacao de Reels e Stories\n- Sylvia: Apoio em roteiros e gravacoes`,
    assignees: [FERNANDO_ID],
    priority: 1,
    due_date: toMs('2026-03-07'),
    start_date: toMs('2026-03-02'),
    tags: ['execucao', 'piloto', 'spoiler-semana'],
  });
  if (t8) {
    await addChecklist(t8.id, 'Execucao Semana Piloto', [
      'Preparar e enviar briefing da semana para Victor/Sylvia (sexta anterior)',
      'Victor grava 2 Reels do Jornal Sideral com CTA integrado',
      'Gabriel edita os Reels (legenda, cortes, musica)',
      'Publicar Reels #1 no dia definido (com legenda e palavra-chave ManyChat)',
      'Victor grava sequencia de Stories de divulgacao',
      'Publicar Stories com caixinha de perguntas (trigger ManyChat ativo)',
      'Monitorar ManyChat nas primeiras 2 horas apos publicacao',
      'Verificar se fluxo Caminho A funciona (ascendente → resposta → oferta Camarin)',
      'Verificar se fluxo Caminho B funciona (nao sei → tutorial → oferta Curso)',
      'Publicar Reels #2 no dia definido',
      'Publicar post no Substack com conteudo expandido + CTA',
      'Publicar Stories pos-aula com highlights e CTA',
      'Coletar metricas do ciclo completo (alcance, interacoes, cliques, conversoes)',
      'Reuniao de analise pos-semana com equipe (o que funcionou, o que ajustar)',
      'Documentar licoes aprendidas e ajustes para proxima semana',
    ]);
  }
  await sleep(200);

  // ──────────────────────────────────────────────
  // TASK 9: KPIs e Metricas (Tarefas & Entregas)
  // ──────────────────────────────────────────────
  console.log('[9/9] Criando KPIs e metricas...');
  const t9 = await createTask(LISTS.tarefas, {
    name: '[METRICAS] Definir KPIs e Dashboard de Tracking Semanal',
    description: `## Objetivo\nDefinir os KPIs que serao acompanhados semanalmente para medir o sucesso do funil e otimizar continuamente.\n\n## KPIs por Etapa do Funil\n\n### TOPO (Awareness)\n| Metrica | Meta Minima | Meta Ideal |\n|---------|------------|------------|\n| Alcance Reels (Jornal Sideral) | 50k | 100k+ |\n| Impressoes Stories | 3k | 8k+ |\n| Comentarios nos Reels (com keyword) | 30 | 100+ |\n| Respostas na caixinha | 50 | 150+ |\n\n### MEIO (Consideration)\n| Metrica | Meta Minima | Meta Ideal |\n|---------|------------|------------|\n| DMs ManyChat acionados | 30 | 100+ |\n| Taxa de resposta ManyChat | 70% | 85%+ |\n| Cliques no link LP (ManyChat) | 15 | 50+ |\n| Aberturas post Substack | 100 | 300+ |\n| Cliques CTA Substack | 10 | 30+ |\n\n### FUNDO (Conversion)\n| Metrica | Meta Minima | Meta Ideal |\n|---------|------------|------------|\n| Visitas LP Camarin | 20 | 60+ |\n| Visitas LP Curso | 10 | 30+ |\n| Conversao LP | 2% | 5%+ |\n| Vendas Camarin (assinaturas) | 3 | 10+ |\n| Vendas Curso | 2 | 5+ |\n| Receita semanal | R$200 | R$500+ |\n\n## Dashboard\nCriar planilha Google Sheets ou dashboard simples para tracking semanal. Preencher toda segunda-feira com dados da semana anterior.`,
    assignees: [FERNANDO_ID],
    priority: 3,
    due_date: toMs('2026-02-28'),
    start_date: toMs('2026-02-24'),
    tags: ['metricas', 'kpi', 'spoiler-semana'],
  });
  if (t9) {
    await addChecklist(t9.id, 'KPIs e Dashboard', [
      'Definir KPIs de TOPO: alcance Reels, impressoes Stories, comentarios, respostas caixinha',
      'Definir KPIs de MEIO: DMs ManyChat, taxa resposta, cliques LP, aberturas Substack',
      'Definir KPIs de FUNDO: visitas LP, taxa conversao, vendas, receita semanal',
      'Definir metas minimas e ideais para cada KPI (tabela acima como base)',
      'Criar planilha/dashboard de tracking semanal (Google Sheets)',
      'Definir responsavel por coleta de dados (segunda-feira)',
      'Agendar reuniao semanal de review de metricas (ex: segunda 10h)',
      'Configurar Google Analytics nas LPs (se ainda nao tem)',
      'Configurar UTM parameters padrao para todos os links do funil',
    ]);
  }

  console.log('\n=== CONCLUIDO ===');
  console.log('9 tasks criadas com checklists detalhados no ClickUp');
  console.log('Space: Pelicula Sideral');
  console.log('Lists: Funis & Automacoes, Calendario de Conteudo, Tarefas & Entregas');
}

main().catch(err => {
  console.error('ERRO FATAL:', err.message);
  process.exit(1);
});
