/**
 * Role-based guards for server components and route handlers.
 *
 * These are the *application-level* guards; RLS in Supabase is the *data-level*
 * guard. Both run. Defense in depth.
 */
import 'server-only';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { UserRole } from './constants';

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string | null;
  status: 'active' | 'suspended' | 'banned';
}

/**
 * Fetches the current authenticated user with our domain profile.
 * Returns null if there is no active session.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: row } = await supabase
    .from('users')
    .select('id, email, role, full_name, status')
    .eq('id', user.id)
    .single();

  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    role: row.role as UserRole,
    fullName: row.full_name,
    status: row.status as SessionUser['status'],
  };
}

/** Redirects to /auth/sign-in if not authenticated. */
export async function requireSession(
  redirectTo: string = '/auth/sign-in'
): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(redirectTo);
  if (user.status !== 'active') redirect('/auth/suspended');
  return user;
}

/** Redirects if the user doesn't have the required role. */
export async function requireRole(
  allowed: UserRole | UserRole[],
  fallback: string = '/'
): Promise<SessionUser> {
  const user = await requireSession();
  const list = Array.isArray(allowed) ? allowed : [allowed];
  if (!list.includes(user.role)) redirect(fallback);
  return user;
}

export function isAdmin(user: SessionUser | null): boolean {
  return user?.role === 'admin' || user?.role === 'ops';
}
