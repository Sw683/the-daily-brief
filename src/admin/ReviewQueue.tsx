import React, { useState } from 'react';
import type { Article } from '../types/news';
import { formatRelativeTime } from '../utils/dateUtils';
import {
  CheckCircle2,
  XCircle,
  Edit3,
  ExternalLink,
  Search,
  CheckSquare,
  Square,
  Clock
} from 'lucide-react';

interface ReviewQueueProps {
  articles: Article[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason?: string) => Promise<void>;
  onEdit: (article: Article) => void;
  onBulkStatus: (ids: string[], status: 'approved' | 'rejected') => Promise<void>;
}

export const ReviewQueue: React.FC<ReviewQueueProps> = ({
  articles,
  onApprove,
  onReject,
  onEdit,
  onBulkStatus,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const pendingArticles = articles.filter((a) => a.status === 'pending');

  const filtered = pendingArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.summary.toLowerCase().includes(search.toLowerCase()) ||
      article.sourceName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((a) => a.id)));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return;
    setActionLoading('bulk');
    await onBulkStatus(Array.from(selectedIds), 'approved');
    setSelectedIds(new Set());
    setActionLoading(null);
  };

  const handleBulkReject = async () => {
    if (selectedIds.size === 0) return;
    setActionLoading('bulk');
    await onBulkStatus(Array.from(selectedIds), 'rejected');
    setSelectedIds(new Set());
    setActionLoading(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD9CE] dark:border-[#2D2C28]">
        <div>
          <h2 className="font-display text-2xl font-bold">
            Pending Editorial Queue ({pendingArticles.length})
          </h2>
          <p className="text-xs text-[#737373] dark:text-[#9E9B93] mt-0.5">
            Incoming dispatches awaiting fact-check and editorial sign-off.
          </p>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 bg-[#F7EAEC] dark:bg-[#2A1719] px-3 py-1.5 rounded-xs border border-[#8B2635]/20">
            <span className="text-xs font-semibold text-[#8B2635] dark:text-[#E06371]">
              {selectedIds.size} selected
            </span>
            <button
              onClick={handleBulkApprove}
              disabled={actionLoading === 'bulk'}
              className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-xs hover:bg-emerald-700 transition-colors"
            >
              Approve Selected
            </button>
            <button
              onClick={handleBulkReject}
              disabled={actionLoading === 'bulk'}
              className="px-2.5 py-1 bg-red-600 text-white text-xs font-semibold rounded-xs hover:bg-red-700 transition-colors"
            >
              Reject Selected
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#888] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search pending headlines or sources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#1A1918] border border-[#DDD9CE] dark:border-[#333] rounded-xs focus:outline-hidden focus:border-[#8B2635] dark:focus:border-[#E06371]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white dark:bg-[#1A1918] border border-[#DDD9CE] dark:border-[#333] rounded-xs focus:outline-hidden focus:border-[#8B2635] dark:focus:border-[#E06371]"
          >
            <option value="all">All Desks / Categories</option>
            <option value="India">India</option>
            <option value="World">World</option>
            <option value="Politics">Politics</option>
            <option value="Business">Business</option>
            <option value="Technology">Technology</option>
            <option value="Science">Science</option>
            <option value="Sports">Sports</option>
            <option value="Entertainment">Entertainment</option>
          </select>

          {filtered.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-[#F0EDE4] dark:bg-[#201F1C] border border-[#DDD9CE] dark:border-[#333] rounded-xs hover:text-[#8B2635] dark:hover:text-[#E06371]"
            >
              {selectedIds.size === filtered.length ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>Select All ({filtered.length})</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Review Queue List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#1A1918] border border-[#DDD9CE] dark:border-[#2D2C28] rounded-xs space-y-2">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
          <h3 className="font-display text-lg font-bold">Review Queue Clear</h3>
          <p className="text-xs text-[#737373] dark:text-[#9E9B93]">
            {pendingArticles.length === 0
              ? 'No pending wire stories awaiting review at this time.'
              : 'No pending stories match the selected search filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((article) => {
            const isSelected = selectedIds.has(article.id);

            return (
              <div
                key={article.id}
                className={`p-4 bg-white dark:bg-[#1A1918] border rounded-xs transition-colors ${
                  isSelected
                    ? 'border-[#8B2635] dark:border-[#E06371] ring-1 ring-[#8B2635]/20'
                    : 'border-[#DDD9CE] dark:border-[#2D2C28] hover:border-[#BBB]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleSelect(article.id)}
                    className="mt-1 text-[#888] hover:text-[#202020] dark:hover:text-white"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#8B2635] dark:text-[#E06371]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  {/* Thumbnail if available */}
                  {article.imageUrl && (
                    <div className="hidden sm:block w-28 h-20 rounded-xs overflow-hidden shrink-0 bg-[#EAE8E1] dark:bg-[#201F1C]">
                      <img
                        src={article.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Article Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] mb-1">
                      <span className="font-bold uppercase tracking-wider text-[#8B2635] dark:text-[#E06371]">
                        {article.category}
                      </span>
                      <span className="text-[#999]">•</span>
                      <span className="font-medium text-[#202020] dark:text-[#DDD]">
                        {article.sourceName}
                      </span>
                      <span className="text-[#999]">•</span>
                      <span className="text-[#737373] dark:text-[#9E9B93] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(article.publishedAt)}
                      </span>
                    </div>

                    <h3 className="font-headline text-base sm:text-lg font-bold leading-snug text-[#202020] dark:text-[#EDEBE6]">
                      {article.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#555] dark:text-[#A09D96] line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-[#EFECE5] dark:border-[#242320] flex flex-wrap items-center justify-between gap-2">
                      <a
                        href={article.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#737373] dark:text-[#9E9B93] hover:text-[#8B2635] dark:hover:text-[#E06371]"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Inspect Original Wire Article ↗</span>
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(article)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-[#DDD9CE] dark:border-[#333] hover:border-[#8B2635] dark:hover:border-[#E06371] rounded-xs transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={async () => {
                            setActionLoading(article.id);
                            await onReject(article.id);
                            setActionLoading(null);
                          }}
                          disabled={Boolean(actionLoading)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xs hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Reject</span>
                        </button>

                        <button
                          onClick={async () => {
                            setActionLoading(article.id);
                            await onApprove(article.id);
                            setActionLoading(null);
                          }}
                          disabled={Boolean(actionLoading)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xs transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approve & Publish</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
