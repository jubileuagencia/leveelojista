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

// Navigation
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles: UserRole[];
  badge?: number;
}
