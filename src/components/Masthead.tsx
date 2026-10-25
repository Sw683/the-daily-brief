import React from 'react';
import { Sun, Moon, Search, Bookmark, Type, RotateCcw, Shield } from 'lucide-react';
import type { ThemeMode, FontSize } from '../types/news';

interface MastheadProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  fontSize: FontSize;
  onChangeFontSize: (size: FontSize) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  savedCount: number;
  onOpenBookmarks: () => void;
  onResetView: () => void;
  onOpenAdmin?: () => void;
}

export const Masthead: React.FC<MastheadProps> = ({
  theme,
  onToggleTheme,
  fontSize,
  onChangeFontSize,
  searchQuery,
  onSearchChange,
  savedCount,
  onOpenBookmarks,
  onResetView,
  onOpenAdmin,
}) => {
  return (
    <header className="w-full bg-[#FAF9F6] dark:bg-[#121211] transition-colors border-b border-[#E5E3DE] dark:border-[#2D2C28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-4">
        {/* Top utility row: Weather / Controls */}
        <div className="flex items-center justify-between pb-3 text-xs text-[#737373] dark:text-[#9E9B93] border-b border-[#EBE8E1] dark:border-[#242320]">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wider uppercase text-[10px] text-[#8B2635] dark:text-[#E06371]">
              Vol. CXXVIII • No. 42
            </span>
            <span className="hidden sm:inline text-[#DDD] dark:text-[#333]">|</span>
            <span className="hidden md:inline">Independent • Unbiased • Comprehensive</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center gap-1 bg-[#F0EDE4] dark:bg-[#1F1E1B] p-0.5 rounded text-[11px]">
              <span className="px-1.5 text-[#888] flex items-center gap-0.5">
                <Type className="w-3 h-3" />
              </span>
              <button
                onClick={() => onChangeFontSize('normal')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  fontSize === 'normal'
                    ? 'bg-white dark:bg-[#2A2925] text-[#202020] dark:text-white font-bold shadow-xs'
                    : 'text-[#666] dark:text-[#999] hover:text-black dark:hover:text-white'
                }`}
                title="Normal font size"
              >
                A
              </button>
              <button
                onClick={() => onChangeFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                  fontSize === 'large'
                    ? 'bg-white dark:bg-[#2A2925] text-[#202020] dark:text-white font-bold shadow-xs'
                    : 'text-[#666] dark:text-[#999] hover:text-black dark:hover:text-white'
                }`}
                title="Large font size"
              >
                A+
              </button>
              <button
                onClick={() => onChangeFontSize('xlarge')}
                className={`px-1.5 py-0.5 rounded text-sm transition-colors ${
                  fontSize === 'xlarge'
                    ? 'bg-white dark:bg-[#2A2925] text-[#202020] dark:text-white font-bold shadow-xs'
                    : 'text-[#666] dark:text-[#999] hover:text-black dark:hover:text-white'
                }`}
                title="Extra large font size"
              >
                A++
              </button>
            </div>

            {/* Saved Articles Drawer Trigger */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-1.5 rounded text-[#555] dark:text-[#AAA] hover:text-[#8B2635] dark:hover:text-[#E06371] hover:bg-[#F0EDE4] dark:hover:bg-[#1E1D1A] transition-colors"
              title="Saved reading list"
              aria-label="Saved Articles"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8B2635] dark:bg-[#E06371] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded text-[#555] dark:text-[#AAA] hover:text-[#8B2635] dark:hover:text-[#E06371] hover:bg-[#F0EDE4] dark:hover:bg-[#1E1D1A] transition-colors"
              title={theme === 'dark' ? 'Switch to daylight mode' : 'Switch to night mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#444]" />}
            </button>

            {/* Admin Desk Trigger */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold tracking-wider uppercase text-[#8B2635] dark:text-[#E06371] bg-[#F7EAEC] dark:bg-[#2A1719] rounded-xs hover:bg-[#8B2635] hover:text-white dark:hover:bg-[#E06371] dark:hover:text-black transition-colors"
                title="Open Editorial Review Desk & News Ingestion"
              >
                <Shield className="w-3 h-3" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Masthead Banner */}
        <div className="py-6 sm:py-8 flex flex-col items-center justify-center text-center relative">
          {/* Decorative small ornaments */}
          <div className="flex items-center justify-center gap-3 w-full mb-2">
            <span className="h-[1px] bg-[#E5E3DE] dark:bg-[#2D2C28] flex-1 max-w-[120px]"></span>
            <span className="text-[10px] tracking-[0.25em] font-medium uppercase text-[#737373] dark:text-[#9E9B93]">
              ESTABLISHED 2026
            </span>
            <span className="h-[1px] bg-[#E5E3DE] dark:bg-[#2D2C28] flex-1 max-w-[120px]"></span>
          </div>

          {/* Newspaper Name */}
          <button
            onClick={onResetView}
            className="group cursor-pointer focus:outline-hidden"
            title="The Daily Brief — Back to Front Page"
          >
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#202020] dark:text-[#EDEBE6] transition-colors group-hover:text-[#8B2635] dark:group-hover:text-[#E06371]">
              The Daily Brief
            </h1>
          </button>

          {/* Tagline */}
          <p className="mt-2 text-xs sm:text-sm font-serif italic text-[#666666] dark:text-[#A8A59E] tracking-wide">
            The stories that matter.
          </p>

          {/* Newspaper Double Rule */}
          <div className="w-full mt-4 flex items-center justify-center">
            <div className="w-full border-t border-b border-[#202020] dark:border-[#EDEBE6] py-[1.5px]">
              <div className="border-t border-[#202020] dark:border-[#EDEBE6]"></div>
            </div>
          </div>
        </div>

        {/* Compact Search Bar & Filter active indicators */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-md">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-[#888] pointer-events-none" />
              <input
                type="text"
                placeholder="Search headlines, topics, or sources (e.g. AI, Climate, India)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-[#F5F3EC] dark:bg-[#1A1917] border border-[#DDD9CE] dark:border-[#32302A] rounded text-[#202020] dark:text-[#EDEBE6] placeholder-[#888] focus:outline-hidden focus:border-[#8B2635] dark:focus:border-[#E06371] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 text-xs text-[#888] hover:text-[#202020] dark:hover:text-white"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {searchQuery && (
            <div className="flex items-center gap-2 text-xs text-[#737373] dark:text-[#9E9B93]">
              <span>Searching for: <strong className="text-[#8B2635] dark:text-[#E06371]">"{searchQuery}"</strong></span>
              <button
                onClick={() => onSearchChange('')}
                className="underline hover:text-[#202020] dark:hover:text-white text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
