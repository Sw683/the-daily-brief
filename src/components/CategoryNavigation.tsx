import React from 'react';
import type { NewsCategory } from '../types/news';

interface CategoryNavigationProps {
  categories: NewsCategory[];
  activeCategory: NewsCategory;
  onSelectCategory: (cat: NewsCategory) => void;
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <nav className="w-full bg-[#FAF9F6] dark:bg-[#121211] border-b border-[#E5E3DE] dark:border-[#2D2C28] sticky top-0 z-30 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Horizontal scroll container for all devices */}
        <div className="flex items-center justify-start md:justify-center overflow-x-auto scrollbar-none py-1 space-x-1 sm:space-x-2">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`relative px-3.5 py-2 text-xs sm:text-[13px] font-medium tracking-wide uppercase whitespace-nowrap transition-all duration-150 rounded-xs ${
                  isActive
                    ? 'text-[#8B2635] dark:text-[#E06371] font-semibold'
                    : 'text-[#555555] dark:text-[#A09D96] hover:text-[#202020] dark:hover:text-[#EDEBE6] hover:bg-[#F2EFE9] dark:hover:bg-[#1B1A18]'
                }`}
              >
                <span>{category}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#8B2635] dark:bg-[#E06371] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
