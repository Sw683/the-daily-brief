import React from 'react';
import type { Article } from '../types/news';
import { formatRelativeTime } from '../utils/dateUtils';
import { Clock, Bookmark, Sparkles, BookOpen } from 'lucide-react';

interface FeaturedStoryProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
}

export const FeaturedStory: React.FC<FeaturedStoryProps> = ({
  article,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
}) => {
  return (
    <section className="mb-10 pb-8 border-b border-[#E5E3DE] dark:border-[#2D2C28]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Large Editorial Image (7 cols on lg) */}
        <div 
          onClick={() => onSelectArticle(article)}
          className="lg:col-span-7 group cursor-pointer flex flex-col justify-between"
        >
          <div className="relative overflow-hidden rounded-xs bg-[#EAE8E1] dark:bg-[#1E1D1A] aspect-16/10">
            <img
              src={article.imageUrl}
              alt={article.title}
              loading="eager"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
            {/* Editor's Pick Badge */}
            <div className="absolute top-3 left-3 bg-[#8B2635] text-white text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-xs flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>Lead Story</span>
            </div>
          </div>
          {article.imageCaption && (
            <p className="mt-2 text-[11px] text-[#737373] dark:text-[#9E9B93] italic font-sans">
              {article.imageCaption}
            </p>
          )}
        </div>

        {/* Right Column: Editorial Text & Metadata (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Category & Read Time */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#8B2635] dark:text-[#E06371]">
                {article.category}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-[#737373] dark:text-[#9E9B93]">
                <Clock className="w-3 h-3" />
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Headline */}
            <h2
              onClick={() => onSelectArticle(article)}
              className="font-headline text-2xl sm:text-3xl lg:text-[32px] font-bold leading-tight text-[#202020] dark:text-[#EDEBE6] hover:text-[#8B2635] dark:hover:text-[#E06371] transition-colors cursor-pointer"
            >
              {article.title}
            </h2>

            {/* Summary */}
            <p className="mt-3.5 text-sm sm:text-[15px] leading-relaxed text-[#555555] dark:text-[#B5B2AB] font-sans">
              {article.summary}
            </p>

            {/* Key Tags */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] bg-[#F0EDE4] dark:bg-[#1E1D1A] text-[#666] dark:text-[#AAA] rounded-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Metadata & Actions */}
          <div className="mt-6 pt-4 border-t border-[#EAE7DF] dark:border-[#282723] flex items-center justify-between text-xs">
            {/* Publisher & Published Date */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-medium text-[#202020] dark:text-[#EDEBE6]">
                <span>{article.sourceName}</span>
                <span className="text-[#BBB] dark:text-[#444]">•</span>
                <span className="text-[#737373] dark:text-[#9E9B93] font-normal">
                  {formatRelativeTime(article.publishedAt)}
                </span>
              </div>
              {article.author && (
                <span className="text-[11px] text-[#737373] dark:text-[#9E9B93]">
                  By {article.author}
                </span>
              )}
            </div>

            {/* Interactive Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => onToggleBookmark(article, e)}
                className={`p-1.5 rounded-xs transition-colors ${
                  isBookmarked
                    ? 'text-[#8B2635] dark:text-[#E06371] bg-[#F7EAEC] dark:bg-[#2A1719]'
                    : 'text-[#737373] dark:text-[#9E9B93] hover:text-[#202020] dark:hover:text-white hover:bg-[#F0EDE4] dark:hover:bg-[#1E1D1A]'
                }`}
                title={isBookmarked ? 'Remove from saved' : 'Save story'}
                aria-label="Save story"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => onSelectArticle(article)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#202020] dark:bg-[#EDEBE6] text-[#FAF9F6] dark:text-[#121211] hover:bg-[#8B2635] dark:hover:bg-[#E06371] dark:hover:text-white text-xs font-medium rounded-xs transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Story</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
