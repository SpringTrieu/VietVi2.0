import React, { useState } from 'react';
import { OfferItem, OrderItem } from '../../types';
import { Briefcase, Clock, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, DollarSign, ClipboardList, TrendingUp } from 'lucide-react';

interface MyJobsScreenProps {
  myOffers: OfferItem[];
  myOrders: OrderItem[];
  onOpenOrder: (order: OrderItem) => void;
  onExploreTasks: () => void;
  onNavigateToOrders?: () => void;
  onNavigateToAnalytics?: () => void;
}

export const MyJobsScreen: React.FC<MyJobsScreenProps> = ({
  myOffers,
  myOrders,
  onOpenOrder,
  onExploreTasks,
  onNavigateToOrders,
  onNavigateToAnalytics,
}) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'OFFERS'>('ORDERS');

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const totalEarnings = myOrders
    .filter((o) => o.status === 'COMPLETED')
    .reduce((acc, o) => acc + o.payoutAmount, 0);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
            <span>Vai trò: Người thực hiện (Tasker)</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#62646a]">Quản lý công việc & thù lao</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
            Công việc của tôi
          </h1>
          <p className="text-xs sm:text-sm text-[#62646a] mt-1">
            Theo dõi các Order bạn đang đảm nhận, bàn giao tệp sản phẩm và quản lý các báo giá đã gửi.
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

          {onNavigateToAnalytics && (
            <button
              onClick={onNavigateToAnalytics}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xl transition-all cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5 text-violet-600" />
              <span>Phân tích Thu nhập</span>
            </button>
          )}

          <button
            onClick={onExploreTasks}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>Tìm Task mới</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-xs text-[#62646a] block">Thù lao đã nhận (Nghiệm thu)</span>
          <span className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums mt-1 block">
            {formatVND(totalEarnings)}
          </span>
          <span className="text-[11px] text-neutral-400 mt-1 block">Được giải ngân đầy đủ 100% không phí ẩn</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-xs text-[#62646a] block">Order đang thực hiện</span>
          <span className="text-2xl font-extrabold text-[#222325] font-mono tabular-nums mt-1 block">
            {myOrders.filter((o) => o.status === 'IN_PROGRESS').length} Order
          </span>
          <span className="text-[11px] text-blue-600 mt-1 block">Đang được bảo chứng bởi hệ thống Escrow</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-xs text-[#62646a] block">Đánh giá 3 chiều trung bình</span>
          <span className="text-2xl font-extrabold text-amber-500 font-mono tabular-nums mt-1 block">
            ★ 4.95 / 5.0
          </span>
          <span className="text-[11px] text-neutral-400 mt-1 block">Từ 16 sinh viên đã nghiệm thu</span>
        </div>
      </div>

      {/* Toggle between Orders & Offers */}
      <div className="flex items-center space-x-2 mb-6 border-b border-neutral-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'ORDERS'
              ? 'bg-[#222325] text-white'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          Đơn hàng Order ({myOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('OFFERS')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'OFFERS'
              ? 'bg-[#222325] text-white'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          Báo giá đã gửi ({myOffers.length})
        </button>
      </div>

      {/* Orders List View */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          {myOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-[#62646a] flex-wrap">
                  <span className="font-mono font-bold text-[#222325]">Mã đơn: #{order.id}</span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      order.status === 'IN_PROGRESS'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : order.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {order.status === 'IN_PROGRESS' ? 'Đang thực hiện' : 'Đã hoàn tất & Nghiệm thu'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Tạo lúc {order.createdAt}</span>
                </div>

                <h3 className="text-base font-bold text-[#222325] leading-snug">
                  {order.taskTitle}
                </h3>

                <div className="flex items-center gap-2 text-xs text-[#62646a]">
                  <span>Người yêu cầu: <strong>{order.requester.displayName}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>{order.requester.university}</span>
                </div>

                {order.deliveries.length > 0 && (
                  <div className="pt-1 text-xs text-emerald-800">
                    <span>Đã bàn giao {order.deliveries.length} phiên bản tệp đính kèm.</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
                <div>
                  <span className="block text-[11px] text-[#62646a]">Thù lao thỏa thuận</span>
                  <span className="text-base font-bold text-[#222325] font-mono tabular-nums">
                    {formatVND(order.agreedPrice)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="block text-[11px] text-[#62646a] flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> Hạn bàn giao
                  </span>
                  <span className="text-xs font-semibold text-[#222325]">{order.deadline}</span>
                </div>

                <button
                  onClick={() => onOpenOrder(order)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Vào Order & Bàn giao</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Offers List View */}
      {activeTab === 'OFFERS' && (
        <div className="space-y-4">
          {myOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-[#62646a]">
                  <span className="font-mono">#{offer.id}</span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      offer.status === 'PENDING'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : offer.status === 'ACCEPTED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {offer.status === 'PENDING' ? 'Đang chờ phản hồi' : 'Đã được chấp nhận'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Gửi {offer.createdAt}</span>
                </div>

                <h3 className="text-base font-bold text-[#222325]">
                  {offer.taskTitle}
                </h3>

                <p className="text-xs text-[#404145] bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                  Lời nhắn: &ldquo;{offer.message}&rdquo;
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="block text-[11px] text-[#62646a]">Giá bạn đề xuất</span>
                <span className="text-base font-bold text-[#222325] font-mono tabular-nums">
                  {formatVND(offer.proposedPrice)}
                </span>
                <span className="block text-[11px] text-[#62646a]">
                  Dự kiến hoàn thành: {offer.deliveryDays} ngày
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
