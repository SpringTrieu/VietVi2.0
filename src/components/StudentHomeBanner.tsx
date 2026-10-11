import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Building,
  GraduationCap,
  Wallet,
  Briefcase,
  Layers,
  ArrowRightLeft,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  Compass,
} from 'lucide-react';
import { UserMode, UserProfile, University, ActiveScreen } from '../types';

interface StudentHomeBannerProps {
  currentUser: UserProfile;
  userMode: UserMode;
  onToggleMode: () => void;
  availableBalance: number;
  openOrderCount: number;
  myTasksCount: number;
  myOffersCount: number;
  onOpenPostTask: () => void;
  onOpenVerify: () => void;
  onNavigateToScreen: (screen: ActiveScreen) => void;
  selectedUni: string;
  onSelectUni: (uniId: string) => void;
  universities: University[];
}

export const StudentHomeBanner: React.FC<StudentHomeBannerProps> = ({
  currentUser,
  userMode,
  onToggleMode,
  availableBalance,
  openOrderCount,
  myTasksCount,
  myOffersCount,
  onOpenPostTask,
  onOpenVerify,
  onNavigateToScreen,
  selectedUni,
  onSelectUni,
  universities,
}) => {
  // Find current user's university object
  const userUniObj = universities.find(
    (u) =>
      u.name.toLowerCase() === currentUser.university.toLowerCase() ||
      currentUser.university.toLowerCase().includes(u.shortName.toLowerCase())
  );

  const isFilteringMyUni = userUniObj && selectedUni === userUniObj.id;

  const handleToggleMyUniFilter = () => {
    if (isFilteringMyUni) {
      onSelectUni('all');
    } else if (userUniObj) {
      onSelectUni(userUniObj.id);
    }
  };

  return (
    <div className="bg-white border-b border-neutral-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Top Greeting & Role Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-neutral-100">
          
          {/* User Bio Summary */}
          <div className="flex items-start sm:items-center gap-4">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${currentUser.avatarBg || 'bg-emerald-600'} text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center shrink-0 shadow-md`}>
              {currentUser.displayName.slice(0, 1).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Bàn làm việc Sinh viên
                </span>
                
                {currentUser.isVerifiedStudent ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tick xanh SV đã xác minh</span>
                  </span>
                ) : (
                  <button
                    onClick={onOpenVerify}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold cursor-pointer transition-colors"
                    title="Bấm để gửi ảnh thẻ sinh viên nhận Tick xanh"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Chưa có Tick xanh · Xác thực ngay</span>
                  </button>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-[#222325] tracking-tight">
                Xin chào, {currentUser.displayName}!
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#62646a]">
                <span className="flex items-center gap-1.5 font-medium text-neutral-800">
                  <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{currentUser.university}</span>
                </span>
                {currentUser.studentId && (
                  <span className="text-neutral-400">· MSSV: {currentUser.studentId}</span>
                )}
                {currentUser.major && (
                  <span className="text-neutral-400">· {currentUser.major}</span>
                )}
              </div>
            </div>
          </div>

          {/* Mode Switcher & Quick Mode Notice */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-neutral-50 p-2.5 sm:p-3 rounded-2xl border border-neutral-200/80">
            <div className="text-xs space-y-0.5 pl-1 pr-2">
              <span className="text-[11px] text-neutral-400 block font-medium">Chế độ đang bật:</span>
              <span className="font-extrabold text-neutral-900 block">
                {userMode === 'REQUESTER' ? 'Người yêu cầu (Requester)' : 'Người thực hiện (Tasker)'}
              </span>
            </div>

            <button
              onClick={onToggleMode}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                userMode === 'REQUESTER'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>
                {userMode === 'REQUESTER' ? 'Đổi sang Nhận việc (Tasker)' : 'Đổi sang Đăng việc (Requester)'}
              </span>
            </button>
          </div>
        </div>

        {/* Middle Stats & Operational Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Wallet Balance */}
          <div
            onClick={() => onNavigateToScreen('WALLET')}
            className="p-4 bg-neutral-50 hover:bg-neutral-100/80 transition-colors rounded-2xl border border-neutral-200/80 cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-semibold text-neutral-500">Ví ký quỹ Escrow</span>
              <Wallet className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-[#222325]">
              {availableBalance.toLocaleString('vi-VN')} đ
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span>Bảo chứng 100% an toàn</span>
            </span>
          </div>

          {/* Active Orders */}
          <div
            onClick={() => onNavigateToScreen('ORDER_WORKSPACE')}
            className="p-4 bg-neutral-50 hover:bg-neutral-100/80 transition-colors rounded-2xl border border-neutral-200/80 cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-semibold text-neutral-500">Đơn hàng đang chạy</span>
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-[#222325]">
              {openOrderCount} Đơn hàng
            </div>
            <span className="text-[11px] text-neutral-400">
              {openOrderCount > 0 ? 'Đang thực hiện theo tiến độ' : 'Không có đơn nào trễ hạn'}
            </span>
          </div>

          {/* My Tasks / My Jobs depending on mode */}
          <div
            onClick={() => onNavigateToScreen(userMode === 'REQUESTER' ? 'MY_TASKS' : 'MY_JOBS')}
            className="p-4 bg-neutral-50 hover:bg-neutral-100/80 transition-colors rounded-2xl border border-neutral-200/80 cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-semibold text-neutral-500">
                {userMode === 'REQUESTER' ? 'Task bạn đã đăng' : 'Đề xuất báo giá'}
              </span>
              <FileText className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-[#222325]">
              {userMode === 'REQUESTER' ? `${myTasksCount} Task` : `${myOffersCount} Báo giá`}
            </div>
            <span className="text-[11px] text-neutral-400">
              {userMode === 'REQUESTER' ? 'Quản lý duyệt ứng viên' : 'Đang chờ Người yêu cầu duyệt'}
            </span>
          </div>

          {/* Campus Hub Link */}
          <div
            onClick={() => onNavigateToScreen('CAMPUS_HUB')}
            className="p-4 bg-linear-to-br from-amber-50/60 to-amber-100/40 hover:from-amber-100/60 transition-colors rounded-2xl border border-amber-200/80 cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between text-amber-700 text-xs">
              <span className="font-bold text-amber-900">Campus Hub</span>
              <Building className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-base sm:text-lg font-bold text-amber-950 truncate">
              {currentUser.university}
            </div>
            <span className="text-[11px] text-amber-800 font-semibold">
              Bảng vàng &amp; Kết nối bạn bè 🏆
            </span>
          </div>
        </div>

        {/* Bottom Fast Action Bar & Campus Filter Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* 1-Click Campus Filter for Peers */}
          {userUniObj ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMyUniFilter}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isFilteringMyUni
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>
                  {isFilteringMyUni
                    ? `Đang lọc: Chỉ sinh viên ${currentUser.university} (Bấm để hủy)`
                    : `Lọc nhanh Task từ trường: ${currentUser.university}`}
                </span>
                {isFilteringMyUni && <span className="ml-1 text-[10px] bg-blue-700 px-1.5 py-0.5 rounded-full">✓ Bật</span>}
              </button>
            </div>
          ) : (
            <div className="text-xs text-neutral-400 font-medium">
              Khám phá hơn 20.000 Task bảo chứng Escrow toàn quốc
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenPostTask}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Đăng Task mới</span>
            </button>

            <button
              onClick={() => {
                const element = document.getElementById('market-tasks');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-neutral-500" />
              <span>Xem bảng Task sàn</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
