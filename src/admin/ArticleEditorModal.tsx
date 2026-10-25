import React, { useState, useEffect } from 'react';
import type { Article, NewsCategory } from '../types/news';
import { X, Save } from 'lucide-react';

interface ArticleEditorModalProps {
  article: Article | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Article>) => Promise<void>;
}

export const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({
  article,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState<NewsCategory>('World');
  const [featured, setFeatured] = useState(false);
  const [secondary, setSecondary] = useState(false);
  const [editorPick, setEditorPick] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setSummary(article.summary);
      setCategory(article.category as NewsCategory);
      setFeatured(Boolean(article.featured));
      setSecondary(Boolean(article.secondary));
      setEditorPick(Boolean(article.editorPick));
    }
  }, [article]);

  if (!article) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(article.id, {
        title,
        summary,
        category: category as any,
        featured,
        secondary,
        editorPick,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF9F6] dark:bg-[#161614] text-[#202020] dark:text-[#EDEBE6] rounded-xs shadow-2xl border border-[#DDD9CE] dark:border-[#2C2A26] overflow-hidden p-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DE] dark:border-[#2D2C28]">
          <h3 className="font-display text-xl font-bold">Edit Dispatch Metadata</h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#888] hover:text-black dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#555] dark:text-[#AAA] mb-1">
              Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1E1D1B] border border-[#DDD9CE] dark:border-[#333] rounded-xs focus:outline-hidden focus:border-[#8B2635] dark:focus:border-[#E06371]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#555] dark:text-[#AAA] mb-1">
              Permitted Editorial Summary / Snippet
            </label>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1E1D1B] border border-[#DDD9CE] dark:border-[#333] rounded-xs focus:outline-hidden focus:border-[#8B2635] dark:focus:border-[#E06371] leading-relaxed"
            />
            <span className="text-[11px] text-[#888]">
              Keep summaries concise and strictly factual. Do not copy full copyrighted articles.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#555] dark:text-[#AAA] mb-1">
                Desk / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NewsCategory)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1E1D1B] border border-[#DDD9CE] dark:border-[#333] rounded-xs focus:outline-hidden focus:border-[#8B2635] dark:focus:border-[#E06371]"
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

            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#555] dark:text-[#AAA]">
                Broadsheet Layout Placement
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => {
                    setFeatured(e.target.checked);
                    if (e.target.checked) setSecondary(false);
                  }}
                  className="rounded text-[#8B2635] focus:ring-[#8B2635]"
                />
                <span>Set as Lead Featured Story</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={secondary}
                  onChange={(e) => {
                    setSecondary(e.target.checked);
                    if (e.target.checked) setFeatured(false);
                  }}
                  className="rounded text-[#8B2635] focus:ring-[#8B2635]"
                />
                <span>Place in Secondary Headlines Grid</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={editorPick}
                  onChange={(e) => setEditorPick(e.target.checked)}
                  className="rounded text-[#8B2635] focus:ring-[#8B2635]"
                />
                <span>Add Editor's Pick Badge</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E3DE] dark:border-[#2D2C28] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#DDD9CE] dark:border-[#333] text-xs font-semibold rounded-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#8B2635] dark:bg-[#E06371] hover:bg-[#701E2B] text-white text-xs font-semibold rounded-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
