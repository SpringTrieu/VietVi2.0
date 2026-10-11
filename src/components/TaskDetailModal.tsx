import React, { useState } from 'react';
import { TaskItem, UserMode } from '../types';
import { UserRole } from './RoleSwitcherBar';
import { X, CheckCircle, Clock, ShieldCheck, MapPin, Paperclip, Send, AlertCircle, FileText, Check, LogIn, ArrowRightLeft, ExternalLink } from 'lucide-react';

interface TaskDetailModalProps {
  task: TaskItem | null;
  onClose: () => void;
  userRole: UserRole;
  userMode: UserMode;
  currentUserId?: string;
  onTriggerAuth: (intent: string) => void;
  onToggleMode: () => void;
  onGoToMyTasks?: () => void;
  onSubmitOffer: (taskId: string, proposedPrice: number, deliveryDays: number, message: string) => void;
  onViewFullScreen?: (task: TaskItem) => void;
  onViewPortfolio?: (requester: any) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  userRole,
  userMode,
  currentUserId = 'usr-current',
  onTriggerAuth,
  onToggleMode,
  onGoToMyTasks,
  onSubmitOffer,
  onViewFullScreen,
  onViewPortfolio,
}) => {
  if (!task) return null;

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
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-neutral-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2 text-xs font-medium text-[#62646a]">
            <span className="font-semibold text-[#222325]">{task.categoryName}</span>
            <span aria-hidden="true">·</span>
            <span>Mã Task: #{task.id}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">{task.status}</span>
          </div>

          <div className="flex items-center gap-2">
            {onViewFullScreen && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewFullScreen(task);
                }}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                title="Mở toàn màn hình chi tiết"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mở trang chi tiết</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Đóng chi tiết"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Title & Key Financial Info */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#222325] leading-snug">
              {task.title}
            </h2>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-200/70 text-xs">
              <div>
                <span className="text-[#62646a] block text-[11px]">Ngân sách đề xuất</span>
                <span className="text-base font-bold text-[#222325] font-mono tabular-nums">
                  {formatVND(task.budget)}
                </span>
              </div>
              <div>
                <span className="text-[#62646a] block text-[11px]">Hạn bàn giao</span>
                <span className="font-semibold text-[#222325]">{task.deadline}</span>
              </div>
              <div>
                <span className="text-[#62646a] block text-[11px]">Hình thức</span>
                <span className="font-semibold text-[#222325]">
                  {task.mode === 'ONLINE' ? 'Trực tuyến (Online)' : task.mode === 'ONSITE' ? 'Tại trường (Onsite)' : 'Linh hoạt'}
                </span>
              </div>
              <div>
                <span className="text-[#62646a] block text-[11px]">Đề xuất đã nhận</span>
                <span className="font-semibold text-emerald-700">{task.offersCount} ứng viên</span>
              </div>
            </div>

            {task.location && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#62646a] px-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>Địa điểm onsite: <strong>{task.location}</strong></span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Mô tả chi tiết công việc
            </h4>
            <p className="text-sm text-[#404145] whitespace-pre-line leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Expected Output (Core Product Requirement) */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Tiêu chuẩn nghiệm thu (Expected Output)</span>
            </h4>
            <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
              {task.expectedOutput}
            </p>
            <p className="text-[11px] text-emerald-700 mt-2">
              * Đây là căn cứ bắt buộc để Người yêu cầu nghiệm thu và giải ngân thù lao hoặc yêu cầu chỉnh sửa.
            </p>
          </div>

          {/* Attachments if any */}
          {task.attachments && task.attachments.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5" />
                <span>Tệp đính kèm ({task.attachments.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {task.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-[#222325] truncate">{file.name}</p>
                        <p className="text-[11px] text-[#62646a]">{file.size} · {file.type}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 ml-2 shrink-0">
                      Tải về
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requester Profile Trust Card */}
          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Thông tin Người yêu cầu
            </h4>
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl ${task.requester.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-sm`}
                >
                  {task.requester.displayName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#222325]">
                      {task.requester.displayName}
                    </span>
                    {task.requester.isVerifiedStudent && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded">
                        <CheckCircle className="w-3 h-3 text-blue-600" />
                        Đã xác minh SV
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#62646a]">
                    {task.requester.major} · {task.requester.university}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs space-y-1">
                <div className="font-bold text-[#222325]">★ {task.requester.rating.toFixed(1)} / 5.0</div>
                <div className="text-[11px] text-[#62646a]">
                  Đã hoàn thành {task.requester.tasksCompleted} Task
                </div>
                {onViewPortfolio && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onViewPortfolio(task.requester);
                    }}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer block text-right mt-1"
                  >
                    Xem hồ sơ portfolio →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ROLE & CONTEXT LOGICAL SWITCH FOR PROPOSAL SUBMISSION */}
          <div className="pt-4 border-t border-neutral-200">
            {/* Case 1: GUEST USER */}
            {userRole === 'GUEST' && (
              <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
                  <LogIn className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#222325]">
                    Đăng nhập để gửi đề xuất nhận Task này
                  </h4>
                  <p className="text-xs text-[#62646a] mt-1 max-w-md mx-auto">
                    Bạn đang xem với tư cách Khách. Xác thực email sinh viên qua OTP để báo giá và nhận thù lao bảo chứng {formatVND(task.budget)}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onTriggerAuth('SUBMIT_OFFER');
                  }}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập bằng Email trường</span>
                </button>
              </div>
            )}

            {/* Case 2: USER IS CREATOR OF THIS TASK */}
            {userRole !== 'GUEST' && isMyTask && (
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-center space-y-2">
                <p className="text-xs font-bold text-blue-900">
                  Đây là Task do bạn đăng ({task.offersCount} bạn sinh viên đã gửi báo giá)
                </p>
                <p className="text-[11px] text-blue-800">
                  Bạn có thể xem chi tiết hồ sơ các ứng viên và chấp nhận đề xuất trong mục Quản lý Task.
                </p>
                {onGoToMyTasks && (
                  <button
                    onClick={() => {
                      onClose();
                      onGoToMyTasks();
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Đến màn hình Task của tôi để chọn báo giá
                  </button>
                )}
              </div>
            )}

            {/* Case 3: USER IN REQUESTER MODE (NOT CREATOR) */}
            {userRole !== 'GUEST' && !isMyTask && userMode === 'REQUESTER' && (
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-center space-y-2">
                <p className="text-xs font-semibold text-[#404145]">
                  Bạn đang ở <strong>Chế độ Người yêu cầu</strong>. Để gửi báo giá nhận Task này, hãy chuyển sang Chế độ Người thực hiện.
                </p>
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chuyển sang Chế độ Người thực hiện (Tasker)</span>
                </button>
              </div>
            )}

            {/* Case 4: USER IN TASKER MODE (CAN SUBMIT PROPOSAL) */}
            {userRole !== 'GUEST' && !isMyTask && userMode === 'TASKER' && (
              <div>
                <h4 className="text-sm font-bold text-[#222325] mb-2 flex items-center gap-2">
                  <span>Gửi đề xuất / Báo giá cho Task này</span>
                  <span className="text-xs font-normal text-[#62646a]">(Chế độ Người thực hiện)</span>
                </h4>

                {isSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center">
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-emerald-900">Đã gửi đề xuất thành công!</p>
                    <p className="text-xs text-emerald-700">Người yêu cầu sẽ nhận được thông báo ngay.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#404145] mb-1">
                          Giá đề xuất (VND)
                        </label>
                        <input
                          type="number"
                          value={proposedPrice}
                          onChange={(e) => setProposedPrice(Number(e.target.value))}
                          step={10000}
                          min={50000}
                          required
                          className="w-full px-3 py-2 text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73] focus:border-[#1dbf73]"
                        />
                        <span className="text-[11px] text-neutral-400 mt-0.5 block">
                          Ngân sách gốc: {formatVND(task.budget)}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#404145] mb-1">
                          Thời gian hoàn thành (ngày)
                        </label>
                        <input
                          type="number"
                          value={deliveryDays}
                          onChange={(e) => setDeliveryDays(Number(e.target.value))}
                          min={1}
                          max={14}
                          required
                          className="w-full px-3 py-2 text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73] focus:border-[#1dbf73]"
                        />
                        <span className="text-[11px] text-neutral-400 mt-0.5 block">
                          Hạn chót mong đợi: {task.deadline}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#404145] mb-1">
                        Cách tiếp cận & Cam kết kết quả của bạn
                      </label>
                      <textarea
                        rows={3}
                        value={pitchMessage}
                        onChange={(e) => setPitchMessage(e.target.value)}
                        placeholder="Ví dụ: Chào bạn, mình là sinh viên năm 3 chuyên ngành này, đã từng làm 4 slide tương tự và đạt điểm A. Mình cam kết bàn giao đúng hạn và hỗ trợ sửa 2 lần miễn phí..."
                        required
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73] focus:border-[#1dbf73]"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-[#62646a]">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Thù lao được bảo chứng qua cơ chế Tạm giữ VIETVI</span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !pitchMessage.trim()}
                        className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span>Đang gửi...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Gửi đề xuất ngay</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
