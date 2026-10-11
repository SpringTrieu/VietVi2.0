import React, { useState } from 'react';
import { TaskItem, UserMode } from '../../types';
import { UserRole } from '../RoleSwitcherBar';
import {
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle,
  ShieldCheck,
  Paperclip,
  FileText,
  Download,
  Send,
  AlertTriangle,
  ArrowRightLeft,
  Users,
  Bookmark,
  Share2,
  Check,
} from 'lucide-react';

interface TaskDetailScreenProps {
  task: TaskItem;
  userRole: UserRole;
  userMode: UserMode;
  currentUserId: string;
  isSaved?: boolean;
  onToggleSave?: (taskId: string) => void;
  onBack: () => void;
  onTriggerAuth: (intent: string) => void;
  onToggleMode: () => void;
  onGoToMyTasks: () => void;
  onSubmitOffer: (taskId: string, proposedPrice: number, deliveryDays: number, message: string) => void;
  onOpenReport: (task: TaskItem) => void;
  relatedTasks: TaskItem[];
  onSelectRelatedTask: (task: TaskItem) => void;
  onViewPortfolio?: (requester: any) => void;
}

export const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  task,
  userRole,
  userMode,
  currentUserId,
  isSaved = false,
  onToggleSave,
  onBack,
  onTriggerAuth,
  onToggleMode,
  onGoToMyTasks,
  onSubmitOffer,
  onOpenReport,
  relatedTasks,
  onSelectRelatedTask,
  onViewPortfolio,
}) => {
  const [proposedPrice, setProposedPrice] = useState<number>(task.budget);
  const [deliveryDays, setDeliveryDays] = useState<number>(2);
  const [pitchMessage, setPitchMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const isMyTask = task.requester.id === currentUserId || task.requester.id === 'usr-current';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchMessage.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitOffer(task.id, proposedPrice, deliveryDays, pitchMessage);
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 500);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#62646a] hover:text-[#222325] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại sàn khám phá Task</span>
        </button>

        <div className="flex items-center gap-2">
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(task.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-[#62646a] border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Đã lưu' : 'Lưu Task'}</span>
            </button>
          )}

          <button
            onClick={() => onOpenReport(task)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Báo cáo</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left content (Task info) & Right content (Action & Requester) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 8 Cols */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs space-y-6">
            
            {/* Category, Status & Metadata */}
            <div className="flex items-center justify-between text-xs text-[#62646a] border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2 font-medium">
                <span className="font-bold text-[#222325]">{task.categoryName}</span>
                <span>·</span>
                <span className="font-mono">#{task.id}</span>
                <span>·</span>
                <span>Đăng {task.createdAt}</span>
              </div>

              <span
                className={`font-bold px-2.5 py-0.5 rounded text-[11px] ${
                  task.status === 'OPEN'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                {task.status === 'OPEN' ? 'Đang mở (OPEN)' : task.status}
              </span>
            </div>

            {/* Task Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight leading-snug">
              {task.title}
            </h1>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-200/70 text-xs">
              <div>
                <span className="text-[#62646a] block text-[11px]">Ngân sách đề xuất</span>
                <span className="text-lg font-extrabold text-[#222325] font-mono tabular-nums">
                  {formatVND(task.budget)}
                </span>
              </div>
              <div>
                <span className="text-[#62646a] block text-[11px]">Hạn chót hoàn thành</span>
                <span className="font-semibold text-[#222325] flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{task.deadline}</span>
                </span>
              </div>
              <div>
                <span className="text-[#62646a] block text-[11px]">Hình thức thực hiện</span>
                <span className="font-semibold text-[#222325] mt-0.5 block">
                  {task.mode === 'ONLINE' ? 'Trực tuyến (Online)' : task.mode === 'ONSITE' ? 'Tại trường (Onsite)' : 'Linh hoạt'}
                </span>
              </div>
              <div>
                <span className="text-[#62646a] block text-[11px]">Số báo giá đã nhận</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{task.offersCount} ứng viên</span>
                </span>
              </div>
            </div>

            {task.location && (
              <div className="flex items-center gap-1.5 text-xs text-[#404145] p-3 bg-neutral-50/80 rounded-xl border border-neutral-100">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Địa điểm cụ thể tại campus: <strong>{task.location}</strong></span>
              </div>
            )}

            {/* Detailed Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#222325] uppercase tracking-wider">
                Mô tả chi tiết công việc
              </h3>
              <p className="text-xs sm:text-sm text-[#404145] whitespace-pre-line leading-relaxed">
                {task.description}
              </p>
            </div>

            {/* Expected Output (Core UX Requirement) */}
            <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200/90 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-950 text-xs uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Tiêu chuẩn nghiệm thu sản phẩm (Expected Output)</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 font-semibold leading-relaxed">
                {task.expectedOutput}
              </p>
              <p className="text-[11px] text-emerald-700 pt-1">
                * Đây là căn cứ bất biến để Người yêu cầu nghiệm thu và kích hoạt giải ngân thù lao, hoặc yêu cầu chỉnh sửa theo quy tắc BR-01.
              </p>
            </div>

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#222325] uppercase tracking-wider flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4" />
                  <span>Tệp tài liệu đính kèm ({task.attachments.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {task.attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="truncate">
                          <p className="font-bold text-[#222325] truncate">{file.name}</p>
                          <p className="text-[11px] text-[#62646a]">{file.size} · {file.type}</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline shrink-0 ml-2 cursor-pointer">
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải về</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100 text-xs">
              <span className="font-semibold text-neutral-400">Từ khóa:</span>
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-neutral-100 text-[#404145] rounded-lg font-medium text-[11px]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 4 Cols (Action & Requester Trust Card) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Action Card: Gửi báo giá / Đăng nhập / Chuyển Mode */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm space-y-5">
            <div>
              <span className="text-xs text-[#62646a] block">Ngân sách Task</span>
              <span className="text-2xl font-extrabold text-[#222325] font-mono tabular-nums">
                {formatVND(task.budget)}
              </span>
            </div>

            {/* Case 1: GUEST */}
            {userRole === 'GUEST' && (
              <div className="space-y-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-center">
                <p className="text-[#404145] font-medium leading-relaxed">
                  Bạn đang xem với tư cách Khách. Vui lòng đăng nhập email trường để gửi báo giá nhận Task này.
                </p>
                <button
                  onClick={() => onTriggerAuth('SUBMIT_OFFER')}
                  className="w-full py-2.5 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Đăng nhập để gửi báo giá
                </button>
              </div>
            )}

            {/* Case 2: MY OWN TASK */}
            {userRole !== 'GUEST' && isMyTask && (
              <div className="space-y-3 p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-center">
                <p className="text-blue-900 font-bold">
                  Đây là Task do bạn đăng ({task.offersCount} báo giá đã gửi)
                </p>
                <p className="text-blue-800 text-[11px]">
                  Bạn có thể vào mục Task của tôi để so sánh các báo giá và chấp nhận đề xuất để tạo Order.
                </p>
                <button
                  onClick={onGoToMyTasks}
                  className="w-full py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer"
                >
                  Xem danh sách báo giá đã nhận
                </button>
              </div>
            )}

            {/* Case 3: USER IN REQUESTER MODE */}
            {userRole !== 'GUEST' && !isMyTask && userMode === 'REQUESTER' && (
              <div className="space-y-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-center">
                <p className="text-[#404145]">
                  Bạn đang ở chế độ <strong>Người yêu cầu</strong>. Để nhận Task này, hãy chuyển sang chế độ Người thực hiện.
                </p>
                <button
                  onClick={onToggleMode}
                  className="w-full py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Đổi sang chế độ Người thực hiện</span>
                </button>
              </div>
            )}

            {/* Case 4: USER IN TASKER MODE -> SUBMIT PROPOSAL */}
            {userRole !== 'GUEST' && !isMyTask && userMode === 'TASKER' && (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-[#222325]">Gửi đề xuất báo giá của bạn</h4>

                {isSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
                    <Check className="w-6 h-6 text-emerald-600 mx-auto" />
                    <p className="font-bold text-xs text-emerald-900">Đã gửi đề xuất thành công!</p>
                    <p className="text-[11px] text-emerald-700">Người yêu cầu sẽ được thông báo ngay.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-[#404145] mb-1">
                        Giá đề xuất (VND)
                      </label>
                      <input
                        type="number"
                        value={proposedPrice}
                        onChange={(e) => setProposedPrice(Number(e.target.value))}
                        step={10000}
                        min={50000}
                        required
                        className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#404145] mb-1">
                        Thời gian hoàn thành (ngày)
                      </label>
                      <input
                        type="number"
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(Number(e.target.value))}
                        min={1}
                        max={14}
                        required
                        className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#404145] mb-1">
                        Cách tiếp cận & Cam kết kết quả
                      </label>
                      <textarea
                        rows={3}
                        value={pitchMessage}
                        onChange={(e) => setPitchMessage(e.target.value)}
                        placeholder="Nêu rõ kinh nghiệm làm bài tương tự và cam kết hoàn thành đúng Expected Output..."
                        required
                        className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !pitchMessage.trim()}
                      className="w-full py-2.5 font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Đang gửi...' : 'Nộp đề xuất ngay'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Escrow Guarantee Callout */}
            <div className="pt-3 border-t border-neutral-100 flex items-center gap-2 text-[11px] text-[#62646a]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thù lao được bảo chứng 100% qua Escrow của VIETVI.</span>
            </div>
          </div>

          {/* Requester Profile Trust Card */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Thông tin Người yêu cầu
            </h4>

            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl ${task.requester.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-xs`}
              >
                {task.requester.displayName.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-[#222325]">
                    {task.requester.displayName}
                  </h3>
                  {task.requester.isVerifiedStudent && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold">
                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                      <span>Xác minh SV</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#62646a] mt-0.5">
                  {task.requester.major} · {task.requester.university}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t border-neutral-100">
              <div className="p-2 bg-neutral-50 rounded-xl">
                <span className="text-[11px] text-neutral-400 block">Đánh giá 3 chiều</span>
                <span className="font-extrabold text-[#222325]">★ {task.requester.rating.toFixed(1)}</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-xl">
                <span className="text-[11px] text-neutral-400 block">Task đã hoàn tất</span>
                <span className="font-extrabold text-emerald-600">{task.requester.tasksCompleted} Task</span>
              </div>
            </div>

            {onViewPortfolio && (
              <button
                type="button"
                onClick={() => onViewPortfolio(task.requester)}
                className="w-full py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer text-center"
              >
                Xem Showcase Portfolio SV →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Related Tasks in the same category */}
      {relatedTasks.length > 0 && (
        <div className="pt-8 border-t border-neutral-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#222325]">
              Các Task tương tự bạn có thể nhận
            </h3>
            <span className="text-xs text-[#62646a]">Cùng danh mục &amp; trường đại học</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedTasks.slice(0, 3).map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectRelatedTask(rel)}
                className="bg-white p-5 rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:shadow-xs cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-[#62646a]">
                  <span className="font-semibold text-[#222325]">{rel.categoryName}</span>
                  <span className="font-bold text-emerald-700">{formatVND(rel.budget)}</span>
                </div>
                <h4 className="text-sm font-bold text-[#222325] line-clamp-2 hover:text-emerald-700">
                  {rel.title}
                </h4>
                <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-1 border-t border-neutral-100">
                  <span>{rel.requester.university}</span>
                  <span>{rel.offersCount} đề xuất</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
