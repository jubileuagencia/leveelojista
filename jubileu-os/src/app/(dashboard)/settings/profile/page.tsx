import { requireAuth } from '@/lib/auth';
import { ProfileForm } from '@/components/features/settings/profile-form';

export default async function ProfilePage() {
  const user = await requireAuth();

  return <ProfileForm user={user} />;
}
