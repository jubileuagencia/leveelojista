// ClickUp API v2 Types

export interface ClickUpSpace {
  id: string;
  name: string;
  private: boolean;
  statuses: ClickUpStatus[];
}

export interface ClickUpFolder {
  id: string;
  name: string;
  space: { id: string };
  lists: ClickUpList[];
}

export interface ClickUpList {
  id: string;
  name: string;
  folder?: { id: string; name: string };
  space: { id: string };
  statuses: ClickUpStatus[];
  task_count?: number;
}

export interface ClickUpStatus {
  id?: string;
  status: string;
  color: string;
  type: string;
  orderindex: number;
}

export interface ClickUpTask {
  id: string;
  custom_id: string | null;
  name: string;
  text_content: string | null;
  description: string | null;
  status: {
    status: string;
    color: string;
    type: string;
  };
  priority: {
    id: string;
    priority: string;
    color: string;
  } | null;
  assignees: ClickUpAssignee[];
  tags: ClickUpTag[];
  due_date: string | null;
  start_date: string | null;
  date_created: string;
  date_updated: string;
  date_closed: string | null;
  creator: { id: number; username: string };
  list: { id: string; name: string };
  folder: { id: string; name: string };
  space: { id: string };
  url: string;
  checklists: ClickUpChecklist[];
  custom_fields?: ClickUpCustomField[];
  points?: number;
}

export interface ClickUpAssignee {
  id: number;
  username: string;
  color: string | null;
  initials: string;
  email: string;
  profilePicture: string | null;
}

export interface ClickUpTag {
  name: string;
  tag_fg: string;
  tag_bg: string;
}

export interface ClickUpChecklist {
  id: string;
  name: string;
  resolved: number;
  unresolved: number;
  items: ClickUpChecklistItem[];
}

export interface ClickUpChecklistItem {
  id: string;
  name: string;
  resolved: boolean;
  assignee: ClickUpAssignee | null;
  orderindex: number;
}

export interface ClickUpComment {
  id: string;
  comment_text: string;
  user: {
    id: number;
    username: string;
    email: string;
    profilePicture: string | null;
    initials: string;
  };
  date: string;
}

export interface ClickUpCustomField {
  id: string;
  name: string;
  type: string;
  value: unknown;
  type_config?: Record<string, unknown>;
}

// API Request/Response types

export interface GetTasksParams {
  listId: string;
  statuses?: string[];
  assignees?: number[];
  tags?: string[];
  page?: number;
  subtasks?: boolean;
  include_closed?: boolean;
}

export interface CreateTaskBody {
  name: string;
  description?: string;
  assignees?: number[];
  priority?: number; // 1=urgent, 2=high, 3=normal, 4=low
  due_date?: number; // unix ms
  status?: string;
  tags?: string[];
}

export interface UpdateTaskBody {
  name?: string;
  description?: string;
  assignees?: { add?: number[]; rem?: number[] };
  priority?: number;
  due_date?: number;
  status?: string;
}

export interface GetTasksResponse {
  tasks: ClickUpTask[];
  last_page: boolean;
}
