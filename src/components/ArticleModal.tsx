import React, { useEffect, useState } from 'react';
import type { Article, FontSize } from '../types/news';
import { formatRelativeTime } from '../utils/dateUtils';
import {
  X,
  ExternalLink,
  Bookmark,
  Share2,
  Clock,
  Check,
  AlertCircle,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: Article) => void;
  onSelectArticle: (article: Article) => void;
  allArticles: Article[];
  fontSize: FontSize;
  onChangeFontSize: (size: FontSize) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onSelectArticle,
  allArticles,
  fontSize,
  onChangeFontSize,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (article) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [article, onClose]);

  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '#' + article.slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  // Font size mapping for body text
  const fontSizeClass =
    fontSize === 'xlarge'
      ? 'text-lg sm:text-xl leading-relaxed sm:leading-loose'
      : fontSize === 'large'
      ? 'text-base sm:text-lg leading-relaxed'
      : 'text-[15px] sm:text-base leading-relaxed';

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#FAF9F6] dark:bg-[#161614] text-[#202020] dark:text-[#EDEBE6] rounded-xs shadow-2xl border border-[#DDD9CE] dark:border-[#2C2A26] overflow-hidden my-6 max-h-[90vh] flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-modal-title"
      >
        {/* Top Sticky Bar */}
        <div className="sticky top-0 z-20 bg-[#FAF9F6]/95 dark:bg-[#161614]/95 backdrop-blur-xs px-4 sm:px-6 py-3 border-b border-[#E5E3DE] dark:border-[#2D2C28] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#8B2635] dark:text-[#E06371]">
              {article.category}
            </span>
            <span className="text-[#C0BEB8] dark:text-[#444]">•</span>
            <span className="text-xs text-[#737373] dark:text-[#9E9B93] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Font size toggle */}
            <div className="flex items-center gap-0.5 bg-[#EAE7DF] dark:bg-[#22211E] p-0.5 rounded text-[11px]">
              <button
                onClick={() => onChangeFontSize('normal')}
                className={`px-1.5 py-0.5 rounded ${fontSize === 'normal' ? 'bg-white dark:bg-[#333] font-bold' : ''}`}
                title="Normal text"
              >
                A
              </button>
              <button
                onClick={() => onChangeFontSize('large')}
                className={`px-1.5 py-0.5 rounded ${fontSize === 'large' ? 'bg-white dark:bg-[#333] font-bold' : ''}`}
                title="Large text"
              >
                A+
              </button>
              <button
                onClick={() => onChangeFontSize('xlarge')}
                className={`px-1.5 py-0.5 rounded ${fontSize === 'xlarge' ? 'bg-white dark:bg-[#333] font-bold' : ''}`}
                title="Extra large text"
              >
                A++
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(article)}
              className={`p-1.5 rounded transition-colors ${
                isBookmarked
                  ? 'text-[#8B2635] dark:text-[#E06371] bg-[#F7EAEC] dark:bg-[#2A1719]'
                  : 'text-[#666] dark:text-[#AAA] hover:bg-[#EAE7DF] dark:hover:bg-[#22211E]'
              }`}
              title={isBookmarked ? 'Saved to bookmarks' : 'Save to bookmarks'}
              aria-label="Save to bookmarks"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded text-[#666] dark:text-[#AAA] hover:bg-[#EAE7DF] dark:hover:bg-[#22211E] transition-colors relative"
              title="Copy article link"
              aria-label="Share article"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded text-[#666] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-white hover:bg-[#EAE7DF] dark:hover:bg-[#22211E] transition-colors ml-1"
              title="Close article (ESC)"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
          {/* Article Header */}
          <header className="space-y-3">
            <h1
              id="article-modal-title"
              className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-[#202020] dark:text-[#EDEBE6]"
            >
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-[#555] dark:text-[#B5B2AB] font-serif italic leading-relaxed border-l-2 border-[#8B2635] dark:border-[#E06371] pl-3 py-0.5">
              {article.summary}
            </p>

            {/* Author and Publisher byline */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs text-[#737373] dark:text-[#9E9B93] border-b border-[#E5E3DE] dark:border-[#2D2C28] pb-3">
              <div className="flex items-center gap-3">
                {article.author && (
                  <div className="flex items-center gap-1.5 font-medium text-[#202020] dark:text-[#EDEBE6]">
                    <User className="w-3.5 h-3.5 text-[#8B2635] dark:text-[#E06371]" />
                    <span>{article.author}</span>
                    {article.authorRole && (
                      <span className="text-[#888] font-normal">({article.authorRole})</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published {formatRelativeTime(article.publishedAt)}</span>
              </div>
            </div>
          </header>

          {/* Main Photo & Caption */}
          <figure className="space-y-1.5">
            <div className="overflow-hidden rounded-xs bg-[#EAE8E1] dark:bg-[#1E1D1A] aspect-16/9">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            {article.imageCaption && (
              <figcaption className="text-xs text-[#737373] dark:text-[#9E9B93] italic font-sans">
                {article.imageCaption}
              </figcaption>
            )}
          </figure>

          {/* Source Transparency Box */}
          <div className="p-3.5 bg-[#F2EFE8] dark:bg-[#1F1E1B] border border-[#DDD9CE] dark:border-[#33312B] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#8B2635] dark:text-[#E06371] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#202020] dark:text-[#EDEBE6]">
                  Original Reporting Source: <span className="underline">{article.sourceName}</span>
                </p>
                <p className="text-[#666] dark:text-[#AAA] text-[11px] mt-0.5">
                  Syndicated for demonstration review. Original rights remain with the publisher.
                </p>
              </div>
            </div>

            <a
              href={article.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-[#2B2A26] border border-[#DDD] dark:border-[#444] rounded text-[#202020] dark:text-[#DDD] hover:border-[#8B2635] dark:hover:border-[#E06371] hover:text-[#8B2635] dark:hover:text-[#E06371] transition-colors shrink-0 text-xs font-medium"
            >
              <span>Read Original Article</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Article Full Paragraphs */}
          <div className={`space-y-4 text-[#2E2E2E] dark:text-[#D5D2CA] font-serif ${fontSizeClass}`}>
            {article.content && article.content.length > 0 ? (
              article.content.map((para, i) => (
                <p key={i} className={i === 0 ? 'editorial-lead' : ''}>
                  {para}
                </p>
              ))
            ) : (
              <p className="editorial-lead">{article.summary}</p>
            )}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-[#E5E3DE] dark:border-[#2D2C28]">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#888] block mb-2">
              Filed under:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs bg-[#EAE7DF] dark:bg-[#22211E] text-[#444] dark:text-[#BBB] rounded-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Related Articles in Same Category */}
          {relatedArticles.length > 0 && (
            <div className="pt-6 border-t border-[#E5E3DE] dark:border-[#2D2C28]">
              <h3 className="font-display text-lg font-bold text-[#202020] dark:text-[#EDEBE6] mb-3">
                Related in {article.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectArticle(rel)}
                    className="p-3 bg-[#F5F3EC] dark:bg-[#1C1B19] border border-[#E5E3DE] dark:border-[#2D2C28] rounded-xs hover:border-[#8B2635] dark:hover:border-[#E06371] cursor-pointer group transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#8B2635] dark:text-[#E06371] block mb-1">
                        {rel.sourceName}
                      </span>
                      <h4 className="font-headline text-xs sm:text-sm font-semibold line-clamp-2 text-[#202020] dark:text-[#EDEBE6] group-hover:text-[#8B2635] dark:group-hover:text-[#E06371]">
                        {rel.title}
                      </h4>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-[#737373] dark:text-[#9E9B93]">
                      <span>{formatRelativeTime(rel.publishedAt)}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
