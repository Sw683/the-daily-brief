import React from 'react';

export const BroadsheetSkeleton: React.FC = () => {
  return (
    <div className="space-y-10 animate-pulse" aria-label="Loading dispatches...">
      {/* 1. Lead Featured Story Skeleton */}
      <div className="pb-8 border-b border-[#E5E3DE] dark:border-[#2D2C28]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left: Featured Image Box */}
          <div className="lg:col-span-7">
            <div className="w-full aspect-16/10 bg-[#E8E5DC] dark:bg-[#201F1C] rounded-xs" />
            <div className="h-3 w-2/3 bg-[#E0DCD2] dark:bg-[#2A2925] rounded mt-2.5" />
          </div>

          {/* Right: Featured Story Headline & Summary */}
          <div className="lg:col-span-5 flex flex-col justify-between py-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-[#E0DCD2] dark:bg-[#2A2925] rounded" />
                <div className="h-4 w-16 bg-[#E0DCD2] dark:bg-[#2A2925] rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-7 w-full bg-[#DCD8CD] dark:bg-[#302E29] rounded" />
                <div className="h-7 w-5/6 bg-[#DCD8CD] dark:bg-[#302E29] rounded" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3.5 w-full bg-[#E5E2D9] dark:bg-[#252420] rounded" />
                <div className="h-3.5 w-full bg-[#E5E2D9] dark:bg-[#252420] rounded" />
                <div className="h-3.5 w-3/4 bg-[#E5E2D9] dark:bg-[#252420] rounded" />
              </div>
            </div>

            <div className="pt-6 border-t border-[#EFECE5] dark:border-[#282723] flex items-center justify-between">
              <div className="h-4 w-36 bg-[#E0DCD2] dark:bg-[#2A2925] rounded" />
              <div className="h-8 w-24 bg-[#E0DCD2] dark:bg-[#2A2925] rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Secondary Headlines 3-Col Skeleton */}
      <div className="pb-8 border-b border-[#E5E3DE] dark:border-[#2D2C28]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="w-full aspect-16/9 bg-[#E8E5DC] dark:bg-[#201F1C] rounded-xs" />
              <div className="flex justify-between items-center">
                <div className="h-3 w-16 bg-[#E0DCD2] dark:bg-[#2A2925] rounded" />
                <div className="h-3 w-12 bg-[#E0DCD2] dark:bg-[#2A2925] rounded" />
              </div>
              <div className="h-5 w-full bg-[#DCD8CD] dark:bg-[#302E29] rounded" />
              <div className="h-5 w-4/5 bg-[#DCD8CD] dark:bg-[#302E29] rounded" />
              <div className="h-3 w-full bg-[#E5E2D9] dark:bg-[#252420] rounded" />
              <div className="h-3 w-2/3 bg-[#E5E2D9] dark:bg-[#252420] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Latest News Wire List Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b-2 border-[#202020] dark:border-[#EDEBE6]">
          <div className="h-6 w-44 bg-[#DCD8CD] dark:bg-[#302E29] rounded" />
          <div className="h-4 w-28 bg-[#E0DCD2] dark:bg-[#2A2925] rounded" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="py-4 flex flex-col sm:flex-row gap-4 border-b border-[#EFECE5] dark:border-[#282723]">
            <div className="w-full sm:w-44 md:w-48 aspect-16/10 bg-[#E8E5DC] dark:bg-[#201F1C] rounded-xs shrink-0" />
            <div className="flex-1 space-y-2.5 py-1">
              <div className="h-3 w-32 bg-[#E0DCD2] dark:bg-[#2A2925] rounded" />
              <div className="h-5 w-4/5 bg-[#DCD8CD] dark:bg-[#302E29] rounded" />
              <div className="h-3.5 w-full bg-[#E5E2D9] dark:bg-[#252420] rounded" />
              <div className="h-3.5 w-2/3 bg-[#E5E2D9] dark:bg-[#252420] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
