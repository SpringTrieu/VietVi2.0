import React, { useEffect, useState } from 'react';
import { UserMode } from '../types';
import {
  Briefcase,
  ClipboardList,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Coins,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';

interface ModeSwitchNotificationProps {
  isOpen: boolean;
  mode: UserMode;
  onClose: () => void;
  onExploreTasks: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToOrders: () => void;
}

export const ModeSwitchNotification: React.FC<ModeSwitchNotificationProps> = ({
  isOpen,
  mode,
  onClose,
  onExploreTasks,
  onNavigateToDashboard,
  onNavigateToOrders,
}) => {
  const [progress, setProgress] = useState<number>(100);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const onCloseRef = React.useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const isPausedRef = React.useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Audio chime & countdown timer on open
  useEffect(() => {
    if (!isOpen) {
      setProgress(100);
      return;
    }

    setProgress(100);

    // Play pleasant acoustic notification chime
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        if (mode === 'TASKER') {
          // Uplifting melody for Tasker mode (C5 -> G5)
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
        } else {
          // Calm melody for Requester mode (F5 -> A5)
          osc.frequency.setValueAtTime(698.46, now);
          osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.15);
        }
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      }
    } catch {
      // Safe fallback if autoplay audio is constrained
    }

    const totalDuration = 6500;
    const step = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      if (isPausedRef.current) return;

      elapsed += step;
      const pct = Math.max(0, 100 - (elapsed / totalDuration) * 100);
      setProgress(pct);

      if (elapsed >= totalDuration) {
        clearInterval(timer);
        onCloseRef.current();
      }
    }, step);

    return () => {
      clearInterval(timer);
    };
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const isTasker = mode === 'TASKER';

  return (
    <div
      role="region"
      aria-label="Thông báo chuyển đổi chế độ"
      className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`relative overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-xl transition-all ${
          isTasker
            ? 'bg-neutral-900/95 border-emerald-500/40 text-white shadow-emerald-950/40 ring-1 ring-emerald-500/30'
            : 'bg-neutral-900/95 border-indigo-500/40 text-white shadow-indigo-950/40 ring-1 ring-indigo-500/30'
        }`}
      >
        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
          <div
            className={`h-full transition-all duration-75 ${
              isTasker ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-indigo-400 to-blue-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Ambient Gradient Glow */}
        <div
          className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-30 pointer-events-none ${
            isTasker ? 'bg-emerald-500' : 'bg-indigo-500'
          }`}
        />

        <div className="p-5 sm:p-6 space-y-4">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                  isTasker
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white ring-2 ring-emerald-400/40'
                    : 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white ring-2 ring-indigo-400/40'
                }`}
              >
                {isTasker ? (
                  <Briefcase className="w-5 h-5 stroke-[2.2]" />
                ) : (
                  <ClipboardList className="w-5 h-5 stroke-[2.2]" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                      isTasker
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {isTasker ? 'Bên Nhận Việc · Tasker Mode' : 'Bên Thuê Việc · Requester Mode'}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <Sparkles className="w-3 h-3" />
                    <span>Đã kích hoạt</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-0.5">
                  {isTasker
                    ? 'Đã chuyển sang Người thực hiện (Tasker) 🛠️'
                    : 'Đã chuyển sang Người yêu cầu (Requester) 📋'}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description & Feature Highlights */}
          <div className="text-xs text-neutral-300 leading-relaxed bg-white/5 rounded-2xl p-3.5 border border-white/10 space-y-2">
            <p className="font-medium text-neutral-200">
              {isTasker
                ? 'Giao diện làm việc đã đồng bộ cho sinh viên nhận Task. Bạn có thể:'
                : 'Giao diện đã chuyển sang quản lý đăng tuyển công việc. Bạn có thể:'}
            </p>

            <ul className="space-y-1.5 text-[11px] text-neutral-300">
              {isTasker ? (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Nộp đề xuất &amp; báo giá</strong> cho hàng chục Task đang mở toàn quốc.
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Bảo chứng thù lao 100%</strong> qua ví ký quỹ Escrow trước khi bắt đầu làm.
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Tích lũy hồ sơ Portfolio</strong> &amp; leo bảng xếp hạng Top Tasker Campus.
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>
                      <strong>Đăng bài nhanh 2 phút</strong> &amp; nhận báo giá từ sinh viên giỏi sau 15p.
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Coins className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>
                      <strong>Ký quỹ minh bạch</strong>, chỉ giải ngân khi nghiệm thu sản phẩm đạt chuẩn.
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>
                      <strong>Quản lý hợp đồng</strong> &amp; so sánh hồ sơ ứng viên dễ dàng.
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            {isTasker ? (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onExploreTasks();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Xem Sàn Task đang mở</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateToDashboard();
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-neutral-200 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>My Jobs</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToDashboard();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Quản lý Task của tôi</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onExploreTasks();
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-neutral-200 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Sàn công việc</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                onClose();
                onNavigateToOrders();
              }}
              className="p-2.5 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl transition-all cursor-pointer shrink-0"
              title="Mở Quản lý Đơn hàng (ORDER-01)"
              aria-label="Quản lý Hợp đồng"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
