import React, { useState } from 'react';
import type { NewsSource } from '../types/news';
import { formatRelativeTime } from '../utils/dateUtils';
import {
  Plus,
  Play,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  X
} from 'lucide-react';

interface SourcesManagerProps {
  sources: NewsSource[];
  onToggleEnabled: (id: string, current: boolean) => Promise<void>;
  onAddSource: (data: { name: string; url: string; feed_url: string; category_id: string }) => Promise<void>;
  onDeleteSource: (id: string) => Promise<void>;
  onTestSource: (feedUrl: string) => Promise<{ success: boolean; itemsCount?: number; title?: string; error?: string }>;
}

export const SourcesManager: React.FC<SourcesManagerProps> = ({
  sources,
  onToggleEnabled,
  onAddSource,
  onDeleteSource,
  onTestSource,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [feedUrl, setFeedUrl] = useState('');
  const [categoryId, setCategoryId] = useState('World');

  const [testingUrl, setTestingUrl] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ url: string; success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async (targetFeedUrl: string) => {
    setTestingUrl(targetFeedUrl);
    setTestResult(null);
    const res = await onTestSource(targetFeedUrl);
    setTestingUrl(null);

    if (res.success) {
      setTestResult({
        url: targetFeedUrl,
        success: true,
        message: `Valid RSS/Atom feed: "${res.title || 'Feed'}" — ${res.itemsCount} articles detected.`,
      });
    } else {
      setTestResult({
        url: targetFeedUrl,
        success: false,
        message: `Feed test failed: ${res.error || 'Unable to parse XML feed'}`,
      });
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAddSource({ name, url, feed_url: feedUrl, category_id: categoryId });
      setName('');
      setUrl('');
      setFeedUrl('');
      setIsAddOpen(false);
      setTestResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD9CE] dark:border-[#2D2C28]">
        <div>
          <h2 className="font-display text-2xl font-bold">
            News Wire Feeds ({sources.length})
          </h2>
          <p className="text-xs text-[#737373] dark:text-[#9E9B93] mt-0.5">
            Authorized RSS and Atom news feeds configured for automated scheduled ingestion.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAddOpen(true);
            setTestResult(null);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#8B2635] dark:bg-[#E06371] hover:bg-[#701E2B] text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New News Wire</span>
        </button>
      </div>

      {/* Test Result Toast Alert */}
      {testResult && (
        <div
          className={`p-3 rounded-xs text-xs flex items-center justify-between gap-2 border ${
            testResult.success
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300'
              : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
          <button onClick={() => setTestResult(null)} className="text-[#888] hover:text-black dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sources Table */}
      <div className="bg-white dark:bg-[#1A1918] border border-[#DDD9CE] dark:border-[#2D2C28] rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-[#E5E3DE] dark:divide-[#2D2C28]">
            <thead className="bg-[#FAF9F6] dark:bg-[#141412] text-[#737373] dark:text-[#9E9B93] uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Source & Desk</th>
                <th className="py-3 px-4">Feed Endpoint</th>
                <th className="py-3 px-4">Status & Sync</th>
                <th className="py-3 px-4">Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DE] dark:divide-[#2D2C28]">
              {sources.map((s) => {
                const isTesting = testingUrl === s.feed_url;
                return (
                  <tr key={s.id} className="hover:bg-[#FAF9F6] dark:hover:bg-[#161614] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#202020] dark:text-[#EDEBE6]">
                        {s.name}
                      </div>
                      <div className="text-[11px] text-[#737373] dark:text-[#9E9B93]">
                        Category: <strong className="text-[#8B2635] dark:text-[#E06371]">{s.category_id}</strong>
                      </div>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-[#888] hover:underline mt-0.5"
                      >
                        <span>{s.url}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#555] dark:text-[#AAA] max-w-xs truncate">
                      {s.feed_url}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            s.last_status === 'success'
                              ? 'bg-emerald-500'
                              : s.last_status === 'failed'
                              ? 'bg-red-500'
                              : 'bg-amber-400'
                          }`}
                        />
                        <span className="capitalize font-medium">
                          {s.last_status || 'Never Synced'}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#888] mt-0.5">
                        {s.last_fetched_at ? formatRelativeTime(s.last_fetched_at) : 'Pending first run'}
                      </div>
                      {s.error_count > 0 && (
                        <div className="text-[10px] text-red-600 mt-0.5">
                          {s.error_count} failure(s) • {s.last_error}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onToggleEnabled(s.id, Boolean(s.enabled))}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                          s.enabled
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {s.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleTest(s.feed_url)}
                        disabled={isTesting}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-[#DDD9CE] dark:border-[#333] rounded-xs hover:border-[#8B2635] dark:hover:border-[#E06371] cursor-pointer"
                        title="Test feed parsing live"
                      >
                        {isTesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                        <span>Test</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete source "${s.name}"?`)) onDeleteSource(s.id);
                        }}
                        className="p-1 text-[#888] hover:text-red-600 rounded transition-colors"
                        title="Delete source"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Source Modal Dialog */}
      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsAddOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#FAF9F6] dark:bg-[#161614] text-[#202020] dark:text-[#EDEBE6] rounded-xs shadow-2xl border border-[#DDD9CE] dark:border-[#2C2A26] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DE] dark:border-[#2D2C28]">
              <h3 className="font-display text-lg font-bold">Add Authorized News Feed</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-[#888] hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#555] dark:text-[#AAA] mb-1">
                  Source Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Reuters World, BBC News, The Hindu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1E1D1B] border border-[#DDD9CE] dark:border-[#333] rounded-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#555] dark:text-[#AAA] mb-1">
                  Main Publisher Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://www.reuters.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1E1D1B] border border-[#DDD9CE] dark:border-[#333] rounded-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#555] dark:text-[#AAA] mb-1">
                  RSS or Atom Feed URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://feeds.bbci.co.uk/news/world/rss.xml"
                    value={feedUrl}
                    onChange={(e) => setFeedUrl(e.target.value)}
                    required
                    className="flex-1 px-3 py-2 text-xs bg-white dark:bg-[#1E1D1B] border border-[#DDD9CE] dark:border-[#333] rounded-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleTest(feedUrl)}
                    disabled={!feedUrl || testingUrl === feedUrl}
                    className="px-3 py-2 bg-[#EAE7DF] dark:bg-[#22211E] text-xs font-medium rounded-xs hover:text-[#8B2635] dark:hover:text-[#E06371] shrink-0"
                  >
                    {testingUrl === feedUrl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Validate'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#555] dark:text-[#AAA] mb-1">
                  Target Editorial Desk
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1E1D1B] border border-[#DDD9CE] dark:border-[#333] rounded-xs"
                >
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

              <div className="pt-3 border-t border-[#E5E3DE] dark:border-[#2D2C28] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-[#DDD9CE] dark:border-[#333] text-xs font-semibold rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#8B2635] dark:bg-[#E06371] text-white text-xs font-semibold rounded-xs"
                >
                  {loading ? 'Adding...' : 'Add Source'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
