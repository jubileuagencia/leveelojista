'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  // Update last_login_at
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);
  }

  redirect('/dashboard');
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;
  const inviteToken = formData.get('invite_token') as string | null;

  // Validate invite token if provided
  if (inviteToken) {
    const { data: invite } = await supabase
      .from('invite_tokens')
      .select('*')
      .eq('id', inviteToken)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (!invite) {
      return { error: 'Convite invalido ou expirado.' };
    }

    if (invite.email !== email) {
      return { error: 'Este convite pertence a outro email.' };
    }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Mark invite as used
  if (inviteToken) {
    await supabase
      .from('invite_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', inviteToken);
  }

  return { success: 'Verifique seu email para confirmar a conta.' };
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}
