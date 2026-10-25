import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/database';
import { seedInitialData } from './db/seed';
import { publicRouter } from './routes/publicRoutes';
import { adminRouter } from './routes/adminRoutes';
import { cronRouter } from './routes/cronRoutes';
import { isServerSupabaseConfigured } from './db/supabaseClient';

export const app = express();

// Standard middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// In local mode without Supabase, initialize SQLite tables and baseline seed data
if (!isServerSupabaseConfigured) {
  try {
    initDatabase();
    seedInitialData();
  } catch (err: any) {
    console.warn('[DB] SQLite init check:', err.message);
  }
}

// Mount API routes
app.use('/api', publicRouter);
app.use('/api/admin', adminRouter);
app.use('/api/cron', cronRouter);

export default app;
