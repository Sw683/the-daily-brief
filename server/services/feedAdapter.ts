import Parser from 'rss-parser';

export interface ParsedFeedItem {
  title: string;
  originalUrl: string;
  canonicalUrl: string;
  summary: string;
  publishedAt: string;
  imageUrl?: string;
  author?: string;
  tags?: string[];
}

export interface FeedParseResult {
  title?: string;
  description?: string;
  link?: string;
  items: ParsedFeedItem[];
}

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'creator'],
    ],
  },
  timeout: 12000,
  headers: {
    'User-Agent': 'TheDailyBrief/2.0 (Editorial News Aggregator; +https://thedailybrief.news/about)',
    'Accept': 'application/rss+xml, application/atom+xml, text/xml, application/xml;q=0.9, */*;q=0.8',
  },
});

/**
 * Normalizes a URL by stripping tracking params (UTM, ref, fbclid)
 * and normalizing protocol/slashes to enable reliable deduplication.
 */
export function normalizeCanonicalUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl.trim());
    
    // Strip common tracking parameters
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'ref', 'fbclid', 'gclid', 'mc_cid', 'mc_eid', 'ncid', 'ocid'
    ];
    for (const param of trackingParams) {
      parsed.searchParams.delete(param);
    }

    // Standardize path: remove trailing slash (unless root)
    let pathname = parsed.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    const search = parsed.searchParams.toString();
    return `${parsed.protocol}//${parsed.hostname.toLowerCase()}${pathname}${search ? '?' + search : ''}`;
  } catch {
    return rawUrl.trim();
  }
}

/**
 * Clean HTML markup and extract a permitted, concise editorial snippet.
 * Never stores full copyrighted articles.
 */
export function extractPermittedSummary(rawHtmlOrText: string, maxLen = 300): string {
  if (!rawHtmlOrText) return '';

  // Remove scripts, styles, HTML tags
  let cleaned = rawHtmlOrText
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.length > maxLen) {
    // Break at word boundary
    const lastSpace = cleaned.lastIndexOf(' ', maxLen);
    cleaned = cleaned.slice(0, lastSpace > 100 ? lastSpace : maxLen) + '…';
  }

  return cleaned;
}

/**
 * Extract image URL from enclosure, media tags, or inline html
 */
function extractImageUrl(item: any): string | undefined {
  // 1. Enclosure check (e.g. RSS podcast or image enclosure)
  if (item.enclosure?.url && (item.enclosure.type?.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif)/i.test(item.enclosure.url))) {
    return item.enclosure.url;
  }

  // 2. Media content
  if (Array.isArray(item.mediaContent)) {
    const imgObj = item.mediaContent.find((m: any) => m?.$?.url && (!m.$.medium || m.$.medium === 'image'));
    if (imgObj?.$?.url) return imgObj.$.url;
  } else if (item.mediaContent?.$?.url) {
    return item.mediaContent.$.url;
  }

  // 3. Media thumbnail
  if (Array.isArray(item.mediaThumbnail)) {
    const thumb = item.mediaThumbnail[0]?.$?.url;
    if (thumb) return thumb;
  } else if (item.mediaThumbnail?.$?.url) {
    return item.mediaThumbnail.$.url;
  }

  // 4. Look for <img> src in content:encoded or description
  const content = item.contentEncoded || item.content || item.description || '';
  const match = content.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
  if (match && match[1]) {
    return match[1];
  }

  return undefined;
}

/**
 * Fetches and parses an RSS or Atom feed.
 */
export async function parseFeed(feedUrl: string): Promise<FeedParseResult> {
  try {
    const feed = await parser.parseURL(feedUrl);
    const parsedItems: ParsedFeedItem[] = [];

    for (const item of feed.items || []) {
      if (!item.title || !item.link) continue;

      const rawSummary = item.contentSnippet || item.summary || item.description || '';
      const summary = extractPermittedSummary(rawSummary);
      const canonicalUrl = normalizeCanonicalUrl(item.link);
      const imageUrl = extractImageUrl(item);

      // Parse published date or fallback to now
      let publishedAt: string;
      try {
        const d = item.isoDate || item.pubDate;
        publishedAt = d ? new Date(d).toISOString() : new Date().toISOString();
      } catch {
        publishedAt = new Date().toISOString();
      }

      const tags: string[] = [];
      if (Array.isArray(item.categories)) {
        for (const cat of item.categories) {
          if (typeof cat === 'string') tags.push(cat.trim());
          else if (cat?._) tags.push(cat._.trim());
        }
      }

      parsedItems.push({
        title: item.title.trim(),
        originalUrl: item.link.trim(),
        canonicalUrl,
        summary,
        publishedAt,
        imageUrl,
        author: item.creator || item.author || undefined,
        tags: tags.slice(0, 5),
      });
    }

    return {
      title: feed.title,
      description: feed.description,
      link: feed.link,
      items: parsedItems,
    };
  } catch (err: any) {
    throw new Error(`Feed parse failed for "${feedUrl}": ${err.message || err}`);
  }
}
