import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Article, NewsCategory } from '../types/news';

// Normalization mapping from various database category formats to frontend NewsCategory
const CATEGORY_MAP: Record<string, Exclude<NewsCategory, 'Home'>> = {
  india: 'India',
  world: 'World',
  politics: 'Politics',
  business: 'Business',
  technology: 'Technology',
  science: 'Science',
  sports: 'Sports',
  entertainment: 'Entertainment',
  India: 'India',
  World: 'World',
  Politics: 'Politics',
  Business: 'Business',
  Technology: 'Technology',
  Science: 'Science',
  Sports: 'Sports',
  Entertainment: 'Entertainment',
};

// Curated high-resolution fallback photography for dispatches missing an image URL
const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  India: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80',
  World: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  Politics: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
  Business: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  Science: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
  Sports: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
  Entertainment: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
};

export interface FetchArticlesOptions {
  category?: NewsCategory;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ArticleQueryResult {
  articles: Article[];
  totalCount: number;
  source: 'supabase' | 'express';
  error?: string | null;
}

/**
 * Transforms any raw database record (Supabase snake_case or Express SQLite camelCase)
 * into a strongly-typed Article interface.
 */
export function mapDatabaseArticleToArticle(record: any): Article {
  const categoryRaw = record.categories?.name || record.category || record.category_id || 'World';
  const category = (CATEGORY_MAP[categoryRaw] || CATEGORY_MAP[String(categoryRaw).toLowerCase()] || 'World') as Exclude<NewsCategory, 'Home'>;

  // Normalize content: array of strings or parse from JSON string
  let content: string[] = [];
  if (Array.isArray(record.content)) {
    content = record.content.map(String);
  } else if (typeof record.content === 'string') {
    try {
      const parsed = JSON.parse(record.content);
      content = Array.isArray(parsed) ? parsed.map(String) : [record.content];
    } catch {
      content = [record.content];
    }
  }
  if (content.length === 0 && record.summary) {
    content = [record.summary];
  }

  // Normalize tags: array of strings or parse from JSON string
  let tags: string[] = [];
  if (Array.isArray(record.tags)) {
    tags = record.tags.map(String);
  } else if (typeof record.tags === 'string') {
    try {
      const parsed = JSON.parse(record.tags);
      tags = Array.isArray(parsed) ? parsed.map(String) : [record.tags];
    } catch {
      tags = [category];
    }
  } else {
    tags = [category];
  }

  const imageUrl = record.image_url || record.imageUrl || FALLBACK_CATEGORY_IMAGES[category] || FALLBACK_CATEGORY_IMAGES['World'];

  return {
    id: String(record.id),
    slug: String(record.slug || record.id),
    title: String(record.title || '').trim(),
    summary: String(record.summary || '').trim(),
    content,
    category,
    sourceName: String(record.source_name || record.sourceName || 'Wire Dispatch'),
    sourceUrl: String(record.source_url || record.sourceUrl || '#'),
    articleUrl: String(record.original_url || record.articleUrl || record.canonical_url || '#'),
    canonicalUrl: record.canonical_url || record.canonicalUrl || undefined,
    imageUrl,
    imageCaption: record.image_caption || record.imageCaption || undefined,
    publishedAt: record.published_at || record.publishedAt || new Date().toISOString(),
    collectedAt: record.collected_at || record.collectedAt || undefined,
    author: record.author || undefined,
    authorRole: record.author_role || record.authorRole || undefined,
    status: record.status || 'approved',
    featured: Boolean(record.featured),
    secondary: Boolean(record.secondary),
    editorPick: Boolean(record.editor_pick || record.editorPick),
    readTime: record.read_time || record.readTime || '3 min read',
    tags,
    reviewedBy: record.reviewed_by || record.reviewedBy || undefined,
    reviewedAt: record.reviewed_at || record.reviewedAt || undefined,
    rejectionReason: record.rejection_reason || record.rejectionReason || undefined,
  };
}

/**
 * Deduplicates articles to prevent identical stories appearing multiple times.
 * Checks article id, canonicalUrl, and slug.
 */
export function deduplicateArticles(articles: Article[]): Article[] {
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  const seenSlugs = new Set<string>();
  const result: Article[] = [];

  for (const article of articles) {
    if (seenIds.has(article.id)) continue;
    if (article.slug && seenSlugs.has(article.slug)) continue;

    const urlKey = article.canonicalUrl || article.articleUrl;
    if (urlKey && urlKey !== '#' && seenUrls.has(urlKey)) continue;

    seenIds.add(article.id);
    if (article.slug) seenSlugs.add(article.slug);
    if (urlKey && urlKey !== '#') seenUrls.add(urlKey);

    result.push(article);
  }
  return result;
}

/**
 * Retrieves approved articles from Supabase with Row Level Security.
 */
async function fetchArticlesFromSupabase(options: FetchArticlesOptions = {}): Promise<ArticleQueryResult> {
  const { category, search, limit = 50, offset = 0 } = options;

  let query = supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .eq('status', 'approved');

  // Category filter: match either lowercase or exact casing
  if (category && category !== 'Home') {
    query = query.or(`category_id.eq.${category.toLowerCase()},category_id.eq.${category}`);
  }

  // Search filter across title and summary
  if (search && search.trim()) {
    const term = search.trim();
    query = query.or(`title.ilike.%${term}%,summary.ilike.%${term}%`);
  }

  // Ordering: Featured first, then Secondary, then chronologically by publication time
  query = query
    .order('featured', { ascending: false })
    .order('secondary', { ascending: false })
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('[ArticleService] Supabase query failed:', error);
    throw new Error(`[Supabase Error] ${error.message} (code: ${error.code || 'UNKNOWN'})`);
  }

