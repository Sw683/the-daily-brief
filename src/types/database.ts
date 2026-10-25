export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'reader' | 'editor' | 'admin';
export type ArticleReviewStatus = 'pending' | 'approved' | 'rejected' | 'archived';
export type CollectionStatus = 'success' | 'failed' | 'partial';

export interface Profile {
  id: string; // uuid referencing auth.users
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface BookmarkRecord {
  id: string; // uuid
  user_id: string; // uuid
  article_id: string;
  created_at: string;
}

export interface ArticleRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string[] | Json;
  category_id: string;
  source_id: string;
  source_name: string;
  source_url: string;
  original_url: string;
  canonical_url: string;
  image_url: string | null;
  image_caption: string | null;
  author: string | null;
  author_role: string | null;
  published_at: string;
  collected_at: string;
  status: ArticleReviewStatus;
  featured: boolean;
  secondary: boolean;
  editor_pick: boolean;
  read_time: string;
  tags: string[] | Json;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  created_at: string;
}

export interface SourceRecord {
  id: string;
  name: string;
  slug: string;
  url: string;
  feed_url: string;
  category_id: string | null;
  enabled: boolean;
  fetch_interval_minutes: number;
  last_fetched_at: string | null;
  last_status: string;
  error_count: number;
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface CollectionLogRecord {
  id: number;
  source_id: string | null;
  source_name: string | null;
  started_at: string;
  completed_at: string | null;
  status: CollectionStatus;
  items_found: number;
  items_saved: number;
  items_duplicate: number;
  error_message: string | null;
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: CategoryRecord;
        Insert: Omit<CategoryRecord, 'created_at'> & { created_at?: string };
        Update: Partial<CategoryRecord>;
      };
      sources: {
        Row: SourceRecord;
        Insert: Omit<SourceRecord, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<SourceRecord>;
      };
      articles: {
        Row: ArticleRecord;
        Insert: Omit<ArticleRecord, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ArticleRecord>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Profile>;
      };
      bookmarks: {
        Row: BookmarkRecord;
        Insert: Omit<BookmarkRecord, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<BookmarkRecord>;
      };
      collection_logs: {
        Row: CollectionLogRecord;
        Insert: Omit<CollectionLogRecord, 'id'> & { id?: number };
        Update: Partial<CollectionLogRecord>;
      };
    };
  };
}
