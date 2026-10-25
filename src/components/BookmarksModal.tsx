import React from 'react';
import type { Article } from '../types/news';
import { formatRelativeTime } from '../utils/dateUtils';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (article: Article) => void;
  onClearAll: () => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  savedArticles,
  onSelectArticle,
  onRemoveBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#FAF9F6] dark:bg-[#161614] text-[#202020] dark:text-[#EDEBE6] rounded-xs shadow-2xl border border-[#DDD9CE] dark:border-[#2C2A26] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E5E3DE] dark:border-[#2D2C28] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#8B2635] dark:text-[#E06371] fill-current" />
            <h2 className="font-display text-lg font-bold">
              Saved Reading List ({savedArticles.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {savedArticles.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-[#888] hover:text-red-600 flex items-center gap-1 transition-colors px-2 py-1"
                title="Clear all bookmarks"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear list</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-[#888] hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-4 sm:p-5 divide-y divide-[#E5E3DE] dark:divide-[#2D2C28]">
          {savedArticles.length === 0 ? (
            <div className="py-12 text-center text-[#737373] dark:text-[#9E9B93] space-y-3">
              <Bookmark className="w-8 h-8 mx-auto text-[#CCC] dark:text-[#444]" />
              <p className="text-sm font-medium">No stories saved to your reading list yet.</p>
              <p className="text-xs max-w-xs mx-auto">
                Click the bookmark icon on any headline or lead story to save it for offline or later reading.
              </p>
            </div>
          ) : (
            savedArticles.map((article) => (
              <div
                key={article.id}
                className="py-3.5 flex items-start justify-between gap-3 group"
              >
                <div
                  onClick={() => {
                    onSelectArticle(article);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-[#8B2635] dark:text-[#E06371] mb-1">
                    <span>{article.category}</span>
                    <span className="text-[#999]">•</span>
                    <span className="text-[#737373] dark:text-[#9E9B93] font-normal normal-case">
                      {article.sourceName} • {formatRelativeTime(article.publishedAt)}
                    </span>
                  </div>

                  <h3 className="font-headline text-base font-bold text-[#202020] dark:text-[#EDEBE6] group-hover:text-[#8B2635] dark:group-hover:text-[#E06371] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <button
                    onClick={() => onRemoveBookmark(article)}
                    className="p-1 text-[#888] hover:text-red-600 rounded transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="p-1 text-[#888] group-hover:text-[#8B2635] dark:group-hover:text-[#E06371] transition-colors"
                    title="Read now"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
