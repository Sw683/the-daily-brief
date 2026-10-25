-- ========================================================
-- The Daily Brief — Database Schema & Migrations
-- Compatible with SQLite and PostgreSQL / Supabase
-- ========================================================

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- 2. News Sources Table
CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  feed_url TEXT UNIQUE NOT NULL,
  category_id TEXT REFERENCES categories(id),
  enabled INTEGER DEFAULT 1,
  fetch_interval_minutes INTEGER DEFAULT 30,
  last_fetched_at TEXT,
  last_status TEXT DEFAULT 'idle',
  error_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 3. Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT, -- JSON array of paragraphs
  category_id TEXT NOT NULL REFERENCES categories(id),
  source_id TEXT NOT NULL REFERENCES sources(id),
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  original_url TEXT NOT NULL,
  canonical_url TEXT UNIQUE NOT NULL,
  image_url TEXT,
  image_caption TEXT,
  author TEXT,
  author_role TEXT,
  published_at TEXT NOT NULL,
  collected_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'archived'
  featured INTEGER DEFAULT 0,
  secondary INTEGER DEFAULT 0,
  editor_pick INTEGER DEFAULT 0,
  read_time TEXT DEFAULT '3 min read',
  tags TEXT, -- JSON array of tags
  reviewed_by TEXT,
  reviewed_at TEXT,
  rejection_reason TEXT
);

-- 4. Collection Execution Logs Table
CREATE TABLE IF NOT EXISTS collection_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id TEXT REFERENCES sources(id),
  source_name TEXT,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  status TEXT NOT NULL, -- 'success', 'failed', 'partial'
  items_found INTEGER DEFAULT 0,
  items_saved INTEGER DEFAULT 0,
  items_duplicate INTEGER DEFAULT 0,
  error_message TEXT
);

-- 5. Admin Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TEXT NOT NULL
);

-- Indexes for high-performance querying
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_canonical ON articles(canonical_url);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured, status);
CREATE INDEX IF NOT EXISTS idx_sources_enabled ON sources(enabled);
CREATE INDEX IF NOT EXISTS idx_logs_started ON collection_logs(started_at DESC);
