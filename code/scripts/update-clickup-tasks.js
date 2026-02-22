/**
 * Update all 27 ClickUp tasks with assignees, due dates, and checklists
 * Only Fernando (284457202) is currently in workspace - tasks assigned to him
 * with description noting the intended assignee for when team joins
 */
const https = require('https');

const API_KEY = 'pk_284457202_0WIIM5RW142E8VRC52N1EZODA4G5C3EH';
const FERNANDO_ID = 284457202;

// Helper: date string to ms timestamp
function dateToMs(dateStr) {
  return new Date(dateStr + 'T12:00:00Z').getTime();
}

// Helper: make API request
function apiRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.clickup.com',
      path: path,
      method: method,
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Sleep helper for rate limiting
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// All 27 tasks with planned updates
const taskUpdates = [
  // === LEVEE HORTIPLUS ===
  {
    id: '86afjwe6q',
    name: 'Definir DNA da marca Levee Hortiplus',
    due_date: dateToMs('2026-02-26'),
    start_date: dateToMs('2026-02-20'),
    intended_assignee: 'Fernando',
    priority: 1, // urgent
    description_append: '\n\n---\n**Assignee planejado:** Fernando (estrategia) + equipe (inputs)\n**Tempo estimado:** 4h\n**Bloqueia:** Personas, Calendario, Instagram Sucos/Picadinhos',
    checklist: [
      'Reuniao de alinhamento com Eric',
      'Auditar comunicacao visual atual',
      'Analisar 3-5 concorrentes diretos',
      'Definir pilares de marca (missao, visao, valores)',
      'Definir tom de voz com exemplos',
      'Definir paleta de cores (HEX)',
      'Definir tipografia',
      'Criar moodboard visual',
      'Documentar em kb/brand-dna/levee-hortiplus.md',
      'Aprovacao final Fernando + Eric'
    ]
  },
  {
    id: '86afjwe73',
    name: 'Mapear Personas do Levee',
    due_date: dateToMs('2026-02-28'),
    start_date: dateToMs('2026-02-22'),
    intended_assignee: 'Fernando + Karol',
    priority: 1,
    description_append: '\n\n---\n**Assignee planejado:** Fernando (estrategia) + Karol (dados)\n**Tempo estimado:** 3h\n**Depende de:** DNA da marca (parcial)\n**Bloqueia:** Calendario, trafego pago, WhatsApp',
    checklist: [
      'Levantar dados demograficos dos clientes do app',
      'Analisar insights do Instagram',
      'Entrevistar Eric sobre perfil de clientes',
      'Definir 2-3 personas primarias',
      'Mapear jornada de compra por persona',
      'Definir gatilhos de conteudo por persona',
      'Documentar em kb/personas/levee-personas.md',
      'Validar personas com equipe e Eric'
    ]
  },
  {
    id: '86afjwe7h',
    name: 'Estrategia de WhatsApp Levee',
    due_date: dateToMs('2026-03-07'),
    start_date: dateToMs('2026-03-01'),
    intended_assignee: 'Fernando + Gabriel',
    priority: 2, // high
    description_append: '\n\n---\n**Assignee planejado:** Fernando (estrategia) + Gabriel (automacao)\n**Tempo estimado:** 5h\n**Depende de:** DNA da marca, Personas',
    checklist: [
      'Auditar uso atual do WhatsApp do Levee',
      'Definir objetivos do canal',
      'Criar fluxo de boas-vindas automatico',
      'Criar templates de mensagens promocionais',
      'Criar fluxo de pos-venda',
      'Criar fluxo de reativacao (clientes 30+ dias)',
      'Definir frequencia de envio (max 3/semana)',
      'Integrar com app de delivery',
      'Escolher ferramenta de automacao',
      'Documentar SOP de WhatsApp'
    ]
  },
  {
    id: '86afjwe83',
    name: 'Planejamento de Trafego Pago Levee',
    due_date: dateToMs('2026-03-12'),
    start_date: dateToMs('2026-03-05'),
    intended_assignee: 'Gabriel + Fernando',
    priority: 2,
    description_append: '\n\n---\n**Assignee planejado:** Gabriel (execucao) + Fernando (estrategia)\n**Tempo estimado:** 6h\n**Depende de:** DNA, Personas, Calendario',
    checklist: [
      'Definir budget mensal com Eric',
      'Escolher plataformas (Meta/Google)',
      'Definir objetivos de campanha',
      'Criar publicos-alvo baseados nas personas',
      'Criar 3-5 criativos para teste A/B',
      'Configurar pixel/tracking',
      'Configurar campanha piloto',
      'Definir KPIs (CPA, ROAS, CTR, CPM)',
      'Criar dashboard de acompanhamento',
      'Planejar ciclo de otimizacao'
    ]
  },
  {
    id: '86afjwe8x',
    name: 'Implementar Calendario de Conteudo Oficial',
    due_date: dateToMs('2026-02-26'),
    start_date: dateToMs('2026-02-20'),
    intended_assignee: 'Karol',
    priority: 1,
    description_append: '\n\n---\n**Assignee planejado:** Karol\n**Tempo estimado:** 3h\n**Depende de:** DNA (minimo)',
    checklist: [
      'Levantar datas comemorativas de marco',
      'Definir pilares de conteudo',
      'Definir frequencia por formato',
      'Criar grade semanal modelo',
      'Planejar conteudo de 4 semanas (marco)',
      'Criar tasks no ClickUp por post/video',
      'Definir processo de aprovacao',
      'Alinhar com Eric sobre eventos do mes',
      'Aprovacao do Fernando'
    ]
  },
  {
    id: '86afjwe9r',
    name: 'Lancamento Instagram Sucos',
    due_date: dateToMs('2026-03-17'),
    start_date: dateToMs('2026-03-10'),
    intended_assignee: 'Karol',
    priority: 3, // normal
    description_append: '\n\n---\n**Assignee planejado:** Karol (execucao) + Fernando (estrategia)\n**Tempo estimado:** 5h\n**Depende de:** DNA da marca, logotipo final',
    checklist: [
      'Finalizar logotipo dos Sucos',
      'Definir bio e highlights',
      'Criar 9 posts iniciais (grid)',
      'Definir tom de voz especifico',
      'Configurar perfil (bio, link, categorias)',
      'Preparar stories de lancamento',
      'Alinhar com Eric sobre produtos',
      'Publicar e divulgar no perfil principal',
      'Acompanhar metricas primeira semana'
    ]
  },
  {
    id: '86afjweae',
    name: 'Lancamento Instagram Picadinhos',
    due_date: dateToMs('2026-03-17'),
    start_date: dateToMs('2026-03-10'),
    intended_assignee: 'Karol',
    priority: 3,
    description_append: '\n\n---\n**Assignee planejado:** Karol (execucao) + Fernando (estrategia)\n**Tempo estimado:** 5h\n**Depende de:** DNA da marca, logotipo final',
    checklist: [
      'Finalizar logotipo Picadinhos',
      'Definir bio e highlights',
      'Criar 9 posts iniciais (grid)',
      'Definir tom de voz especifico',
      'Configurar perfil',
      'Preparar stories de lancamento',
      'Alinhar com Eric sobre linha de produtos',
      'Publicar e divulgar no perfil principal',
      'Acompanhar metricas primeira semana'
    ]
  },
  {
    id: '86afjwebp',
    name: 'Documentar App Bubble do Levee',
    due_date: dateToMs('2026-03-07'),
    start_date: dateToMs('2026-02-28'),
    intended_assignee: 'Fernando',
    priority: 2,
    description_append: '\n\n---\n**Assignee planejado:** Fernando (unico que conhece o app)\n**Tempo estimado:** 4h',
    checklist: [
      'Listar todas as paginas/views do app',
      'Documentar fluxo de dados principal',
      'Documentar integracao com pagamentos',
      'Documentar sistema de delivery/entrega',
      'Documentar sistema de cupons/cashback',
      'Listar workflows automaticos',
      'Documentar API connections',
      'Criar guia de troubleshooting basico',
      'Compartilhar acesso Bubble com Gabriel/Diego'
    ]
  },

  // === CARACOL ENTRETENIMENTOS ===
  {
    id: '86afjwe9w',
    name: 'Definir DNA da marca Caracol',
    due_date: dateToMs('2026-02-28'),
    start_date: dateToMs('2026-02-22'),
    intended_assignee: 'Fernando',
    priority: 1,
    description_append: '\n\n---\n**Assignee planejado:** Fernando\n**Tempo estimado:** 3h\n**Bloqueia:** Personas, Calendario, toda comunicacao',
    checklist: [
      'Reuniao com dona do Caracol sobre visao da marca',
      'Auditar comunicacao visual atual',
      'Analisar concorrentes (brinquedotecas/espacos infantis)',
      'Definir pilares de marca',
      'Definir tom de voz',
      'Definir paleta de cores e tipografia',
      'Criar moodboard',
      'Documentar em kb/brand-dna/caracol.md',
      'Aprovacao da cliente'
    ]
  },
  {
    id: '86afjweah',
    name: 'Mapear Personas Caracol',
    due_date: dateToMs('2026-03-03'),
    start_date: dateToMs('2026-02-26'),
    intended_assignee: 'Fernando + Karol',
    priority: 1,
    description_append: '\n\n---\n**Assignee planejado:** Fernando + Karol\n**Tempo estimado:** 2h\n**Depende de:** DNA Caracol',
    checklist: [
      'Levantar dados demograficos dos clientes',
      'Analisar insights do Instagram Caracol',
      'Entrevistar dona sobre perfil de pais/criancas',
      'Definir 2 personas (maes e pais)',
      'Mapear jornada de decisao',
      'Definir gatilhos de conteudo',
      'Documentar em kb/personas/caracol-personas.md',
      'Validar com equipe e cliente'
    ]
  },
  {
    id: '86afjwebt',
    name: 'Producao Mensal - Marco 2026',
    due_date: dateToMs('2026-02-24'),
    start_date: dateToMs('2026-02-19'),
    intended_assignee: 'Karol + Gabriel',
    priority: 2,
    description_append: '\n\n---\n**Assignee planejado:** Karol (posts/artes) + Gabriel (videos/captacao)\n**Tempo estimado:** 20h mensal\n**URGENTE:** Producao ja em andamento',
    checklist: [
      'Planejar 20 posts do mes',
      'Agendar 4h de captacao presencial',
      'Roteirizar 4 videos',
      'Criar 10 artes estaticas',
      'Editar 4 videos',
      'Publicar conteudo conforme calendario',
      'Revisao semanal de metricas'
    ]
  },
  {
    id: '86afjwech',
    name: 'Calendario Editorial Marco 2026 - Caracol',
    due_date: dateToMs('2026-02-24'),
    start_date: dateToMs('2026-02-19'),
    intended_assignee: 'Karol',
    priority: 2,
    description_append: '\n\n---\n**Assignee planejado:** Karol\n**Tempo estimado:** 2h',
    checklist: [
      'Levantar eventos/datas do Caracol em marco',
      'Definir temas semanais',
      'Distribuir 20 posts no mes',
      'Planejar 4 videos',
      'Definir dias de captacao',
      'Aprovacao da cliente',
      'Criar tasks individuais no ClickUp'
    ]
  },

  // === PELICULA SIDERAL ===
  {
    id: '86afjwegt',
    name: 'Construir Funil ManyChat - Eclipse Solar',
    due_date: dateToMs('2026-02-26'),
    start_date: dateToMs('2026-02-20'),
    intended_assignee: 'Gabriel',
    priority: 1,
    description_append: '\n\n---\n**Assignee planejado:** Gabriel (automacao) + Fernando (estrategia)\n**Tempo estimado:** 6h\n**Bloqueia:** Funil de vendas completo',
    checklist: [
      'Criar conta ManyChat do Pelicula',
      'Configurar trigger: comentario no stories',
      'Caminho A: usuario comenta ascendente → audio personalizado',
      'Caminho A: oferta Camarin Sideral apos audio',
      'Caminho B: usuario comenta "nao sei" → video tutorial',
      'Caminho B: oferta Curso Decifrando Mapa Astral',
      'Configurar tracking de conversao',
      'Testar ambos caminhos end-to-end',
      'Criar copy para cada mensagem do funil',
      'Aprovacao do Fernando e Victor'
    ]
  },
  {
    id: '86afjweh4',
    name: 'Automatizar Pelicula do Dia no Substack',
    due_date: dateToMs('2026-02-26'),
    start_date: dateToMs('2026-02-20'),
    intended_assignee: 'Gabriel',
    priority: 1,
    description_append: '\n\n---\n**Assignee planejado:** Gabriel\n**Tempo estimado:** 4h\n**Recorrente:** Diario apos setup',
    checklist: [
      'Criar conta Substack do Pelicula',
      'Definir template da newsletter diaria',
      'Criar fluxo: stories → versao expandida Substack',
      'Inserir CTA de venda da comunidade no final',
      'Configurar automacao de publicacao',
      'Definir horario de envio',
      'Testar com 3 edicoes piloto',
      'Aprovacao do Victor e Fernando'
    ]
  },
  {
    id: '86afjwehk',
    name: 'Funil Jornal Sideral (Reels)',
    due_date: dateToMs('2026-03-05'),
    start_date: dateToMs('2026-02-28'),
    intended_assignee: 'Gabriel',
    priority: 2,
    description_append: '\n\n---\n**Assignee planejado:** Gabriel\n**Tempo estimado:** 4h\n**Depende de:** Funil ManyChat base, Substack configurado',
    checklist: [
      'Mapear alcance organico dos reels (100k+)',
      'Definir CTA nos reels (comentario trigger)',
      'Conectar ao funil ManyChat',
      'Criar fluxo: reels → DM → Substack → oferta',
      'Definir metricas de conversao',
      'Testar com 2 reels piloto',
      'Otimizar baseado em resultados',
      'Documentar fluxo completo'
    ]
  },
  {
    id: '86afjwejb',
    name: 'Finalizar Landing Page - Curso Decifrando Mapa Astral',
    due_date: dateToMs('2026-02-26'),
    start_date: dateToMs('2026-02-20'),
    intended_assignee: 'Gabriel',
    priority: 1,
    description_append: '\n\n---\n**Assignee planejado:** Gabriel\n**Tempo estimado:** 4h',
    checklist: [
      'Revisar copy de vendas atual',
      'Adicionar depoimentos/provas sociais',
      'Otimizar para mobile',
      'Configurar checkout/pagamento',
      'Adicionar FAQ',
      'Configurar pixels de tracking',
      'Testar fluxo de compra end-to-end',
      'Aprovacao do Fernando e Victor'
    ]
  },
  {
    id: '86afjweju',
    name: 'Otimizar Landing Page - Comunidade Camarin Sideral',
    due_date: dateToMs('2026-03-03'),
    start_date: dateToMs('2026-02-26'),
    intended_assignee: 'Gabriel',
    priority: 2,
    description_append: '\n\n---\n**Assignee planejado:** Gabriel\n**Tempo estimado:** 3h\n**URL atual:** https://optimizeformobile.vercel.app/',
    checklist: [
      'Auditar pagina atual (performance, mobile)',
      'Revisar copy de vendas',
      'Adicionar depoimentos de membros',
      'Otimizar velocidade de carregamento',
      'Configurar tracking de conversao',
      'Testar fluxo de checkout',
      'Aprovacao final'
    ]
  },
  {
    id: '86afjwek3',
    name: 'Assumir Roteiro Spoiler da Semana',
    due_date: dateToMs('2026-03-05'),
    start_date: dateToMs('2026-02-28'),
    intended_assignee: 'Gabriel',
    priority: 2,
    description_append: '\n\n---\n**Assignee planejado:** Gabriel\n**Tempo estimado:** 2h/semana (recorrente)\n**Depende de:** Alinhamento com Victor e Sylvia',
    checklist: [
      'Reuniao com Victor/Sylvia sobre formato atual',
      'Documentar estrutura do roteiro',
      'Criar template de roteiro padrao',
      'Produzir 1 roteiro piloto para aprovacao',
      'Definir prazo semanal de entrega',
      'Integrar com calendario de conteudo',
      'Aprovacao de Victor'
    ]
  },
  {
    id: '86afjwekk',
    name: 'Estruturar Calendario de Conteudo Pelicula',
    due_date: dateToMs('2026-02-28'),
    start_date: dateToMs('2026-02-22'),
    intended_assignee: 'Fernando',
    priority: 1,
    description_append: '\n\n---\n**Assignee planejado:** Fernando (estrategia)\n**Tempo estimado:** 3h\n**Depende de:** Alinhamento com Victor',
    checklist: [
      'Mapear conteudos recorrentes (Pelicula do Dia, Jornal Sideral, Spoiler)',
      'Definir calendario de eventos astrologicos de marco',
      'Planejar conteudo semanal',
      'Integrar com funis (ManyChat, Substack)',
      'Definir fluxo de producao',
      'Alinhar com Victor e Sylvia',
      'Criar tasks no ClickUp'
    ]
  },

  // === JUBILEU INTERNO ===
  {
    id: '86afjwene',
    name: 'Registrar Contrato Levee Hortiplus',
    due_date: dateToMs('2026-02-21'),
    start_date: dateToMs('2026-02-19'),
    intended_assignee: 'Karol',
    priority: 2,
    description_append: '\n\n---\n**Assignee planejado:** Karol\n**Tempo estimado:** 30min\n**Valor:** R$4k + 4% faturamento + R$4k empreitada',
    checklist: [
      'Localizar contrato assinado',
      'Registrar valor mensal (R$4.000)',
      'Registrar percentual (4% faturamento app)',
      'Registrar empreitada desenvolvimento (R$4.000)',
      'Definir data de pagamento',
      'Registrar escopo contratado'
    ]
  },
  {
    id: '86afjwenu',
    name: 'Registrar Contrato Caracol',
    due_date: dateToMs('2026-02-21'),
    start_date: dateToMs('2026-02-19'),
    intended_assignee: 'Karol',
    priority: 2,
    description_append: '\n\n---\n**Assignee planejado:** Karol\n**Tempo estimado:** 30min\n**Valor:** R$2.500',
    checklist: [
      'Localizar contrato assinado',
      'Registrar valor mensal (R$2.500)',
      'Definir data de pagamento',
      'Registrar escopo contratado (20 posts, 4h captacao, 4 videos, 10 artes)'
    ]
  },
  {
    id: '86afjwep4',
    name: 'Registrar Contrato Pelicula Sideral',
    due_date: dateToMs('2026-02-21'),
    start_date: dateToMs('2026-02-19'),
    intended_assignee: 'Karol',
    priority: 2,
    description_append: '\n\n---\n**Assignee planejado:** Karol\n**Tempo estimado:** 30min\n**Valor:** R$4.000 + porcentagem',
    checklist: [
      'Localizar contrato assinado',
      'Registrar valor mensal (R$4.000)',
      'Registrar percentual de vendas',
      'Definir data de pagamento',
      'Registrar escopo contratado'
    ]
  },
  {
    id: '86afjwept',
    name: 'Definir Alocacao da Equipe por Cliente',
    due_date: dateToMs('2026-02-24'),
    start_date: dateToMs('2026-02-20'),
    intended_assignee: 'Fernando',
    priority: 1,
    description_append: '\n\n---\n**Assignee planejado:** Fernando\n**Tempo estimado:** 1h',
    checklist: [
      'Listar horas disponiveis de cada membro',
      'Calcular horas necessarias por cliente',
      'Distribuir Karol: Levee X%, Caracol Y%, Interno Z%',
      'Distribuir Gabriel: Pelicula X%, Levee Y%, Caracol Z%',
      'Distribuir Diego: 100% Levee App',
      'Identificar gaps/sobrecarga',
      'Definir regras de prioridade em conflito'
    ]
  },
  {
    id: '86afjweqe',
    name: 'SOP: Criacao de Conteudo com IA',
    due_date: dateToMs('2026-03-03'),
    start_date: dateToMs('2026-02-26'),
    intended_assignee: 'Fernando',
    priority: 1,
    description_append: '\n\n---\n**Assignee planejado:** Fernando\n**Tempo estimado:** 2h',
    checklist: [
      'Definir ferramentas de IA aprovadas (ChatGPT, Claude, Midjourney, etc)',
      'Criar workflow: briefing → prompt → geracao → revisao → aprovacao',
      'Criar prompts base para cada tipo de conteudo',
      'Definir regras de uso (o que pode e nao pode ser 100% IA)',
      'Criar exemplos praticos por cliente',
      'Treinar equipe no workflow',
      'Documentar em kb/sops/criacao-conteudo-ia.md'
    ]
  },
  {
    id: '86afjweqt',
    name: 'SOP: Onboarding de Novo Cliente',
    due_date: dateToMs('2026-03-10'),
    start_date: dateToMs('2026-03-05'),
    intended_assignee: 'Karol',
    priority: 2,
    description_append: '\n\n---\n**Assignee planejado:** Karol\n**Tempo estimado:** 2h',
    checklist: [
      'Definir etapas do onboarding (dia 1 a dia 30)',
      'Criar formulario de intake (dados do cliente)',
      'Criar checklist de setup tecnico (acessos, ferramentas)',
      'Definir processo de criacao de Space no ClickUp',
      'Criar template de proposta comercial',
      'Definir SLA de entrega inicial',
      'Documentar em kb/sops/onboarding-cliente.md'
    ]
  },
  {
    id: '86afjwerk',
    name: 'Criar Biblioteca de Prompts para Conteudo',
    due_date: dateToMs('2026-03-07'),
    start_date: dateToMs('2026-03-01'),
    intended_assignee: 'Fernando',
    priority: 2,
    description_append: '\n\n---\n**Assignee planejado:** Fernando\n**Tempo estimado:** 3h',
    checklist: [
      'Criar prompt para copy de Instagram post',
      'Criar prompt para roteiro de Reels',
      'Criar prompt para legendas de stories',
      'Criar prompt para ideias de conteudo',
      'Criar prompt para analise de concorrente',
      'Criar prompt para persona mapping',
      'Testar todos com exemplos reais',
      'Salvar em prompts/ no GitHub'
    ]
  },
  {
    id: '86afjwetf',
    name: 'Template: Checklist de Onboarding',
    due_date: dateToMs('2026-03-12'),
    start_date: dateToMs('2026-03-07'),
    intended_assignee: 'Karol',
    priority: 3,
    description_append: '\n\n---\n**Assignee planejado:** Karol\n**Tempo estimado:** 1h\n**Depende de:** SOP de Onboarding',
    checklist: [
      'Criar template no ClickUp',
      'Incluir todos os passos do SOP',
      'Adicionar prazos padrao por etapa',
      'Testar com simulacao de novo cliente',
      'Documentar em templates/onboarding-checklist.md'
    ]
  }
];

