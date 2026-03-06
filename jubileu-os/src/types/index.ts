// User & Auth types
export type UserRole = 'admin' | 'member' | 'client';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  contacts: ContactInfo[];
  links: Record<string, string>;
  clickup_tag: string | null;
  notion_root_page_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  name: string;
  role: string;
  email?: string;
  phone?: string;
}

export interface UserClient {
  user_id: string;
  client_id: string;
  created_at: string;
}

// Activity types
export type ActivityAction =
  | 'task.created'
  | 'task.updated'
  | 'task.status_changed'
  | 'task.commented'
  | 'document.viewed'
  | 'document.created'
  | 'document.edited'
  | 'client.created'
  | 'client.updated'
  | 'workflow.started'
  | 'workflow.step_completed'
  | 'workflow.completed'
  | 'agent.chat_started'
  | 'agent.chat_message'
  | 'system.login'
  | 'system.logout';

export interface ActivityLog {
  id: string;
  user_id: string;
  action: ActivityAction;
  entity_type: 'task' | 'document' | 'client' | 'workflow' | 'agent' | 'system';
  entity_id: string | null;
  entity_name: string | null;
  client_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Product types
export type ProductUnit = 'un' | 'kg' | 'cx' | 'maco' | 'dz';

export const PRODUCT_UNIT_LABELS: Record<ProductUnit, string> = {
  un: 'Unidade',
  kg: 'Quilo',
  cx: 'Caixa',
  maco: 'Maço',
  dz: 'Dúzia',
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: ProductUnit;
  image_url: string | null;
  category_id: string | null;
  is_active: boolean;
  deleted_at: string | null;
  display_id: number;
  created_at: string;
  updated_at: string;
  categories?: Category;
}

export type ProductInsert = Omit<Product, 'id' | 'display_id' | 'deleted_at' | 'created_at' | 'updated_at' | 'categories'>;
export type ProductUpdate = Partial<Omit<Product, 'id' | 'display_id' | 'created_at' | 'updated_at' | 'categories'>>;

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatContextRef {
  type: 'clickup_task' | 'notion_page';
  id: string;
  title: string;
  url: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  agent_id: string;
  title: string;
  messages: ChatMessage[];
  context_refs: ChatContextRef[];
  created_at: string;
  updated_at: string;
}

// Deliverables
export type DeliverableStatus = 'draft' | 'pending_review' | 'approved' | 'revision_requested';
export type DeliverableType = 'design' | 'copy' | 'video' | 'development' | 'report' | 'other';

export const DELIVERABLE_STATUS_LABELS: Record<DeliverableStatus, string> = {
  draft: 'Rascunho',
  pending_review: 'Aguardando Aprovacao',
  approved: 'Aprovado',
  revision_requested: 'Revisao Solicitada',
};

export const DELIVERABLE_TYPE_LABELS: Record<DeliverableType, string> = {
  design: 'Design',
  copy: 'Copy',
  video: 'Video',
  development: 'Desenvolvimento',
  report: 'Relatorio',
  other: 'Outro',
};

export interface Deliverable {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  type: DeliverableType;
  status: DeliverableStatus;
  file_url: string | null;
  preview_url: string | null;
  due_date: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined
  clients?: { name: string; slug: string };
  profiles?: { full_name: string };
}

// Calendar & Inbox
export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  all_day: boolean;
  color: string | null;
  source: 'manual' | 'deliverable' | 'task';
  source_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  module: 'task' | 'document' | 'deliverable' | 'workflow' | 'calendar' | 'system';
  action_url: string | null;
  is_read: boolean;
  created_at: string;
}

// Navigation
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles: UserRole[];
  badge?: number;
}
