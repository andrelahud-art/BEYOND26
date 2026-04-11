/**
 * Service-role Supabase client. Bypasses RLS.
 *
 * !!! SERVER ONLY !!!
 * Never import this file from client components. It must only be used from
 * API routes, server actions, and trusted server contexts. It is the only
 * way to access admin tables (incidents, admin_actions, sos_alerts, etc.).
 */
import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

let cached: ReturnType<typeof createClient<Database>> | null = null;

export function createAdminClient() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase admin client missing env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  cached = createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}
