import React from 'react';
import { TaskItem, TaskCategory, TaskMode, TaskTimeFilter, TaskTrustFilter } from '../../types';
import { UNIVERSITIES } from '../../data/mockData';
import { TaskCard } from '../TaskCard';
import { HeroSection } from '../HeroSection';
import { CategorySection } from '../CategorySection';
import { HowItWorks } from '../HowItWorks';
import { TrustPillars } from '../TrustPillars';
import { FaqSection } from '../FaqSection';
import {
  Lock,
  LogIn,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Grid,
  X,
  Filter,
  Clock,
  CheckCircle,
  RefreshCw,
  Search,
  GraduationCap,
} from 'lucide-react';

interface GuestScreenProps {
  tasks: TaskItem[];
  allTasksCount: number;
  categories: TaskCategory[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedUni: string;
  onSelectUni: (uni: string) => void;
  selectedMode: TaskMode | 'ALL';
  onSelectMode: (mode: TaskMode | 'ALL') => void;
  activeQuickTab: string;
  onSelectQuickTab: (tab: any) => void;
  priceFilter: string;
  onSelectPriceFilter: (p: any) => void;
  timeFilter?: TaskTimeFilter;
  onSelectTimeFilter?: (tf: TaskTimeFilter) => void;
  trustFilter?: TaskTrustFilter;
  onSelectTrustFilter?: (tf: TaskTrustFilter) => void;
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  onResetFilters: () => void;
  onTriggerAuth: (intent: string) => void;
  onSelectTask: (task: TaskItem) => void;
}

export const GuestScreen: React.FC<GuestScreenProps> = ({
  tasks,
  allTasksCount,
  categories,
  searchQuery,
  onSearchChange,
  selectedUni,
  onSelectUni,
  selectedMode,
  onSelectMode,
  activeQuickTab,
  onSelectQuickTab,
  priceFilter,
  onSelectPriceFilter,
  timeFilter = 'ALL',
  onSelectTimeFilter,
  trustFilter = 'ALL',
  onSelectTrustFilter,
  selectedCategoryId,
  onSelectCategory,
  onResetFilters,
  onTriggerAuth,
  onSelectTask,
}) => {
  const activeCategoryObject = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="space-y-0">
      {/* 1. Guest Guidance Notice Callout */}
      <aside aria-label="Thông báo chế độ Khách" className="bg-amber-500/10 border-b border-amber-500/20 py-3 px-4 text-xs text-amber-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Chế độ Khách (Guest Mode):</strong> Bạn có thể tự do tìm kiếm Task, xem danh mục, biểu phí và tiêu chuẩn nghiệm thu. Để đăng bài hoặc gửi báo giá nhận thù lao, vui lòng đăng nhập email trường qua mã OTP.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onTriggerAuth('LOGIN')}
              className="px-3.5 py-1.5 font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg whitespace-nowrap cursor-pointer transition-colors"
            >
              Đăng nhập / Đăng ký OTP
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Hero Section with Structured Search */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedUni={selectedUni}
        onSelectUni={onSelectUni}
        selectedMode={selectedMode}
        onSelectMode={onSelectMode}
        onOpenPostTask={() => onTriggerAuth('POST_TASK')}
        onOpenVerify={() => onTriggerAuth('VERIFY_STUDENT')}
      />

      {/* 3. Live Marketplace Tasks Section for Guest (CSS Selector 2: #market-tasks) */}
      <section id="market-tasks" className="py-12 sm:py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Synchronized Category Banner */}
          {activeCategoryObject && (
            <div className="mb-6 p-4 sm:p-5 bg-white rounded-2xl border-2 border-emerald-500/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                  <Grid className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Danh mục đang lọc
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      {tasks.length} Task phù hợp
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#222325]">
                    {activeCategoryObject.name}
                  </h3>
                  <p className="text-xs text-[#62646a] mt-0.5">
                    {activeCategoryObject.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectCategory('all')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
              >
                <X className="w-4 h-4" />
                <span>Xem tất cả danh mục</span>
              </button>
            </div>
          )}

          {/* Feed Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <span>Khám phá công khai</span>
                <span aria-hidden="true">·</span>
                <span className="font-normal text-[#62646a]">
                  Khách có thể xem chi tiết hồ sơ người yêu cầu và tiêu chuẩn nghiệm thu
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
                Các Task sinh viên đang mở (OPEN)
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#62646a]">
                Hiển thị <strong>{tasks.length}</strong> / {allTasksCount} Task
              </span>
              {(selectedCategoryId !== 'all' || searchQuery || selectedUni !== 'all' || selectedMode !== 'ALL' || activeQuickTab !== 'ALL' || priceFilter !== 'ALL' || timeFilter !== 'ALL' || trustFilter !== 'ALL') && (
                <button
                  onClick={onResetFilters}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Đặt lại bộ lọc</span>
                </button>
              )}
            </div>
          </div>

          {/* In-place Quick Search Bar inside #market-tasks */}
          <div className="mb-4 space-y-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm nhanh theo từ khóa Task, kỹ năng (Canva, Python, Slide...), môn học, trường đại học..."
                className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-neutral-200/90 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#1dbf73] focus:border-[#1dbf73] text-[#222325] placeholder:text-neutral-400"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100 cursor-pointer"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-[11px] font-semibold text-neutral-400 px-2 py-0.5 bg-neutral-100 rounded-md hidden sm:inline">
                  Lọc ngay
                </span>
              </div>
            </div>

            {/* Quick keyword chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none text-[11px] text-neutral-500">
              <span className="font-semibold text-neutral-400 shrink-0 flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Gợi ý:
              </span>
              {['Canva', 'Python', 'Slide Đồ án', 'Gia sư', 'Bách Khoa', 'Tiểu luận', 'Figma'].map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => onSearchChange(keyword)}
                  className={`px-2 py-0.5 rounded-md border text-[11px] transition-colors cursor-pointer shrink-0 ${
                    searchQuery.toLowerCase() === keyword.toLowerCase()
                      ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs'
                      : 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-600'
                  }`}
                >
                  {keyword}
                </button>
              ))}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="text-[11px] text-rose-600 hover:underline cursor-pointer shrink-0 ml-1 font-semibold"
                >
                  Xóa lọc từ khóa
                </button>
              )}
            </div>
          </div>

          {/* Quick Segmented Filter Tabs & Advanced Controls */}
          <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/90 shadow-xs mb-6 space-y-3">
            {/* Top Row: Quick Segmented Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-xs font-medium">
              <button
                onClick={() => {
                  onSelectQuickTab('ALL');
                  if (onSelectTimeFilter) onSelectTimeFilter('ALL');
                  if (onSelectTrustFilter) onSelectTrustFilter('ALL');
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeQuickTab === 'ALL' && timeFilter === 'ALL' && trustFilter === 'ALL'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
                }`}
              >
                Tất cả Task
              </button>

              {/* Quick Button: Mới nhất */}
              {onSelectTimeFilter && (
                <button
                  onClick={() => onSelectTimeFilter(timeFilter === 'NEWEST' ? 'ALL' : 'NEWEST')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    timeFilter === 'NEWEST'
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/80'
                  }`}
                  title="Sắp xếp ưu tiên các Task vừa mới đăng"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Mới nhất</span>
                  {timeFilter === 'NEWEST' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                </button>
              )}

              {/* Quick Button: Độ tin cậy (Tick xanh) */}
              {onSelectTrustFilter && (
                <button
                  onClick={() => onSelectTrustFilter(trustFilter === 'VERIFIED_ONLY' ? 'ALL' : 'VERIFIED_ONLY')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    trustFilter === 'VERIFIED_ONLY'
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80'
                  }`}
                  title="Chỉ hiển thị Task từ Người yêu cầu đã xác minh Thẻ sinh viên (Tick xanh)"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Có Tick xanh SV</span>
                </button>
              )}

              <button
                onClick={() => onSelectQuickTab('URGENT')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeQuickTab === 'URGENT'
                    ? 'bg-rose-700 text-white font-semibold shadow-xs'
                    : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
                }`}
              >
                Hạn gấp (&lt; 48h)
              </button>
              <button
                onClick={() => onSelectQuickTab('HIGH_BUDGET')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeQuickTab === 'HIGH_BUDGET'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
                }`}
              >
                Ngân sách &ge; 500k
              </button>
              <button
                onClick={() => onSelectQuickTab('ONLINE')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeQuickTab === 'ONLINE'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
                }`}
              >
                Làm Online
              </button>
              <button
                onClick={() => onSelectQuickTab('ONSITE')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeQuickTab === 'ONSITE'
                    ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                    : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
                }`}
              >
                Onsite tại trường
              </button>
            </div>

            {/* Secondary Filters Bar: Thời gian đăng, Độ tin cậy tick xanh, Ngân sách */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100">
              <div className="flex flex-wrap items-center gap-3">
                {/* Filter 1: Thời gian đăng (Mới nhất) */}
                {onSelectTimeFilter && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[#62646a] font-medium hidden sm:inline">Thời gian đăng:</span>
                    <select
                      value={timeFilter}
                      onChange={(e) => onSelectTimeFilter(e.target.value as any)}
                      className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                        timeFilter !== 'ALL'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-neutral-50 border-neutral-200 text-[#404145]'
                      }`}
                    >
                      <option value="ALL">Mọi thời điểm</option>
                      <option value="NEWEST">⚡ Mới nhất (Vừa đăng)</option>
                      <option value="PAST_24H">24 giờ qua (Hôm nay)</option>
                      <option value="PAST_3DAYS">3 ngày gần đây</option>
                    </select>
                  </div>
                )}

                {/* Filter 2: Độ tin cậy người yêu cầu (Có Tick xanh) */}
                {onSelectTrustFilter && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="text-[#62646a] font-medium hidden sm:inline">Độ tin cậy:</span>
                    <select
                      value={trustFilter}
                      onChange={(e) => onSelectTrustFilter(e.target.value as any)}
                      className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                        trustFilter !== 'ALL'
                          ? 'bg-blue-50 border-blue-300 text-blue-800'
                          : 'bg-neutral-50 border-neutral-200 text-[#404145]'
                      }`}
                    >
                      <option value="ALL">Tất cả người yêu cầu</option>
                      <option value="VERIFIED_ONLY">✓ Chỉ người có Tick xanh (Đã xác minh)</option>
                      <option value="TOP_REPUTATION">★ Uy tín cao nhất (Tick xanh &amp; 4.9★+)</option>
                    </select>
                  </div>
                )}

                {/* Filter 3: Mức ngân sách */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[#62646a] font-medium hidden sm:inline">Ngân sách:</span>
                  <select
                    value={priceFilter}
                    onChange={(e) => onSelectPriceFilter(e.target.value)}
                    className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                      priceFilter !== 'ALL'
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-neutral-50 border-neutral-200 text-[#404145]'
                    }`}
                  >
                    <option value="ALL">Mọi mức giá</option>
                    <option value="UNDER_300K">Dưới 300.000 đ</option>
                    <option value="300K_600K">300.000 đ - 600.000 đ</option>
                    <option value="OVER_600K">Trên 600.000 đ</option>
                  </select>
                </div>

                {/* Filter 4: Trường Đại học (Dropdown chính thức từ UNIVERSITIES) */}
                <div className="flex items-center gap-1.5 text-xs">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="text-[#62646a] font-medium hidden sm:inline">Trường ĐH:</span>
                  <select
                    value={selectedUni}
                    onChange={(e) => onSelectUni(e.target.value)}
                    className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors max-w-[200px] truncate ${
                      selectedUni !== 'all'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-bold'
                        : 'bg-neutral-50 border-neutral-200 text-[#404145]'
                    }`}
                    title="Lọc Task theo trường đại học"
                  >
                    <option value="all">Tất cả các trường (Toàn quốc)</option>
                    {UNIVERSITIES.filter((u) => u.id !== 'all').map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-[11px] text-[#62646a]">
                Đang hiển thị <strong>{tasks.length}</strong> kết quả
              </div>
            </div>

            {/* Quick University Pills Carousel (Chọn nhanh trường) */}
            <div className="pt-2 border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-xs">
              <span className="text-[11px] font-semibold text-neutral-400 shrink-0 flex items-center gap-1 mr-1">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                Chọn nhanh:
              </span>
              <button
                type="button"
                onClick={() => onSelectUni('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedUni === 'all'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                }`}
              >
                Toàn quốc
              </button>
              {UNIVERSITIES.filter((u) => u.id !== 'all').map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => onSelectUni(u.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedUni === u.id
                      ? 'bg-indigo-600 text-white font-bold shadow-2xs ring-2 ring-indigo-300'
                      : 'bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-neutral-700 font-medium'
                  }`}
                >
                  {u.name}
                </button>
              ))}
            </div>

            {/* Active Filter Chips with Individual Clear */}
            {(timeFilter !== 'ALL' || trustFilter !== 'ALL' || priceFilter !== 'ALL' || selectedUni !== 'all') && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100 text-xs">
                <span className="text-[#62646a] font-medium flex items-center gap-1">
                  <Filter className="w-3 h-3 text-neutral-400" />
                  Đang chọn lọc:
                </span>

                {/* Active Chip: Trường Đại học */}
                {selectedUni !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium">
                    <GraduationCap className="w-3 h-3 text-indigo-600" />
                    <span>
                      Trường: {UNIVERSITIES.find((u) => u.id === selectedUni)?.name || selectedUni}
                    </span>
                    <button
                      onClick={() => onSelectUni('all')}
                      className="hover:text-indigo-950 cursor-pointer ml-0.5 font-bold"
                      title="Bỏ lọc trường"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {timeFilter !== 'ALL' && onSelectTimeFilter && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>
                      {timeFilter === 'NEWEST' && 'Mới nhất'}
                      {timeFilter === 'PAST_24H' && '24 giờ qua'}
                      {timeFilter === 'PAST_3DAYS' && '3 ngày qua'}
                    </span>
                    <button
                      onClick={() => onSelectTimeFilter('ALL')}
                      className="hover:text-emerald-950 cursor-pointer ml-0.5"
                      title="Bỏ lọc thời gian"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {trustFilter !== 'ALL' && onSelectTrustFilter && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                    <span>
                      {trustFilter === 'VERIFIED_ONLY' && 'Người yêu cầu có Tick xanh'}
                      {trustFilter === 'TOP_REPUTATION' && 'Tick xanh & Uy tín ≥ 4.9★'}
                    </span>
                    <button
                      onClick={() => onSelectTrustFilter('ALL')}
                      className="hover:text-blue-950 cursor-pointer ml-0.5"
                      title="Bỏ lọc độ tin cậy"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {priceFilter !== 'ALL' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                    <span>
                      {priceFilter === 'UNDER_300K' && '< 300k'}
                      {priceFilter === '300K_600K' && '300k - 600k'}
                      {priceFilter === 'OVER_600K' && '> 600k'}
                    </span>
                    <button
                      onClick={() => onSelectPriceFilter('ALL')}
                      className="hover:text-amber-950 cursor-pointer ml-0.5"
                      title="Bỏ lọc ngân sách"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={onResetFilters}
                  className="text-[11px] text-neutral-500 hover:text-neutral-900 underline ml-auto cursor-pointer"
                >
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>

          {/* Trust Guidance Banner when Tick Xanh filter is active */}
          {trustFilter !== 'ALL' && (
            <div className="mb-6 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-blue-900">Bộ lọc Độ tin cậy kích hoạt:</span>{' '}
                  <span>
                    Chỉ hiển thị các Task từ Người yêu cầu đã có <strong>Tick xanh SV</strong> (xác thực thẻ sinh viên &amp; email trường đại học). Tất cả ngân sách được bảo chứng ký quỹ Escrow 100%!
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold shrink-0 self-start sm:self-auto">
                {tasks.length} Task có Tick xanh
              </span>
            </div>
          )}

          {/* Newest Tasks guidance banner */}
          {timeFilter === 'NEWEST' && trustFilter === 'ALL' && (
            <div className="mb-6 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-emerald-900">Đang ưu tiên Task mới nhất:</span>{' '}
                  <span>Sắp xếp các bài đăng vừa tạo từ 10 - 35 phút trước lên đầu trang để bạn nộp báo giá sớm nhất.</span>
                </div>
              </div>
              <span className="text-emerald-700 font-semibold shrink-0 hidden sm:inline">
                Cơ hội nhận Task cao nhất
              </span>
            </div>
          )}

          {/* Cards Grid */}
          {tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onSelectTask={onSelectTask}
                  onQuickOffer={() => onTriggerAuth('SUBMIT_OFFER')}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/90 max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                <Filter className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#222325]">
                  Không tìm thấy Task nào phù hợp
                </h3>
                <p className="text-xs text-[#62646a] mt-1">
                  Hãy thử đổi từ khóa tìm kiếm hoặc bấm đặt lại bộ lọc.
                </p>
              </div>
              <button
                onClick={onResetFilters}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl cursor-pointer"
              >
                Xem tất cả Task
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Categories Showcase */}
      <CategorySection onSelectCategory={onSelectCategory} />

      {/* 5. How It Works */}
      <HowItWorks />

      {/* 6. Trust Pillars */}
      <TrustPillars />

      {/* 7. FAQ */}
      <FaqSection />
    </div>
  );
};
