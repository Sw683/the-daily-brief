import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Retrieve Vite environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validation check
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.info(
    '[Supabase] Supabase credentials not detected or using placeholders. ' +
    'The Daily Brief is operating in local/hybrid mode with the Express SQLite database.'
  );
}

// Client instance with robust session persistence
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'the-daily-brief-auth-token',
    },
  }
);
