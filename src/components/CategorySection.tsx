import React from 'react';
import type { Article, NewsCategory } from '../types/news';
import { formatRelativeTime } from '../utils/dateUtils';
import { ChevronRight, Bookmark } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  subtitle?: string;
  category: NewsCategory;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onViewAll: (category: NewsCategory) => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  subtitle,
  category,
  articles,
  onSelectArticle,
  onViewAll,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  if (!articles || articles.length === 0) return null;

  const leadArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  return (
    <section className="mb-12 pb-10 border-b border-[#E5E3DE] dark:border-[#2D2C28]">
      {/* Category Section Header */}
      <div className="flex items-end justify-between pb-2 mb-6 border-b border-[#202020] dark:border-[#EDEBE6]">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#8B2635] dark:text-[#E06371] block">
            Desk Section
          </span>
          <h2 className="font-display text-2xl font-bold tracking-tight text-[#202020] dark:text-[#EDEBE6]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[#737373] dark:text-[#9E9B93] mt-0.5 font-serif italic">
              {subtitle}
            </p>
          )}
        </div>

        <button
          onClick={() => onViewAll(category)}
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#8B2635] dark:text-[#E06371] hover:underline cursor-pointer group"
        >
          <span>View All in {category}</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Grid: 1 main column + 2-3 side items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left: Section Lead Story (7 cols) */}
        {leadArticle && (
          <div className="lg:col-span-7 flex flex-col justify-between group">
            <div>
              <div
                onClick={() => onSelectArticle(leadArticle)}
                className="overflow-hidden rounded-xs bg-[#EAE8E1] dark:bg-[#1E1D1A] aspect-16/10 mb-4 cursor-pointer"
              >
                <img
                  src={leadArticle.imageUrl}
                  alt={leadArticle.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex items-center gap-2 mb-1 text-[11px] text-[#737373] dark:text-[#9E9B93]">
                <span className="font-semibold text-[#202020] dark:text-[#EDEBE6]">
                  {leadArticle.sourceName}
                </span>
                <span>•</span>
                <span>{formatRelativeTime(leadArticle.publishedAt)}</span>
                <span>•</span>
                <span>{leadArticle.readTime}</span>
              </div>

              <h3
                onClick={() => onSelectArticle(leadArticle)}
                className="font-headline text-xl sm:text-2xl font-bold leading-snug text-[#202020] dark:text-[#EDEBE6] group-hover:text-[#8B2635] dark:group-hover:text-[#E06371] transition-colors cursor-pointer"
              >
                {leadArticle.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#555555] dark:text-[#A09D96]">
                {leadArticle.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#EFECE5] dark:border-[#22211E] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#737373] dark:text-[#9E9B93]">
                {leadArticle.author ? `Reporting by ${leadArticle.author}` : leadArticle.sourceName}
              </span>
              <button
                onClick={(e) => onToggleBookmark(leadArticle, e)}
                className={`p-1 rounded-xs transition-colors ${
                  bookmarkedIds.has(leadArticle.id)
                    ? 'text-[#8B2635] dark:text-[#E06371]'
                    : 'text-[#888] hover:text-[#202020] dark:hover:text-white'
                }`}
                title="Bookmark article"
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.has(leadArticle.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* Right: Complementary Section Stories (5 cols) */}
        <div className="lg:col-span-5 flex flex-col divide-y divide-[#E5E3DE] dark:divide-[#2D2C28]">
          {sideArticles.map((article, idx) => (
            <div
              key={article.id}
              className={`flex flex-col justify-between group ${idx === 0 ? 'pb-4' : 'py-4'}`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1 text-[11px] text-[#737373] dark:text-[#9E9B93]">
                  <span className="font-medium text-[#202020] dark:text-[#DDD]">
                    {article.sourceName}
                  </span>
                  <span>•</span>
                  <span>{formatRelativeTime(article.publishedAt)}</span>
                </div>

                <h4
                  onClick={() => onSelectArticle(article)}
                  className="font-headline text-base font-bold leading-snug text-[#202020] dark:text-[#EDEBE6] group-hover:text-[#8B2635] dark:group-hover:text-[#E06371] transition-colors cursor-pointer"
                >
                  {article.title}
                </h4>

                <p className="mt-1 text-xs text-[#555] dark:text-[#9E9B93] line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-[10px] text-[#888]">{article.readTime}</span>
                <button
                  onClick={(e) => onToggleBookmark(article, e)}
                  className={`p-1 rounded-xs transition-colors ${
                    bookmarkedIds.has(article.id)
                      ? 'text-[#8B2635] dark:text-[#E06371]'
                      : 'text-[#888] hover:text-[#202020] dark:hover:text-white'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className={`w-3 h-3 ${bookmarkedIds.has(article.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
