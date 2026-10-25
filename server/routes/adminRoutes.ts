import { Router, Request, Response } from 'express';
import { repository } from '../db/repository';
import { authenticateAdmin, requireAdmin } from '../services/authService';
import { runCollection, isCollectionRunning } from '../services/collector';
import { parseFeed } from '../services/feedAdapter';

export const adminRouter = Router();

/**
 * POST /api/admin/login
 * Public endpoint to verify admin credentials and receive JWT
 */
adminRouter.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password required' });
    return;
  }

  const auth = authenticateAdmin(username, password);
  if (!auth) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }

  res.json({
    success: true,
    token: auth.token,
    user: auth.user,
  });
});

// Enforce admin authorization on all routes below
adminRouter.use(requireAdmin);

/**
 * GET /api/admin/overview
 * Real-time counts of articles by status, sources, and latest collection time
 */
adminRouter.get('/overview', async (_req: Request, res: Response) => {
  try {
    const stats = await repository.getOverviewStats(isCollectionRunning());
    res.json({
      success: true,
      stats,
    });
  } catch (err: any) {
    console.error('[Admin API] Error in overview:', err);
    res.status(500).json({ error: 'Failed to retrieve overview stats', details: err.message });
  }
});

/**
 * GET /api/admin/articles
 * Filter articles by status, category, source, search
 */
adminRouter.get('/articles', async (req: Request, res: Response) => {
  try {
    const { status, category, source_id, search, limit = '100', offset = '0' } = req.query;
    const limitNum = Math.min(parseInt(limit as string, 10) || 100, 200);
    const offsetNum = Math.max(parseInt(offset as string, 10) || 0, 0);

    const result = await repository.getArticles({
      status: status as string,
      category: category as string,
      source_id: source_id as string,
      search: search as string,
      limit: limitNum,
      offset: offsetNum,
    });

    res.json({
      success: true,
      count: result.articles.length,
      totalCount: result.count,
      articles: result.articles,
    });
  } catch (err: any) {
    console.error('[Admin API] Error in articles:', err);
    res.status(500).json({ error: 'Failed to retrieve admin articles', details: err.message });
  }
});

/**
 * POST /api/admin/articles/:id/status
 * Approve, reject, or archive an article
 */
adminRouter.post('/articles/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, rejection_reason } = req.body;
    const adminUser = (req as any).adminUser;

    if (!['approved', 'rejected', 'archived', 'pending'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be pending, approved, rejected, or archived.' });
      return;
    }

    await repository.updateArticleStatus(id, status, adminUser?.username || 'admin', rejection_reason);
    res.json({ success: true, message: `Article status changed to ${status}` });
  } catch (err: any) {
    console.error('[Admin API] Error updating status:', err);
    res.status(500).json({ error: 'Failed to update article status', details: err.message });
  }
});

/**
 * PUT /api/admin/articles/:id
 * Edit article details (permitted summary, headline, category, featured)
 */
adminRouter.put('/articles/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, summary, category, featured, secondary, editorPick } = req.body;

    await repository.updateArticle(id, {
      title,
      summary,
      category,
      featured,
      secondary,
      editorPick,
    });

    res.json({ success: true, message: 'Article updated successfully' });
  } catch (err: any) {
    console.error('[Admin API] Error updating article:', err);
    res.status(500).json({ error: 'Failed to update article', details: err.message });
  }
});

/**
 * POST /api/admin/articles/bulk-status
 * Bulk status update
 */
adminRouter.post('/articles/bulk-status', async (req: Request, res: Response) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0 || !['approved', 'rejected', 'archived'].includes(status)) {
      res.status(400).json({ error: 'Invalid ids array or status' });
      return;
    }

    const adminUser = (req as any).adminUser;
    await repository.bulkUpdateArticleStatus(ids, status, adminUser?.username || 'admin');

    res.json({ success: true, message: `Updated ${ids.length} articles to ${status}` });
  } catch (err: any) {
    console.error('[Admin API] Error in bulk update:', err);
    res.status(500).json({ error: 'Bulk status update failed', details: err.message });
  }
});

/**
 * GET /api/admin/sources
 */
adminRouter.get('/sources', async (_req: Request, res: Response) => {
  try {
    const sources = await repository.getAllSources();
    res.json({ success: true, sources });
  } catch (err: any) {
    console.error('[Admin API] Error retrieving sources:', err);
    res.status(500).json({ error: 'Failed to retrieve sources', details: err.message });
  }
});

/**
 * POST /api/admin/sources
 * Add new news source
 */
adminRouter.post('/sources', async (req: Request, res: Response) => {
  try {
    const { name, url, feed_url, category_id, fetch_interval_minutes = 30 } = req.body;
    if (!name || !url || !feed_url || !category_id) {
      res.status(400).json({ error: 'Name, website URL, feed URL, and category are required' });
      return;
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + `-${Date.now().toString(36)}`;
    const slug = id;

    await repository.insertSource({
      id,
      name,
      slug,
      url,
      feed_url,
      category_id,
      fetch_interval_minutes,
    });

    res.json({ success: true, message: 'News source added successfully', sourceId: id });
  } catch (err: any) {
    console.error('[Admin API] Error adding source:', err);
    res.status(500).json({ error: 'Failed to add news source', details: err.message });
  }
});

/**
 * PUT /api/admin/sources/:id
 * Toggle source enabled or update details
 */
adminRouter.put('/sources/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { enabled, fetch_interval_minutes } = req.body;

    await repository.updateSource(id, { enabled, fetch_interval_minutes });
    res.json({ success: true, message: 'Source updated successfully' });
  } catch (err: any) {
    console.error('[Admin API] Error updating source:', err);
    res.status(500).json({ error: 'Failed to update source', details: err.message });
  }
});

/**
 * DELETE /api/admin/sources/:id
 */
adminRouter.delete('/sources/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await repository.deleteSource(id);
    res.json({ success: true, message: 'Source deleted' });
  } catch (err: any) {
    console.error('[Admin API] Error deleting source:', err);
    res.status(500).json({ error: 'Failed to delete source', details: err.message });
  }
});

/**
 * POST /api/admin/sources/test
 * Validates a feed URL live and returns count of valid parsed articles
 */
adminRouter.post('/sources/test', async (req: Request, res: Response) => {
  try {
    const { feed_url } = req.body;
    if (!feed_url) {
      res.status(400).json({ error: 'Feed URL is required' });
      return;
    }

    const result = await parseFeed(feed_url);
    res.json({
      success: true,
      title: result.title,
      description: result.description,
      itemsCount: result.items.length,
      sampleItems: result.items.slice(0, 3),
    });
  } catch (err: any) {
    res.status(400).json({ error: 'Feed test failed', details: err.message });
  }
});

/**
 * POST /api/admin/collect
 * Trigger manual collection
 */
adminRouter.post('/collect', async (_req: Request, res: Response) => {
  try {
    if (isCollectionRunning()) {
      res.status(409).json({ error: 'Collection is already in progress' });
      return;
    }

    const summary = await runCollection();
    res.json({ success: true, summary });
  } catch (err: any) {
    console.error('[Admin API] Collection failed:', err);
    res.status(500).json({ error: 'Collection failed', details: err.message });
  }
});

/**
 * GET /api/admin/logs
 */
adminRouter.get('/logs', async (_req: Request, res: Response) => {
  try {
    const logs = await repository.getCollectionLogs(50);
    res.json({ success: true, logs });
  } catch (err: any) {
    console.error('[Admin API] Error retrieving logs:', err);
    res.status(500).json({ error: 'Failed to retrieve logs', details: err.message });
  }
});
