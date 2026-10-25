export type NewsCategory = 
  | 'Home'
  | 'India'
  | 'World'
  | 'Politics'
  | 'Business'
  | 'Technology'
  | 'Science'
  | 'Sports'
  | 'Entertainment';

export type ArticleStatus = 'pending' | 'approved' | 'rejected' | 'archived';

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string[];
  category: Exclude<NewsCategory, 'Home'>;
  sourceName: string;
  sourceUrl: string;
  articleUrl: string;
  canonicalUrl?: string;
  imageUrl: string;
  imageCaption?: string;
  publishedAt: string; // ISO string
  collectedAt?: string;
  author?: string;
  authorRole?: string;
  status?: ArticleStatus;
  featured?: boolean;
  secondary?: boolean;
  editorPick?: boolean;
  readTime: string;
  tags: string[];
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  slug: string;
  url: string;
  feed_url: string;
  category_id: string;
  category_name?: string;
  enabled: number;
  fetch_interval_minutes: number;
  last_fetched_at?: string;
  last_status?: string;
  error_count: number;
  last_error?: string;
  created_at: string;
  updated_at: string;
}

export interface CollectionLog {
  id: number;
  source_id?: string;
  source_name?: string;
  started_at: string;
  completed_at?: string;
  status: 'success' | 'failed' | 'partial';
  items_found: number;
  items_saved: number;
  items_duplicate: number;
  error_message?: string;
}

export interface OverviewStats {
  totalArticles: number;
  pendingArticles: number;
  approvedArticles: number;
  rejectedArticles: number;
  archivedArticles: number;
  activeSources: number;
  totalSources: number;
  lastCollectionTime: string | null;
  lastCollectionStatus: string;
  isCollectionRunning: boolean;
}

export type ThemeMode = 'light' | 'dark';
export type FontSize = 'normal' | 'large' | 'xlarge';
