import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { UserList } from '@/components/features/users/user-list';
import type { Profile } from '@/types';

export default async function UsersPage() {
  const currentUser = await requireRole('admin');
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <UserList
      initialUsers={(users as Profile[]) || []}
      currentUserId={currentUser.id}
    />
  );
}
