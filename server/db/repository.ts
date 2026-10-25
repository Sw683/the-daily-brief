import { db } from './database';
import { supabaseServer, isServerSupabaseConfigured } from './supabaseClient';
import type { OverviewStats } from '../../src/types/news';

export interface ArticleFilterOptions {
  status?: string;
  category?: string;
  source_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Universal Data Access Repository for The Daily Brief Backend.
 * Seamlessly abstracts operations across cloud Supabase (PostgreSQL) and local development (SQLite).
 */
export const repository = {
  isSupabase: isServerSupabaseConfigured,

  // ==========================================
  // ARTICLES
  // ==========================================

  async getArticles(options: ArticleFilterOptions = {}) {
    const { status, category, source_id, search, limit = 100, offset = 0 } = options;

    if (isServerSupabaseConfigured && supabaseServer) {
      let q = supabaseServer.from('articles').select('*', { count: 'exact' });

      if (status && status !== 'all') {
        q = q.eq('status', status as any);
      }
      if (category && category !== 'all') {
        q = q.or(`category_id.eq.${category.toLowerCase()},category_id.eq.${category}`);
      }
      if (source_id && source_id !== 'all') {
        q = q.eq('source_id', source_id);
      }
      if (search && search.trim()) {
        const term = search.trim();
        q = q.or(`title.ilike.%${term}%,summary.ilike.%${term}%`);
      }

      q = q.order('collected_at', { ascending: false }).range(offset, offset + limit - 1);

      const { data, count, error } = await q;
      if (error) throw new Error(`[Supabase Repository] getArticles failed: ${error.message}`);

      const articles = (data || []).map((row: any) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        category: row.category_id,
        source_id: row.source_id,
        sourceName: row.source_name,
        articleUrl: row.original_url,
        canonicalUrl: row.canonical_url,
        imageUrl: row.image_url,
        publishedAt: row.published_at,
        collectedAt: row.collected_at,
        status: row.status,
        featured: Boolean(row.featured),
        secondary: Boolean(row.secondary),
        editorPick: Boolean(row.editor_pick),
        readTime: row.read_time,
        tags: Array.isArray(row.tags) ? row.tags : [],
        reviewedBy: row.reviewed_by,
        reviewedAt: row.reviewed_at,
        rejectionReason: row.rejection_reason,
      }));

      return { articles, count: count ?? articles.length };
    }

    // Local SQLite Engine Fallback
    let whereClause = ' WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }
    if (category && category !== 'all') {
      whereClause += ' AND (category_id = ? OR LOWER(category_id) = LOWER(?))';
      params.push(category, category);
    }
    if (source_id && source_id !== 'all') {
      whereClause += ' AND source_id = ?';
      params.push(source_id);
    }
    if (search && search.trim()) {
      whereClause += ' AND (title LIKE ? OR summary LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    const countRow = db.prepare(`SELECT COUNT(*) as c FROM articles ${whereClause}`).get(...params) as any;
    const totalCount = countRow ? Number(countRow.c) : 0;

    const query = `
      SELECT 
        id, slug, title, summary, category_id as category,
        source_id, source_name as sourceName, original_url as articleUrl,
        canonical_url as canonicalUrl, image_url as imageUrl,
        published_at as publishedAt, collected_at as collectedAt,
        status, featured, secondary, editor_pick as editorPick,
        read_time as readTime, tags, reviewed_by as reviewedBy,
        reviewed_at as reviewedAt, rejection_reason as rejectionReason
      FROM articles
      ${whereClause}
      ORDER BY collected_at DESC
      LIMIT ? OFFSET ?
    `;

    const rows = db.prepare(query).all(...params, limit, offset) as any[];
    const articles = rows.map((row) => ({
      ...row,
      featured: Boolean(row.featured),
      secondary: Boolean(row.secondary),
      editorPick: Boolean(row.editorPick),
      tags: row.tags ? JSON.parse(row.tags) : [],
    }));

    return { articles, count: totalCount };
  },

  async updateArticleStatus(id: string, status: string, reviewedBy: string, rejectionReason?: string | null) {
    const now = new Date().toISOString();

    if (isServerSupabaseConfigured && supabaseServer) {
      const { error } = await supabaseServer.from('articles').update({
        status: status as any,
        reviewed_by: reviewedBy,
        reviewed_at: now,
        rejection_reason: rejectionReason || null,
        updated_at: now,
      }).eq('id', id);

      if (error) throw new Error(`[Supabase Repository] updateArticleStatus failed: ${error.message}`);
      return;
    }

    const stmt = db.prepare(`
      UPDATE articles
      SET status = ?, reviewed_by = ?, reviewed_at = ?, rejection_reason = ?
      WHERE id = ?
    `);
    stmt.run(status, reviewedBy, now, rejectionReason || null, id);
  },

