import React from 'react';
import type { Article } from '../types/news';
import { formatRelativeTime } from '../utils/dateUtils';
import { Bookmark, Clock } from 'lucide-react';

interface SecondaryHeadlinesProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
}

export const SecondaryHeadlines: React.FC<SecondaryHeadlinesProps> = ({
  articles,
  onSelectArticle,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mb-10 pb-8 border-b border-[#E5E3DE] dark:border-[#2D2C28]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#E5E3DE] dark:divide-[#2D2C28]">
        {articles.map((article, idx) => {
          const isSaved = bookmarkedIds.has(article.id);
          return (
            <article
              key={article.id}
              className={`flex flex-col justify-between pt-6 md:pt-0 ${
                idx > 0 ? 'md:pl-6 lg:pl-8' : ''
              } group`}
            >
              <div>
                {/* Thumbnail */}
                <div
                  onClick={() => onSelectArticle(article)}
                  className="overflow-hidden rounded-xs bg-[#EAE8E1] dark:bg-[#1E1D1A] aspect-16/9 mb-3.5 cursor-pointer"
                >
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                {/* Category & Read Time */}
                <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px]">
                  <span className="font-bold tracking-wider uppercase text-[#8B2635] dark:text-[#E06371]">
                    {article.category}
                  </span>
                  <span className="text-[#737373] dark:text-[#9E9B93] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>

                {/* Headline */}
                <h3
                  onClick={() => onSelectArticle(article)}
                  className="font-headline text-lg sm:text-xl font-bold leading-snug text-[#202020] dark:text-[#EDEBE6] group-hover:text-[#8B2635] dark:group-hover:text-[#E06371] transition-colors cursor-pointer"
                >
                  {article.title}
                </h3>

                {/* Short description */}
                <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#555555] dark:text-[#A8A59E] font-sans line-clamp-3">
                  {article.summary}
                </p>
              </div>

              {/* Source & Action */}
              <div className="mt-4 pt-3 border-t border-[#EFECE5] dark:border-[#22211E] flex items-center justify-between text-xs text-[#737373] dark:text-[#9E9B93]">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-medium text-[#202020] dark:text-[#DDD] truncate">
                    {article.sourceName}
                  </span>
                  <span>•</span>
                  <span className="shrink-0">{formatRelativeTime(article.publishedAt)}</span>
                </div>

                <button
                  onClick={(e) => onToggleBookmark(article, e)}
                  className={`p-1 rounded-xs transition-colors shrink-0 ${
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
            </article>
          );
        })}
      </div>
    </section>
  );
};
