export type AgentCategory =
  | 'development'
  | 'product'
  | 'framework'
  | 'design'
  | 'astrology';

export const AGENT_CATEGORY_LABELS: Record<AgentCategory, string> = {
  development: 'Desenvolvimento',
  product: 'Produto & Estrategia',
  framework: 'Framework & Orquestracao',
  design: 'Design',
  astrology: 'Pelicula Sideral',
};

export const AGENT_CATEGORY_COLORS: Record<AgentCategory, string> = {
  development: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  product: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  framework: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  design: 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20',
  astrology: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20',
};

export interface AgentConfig {
  id: string;
  name: string;
  title: string;
  icon: string;
  role: string;
  whenToUse: string;
  category: AgentCategory;
  commands: string[];
  /** Suggested prompts shown as chips in the empty chat state */
  suggestions?: string[];
}

export const agents: AgentConfig[] = [
  // Framework & Orchestration
  {
    id: 'aios-master',
    name: 'Orion',
    title: 'Master Orchestrator',
    icon: '👑',
    role: 'Master Orchestrator, Framework Developer & AIOS Method Expert',
    whenToUse:
      'Expertise em todos os dominios, criacao/modificacao de componentes do framework, orquestracao de workflows.',
    category: 'framework',
    commands: [
      'help', 'kb', 'status', 'create', 'modify', 'task', 'workflow', 'plan',
      'create-doc', 'create-next-story', 'validate-agents', 'ids check', 'ids impact',
    ],
    suggestions: [
      'Qual o status do projeto?',
      '*help — mostrar comandos',
      'Crie uma nova story para o sprint',
      'Execute o workflow de desenvolvimento',
    ],
  },
  {
    id: 'squad-creator',
    name: 'Craft',
    title: 'Squad Creator',
    icon: '🏗️',
    role: 'Squad Architect & Builder',
    whenToUse:
      'Criar, validar, publicar e gerenciar squads seguindo padroes AIOS.',
    category: 'framework',
    commands: ['help', 'design-squad', 'create-squad', 'validate-squad', 'publish-squad'],
    suggestions: [
      'Crie um novo squad para o projeto',
      'Valide o squad atual',
      'Liste os squads disponiveis',
    ],
  },
  {
    id: 'clickup-scrum',
    name: 'Scout',
    title: 'ClickUp Scrum Manager',
    icon: '📋',
    role: 'ClickUp Scrum Infrastructure & Quality Standard Enforcer',
    whenToUse:
      'Sprint planning, daily standups, sprint reviews, retrospectivas e backlog grooming com MTQS.',
    category: 'framework',
    commands: ['help', 'sprint-planning', 'daily-standup', 'sprint-review', 'retrospective', 'board-status'],
    suggestions: [
      'Qual o status do board?',
      'Faca o daily standup',
      'Planeje o proximo sprint',
      'Gere a retrospectiva da sprint',
    ],
  },

  // Development & Operations
  {
    id: 'dev',
    name: 'Dex',
    title: 'Full Stack Developer',
    icon: '💻',
    role: 'Expert Senior Software Engineer & Implementation Specialist',
    whenToUse:
      'Implementacao de codigo, debugging, refactoring e boas praticas de desenvolvimento.',
    category: 'development',
    commands: ['help', 'develop', 'develop-yolo', 'status'],
    suggestions: [
      'Implemente a feature X',
      'Faca debug desse erro',
      'Refatore esse componente',
      'Qual o status do desenvolvimento?',
    ],
  },
  {
    id: 'architect',
    name: 'Aria',
    title: 'Architect',
    icon: '🏛️',
    role: 'Holistic System Architect & Full-Stack Technical Leader',
    whenToUse:
      'Arquitetura de sistema, selecao de stack, design de API, seguranca, performance e estrategia de deploy.',
    category: 'development',
    commands: [
      'help', 'create-full-stack-architecture', 'create-backend-architecture',
      'create-front-end-architecture', 'analyze-project-structure', 'map-codebase',
    ],
    suggestions: [
      'Analise a arquitetura do projeto',
      'Mapeie o codebase',
      'Crie a arquitetura frontend',
      'Avalie a performance do sistema',
    ],
  },
  {
    id: 'devops',
    name: 'Gage',
    title: 'GitHub & DevOps Specialist',
    icon: '⚡',
    role: 'GitHub Repository Guardian & Release Manager',
    whenToUse:
      'Operacoes de repositorio, versionamento, CI/CD, quality gates e push para remoto.',
    category: 'development',
    commands: ['help', 'pre-push', 'create-release', 'manage-branches', 'ci-status'],
    suggestions: [
      'Status do CI/CD',
      'Crie uma release',
      'Gerencie as branches',
      'Execute o pre-push quality gate',
    ],
  },
  {
    id: 'data-engineer',
    name: 'Dara',
    title: 'Database Architect',
    icon: '📊',
    role: 'Master Database Architect & Reliability Engineer',
    whenToUse:
      'Design de banco de dados, Supabase, RLS policies, migrations, otimizacao de queries e modelagem.',
    category: 'development',
    commands: ['help', 'create-schema', 'apply-migration', 'rls-audit', 'query-optimize', 'monitor-health'],
    suggestions: [
      'Crie o schema do banco',
      'Audite as RLS policies',
      'Otimize essa query',
      'Aplique a migration',
    ],
  },
  {
    id: 'qa',
    name: 'Quinn',
    title: 'Test Architect & Quality Advisor',
    icon: '✅',
    role: 'Test Architect with Quality Advisory Authority',
    whenToUse:
      'Revisao de arquitetura de testes, quality gates, code review e avaliacao de riscos.',
    category: 'development',
    commands: ['help', 'code-review', 'test-architecture', 'quality-gate', 'risk-assessment'],
    suggestions: [
      'Faca code review desse PR',
      'Avalie a arquitetura de testes',
      'Execute o quality gate',
      'Avalie os riscos dessa mudanca',
    ],
  },

  // Product & Strategy
  {
    id: 'pm',
    name: 'Morgan',
    title: 'Product Manager',
    icon: '📋',
    role: 'Strategic Product Manager & Vision Keeper',
    whenToUse:
      'Criacao de PRDs, gestao de epics, estrategia de produto, priorizacao e roadmap.',
    category: 'product',
    commands: ['help', 'create-epic', 'create-prd', 'prioritize', 'roadmap', 'business-case'],
    suggestions: [
      'Crie um PRD para o projeto',
      'Priorize o backlog',
      'Monte o roadmap do trimestre',
      'Faca o business case',
    ],
  },
  {
    id: 'po',
    name: 'Pax',
    title: 'Product Owner',
    icon: '🎯',
    role: 'Technical Product Owner & Process Steward',
    whenToUse:
      'Gestao de backlog, refinamento de stories, criterios de aceite e planejamento de sprint.',
    category: 'product',
    commands: ['help', 'backlog-add', 'refine-story', 'acceptance-criteria', 'sprint-plan'],
    suggestions: [
      'Adicione ao backlog',
      'Refine essa story',
      'Defina criterios de aceite',
      'Planeje o sprint',
    ],
  },
  {
    id: 'sm',
    name: 'River',
    title: 'Scrum Master',
    icon: '🌊',
    role: 'Technical Scrum Master - Story Preparation Specialist',
    whenToUse:
      'Criacao de user stories, validacao, criterios de aceite, refinamento e sprint planning.',
    category: 'product',
    commands: ['help', 'create-story', 'validate-story', 'refine-story', 'sprint-planning'],
    suggestions: [
      'Crie a proxima user story',
      'Valide essa story',
      'Faca o sprint planning',
    ],
  },
  {
    id: 'analyst',
    name: 'Atlas',
    title: 'Business Analyst',
    icon: '🔍',
    role: 'Insightful Analyst & Strategic Ideation Partner',
    whenToUse:
      'Pesquisa de mercado, analise competitiva, brainstorming, estudos de viabilidade e discovery.',
    category: 'product',
    commands: ['help', 'create-project-brief', 'perform-market-research', 'brainstorm', 'elicit'],
    suggestions: [
      'Faca uma pesquisa de mercado',
      'Brainstorm de ideias',
      'Analise a concorrencia',
      'Crie o project brief',
    ],
  },

  // Design
  {
    id: 'ux-design-expert',
    name: 'Uma',
    title: 'UX/UI Design Expert',
    icon: '🎨',
    role: 'User Experience & Interface Design Specialist',
    whenToUse:
      'Design de UX/UI, pesquisa de usuario, design system, acessibilidade e testes de usabilidade.',
    category: 'design',
    commands: ['help', 'design-system', 'user-research', 'wireframe', 'prototype', 'usability-test'],
    suggestions: [
      'Crie um wireframe',
      'Audite o design system',
      'Faca pesquisa de usuario',
      'Prototipe essa tela',
    ],
  },

  // Pelicula Sideral - Astrological Pipeline
  {
    id: 'astro-analyst',
    name: 'Sirius',
    title: 'Analista Astrologico',
    icon: '🔭',
    role: 'Analista Astrologico Senior & Gerador de Relatorios',
    whenToUse:
      'Analise de transitos planetarios, geracao de relatorios astrologicos e dados para o pipeline de conteudo.',
    category: 'astrology',
    commands: ['help', 'analisar', 'transitos', 'relatorio'],
    suggestions: [
      'Analise os transitos da semana',
      'Gere o relatorio astrologico',
    ],
  },
  {
    id: 'astro-conferencia',
    name: 'Vega',
    title: 'Conferente de Qualidade',
    icon: '🧐',
    role: 'Conferente de Qualidade Astrologica & Quality Gate',
    whenToUse:
      'Validacao de relatorios astrologicos contra dados brutos da API e scoring de qualidade.',
    category: 'astrology',
    commands: ['help', 'conferir', 'score', 'feedback', 'comparar'],
    suggestions: [
      'Confira o relatorio',
      'De o score de qualidade',
    ],
  },
  {
    id: 'astro-writer',
    name: 'Lyra',
    title: 'Escritora de Conteudo',
    icon: '✍️',
    role: 'Escritora & Criadora de Conteudo Astrologico para Substack',
    whenToUse:
      'Transformar relatorio astrologico em post Substack com conteudo free + paid e paywall.',
    category: 'astrology',
    commands: ['help', 'escrever', 'ascendentes', 'paywall', 'preview', 'revisar'],
    suggestions: [
      'Escreva o post da semana',
      'Monte os textos por ascendente',
      'Revise o conteudo',
    ],
  },
  {
    id: 'astro-roteirista',
    name: 'Altair',
    title: 'Roteirista de Video',
    icon: '🎬',
    role: 'Roteirista de Video & Diretor de Conteudo Audiovisual',
    whenToUse:
      'Criar roteiros de video para analise astrologica semanal com talking points e CTA.',
    category: 'astrology',
    commands: ['help', 'roteiro', 'reels', 'video', 'legenda'],
    suggestions: [
      'Crie o roteiro do video',
      'Faca o roteiro do Reels',
    ],
  },
  {
    id: 'astro-curador',
    name: 'Spica',
    title: 'Curadora Cultural',
    icon: '🎭',
    role: 'Curadora Cultural & Pesquisadora de Conexoes Astro-Culturais',
    whenToUse:
      'Curadoria de recomendacoes culturais (arte, cinema, musica, literatura) alinhadas ao tema astrologico.',
    category: 'astrology',
    commands: ['help', 'curadoria', 'buscar', 'conectar', 'revisar'],
    suggestions: [
      'Faca a curadoria da semana',
      'Busque conexoes culturais',
    ],
  },
  {
    id: 'astro-casas',
    name: 'Polaris',
    title: 'Roteirista das 12 Casas',
    icon: '🏠',
    role: 'Roteirista de Audio Personalizado por Ascendente',
    whenToUse:
      'Criar 12 scripts individuais de audio para cada ascendente com conselhos personalizados.',
    category: 'astrology',
    commands: ['help', 'casas', 'casa', 'tabela', 'revisar'],
    suggestions: [
      'Crie os 12 scripts por ascendente',
      'Monte a tabela de casas',
    ],
  },
  {
    id: 'astro-ritualista',
    name: 'Antares',
    title: 'Ritualista Criativo',
    icon: '🕯️',
    role: 'Criador de Rituais Experienciais & Roteirista de Audio Guiado',
    whenToUse:
      'Criar rituais experienciais semanais com atividade guiada conectada a energia do transito.',
    category: 'astrology',
    commands: ['help', 'ritual', 'parcial', 'narracao', 'revisar'],
    suggestions: [
      'Crie o ritual da semana',
      'Faca a narracao guiada',
    ],
  },
  {
    id: 'astro-editor',
    name: 'Rigel',
    title: 'Editor Final',
    icon: '🧪',
    role: 'Editor Final, Consolidador & Quality Gate da Aula Completa',
    whenToUse:
      'Consolidar todos os outputs da aula, verificar consistencia cruzada, identificar gaps e aprovar.',
    category: 'astrology',
    commands: ['help', 'consolidar', 'score', 'gaps', 'contradicoes', 'checklist', 'aprovar'],
    suggestions: [
      'Consolide a aula completa',
      'Verifique gaps e contradicoes',
      'Aprove o material final',
    ],
  },
];