  async bulkUpdateArticleStatus(ids: string[], status: string, reviewedBy: string) {
    const now = new Date().toISOString();

    if (isServerSupabaseConfigured && supabaseServer) {
      const { error } = await supabaseServer.from('articles').update({
        status: status as any,
        reviewed_by: reviewedBy,
        reviewed_at: now,
        updated_at: now,
      }).in('id', ids);

      if (error) throw new Error(`[Supabase Repository] bulkUpdateArticleStatus failed: ${error.message}`);
      return;
    }

    const stmt = db.prepare(`
      UPDATE articles
      SET status = ?, reviewed_by = ?, reviewed_at = ?
      WHERE id = ?
    `);
    for (const id of ids) {
      stmt.run(status, reviewedBy, now, id);
    }
  },

  async updateArticle(id: string, updates: {
    title?: string;
    summary?: string;
    category?: string;
    featured?: boolean;
    secondary?: boolean;
    editorPick?: boolean;
  }) {
    if (isServerSupabaseConfigured && supabaseServer) {
      const payload: any = { updated_at: new Date().toISOString() };
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.summary !== undefined) payload.summary = updates.summary;
      if (updates.category !== undefined) payload.category_id = updates.category.toLowerCase();
      if (updates.featured !== undefined) payload.featured = updates.featured;
      if (updates.secondary !== undefined) payload.secondary = updates.secondary;
      if (updates.editorPick !== undefined) payload.editor_pick = updates.editorPick;

      const { error } = await supabaseServer.from('articles').update(payload).eq('id', id);
      if (error) throw new Error(`[Supabase Repository] updateArticle failed: ${error.message}`);
      return;
    }

