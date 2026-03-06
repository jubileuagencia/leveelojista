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

export interface AgentConfig {
  id: string;
  name: string;
  title: string;
  icon: string;
  role: string;
  whenToUse: string;
  category: AgentCategory;
  commands: string[];
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
  },
];

export function getAgentsByCategory(category: AgentCategory): AgentConfig[] {
  return agents.filter((a) => a.category === category);
}

export function getAgentById(id: string): AgentConfig | undefined {
  return agents.find((a) => a.id === id);
}
