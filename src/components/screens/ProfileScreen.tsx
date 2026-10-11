import React, { useState } from 'react';
import { UserProfile, UserMode, TaskItem } from '../../types';
import { TaskCard } from '../TaskCard';
import {
  ShieldCheck,
  Star,
  GraduationCap,
  Mail,
  Award,
  CheckCircle,
  ArrowRightLeft,
  Edit3,
  Bookmark,
  Bell,
  LogOut,
  Settings,
  User,
  ExternalLink,
  TrendingUp,
  CreditCard,
  Building,
  Phone,
  Clock,
  DollarSign,
  Github,
  Globe,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

interface ProfileScreenProps {
  currentUser: UserProfile;
  currentMode: UserMode;
  onToggleMode: () => void;
  onOpenVerify: () => void;
  onOpenEditProfile: (initialTab?: 'BASIC' | 'SKILLS' | 'BANKING') => void;
  onLogout: () => void;
  savedTasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onToggleSaveTask: (taskId: string) => void;
  onViewPublicPortfolio?: () => void;
  onViewAnalytics?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  currentMode,
  onToggleMode,
  onOpenVerify,
  onOpenEditProfile,
  onLogout,
  savedTasks,
  onSelectTask,
  onToggleSaveTask,
  onViewPublicPortfolio,
  onViewAnalytics,
}) => {
  const [activeProfileTab, setActiveProfileTab] = useState<'OVERVIEW' | 'BANKING' | 'SAVED' | 'SETTINGS'>('OVERVIEW');
  const [emailNotif, setEmailNotif] = useState(true);
  const [inAppNotif, setInAppNotif] = useState(true);
  const [copiedBank, setCopiedBank] = useState(false);

  // Compute initials
  const initials = currentUser.displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  const handleCopyBankAccount = () => {
    if (currentUser.bankAccountNumber) {
      navigator.clipboard?.writeText(currentUser.bankAccountNumber);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner / Student Identity Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-3xl ${
                currentUser.avatarBg || 'bg-emerald-600'
              } text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-md shrink-0`}
            >
              {initials || 'SV'}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
                  {currentUser.displayName}
                </h1>
                {currentUser.isVerifiedStudent && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Sinh viên đã xác minh</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-xl border transition-all cursor-pointer hover:shadow-xs ${
                    currentMode === 'REQUESTER'
                      ? 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                  title="Nhấp để chuyển đổi vai trò giữa Người yêu cầu và Người thực hiện"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>{currentMode === 'REQUESTER' ? 'Hồ sơ: Bên yêu cầu' : 'Hồ sơ: Bên thực hiện'}</span>
                  <span className="text-[10px] text-neutral-400 font-normal ml-0.5">(Đổi vai trò)</span>
                </button>
              </div>

              {currentUser.headline && (
                <p className="text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-0.5 rounded-lg inline-block border border-emerald-100">
                  {currentUser.headline}
                </p>
              )}

              <p className="text-xs sm:text-sm text-[#62646a]">
                {currentUser.major} · <strong>{currentUser.university}</strong>
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 pt-0.5">
                {currentUser.studentId && <span>MSSV: {currentUser.studentId}</span>}
                {currentUser.graduationYear && (
                  <>
                    <span>·</span>
                    <span>Khóa: {currentUser.graduationYear}</span>
                  </>
                )}
                {currentUser.email && (
                  <>
                    <span>·</span>
                    <span className="font-mono text-neutral-600">{currentUser.email}</span>
                  </>
                )}
                {currentUser.phoneNumber && (
                  <>
                    <span>·</span>
                    <span>SĐT/Zalo: {currentUser.phoneNumber}</span>
                  </>
                )}
              </div>

              {/* External Profile / GitHub links if present */}
              {(currentUser.portfolioUrl || currentUser.githubUrl) && (
                <div className="flex items-center gap-3 pt-1 text-xs">
                  {currentUser.portfolioUrl && (
                    <a
                      href={currentUser.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Portfolio ngoài</span>
                    </a>
                  )}
                  {currentUser.githubUrl && (
                    <a
                      href={currentUser.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-neutral-700 hover:underline font-semibold"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
            {onViewPublicPortfolio && (
              <button
                onClick={onViewPublicPortfolio}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer"
                title="Xem trang Portfolio công khai của bạn"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Trang Portfolio công khai</span>
              </button>
            )}

            {onViewAnalytics && (
              <button
                onClick={onViewAnalytics}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-colors cursor-pointer"
                title="Xem báo cáo doanh thu & chỉ số SLA"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Báo cáo doanh thu</span>
              </button>
            )}

            <button
              onClick={() => onOpenEditProfile('BASIC')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#404145] bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa hồ sơ</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Bio Card with Quick Edit */}
        <div className="p-4 sm:p-5 bg-neutral-50 rounded-2xl border border-neutral-100 relative group">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#404145] leading-relaxed italic">
              &ldquo;{currentUser.bio || 'Chưa cập nhật phần giới thiệu cá nhân.'}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => onOpenEditProfile('SKILLS')}
              className="shrink-0 text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-neutral-200 hover:bg-emerald-50 transition-colors"
            >
              <Edit3 className="w-3 h-3" />
              <span>Sửa Bio</span>
            </button>
          </div>
        </div>

        {/* 3-Dimensional Rating Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {currentMode === 'REQUESTER' ? (
            <>
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 text-center">
                <span className="text-xs text-indigo-900 block">1. Tốc độ nghiệm thu</span>
                <span className="text-xl font-extrabold text-[#222325] font-mono mt-1 block">100% Đúng hẹn</span>
                <span className="text-[11px] text-indigo-700 font-semibold">Giải ngân trong 2h sau khi nộp file</span>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 text-center">
                <span className="text-xs text-indigo-900 block">2. Độ rõ ràng yêu cầu</span>
                <span className="text-xl font-extrabold text-[#222325] font-mono mt-1 block">5.0 / 5.0</span>
                <span className="text-[11px] text-indigo-700 font-semibold">Mô tả đầu bài chi tiết, dễ hiểu</span>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 text-center">
                <span className="text-xs text-indigo-900 block">3. Tỷ lệ tiếp tục cộng tác</span>
                <span className="text-xl font-extrabold text-[#222325] font-mono mt-1 block">96%</span>
                <span className="text-[11px] text-indigo-700 font-semibold">12 bạn Tasker sẵn sàng nhận việc tiếp</span>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 text-center">
                <span className="text-xs text-emerald-900 block">1. Mức độ giao tiếp</span>
                <span className="text-xl font-extrabold text-[#222325] font-mono mt-1 block">5.0 / 5.0</span>
                <span className="text-[11px] text-emerald-700 font-semibold">Phản hồi trung bình 12 phút</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 text-center">
                <span className="text-xs text-emerald-900 block">2. Chất lượng như mô tả</span>
                <span className="text-xl font-extrabold text-[#222325] font-mono mt-1 block">4.9 / 5.0</span>
                <span className="text-[11px] text-emerald-700 font-semibold">Đạt chuẩn Expected Output</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 text-center">
                <span className="text-xs text-emerald-900 block">3. Giới thiệu bạn bè</span>
                <span className="text-xl font-extrabold text-[#222325] font-mono mt-1 block">100%</span>
                <span className="text-[11px] text-emerald-700 font-semibold">16 sinh viên đánh giá tích cực</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs for Profile Sections */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 pb-3 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveProfileTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeProfileTab === 'OVERVIEW'
              ? 'bg-[#222325] text-white font-bold'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          Tổng quan năng lực & Kỹ năng
        </button>

        <button
          onClick={() => setActiveProfileTab('BANKING')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeProfileTab === 'BANKING'
              ? 'bg-[#222325] text-white font-bold'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Tài khoản nhận tiền Escrow</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('SAVED')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeProfileTab === 'SAVED'
              ? 'bg-[#222325] text-white font-bold'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Task đã lưu ({savedTasks.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('SETTINGS')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeProfileTab === 'SETTINGS'
              ? 'bg-[#222325] text-white font-bold'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Cài đặt thông báo & Bảo mật</span>
        </button>
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeProfileTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Skills & Tools */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-[#222325]">Kỹ năng & Chuyên môn xác nhận</h3>
              </div>
              <button
                onClick={() => onOpenEditProfile('SKILLS')}
                className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Quản lý & Thêm kỹ năng</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentUser.skills && currentUser.skills.length > 0 ? (
                currentUser.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-neutral-100 text-[#222325] rounded-xl text-xs font-semibold border border-neutral-200/60"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <div className="text-xs text-neutral-400 italic">
                  Chưa cập nhật kỹ năng nào.{' '}
                  <button
                    onClick={() => onOpenEditProfile('SKILLS')}
                    className="text-emerald-700 underline font-semibold cursor-pointer"
                  >
                    Bấm vào đây để thêm
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Availability & Hourly Rate Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Thời gian rảnh nhận việc</span>
                </span>
                <button
                  onClick={() => onOpenEditProfile('SKILLS')}
                  className="text-xs text-indigo-600 hover:underline font-bold cursor-pointer"
                >
                  Sửa
                </button>
              </div>
              <p className="text-2xl font-extrabold text-[#222325] font-mono">
                {currentUser.availableHoursPerWeek || 15} giờ / tuần
              </p>
              <p className="text-[11px] text-neutral-500">
                Linh hoạt sắp xếp ngoài giờ học chính khóa tại {currentUser.university}.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Mức thù lao kỳ vọng</span>
                </span>
                <button
                  onClick={() => onOpenEditProfile('SKILLS')}
                  className="text-xs text-emerald-700 hover:underline font-bold cursor-pointer"
                >
                  Sửa
                </button>
              </div>
              <p className="text-2xl font-extrabold text-[#222325] font-mono text-emerald-700">
                {(currentUser.hourlyRate || 80000).toLocaleString('vi-VN')} đ / giờ
              </p>
              <p className="text-[11px] text-neutral-500">
                Mức giá tham khảo khi đối tác gửi lời mời nhận task trực tiếp.
              </p>
            </div>
          </div>

          {/* Mode Switcher Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#222325]">
                {currentMode === 'TASKER' ? 'Chế độ Người thực hiện (Tasker)' : 'Chế độ Người yêu cầu (Requester)'}
              </h3>
              <p className="text-xs text-[#62646a]">
                Bạn có thể chuyển đổi bất cứ lúc nào: Đăng task để tìm người giúp hoặc nhận task của người khác để có thu nhập.
              </p>
            </div>

            <button
              onClick={onToggleMode}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Chuyển sang {currentMode === 'TASKER' ? 'Người yêu cầu' : 'Người thực hiện'}</span>
            </button>
          </div>

          {/* Verification Status Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-[#222325]">Trạng thái sinh viên: VERIFIED</h3>
              </div>
              <p className="text-xs text-[#62646a]">
                Email trường {currentUser.email} và Thẻ sinh viên ({currentUser.studentId}) đã được đối chiếu bởi Admin VIETVI.
              </p>
            </div>

            <button
              onClick={onOpenVerify}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              Xem chi tiết hồ sơ xác minh
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 2: BANKING & PAYOUT ================= */}
      {activeProfileTab === 'BANKING' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <h3 className="text-base font-bold text-[#222325]">
                Tài khoản ngân hàng thụ hưởng giải ngân Escrow
              </h3>
              <p className="text-xs text-[#62646a]">
                Tiền thù lao khi bạn hoàn thành Task sẽ được tự động giải ngân về số tài khoản này.
              </p>
            </div>
            <button
              onClick={() => onOpenEditProfile('BANKING')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Cập nhật tài khoản</span>
            </button>
          </div>

          {/* Bank Card Display */}
          <div className="max-w-md bg-gradient-to-br from-neutral-900 via-neutral-800 to-emerald-950 text-white rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm tracking-wide">
                  {currentUser.bankName || 'MB Bank (Quân Đội)'}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-900/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                VIETVI Escrow Payout
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                Số tài khoản ngân hàng
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-emerald-300">
                  {currentUser.bankAccountNumber
                    ? currentUser.bankAccountNumber.replace(/(\d{4})/g, '$1 ').trim()
                    : '9704 2288 9988 1234'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyBankAccount}
                  className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title="Sao chép số tài khoản"
                >
                  {copiedBank ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-700/60 text-xs">
              <div>
                <span className="text-[9px] text-neutral-400 uppercase block">Chủ tài khoản</span>
                <span className="font-mono font-bold tracking-wider text-sm">
                  {currentUser.bankAccountName || currentUser.displayName.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-neutral-400 uppercase block">Trạng thái</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Sẵn sàng rút tiền</span>
                </span>
              </div>
            </div>
          </div>

          {/* Security & Escrow Guarantee Box */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
            <div className="flex items-center gap-2 text-neutral-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Chính sách bảo chứng quyền lợi sinh viên 100%</span>
            </div>
            <p className="text-neutral-600 leading-relaxed text-xs">
              Mọi khoản tiền khi Người yêu cầu (Requester) tạo đơn đã được đóng băng tại Tài khoản Tạm giữ Escrow của VIETVI. Sau khi bạn giao file và người yêu cầu nghiệm thu, tiền sẽ được giải ngân trực tiếp vào STK ngân hàng ở trên trong vòng <strong>2-4 giờ làm việc</strong> (không tính phí chuyển tiền).
            </p>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SAVED TASKS ================= */}
      {activeProfileTab === 'SAVED' && (
        <div className="space-y-4">
          <p className="text-xs text-[#62646a]">
            Danh sách các Task bạn đã lưu để xem xét hoặc chuẩn bị gửi báo giá.
          </p>

          {savedTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedTasks.map((task) => (
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
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-neutral-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#222325]">Chưa có Task nào được lưu</h4>
              <p className="text-xs text-[#62646a] max-w-sm mx-auto">
                Bấm vào biểu tượng Bookmark trên bất kỳ Task nào trong sàn để lưu lại xem sau.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: SETTINGS & NOTIFICATIONS ================= */}
      {activeProfileTab === 'SETTINGS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="text-base font-bold text-[#222325]">Cài đặt thông báo & Tài khoản</h3>
            <p className="text-xs text-[#62646a]">Quản lý thông báo giao dịch và trạng thái phiên bảo mật.</p>
          </div>

          <div className="space-y-4 divide-y divide-neutral-100">
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="font-bold text-[#222325]">Thông báo Email khi có đề xuất mới</p>
                <p className="text-[11px] text-[#62646a]">Nhận email khi có bạn sinh viên gửi báo giá cho Task của bạn</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotif(!emailNotif)}
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  emailNotif ? 'bg-emerald-500 justify-end' : 'bg-neutral-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="font-bold text-[#222325]">Thông báo In-app khi có tin nhắn Order</p>
                <p className="text-[11px] text-[#62646a]">Hiển thị chuông thông báo khi đối tác gửi file hoặc nhắn tin</p>
              </div>
              <button
                type="button"
                onClick={() => setInAppNotif(!inAppNotif)}
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  inAppNotif ? 'bg-emerald-500 justify-end' : 'bg-neutral-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="font-bold text-[#222325]">Phiên đăng nhập hiện tại</p>
                <p className="text-[11px] text-[#62646a]">Được bảo mật qua mã OTP Email trường (Không dùng mật khẩu thô)</p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Đang kích hoạt
              </span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="font-bold text-neutral-800">Cập nhật nhanh thông tin cá nhân</p>
                <p className="text-[11px] text-[#62646a]">Chỉnh sửa trường, khoa, chuyên ngành, số điện thoại, kỹ năng hoặc STK</p>
              </div>
              <button
                onClick={() => onOpenEditProfile('BASIC')}
                className="px-4 py-2 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl cursor-pointer"
              >
                Mở bảng chỉnh sửa
              </button>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="font-bold text-rose-700">Đăng xuất khỏi thiết bị</p>
                <p className="text-[11px] text-[#62646a]">Vô hiệu hóa phiên làm việc và trở về chế độ Khách</p>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl cursor-pointer"
              >
                Đăng xuất an toàn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
