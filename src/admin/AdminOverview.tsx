import React from 'react';
import type { OverviewStats } from '../types/news';
import { formatRelativeTime } from '../utils/dateUtils';
import {
  Inbox,
  CheckCircle2,
  Radio,
  Clock,
  RefreshCw,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface AdminOverviewProps {
  stats: OverviewStats | null;
  onNavigateTab: (tab: 'queue' | 'articles' | 'sources' | 'logs') => void;
  onTriggerCollection: () => void;
  isCollecting: boolean;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  stats,
  onNavigateTab,
  onTriggerCollection,
  isCollecting,
}) => {
  if (!stats) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner with Manual Collection Trigger */}
      <div className="p-5 sm:p-6 bg-white dark:bg-[#1A1918] border border-[#DDD9CE] dark:border-[#2D2C28] rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B2635] dark:text-[#E06371] block">
            Ingestion & Curation Status
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold mt-0.5">
            Editorial Pipeline Overview
          </h2>
          <p className="text-xs text-[#737373] dark:text-[#9E9B93] mt-1">
            Incoming dispatches enter the review queue before reaching the public broadsheet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTriggerCollection}
            disabled={isCollecting || stats.isCollectionRunning}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#8B2635] dark:bg-[#E06371] hover:bg-[#701E2B] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCollecting || stats.isCollectionRunning ? 'animate-spin' : ''}`} />
            <span>{isCollecting || stats.isCollectionRunning ? 'Collecting Wire Feeds...' : 'Trigger Wire Ingestion'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Review Queue */}
        <div 
          onClick={() => onNavigateTab('queue')}
          className="p-5 bg-white dark:bg-[#1A1918] border border-[#DDD9CE] dark:border-[#2D2C28] rounded-xs cursor-pointer hover:border-[#8B2635] dark:hover:border-[#E06371] transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#888]">
              Review Queue
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {stats.pendingArticles}
            </span>
            <span className="text-xs text-[#737373] dark:text-[#9E9B93]">awaiting review</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-[#8B2635] dark:text-[#E06371] font-medium group-hover:underline">
            <span>Process queue</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Approved / Published */}
        <div 
          onClick={() => onNavigateTab('articles')}
          className="p-5 bg-white dark:bg-[#1A1918] border border-[#DDD9CE] dark:border-[#2D2C28] rounded-xs cursor-pointer hover:border-emerald-600 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#888]">
              Published Dispatches
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {stats.approvedArticles}
            </span>
            <span className="text-xs text-[#737373] dark:text-[#9E9B93]">live on site</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-medium group-hover:underline">
            <span>View published</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: Active News Sources */}
        <div 
          onClick={() => onNavigateTab('sources')}
          className="p-5 bg-white dark:bg-[#1A1918] border border-[#DDD9CE] dark:border-[#2D2C28] rounded-xs cursor-pointer hover:border-sky-600 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#888]">
              Active Wire Sources
            </span>
            <div className="w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-[#202020] dark:text-[#EDEBE6]">
              {stats.activeSources}
            </span>
            <span className="text-xs text-[#737373] dark:text-[#9E9B93]">of {stats.totalSources} configured</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-sky-700 dark:text-sky-400 font-medium group-hover:underline">
            <span>Manage sources</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 4: Last Ingestion Timestamp */}
        <div 
          onClick={() => onNavigateTab('logs')}
          className="p-5 bg-white dark:bg-[#1A1918] border border-[#DDD9CE] dark:border-[#2D2C28] rounded-xs cursor-pointer hover:border-purple-600 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#888]">
              Last Wire Sync
            </span>
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-semibold text-[#202020] dark:text-[#EDEBE6] truncate">
              {stats.lastCollectionTime ? formatRelativeTime(stats.lastCollectionTime) : 'Never'}
            </div>
            <span className="text-[11px] text-[#737373] dark:text-[#9E9B93]">
              Status: <strong className="uppercase text-emerald-600 dark:text-emerald-400">{stats.lastCollectionStatus}</strong>
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-purple-700 dark:text-purple-400 font-medium group-hover:underline">
            <span>View execution logs</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Editorial Guidelines & Integrity Note */}
      <div className="p-5 bg-[#F5F3EC] dark:bg-[#1C1B19] border border-[#DDD9CE] dark:border-[#2D2C28] rounded-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B2635] dark:text-[#E06371]">
          <AlertTriangle className="w-4 h-4" />
          <span>Editorial Standards Reminder</span>
        </div>
        <p className="text-xs text-[#555] dark:text-[#A09D96] leading-relaxed">
          • All incoming wire dispatches enter the Review Queue before publication.<br />
          • Reviewers should verify source attribution, accuracy of headline summaries, and assign appropriate desk categories.<br />
          • Never invent authors, quotes, or publication timestamps. Reject dispatches containing unverified or defamatory claims.
        </p>
      </div>
    </div>
  );
};
