export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: 'admin' | 'member' | 'client';
          is_active: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: 'admin' | 'member' | 'client';
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: 'admin' | 'member' | 'client';
          is_active?: boolean;
          last_login_at?: string | null;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          contacts: unknown[];
          links: Record<string, string>;
          clickup_tag: string | null;
          notion_root_page_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          contacts?: unknown[];
          links?: Record<string, string>;
          clickup_tag?: string | null;
          notion_root_page_id?: string | null;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          logo_url?: string | null;
          contacts?: unknown[];
          links?: Record<string, string>;
          clickup_tag?: string | null;
          notion_root_page_id?: string | null;
          is_active?: boolean;
        };
      };
      user_clients: {
        Row: {
          user_id: string;
          client_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          client_id: string;
        };
        Update: {
          user_id?: string;
          client_id?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string | null;
          entity_name: string | null;
          client_id: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          entity_name?: string | null;
          client_id?: string | null;
          metadata?: Record<string, unknown>;
        };
        Update: {
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          entity_name?: string | null;
          client_id?: string | null;
          metadata?: Record<string, unknown>;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          agent_id: string;
          title: string;
          messages: unknown[];
          context_refs: unknown[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          agent_id: string;
          title: string;
          messages?: unknown[];
          context_refs?: unknown[];
        };
        Update: {
          title?: string;
          messages?: unknown[];
          context_refs?: unknown[];
        };
      };
      invite_tokens: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'member' | 'client';
          client_ids: string[];
          created_by: string;
          expires_at: string;
          used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: 'admin' | 'member' | 'client';
          client_ids?: string[];
          created_by: string;
          expires_at: string;
          used_at?: string | null;
        };
        Update: {
          email?: string;
          role?: 'admin' | 'member' | 'client';
          client_ids?: string[];
          expires_at?: string;
          used_at?: string | null;
        };
      };
    };
  };
};
