import React from 'react';
import { UserMode, ActiveScreen, NotificationItem, UserProfile } from '../types';
import { UserRole } from './RoleSwitcherBar';
import {
  Bell,
  Plus,
  ShieldCheck,
  ArrowRightLeft,
  Menu,
  X,
  LogIn,
  Shield,
  Wallet,
  AlertTriangle,
  MessageCircle,
  Bookmark,
  HelpCircle,
  Headphones,
  Scale,
  ClipboardList,
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  currentMode: UserMode;
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  onToggleMode: () => void;
  onOpenPostTask: () => void;
  onOpenVerify: () => void;
  onTriggerAuth: (intent: string) => void;
  unreadNotifsCount?: number;
  recentNotifications?: NotificationItem[];
  currentUser?: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentMode,
  activeScreen,
  onSelectScreen,
  onToggleMode,
  onOpenPostTask,
  onOpenVerify,
  onTriggerAuth,
  unreadNotifsCount = 0,
  recentNotifications = [],
  currentUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);

  const handleNavClick = (screen: ActiveScreen) => {
    onSelectScreen(screen);
    setMobileMenuOpen(false);
    if (screen === 'HOME') {
      const el = document.getElementById('market-tasks');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavClick('HOME')}
              className="flex items-center gap-1.5 focus-visible:outline-none cursor-pointer"
            >
              <span className="text-2xl font-bold tracking-tight text-[#222325]">
                VIET<span className="text-[#1dbf73]">VI</span>
              </span>
              <span className="h-2 w-2 rounded-full bg-[#1dbf73]" aria-hidden="true" />
            </button>
          </div>

          {/* Zone 2: Navigation Links depending on Current Role */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-[#404145]">
            <button
              onClick={() => handleNavClick('HOME')}
              className={`transition-colors py-1 cursor-pointer ${
                activeScreen === 'HOME'
                  ? 'text-[#222325] font-bold border-b-2 border-[#1dbf73]'
                  : 'hover:text-[#222325]'
              }`}
            >
              Khám phá Task
            </button>

            {currentRole === 'GUEST' && (
              <>
                <a href="#how-it-works" className="hover:text-[#222325] transition-colors py-1">
                  Quy trình 4 bước
                </a>
                <a href="#trust-pillars" className="hover:text-[#222325] transition-colors py-1">
                  Bảo chứng Escrow
                </a>
                <a href="#official-faq" className="hover:text-[#222325] transition-colors py-1">
                  Hỗ trợ &amp; FAQ
                </a>
              </>
            )}

            {currentRole === 'USER' && (
              <>
                {currentMode === 'REQUESTER' ? (
                  <>
                    <button
                      onClick={() => handleNavClick('MY_TASKS')}
                      className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                        activeScreen === 'MY_TASKS'
                          ? 'text-indigo-900 font-bold border-b-2 border-indigo-600'
                          : 'hover:text-[#222325]'
                      }`}
                    >
                      <span>Task của tôi</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                        4 đề xuất
                      </span>
                    </button>

                    <button
                      onClick={() => handleNavClick('ORDER_MANAGEMENT')}
                      className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                        activeScreen === 'ORDER_MANAGEMENT' || activeScreen === 'ORDER_WORKSPACE'
                          ? 'text-indigo-900 font-bold border-b-2 border-indigo-600'
                          : 'hover:text-[#222325]'
                      }`}
                    >
                      <ClipboardList className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Đơn thuê ({recentNotifications.length > 0 ? 'Mới' : '2'})</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </button>

                    <button
                      onClick={() => handleNavClick('WALLET')}
                      className={`transition-colors py-1 cursor-pointer flex items-center gap-1 ${
                        activeScreen === 'WALLET'
                          ? 'text-[#222325] font-bold border-b-2 border-[#1dbf73]'
                          : 'hover:text-[#222325]'
                      }`}
                    >
                      <Wallet className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Ví ký quỹ</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavClick('MY_JOBS')}
                      className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                        activeScreen === 'MY_JOBS'
                          ? 'text-emerald-900 font-bold border-b-2 border-[#1dbf73]'
                          : 'hover:text-[#222325]'
                      }`}
                    >
                      <span>Công việc &amp; Báo giá</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        2 việc
                      </span>
                    </button>

                    <button
                      onClick={() => handleNavClick('ORDER_MANAGEMENT')}
                      className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                        activeScreen === 'ORDER_MANAGEMENT' || activeScreen === 'ORDER_WORKSPACE'
                          ? 'text-emerald-900 font-bold border-b-2 border-[#1dbf73]'
                          : 'hover:text-[#222325]'
                      }`}
                    >
                      <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đơn hàng &amp; Hợp đồng</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </button>

                    <button
                      onClick={() => handleNavClick('WALLET')}
                      className={`transition-colors py-1 cursor-pointer flex items-center gap-1 ${
                        activeScreen === 'WALLET'
                          ? 'text-[#222325] font-bold border-b-2 border-[#1dbf73]'
                          : 'hover:text-[#222325]'
                      }`}
                    >
                      <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ví thu nhập</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleNavClick('CAMPUS_HUB')}
                  className={`transition-colors py-1 cursor-pointer flex items-center gap-1 ${
                    activeScreen === 'CAMPUS_HUB'
                      ? 'text-[#222325] font-bold border-b-2 border-amber-500'
                      : 'hover:text-[#222325]'
                  }`}
                >
                  <span className="text-amber-500">🏆</span>
                  <span>Campus Hub</span>
                </button>

                <button
                  onClick={() => handleNavClick('SAVED_TASKS')}
                  className={`transition-colors py-1 cursor-pointer flex items-center gap-1 ${
                    activeScreen === 'SAVED_TASKS'
                      ? 'text-[#222325] font-bold border-b-2 border-yellow-500'
                      : 'hover:text-[#222325]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 text-yellow-600" />
                  <span>Đã lưu</span>
                </button>

                <button
                  onClick={() => handleNavClick('DISPUTES')}
                  className={`transition-colors py-1 cursor-pointer flex items-center gap-1 ${
                    activeScreen === 'DISPUTES'
                      ? 'text-rose-700 font-bold border-b-2 border-rose-600'
                      : 'hover:text-rose-700 text-[#404145]'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Khiếu nại</span>
                </button>

                <button
                  onClick={() => handleNavClick('HELP_CENTER')}
                  className={`transition-colors py-1 cursor-pointer flex items-center gap-1 ${
                    activeScreen === 'HELP_CENTER'
                      ? 'text-[#222325] font-bold border-b-2 border-teal-600'
                      : 'hover:text-[#222325]'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Trợ giúp</span>
                </button>

                <button
                  onClick={() => handleNavClick('INTEGRITY_POLICY')}
                  className={`transition-colors py-1 cursor-pointer flex items-center gap-1 ${
                    activeScreen === 'INTEGRITY_POLICY'
                      ? 'text-amber-800 font-bold border-b-2 border-amber-500'
                      : 'hover:text-[#222325]'
                  }`}
                  title="Quy tắc Liêm chính Học thuật & Tiêu chuẩn SV"
                >
                  <Scale className="w-3.5 h-3.5 text-amber-500" />
                  <span>Liêm chính SV</span>
                </button>
              </>
            )}

            {currentRole === 'STAFF' && (
              <>
                <button
                  onClick={() => handleNavClick('STAFF')}
                  className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                    activeScreen === 'STAFF'
                      ? 'text-indigo-700 font-bold border-b-2 border-indigo-700'
                      : 'text-indigo-900/80 hover:text-indigo-900 font-semibold'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Bàn làm việc Staff</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </button>
                <button
                  onClick={() => handleNavClick('STAFF')}
                  className="transition-colors py-1 cursor-pointer text-xs text-neutral-600 hover:text-indigo-700"
                >
                  Duyệt Tick xanh SV
                </button>
                <button
                  onClick={() => handleNavClick('DISPUTES')}
                  className={`transition-colors py-1 cursor-pointer text-xs ${
                    activeScreen === 'DISPUTES' ? 'text-rose-700 font-bold' : 'text-neutral-500'
                  }`}
                >
                  Trọng tài Escrow
                </button>
                <button
                  onClick={() => handleNavClick('HELP_CENTER')}
                  className="transition-colors py-1 cursor-pointer text-xs text-neutral-600 hover:text-indigo-700"
                >
                  Ticket CSKH
                </button>
              </>
            )}

            {currentRole === 'ADMIN' && (
              <>
                <button
                  onClick={() => handleNavClick('ADMIN')}
                  className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                    activeScreen === 'ADMIN'
                      ? 'text-purple-700 font-bold border-b-2 border-purple-700'
                      : 'text-purple-900/80 hover:text-purple-900 font-semibold'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Vận hành</span>
                </button>
                <button
                  onClick={() => handleNavClick('DISPUTES')}
                  className={`transition-colors py-1 cursor-pointer text-xs ${
                    activeScreen === 'DISPUTES' ? 'text-rose-700 font-bold' : 'text-neutral-500'
                  }`}
                >
                  Hòa giải tranh chấp
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Actions depending on Role */}
          <div className="flex items-center gap-3">
            {/* If GUEST: Login CTA */}
            {currentRole === 'GUEST' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTriggerAuth('LOGIN')}
                  className="px-3.5 py-2 text-xs font-bold text-[#404145] hover:text-[#222325] hover:bg-neutral-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </button>

                <button
                  onClick={() => onTriggerAuth('POST_TASK')}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Đăng Task ngay</span>
                </button>
              </div>
            )}

            {/* If USER: Mode Switcher, Post Task, Notifications, Avatar */}
            {currentRole === 'USER' && (
              <>
                <button
                  onClick={onToggleMode}
                  className={`hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer shadow-xs ${
                    currentMode === 'TASKER'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'
                  }`}
                  title="Chuyển đổi linh hoạt giữa Người yêu cầu và Người thực hiện"
                >
                  <ArrowRightLeft
                    className={`w-3.5 h-3.5 ${
                      currentMode === 'TASKER' ? 'text-emerald-600' : 'text-indigo-600'
                    }`}
                  />
                  <span className="whitespace-nowrap font-bold">
                    {currentMode === 'TASKER' ? 'Chế độ: Người thực hiện' : 'Chế độ: Người yêu cầu'}
                  </span>
                </button>

                <button
                  onClick={onOpenVerify}
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Xác minh SV</span>
                </button>

                {/* Direct Messages & Chat */}
                <button
                  onClick={() => handleNavClick('MESSAGES')}
                  className={`p-2 rounded-lg transition-colors relative cursor-pointer ${
                    activeScreen === 'MESSAGES'
                      ? 'bg-neutral-100 text-[#222325]'
                      : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
                  }`}
                  title="Hộp thư Trao đổi Sinh viên"
                  aria-label="Hộp thư Chat"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full" />
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="p-2 text-[#62646a] hover:text-[#222325] hover:bg-neutral-100 rounded-lg transition-colors relative cursor-pointer"
                    aria-label="Thông báo giao dịch"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifsCount > 0 && (
                      <span className="absolute top-1 right-1 px-1 min-w-4 h-4 bg-emerald-500 text-white font-mono text-[10px] rounded-full flex items-center justify-center font-bold">
                        {unreadNotifsCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-neutral-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100 text-xs font-semibold text-[#222325]">
                        <span>Thông báo ({unreadNotifsCount} chưa đọc)</span>
                        <button
                          onClick={() => {
                            setNotifOpen(false);
                            onSelectScreen('NOTIFICATIONS');
                          }}
                          className="text-emerald-700 font-bold hover:underline cursor-pointer"
                        >
                          Xem tất cả
                        </button>
                      </div>
                      <div className="py-2 space-y-2 text-xs max-h-72 overflow-y-auto">
                        {recentNotifications.slice(0, 3).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              setNotifOpen(false);
                              onSelectScreen(n.targetScreen);
                            }}
                            className="p-2.5 bg-neutral-50 hover:bg-emerald-50/70 rounded-xl cursor-pointer transition-colors"
                          >
                            <p className="font-bold text-[#222325]">{n.title}</p>
                            <p className="text-[#62646a] text-[11px] mt-0.5 line-clamp-2">
                              {n.content}
                            </p>
                            <span className="text-[10px] text-neutral-400 mt-1 block">
                              {n.createdAt}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {currentMode === 'REQUESTER' ? (
                  <button
                    onClick={onOpenPostTask}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm whitespace-nowrap cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>+ Đăng Task</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleNavClick('HOME');
                      setTimeout(() => {
                        const el = document.getElementById('market-tasks');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl transition-colors shadow-sm whitespace-nowrap cursor-pointer"
                  >
                    <span>Tìm việc nhận làm</span>
                  </button>
                )}

                <button
                  onClick={() => handleNavClick('PROFILE')}
                  className={`hidden sm:flex items-center gap-2 pl-2 border-l border-neutral-200 cursor-pointer p-1 rounded-lg hover:bg-neutral-50 transition-colors ${
                    activeScreen === 'PROFILE' ? 'ring-2 ring-emerald-500' : ''
                  }`}
                  title="Xem hồ sơ sinh viên của bạn"
                >
                  <div
                    className={`w-8 h-8 rounded-full ${
                      currentUser?.avatarBg || 'bg-emerald-600'
                    } text-white font-bold text-xs flex items-center justify-center shrink-0`}
                  >
                    {currentUser?.displayName
                      ? currentUser.displayName
                          .trim()
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((w) => w[0]?.toUpperCase() || '')
                          .join('')
                      : 'SV'}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-semibold text-[#222325] leading-tight truncate max-w-[120px]">
                      {currentUser?.displayName || 'Minh Anh'}
                    </p>
                    <p className="text-[11px] text-[#62646a] leading-tight truncate max-w-[120px]">
                      {currentUser?.university || 'ĐHBK Hà Nội'}
                    </p>
                  </div>
                </button>
              </>
            )}

            {/* If ADMIN */}
            {currentRole === 'ADMIN' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('ADMIN')}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-4 h-4" />
                  <span>Quản trị viên</span>
                </button>
              </div>
            )}

            {/* Mobile hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#62646a] md:hidden hover:bg-neutral-100 rounded-lg"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-[#404145]">
            <button
              onClick={() => handleNavClick('HOME')}
              className="text-left py-1.5 hover:text-[#222325]"
            >
              Khám phá Task
            </button>

            {currentRole === 'USER' && (
              <>
                <button
                  onClick={() => {
                    onToggleMode();
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                    currentMode === 'TASKER'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-indigo-50 text-indigo-900 border-indigo-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                    <span>
                      {currentMode === 'TASKER'
                        ? 'Chế độ: Người thực hiện (Tasker)'
                        : 'Chế độ: Người yêu cầu (Requester)'}
                    </span>
                  </span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-lg border border-neutral-200">Đổi vai trò →</span>
                </button>

                <button
                  onClick={() => handleNavClick('MY_TASKS')}
                  className="text-left py-1.5 hover:text-[#222325]"
                >
                  Task của tôi (Requester)
                </button>
                <button
                  onClick={() => handleNavClick('MY_JOBS')}
                  className="text-left py-1.5 hover:text-[#222325]"
                >
                  Công việc của tôi (Tasker)
                </button>
                <button
                  onClick={() => handleNavClick('ORDER_WORKSPACE')}
                  className="text-left py-1.5 hover:text-[#222325]"
                >
                  Không gian Order &amp; Chat
                </button>
                <button
                  onClick={() => handleNavClick('WALLET')}
                  className="text-left py-1.5 hover:text-[#222325]"
                >
                  Ví sinh viên &amp; Escrow
                </button>
                <button
                  onClick={() => handleNavClick('CAMPUS_HUB')}
                  className="text-left py-1.5 hover:text-[#222325]"
                >
                  Campus Hub &amp; Top Tasker
                </button>
                <button
                  onClick={() => handleNavClick('REVIEWS_CENTER')}
                  className="text-left py-1.5 hover:text-[#222325]"
                >
                  Đánh giá &amp; Tín nhiệm 360°
                </button>
                <button
                  onClick={() => handleNavClick('VERIFICATION_CENTER')}
                  className="text-left py-1.5 hover:text-[#222325]"
                >
                  Định danh SV (KYC Tick Xanh)
                </button>
                <button
                  onClick={() => handleNavClick('MESSAGES')}
                  className="text-left py-1.5 hover:text-[#222325]"
                >
                  Hộp thư Chat Sinh viên
                </button>
                <button
                  onClick={() => handleNavClick('SAVED_TASKS')}
                  className="text-left py-1.5 hover:text-[#222325]"
                >
                  Task đã lưu &amp; Theo dõi
                </button>
                <button
                  onClick={() => handleNavClick('DISPUTES')}
                  className="text-left py-1.5 text-rose-600 font-semibold"
                >
                  Trung tâm Khiếu nại
                </button>
                <button
                  onClick={() => handleNavClick('ORDER_MANAGEMENT')}
                  className="text-left py-1.5 hover:text-[#222325] text-emerald-800 font-semibold"
                >
                  Quản lý Đơn hàng & Hợp đồng (ORDER-01)
                </button>
                <button
                  onClick={() => handleNavClick('STUDENT_ANALYTICS')}
                  className="text-left py-1.5 hover:text-[#222325] text-violet-800 font-semibold"
                >
                  Phân tích Thu nhập (ANALYTICS-01)
                </button>
                <button
                  onClick={() => handleNavClick('PUBLIC_PORTFOLIO')}
                  className="text-left py-1.5 hover:text-[#222325] text-blue-800 font-semibold"
                >
                  Showcase Portfolio SV (PORTFOLIO-01)
                </button>
                <button
                  onClick={() => handleNavClick('INTEGRITY_POLICY')}
                  className="text-left py-1.5 hover:text-[#222325] text-amber-800 font-semibold"
                >
                  Liêm chính Học thuật (INTEGRITY-01)
                </button>
                <button
                  onClick={() => handleNavClick('HELP_CENTER')}
                  className="text-left py-1.5 hover:text-[#222325]"
                >
                  Trợ giúp &amp; An toàn
                </button>
                <button
                  onClick={() => handleNavClick('NOTIFICATIONS')}
                  className="text-left py-1.5 hover:text-[#222325]"
                >
                  Trung tâm Thông báo
                </button>
                <button
                  onClick={() => handleNavClick('PROFILE')}
                  className="text-left py-1.5 hover:text-[#222325]"
                >
                  Hồ sơ sinh viên
                </button>
              </>
            )}

            {currentRole === 'STAFF' && (
              <>
                <button
                  onClick={() => handleNavClick('STAFF')}
                  className="text-left py-1.5 text-indigo-700 font-bold flex items-center gap-2"
                >
                  <Headphones className="w-4 h-4 text-indigo-600" />
                  <span>Bàn làm việc Staff (Desk)</span>
                </button>
                <button
                  onClick={() => handleNavClick('DISPUTES')}
                  className="text-left py-1.5 text-rose-600 font-semibold"
                >
                  Trọng tài hòa giải Escrow
                </button>
              </>
            )}

            {currentRole === 'ADMIN' && (
              <button
                onClick={() => handleNavClick('ADMIN')}
                className="text-left py-1.5 text-purple-700 font-bold"
              >
                Bảng điều khiển Admin
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
