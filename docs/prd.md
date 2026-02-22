# Jubileu Agency - Project Management System PRD

**Version:** 1.0.0
**Date:** 2026-02-19
**Author:** Orion (AIOS Master) + Fernando
**Type:** Brownfield Enhancement PRD
**Status:** Draft

---

## Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|--------|
| Initial draft | 2026-02-19 | 1.0.0 | Complete PRD creation | Orion + Fernando |

---

## 1. Intro Project Analysis and Context

### 1.1 Existing Project Overview

**Analysis Source:** User-provided documentation (Agencia Jubileu Resumo.md, Roadmap Funil de Vendas)

**Current State:** Agencia Jubileu is a digital marketing agency based in BH, Brazil, with 3 founding partners + 1 developer, managing 3 active clients. The agency currently has **no centralized project management system**. Operations rely on informal WhatsApp conversations, ad-hoc Google Drive files, and verbal agreements.

**Existing Tools in Use:**

| Tool | Current Usage | Pain Points |
|------|--------------|-------------|
| WhatsApp | All communication, task assignment, client comms | Tasks get lost, no tracking, no accountability |
| Google Drive | File storage (unstructured) | No naming conventions, hard to find assets |
| GitHub | Some code repos (Pelicula Sideral) | Underutilized, no knowledge base |
| Vercel | Landing page deployments | Works fine, keep as-is |
| Bubble | Levee delivery app | No documentation, Fernando-dependent |
| ManyChat | Automation funnels (Pelicula) | Working, needs integration with workflow |
| Instagram | Primary social media for all clients | No centralized content calendar |

### 1.2 Team Structure

| Member | Role | Capacity | Key Bottleneck |
|--------|------|----------|---------------|
| **Fernando** | Strategy & Innovation | Part-time (strategy only) | Decision bottleneck for everything |
| **Gabriel** | Audiovisual, Automations, Ads | Full-time | Still learning, needs clear task assignments |
| **Karol** | Organization & Execution | Full-time | Overwhelmed, no visibility into all tasks |
| **Diego** | Development | Full-time (100% Levee) | Isolated, health limitations |

### 1.3 Client Portfolio

| Client | Contract | Monthly Revenue | Complexity | Primary Work |
|--------|----------|----------------|------------|-------------|
| **Levee Hortiplus** | R$4k + 4% sales + R$4k dev | ~R$8-12k | HIGH | Social media, app support, strategy |
| **Caracol** | R$2.5k fixed | R$2.5k | MEDIUM | Social media (20 posts, 4 videos/mo) |
| **Pelicula Sideral** | R$4k + % | R$4k+ | HIGH | Funnels, landing pages, content, products |

### 1.4 Enhancement Scope

- **Type:** Integration with New Systems + New Feature Addition
- **Impact:** Major - transforms entire agency operations
- **Description:** Build a centralized project management system integrating ClickUp (task management with AI/MCP), Google Drive (file storage), GitHub (code/prompts/KB), Supabase (analytics/database), and WhatsApp (notifications) into a unified operational hub.

### 1.5 Goals

- Eliminate Fernando as sole decision bottleneck by establishing clear workflows and delegation authority
- Give Karol real-time visibility into all tasks across all clients for effective prioritization
- Track deliverables, deadlines, and SLAs per client contract
- Use AI (ClickUp MCP) to automate task creation, assignment, status updates, and reporting
- Centralize client assets, brand guidelines, content calendars, and SOPs
- Track financial metrics (revenue/client, hours invested, ROI)
- Enable scaling from 3 to 5+ clients without operational chaos
- Reduce WhatsApp dependency for task management to near-zero

### 1.6 Background Context

The agency grew organically from 0 to 3 clients in approximately 2 months but lacks operational infrastructure. Fernando makes all strategic decisions, Karol manages execution without proper tools, and Gabriel needs clearer task assignments. The Pelicula Sideral project (highest revenue potential) is the most stalled because everything depends on Fernando passing information to the team. The immediate pain is severe: tasks discussed in WhatsApp are forgotten, deadlines are missed, there's no measurement of team capacity, and client profitability is unknown.

