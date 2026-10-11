import React from 'react';
import { ActiveScreen } from '../types';
import {
  LayoutGrid,
  ListTodo,
  Briefcase,
  MessageSquare,
  User,
  ShieldCheck,
  LogOut,
  Wallet,
  AlertTriangle,
  Bell,
  FileSearch,
  Trophy,
  Award,
  BadgeCheck,
  PlusCircle,
  CreditCard,
  MessageCircle,
  Bookmark,
  HelpCircle,
  Headphones,
  ClipboardList,
  UserCheck,
  Scale,
  TrendingUp,
} from 'lucide-react';

interface MvpScreenBarProps {
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  openOrderCount: number;
  unreadNotifsCount: number;
}

export const MvpScreenBar: React.FC<MvpScreenBarProps> = ({
  activeScreen,
  onSelectScreen,
  openOrderCount,
  unreadNotifsCount,
}) => {
  const screens = [
    {
      id: 'HOME' as ActiveScreen,
      name: 'Trang chủ & Khám phá',
      tag: 'TASK-01',
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    {
      id: 'TASK_DETAIL' as ActiveScreen,
      name: 'Chi tiết Task',
      tag: 'TASK-02',
      icon: <FileSearch className="w-4 h-4" />,
    },
    {
      id: 'CREATE_TASK' as ActiveScreen,
      name: 'Đăng Task mới',
      tag: 'TASK-03',
      icon: <PlusCircle className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'MY_TASKS' as ActiveScreen,
      name: 'Task của tôi',
      tag: 'OFFER-02',
      icon: <ListTodo className="w-4 h-4" />,
    },
    {
      id: 'MY_JOBS' as ActiveScreen,
      name: 'Công việc của tôi',
      tag: 'OFFER-01',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: 'CHECKOUT_ESCROW' as ActiveScreen,
      name: 'Khóa Escrow',
      tag: 'ESCROW-01',
      icon: <CreditCard className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'ORDER_MANAGEMENT' as ActiveScreen,
      name: 'Quản lý Đơn hàng',
      tag: 'ORDER-01',
      icon: <ClipboardList className="w-4 h-4 text-emerald-400" />,
      badge: openOrderCount > 0 ? `${openOrderCount}` : undefined,
    },
    {
      id: 'ORDER_WORKSPACE' as ActiveScreen,
      name: 'Không gian Order',
      tag: 'ORDER-02',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: openOrderCount > 0 ? `${openOrderCount} Đang chạy` : undefined,
    },
    {
      id: 'MESSAGES' as ActiveScreen,
      name: 'Hộp thư Chat',
      tag: 'CHAT-01',
      icon: <MessageCircle className="w-4 h-4 text-sky-400" />,
      badge: '3 Tin nhắn',
    },
    {
      id: 'WALLET' as ActiveScreen,
      name: 'Ví & Escrow',
      tag: 'BR-02/03',
      icon: <Wallet className="w-4 h-4" />,
    },
    {
      id: 'STUDENT_ANALYTICS' as ActiveScreen,
      name: 'Thống kê Thu nhập',
      tag: 'ANALYTICS-01',
      icon: <TrendingUp className="w-4 h-4 text-violet-400" />,
    },
    {
      id: 'SAVED_TASKS' as ActiveScreen,
      name: 'Đã lưu',
      tag: 'BOOKMARK-01',
      icon: <Bookmark className="w-4 h-4 text-yellow-400" />,
    },
    {
      id: 'DISPUTES' as ActiveScreen,
      name: 'Khiếu nại',
      tag: 'MOD-01',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: '1 Tranh chấp',
    },
    {
      id: 'CAMPUS_HUB' as ActiveScreen,
      name: 'Campus Hub',
      tag: 'COMM-01',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
      badge: 'Mới',
    },
    {
      id: 'REVIEWS_CENTER' as ActiveScreen,
      name: 'Đánh giá 360°',
      tag: 'EVAL-01',
      icon: <Award className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'VERIFICATION_CENTER' as ActiveScreen,
      name: 'Định danh KYC',
      tag: 'VERIFY-01',
      icon: <BadgeCheck className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 'NOTIFICATIONS' as ActiveScreen,
      name: 'Thông báo',
      tag: 'NOTIF-01',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotifsCount > 0 ? `${unreadNotifsCount} Mới` : undefined,
    },
    {
      id: 'HELP_CENTER' as ActiveScreen,
      name: 'Trợ giúp & An toàn',
      tag: 'HELP-01',
      icon: <HelpCircle className="w-4 h-4 text-teal-400" />,
    },
    {
      id: 'INTEGRITY_POLICY' as ActiveScreen,
      name: 'Liêm chính Học thuật',
      tag: 'INTEGRITY-01',
      icon: <Scale className="w-4 h-4 text-amber-300" />,
      badge: 'Chuẩn Bộ',
    },
    {
      id: 'PROFILE' as ActiveScreen,
      name: 'Hồ sơ của tôi',
      tag: 'AUTH-03',
      icon: <User className="w-4 h-4" />,
    },
    {
      id: 'PUBLIC_PORTFOLIO' as ActiveScreen,
      name: 'Hồ sơ Công khai',
      tag: 'PORTFOLIO-01',
      icon: <UserCheck className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'STAFF' as ActiveScreen,
      name: 'Bàn làm việc Staff',
      tag: 'OPS-01',
      icon: <Headphones className="w-4 h-4 text-indigo-400" />,
      badge: '3 Ca chờ',
    },
    {
      id: 'ADMIN' as ActiveScreen,
      name: 'Admin Vận hành',
      tag: 'ADMIN-01',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: '2 Chờ duyệt',
    },
    {
      id: 'LOGGED_OUT' as ActiveScreen,
      name: 'Đã đăng xuất',
      tag: 'AUTH-02',
      icon: <LogOut className="w-4 h-4 text-rose-400" />,
    },
  ];

  return (
    <aside aria-label="Điều hướng màn hình MVP" className="bg-[#222325] text-white border-b border-neutral-700/80 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wide uppercase text-neutral-300 text-[11px]">
            MVP v0.1 — Danh sách màn hình &amp; Liên kết luồng:
          </span>
        </div>

        <nav aria-label="Màn hình MVP" className="flex items-center gap-1.5 overflow-x-auto w-full xl:w-auto py-1 scrollbar-none">
          {screens.map((s) => {
            const isActive = activeScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectScreen(s.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1dbf73] text-white font-bold shadow-xs'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.name}</span>
                {s.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-emerald-900 text-white' : 'bg-neutral-700 text-neutral-300'
                    }`}
                  >
                    {s.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
