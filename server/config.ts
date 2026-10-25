import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Validate security tokens in production
const jwtSecret = process.env.JWT_SECRET || '';
if (isProduction && (!jwtSecret || jwtSecret.length < 20 || jwtSecret.includes('change-in-production'))) {
  console.warn('[Security Warning] JWT_SECRET is not set to a secure secret in production. Please set JWT_SECRET in environment variables.');
}

const cronSecret = process.env.CRON_SECRET || '';
if (isProduction && (!cronSecret || cronSecret.includes('998877'))) {
  console.warn('[Security Warning] CRON_SECRET is not set to a secure secret in production. Please set CRON_SECRET in environment variables.');
}

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  databaseUrl: process.env.DATABASE_URL || 'data/newspaper.db',
  adminUsername: process.env.ADMIN_USERNAME || 'editor',
  adminPassword: process.env.ADMIN_PASSWORD || 'DailyBrief2026!',
  jwtSecret: jwtSecret || 'daily-brief-development-jwt-secret-key-2026',
  cronSecret: cronSecret || 'daily-brief-development-cron-secret-2026',
  autoCollectMinutes: parseInt(process.env.AUTO_COLLECT_MINUTES || '30', 10),
  supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || '',
};