---

## 2. Requirements

### 2.1 Functional Requirements

**FR1:** The system SHALL provide a ClickUp workspace with hybrid organization: client-specific Spaces (Levee, Caracol, Pelicula Sideral) for delivery work, plus an Internal/Agency Space organized by function (Finance, HR, Strategy, Tools/AI).

**FR2:** Each client Space SHALL contain standardized Lists: Content Calendar, Tasks/Deliverables, Strategy & Planning, Client Communication Log, and Assets/Brand Guidelines.

**FR3:** The Internal Space SHALL contain Lists for: Financial Tracking, Team Capacity, SOPs & Processes, AI/Automation Projects, and Business Development.

**FR4:** The system SHALL integrate with ClickUp MCP to enable AI-driven task creation from content calendars, automatic task assignment based on team member roles, and intelligent priority suggestions.

**FR5:** The system SHALL use AI (via MCP) to automatically generate recurring tasks for each client based on their contract scope (e.g., 20 posts/month for Caracol, daily stories for Levee).

**FR6:** The system SHALL integrate with Google Drive to link assets, deliverables, and documents directly to ClickUp tasks via Drive folder references in task descriptions.

**FR7:** The system SHALL use a GitHub repository to store: AI prompts library, brand DNA documents, content templates, SOPs, and knowledge base articles.

**FR8:** The system SHALL use Supabase to store and query: client performance metrics, financial data, content analytics, and team productivity data.

**FR9:** The system SHALL support WhatsApp notifications for critical events: task assignments, deadline reminders (24h and 2h before), task completion, and client-related urgent items.

**FR10:** The system SHALL provide a weekly automated report (generated via AI/MCP) summarizing: tasks completed per client, tasks overdue, team utilization, and client revenue tracking.

**FR11:** The system SHALL define clear task templates for recurring agency work: Social Media Post, Video Production, Campaign Launch, Client Report, Strategy Session, and Content Calendar Planning.

**FR12:** The system SHALL implement approval workflows where Karol can approve routine tasks independently, while strategic decisions are flagged for Fernando's review with a 48-hour auto-escalation.

**FR13:** The system SHALL track time spent per client via ClickUp time tracking to calculate profitability (revenue vs. hours invested).

**FR14:** The system SHALL provide a client onboarding checklist template in ClickUp for standardizing new client intake (brand DNA, personas, content audit, channel setup, contract terms).

**FR15:** The system SHALL store content calendars in ClickUp with Calendar view, allowing the team to plan, schedule, and track content across all clients in one view.

### 2.2 Non-Functional Requirements

**NFR1:** The ClickUp workspace must be usable on mobile devices (ClickUp mobile app) since team members frequently work in the field (video shoots, client visits).

**NFR2:** AI/MCP automations must execute within 30 seconds for task creation and assignment operations.

**NFR3:** The Supabase database must support concurrent queries from up to 10 simultaneous users without degradation.

**NFR4:** GitHub knowledge base must be searchable and organized with clear folder structure and README files for each section.

**NFR5:** WhatsApp notifications must be rate-limited to prevent notification fatigue (max 5 notifications per person per day for non-urgent items).

**NFR6:** The system must be maintainable by the team without requiring Fernando for day-to-day operations.

**NFR7:** All client data must be isolated — team members should only see clients they are assigned to (future-proofing for team growth).

**NFR8:** The system must work with ClickUp's free or Business plan (R$49/user/mo), keeping costs under R$200/month for the 4-person team.

### 2.3 Compatibility Requirements

**CR1: Existing Tool Compatibility** — The system must not replace WhatsApp for client communication or informal team chat; it supplements it for task management only.

**CR2: Google Drive Compatibility** — Must work with existing Google Drive folder structure; migration of existing files is optional and incremental.

**CR3: GitHub Compatibility** — Must integrate with existing GitHub repos (JUBILEU-AGENCIA) without disrupting current code workflows.

