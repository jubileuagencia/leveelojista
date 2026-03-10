import { createServiceClient } from '@/lib/supabase/server';

interface SendNotificationParams {
  userId: string;
  title: string;
  body?: string;
  module: 'task' | 'document' | 'deliverable' | 'workflow' | 'calendar' | 'system';
  actionUrl?: string;
}

/**
 * Create a notification for a user. Uses service role client to bypass RLS.
 * Fails silently — notification creation should never break the main operation.
 */
export async function sendNotification(params: SendNotificationParams): Promise<void> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    if (!url.includes('supabase.co') && !url.includes('supabase.in')) {
      return; // Dev mode — skip
    }

    const supabase = await createServiceClient();
    await supabase.from('notifications').insert({
      user_id: params.userId,
      title: params.title,
      body: params.body ?? null,
      module: params.module,
      action_url: params.actionUrl ?? null,
      is_read: false,
    });
  } catch {
    // Silent fail
  }
}

/**
 * Send a notification to all members of the workspace (for broadcasts).
 */
export async function broadcastNotification(
  params: Omit<SendNotificationParams, 'userId'>
): Promise<void> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    if (!url.includes('supabase.co') && !url.includes('supabase.in')) {
      return;
    }

    const supabase = await createServiceClient();
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(50);

    if (!profiles?.length) return;

    const rows = profiles.map((p) => ({
      user_id: p.id,
      title: params.title,
      body: params.body ?? null,
      module: params.module,
      action_url: params.actionUrl ?? null,
      is_read: false,
    }));

    await supabase.from('notifications').insert(rows);
  } catch {
    // Silent fail
  }
}
