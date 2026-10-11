import React, { useState } from 'react';
import { NotificationItem, ActiveScreen } from '../../types';
import {
  Bell,
  CheckCircle,
  Clock,
  Briefcase,
  MessageSquare,
  ShieldCheck,
  Wallet,
  AlertTriangle,
  ArrowRight,
  Check,
  ArrowRightLeft,
} from 'lucide-react';

interface NotificationCenterScreenProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onNotificationClick: (notif: NotificationItem) => void;
}

export const NotificationCenterScreen: React.FC<NotificationCenterScreenProps> = ({
  notifications,
  onMarkAllAsRead,
  onNotificationClick,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'OFFER_RECEIVED':
      case 'OFFER_ACCEPTED':
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
      case 'DELIVERY_SUBMITTED':
      case 'REVISION_REQUESTED':
      case 'ORDER_COMPLETED':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'VERIFIED':
        return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      case 'DISPUTE_OPENED':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'SYSTEM':
        return <ArrowRightLeft className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-600" />;
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'OFFERS') return n.type.includes('OFFER');
    if (filterType === 'ORDERS') return n.type.includes('ORDER') || n.type.includes('DELIVERY') || n.type.includes('REVISION');
    if (filterType === 'FINANCE') return n.type.includes('ORDER_COMPLETED') || n.type.includes('ESCROW');
    if (filterType === 'SYSTEM') return n.type === 'SYSTEM' || n.type === 'VERIFIED';
    return true;
  });

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Trung tâm Thông báo Giao dịch (NOTIF-01)</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#62646a]">Thời gian thực</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
            Thông báo &amp; Cập nhật sự kiện
          </h1>
          <p className="text-xs sm:text-sm text-[#62646a] mt-1">
            Nhấp vào từng thông báo để chuyển thẳng đến màn hình giải quyết công việc tương ứng.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#404145] bg-white border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Đánh dấu tất cả đã đọc</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 pb-3 overflow-x-auto scrollbar-none text-xs font-semibold">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
            filterType === 'ALL'
              ? 'bg-[#222325] text-white font-bold'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('OFFERS')}
          className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
            filterType === 'OFFERS'
              ? 'bg-emerald-700 text-white font-bold'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          Báo giá &amp; Đề xuất
        </button>
        <button
          onClick={() => setFilterType('ORDERS')}
          className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
            filterType === 'ORDERS'
              ? 'bg-blue-700 text-white font-bold'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          Đơn hàng &amp; Bàn giao
        </button>
        <button
          onClick={() => setFilterType('FINANCE')}
          className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
            filterType === 'FINANCE'
              ? 'bg-purple-700 text-white font-bold'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          Giải ngân &amp; Ví
        </button>
        <button
          onClick={() => setFilterType('SYSTEM')}
          className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
            filterType === 'SYSTEM'
              ? 'bg-emerald-800 text-white font-bold'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          Hệ thống &amp; Vai trò
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-neutral-200 text-center space-y-3">
            <Bell className="w-10 h-10 text-neutral-300 mx-auto" />
            <h4 className="text-base font-bold text-[#222325]">Không có thông báo nào</h4>
            <p className="text-xs text-[#62646a]">
              Mọi cập nhật về Task, đề xuất và thù lao sẽ xuất hiện tại đây.
            </p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onNotificationClick(notif)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !notif.read
                  ? 'bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-200'
                  : 'bg-white/80 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0">
                  {getNotificationIcon(notif.type)}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#222325] truncate">
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-[#404145] leading-relaxed">
                    {notif.content}
                  </p>

                  <span className="text-[11px] text-neutral-400 block pt-0.5">
                    {notif.createdAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0 self-center">
                <span className="hidden sm:inline">Xem ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
