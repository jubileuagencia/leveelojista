import type {
  ClickUpSpace,
  ClickUpFolder,
  ClickUpList,
  ClickUpTask,
  ClickUpComment,
  GetTasksParams,
  GetTasksResponse,
  CreateTaskBody,
  UpdateTaskBody,
} from './types';

const BASE_URL = 'https://api.clickup.com/api/v2';
const TEAM_ID = '90133059528';

class ClickUpApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public rateLimited: boolean = false,
  ) {
    super(message);
    this.name = 'ClickUpApiError';
  }
}

async function request<T>(
  path: string,
  options?: RequestInit,
  retries = 2,
): Promise<T> {
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) throw new Error('CLICKUP_API_TOKEN not configured');

  const url = `${BASE_URL}${path}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    // Rate limit — wait and retry
    if (response.status === 429 && attempt < retries) {
      const retryAfter = parseInt(response.headers.get('retry-after') || '2', 10);
      await new Promise((r) => setTimeout(r, retryAfter * 1000));
      continue;
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new ClickUpApiError(
        response.status,
        `ClickUp API error ${response.status}: ${body}`,
        response.status === 429,
      );
    }

    return response.json();
  }

  throw new ClickUpApiError(429, 'Rate limited after retries', true);
}

export const clickupClient = {
  // Spaces
  async getSpaces(): Promise<ClickUpSpace[]> {
    const data = await request<{ spaces: ClickUpSpace[] }>(
      `/team/${TEAM_ID}/space?archived=false`
    );
    return data.spaces;
  },

  // Folders
  async getFolders(spaceId: string): Promise<ClickUpFolder[]> {
    const data = await request<{ folders: ClickUpFolder[] }>(
      `/space/${spaceId}/folder?archived=false`
    );
    return data.folders;
  },

  // Lists
  async getLists(folderId: string): Promise<ClickUpList[]> {
    const data = await request<{ lists: ClickUpList[] }>(
      `/folder/${folderId}/list?archived=false`
    );
    return data.lists;
  },

  async getFolderlessLists(spaceId: string): Promise<ClickUpList[]> {
    const data = await request<{ lists: ClickUpList[] }>(
      `/space/${spaceId}/list?archived=false`
    );
    return data.lists;
  },

  // Tasks
  async getTasks(params: GetTasksParams): Promise<GetTasksResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.subtasks) searchParams.set('subtasks', 'true');
    if (params.include_closed) searchParams.set('include_closed', 'true');
    if (params.statuses) {
      params.statuses.forEach((s) => searchParams.append('statuses[]', s));
    }
    if (params.assignees) {
      params.assignees.forEach((a) => searchParams.append('assignees[]', String(a)));
    }
    if (params.tags) {
      params.tags.forEach((t) => searchParams.append('tags[]', t));
    }

    const qs = searchParams.toString();
    return request<GetTasksResponse>(
      `/list/${params.listId}/task${qs ? `?${qs}` : ''}`
    );
  },

  async getTask(taskId: string): Promise<ClickUpTask> {
    return request<ClickUpTask>(`/task/${taskId}?include_subtasks=true`);
  },

  async createTask(listId: string, body: CreateTaskBody): Promise<ClickUpTask> {
    return request<ClickUpTask>(`/list/${listId}/task`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async updateTask(taskId: string, body: UpdateTaskBody): Promise<ClickUpTask> {
    return request<ClickUpTask>(`/task/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  // Comments
  async getComments(taskId: string): Promise<ClickUpComment[]> {
    const data = await request<{ comments: ClickUpComment[] }>(
      `/task/${taskId}/comment`
    );
    return data.comments;
  },

  async addComment(taskId: string, text: string): Promise<ClickUpComment> {
    return request<ClickUpComment>(`/task/${taskId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ comment_text: text }),
    });
  },
};
