import { createServiceClient } from '@/lib/supabase/server';
import type { ActivityAction } from '@/types';

interface LogActivityParams {
  userId: string;
  action: ActivityAction;
  entityType: 'task' | 'document' | 'client' | 'workflow' | 'agent' | 'system';
  entityId?: string | null;
  entityName?: string | null;
  clientId?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Log an activity. Uses service role client to bypass RLS.
 * Fails silently — logging should never break the main operation.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    if (!url.includes('supabase.co') && !url.includes('supabase.in')) {
      // Dev mode — skip DB insert
      return;
    }

    const supabase = await createServiceClient();
    await supabase.from('activity_logs').insert({
      user_id: params.userId,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId ?? null,
      entity_name: params.entityName ?? null,
      client_id: params.clientId ?? null,
      metadata: params.metadata ?? {},
    });
  } catch {
    // Silent fail — logging should not break operations
  }
}
