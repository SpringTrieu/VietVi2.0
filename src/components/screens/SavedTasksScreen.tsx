import React, { useState } from 'react';
import { TaskItem } from '../../types';
import { TaskCard } from '../TaskCard';
import {
  Bookmark,
  ArrowLeft,
  Sparkles,
  Filter,
  Search,
  Trash2,
  ListFilter,
} from 'lucide-react';

interface SavedTasksScreenProps {
  savedTasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onToggleSaveTask: (taskId: string) => void;
  onExploreTasks: () => void;
}

export const SavedTasksScreen: React.FC<SavedTasksScreenProps> = ({
  savedTasks,
  onSelectTask,
  onToggleSaveTask,
  onExploreTasks,
}) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'ONLINE' | 'ONSITE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = savedTasks.filter((task) => {
    if (filterMode !== 'ALL' && task.mode !== filterMode) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q) ||
        task.requester.university.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f7f7f8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
              <span>Hồ sơ cá nhân</span>
              <span>·</span>
              <span className="text-emerald-700">Danh sách theo dõi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
              Task đã lưu &amp; Theo dõi ({savedTasks.length})
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Các công việc bạn quan tâm, lưu lại để nghiên cứu yêu cầu hoặc chuẩn bị báo giá.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExploreTasks}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Khám phá thêm Task mới</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        {savedTasks.length > 0 && (
          <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/90 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm trong danh sách đã lưu..."
                className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 border-none rounded-xl text-xs placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]/30"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium">
              <span className="text-neutral-500 mr-1 hidden sm:inline">Hình thức:</span>
              <button
                onClick={() => setFilterMode('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterMode === 'ALL'
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterMode('ONLINE')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterMode === 'ONLINE'
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Online
              </button>
              <button
                onClick={() => setFilterMode('ONSITE')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterMode === 'ONSITE'
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Onsite trường
              </button>
            </div>
          </div>
        )}

        {/* Task Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onSelectTask={onSelectTask}
                onQuickOffer={onSelectTask}
                isSaved={true}
                onToggleSave={onToggleSaveTask}
              />
            ))}
          </div>
        ) : savedTasks.length > 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/90 max-w-md mx-auto space-y-3">
            <Filter className="w-10 h-10 text-neutral-300 mx-auto" />
            <h3 className="text-sm font-bold text-neutral-800">
              Không có Task nào khớp với bộ lọc
            </h3>
            <p className="text-xs text-neutral-500">
              Hãy thử tìm kiếm từ khóa khác hoặc chuyển sang chế độ xem Tất cả.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/90 max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
              <Bookmark className="w-8 h-8 text-neutral-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#222325]">
                Bạn chưa lưu Task nào
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Khi lướt sàn công việc, hãy bấm vào biểu tượng dấu trang (Bookmark) ở góc thẻ Task để lưu lại và theo dõi khi cần.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onExploreTasks}
                className="px-6 py-2.5 rounded-xl bg-[#1dbf73] text-white text-xs font-bold hover:bg-[#19a463] transition-colors cursor-pointer shadow-xs"
              >
                Khám phá Task đang mở ngay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
