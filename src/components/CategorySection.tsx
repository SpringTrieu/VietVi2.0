import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { Palette, Code, GraduationCap, Languages, Video, MapPin, ArrowRight } from 'lucide-react';

interface CategorySectionProps {
  onSelectCategory: (categoryId: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ onSelectCategory }) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palette':
        return <Palette className="w-6 h-6 text-emerald-600" />;
      case 'Code':
        return <Code className="w-6 h-6 text-blue-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-indigo-600" />;
      case 'Languages':
        return <Languages className="w-6 h-6 text-rose-600" />;
      case 'Video':
        return <Video className="w-6 h-6 text-amber-600" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6 text-teal-600" />;
      default:
        return <Palette className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <section id="categories-section" className="py-14 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Danh mục chuyên môn
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222325] mt-0.5 tracking-tight">
              Khám phá theo lĩnh vực bạn cần
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#62646a] max-w-md">
            Từ thiết kế slide, lập trình đồ án, đến gia sư học phần và dịch thuật báo cáo.
          </p>
        </div>

        {/* Categories Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                const el = document.getElementById('market-tasks');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group bg-neutral-50/70 hover:bg-white p-6 rounded-2xl border border-neutral-200/80 hover:border-neutral-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mb-4 shadow-xs group-hover:scale-105 transition-transform">
                  {getCategoryIcon(cat.iconName)}
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#222325] group-hover:text-emerald-700 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-semibold text-neutral-400 font-mono">
                    {cat.taskCount} Task
                  </span>
                </div>

                <p className="text-xs text-[#62646a] mt-2 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-200/50 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>Xem danh sách Task</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