**CR4: ManyChat Compatibility** — ClickUp tasks related to ManyChat funnels must link to the relevant ManyChat flows for context.

---

## 3. User Interface Enhancement Goals

### 3.1 ClickUp Workspace Views

No custom UI development required. The system leverages ClickUp's native views:

- **Board View** — Kanban for task workflow (To Do → In Progress → Review → Done)
- **Calendar View** — Content calendar across all clients
- **List View** — Detailed task lists with filters per client/team member
- **Dashboard** — Custom ClickUp dashboard with widgets for: tasks by status, overdue items, team workload, and client health
- **Gantt View** — For campaign timelines and project dependencies

### 3.2 Supabase Dashboard

A simple web dashboard (optional, Phase 2) pulling from Supabase to show:
- Revenue per client (monthly/cumulative)
- Hours invested per client
- Content performance metrics (engagement, reach, conversions)
- Team utilization rates

---

## 4. Technical Constraints and Integration Requirements

### 4.1 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Task Management | ClickUp (Business plan) | Central hub for all tasks and workflows |
| AI Integration | ClickUp MCP Server | AI-driven task automation via Claude Code |
| File Storage | Google Drive | Assets, deliverables, client files |
| Code/KB | GitHub (JUBILEU-AGENCIA repo) | Prompts, SOPs, brand docs, knowledge base |
| Database | Supabase (Free/Pro tier) | Analytics, metrics, financial tracking |
| Communication | WhatsApp | Team chat, client comms, notifications |
| Deployments | Vercel | Landing pages (existing) |
| Automations | ManyChat | Instagram/WhatsApp funnels (existing) |

