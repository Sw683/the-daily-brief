import React from 'react';
import { AlertTriangle, RefreshCw, Database, Terminal } from 'lucide-react';

interface ErrorBannerProps {
  error: string;
  source: 'supabase' | 'express';
  onRetry: () => void;
  isRetrying?: boolean;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  error,
  source,
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div
      role="alert"
      className="my-6 p-5 sm:p-6 bg-[#FFF9F9] dark:bg-[#1C1314] border-2 border-[#8B2635] dark:border-[#E06371] rounded-xs shadow-sm text-[#202020] dark:text-[#EDEBE6] animate-fadeIn"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#F0D5D8] dark:border-[#381B1E]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xs bg-[#8B2635] text-white shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B2635] dark:text-[#E06371]">
                Editorial Dispatch System Advisory
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B2635]/10 dark:bg-[#E06371]/20 text-[#8B2635] dark:text-[#E06371] font-mono font-semibold">
                {source === 'supabase' ? 'Supabase PostgreSQL' : 'Express SQLite'}
              </span>
            </div>
            <h3 className="font-display text-xl font-bold text-[#8B2635] dark:text-[#E06371] leading-tight">
              Unable to Retrieve Published Dispatches
            </h3>
          </div>
        </div>

        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B2635] hover:bg-[#731F2C] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer disabled:opacity-50 shrink-0 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Retrying...' : 'Retry Connection'}</span>
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <div className="p-3 bg-[#FBF0F1] dark:bg-[#251617] border border-[#ECD1D4] dark:border-[#421D21] rounded-xs font-mono text-xs text-[#8B2635] dark:text-[#E06371] break-all">
          <strong>Error Details:</strong> {error}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#555] dark:text-[#A8A59E]">
          <div className="flex items-start gap-2 p-2.5 bg-white dark:bg-[#161514] rounded-xs border border-[#E5E3DE] dark:border-[#2D2C28]">
            <Database className="w-4 h-4 text-[#8B2635] dark:text-[#E06371] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#202020] dark:text-[#EDEBE6]">Database Diagnostics</p>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                {source === 'supabase'
                  ? 'Verify your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env, ensure tables are migrated, and verify RLS policies allow SELECT on approved articles.'
                  : 'Ensure the local Express backend is running on port 3001 using "npm run server" and that data/newspaper.db has read permissions.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 bg-white dark:bg-[#161514] rounded-xs border border-[#E5E3DE] dark:border-[#2D2C28]">
            <Terminal className="w-4 h-4 text-[#8B2635] dark:text-[#E06371] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#202020] dark:text-[#EDEBE6]">Developer Inspection</p>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                Open your browser DevTools (F12) → <strong>Network</strong> tab. Look for failed requests to{' '}
                <code className="text-[#8B2635] dark:text-[#E06371]">
                  {source === 'supabase' ? '/rest/v1/articles' : '/api/articles'}
                </code>{' '}
                to examine the response payload and HTTP status code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
