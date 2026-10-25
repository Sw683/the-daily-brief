-- ==============================================================================
-- THE DAILY BRIEF — POSTGRESQL & SUPABASE DATABASE SCHEMA
-- Production Schema with Relational Integrity, Performance Indexes, & Restrictive RLS
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CORE TABLES
-- ==============================================================================

-- A. Desk Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- B. Authorized News Sources (Feeds / Wires)
CREATE TABLE IF NOT EXISTS public.sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    feed_url TEXT UNIQUE NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    enabled BOOLEAN DEFAULT true,
    fetch_interval_minutes INTEGER DEFAULT 30,
    last_fetched_at TIMESTAMPTZ,
    last_status TEXT DEFAULT 'idle',
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- C. Articles
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content JSONB DEFAULT '[]'::jsonb, -- Array of paragraphs or structured blocks
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    source_id TEXT NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    original_url TEXT NOT NULL,
    canonical_url TEXT UNIQUE NOT NULL,
    image_url TEXT,
    image_caption TEXT,
    author TEXT,
    author_role TEXT,
    published_at TIMESTAMPTZ NOT NULL,
    collected_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
    featured BOOLEAN DEFAULT false,
    secondary BOOLEAN DEFAULT false,
    editor_pick BOOLEAN DEFAULT false,
    read_time TEXT DEFAULT '3 min read',
    tags JSONB DEFAULT '[]'::jsonb,
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- D. Reader & Staff Profiles (tied directly to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'reader' CHECK (role IN ('reader', 'editor', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- E. Reader Bookmarks (Personal Saved Reading List)
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id TEXT NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_article_bookmark UNIQUE(user_id, article_id)
);

-- F. Collection Execution Logs (Audit Trail for RSS Wire Ingestion)
CREATE TABLE IF NOT EXISTS public.collection_logs (
    id BIGSERIAL PRIMARY KEY,
    source_id TEXT REFERENCES public.sources(id) ON DELETE SET NULL,
    source_name TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
    items_found INTEGER DEFAULT 0,
    items_saved INTEGER DEFAULT 0,
    items_duplicate INTEGER DEFAULT 0,
    error_message TEXT
);

-- ==============================================================================
-- 3. HIGH-PERFORMANCE INDEXES
-- ==============================================================================

-- Public broadsheet filtering & sorting
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON public.articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category_status ON public.articles(category_id, status);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON public.articles(featured, published_at DESC) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_articles_canonical ON public.articles(canonical_url);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);

-- Sources & Feeds
CREATE INDEX IF NOT EXISTS idx_sources_enabled ON public.sources(enabled);

-- User Bookmarks
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id, created_at DESC);

-- Collection Logs
CREATE INDEX IF NOT EXISTS idx_collection_logs_started ON public.collection_logs(started_at DESC);

-- ==============================================================================
-- 4. SECURITY & AUTHORIZATION FUNCTIONS
-- ==============================================================================

-- Function to check if the current request is from an authorized Administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- Function to prevent non-admins from changing their own or other users' roles
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- If role is being changed and user is not an admin, forbid it
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        IF NOT public.is_admin() THEN
            RAISE EXCEPTION 'Unauthorized: Only administrators can modify user roles.';
        END IF;
    END IF;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_role();

-- Auto-create public.profiles record whenever a user signs up via OAuth or Magic Link
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            NEW.raw_user_meta_data->>'picture',
            ''
        ),
        'reader' -- Always defaults to 'reader', never elevated
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
        avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
        updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- A. Categories Policies
-- ------------------------------------------------------------------------------
-- Anyone (public/anon) can view categories
CREATE POLICY "Public categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

-- Only admins can modify categories
CREATE POLICY "Admins can insert categories" 
ON public.categories FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories" 
ON public.categories FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete categories" 
ON public.categories FOR DELETE USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- B. Sources Policies
-- ------------------------------------------------------------------------------
-- Anyone can view enabled sources for attribution; admins can view all
CREATE POLICY "Sources are viewable by public if enabled or by admin" 
ON public.sources FOR SELECT 
USING (enabled = true OR public.is_admin());

-- Only admins can manage sources
CREATE POLICY "Admins can insert sources" 
ON public.sources FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update sources" 
ON public.sources FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete sources" 
ON public.sources FOR DELETE USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- C. Articles Policies
-- ------------------------------------------------------------------------------
-- Public/anon can ONLY view 'approved' articles. Admins can view all (pending, rejected, archived).
CREATE POLICY "Public readers can only view approved articles" 
ON public.articles FOR SELECT 
USING (status = 'approved' OR public.is_admin());

-- Only admins or the backend service role can create, update, or delete articles
CREATE POLICY "Admins can insert articles" 
ON public.articles FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update articles" 
ON public.articles FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete articles" 
ON public.articles FOR DELETE USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- D. Profiles Policies
-- ------------------------------------------------------------------------------
-- Users can view their own profile; admins can view all profiles
CREATE POLICY "Users can view their own profile or admin can view all" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id OR public.is_admin());

-- Users can update only their own profile details (role protected by trigger)
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- E. Bookmarks Policies (Strict Reader Isolation)
-- ------------------------------------------------------------------------------
-- Readers can only view their own bookmarks
CREATE POLICY "Users can view their own bookmarks" 
ON public.bookmarks FOR SELECT 
USING (auth.uid() = user_id);

-- Readers can only create bookmarks for themselves
CREATE POLICY "Users can add their own bookmarks" 
ON public.bookmarks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Readers can only delete their own bookmarks
CREATE POLICY "Users can remove their own bookmarks" 
ON public.bookmarks FOR DELETE 
USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- F. Collection Logs Policies (Strict Operations Isolation)
-- ------------------------------------------------------------------------------
-- Only admins can view collection logs
CREATE POLICY "Only admins can view collection logs" 
ON public.collection_logs FOR SELECT 
USING (public.is_admin());

-- ==============================================================================
-- 6. INITIAL SEED DATA
-- ==============================================================================

-- Baseline Categories
INSERT INTO public.categories (id, name, slug, display_order) VALUES
('india', 'India', 'india', 1),
('world', 'World', 'world', 2),
('politics', 'Politics', 'politics', 3),
('business', 'Business', 'business', 4),
('technology', 'Technology', 'technology', 5),
('science', 'Science', 'science', 6),
('sports', 'Sports', 'sports', 7),
('entertainment', 'Entertainment', 'entertainment', 8)
ON CONFLICT (id) DO NOTHING;

-- Baseline Authorized RSS Sources
INSERT INTO public.sources (id, name, slug, url, feed_url, category_id, enabled, fetch_interval_minutes) VALUES
('bbc-world', 'BBC News', 'bbc-news', 'https://www.bbc.com/news', 'https://feeds.bbci.co.uk/news/world/rss.xml', 'world', true, 30),
('the-hindu-national', 'The Hindu', 'the-hindu', 'https://www.thehindu.com', 'https://www.thehindu.com/news/national/feeder/default.rss', 'india', true, 30),
('techcrunch-all', 'TechCrunch', 'techcrunch', 'https://techcrunch.com', 'https://techcrunch.com/feed/', 'technology', true, 30),
('phys-org-science', 'Phys.org', 'phys-org', 'https://phys.org', 'https://phys.org/rss-feed/science-news/', 'science', true, 45),
('npr-news', 'NPR News', 'npr-news', 'https://www.npr.org', 'https://feeds.npr.org/1001/rss.xml', 'world', true, 30)
ON CONFLICT (id) DO NOTHING;
