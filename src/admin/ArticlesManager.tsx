import React, { useState } from 'react';
import type { Article, ArticleStatus } from '../types/news';
import { formatRelativeTime } from '../utils/dateUtils';
import {
  Search,
  CheckCircle2,
  XCircle,
  Archive,
  Edit3,
  ExternalLink
} from 'lucide-react';

interface ArticlesManagerProps {
  articles: Article[];
  onUpdateStatus: (id: string, status: ArticleStatus) => Promise<void>;
  onEdit: (article: Article) => void;
}

export const ArticlesManager: React.FC<ArticlesManagerProps> = ({
  articles,
  onUpdateStatus,
  onEdit,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase()) ||
      a.sourceName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD9CE] dark:border-[#2D2C28]">
        <div>
          <h2 className="font-display text-2xl font-bold">
            All Articles Archive ({articles.length})
          </h2>
          <p className="text-xs text-[#737373] dark:text-[#9E9B93] mt-0.5">
            Full repository of ingested dispatches across all publication states.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#888] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search headline, summary, or source..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#1A1918] border border-[#DDD9CE] dark:border-[#333] rounded-xs focus:outline-hidden focus:border-[#8B2635] dark:focus:border-[#E06371]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white dark:bg-[#1A1918] border border-[#DDD9CE] dark:border-[#333] rounded-xs"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved (Live)</option>
            <option value="rejected">Rejected</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white dark:bg-[#1A1918] border border-[#DDD9CE] dark:border-[#333] rounded-xs"
          >
            <option value="all">All Desks</option>
            <option value="India">India</option>
            <option value="World">World</option>
            <option value="Politics">Politics</option>
            <option value="Business">Business</option>
            <option value="Technology">Technology</option>
            <option value="Science">Science</option>
            <option value="Sports">Sports</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white dark:bg-[#1A1918] border border-[#DDD9CE] dark:border-[#2D2C28] rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-[#E5E3DE] dark:divide-[#2D2C28]">
            <thead className="bg-[#FAF9F6] dark:bg-[#141412] text-[#737373] dark:text-[#9E9B93] uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Headline & Source</th>
                <th className="py-3 px-4">Desk</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DE] dark:divide-[#2D2C28]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#737373] dark:text-[#9E9B93]">
                    No articles match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((article) => (
                  <tr key={article.id} className="hover:bg-[#FAF9F6] dark:hover:bg-[#161614] transition-colors">
                    <td className="py-3 px-4 max-w-md">
                      <div className="font-semibold text-[#202020] dark:text-[#EDEBE6] line-clamp-1">
                        {article.featured && (
                          <span className="text-[10px] bg-[#8B2635] text-white px-1.5 py-0.5 rounded-xs mr-1.5 uppercase font-bold">
                            Lead Story
                          </span>
                        )}
                        {article.title}
                      </div>
                      <div className="text-[11px] text-[#737373] dark:text-[#9E9B93] mt-0.5 flex items-center gap-2">
                        <span>{article.sourceName}</span>
                        <a
                          href={article.articleUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline flex items-center gap-0.5 text-[#888]"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>Original</span>
                        </a>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold uppercase tracking-wider text-[11px] text-[#8B2635] dark:text-[#E06371]">
                        {article.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider ${
                          article.status === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : article.status === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : article.status === 'rejected'
                            ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[#737373] dark:text-[#9E9B93]">
                      {formatRelativeTime(article.publishedAt)}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => onEdit(article)}
                        className="p-1 text-[#666] hover:text-[#8B2635] dark:hover:text-[#E06371]"
                        title="Edit metadata"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {article.status !== 'approved' && (
                        <button
                          onClick={() => onUpdateStatus(article.id, 'approved')}
                          className="p-1 text-[#666] hover:text-emerald-600"
                          title="Approve & Publish"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {article.status !== 'rejected' && (
                        <button
                          onClick={() => onUpdateStatus(article.id, 'rejected')}
                          className="p-1 text-[#666] hover:text-red-600"
                          title="Reject"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {article.status !== 'archived' && (
                        <button
                          onClick={() => onUpdateStatus(article.id, 'archived')}
                          className="p-1 text-[#666] hover:text-purple-600"
                          title="Archive"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