### 4.2 Integration Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLAUDE CODE + MCP                         │
│                    (AI Orchestration Layer)                       │
├──────────┬───────────┬────────────┬──────────────┬──────────────┤
│          │           │            │              │              │
│  ClickUp │  Google   │  GitHub    │  Supabase    │  WhatsApp    │
│  MCP     │  Drive    │  API/CLI   │  REST API    │  (via Z-API  │
│  Server  │  API      │            │  + JS Client │  or similar) │
│          │           │            │              │              │
├──────────┴───────────┴────────────┴──────────────┴──────────────┤
│                                                                  │
│  CLICKUP WORKSPACE (Hybrid Structure)                            │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Space: LEVEE HORTIPLUS                               │       │
│  │  ├── List: Content Calendar                           │       │
│  │  ├── List: Tasks & Deliverables                       │       │
│  │  ├── List: Strategy & Planning                        │       │
│  │  ├── List: App & Development                          │       │
│  │  └── List: Client Communication Log                   │       │
│  ├──────────────────────────────────────────────────────┤       │
│  │  Space: CARACOL ENTRETENIMENTOS                       │       │
│  │  ├── List: Content Calendar                           │       │
│  │  ├── List: Tasks & Deliverables                       │       │
│  │  ├── List: Strategy & Planning                        │       │
│  │  └── List: Client Communication Log                   │       │
│  ├──────────────────────────────────────────────────────┤       │
│  │  Space: PELICULA SIDERAL                              │       │
│  │  ├── List: Content Calendar                           │       │
│  │  ├── List: Tasks & Deliverables                       │       │
│  │  ├── List: Funnels & Automations                      │       │
│  │  ├── List: Products & Launches                        │       │
│  │  └── List: Client Communication Log                   │       │
│  ├──────────────────────────────────────────────────────┤       │
│  │  Space: JUBILEU INTERNO                               │       │
│  │  ├── Folder: Financeiro                               │       │
│  │  │   ├── List: Receitas & Contratos                   │       │
│  │  │   └── List: Despesas & Investimentos               │       │
│  │  ├── Folder: Equipe                                   │       │
│  │  │   ├── List: Capacidade & Alocação                  │       │
│  │  │   └── List: Treinamentos & Desenvolvimento         │       │
│  │  ├── Folder: Processos                                │       │
│  │  │   ├── List: SOPs                                   │       │
│  │  │   └── List: Templates & Checklists                 │       │
│  │  ├── Folder: IA & Automação                           │       │
│  │  │   ├── List: Prompts & Ferramentas                  │       │
│  │  │   └── List: Projetos de Automação                  │       │
│  │  └── Folder: Novos Negócios                           │       │
│  │      ├── List: Prospecção                             │       │
│  │      └── List: Onboarding Clientes                    │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                  │
│  SUPABASE (Analytics & Data Layer)                               │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Tables:                                              │       │
│  │  ├── clients (id, name, contract, revenue, status)    │       │
│  │  ├── projects (id, client_id, name, type, status)     │       │
│  │  ├── tasks_log (synced from ClickUp for analytics)    │       │
│  │  ├── content_metrics (platform, reach, engagement)    │       │
│  │  ├── financial_records (revenue, expenses, profit)    │       │
│  │  ├── team_hours (member, client, hours, date)         │       │
│  │  └── ai_prompts (category, prompt, version, usage)    │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                  │
│  GITHUB (Knowledge Base & Code)                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  JUBILEU-AGENCIA/                                     │       │
│  │  ├── kb/                    # Knowledge Base          │       │
│  │  │   ├── brand-dna/         # Per-client brand docs   │       │
│  │  │   ├── personas/          # Buyer personas          │       │
│  │  │   ├── sops/              # Standard procedures     │       │
│  │  │   └── playbooks/         # Strategy playbooks      │       │
│  │  ├── prompts/               # AI Prompt Library       │       │
│  │  │   ├── content/           # Content generation      │       │
│  │  │   ├── strategy/          # Strategy analysis       │       │
│  │  │   ├── automation/        # ManyChat, workflows     │       │
│  │  │   └── reporting/         # Report generation       │       │
│  │  ├── templates/             # Reusable templates      │       │
│  │  │   ├── social-media/      # Post templates          │       │
│  │  │   ├── proposals/         # Client proposals        │       │
│  │  │   └── reports/           # Report templates        │       │
│  │  └── code/                  # Automation code         │       │
│  │      ├── supabase/          # DB functions, schemas   │       │
│  │      ├── integrations/      # API integrations        │       │
│  │      └── scripts/           # Utility scripts         │       │
│  └──────────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────┘
```

### 4.3 ClickUp MCP Integration Specs

The ClickUp MCP server enables AI-driven project management through Claude Code. Key automation capabilities:

**Task Creation Automations:**
- Generate monthly content calendar tasks from templates (per client contract scope)
- Create campaign tasks from strategy documents
- Generate checklist sub-tasks from SOPs
- Auto-create follow-up tasks when a task is marked as "Review"

**Task Assignment Automations:**
- Auto-assign based on role mapping (content → Karol, video → Gabriel, strategy → Fernando, dev → Diego)
- Balance workload based on current task count per team member
- Escalate unassigned tasks after 24 hours

**Reporting Automations:**
- Weekly summary: tasks completed, overdue, upcoming deadlines
- Monthly client report: deliverables, metrics, hours invested
- Team utilization report: hours per client, capacity remaining

**Priority Management:**
- AI suggests task priorities based on: deadline proximity, client contract value, dependencies, and team capacity
- Auto-flag tasks at risk of missing deadlines (3 days before)
- Escalate blocked tasks after 48 hours without movement

### 4.4 Supabase Database Schema

```sql
-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  contract_type TEXT NOT NULL, -- 'fixed', 'fixed_plus_percentage', 'project'
  monthly_fee DECIMAL(10,2),
  percentage_fee DECIMAL(5,2),
  contract_start DATE,
  contract_end DATE,
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'churned'
  clickup_space_id TEXT,
  drive_folder_url TEXT,
  instagram_handle TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects per client
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'social_media', 'campaign', 'development', 'funnel', 'branding'
  status TEXT DEFAULT 'planning', -- 'planning', 'active', 'paused', 'completed'
  start_date DATE,
  target_date DATE,
  clickup_list_id TEXT,
  budget DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks log (synced from ClickUp for analytics)
