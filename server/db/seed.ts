import { db } from './database';
import { MOCK_ARTICLES } from '../../src/data/mockArticles';

export function seedInitialData() {
  // 1. Seed Categories
  const categories = [
    { id: 'India', name: 'India', slug: 'india', display_order: 1 },
    { id: 'World', name: 'World', slug: 'world', display_order: 2 },
    { id: 'Politics', name: 'Politics', slug: 'politics', display_order: 3 },
    { id: 'Business', name: 'Business', slug: 'business', display_order: 4 },
    { id: 'Technology', name: 'Technology', slug: 'technology', display_order: 5 },
    { id: 'Science', name: 'Science', slug: 'science', display_order: 6 },
    { id: 'Sports', name: 'Sports', slug: 'sports', display_order: 7 },
    { id: 'Entertainment', name: 'Entertainment', slug: 'entertainment', display_order: 8 },
  ];

  const catInsert = db.prepare(`
    INSERT OR IGNORE INTO categories (id, name, slug, display_order)
    VALUES (?, ?, ?, ?)
  `);

  for (const c of categories) {
    catInsert.run(c.id, c.name, c.slug, c.display_order);
  }

  // 2. Seed Real Authorized Sources
  const initialSources = [
    {
      id: 'bbc-world',
      name: 'BBC News World',
      slug: 'bbc-news-world',
      url: 'https://www.bbc.com/news/world',
      feed_url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
      category_id: 'World',
      enabled: 1,
      fetch_interval_minutes: 30,
    },
    {
      id: 'the-hindu-national',
      name: 'The Hindu National',
      slug: 'the-hindu-national',
      url: 'https://www.thehindu.com/news/national/',
      feed_url: 'https://www.thehindu.com/news/national/feeder/default.rss',
      category_id: 'India',
      enabled: 1,
      fetch_interval_minutes: 30,
    },
    {
      id: 'techcrunch-main',
      name: 'TechCrunch',
      slug: 'techcrunch',
      url: 'https://techcrunch.com',
      feed_url: 'https://techcrunch.com/feed/',
      category_id: 'Technology',
      enabled: 1,
      fetch_interval_minutes: 30,
    },
    {
      id: 'phys-org-science',
      name: 'Phys.org Science News',
      slug: 'phys-org-science',
      url: 'https://phys.org',
      feed_url: 'https://phys.org/rss-feed/',
      category_id: 'Science',
      enabled: 1,
      fetch_interval_minutes: 30,
    },
    {
      id: 'npr-world',
      name: 'NPR News',
      slug: 'npr-news',
      url: 'https://www.npr.org',
      feed_url: 'https://feeds.npr.org/1001/rss.xml',
      category_id: 'World',
      enabled: 1,
      fetch_interval_minutes: 30,
    }
  ];

  const sourceInsert = db.prepare(`
    INSERT OR IGNORE INTO sources (
      id, name, slug, url, feed_url, category_id, enabled, fetch_interval_minutes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  for (const s of initialSources) {
    sourceInsert.run(
      s.id,
      s.name,
      s.slug,
      s.url,
      s.feed_url,
      s.category_id,
      s.enabled,
      s.fetch_interval_minutes,
      now,
      now
    );
  }

  // 3. Seed initial approved articles from Phase 1 if the table is currently empty
  const countRow = db.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number };
  if (countRow.count === 0) {
    console.log('[DB] Seeding curated baseline approved articles...');
    const articleInsert = db.prepare(`
      INSERT INTO articles (
        id, slug, title, summary, content, category_id, source_id,
        source_name, source_url, original_url, canonical_url,
        image_url, image_caption, author, author_role, published_at,
        collected_at, status, featured, secondary, editor_pick, read_time,
        tags, reviewed_by, reviewed_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, 'approved', ?, ?, ?, ?,
        ?, 'system', ?
      )
    `);

    for (const a of MOCK_ARTICLES) {
      // Find or assign matching source_id
      const sourceId = a.sourceName.toLowerCase().includes('hindu')
        ? 'the-hindu-national'
        : a.sourceName.toLowerCase().includes('bbc')
        ? 'bbc-world'
        : a.sourceName.toLowerCase().includes('techcrunch')
        ? 'techcrunch-main'
        : 'bbc-world';

      articleInsert.run(
        a.id,
        a.slug,
        a.title,
        a.summary,
        JSON.stringify(a.content),
        a.category,
        sourceId,
        a.sourceName,
        a.sourceUrl,
        a.articleUrl,
        a.articleUrl,
        a.imageUrl,
        a.imageCaption || '',
        a.author || '',
        a.authorRole || '',
        a.publishedAt,
        now,
        a.featured ? 1 : 0,
        a.secondary ? 1 : 0,
        a.editorPick ? 1 : 0,
        a.readTime,
        JSON.stringify(a.tags),
        now
      );
    }
    console.log(`[DB] Successfully seeded ${MOCK_ARTICLES.length} baseline approved articles.`);
  }
}
