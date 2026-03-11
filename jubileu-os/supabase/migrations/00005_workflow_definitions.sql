-- 00005: Workflow definitions — dynamic workflow management
-- Moves workflow definitions from hardcoded config.ts to database

CREATE TABLE workflow_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT '📋',
  category TEXT NOT NULL CHECK (category IN ('content', 'client', 'development', 'operations', 'custom')),
  steps JSONB NOT NULL DEFAULT '[]',
  is_template BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE workflow_definitions ENABLE ROW LEVEL SECURITY;

-- Admin and member can view all active workflows
CREATE POLICY "Admin and member can view workflows"
  ON workflow_definitions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'member')
    )
  );

-- Admin and member can create workflows
CREATE POLICY "Admin and member can create workflows"
  ON workflow_definitions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'member')
    )
  );

-- Admin and member can update workflows
CREATE POLICY "Admin and member can update workflows"
  ON workflow_definitions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'member')
    )
  );

-- Admin can delete workflows
CREATE POLICY "Admin can delete workflows"
  ON workflow_definitions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Indexes
CREATE INDEX idx_workflow_definitions_category ON workflow_definitions(category);
CREATE INDEX idx_workflow_definitions_active ON workflow_definitions(is_active);

-- Updated_at trigger (reuses function from initial schema)
CREATE TRIGGER set_workflow_definitions_updated_at
  BEFORE UPDATE ON workflow_definitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed: migrate the 4 existing hardcoded workflows as templates
INSERT INTO workflow_definitions (name, description, icon, category, steps, is_template) VALUES
(
  'Onboarding de Cliente',
  'Fluxo completo para onboarding de um novo cliente na agencia.',
  '🤝',
  'client',
  '[
    {"id":"kickoff","title":"Reuniao de Kickoff","description":"Agendar e realizar reuniao inicial com o cliente para entender objetivos e escopo.","type":"manual","assignee":"Fernando","estimatedMinutes":60},
    {"id":"clickup-setup","title":"Configurar ClickUp","description":"Criar space/folder/listas no ClickUp para o cliente. Adicionar como guest.","type":"manual","assignee":"Fernando","estimatedMinutes":30},
    {"id":"notion-setup","title":"Configurar Notion","description":"Criar hub do cliente no Notion com estrutura padrao (briefing, assets, entregas).","type":"manual","assignee":"Fernando","estimatedMinutes":20},
    {"id":"brand-kit","title":"Coletar Brand Kit","description":"Solicitar e organizar: logo, paleta, fontes, tom de voz, guidelines.","type":"manual","assignee":"Karol","estimatedMinutes":45},
    {"id":"welcome-message","title":"Mensagem de Boas-Vindas","description":"Enviar mensagem de boas-vindas no WhatsApp com links de acesso.","type":"manual","assignee":"Fernando","estimatedMinutes":10}
  ]'::jsonb,
  true
),
(
  'Producao de Conteudo Semanal',
  'Pipeline semanal de producao de conteudo para redes sociais.',
  '📱',
  'content',
  '[
    {"id":"briefing","title":"Criar Briefing","description":"Definir tema da semana, referencias visuais e objetivos de cada peca.","type":"manual","assignee":"Fernando","estimatedMinutes":30},
    {"id":"copy","title":"Redacao de Copy","description":"Escrever textos para todas as pecas da semana (posts, stories, reels).","type":"manual","assignee":"Gabriel","estimatedMinutes":120},
    {"id":"design","title":"Criacao de Arte","description":"Produzir artes visuais com base no briefing e copy aprovados.","type":"manual","assignee":"Karol","estimatedMinutes":180},
    {"id":"review","title":"Revisao Interna","description":"Revisar todos os materiais: copy, arte, videos. Validar consistencia visual.","type":"manual","assignee":"Fernando","estimatedMinutes":30},
    {"id":"client-approval","title":"Aprovacao do Cliente","description":"Enviar preview para o cliente aprovar. Aplicar feedbacks se necessario.","type":"manual","estimatedMinutes":60},
    {"id":"schedule","title":"Agendamento","description":"Agendar publicacoes nas plataformas definidas.","type":"manual","assignee":"Karol","estimatedMinutes":30}
  ]'::jsonb,
  true
),
(
  'Deploy de Landing Page',
  'Fluxo de publicacao de uma nova landing page.',
  '🚀',
  'development',
  '[
    {"id":"dev-complete","title":"Desenvolvimento Finalizado","description":"Confirmar que codigo esta pronto, linted e buildando sem erros.","type":"manual","assignee":"Fernando","estimatedMinutes":10},
    {"id":"qa-review","title":"QA Review","description":"Testar responsividade, links, formularios e performance.","type":"manual","assignee":"Fernando","estimatedMinutes":30},
    {"id":"deploy","title":"Deploy na Vercel","description":"Fazer push para branch main e verificar deploy automatico na Vercel.","type":"mixed","assignee":"Fernando","estimatedMinutes":10},
    {"id":"dns-config","title":"Configurar DNS","description":"Apontar dominio/subdominio para a Vercel. Verificar SSL.","type":"manual","assignee":"Fernando","estimatedMinutes":15},
    {"id":"pixels","title":"Instalar Pixels","description":"Configurar Facebook Pixel, Google Analytics e outros trackers.","type":"manual","assignee":"Fernando","estimatedMinutes":20},
    {"id":"final-check","title":"Verificacao Final","description":"Testar URL final: HTTPS, meta tags, OG image, velocidade.","type":"manual","estimatedMinutes":15}
  ]'::jsonb,
  true
),
(
  'Relatorio Mensal',
  'Fluxo de criacao do relatorio mensal de resultados para o cliente.',
  '📊',
  'operations',
  '[
    {"id":"data-collection","title":"Coletar Dados","description":"Extrair metricas de Instagram, Google Analytics, ClickUp e outras ferramentas.","type":"manual","assignee":"Fernando","estimatedMinutes":45},
    {"id":"analysis","title":"Analise de Resultados","description":"Analisar metricas, identificar tendencias e insights relevantes.","type":"manual","assignee":"Fernando","estimatedMinutes":60},
    {"id":"report-draft","title":"Redigir Relatorio","description":"Criar documento com graficos, analise e recomendacoes.","type":"manual","assignee":"Fernando","estimatedMinutes":90},
    {"id":"internal-review","title":"Revisao Interna","description":"Validar dados e conclusoes com a equipe.","type":"manual","estimatedMinutes":20},
    {"id":"send-client","title":"Enviar ao Cliente","description":"Enviar relatorio finalizado e agendar reuniao de review se necessario.","type":"manual","estimatedMinutes":10}
  ]'::jsonb,
  true
);