CREATE TABLE tasks_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clickup_task_id TEXT UNIQUE,
  client_id UUID REFERENCES clients(id),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  assigned_to TEXT,
  status TEXT,
  priority TEXT,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  time_spent_minutes INTEGER DEFAULT 0,
  task_type TEXT, -- 'post', 'video', 'design', 'strategy', 'development', 'meeting'
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content metrics
CREATE TABLE content_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  platform TEXT NOT NULL, -- 'instagram', 'whatsapp', 'substack', 'tiktok'
  content_type TEXT, -- 'post', 'story', 'reel', 'carousel'
  post_date DATE,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue_attributed DECIMAL(10,2) DEFAULT 0,
  clickup_task_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial records
CREATE TABLE financial_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  type TEXT NOT NULL, -- 'revenue', 'expense'
  category TEXT, -- 'monthly_fee', 'percentage', 'project_fee', 'tool_cost', 'freelancer'
  amount DECIMAL(10,2) NOT NULL,
  reference_month DATE NOT NULL,
  description TEXT,
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'overdue'
  due_date DATE,
  paid_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team hours tracking
CREATE TABLE team_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name TEXT NOT NULL,
  client_id UUID REFERENCES clients(id),
  task_type TEXT,
  hours DECIMAL(5,2) NOT NULL,
  work_date DATE NOT NULL,
  clickup_task_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI prompts library (version controlled)
CREATE TABLE ai_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'content', 'strategy', 'automation', 'reporting'
  subcategory TEXT,
  name TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  usage_count INTEGER DEFAULT 0,
  effectiveness_rating DECIMAL(3,2),
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Views
CREATE VIEW client_profitability AS
SELECT
  c.name AS client_name,
  c.monthly_fee,
  COALESCE(SUM(CASE WHEN fr.type = 'revenue' THEN fr.amount ELSE 0 END), 0) AS total_revenue,
  COALESCE(SUM(CASE WHEN fr.type = 'expense' THEN fr.amount ELSE 0 END), 0) AS total_expenses,
  COALESCE(SUM(th.hours), 0) AS total_hours,
  CASE
    WHEN COALESCE(SUM(th.hours), 0) > 0
    THEN ROUND(COALESCE(SUM(CASE WHEN fr.type = 'revenue' THEN fr.amount ELSE 0 END), 0) / SUM(th.hours), 2)
    ELSE 0
  END AS revenue_per_hour
FROM clients c
LEFT JOIN financial_records fr ON c.id = fr.client_id
LEFT JOIN team_hours th ON c.id = th.client_id
GROUP BY c.id, c.name, c.monthly_fee;

CREATE VIEW team_utilization AS
SELECT
  th.member_name,
  c.name AS client_name,
  DATE_TRUNC('week', th.work_date) AS week,
  SUM(th.hours) AS hours_worked,
  COUNT(DISTINCT th.work_date) AS days_worked
FROM team_hours th
JOIN clients c ON th.client_id = c.id
GROUP BY th.member_name, c.name, DATE_TRUNC('week', th.work_date);
```

### 4.5 Google Drive Structure

```
Jubileu Agencia/
├── 📁 CLIENTES/
│   ├── 📁 Levee Hortiplus/
│   │   ├── 📁 Brand DNA & Guidelines/
│   │   ├── 📁 Conteúdos/
│   │   │   ├── 📁 2026-02/
│   │   │   ├── 📁 2026-03/
│   │   │   └── ...
│   │   ├── 📁 Artes & Design/
│   │   ├── 📁 Vídeos/
│   │   ├── 📁 Relatórios/
│   │   └── 📁 Referências/
│   ├── 📁 Caracol Entretenimentos/
│   │   └── (same structure)
│   └── 📁 Pelicula Sideral/
│       └── (same structure)
├── 📁 INTERNO/
│   ├── 📁 Financeiro/
│   ├── 📁 Contratos/
│   ├── 📁 Propostas/
│   └── 📁 Templates/
└── 📁 FERRAMENTAS/
    ├── 📁 Tutoriais/
    └── 📁 Assets Genéricos/
