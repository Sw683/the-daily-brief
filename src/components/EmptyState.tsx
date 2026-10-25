import React from 'react';
import { SearchX, RotateCcw, Newspaper, RefreshCw, PenTool } from 'lucide-react';

interface EmptyStateProps {
  searchQuery?: string;
  category?: string;
  isGlobalEmpty?: boolean;
  onReset?: () => void;
  onRefresh?: () => void;
  onOpenAdmin?: () => void;
  onSelectSuggestion?: (query: string) => void;
  isRefreshing?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  category,
  isGlobalEmpty = false,
  onReset,
  onRefresh,
  onOpenAdmin,
  onSelectSuggestion,
  isRefreshing = false,
}) => {
  const suggestions = ['Technology', 'India', 'Climate', 'Cricket', 'AI', 'Economy'];

  // Global Empty State when no approved articles exist in the entire database
  if (isGlobalEmpty) {
    return (
      <div className="py-16 sm:py-24 px-4 text-center max-w-xl mx-auto animate-fadeIn">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#F0EDE4] dark:bg-[#201F1C] flex items-center justify-center text-[#8B2635] dark:text-[#E06371] mb-5 border border-[#E5E3DE] dark:border-[#2D2C28]">
          <Newspaper className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B2635] dark:text-[#E06371] block mb-1">
          The Daily Brief • Broadsheet Desk
        </span>

        <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#202020] dark:text-[#EDEBE6]">
          No Published Dispatches in Current Edition
        </h3>

        <p className="mt-3 text-sm text-[#737373] dark:text-[#9E9B93] leading-relaxed max-w-md mx-auto">
          The articles table is currently empty or all ingested dispatches are awaiting editorial sign-off in the review queue.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#202020] dark:bg-[#EDEBE6] text-[#FAF9F6] dark:text-[#121211] hover:bg-[#8B2635] dark:hover:bg-[#E06371] dark:hover:text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Checking...' : 'Check Again'}</span>
            </button>
          )}

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#1E1D1A] border border-[#DDD] dark:border-[#333] hover:border-[#8B2635] dark:hover:border-[#E06371] text-[#202020] dark:text-[#EDEBE6] hover:text-[#8B2635] dark:hover:text-[#E06371] text-xs font-semibold rounded-xs transition-colors cursor-pointer shadow-xs"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Open Editorial Review Queue</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Category Empty State or Search Empty State
  return (
    <div className="py-16 px-4 text-center max-w-lg mx-auto animate-fadeIn">
      <div className="w-12 h-12 mx-auto rounded-full bg-[#F0EDE4] dark:bg-[#201F1C] flex items-center justify-center text-[#8B2635] dark:text-[#E06371] mb-4">
        <SearchX className="w-6 h-6" />
      </div>

      <h3 className="font-display text-2xl font-bold text-[#202020] dark:text-[#EDEBE6]">
        {searchQuery ? 'No Matching Dispatches' : `No Dispatches on the ${category || 'Selected'} Desk`}
      </h3>

      <p className="mt-2 text-sm text-[#737373] dark:text-[#9E9B93] leading-relaxed">
        {searchQuery ? (
          <>
            No dispatches in our archive match your search for{' '}
            <strong className="text-[#8B2635] dark:text-[#E06371]">"{searchQuery}"</strong>.
            Try alternative keywords or explore one of the trending topics below.
          </>
        ) : (
          <>There are currently no approved dispatches filed under this desk category.</>
        )}
      </p>

      {/* Suggested Search Terms for Search Empty State */}
      {searchQuery && (
        <div className="mt-6">
          <span className="text-[11px] uppercase tracking-wider text-[#888] font-semibold block mb-2">
            Suggested Topics:
          </span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {suggestions.map((topic) => (
              <button
                key={topic}
                onClick={() => onSelectSuggestion && onSelectSuggestion(topic)}
                className="px-2.5 py-1 text-xs bg-[#EAE7DF] dark:bg-[#22211E] text-[#444] dark:text-[#BBB] hover:text-[#8B2635] dark:hover:text-[#E06371] hover:border-[#8B2635] rounded-xs transition-colors cursor-pointer"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {onReset && (
        <div className="mt-8">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#202020] dark:bg-[#EDEBE6] text-[#FAF9F6] dark:text-[#121211] hover:bg-[#8B2635] dark:hover:bg-[#E06371] dark:hover:text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{searchQuery ? 'Reset Search & Return to Front Page' : 'Return to Front Page'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
