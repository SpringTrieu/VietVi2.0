import React, { useState } from 'react';
import { TaskItem, OfferItem, TaskStatus } from '../../types';
import { Plus, Clock, Users, CheckCircle2, ChevronDown, ChevronUp, ArrowRight, ShieldCheck, ClipboardList } from 'lucide-react';

interface MyTasksScreenProps {
  tasks: TaskItem[];
  offers: OfferItem[];
  onOpenPostTask: () => void;
  onAcceptOffer: (task: TaskItem, offer: OfferItem) => void;
  onSelectTaskDetail: (task: TaskItem) => void;
  onNavigateToOrders?: () => void;
}

export const MyTasksScreen: React.FC<MyTasksScreenProps> = ({
  tasks,
  offers,
  onOpenPostTask,
  onAcceptOffer,
  onSelectTaskDetail,
  onNavigateToOrders,
}) => {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>('tsk-001');

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'ALL') return true;
    return t.status === activeTab;
  });

  const getOffersForTask = (taskId: string) => {
    return offers.filter((o) => o.taskId === taskId);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Vai trò: Người yêu cầu (Requester)</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#62646a]">Quản lý Task đã đăng</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
            Danh sách Task của tôi
          </h1>
          <p className="text-xs sm:text-sm text-[#62646a] mt-1">
            Theo dõi các Task bạn đã tạo, so sánh báo giá từ các bạn sinh viên và chấp nhận đề xuất để tạo Order.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onNavigateToOrders && (
            <button
              onClick={onNavigateToOrders}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xl transition-all cursor-pointer"
            >
              <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
              <span>Quản lý Đơn hàng (ORDER-01)</span>
            </button>
          )}

          <button
            onClick={onOpenPostTask}
            className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Đăng Task mới</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 my-6 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'ALL'
              ? 'bg-[#222325] text-white'
              : 'bg-white text-[#62646a] hover:text-[#222325] border border-neutral-200'
          }`}
        >
          Tất cả ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('OPEN')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'OPEN'
              ? 'bg-emerald-700 text-white'
              : 'bg-white text-[#62646a] hover:text-[#222325] border border-neutral-200'
          }`}
        >
          Đang mở nhận báo giá (OPEN)
        </button>
        <button
          onClick={() => setActiveTab('AWARDED')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'AWARDED'
              ? 'bg-blue-700 text-white'
              : 'bg-white text-[#62646a] hover:text-[#222325] border border-neutral-200'
          }`}
        >
          Đã trao & Đang làm (AWARDED)
        </button>
        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'COMPLETED'
              ? 'bg-neutral-900 text-white'
              : 'bg-white text-[#62646a] hover:text-[#222325] border border-neutral-200'
          }`}
        >
          Đã hoàn tất (COMPLETED)
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const taskOffers = getOffersForTask(task.id);
          const isExpanded = expandedTaskId === task.id;

          return (
            <div
              key={task.id}
              className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden transition-all"
            >
              {/* Task summary bar */}
              <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-[#62646a] flex-wrap">
                    <span className="font-semibold text-[#222325]">{task.categoryName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">#{task.id}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        task.status === 'OPEN'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : task.status === 'AWARDED'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {task.status}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Đăng {task.createdAt}</span>
                  </div>

                  <h3
                    onClick={() => onSelectTaskDetail(task)}
                    className="text-base font-bold text-[#222325] hover:text-emerald-700 cursor-pointer truncate"
                  >
                    {task.title}
                  </h3>

                  <p className="text-xs text-[#62646a] line-clamp-1">
                    <span className="font-semibold text-[#222325]">Nghiệm thu:</span> {task.expectedOutput}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
                  <div>
                    <span className="block text-[11px] text-[#62646a]">Ngân sách</span>
                    <span className="text-base font-bold text-[#222325] font-mono tabular-nums">
                      {formatVND(task.budget)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[11px] text-[#62646a] flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" /> Hạn chót
                    </span>
                    <span className="text-xs font-semibold text-[#222325]">{task.deadline.split(' ngày ')[0]}</span>
                  </div>

                  {/* Toggle proposals list */}
                  <button
                    onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#222325] transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{taskOffers.length} Báo giá</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Proposals Drawer */}
              {isExpanded && (
                <div className="bg-neutral-50/70 border-t border-neutral-100 p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <h4 className="font-bold text-[#222325] uppercase tracking-wider">
                      Các đề xuất đã nhận ({taskOffers.length})
                    </h4>
                    <span className="text-[#62646a]">
                      Quy tắc BR-01: Chấp nhận 1 đề xuất sẽ tạo 1 Order và tự động từ chối các đề xuất còn lại.
                    </span>
                  </div>

                  {taskOffers.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#62646a] bg-white rounded-xl border border-neutral-200">
                      Chưa có bạn sinh viên nào gửi báo giá cho Task này. Task đang hiển thị ở vị trí ưu tiên trên sàn.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {taskOffers.map((offer) => (
                        <div
                          key={offer.id}
                          className="bg-white rounded-xl p-4 border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          {/* Tasker info */}
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-full ${offer.tasker.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                              >
                                {offer.tasker.displayName.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-xs text-[#222325]">
                                    {offer.tasker.displayName}
                                  </span>
                                  {offer.tasker.isVerifiedStudent && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold">
                                      <ShieldCheck className="w-3 h-3" /> Đã xác minh SV
                                    </span>
                                  )}
                                  <span className="text-xs text-[#62646a]">★ {offer.tasker.rating}</span>
                                </div>
                                <p className="text-[11px] text-[#62646a] truncate">
                                  {offer.tasker.major} · {offer.tasker.university}
                                </p>
                              </div>
                            </div>

                            <p className="text-xs text-[#404145] pl-10 leading-relaxed bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                              &ldquo;{offer.message}&rdquo;
                            </p>
                          </div>

                          {/* Offer financials & Accept CTA */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-neutral-100 pt-2 sm:pt-0">
                            <div className="text-left sm:text-right">
                              <span className="text-sm sm:text-base font-bold text-[#222325] font-mono tabular-nums">
                                {formatVND(offer.proposedPrice)}
                              </span>
                              <span className="block text-[11px] text-[#62646a]">
                                Hoàn thành trong {offer.deliveryDays} ngày
                              </span>
                            </div>

                            {task.status === 'OPEN' && offer.status === 'PENDING' ? (
                              <button
                                onClick={() => onAcceptOffer(task, offer)}
                                className="px-4 py-2 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Chấp nhận & Tạo Order</span>
                              </button>
                            ) : (
                              <span
                                className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                                  offer.status === 'ACCEPTED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-neutral-100 text-neutral-500'
                                }`}
                              >
                                {offer.status === 'ACCEPTED' ? 'Đã được bạn chọn' : 'Không được chọn'}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