```

### 4.6 Deployment & Operations

- **ClickUp:** SaaS, managed by ClickUp (no deployment needed)
- **Supabase:** Cloud-hosted Supabase project (free tier to start, Pro when needed)
- **GitHub:** Existing repo (JUBILEU-AGENCIA), extend with new folder structure
- **MCP Integration:** Runs locally via Claude Code with ClickUp MCP server
- **WhatsApp Integration:** Via Z-API, Evolution API, or similar WhatsApp Business API provider

### 4.7 Risk Assessment

**Technical Risks:**
- ClickUp MCP server may have rate limits that affect full automation
- WhatsApp Business API integration requires approved provider and may have costs
- Supabase free tier has row limits (500MB, 50K rows) — may need Pro upgrade

**Integration Risks:**
- ClickUp ↔ Supabase sync requires custom webhook or periodic sync script
- Google Drive API requires OAuth setup and service account
- MCP tools availability may change with Claude Code updates

**Operational Risks:**
- Team adoption: Gabriel and Karol need training on ClickUp
- Process discipline: team must consistently update tasks instead of using WhatsApp
- Fernando must delegate decision-making authority for the system to work

**Mitigation Strategies:**
- Start with ClickUp + manual workflows before adding AI automation
- Phase the rollout: ClickUp first → GitHub KB → Supabase → AI automation
- Create video tutorials for team onboarding
- Weekly check-ins during first month to ensure adoption

---

## 5. Epic and Story Structure

### Epic Approach

**Structure Decision:** 3 Epics organized by implementation phase. This ensures the team gets value incrementally — starting with the most critical need (centralized task management) before adding sophistication (AI automation, analytics).

---

### Epic 1: ClickUp Workspace Foundation & Team Onboarding

**Epic Goal:** Establish the ClickUp workspace with hybrid structure, migrate existing tasks from WhatsApp/ad-hoc tracking, and onboard the entire team.

**Integration Requirements:** ClickUp account setup, Google Drive folder linking, team member invitations.

#### Story 1.1: Create ClickUp Workspace and Hybrid Space Structure

As a **agency founder (Fernando)**,
I want **the ClickUp workspace configured with client spaces and an internal operations space**,
so that **all agency work has a centralized, organized home**.

**Acceptance Criteria:**
1. ClickUp workspace "Agencia Jubileu" created
2. 4 Spaces created: Levee Hortiplus, Caracol, Pelicula Sideral, Jubileu Interno
3. Each client Space has standardized Lists (Content Calendar, Tasks, Strategy, Communication Log)
4. Jubileu Interno has Folders (Financeiro, Equipe, Processos, IA & Automação, Novos Negócios)
5. Custom statuses configured: To Do → In Progress → Review → Approved → Done
6. Custom fields added: Client, Task Type, Priority, Time Estimate, Assignee

**Integration Verification:**
- IV1: All team members can access the workspace on mobile and desktop
- IV2: Space permissions are correctly set (team sees all for now)

---

#### Story 1.2: Create Task Templates and Recurring Workflows

As a **project manager (Karol)**,
I want **pre-built task templates for common agency work**,
so that **I can create tasks quickly without defining everything from scratch**.

**Acceptance Criteria:**
1. Task templates created for: Social Media Post, Video Production, Campaign Launch, Client Monthly Report, Strategy Session, Content Calendar Planning
2. Each template has pre-defined subtasks/checklists
3. Recurring tasks configured per client contract scope (e.g., Caracol: 20 posts/month, 4 videos/month)
4. Template includes time estimates and default assignees
5. Client onboarding checklist template created

**Integration Verification:**
- IV1: Templates are accessible to all team members
- IV2: Recurring tasks auto-generate on the correct schedule

---

#### Story 1.3: Migrate Existing Tasks and Backlog to ClickUp

As a **team member**,
I want **all current tasks, pending items, and client commitments tracked in ClickUp**,
so that **nothing falls through the cracks during the transition**.

**Acceptance Criteria:**
1. All active tasks from WhatsApp conversations captured in ClickUp
2. Levee: Current content schedule, app support items, and strategy tasks migrated
3. Caracol: Content calendar and pending deliverables migrated
4. Pelicula Sideral: Funnel roadmap tasks, landing page items, and content tasks migrated
5. Each task has correct assignee, due date, and priority
6. Backlog items categorized and prioritized

**Integration Verification:**
- IV1: No duplicate tasks exist
- IV2: Team members confirm their task lists are complete

---

#### Story 1.4: Team Onboarding and Training

As a **agency founder**,
I want **all team members trained on ClickUp workflows and processes**,
so that **the team adopts the system consistently from day one**.

**Acceptance Criteria:**
1. Quick-start guide created for the team (in Portuguese)
2. Video tutorial or walkthrough recorded (screen recording)
3. Each team member has completed their first task update in ClickUp
4. Daily standup routine established (5-min async update via ClickUp)
5. Agreement: no task assignments via WhatsApp-only (must be in ClickUp)
6. Weekly review meeting scheduled for first month

**Integration Verification:**
- IV1: All 4 team members active in ClickUp within 48 hours
- IV2: Mobile app installed on all team members' phones

---

### Epic 2: GitHub Knowledge Base & Google Drive Organization

**Epic Goal:** Structure the agency's intellectual assets — brand guidelines, AI prompts, SOPs, and templates — in GitHub and Google Drive with clear organization.

#### Story 2.1: Organize GitHub Repository as Knowledge Base

As a **strategist (Fernando)**,
I want **a well-organized GitHub repo with all agency knowledge — prompts, brand docs, SOPs, and templates**,
so that **any team member can find and use the right resources quickly**.

**Acceptance Criteria:**
1. GitHub repo (JUBILEU-AGENCIA) restructured with folders: kb/, prompts/, templates/, code/
2. Brand DNA documents created for each client (Levee, Caracol, Pelicula)
3. AI prompts library organized by category (content, strategy, automation, reporting)
4. At least 5 SOPs documented (content creation, video production, client report, task workflow, onboarding)
5. README.md updated with repo navigation guide
6. Each folder has its own README explaining contents

**Integration Verification:**
- IV1: Team members can find documents via GitHub search
- IV2: Brand DNA docs are linked from ClickUp client spaces

---

#### Story 2.2: Structure Google Drive Folders

As a **project manager (Karol)**,
I want **Google Drive organized with a consistent folder structure per client**,
so that **I can find and share client assets without wasting time searching**.

**Acceptance Criteria:**
1. Root folder "Jubileu Agencia" created with CLIENTES, INTERNO, FERRAMENTAS subfolders
2. Each client folder has standardized subfolders (Brand DNA, Conteúdos by month, Artes, Vídeos, Relatórios, Referências)
3. Existing files migrated to correct folders
4. Folder shortcuts/links added to corresponding ClickUp Spaces
5. Sharing permissions configured (team-wide access, client-specific sharing for deliverables)

**Integration Verification:**
- IV1: Google Drive links work correctly from ClickUp tasks
- IV2: Existing files have not been lost during reorganization

---

### Epic 3: Supabase Database, AI/MCP Automation & Integrations

**Epic Goal:** Set up the data layer and AI automation engine that powers intelligent project management, reporting, and insights.

#### Story 3.1: Set Up Supabase Database Schema

As a **strategist (Fernando)**,
I want **a Supabase database tracking clients, finances, content metrics, and team hours**,
so that **I can make data-driven decisions about client profitability and team allocation**.

**Acceptance Criteria:**
1. Supabase project created and configured
2. All tables created per schema (clients, projects, tasks_log, content_metrics, financial_records, team_hours, ai_prompts)
3. Views created (client_profitability, team_utilization)
4. Initial data populated: 3 clients with contract details, team members
5. Row Level Security (RLS) policies configured
6. API keys secured and documented

**Integration Verification:**
- IV1: Data can be queried via Supabase dashboard
- IV2: API endpoints respond correctly for all tables

---

#### Story 3.2: Configure ClickUp MCP for AI-Driven Task Management

As a **agency founder (Fernando)**,
I want **Claude Code connected to ClickUp via MCP to automate task creation, assignment, and reporting**,
so that **the AI can manage routine project management tasks autonomously**.

**Acceptance Criteria:**
1. ClickUp MCP server configured and accessible from Claude Code
2. AI can create tasks in any client Space with correct fields
3. AI can read task statuses and generate summary reports
4. Monthly content calendar auto-generation working (AI creates tasks from template + client brief)
5. Task assignment rules implemented (content→Karol, video→Gabriel, strategy→Fernando, dev→Diego)
6. Weekly report automation working (generates summary and posts to Jubileu Interno)
7. Deadline alert system working (flags tasks due within 72 hours)

**Integration Verification:**
- IV1: AI-created tasks appear correctly in ClickUp with all fields populated
- IV2: Reports accurately reflect task data from ClickUp
- IV3: No duplicate tasks created by automation

---

#### Story 3.3: Implement ClickUp-to-Supabase Data Sync

As a **strategist (Fernando)**,
I want **ClickUp task data automatically synced to Supabase for analytics**,
so that **I can query historical data, generate custom reports, and track trends over time**.

**Acceptance Criteria:**
1. Sync mechanism established (webhook or scheduled script)
2. Completed tasks sync to tasks_log table with all relevant fields
3. Time tracking data syncs to team_hours table
4. Sync runs at least once daily
5. Error handling and retry logic implemented
6. Initial historical data backfilled

**Integration Verification:**
- IV1: Supabase data matches ClickUp source within 24 hours
- IV2: No data loss during sync failures (retry mechanism works)

---

#### Story 3.4: WhatsApp Notification Integration

As a **team member**,
I want **critical ClickUp notifications sent to WhatsApp**,
so that **I don't miss important deadlines or assignments even when not checking ClickUp**.

**Acceptance Criteria:**
1. WhatsApp Business API provider selected and configured (Z-API, Evolution API, or similar)
2. Notifications sent for: new task assignment, deadline in 24h, task overdue, task completed (to assigner)
3. Rate limiting implemented (max 5 non-urgent notifications per person per day)
4. Notification messages are concise with direct ClickUp task links
5. Team members can mute non-critical notifications
6. Cost within budget (evaluate free vs paid tiers)

**Integration Verification:**
- IV1: Notifications arrive within 5 minutes of trigger event
- IV2: Links in WhatsApp messages open correctly in ClickUp
- IV3: Rate limiting prevents notification spam

---

## 6. Implementation Phases & Timeline

### Phase 1: Foundation (Week 1-2)
- Stories 1.1, 1.2, 1.3, 1.4
- **Outcome:** ClickUp workspace live, team onboarded, all tasks migrated

### Phase 2: Knowledge & Assets (Week 3-4)
- Stories 2.1, 2.2
- **Outcome:** GitHub KB structured, Google Drive organized, linked to ClickUp

### Phase 3: Intelligence & Automation (Week 5-8)
- Stories 3.1, 3.2, 3.3, 3.4
- **Outcome:** Supabase live, AI automation active, notifications working

---

## 7. Success Metrics

| Metric | Current | Target (30 days) | Target (90 days) |
|--------|---------|-------------------|-------------------|
| Tasks tracked in ClickUp | 0% | 90% | 100% |
| Tasks completed on time | Unknown | 70% | 85% |
| WhatsApp task messages | ~50/day | <10/day | <5/day |
| Fernando decision bottleneck | Hours/days | <24h response | <4h for routine |
| Client report generation | Manual (hours) | Semi-auto (30min) | Full auto (AI) |
| Content calendar planned | 0 weeks ahead | 2 weeks ahead | 4 weeks ahead |
| Team utilization visibility | None | Weekly view | Real-time |

---

*Generated by Orion (AIOS Master) — Synkra AIOS v2.0*
