import React from 'react';
import type { CollectionLog } from '../types/news';
import { formatRelativeTime } from '../utils/dateUtils';
import { RefreshCw, CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';

interface CollectionLogsProps {
  logs: CollectionLog[];
  onTriggerCollection: () => Promise<void>;
  isCollecting: boolean;
}

export const CollectionLogs: React.FC<CollectionLogsProps> = ({
  logs,
  onTriggerCollection,
  isCollecting,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD9CE] dark:border-[#2D2C28]">
        <div>
          <h2 className="font-display text-2xl font-bold">
            Ingestion & Synchronization Logs ({logs.length})
          </h2>
          <p className="text-xs text-[#737373] dark:text-[#9E9B93] mt-0.5">
            Audit history of background scheduled syncs and manual wire collection runs.
          </p>
        </div>

        <button
          onClick={onTriggerCollection}
          disabled={isCollecting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B2635] dark:bg-[#E06371] hover:bg-[#701E2B] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isCollecting ? 'animate-spin' : ''}`} />
          <span>{isCollecting ? 'Ingesting Wire Dispatches...' : 'Run Wire Sync Now'}</span>
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-[#1A1918] border border-[#DDD9CE] dark:border-[#2D2C28] rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-[#E5E3DE] dark:divide-[#2D2C28]">
            <thead className="bg-[#FAF9F6] dark:bg-[#141412] text-[#737373] dark:text-[#9E9B93] uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp & Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Dispatches Found</th>
                <th className="py-3 px-4">New Saved</th>
                <th className="py-3 px-4">Duplicates Skipped</th>
                <th className="py-3 px-4">Diagnostics / Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DE] dark:divide-[#2D2C28]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#737373] dark:text-[#9E9B93]">
                    No collection execution logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF9F6] dark:hover:bg-[#161614] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#202020] dark:text-[#EDEBE6]">
                        {log.source_name || 'All Configured Sources'}
                      </div>
                      <div className="text-[10px] text-[#737373] dark:text-[#9E9B93] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{formatRelativeTime(log.started_at)}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          log.status === 'success'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                        }`}
                      >
                        {log.status === 'success' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{log.status}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium">
                      {log.items_found}
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                      +{log.items_saved}
                    </td>

                    <td className="py-3 px-4 font-mono text-[#888]">
                      {log.items_duplicate}
                    </td>

                    <td className="py-3 px-4 max-w-xs text-[11px]">
                      {log.error_message ? (
                        <span className="text-red-600 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span className="truncate">{log.error_message}</span>
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">Clean execution</span>
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