  const rawArticles = data || [];
  const mapped = rawArticles.map(mapDatabaseArticleToArticle);
  const articles = deduplicateArticles(mapped);

  return {
    articles,
    totalCount: count ?? articles.length,
    source: 'supabase',
  };
}

/**
 * Fallback data provider: fetches approved articles from the Express/SQLite local server.
 */
async function fetchArticlesFromExpress(options: FetchArticlesOptions = {}): Promise<ArticleQueryResult> {
  const { category, search, limit = 50, offset = 0 } = options;

  const params = new URLSearchParams();
  if (category && category !== 'Home') {
    params.set('category', category);
  }
  if (search && search.trim()) {
    params.set('search', search.trim());
  }
  params.set('limit', String(limit));
  params.set('offset', String(offset));

  const url = `/api/articles?${params.toString()}`;

  let res: Response;
  try {
    res = await fetch(url);
  } catch (err: any) {
    console.error('[ArticleService] Express API network error:', err);
    throw new Error(
      `Cannot connect to local backend server (${err.message || 'Connection refused'}). ` +
      `Ensure "npm run server" is running on port 3001.`
    );
  }

  if (!res.ok) {
    let errMessage = `HTTP error ${res.status}: ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson.error || errJson.details) {
        errMessage = `${errJson.error}${errJson.details ? ` (${errJson.details})` : ''}`;
      }
    } catch {
      // ignore json parse errors
    }
    throw new Error(`[Express SQLite Error] ${errMessage}`);
  }

  const data = await res.json();
  if (!data.success || !Array.isArray(data.articles)) {
    throw new Error('[Express SQLite Error] Invalid response format received from server.');
  }

  const mapped = data.articles.map(mapDatabaseArticleToArticle);
  const articles = deduplicateArticles(mapped);

  return {
    articles,
    totalCount: data.totalCount ?? data.count ?? articles.length,
    source: 'express',
  };
}

/**
 * Public Data Access Layer API for The Daily Brief.
 * Automatically chooses Supabase if configured, otherwise falls back to Express/SQLite.
 * Errors are always preserved and thrown directly—never silently masked by mock data.
 */
export async function getPublishedArticles(options: FetchArticlesOptions = {}): Promise<ArticleQueryResult> {
  if (isSupabaseConfigured) {
    return fetchArticlesFromSupabase(options);
  } else {
    return fetchArticlesFromExpress(options);
  }
}

/**
 * Retrieves a single published article by its slug.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'approved')
      .maybeSingle();

    if (error) {
      console.error('[ArticleService] Supabase single story fetch error:', error);
      throw new Error(`[Supabase Error] ${error.message}`);
    }

    return data ? mapDatabaseArticleToArticle(data) : null;
  } else {
    try {
      const res = await fetch(`/api/articles/${encodeURIComponent(slug)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.success && data.article ? mapDatabaseArticleToArticle(data.article) : null;
    } catch (err: any) {
      console.error('[ArticleService] Express single story fetch error:', err);
      throw new Error(`[Express SQLite Error] ${err.message}`);
    }
  }
}

/**
 * Checks which active database backend is configured.
 */
export function getActiveDataSource(): 'supabase' | 'express' {
  return isSupabaseConfigured ? 'supabase' : 'express';
}
