import React from 'react';
import { getTodayFormatted } from '../utils/dateUtils';
import { CloudSun, Globe2, Database } from 'lucide-react';

interface AnnouncementStripProps {
  dataSource?: 'supabase' | 'express';
  articleCount?: number;
  onOpenDemoInfo?: () => void;
}

export const AnnouncementStrip: React.FC<AnnouncementStripProps> = ({
  dataSource = 'express',
  articleCount,
  onOpenDemoInfo,
}) => {
  const today = getTodayFormatted();

  return (
    <div className="w-full bg-[#F4F2EC] dark:bg-[#181816] border-b border-[#E5E3DE] dark:border-[#2D2C28] text-xs text-[#737373] dark:text-[#9E9B93] transition-colors py-1.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
        {/* Left: Date & Edition */}
        <div className="flex items-center gap-3">
          <span className="font-medium text-[#202020] dark:text-[#EDEBE6]">{today}</span>
          <span className="hidden sm:inline text-[#C0BEB8] dark:text-[#3E3C38]">|</span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-[#8B2635] dark:text-[#E06371]" />
            <span>India & Global Edition</span>
          </span>
        </div>

        {/* Center: Editorial Motto */}
        <div className="hidden md:flex items-center gap-1.5 font-serif italic text-xs text-[#555555] dark:text-[#B0AEA8]">
          <span>"Your world, clearly reported."</span>
        </div>

        {/* Right: Weather / Location & Active Data Layer Badge */}
        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          <div className="hidden xs:flex items-center gap-1.5">
            <CloudSun className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>New Delhi 27°C</span>
          </div>

          <button
            onClick={onOpenDemoInfo}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-[#E8E5DC] dark:bg-[#252420] text-[#333] dark:text-[#CCC] hover:text-[#8B2635] dark:hover:text-[#E06371] transition-colors font-medium cursor-pointer"
            title="Inspect Data Layer Architecture"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Database className="w-3 h-3 text-[#8B2635] dark:text-[#E06371]" />
            <span>
              {dataSource === 'supabase' ? 'Supabase DB' : 'Express/SQLite'}
              {articleCount !== undefined ? ` (${articleCount} live)` : ''}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
