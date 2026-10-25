import { repository } from '../db/repository';
import { parseFeed } from './feedAdapter';

export interface CollectionSummary {
  sourcesProcessed: number;
  itemsFound: number;
  itemsSaved: number;
  itemsDuplicate: number;
  errors: string[];
  startedAt: string;
  completedAt: string;
}

// Memory lock to prevent overlapping collection jobs
let isCollecting = false;

export function isCollectionRunning(): boolean {
  return isCollecting;
}

/**
 * Executes a full news collection cycle across all enabled wire feeds.
 * Uses repository abstraction so it works seamlessly on Supabase PostgreSQL and SQLite.
 */
export async function runCollection(): Promise<CollectionSummary> {
  if (isCollecting) {
    throw new Error('A collection job is already in progress. Overlapping runs are prevented.');
  }

  isCollecting = true;
  const startedAt = new Date().toISOString();
  const summary: CollectionSummary = {
    sourcesProcessed: 0,
    itemsFound: 0,
    itemsSaved: 0,
    itemsDuplicate: 0,
    errors: [],
    startedAt,
    completedAt: '',
  };

  try {
    // 1. Fetch enabled sources via repository
    const sources = await repository.getEnabledSources();

    // 2. Iterate each source safely
    for (const source of sources) {
      const sourceStart = new Date().toISOString();
      summary.sourcesProcessed++;

      try {
        const feedResult = await parseFeed(source.feed_url);
        let sourceSaved = 0;
        let sourceDuplicate = 0;
        summary.itemsFound += feedResult.items.length;

        for (const item of feedResult.items) {
          // Check for canonical URL or exact title duplicates
          const isDuplicate = await repository.checkDuplicateArticle(item.canonicalUrl, item.title);
          if (isDuplicate) {
            summary.itemsDuplicate++;
            sourceDuplicate++;
            continue;
          }

          // Generate clean unique ID and slug
          const timestamp = Date.now().toString(36);
          const random = Math.random().toString(36).substring(2, 6);
          const articleId = `art-${timestamp}-${random}`;
          const cleanSlug = item.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 80) + `-${random}`;

          // Estimate read time from summary
          const wordCount = (item.summary || '').split(/\s+/).length + 150;
          const readMins = Math.max(1, Math.round(wordCount / 180));
          const readTime = `${readMins} min read`;

          // Format paragraphs for editorial viewer
          const paragraphs = [
            item.summary,
            `Reporting syndicated from ${source.name}. For complete verified dispatches and extended coverage, readers can refer directly to the publisher's official source wire.`
          ];

          const inserted = await repository.insertArticle({
            id: articleId,
            slug: cleanSlug,
            title: item.title,
            summary: item.summary,
            content: paragraphs,
            category_id: source.category_id || 'World',
            source_id: source.id,
            source_name: source.name,
            source_url: source.url,
            original_url: item.originalUrl,
            canonical_url: item.canonicalUrl,
            image_url: item.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
            image_caption: `Photo via ${source.name} syndicated wire`,
            author: item.author || source.name,
            published_at: item.publishedAt,
            collected_at: new Date().toISOString(),
            status: 'pending',
            featured: false,
            secondary: false,
            editor_pick: false,
            read_time: readTime,
            tags: item.tags || [source.category_id || 'World'],
          });

          if (inserted) {
            summary.itemsSaved++;
            sourceSaved++;
          }
        }

        const sourceEnd = new Date().toISOString();
        await repository.updateSourceFetchStatus(source.id, 'success', null);
        await repository.insertCollectionLog({
          source_id: source.id,
          source_name: source.name,
          started_at: sourceStart,
          completed_at: sourceEnd,
          status: 'success',
          items_found: feedResult.items.length,
          items_saved: sourceSaved,
          items_duplicate: sourceDuplicate,
          error_message: null,
        });
      } catch (err: any) {
        const errorMsg = err.message || String(err);
        const sourceEnd = new Date().toISOString();
        summary.errors.push(`${source.name}: ${errorMsg}`);

        await repository.updateSourceFetchStatus(source.id, 'failed', errorMsg);
        await repository.insertCollectionLog({
          source_id: source.id,
          source_name: source.name,
          started_at: sourceStart,
          completed_at: sourceEnd,
          status: 'failed',
          items_found: 0,
          items_saved: 0,
          items_duplicate: 0,
          error_message: errorMsg,
        });
      }
    }
  } finally {
    isCollecting = false;
    summary.completedAt = new Date().toISOString();
  }

  return summary;
}
