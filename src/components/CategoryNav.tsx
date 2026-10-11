import React, { useRef, useEffect } from 'react';
import { CATEGORIES } from '../data/mockData';
import { TaskCategory } from '../types';
import { Palette, Code, GraduationCap, Languages, Video, MapPin, Grid } from 'lucide-react';

interface CategoryNavProps {
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  onScrollToMarketTasks?: () => void;
  categories?: TaskCategory[];
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategoryId,
  onSelectCategory,
  onScrollToMarketTasks,
  categories = CATEGORIES,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palette':
        return <Palette className="w-4 h-4" />;
      case 'Code':
        return <Code className="w-4 h-4" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4" />;
      case 'Languages':
        return <Languages className="w-4 h-4" />;
      case 'Video':
        return <Video className="w-4 h-4" />;
      case 'MapPin':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Grid className="w-4 h-4" />;
    }
  };

  const handleCategoryClick = (catId: string) => {
    onSelectCategory(catId);
    if (onScrollToMarketTasks) {
      onScrollToMarketTasks();
    } else {
      const element = document.getElementById('market-tasks');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="bg-white border-b border-neutral-200 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollContainerRef}
          className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none text-xs font-medium"
        >
          <button
            onClick={() => handleCategoryClick('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              selectedCategoryId === 'all'
                ? 'bg-[#222325] text-white font-bold shadow-xs'
                : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Tất cả danh mục</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#1dbf73] text-white font-bold shadow-xs scale-[1.02]'
                    : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-neutral-500'}>
                  {getCategoryIcon(cat.iconName)}
                </span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-emerald-800 text-white font-semibold'
                      : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {cat.taskCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
