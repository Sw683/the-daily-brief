import React, { useState } from 'react';
import { Newspaper, Lock, User, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string, user: { username: string; role: string }) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [username, setUsername] = useState('editor');
  const [password, setPassword] = useState('DailyBrief2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Login failed. Please verify credentials.');
      }

      localStorage.setItem('daily_brief_admin_token', data.token);
      localStorage.setItem('daily_brief_admin_user', JSON.stringify(data.user));
      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Network error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#121211] text-[#202020] dark:text-[#EDEBE6] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1A1918] border border-[#DDD9CE] dark:border-[#2D2C28] p-6 sm:p-8 rounded-xs shadow-md">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#9E9B93] hover:text-[#8B2635] dark:hover:text-[#E06371] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Broadsheet</span>
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#F7EAEC] dark:bg-[#2A1719] flex items-center justify-center text-[#8B2635] dark:text-[#E06371]">
            <Newspaper className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Editorial Desk Access
          </h1>
          <p className="text-xs text-[#737373] dark:text-[#9E9B93]">
            The Daily Brief Editorial Management & Wire Ingestion
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xs text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#555] dark:text-[#AAA] mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#888] absolute left-3 top-2.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F6] dark:bg-[#141412] border border-[#DDD9CE] dark:border-[#333] rounded-xs focus:outline-hidden focus:border-[#8B2635] dark:focus:border-[#E06371]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#555] dark:text-[#AAA] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#888] absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F6] dark:bg-[#141412] border border-[#DDD9CE] dark:border-[#333] rounded-xs focus:outline-hidden focus:border-[#8B2635] dark:focus:border-[#E06371]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#8B2635] dark:bg-[#E06371] hover:bg-[#701E2B] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Editorial Portal</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E5E3DE] dark:border-[#2D2C28] text-center">
          <p className="text-[11px] text-[#737373] dark:text-[#9E9B93]">
            Default credentials pre-filled for evaluation: <code className="text-[#8B2635] dark:text-[#E06371]">editor</code> / <code className="text-[#8B2635] dark:text-[#E06371]">DailyBrief2026!</code>
          </p>
        </div>
      </div>
    </div>
  );
};
