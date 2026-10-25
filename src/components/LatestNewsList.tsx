import React from 'react';
import type { Article } from '../types/news';
import { formatRelativeTime } from '../utils/dateUtils';
import { ArrowDown, Bookmark, ExternalLink } from 'lucide-react';

interface LatestNewsListProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  totalCount: number;
}

export const LatestNewsList: React.FC<LatestNewsListProps> = ({
  articles,
  onSelectArticle,
  bookmarkedIds,
  onToggleBookmark,
  hasMore,
  onLoadMore,
  totalCount,
}) => {
  return (
    <section className="mb-12">
      {/* Editorial Section Header */}
      <div className="flex items-center justify-between pb-2 mb-6 border-b-2 border-[#202020] dark:border-[#EDEBE6]">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-[#202020] dark:text-[#EDEBE6]">
            Latest Dispatches
          </h2>
          <span className="text-xs text-[#737373] dark:text-[#9E9B93]">
            Chronological wire updates
          </span>
        </div>
        <span className="text-xs font-mono text-[#8B2635] dark:text-[#E06371] font-semibold">
          Showing {articles.length} of {totalCount} stories
        </span>
      </div>

      {/* Vertical List */}
      <div className="divide-y divide-[#E5E3DE] dark:divide-[#2D2C28]">
        {articles.map((article) => {
          const isSaved = bookmarkedIds.has(article.id);
          return (
            <article
              key={article.id}
              className="py-4 sm:py-5 flex flex-col sm:flex-row items-start gap-4 group"
            >
              {/* Thumbnail on left for desktop/tablet */}
              <div
                onClick={() => onSelectArticle(article)}
                className="w-full sm:w-44 md:w-48 shrink-0 overflow-hidden rounded-xs bg-[#EAE8E1] dark:bg-[#1E1D1A] aspect-16/10 cursor-pointer"
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>

              {/* Text content on right */}
              <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                <div>
                  {/* Category, Source, Time */}
                  <div className="flex flex-wrap items-center gap-2 mb-1 text-[11px]">
                    <span className="font-bold tracking-wider uppercase text-[#8B2635] dark:text-[#E06371]">
                      {article.category}
                    </span>
                    <span className="text-[#C0BEB8] dark:text-[#444]">•</span>
                    <span className="font-medium text-[#202020] dark:text-[#EDEBE6]">
                      {article.sourceName}
                    </span>
                    <span className="text-[#C0BEB8] dark:text-[#444]">•</span>
                    <span className="text-[#737373] dark:text-[#9E9B93]">
                      {formatRelativeTime(article.publishedAt)}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3
                    onClick={() => onSelectArticle(article)}
                    className="font-headline text-base sm:text-lg font-bold leading-snug text-[#202020] dark:text-[#EDEBE6] group-hover:text-[#8B2635] dark:group-hover:text-[#E06371] transition-colors cursor-pointer"
                  >
                    {article.title}
                  </h3>

                  {/* 1-2 lines summary */}
                  <p className="mt-1 text-xs sm:text-sm text-[#555555] dark:text-[#A09D96] line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                {/* Footer bar */}
                <div className="mt-2.5 pt-2 flex items-center justify-between text-xs text-[#737373] dark:text-[#9E9B93]">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#888]">{article.readTime}</span>
                    {article.author && (
                      <span className="hidden sm:inline text-[11px] text-[#888]">
                        • By {article.author}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={article.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#737373] dark:text-[#9E9B93] hover:text-[#8B2635] dark:hover:text-[#E06371] transition-colors"
                      title="Open publisher's original article in new tab"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="hidden xs:inline">Source link</span>
                    </a>

                    <button
                      onClick={(e) => onToggleBookmark(article, e)}
                      className={`p-1 rounded-xs transition-colors ${
                        isSaved
                          ? 'text-[#8B2635] dark:text-[#E06371]'
                          : 'text-[#888] hover:text-[#202020] dark:hover:text-white'
                      }`}
                      title={isSaved ? 'Remove bookmark' : 'Bookmark story'}
                      aria-label="Bookmark story"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore ? (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#202020] dark:border-[#EDEBE6] hover:bg-[#202020] hover:text-[#FAF9F6] dark:hover:bg-[#EDEBE6] dark:hover:text-[#121211] text-xs font-semibold tracking-wider uppercase rounded-xs transition-all duration-150 cursor-pointer shadow-xs active:scale-98"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Load More Stories ({totalCount - articles.length} remaining)</span>
          </button>
        </div>
      ) : (
        <div className="mt-8 text-center text-xs text-[#737373] dark:text-[#9E9B93] italic">
          — You have caught up with all current dispatches in this edition —
        </div>
      )}
    </section>
  );
};
