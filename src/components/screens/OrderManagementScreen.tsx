import React, { useState, useMemo } from 'react';
import {
  OrderItem,
  UserProfile,
  UserMode,
  OrderStatus,
  ContractVoucherData,
} from '../../types';
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Building2,
  Copy,
  ExternalLink,
  ChevronRight,
  Download,
  QrCode,
  X,
  BadgeCheck,
  Calendar,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';

interface OrderManagementScreenProps {
  orders: OrderItem[];
  currentUser: UserProfile;
  userMode: UserMode;
  onOpenOrderWorkspace: (order: OrderItem) => void;
  onOpenDispute: (order: OrderItem) => void;
  onNavigateToScreen: (screenName: any) => void;
  onExploreTasks: () => void;
}

export const OrderManagementScreen: React.FC<OrderManagementScreenProps> = ({
  orders,
  currentUser,
  userMode,
  onOpenOrderWorkspace,
  onOpenDispute,
  onNavigateToScreen,
  onExploreTasks,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | OrderStatus>('ALL');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'AS_REQUESTER' | 'AS_TASKER'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<ContractVoucherData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [receiptToast, setReceiptToast] = useState(false);

  // Filter orders based on search, status tab, and role
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Role filter
      if (roleFilter === 'AS_REQUESTER') {
        const isReq = order.requester.id === currentUser.id || order.requester.displayName === currentUser.displayName;
        if (!isReq) return false;
      } else if (roleFilter === 'AS_TASKER') {
        const isTasker = order.tasker.id === currentUser.id || order.tasker.displayName === currentUser.displayName;
        if (!isTasker) return false;
      }

      // Status tab
      if (activeTab !== 'ALL' && order.status !== activeTab) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesTitle = order.taskTitle.toLowerCase().includes(q);
        const matchesRequester = order.requester.displayName.toLowerCase().includes(q);
        const matchesTasker = order.tasker.displayName.toLowerCase().includes(q);
        const matchesUni =
          order.requester.university.toLowerCase().includes(q) ||
          order.tasker.university.toLowerCase().includes(q);
        return matchesId || matchesTitle || matchesRequester || matchesTasker || matchesUni;
      }

      return true;
    });
  }, [orders, activeTab, roleFilter, searchQuery, currentUser]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = orders.length;
    const inProgress = orders.filter((o) => o.status === 'IN_PROGRESS' || o.status === 'DELIVERED').length;
    const completed = orders.filter((o) => o.status === 'COMPLETED').length;
    const disputed = orders.filter((o) => o.status === 'DISPUTED').length;
    const totalEscrowLocked = orders
      .filter((o) => o.status === 'IN_PROGRESS' || o.status === 'DELIVERED' || o.status === 'REVISION_REQUESTED')
      .reduce((sum, o) => sum + o.agreedPrice, 0);

    return { total, inProgress, completed, disputed, totalEscrowLocked };
  }, [orders]);

  const handleCopyOrderId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenVoucher = (order: OrderItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVoucher({
      orderId: order.id,
      taskTitle: order.taskTitle,
      requesterName: order.requester.displayName,
      requesterUni: order.requester.university,
      requesterStudentId: order.requester.studentId || 'SV-2022-NEU',
      taskerName: order.tasker.displayName,
      taskerUni: order.tasker.university,
      taskerStudentId: order.tasker.studentId || 'SV-2022-HUST',
      agreedPrice: order.agreedPrice,
      escrowRef: `ESC-${order.id.replace('ORD-', '')}-VIETVI`,
      createdAt: order.createdAt,
      deadline: order.deadline,
      status: order.status,
      escrowPledgeHash: `SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`,
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'IN_PROGRESS':
        return {
          label: 'Đang thực hiện',
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          dot: 'bg-sky-500',
        };
      case 'DELIVERED':
        return {
          label: 'Đã nộp bài · Chờ nghiệm thu',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500 animate-pulse',
        };
      case 'REVISION_REQUESTED':
        return {
          label: 'Yêu cầu chỉnh sửa',
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          dot: 'bg-orange-500',
        };
      case 'COMPLETED':
        return {
          label: 'Đã hoàn thành',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'DISPUTED':
        return {
          label: 'Đang khiếu nại / Trọng tài',
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500 animate-pulse',
        };
      case 'CANCELLED':
        return {
          label: 'Đã hủy',
          bg: 'bg-neutral-100 text-neutral-600 border-neutral-200',
          dot: 'bg-neutral-400',
        };
      default:
        return {
          label: status,
          bg: 'bg-neutral-100 text-neutral-700 border-neutral-200',
          dot: 'bg-neutral-500',
        };
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#62646a] mb-1">
              <span className="font-semibold text-emerald-600">VIETVI Marketplace</span>
              <span>/</span>
              <span>Hợp đồng &amp; Giao dịch</span>
              <span>/</span>
              <span className="font-bold text-[#222325]">Mã màn: ORDER-01</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#222325] tracking-tight">
                  Quản lý Đơn hàng &amp; Hợp đồng Sinh viên
                </h1>
                <p className="text-xs text-[#62646a]">
                  Theo dõi trạng thái tiến độ, bảo chứng tiền ký quỹ Escrow 100% và biên nhận hợp đồng số.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigateToScreen('INTEGRITY_POLICY')}
              className="px-3.5 py-2 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Quy tắc Liêm chính Học thuật</span>
            </button>
            <button
              onClick={onExploreTasks}
              className="px-4 py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Tìm thêm Task mới</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold text-neutral-600">Tổng Đơn Hàng</span>
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-[#222325]">{stats.total}</div>
            <div className="text-[11px] text-neutral-500 mt-1">Đã khởi tạo trên hệ thống</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold text-neutral-600">Đang thực hiện</span>
              <Clock className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-sky-700">{stats.inProgress}</div>
            <div className="text-[11px] text-sky-600 font-medium mt-1">Tiến độ chạy đúng SLA</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold text-neutral-600">Tiền Ký Quỹ Escrow</span>
              <ShieldCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-600">
              {stats.totalEscrowLocked.toLocaleString('vi-VN')} đ
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Đang khóa an toàn trong két</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold text-neutral-600">Đã Hoàn Thành</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600">{stats.completed}</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">0% Phí hoa hồng sàn</div>
          </div>
        </div>

        {/* Filter Toolbar: Role Switcher & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Perspective Filter */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl text-xs font-medium">
              <button
                onClick={() => setRoleFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  roleFilter === 'ALL'
                    ? 'bg-white font-bold text-[#222325] shadow-xs'
                    : 'text-[#62646a] hover:text-[#222325]'
                }`}
              >
                Tất cả vai trò
              </button>
              <button
                onClick={() => setRoleFilter('AS_REQUESTER')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  roleFilter === 'AS_REQUESTER'
                    ? 'bg-white font-bold text-indigo-700 shadow-xs'
                    : 'text-[#62646a] hover:text-[#222325]'
                }`}
              >
                Tôi là Bên Thuê (Requester)
              </button>
              <button
                onClick={() => setRoleFilter('AS_TASKER')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  roleFilter === 'AS_TASKER'
                    ? 'bg-white font-bold text-emerald-700 shadow-xs'
                    : 'text-[#62646a] hover:text-[#222325]'
                }`}
              >
                Tôi là Sinh viên nhận việc (Tasker)
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mã đơn, tên task, bạn SV..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 hover:bg-neutral-100/80 focus:bg-white border border-neutral-200 rounded-xl outline-none focus:border-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Status Tabs Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-neutral-100 scrollbar-none text-xs">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'ALL'
                  ? 'bg-emerald-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Tất cả ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('IN_PROGRESS')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'IN_PROGRESS'
                  ? 'bg-sky-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Đang làm ({orders.filter((o) => o.status === 'IN_PROGRESS').length})
            </button>
            <button
              onClick={() => setActiveTab('DELIVERED')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'DELIVERED'
                  ? 'bg-amber-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Chờ nghiệm thu ({orders.filter((o) => o.status === 'DELIVERED').length})
            </button>
            <button
              onClick={() => setActiveTab('REVISION_REQUESTED')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'REVISION_REQUESTED'
                  ? 'bg-orange-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Cần sửa bài ({orders.filter((o) => o.status === 'REVISION_REQUESTED').length})
            </button>
            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'COMPLETED'
                  ? 'bg-emerald-700 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Đã hoàn thành ({orders.filter((o) => o.status === 'COMPLETED').length})
            </button>
            <button
              onClick={() => setActiveTab('DISPUTED')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'DISPUTED'
                  ? 'bg-rose-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Tranh chấp ({orders.filter((o) => o.status === 'DISPUTED').length})
            </button>
          </div>
        </div>

        {/* Orders List Section */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const badge = getStatusBadge(order.status);
              const latestDelivery = order.deliveries?.[order.deliveries.length - 1];
              const isUserRequester =
                order.requester.id === currentUser.id ||
                order.requester.displayName === currentUser.displayName;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden"
                >
                  {/* Top Bar of Card */}
                  <div className="p-4 sm:px-6 bg-neutral-50/80 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-[#222325] tracking-wide font-mono">
                        {order.id}
                      </span>
                      <button
                        onClick={(e) => handleCopyOrderId(order.id, e)}
                        className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md hover:bg-neutral-200/50 transition-colors cursor-pointer"
                        title="Sao chép mã đơn hàng"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {copiedId === order.id && (
                        <span className="text-[10px] text-emerald-600 font-semibold animate-in fade-in">
                          Đã chép!
                        </span>
                      )}
                      <span className="text-neutral-300">|</span>
                      <span className="text-neutral-500">Khởi tạo: {order.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <h3 className="text-base sm:text-lg font-extrabold text-[#222325] leading-snug hover:text-emerald-600 transition-colors cursor-pointer"
                          onClick={() => onOpenOrderWorkspace(order)}
                        >
                          {order.taskTitle}
                        </h3>

                        {/* Counterparties row */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600">
                          {/* Requester info */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-neutral-400 font-medium">Bên thuê:</span>
                            <div className="flex items-center gap-1 font-bold text-[#222325]">
                              <div
                                className={`w-5 h-5 rounded-full ${order.requester.avatarBg} text-white text-[10px] flex items-center justify-center font-bold`}
                              >
                                {order.requester.displayName.charAt(0)}
                              </div>
                              <span>{order.requester.displayName}</span>
                              {order.requester.isVerifiedStudent && (
                                <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                              )}
                            </div>
                            <span className="text-neutral-400">({order.requester.university})</span>
                          </div>

                          <span className="text-neutral-300">→</span>

                          {/* Tasker info */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-neutral-400 font-medium">Sinh viên làm:</span>
                            <div className="flex items-center gap-1 font-bold text-[#222325]">
                              <div
                                className={`w-5 h-5 rounded-full ${order.tasker.avatarBg} text-white text-[10px] flex items-center justify-center font-bold`}
                              >
                                {order.tasker.displayName.charAt(0)}
                              </div>
                              <span>{order.tasker.displayName}</span>
                              {order.tasker.isVerifiedStudent && (
                                <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                              )}
                            </div>
                            <span className="text-neutral-400">({order.tasker.university})</span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Deadline Column */}
                      <div className="flex lg:flex-col items-center lg:items-end justify-between gap-1 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                        <div className="text-right">
                          <span className="text-[11px] text-neutral-400 block font-medium">
                            Thù lao thỏa thuận
                          </span>
                          <span className="text-lg font-black text-emerald-600">
                            {order.agreedPrice.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            <span>Hạn: <strong className="text-neutral-700">{order.deadline}</strong></span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Latest Delivery Preview (if any) */}
                    {latestDelivery && (
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between text-xs gap-3">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-[#222325] mr-2">
                              Bản giao v{latestDelivery.version}:
                            </span>
                            <span className="font-medium text-neutral-600">{latestDelivery.fileName}</span>
                            <span className="text-neutral-400 ml-1.5">({latestDelivery.fileSize})</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-700 shrink-0 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                          {latestDelivery.status === 'ACCEPTED' ? 'Đã duyệt' : 'Đang chờ xem'}
                        </span>
                      </div>
                    )}

                    {/* Bottom Actions Bar */}
                    <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Bảo chứng Escrow 100% · 0% Phí sàn
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleOpenVoucher(order, e)}
                          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Phiếu Hợp đồng</span>
                        </button>

                        {order.status !== 'COMPLETED' && order.status !== 'DISPUTED' && (
                          <button
                            onClick={() => onOpenDispute(order)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                            <span>Khiếu nại</span>
                          </button>
                        )}

                        <button
                          onClick={() => onOpenOrderWorkspace(order)}
                          className="px-4 py-1.5 bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Mở Phòng làm việc &amp; Chat</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/90 max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#222325]">
                Không tìm thấy đơn hàng nào
              </h3>
              <p className="text-xs text-[#62646a] mt-1">
                Không có hợp đồng nào phù hợp với bộ lọc hiện tại của bạn.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveTab('ALL');
                  setRoleFilter('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
              <button
                onClick={onExploreTasks}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl cursor-pointer"
              >
                Khám phá Sàn Task
              </button>
            </div>
          </div>
        )}

        {/* Contract Voucher / Receipt Modal */}
        {selectedVoucher && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedVoucher(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6 animate-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">
                      CHỨNG THỰC HỢP ĐỒNG ĐIỆN TỬ VIETVI
                    </span>
                    <h2 className="text-lg font-black text-[#222325]">
                      Biên nhận Ký quỹ &amp; Giao kết Sinh viên
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVoucher(null)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Certificate Canvas Box */}
              <div className="p-5 bg-neutral-50 rounded-2xl border-2 border-dashed border-emerald-500/40 space-y-4">
                
                {/* Header of Voucher */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-neutral-200">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">MÃ GIAO DỊCH (ORDER ID)</span>
                    <strong className="font-mono text-[#222325] text-sm">{selectedVoucher.orderId}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-400 block text-[10px]">MÃ THAM CHIẾU KÝ QUỸ</span>
                    <strong className="font-mono text-emerald-700">{selectedVoucher.escrowRef}</strong>
                  </div>
                </div>

                {/* Task Title */}
                <div>
                  <span className="text-neutral-400 text-[10px] block font-semibold">NỘI DUNG NHIỆM VỤ / TASK</span>
                  <p className="text-sm font-bold text-[#222325] mt-0.5">{selectedVoucher.taskTitle}</p>
                </div>

                {/* Two Parties Breakdown */}
                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-3 bg-white rounded-xl border border-neutral-200">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                      BÊN GIAO VIỆC (BÊN A)
                    </span>
                    <div className="font-extrabold text-[#222325] mt-1">{selectedVoucher.requesterName}</div>
                    <div className="text-neutral-500 text-[11px]">{selectedVoucher.requesterUni}</div>
                    <div className="text-neutral-400 text-[10px] mt-1 font-mono">MSSV: {selectedVoucher.requesterStudentId}</div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-neutral-200">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                      BÊN NHẬN VIỆC (BÊN B)
                    </span>
                    <div className="font-extrabold text-[#222325] mt-1">{selectedVoucher.taskerName}</div>
                    <div className="text-neutral-500 text-[11px]">{selectedVoucher.taskerUni}</div>
                    <div className="text-neutral-400 text-[10px] mt-1 font-mono">MSSV: {selectedVoucher.taskerStudentId}</div>
                  </div>
                </div>

                {/* Financial Terms */}
                <div className="p-3.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-emerald-800 font-semibold block text-[11px]">Thù lao bảo chứng Escrow:</span>
                    <span className="text-lg font-black text-emerald-700">
                      {selectedVoucher.agreedPrice.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-emerald-800">
                    <div>Phí dịch vụ sinh viên: <strong>0 đ (0%)</strong></div>
                    <div>Thanh toán giải ngân khi: <strong>Nghiệm thu đạt yêu cầu</strong></div>
                  </div>
                </div>

                {/* Blockchain / Escrow Hash & Terms */}
                <div className="space-y-1.5 text-[10px] text-neutral-500 pt-2 border-t border-neutral-200">
                  <div className="flex items-center gap-1.5 text-neutral-600 font-mono">
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Chữ ký số Escrow: {selectedVoucher.escrowPledgeHash}</span>
                  </div>
                  <p>
                    Biên bản này được lập và lưu vết tự động trên hệ thống VIETVI. Cả hai bên cam kết tuân thủ
                    Tiêu chuẩn Liêm chính Học thuật (không vi phạm quy chế thi cử, không đạo văn) và quy chế trọng tài sàn.
                  </p>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    setReceiptToast(true);
                    setTimeout(() => setReceiptToast(false), 3000);
                  }}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Biên lai PDF</span>
                </button>

                {receiptToast && (
                  <span className="text-xs font-bold text-emerald-600 animate-in fade-in">
                    ✓ Đã tạo và xuất file PDF hợp đồng!
                  </span>
                )}

                <button
                  onClick={() => setSelectedVoucher(null)}
                  className="px-5 py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
