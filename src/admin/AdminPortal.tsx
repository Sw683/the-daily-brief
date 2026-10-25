import React, { useState, useEffect } from 'react';
import type { Article, NewsSource, CollectionLog, OverviewStats, ArticleStatus } from '../types/news';
import { AdminLogin } from './AdminLogin';
import { AdminOverview } from './AdminOverview';
import { ReviewQueue } from './ReviewQueue';
import { ArticlesManager } from './ArticlesManager';
import { SourcesManager } from './SourcesManager';
import { CollectionLogs } from './CollectionLogs';
import { ArticleEditorModal } from './ArticleEditorModal';
import {
  Newspaper,
  LayoutDashboard,
  Inbox,
  FileText,
  Radio,
  Clock,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminPortalProps {
  onBackToSite: () => void;
  onRefreshPublicArticles: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToSite,
  onRefreshPublicArticles,
}) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('daily_brief_admin_token'));
  const [adminUser, setAdminUser] = useState<{ username: string; role: string } | null>(() => {
    try {
      const saved = localStorage.getItem('daily_brief_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'articles' | 'sources' | 'logs'>('overview');
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [adminArticles, setAdminArticles] = useState<Article[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [logs, setLogs] = useState<CollectionLog[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = () => {
    localStorage.removeItem('daily_brief_admin_token');
    localStorage.removeItem('daily_brief_admin_user');
    setToken(null);
    setAdminUser(null);
  };

  const authHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Fetch all admin data
  const fetchAllData = async () => {
    if (!token) return;
    try {
      const [overviewRes, articlesRes, sourcesRes, logsRes] = await Promise.all([
        fetch('/api/admin/overview', { headers: authHeaders }),
        fetch('/api/admin/articles?limit=200', { headers: authHeaders }),
        fetch('/api/admin/sources', { headers: authHeaders }),
        fetch('/api/admin/logs', { headers: authHeaders }),
      ]);

      if (overviewRes.status === 401 || overviewRes.status === 403) {
        handleLogout();
        return;
      }

      if (overviewRes.ok) {
        const d = await overviewRes.json();
        setStats(d.stats);
      }
      if (articlesRes.ok) {
        const d = await articlesRes.json();
        setAdminArticles(d.articles);
      }
      if (sourcesRes.ok) {
        const d = await sourcesRes.json();
        setSources(d.sources);
      }
      if (logsRes.ok) {
        const d = await logsRes.json();
        setLogs(d.logs);
      }
    } catch (err: any) {
      console.error('[Admin] Error refreshing data:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  // Actions
  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}/status`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ status: 'approved' }),
      });
      if (res.ok) {
        showToast('Article approved and published to public broadsheet!');
        await fetchAllData();
        onRefreshPublicArticles();
      }
    } catch {
      showToast('Failed to approve article', 'error');
    }
  };

  const handleReject = async (id: string, reason?: string) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}/status`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ status: 'rejected', rejection_reason: reason }),
      });
      if (res.ok) {
        showToast('Article marked as rejected.');
        await fetchAllData();
        onRefreshPublicArticles();
      }
    } catch {
      showToast('Failed to reject article', 'error');
    }
  };

  const handleUpdateStatus = async (id: string, status: ArticleStatus) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}/status`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast(`Article status updated to ${status}.`);
        await fetchAllData();
        onRefreshPublicArticles();
      }
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleBulkStatus = async (ids: string[], status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/articles/bulk-status', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ ids, status }),
      });
      if (res.ok) {
        showToast(`Bulk updated ${ids.length} articles to ${status}.`);
        await fetchAllData();
        onRefreshPublicArticles();
      }
    } catch {
      showToast('Bulk update failed', 'error');
    }
  };

  const handleSaveArticleEdit = async (id: string, updates: Partial<Article>) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        showToast('Article metadata updated successfully.');
        await fetchAllData();
        onRefreshPublicArticles();
      }
    } catch {
      showToast('Failed to update article', 'error');
    }
  };

  const handleToggleSourceEnabled = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/sources/${id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ enabled: !current }),
      });
      if (res.ok) {
        showToast(`Source ${!current ? 'enabled' : 'disabled'}.`);
        await fetchAllData();
      }
    } catch {
      showToast('Failed to update source state', 'error');
    }
  };

  const handleAddSource = async (data: { name: string; url: string; feed_url: string; category_id: string }) => {
    try {
      const res = await fetch('/api/admin/sources', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        showToast(`News source "${data.name}" added successfully.`);
        await fetchAllData();
      } else {
        showToast(resData.error || 'Failed to add source', 'error');
      }
    } catch {
      showToast('Network error while adding source', 'error');
    }
  };

  const handleDeleteSource = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/sources/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.ok) {
        showToast('News source deleted.');
        await fetchAllData();
      }
    } catch {
      showToast('Failed to delete source', 'error');
    }
  };

  const handleTestSource = async (feedUrl: string) => {
    try {
      const res = await fetch('/api/admin/sources/test', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ feed_url: feedUrl }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, itemsCount: data.itemsCount, title: data.title };
      }
      return { success: false, error: data.details || data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const handleTriggerCollection = async () => {
    setIsCollecting(true);
    try {
      const res = await fetch('/api/admin/collect', {
        method: 'POST',
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Collection complete: ${data.summary.itemsSaved} new dispatches, ${data.summary.itemsDuplicate} duplicates.`);
        await fetchAllData();
      } else {
        showToast(data.error || 'Collection run failed', 'error');
      }
    } catch (err: any) {
      showToast('Network error triggering collection', 'error');
    } finally {
      setIsCollecting(false);
    }
  };

  // If not logged in, show AdminLogin screen
  if (!token) {
    return (
      <AdminLogin
        onLoginSuccess={(tok, usr) => {
          setToken(tok);
          setAdminUser(usr);
        }}
        onBackToSite={onBackToSite}
      />
    );
  }

  const pendingCount = stats?.pendingArticles || 0;

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#121211] text-[#202020] dark:text-[#EDEBE6] transition-colors flex flex-col">
      {/* Admin Top Navigation Bar */}
      <header className="bg-white dark:bg-[#1A1918] border-b border-[#DDD9CE] dark:border-[#2D2C28] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#8B2635] dark:text-[#E06371]" />
              <span className="font-display font-bold text-lg">The Daily Brief</span>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-[#F7EAEC] dark:bg-[#2A1719] text-[#8B2635] dark:text-[#E06371]">
              Newsroom Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#737373] dark:text-[#9E9B93] hidden sm:inline">
              Signed in as <strong className="text-[#202020] dark:text-white">{adminUser?.username || 'editor'}</strong>
            </span>

            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#DDD9CE] dark:border-[#333] rounded-xs hover:border-[#8B2635] dark:hover:border-[#E06371] transition-colors"
            >
              <span>View Public Broadsheet</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 p-1.5 text-xs text-[#888] hover:text-red-600 rounded-xs transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none border-t border-[#F0EDE4] dark:border-[#22211F] pt-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold tracking-wide uppercase transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-[#8B2635] dark:border-[#E06371] text-[#8B2635] dark:text-[#E06371]'
                : 'border-transparent text-[#666] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold tracking-wide uppercase transition-colors border-b-2 ${
              activeTab === 'queue'
                ? 'border-[#8B2635] dark:border-[#E06371] text-[#8B2635] dark:text-[#E06371]'
                : 'border-transparent text-[#666] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Review Queue</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-[#8B2635] dark:bg-[#E06371] text-white font-mono">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold tracking-wide uppercase transition-colors border-b-2 ${
              activeTab === 'articles'
                ? 'border-[#8B2635] dark:border-[#E06371] text-[#8B2635] dark:text-[#E06371]'
                : 'border-transparent text-[#666] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>All Articles</span>
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold tracking-wide uppercase transition-colors border-b-2 ${
              activeTab === 'sources'
                ? 'border-[#8B2635] dark:border-[#E06371] text-[#8B2635] dark:text-[#E06371]'
                : 'border-transparent text-[#666] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>News Wire Feeds</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold tracking-wide uppercase transition-colors border-b-2 ${
              activeTab === 'logs'
                ? 'border-[#8B2635] dark:border-[#E06371] text-[#8B2635] dark:text-[#E06371]'
                : 'border-transparent text-[#666] dark:text-[#AAA] hover:text-[#202020] dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Ingestion Logs</span>
          </button>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div
            className={`px-4 py-2.5 rounded-xs shadow-lg text-xs font-medium flex items-center gap-2 text-white ${
              toastMessage.type === 'success' ? 'bg-emerald-700' : 'bg-red-700'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Admin Content Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
        {activeTab === 'overview' && (
          <AdminOverview
            stats={stats}
            onNavigateTab={setActiveTab}
            onTriggerCollection={handleTriggerCollection}
            isCollecting={isCollecting}
          />
        )}

        {activeTab === 'queue' && (
          <ReviewQueue
            articles={adminArticles}
            onApprove={handleApprove}
            onReject={handleReject}
            onEdit={(art) => setEditingArticle(art)}
            onBulkStatus={handleBulkStatus}
          />
        )}

        {activeTab === 'articles' && (
          <ArticlesManager
            articles={adminArticles}
            onUpdateStatus={handleUpdateStatus}
            onEdit={(art) => setEditingArticle(art)}
          />
        )}

        {activeTab === 'sources' && (
          <SourcesManager
            sources={sources}
            onToggleEnabled={handleToggleSourceEnabled}
            onAddSource={handleAddSource}
            onDeleteSource={handleDeleteSource}
            onTestSource={handleTestSource}
          />
        )}

        {activeTab === 'logs' && (
          <CollectionLogs
            logs={logs}
            onTriggerCollection={handleTriggerCollection}
            isCollecting={isCollecting}
          />
        )}
      </main>

      {/* Article Editor Modal */}
      <ArticleEditorModal
        article={editingArticle}
        onClose={() => setEditingArticle(null)}
        onSave={handleSaveArticleEdit}
      />
    </div>
  );
};
