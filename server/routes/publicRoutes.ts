import { Router, Request, Response } from 'express';
import { db } from '../db/database';

export const publicRouter = Router();

/**
 * GET /api/articles
 * Returns approved articles for the public newspaper broadsheet.
 */
publicRouter.get('/articles', (req: Request, res: Response) => {
  try {
    const { category, search, limit = '50', offset = '0' } = req.query;
    const limitNum = Math.min(parseInt(limit as string, 10) || 50, 100);
    const offsetNum = Math.max(parseInt(offset as string, 10) || 0, 0);

    let whereClause = ` WHERE status = 'approved'`;
    const whereParams: any[] = [];

    if (category && category !== 'Home') {
      whereClause += ` AND (category_id = ? OR LOWER(category_id) = LOWER(?))`;
      whereParams.push(category, category);
    }

    if (search && typeof search === 'string' && search.trim()) {
      whereClause += ` AND (title LIKE ? OR summary LIKE ? OR tags LIKE ?)`;
      const term = `%${search.trim()}%`;
      whereParams.push(term, term, term);
    }

    // Calculate total matching records for pagination
    const countQuery = `SELECT COUNT(*) as total FROM articles ${whereClause}`;
    const countRow = db.prepare(countQuery).get(...whereParams) as any;
    const totalCount = countRow ? Number(countRow.total) : 0;

    let query = `
      SELECT 
        id, slug, title, summary, content, category_id as category,
        source_id, source_name as sourceName, source_url as sourceUrl,
        original_url as articleUrl, canonical_url as canonicalUrl,
        image_url as imageUrl, image_caption as imageCaption,
        author, author_role as authorRole, published_at as publishedAt,
        featured, secondary, editor_pick as editorPick, read_time as readTime,
        tags
      FROM articles
      ${whereClause}
      ORDER BY featured DESC, secondary DESC, published_at DESC
      LIMIT ? OFFSET ?
    `;

    const queryParams = [...whereParams, limitNum, offsetNum];
    const rows = db.prepare(query).all(...queryParams) as any[];

    // Parse JSON fields
    const articles = rows.map((row) => ({
      ...row,
      featured: Boolean(row.featured),
      secondary: Boolean(row.secondary),
      editorPick: Boolean(row.editorPick),
      content: row.content ? JSON.parse(row.content) : [row.summary],
      tags: row.tags ? JSON.parse(row.tags) : [row.category],
    }));

    res.json({
      success: true,
      count: articles.length,
      totalCount,
      articles,
    });
  } catch (err: any) {
    console.error('[Public API] Error fetching articles:', err);
    res.status(500).json({ error: 'Failed to retrieve articles', details: err.message });
  }
});

/**
 * GET /api/articles/:slug
 * Retrieves full article details for single story reader.
 */
publicRouter.get('/articles/:slug', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const row = db.prepare(`
      SELECT 
        id, slug, title, summary, content, category_id as category,
        source_id, source_name as sourceName, source_url as sourceUrl,
        original_url as articleUrl, canonical_url as canonicalUrl,
        image_url as imageUrl, image_caption as imageCaption,
        author, author_role as authorRole, published_at as publishedAt,
        featured, secondary, editor_pick as editorPick, read_time as readTime,
        tags
      FROM articles
      WHERE slug = ? AND status = 'approved'
    `).get(slug) as any;

    if (!row) {
      res.status(404).json({ error: 'Article not found or not yet approved for publication' });
      return;
    }

    const article = {
      ...row,
      featured: Boolean(row.featured),
      secondary: Boolean(row.secondary),
      editorPick: Boolean(row.editorPick),
      content: row.content ? JSON.parse(row.content) : [row.summary],
      tags: row.tags ? JSON.parse(row.tags) : [row.category],
    };

    res.json({ success: true, article });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve article', details: err.message });
  }
});

/**
 * GET /api/categories
 */
publicRouter.get('/categories', (_req: Request, res: Response) => {
  try {
    const categories = db.prepare(`
      SELECT id, name, slug, display_order
      FROM categories
      ORDER BY display_order ASC
    `).all();
    res.json({ success: true, categories });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve categories', details: err.message });
  }
});

/**
 * GET /api/sources
 */
publicRouter.get('/sources', (_req: Request, res: Response) => {
  try {
    const sources = db.prepare(`
      SELECT id, name, slug, url, category_id, last_fetched_at
      FROM sources
      WHERE enabled = 1
      ORDER BY name ASC
    `).all();
    res.json({ success: true, sources });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve sources', details: err.message });
  }
});

/**
 * GET /api/health
 */
publicRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    edition: 'The Daily Brief Server',
    timestamp: new Date().toISOString(),
  });
});