    const stmt = db.prepare(`
      UPDATE articles
      SET 
        title = COALESCE(?, title),
        summary = COALESCE(?, summary),
        category_id = COALESCE(?, category_id),
        featured = COALESCE(?, featured),
        secondary = COALESCE(?, secondary),
        editor_pick = COALESCE(?, editor_pick)
      WHERE id = ?
    `);
    stmt.run(
      updates.title ?? null,
      updates.summary ?? null,
      updates.category ?? null,
      updates.featured !== undefined ? (updates.featured ? 1 : 0) : null,
      updates.secondary !== undefined ? (updates.secondary ? 1 : 0) : null,
      updates.editorPick !== undefined ? (updates.editorPick ? 1 : 0) : null,
      id
    );
  },

  async checkDuplicateArticle(canonicalUrl: string, title: string): Promise<boolean> {
    if (isServerSupabaseConfigured && supabaseServer) {
      const { data, error } = await supabaseServer.from('articles')
        .select('id')
        .or(`canonical_url.eq."${canonicalUrl}",title.eq."${title.replace(/"/g, '\\"')}"`)
        .limit(1);

      if (error) return false;
      return Boolean(data && data.length > 0);
    }

    const row = db.prepare(`
      SELECT id FROM articles WHERE canonical_url = ? OR title = ?
    `).get(canonicalUrl, title);
    return Boolean(row);
  },

  async insertArticle(article: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    content: string[];
    category_id: string;
    source_id: string;
    source_name: string;
    source_url: string;
    original_url: string;
    canonical_url: string;
    image_url?: string;
    image_caption?: string;
    author?: string;
    published_at: string;
    collected_at: string;
    status: 'pending' | 'approved';
    featured: boolean;
    secondary: boolean;
    editor_pick: boolean;
    read_time: string;
    tags: string[];
  }): Promise<boolean> {
    if (isServerSupabaseConfigured && supabaseServer) {
      const { error } = await supabaseServer.from('articles').insert({
        id: article.id,
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        content: article.content,
        category_id: article.category_id.toLowerCase(),
        source_id: article.source_id,
        source_name: article.source_name,
        source_url: article.source_url,
        original_url: article.original_url,
        canonical_url: article.canonical_url,
        image_url: article.image_url || null,
        image_caption: article.image_caption || null,
        author: article.author || null,
        published_at: article.published_at,
        collected_at: article.collected_at,
        status: article.status,
        featured: article.featured,
        secondary: article.secondary,
        editor_pick: article.editor_pick,
        read_time: article.read_time,
        tags: article.tags,
      });

      if (error) {
        console.error('[Supabase Repository] insertArticle error:', error);
        return false;
      }
      return true;
    }

    try {
      const stmt = db.prepare(`
        INSERT INTO articles (
          id, slug, title, summary, content, category_id, source_id,
          source_name, source_url, original_url, canonical_url,
          image_url, image_caption, author, published_at, collected_at,
          status, featured, secondary, editor_pick, read_time, tags
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?
        )
      `);
      stmt.run(
        article.id,
        article.slug,
        article.title,
        article.summary,
        JSON.stringify(article.content),
        article.category_id,
        article.source_id,
        article.source_name,
        article.source_url,
        article.original_url,
        article.canonical_url,
        article.image_url || null,
        article.image_caption || null,
        article.author || null,
        article.published_at,
        article.collected_at,
        article.status,
        article.featured ? 1 : 0,
        article.secondary ? 1 : 0,
        article.editor_pick ? 1 : 0,
        article.read_time,
        JSON.stringify(article.tags)
      );
      return true;
    } catch {
      return false;
    }
  },

  // ==========================================
  // SOURCES
  // ==========================================

  async getEnabledSources() {
    if (isServerSupabaseConfigured && supabaseServer) {
      const { data, error } = await supabaseServer.from('sources').select('*').eq('enabled', true);
      if (error) throw new Error(error.message);
      return data || [];
    }

    return db.prepare(`
      SELECT id, name, slug, url, feed_url, category_id
      FROM sources
      WHERE enabled = 1
    `).all() as any[];
  },

  async getAllSources() {
    if (isServerSupabaseConfigured && supabaseServer) {
      const { data, error } = await supabaseServer.from('sources').select('*, categories(name)').order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []).map((s: any) => ({
        ...s,
        category_name: s.categories?.name,
      }));
    }

    return db.prepare(`
      SELECT s.*, c.name as category_name
      FROM sources s
      LEFT JOIN categories c ON s.category_id = c.id
      ORDER BY s.created_at DESC
    `).all() as any[];
  },

  async updateSourceFetchStatus(id: string, status: 'success' | 'failed', error?: string | null) {
    const now = new Date().toISOString();

    if (isServerSupabaseConfigured && supabaseServer) {
      await supabaseServer.from('sources').update({
        last_fetched_at: now,
        last_status: status,
        last_error: error || null,
        updated_at: now,
      }).eq('id', id);
      return;
    }

    if (status === 'success') {
      db.prepare(`
        UPDATE sources
        SET last_fetched_at = ?, last_status = 'success', error_count = 0, last_error = NULL, updated_at = ?
        WHERE id = ?
      `).run(now, now, id);
    } else {
      db.prepare(`
        UPDATE sources
        SET last_fetched_at = ?, last_status = 'failed', error_count = error_count + 1, last_error = ?, updated_at = ?
        WHERE id = ?
      `).run(now, error || null, now, id);
    }
  },

  async insertSource(source: {
    id: string;
    name: string;
    slug: string;
    url: string;
    feed_url: string;
    category_id: string;
    fetch_interval_minutes: number;
  }) {
    const now = new Date().toISOString();

    if (isServerSupabaseConfigured && supabaseServer) {
      const { error } = await supabaseServer.from('sources').insert({
        id: source.id,
        name: source.name,
        slug: source.slug,
        url: source.url,
        feed_url: source.feed_url,
        category_id: source.category_id.toLowerCase(),
        fetch_interval_minutes: source.fetch_interval_minutes,
        enabled: true,
        last_status: 'idle',
        error_count: 0,
        created_at: now,
        updated_at: now,
      });
      if (error) throw new Error(error.message);
      return;
    }

    db.prepare(`
      INSERT INTO sources (id, name, slug, url, feed_url, category_id, enabled, fetch_interval_minutes, last_status, error_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, 'idle', 0, ?, ?)
    `).run(source.id, source.name, source.slug, source.url, source.feed_url, source.category_id, source.fetch_interval_minutes, now, now);
  },

  async updateSource(id: string, updates: { enabled?: boolean; fetch_interval_minutes?: number }) {
    const now = new Date().toISOString();

    if (isServerSupabaseConfigured && supabaseServer) {
      const payload: any = { updated_at: now };
      if (updates.enabled !== undefined) payload.enabled = updates.enabled;
      if (updates.fetch_interval_minutes !== undefined) payload.fetch_interval_minutes = updates.fetch_interval_minutes;

      const { error } = await supabaseServer.from('sources').update(payload).eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    db.prepare(`
      UPDATE sources
      SET 
        enabled = COALESCE(?, enabled),
        fetch_interval_minutes = COALESCE(?, fetch_interval_minutes),
        updated_at = ?
      WHERE id = ?
    `).run(
      updates.enabled !== undefined ? (updates.enabled ? 1 : 0) : null,
      updates.fetch_interval_minutes !== undefined ? updates.fetch_interval_minutes : null,
      now,
      id
    );
  },

  async deleteSource(id: string) {
    if (isServerSupabaseConfigured && supabaseServer) {
      const { error } = await supabaseServer.from('sources').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    db.prepare('DELETE FROM sources WHERE id = ?').run(id);
  },

  // ==========================================
  // COLLECTION LOGS
  // ==========================================

  async insertCollectionLog(log: {
    source_id?: string;
    source_name?: string;
    started_at: string;
    completed_at?: string;
    status: 'success' | 'failed' | 'partial';
    items_found: number;
    items_saved: number;
    items_duplicate: number;
    error_message?: string | null;
  }) {
    if (isServerSupabaseConfigured && supabaseServer) {
      await supabaseServer.from('collection_logs').insert({
        source_id: log.source_id || null,
        source_name: log.source_name || null,
        started_at: log.started_at,
        completed_at: log.completed_at || null,
        status: log.status,
        items_found: log.items_found,
        items_saved: log.items_saved,
        items_duplicate: log.items_duplicate,
        error_message: log.error_message || null,
      });
      return;
    }

    db.prepare(`
      INSERT INTO collection_logs (
        source_id, source_name, started_at, completed_at, status,
        items_found, items_saved, items_duplicate, error_message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      log.source_id || null,
      log.source_name || null,
      log.started_at,
      log.completed_at || null,
      log.status,
      log.items_found,
      log.items_saved,
      log.items_duplicate,
      log.error_message || null
    );
  },

  async getCollectionLogs(limit = 50) {
    if (isServerSupabaseConfigured && supabaseServer) {
      const { data, error } = await supabaseServer.from('collection_logs').select('*').order('started_at', { ascending: false }).limit(limit);
      if (error) throw new Error(error.message);
      return data || [];
    }

    return db.prepare(`
      SELECT * FROM collection_logs ORDER BY started_at DESC LIMIT ?
    `).all(limit) as any[];
  },

  // ==========================================
  // OVERVIEW STATS
  // ==========================================

  async getOverviewStats(isCollecting: boolean): Promise<OverviewStats> {
    if (isServerSupabaseConfigured && supabaseServer) {
      const [
        totalRes,
        pendingRes,
        approvedRes,
        rejectedRes,
        archivedRes,
        totalSourcesRes,
        activeSourcesRes,
        latestLogRes,
      ] = await Promise.all([
        supabaseServer.from('articles').select('*', { count: 'exact', head: true }),
        supabaseServer.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabaseServer.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabaseServer.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
        supabaseServer.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'archived'),
        supabaseServer.from('sources').select('*', { count: 'exact', head: true }),
        supabaseServer.from('sources').select('*', { count: 'exact', head: true }).eq('enabled', true),
        supabaseServer.from('collection_logs').select('completed_at, status').order('id', { ascending: false }).limit(1),
      ]);

      const latestLog = latestLogRes.data && latestLogRes.data[0];

      return {
        totalArticles: totalRes.count || 0,
        pendingArticles: pendingRes.count || 0,
        approvedArticles: approvedRes.count || 0,
        rejectedArticles: rejectedRes.count || 0,
        archivedArticles: archivedRes.count || 0,
        totalSources: totalSourcesRes.count || 0,
        activeSources: activeSourcesRes.count || 0,
        lastCollectionTime: latestLog?.completed_at || null,
        lastCollectionStatus: latestLog?.status || 'none',
        isCollectionRunning: isCollecting,
      };
    }

    // SQLite
    const totalArticles = (db.prepare('SELECT COUNT(*) as c FROM articles').get() as any).c;
    const pendingArticles = (db.prepare("SELECT COUNT(*) as c FROM articles WHERE status = 'pending'").get() as any).c;
    const approvedArticles = (db.prepare("SELECT COUNT(*) as c FROM articles WHERE status = 'approved'").get() as any).c;
    const rejectedArticles = (db.prepare("SELECT COUNT(*) as c FROM articles WHERE status = 'rejected'").get() as any).c;
    const archivedArticles = (db.prepare("SELECT COUNT(*) as c FROM articles WHERE status = 'archived'").get() as any).c;
    const activeSources = (db.prepare('SELECT COUNT(*) as c FROM sources WHERE enabled = 1').get() as any).c;
    const totalSources = (db.prepare('SELECT COUNT(*) as c FROM sources').get() as any).c;
    const latestLog = db.prepare('SELECT completed_at, status FROM collection_logs ORDER BY id DESC LIMIT 1').get() as any;

    return {
      totalArticles,
      pendingArticles,
      approvedArticles,
      rejectedArticles,
      archivedArticles,
      activeSources,
      totalSources,
      lastCollectionTime: latestLog?.completed_at || null,
      lastCollectionStatus: latestLog?.status || 'none',
      isCollectionRunning: isCollecting,
    };
  },
};
