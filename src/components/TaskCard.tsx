import React from 'react';
import { TaskItem } from '../types';
import { Clock, Users, MapPin, CheckCircle, ArrowUpRight, Paperclip, Bookmark } from 'lucide-react';

interface TaskCardProps {
  task: TaskItem;
  onSelectTask: (task: TaskItem) => void;
  onQuickOffer: (task: TaskItem) => void;
  isSaved?: boolean;
  onToggleSave?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onSelectTask,
  onQuickOffer,
  isSaved = false,
  onToggleSave,
}) => {
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'ONLINE':
        return 'Làm Online';
      case 'ONSITE':
        return 'Làm Onsite';
      default:
        return 'Linh hoạt';
    }
  };

  return (
    <div
      onClick={() => onSelectTask(task)}
      className="group bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-200 flex flex-col justify-between cursor-pointer text-left relative"
    >
      <div>
        {/* Card Header Metadata (Clean unboxed inline text, NO pill badge sandwich) */}
        <div className="flex items-center justify-between text-xs text-[#62646a] mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap font-medium">
            <span className="text-[#222325] font-semibold">{task.categoryName}</span>
            <span aria-hidden="true">·</span>
            <span>{getModeLabel(task.mode)}</span>
            <span aria-hidden="true">·</span>
            <span className={`inline-flex items-center gap-1 ${task.createdAt.includes('phút') || task.createdAt === 'Vừa xong' ? 'text-emerald-700 font-semibold' : 'text-neutral-500'}`}>
              <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
              <span>{task.createdAt}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Attachments indicator if present */}
            {task.attachments && task.attachments.length > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                <Paperclip className="w-3 h-3" />
                <span>{task.attachments.length}</span>
              </span>
            )}

            {/* Bookmark button */}
            {onToggleSave && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(task.id);
                }}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  isSaved
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100'
                }`}
                title={isSaved ? 'Bỏ lưu Task' : 'Lưu Task này'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Task Title */}
        <h3 className="text-base font-bold text-[#222325] group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
          {task.title}
        </h3>

        {/* Brief description */}
        <p className="mt-2 text-xs text-[#62646a] line-clamp-2 leading-relaxed">
          {task.description}
        </p>

        {/* Expected output preview */}
        <div className="mt-3 py-2 px-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs text-[#404145]">
          <span className="font-semibold text-[#222325]">Nghiệm thu: </span>
          <span className="line-clamp-1">{task.expectedOutput}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100 space-y-3">
        {/* Requester Identity & Trust Marker */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-full ${task.requester.avatarBg} text-white font-semibold text-xs flex items-center justify-center shrink-0`}
            >
              {task.requester.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-[#222325] truncate">
                  {task.requester.displayName}
                </span>
                {task.requester.isVerifiedStudent ? (
                  <span
                    title="Người yêu cầu uy tín: Đã xác minh sinh viên chính quy (Tick xanh)"
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-sm bg-blue-50 text-blue-700 border border-blue-200/60 text-[10px] font-semibold shrink-0"
                  >
                    <CheckCircle className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                    <span>Tick xanh SV</span>
                  </span>
                ) : (
                  <span
                    title="Người yêu cầu chưa gửi ảnh thẻ SV để xác thực tick xanh"
                    className="inline-flex items-center px-1.5 py-0.2 rounded-sm bg-neutral-100 text-neutral-400 text-[10px] shrink-0"
                  >
                    Chưa xác thực
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#62646a] truncate block">
                {task.requester.university}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="text-right text-xs shrink-0">
            <span className="font-bold text-[#222325]">★ {task.requester.rating.toFixed(1)}</span>
            <span className="text-[11px] text-neutral-400 block">({task.requester.reviewCount} đánh giá)</span>
          </div>
        </div>

        {/* Financial & Deadline Bottom Row */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <span className="block text-[11px] text-[#62646a]">Ngân sách giao dịch</span>
            <span className="text-base sm:text-lg font-bold text-[#222325] tabular-nums font-mono">
              {formatVND(task.budget)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="block text-[11px] text-[#62646a] flex items-center justify-end gap-1">
                <Clock className="w-3 h-3" /> Hạn chót
              </span>
              <span className="text-xs font-medium text-[#222325]">{task.deadline.split(' ngày ')[0]}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickOffer(task);
              }}
              className="p-2 rounded-xl bg-neutral-100 hover:bg-emerald-600 hover:text-white text-[#222325] transition-colors cursor-pointer"
              title="Gửi báo giá/đề xuất nhanh cho Task này"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#62646a] pt-1">
          <span className="flex items-center gap-1 font-medium">
            <Users className="w-3 h-3 text-neutral-400" />
            <span>{task.offersCount} đề xuất đã gửi</span>
          </span>
          <span className="text-emerald-700 font-semibold group-hover:underline">
            Chi tiết &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