async function updateTask(task) {
  // 1. Update task with due date, start date, assignee
  const updateBody = {
    assignees: { add: [FERNANDO_ID], rem: [] },
    due_date: task.due_date,
    due_date_time: false,
    start_date: task.start_date,
    start_date_time: false,
    priority: task.priority
  };

  const result = await apiRequest('PUT', `/api/v2/task/${task.id}`, updateBody);

  if (result.status === 200) {
    console.log(`  [OK] Updated: ${task.name}`);
  } else {
    console.log(`  [ERR] ${task.name}: ${result.status} - ${JSON.stringify(result.data).substring(0, 100)}`);
    return false;
  }

  // 2. Create checklist
  if (task.checklist && task.checklist.length > 0) {
    await sleep(200); // rate limit
    const checklistResult = await apiRequest('POST', `/api/v2/task/${task.id}/checklist`, {
      name: 'Subtarefas'
    });

    if (checklistResult.status === 200 && checklistResult.data.checklist) {
      const checklistId = checklistResult.data.checklist.id;
      console.log(`    [OK] Checklist created: ${checklistId}`);

      // Add items to checklist
      for (let i = 0; i < task.checklist.length; i++) {
        await sleep(150); // rate limit
        const itemResult = await apiRequest('POST', `/api/v2/checklist/${checklistId}/checklist_item`, {
          name: task.checklist[i],
          assignee: null
        });
        if (itemResult.status !== 200) {
          console.log(`    [WARN] Item failed: ${task.checklist[i]}`);
        }
      }
      console.log(`    [OK] ${task.checklist.length} checklist items added`);
    } else {
      console.log(`    [ERR] Checklist creation failed: ${checklistResult.status}`);
    }
  }

  return true;
}

async function main() {
  console.log('=== ClickUp Task Update Script ===');
  console.log(`Updating ${taskUpdates.length} tasks with assignees, due dates, and checklists\n`);

  let success = 0;
  let failed = 0;

  for (const task of taskUpdates) {
    const ok = await updateTask(task);
    if (ok) success++; else failed++;
    await sleep(300); // rate limit between tasks
  }

  console.log(`\n=== Complete ===`);
  console.log(`Success: ${success}/${taskUpdates.length}`);
  if (failed > 0) console.log(`Failed: ${failed}`);
}

main().catch(console.error);