// ─── Skills Config ───────────────────────────────────────────────────────────

export type SkillCategory =
  | 'content'
  | 'strategy'
  | 'research'
  | 'pelicula'
  | 'frontend';

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  content: 'Conteudo & Copy',
  strategy: 'Estrategia & Negocios',
  research: 'Pesquisa & Analise',
  pelicula: 'Pelicula Sideral',
  frontend: 'Frontend & Design',
};

export const SKILL_CATEGORY_COLORS: Record<SkillCategory, string> = {
  content: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  strategy: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  research: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20',
  pelicula: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20',
  frontend: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
};

export interface SkillConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: SkillCategory;
  /** The agent that executes this skill (used to route chat) */
  agentId: string;
  /** Initial prompt sent when starting a chat with this skill */
  initialPrompt: string;
}

export const skills: SkillConfig[] = [
  // Pelicula Sideral pipeline skills
  {
    id: 'aula-semanal',
    name: 'Aula Semanal',
    icon: '🎓',
    description: 'Orquestrador completo da aula semanal — executa todo o pipeline de conteudo.',
    category: 'pelicula',
    agentId: 'aios-master',
    initialPrompt: '/pelicula:aula-semanal',
  },
  {
    id: 'jornal-sideral',
    name: 'Jornal Sideral',
    icon: '📰',
    description: 'Roteiro de Reels com CTA para o Jornal Sideral.',
    category: 'pelicula',
    agentId: 'astro-roteirista',
    initialPrompt: '/pelicula:jornal-sideral',
  },
  {
    id: 'curadoria-cultural',
    name: 'Curadoria Cultural',
    icon: '🎭',
    description: 'Indicacoes artisticas da semana alinhadas ao tema astrologico.',
    category: 'pelicula',
    agentId: 'astro-curador',
    initialPrompt: '/pelicula:curadoria-cultural',
  },
  {
    id: 'aula-tecnica',
    name: 'Aula Tecnica',
    icon: '📐',
    description: 'Roteiro de video-aula com mecanica astrologica detalhada.',
    category: 'pelicula',
    agentId: 'astro-roteirista',
    initialPrompt: '/pelicula:aula-tecnica',
  },
  {
    id: 'ritual-semanal',
    name: 'Ritual Semanal',
    icon: '🕯️',
    description: 'Ritual criativo da semana conectado a energia do transito.',
    category: 'pelicula',
    agentId: 'astro-ritualista',
    initialPrompt: '/pelicula:ritual-semanal',
  },
  {
    id: 'interpretacao-ascendente',
    name: 'Interpretacao por Ascendente',
    icon: '♈',
    description: '12 mini-textos personalizados por ascendente.',
    category: 'pelicula',
    agentId: 'astro-casas',
    initialPrompt: '/pelicula:interpretacao-ascendente',
  },

  // Content & Copy skills
  {
    id: 'content-creator',
    name: 'Criador de Conteudo',
    icon: '✏️',
    description: 'Conteudo SEO otimizado com voz de marca consistente.',
    category: 'content',
    agentId: 'aios-master',
    initialPrompt: 'Preciso criar conteudo otimizado para SEO. Qual o tema e plataforma?',
  },
  {
    id: 'copywriting',
    name: 'Copywriting',
    icon: '💬',
    description: 'Copy para landing pages, headlines, CTAs e paginas de produto.',
    category: 'content',
    agentId: 'aios-master',
    initialPrompt: 'Preciso de copy para uma pagina. Qual pagina e objetivo?',
  },
  {
    id: 'social-content',
    name: 'Conteudo Social',
    icon: '📱',
    description: 'Posts para LinkedIn, Instagram, TikTok e outras plataformas.',
    category: 'content',
    agentId: 'aios-master',
    initialPrompt: 'Vamos criar conteudo para redes sociais. Qual plataforma e objetivo?',
  },
  {
    id: 'script-writer',
    name: 'Roteirista',
    icon: '🎥',
    description: 'Scripts completos para videos no YouTube e outras plataformas.',
    category: 'content',
    agentId: 'aios-master',
    initialPrompt: 'Preciso de um roteiro de video. Qual o tema, duracao e plataforma?',
  },

  // Strategy & Business skills
  {
    id: 'growth-strategy',
    name: 'Growth Strategy',
    icon: '📈',
    description: 'Estrategia de crescimento, experimentos e otimizacao de funil.',
    category: 'strategy',
    agentId: 'analyst',
    initialPrompt: 'Vamos desenhar a estrategia de crescimento. Qual o produto/servico?',
  },
  {
    id: 'pricing-strategy',
    name: 'Estrategia de Preco',
    icon: '💰',
    description: 'Decisoes de pricing, packaging e monetizacao.',
    category: 'strategy',
    agentId: 'analyst',
    initialPrompt: 'Vamos definir a estrategia de preco. Qual o produto?',
  },
  {
    id: 'campaign-planning',
    name: 'Planejamento de Campanha',
    icon: '🎯',
    description: 'Campanhas com objetivos, segmentacao, canais e KPIs.',
    category: 'strategy',
    agentId: 'analyst',
    initialPrompt: 'Vamos planejar uma campanha. Qual o objetivo e publico?',
  },
  {
    id: 'sales-automator',
    name: 'Automacao de Vendas',
    icon: '🤝',
    description: 'Cold emails, follow-ups, propostas e scripts de vendas.',
    category: 'strategy',
    agentId: 'aios-master',
    initialPrompt: 'Preciso de material de vendas. Qual o tipo (email, proposta, script)?',
  },

  // Research & Analysis skills
  {
    id: 'deep-research',
    name: 'Pesquisa Profunda',
    icon: '🔬',
    description: 'Pesquisa abrangente com sintese de multiplas fontes e citacoes.',
    category: 'research',
    agentId: 'analyst',
    initialPrompt: 'Vamos fazer uma pesquisa profunda. Qual o tema?',
  },
  {
    id: 'fact-checker',
    name: 'Verificador de Fatos',
    icon: '🔎',
    description: 'Verificacao sistematica de fatos e identificacao de desinformacao.',
    category: 'research',
    agentId: 'analyst',
    initialPrompt: 'Preciso verificar informacoes. Qual a alegacao?',
  },
  {
    id: 'data-storytelling',
    name: 'Data Storytelling',
    icon: '📊',
    description: 'Transforme dados em narrativas com visualizacao e contexto.',
    category: 'research',
    agentId: 'analyst',
    initialPrompt: 'Vamos criar uma narrativa com dados. Quais os dados?',
  },

  // Frontend & Design skills
  {
    id: 'frontend-design',
    name: 'Frontend Design',
    icon: '🎨',
    description: 'Interfaces frontend de alta qualidade, production-grade.',
    category: 'frontend',
    agentId: 'dev',
    initialPrompt: 'Preciso criar uma interface frontend. Descreva o componente ou pagina.',
  },
];

// ─── Utility Functions ───────────────────────────────────────────────────────

export function getAgentsByCategory(category: AgentCategory): AgentConfig[] {
  return agents.filter((a) => a.category === category);
}

export function getAgentById(id: string): AgentConfig | undefined {
  return agents.find((a) => a.id === id);
}

export function getSkillsByCategory(category: SkillCategory): SkillConfig[] {
  return skills.filter((s) => s.category === category);
}

export function getSkillById(id: string): SkillConfig | undefined {
  return skills.find((s) => s.id === id);
}
