import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/types/database';
import { config } from '../config';

// Server-side Supabase credentials
// On backend server, prefer the privileged service role key (bypasses RLS for automated wire collectors and admin management)
// If service role key is not provided, fall back to anon key
const supabaseUrl = config.supabaseUrl;
const supabaseKey = config.supabaseServiceRoleKey || config.supabaseAnonKey;

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

if (isServerSupabaseConfigured) {
  console.log('[Supabase Server] Connected to cloud PostgreSQL instance:', supabaseUrl);
} else {
  console.log('[Supabase Server] No credentials detected. Server running in local SQLite engine mode.');
}

export const supabaseServer = isServerSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;
