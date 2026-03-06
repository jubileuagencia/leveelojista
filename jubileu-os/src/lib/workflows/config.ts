export type StepType = 'manual' | 'automated' | 'mixed';
export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';
export type WorkflowCategory = 'content' | 'client' | 'development' | 'operations';

export const WORKFLOW_CATEGORY_LABELS: Record<WorkflowCategory, string> = {
  content: 'Conteudo',
  client: 'Cliente',
  development: 'Desenvolvimento',
  operations: 'Operacoes',
};

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  type: StepType;
  assignee?: string;
  estimatedMinutes?: number;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: WorkflowCategory;
  steps: WorkflowStep[];
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  startedAt: string;
  completedAt: string | null;
  stepStatuses: Record<string, StepStatus>;
  currentStepId: string | null;
}

export const workflows: WorkflowDefinition[] = [
  {
    id: 'onboarding-client',
    name: 'Onboarding de Cliente',
    description: 'Fluxo completo para onboarding de um novo cliente na agencia.',
    icon: '🤝',
    category: 'client',
    steps: [
      {
        id: 'kickoff',
        title: 'Reuniao de Kickoff',
        description: 'Agendar e realizar reuniao inicial com o cliente para entender objetivos e escopo.',
        type: 'manual',
        assignee: 'Fernando',
        estimatedMinutes: 60,
      },
      {
        id: 'clickup-setup',
        title: 'Configurar ClickUp',
        description: 'Criar space/folder/listas no ClickUp para o cliente. Adicionar como guest.',
        type: 'manual',
        assignee: 'Fernando',
        estimatedMinutes: 30,
      },
      {
        id: 'notion-setup',
        title: 'Configurar Notion',
        description: 'Criar hub do cliente no Notion com estrutura padrao (briefing, assets, entregas).',
        type: 'manual',
        assignee: 'Fernando',
        estimatedMinutes: 20,
      },
      {
        id: 'brand-kit',
        title: 'Coletar Brand Kit',
        description: 'Solicitar e organizar: logo, paleta, fontes, tom de voz, guidelines.',
        type: 'manual',
        assignee: 'Karol',
        estimatedMinutes: 45,
      },
      {
        id: 'welcome-message',
        title: 'Mensagem de Boas-Vindas',
        description: 'Enviar mensagem de boas-vindas no WhatsApp com links de acesso.',
        type: 'manual',
        assignee: 'Fernando',
        estimatedMinutes: 10,
      },
    ],
  },
  {
    id: 'weekly-content',
    name: 'Producao de Conteudo Semanal',
    description: 'Pipeline semanal de producao de conteudo para redes sociais.',
    icon: '📱',
    category: 'content',
    steps: [
      {
        id: 'briefing',
        title: 'Criar Briefing',
        description: 'Definir tema da semana, referencias visuais e objetivos de cada peca.',
        type: 'manual',
        assignee: 'Fernando',
        estimatedMinutes: 30,
      },
      {
        id: 'copy',
        title: 'Redacao de Copy',
        description: 'Escrever textos para todas as pecas da semana (posts, stories, reels).',
        type: 'manual',
        assignee: 'Gabriel',
        estimatedMinutes: 120,
      },
      {
        id: 'design',
        title: 'Criacao de Arte',
        description: 'Produzir artes visuais com base no briefing e copy aprovados.',
        type: 'manual',
        assignee: 'Karol',
        estimatedMinutes: 180,
      },
      {
        id: 'review',
        title: 'Revisao Interna',
        description: 'Revisar todos os materiais: copy, arte, videos. Validar consistencia visual.',
        type: 'manual',
        assignee: 'Fernando',
        estimatedMinutes: 30,
      },
      {
        id: 'client-approval',
        title: 'Aprovacao do Cliente',
        description: 'Enviar preview para o cliente aprovar. Aplicar feedbacks se necessario.',
        type: 'manual',
        estimatedMinutes: 60,
      },
      {
        id: 'schedule',
        title: 'Agendamento',
        description: 'Agendar publicacoes nas plataformas definidas.',
        type: 'manual',
        assignee: 'Karol',
        estimatedMinutes: 30,
      },
    ],
  },
  {
    id: 'deploy-lp',
    name: 'Deploy de Landing Page',
    description: 'Fluxo de publicacao de uma nova landing page.',
    icon: '🚀',
    category: 'development',
    steps: [
      {
        id: 'dev-complete',
        title: 'Desenvolvimento Finalizado',
        description: 'Confirmar que codigo esta pronto, linted e buildando sem erros.',
        type: 'manual',
        assignee: 'Fernando',
        estimatedMinutes: 10,
      },
      {
        id: 'qa-review',
        title: 'QA Review',
        description: 'Testar responsividade, links, formularios e performance.',
        type: 'manual',
        assignee: 'Fernando',
        estimatedMinutes: 30,
      },
      {
        id: 'deploy',
        title: 'Deploy na Vercel',
        description: 'Fazer push para branch main e verificar deploy automatico na Vercel.',
        type: 'mixed',
        assignee: 'Fernando',
        estimatedMinutes: 10,
      },
      {
        id: 'dns-config',
        title: 'Configurar DNS',
        description: 'Apontar dominio/subdominio para a Vercel. Verificar SSL.',
        type: 'manual',
        assignee: 'Fernando',
        estimatedMinutes: 15,
      },
      {
        id: 'pixels',
        title: 'Instalar Pixels',
        description: 'Configurar Facebook Pixel, Google Analytics e outros trackers.',
        type: 'manual',
        assignee: 'Fernando',
        estimatedMinutes: 20,
      },
      {
        id: 'final-check',
        title: 'Verificacao Final',
        description: 'Testar URL final: HTTPS, meta tags, OG image, velocidade.',
        type: 'manual',
        estimatedMinutes: 15,
      },
    ],
  },
  {
    id: 'monthly-report',
    name: 'Relatorio Mensal',
    description: 'Fluxo de criacao do relatorio mensal de resultados para o cliente.',
    icon: '📊',
    category: 'operations',
    steps: [
      {
        id: 'data-collection',
        title: 'Coletar Dados',
        description: 'Extrair metricas de Instagram, Google Analytics, ClickUp e outras ferramentas.',
        type: 'manual',
        assignee: 'Fernando',
        estimatedMinutes: 45,
      },
      {
        id: 'analysis',
        title: 'Analise de Resultados',
        description: 'Analisar metricas, identificar tendencias e insights relevantes.',
        type: 'manual',
        assignee: 'Fernando',
        estimatedMinutes: 60,
      },
      {
        id: 'report-draft',
        title: 'Redigir Relatorio',
        description: 'Criar documento com graficos, analise e recomendacoes.',
        type: 'manual',
        assignee: 'Fernando',
        estimatedMinutes: 90,
      },
      {
        id: 'internal-review',
        title: 'Revisao Interna',
        description: 'Validar dados e conclusoes com a equipe.',
        type: 'manual',
        estimatedMinutes: 20,
      },
      {
        id: 'send-client',
        title: 'Enviar ao Cliente',
        description: 'Enviar relatorio finalizado e agendar reuniao de review se necessario.',
        type: 'manual',
        estimatedMinutes: 10,
      },
    ],
  },
];

export function getWorkflowById(id: string): WorkflowDefinition | undefined {
  return workflows.find((w) => w.id === id);
}
