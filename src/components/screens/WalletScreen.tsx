import React, { useState } from 'react';
import { WalletTransaction, UserMode } from '../../types';
import {
  Wallet,
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  ShieldCheck,
  Building,
  CheckCircle,
  AlertCircle,
  X,
  CreditCard,
  DollarSign,
  PlusCircle,
  QrCode,
  ArrowRightLeft,
  User,
  Briefcase,
  TrendingUp,
} from 'lucide-react';

interface WalletScreenProps {
  transactions: WalletTransaction[];
  availableBalance: number;
  escrowLockedAmount: number;
  userMode?: UserMode;
  onRequestPayout: (amount: number, bankName: string, accountNumber: string) => void;
  onDepositFunds?: (amount: number, method: string) => void;
  onExploreTasks: () => void;
  onNavigateToAnalytics?: () => void;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({
  transactions,
  availableBalance,
  escrowLockedAmount,
  userMode = 'REQUESTER',
  onRequestPayout,
  onDepositFunds,
  onExploreTasks,
  onNavigateToAnalytics,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showPayoutModal, setShowPayoutModal] = useState<boolean>(false);
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  
  // Payout form
  const [payoutAmount, setPayoutAmount] = useState<number>(availableBalance > 0 ? availableBalance : 200000);
  const [bankName, setBankName] = useState<string>('MB Bank (Quân Đội)');
  const [accountNumber, setAccountNumber] = useState<string>('0988776655');
  const [accountHolder, setAccountHolder] = useState<string>('NGUYEN MINH ANH');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Deposit form
  const [depositAmount, setDepositAmount] = useState<number>(500000);
  const [depositMethod, setDepositMethod] = useState<string>('VietQR 24/7');
  const [isDepositing, setIsDepositing] = useState<boolean>(false);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const filteredTxns = transactions.filter((t) => {
    if (filterType === 'ALL') return true;
    return t.type === filterType;
  });

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount <= 0 || payoutAmount > availableBalance) return;

    setIsProcessing(true);
    setTimeout(() => {
      onRequestPayout(payoutAmount, bankName, accountNumber);
      setIsProcessing(false);
      setShowPayoutModal(false);
    }, 600);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;

    setIsDepositing(true);
    setTimeout(() => {
      if (onDepositFunds) {
        onDepositFunds(depositAmount, depositMethod);
      }
      setIsDepositing(false);
      setShowDepositModal(false);
    }, 600);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* Role Context Notification Bar */}
      <div
        className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          userMode === 'REQUESTER'
            ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
              userMode === 'REQUESTER' ? 'bg-indigo-600' : 'bg-emerald-600'
            }`}
          >
            {userMode === 'REQUESTER' ? (
              <User className="w-4 h-4" />
            ) : (
              <Briefcase className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="font-bold flex items-center gap-2">
              <span>
                {userMode === 'REQUESTER'
                  ? 'Góc nhìn Tài chính: NGƯỜI YÊU CẦU (Bên thuê)'
                  : 'Góc nhìn Tài chính: NGƯỜI THỰC HIỆN (Bên nhận việc)'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white font-semibold border border-current">
                {userMode === 'REQUESTER' ? 'Ví Ký quỹ Escrow' : 'Ví Thu nhập Freelance'}
              </span>
            </div>
            <p className="text-[11px] opacity-90 mt-0.5">
              {userMode === 'REQUESTER'
                ? 'Nạp tiền vào ví để sẵn sàng ký quỹ các Task mới và thanh toán cho sinh viên xuất sắc.'
                : 'Theo dõi thù lao hoàn tất từ các dự án và rút tiền về tài khoản ngân hàng bất kỳ lúc nào.'}
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <span>
              {userMode === 'REQUESTER'
                ? 'Quản lý Ngân sách Ký quỹ & Thuê sinh viên'
                : 'Quản lý Thu nhập & Rút tiền Thù lao'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-[#62646a]">Bảo chứng số nguyên VND</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
            {userMode === 'REQUESTER'
              ? 'Ví ký quỹ & Chi phí thuê của bạn'
              : 'Ví thu nhập & Thù lao sinh viên'}
          </h1>
          <p className="text-xs sm:text-sm text-[#62646a] mt-1">
            {userMode === 'REQUESTER'
              ? 'Theo dõi dòng tiền ký quỹ tạm giữ an toàn cho các Tasker và số dư ví sẵn sàng tuyển ứng viên.'
              : 'Theo dõi dòng tiền được giải ngân từ các Order hoàn tất và rút tiền về ngân hàng an toàn.'}
          </p>
        </div>

        {/* Action Buttons based on Mode */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onNavigateToAnalytics && (
            <button
              onClick={onNavigateToAnalytics}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-violet-600" />
              <span>Phân tích Thu nhập (ANALYTICS-01)</span>
            </button>
          )}

          {userMode === 'REQUESTER' ? (
            <>
              <button
                onClick={() => setShowDepositModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nạp tiền vào ví ký quỹ</span>
              </button>

              <button
                onClick={() => setShowPayoutModal(true)}
                disabled={availableBalance <= 0}
                className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all whitespace-nowrap cursor-pointer disabled:opacity-40"
              >
                <span>Rút số dư thừa</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowPayoutModal(true)}
              disabled={availableBalance <= 0}
              className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-xs transition-all whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Building className="w-4 h-4" />
              <span>Rút tiền về tài khoản ngân hàng</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* KPI 1 */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#62646a]">
            <span>
              {userMode === 'REQUESTER'
                ? 'Số dư ví khả dụng (Sẵn sàng ký quỹ Task)'
                : 'Số dư khả dụng (Có thể rút ngay về thẻ)'}
            </span>
            <Wallet className={`w-4 h-4 ${userMode === 'REQUESTER' ? 'text-indigo-600' : 'text-emerald-600'}`} />
          </div>
          <div className="text-3xl font-extrabold text-[#222325] font-mono tabular-nums">
            {formatVND(availableBalance)}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>
              {userMode === 'REQUESTER'
                ? 'Sẵn sàng dùng để đặt cọc cho ứng viên'
                : 'Đã nghiệm thu và sẵn sàng chuyển về STK'}
            </span>
          </div>
        </div>

        {/* KPI 2: Escrow Locked */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#62646a]">
            <span>
              {userMode === 'REQUESTER'
                ? 'Tiền đang ký quỹ cho các Tasker'
                : 'Thù lao đang chờ Bên thuê duyệt nghiệm thu'}
            </span>
            <Lock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-mono tabular-nums">
            {formatVND(escrowLockedAmount)}
          </div>
          <div className="text-[11px] text-[#62646a] flex items-center gap-1 pt-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {userMode === 'REQUESTER'
                ? 'Khóa bảo đảm trong các Order đang làm việc'
                : 'Tự động giải ngân khi nghiệm thu Order'}
            </span>
          </div>
        </div>

        {/* Platform Fee & Security */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#62646a]">
            <span>Chính sách phí nền tảng MVP</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-600 font-mono tabular-nums">
            0% Phí ẩn
          </div>
          <div className="text-[11px] text-blue-800 font-semibold pt-1">
            <span>Bảo vệ quyền lợi đôi bên 100% qua Escrow</span>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <h3 className="text-base font-bold text-[#222325]">
              Sổ giao dịch bất biến (Audit Ledger)
            </h3>
            <p className="text-xs text-[#62646a]">
              Mọi thay đổi số dư đều được cấp mã TXN duy nhất và không thể thay đổi
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-[#222325] text-white font-bold'
                  : 'text-[#62646a] hover:bg-neutral-100'
              }`}
            >
              Tất cả ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('ESCROW_RELEASE')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
                filterType === 'ESCROW_RELEASE'
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'text-[#62646a] hover:bg-neutral-100'
              }`}
            >
              Giải ngân nhận tiền
            </button>
            <button
              onClick={() => setFilterType('ESCROW_HOLD')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
                filterType === 'ESCROW_HOLD'
                  ? 'bg-amber-700 text-white font-bold'
                  : 'text-[#62646a] hover:bg-neutral-100'
              }`}
            >
              Tạm giữ Escrow
            </button>
            <button
              onClick={() => setFilterType('PAYOUT_WITHDRAWAL')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
                filterType === 'PAYOUT_WITHDRAWAL'
                  ? 'bg-blue-700 text-white font-bold'
                  : 'text-[#62646a] hover:bg-neutral-100'
              }`}
            >
              Rút về ngân hàng
            </button>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-[#404145] font-bold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Mã TXN</th>
                <th className="py-3 px-4">Mô tả giao dịch</th>
                <th className="py-3 px-4">Đối tác / Ngân hàng</th>
                <th className="py-3 px-4">Thời điểm</th>
                <th className="py-3 px-4 text-right">Biến động (VND)</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredTxns.map((txn) => {
                const isPositive = txn.type === 'ESCROW_RELEASE';
                return (
                  <tr key={txn.id} className="hover:bg-neutral-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-400">
                      #{txn.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#222325]">{txn.title}</div>
                      {txn.orderId && (
                        <span className="text-[11px] text-[#62646a]">Đơn hàng: {txn.orderId}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#404145]">
                      {txn.counterparty || 'Hệ thống Escrow VIETVI'}
                    </td>
                    <td className="py-3.5 px-4 text-[#62646a] font-mono">
                      {txn.createdAt}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-sm">
                      <span className={isPositive ? 'text-emerald-600' : 'text-[#222325]'}>
                        {isPositive ? `+${formatVND(txn.amount)}` : `-${formatVND(txn.amount)}`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          txn.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {txn.status === 'COMPLETED' ? 'Thành công' : 'Đang tạm giữ'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div
            className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-[#222325]">
                  Rút thù lao về tài khoản ngân hàng
                </h3>
              </div>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePayoutSubmit} className="space-y-4 pt-4 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-[11px] text-[#62646a] block">Số dư có thể rút hiện tại:</span>
                <span className="text-xl font-mono font-bold text-emerald-600">
                  {formatVND(availableBalance)}
                </span>
              </div>

              <div>
                <label className="block font-bold text-[#404145] mb-1">
                  Số tiền muốn rút (VND) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  step={50000}
                  min={50000}
                  max={availableBalance}
                  required
                  className="w-full px-3.5 py-2.5 text-sm font-mono font-bold bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#404145] mb-1">
                  Chọn Ngân hàng nhận tiền <span className="text-rose-500">*</span>
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                >
                  <option value="MB Bank (Quân Đội)">MB Bank (Quân Đội)</option>
                  <option value="Vietcombank">Vietcombank</option>
                  <option value="Techcombank">Techcombank</option>
                  <option value="TPBank (Tiên Phong)">TPBank (Tiên Phong)</option>
                  <option value="BIDV">BIDV</option>
                  <option value="Ví MoMo Sinh Viên">Ví MoMo Sinh Viên</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#404145] mb-1">
                  Số tài khoản ngân hàng (STK) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#404145] mb-1">
                  Tên chủ tài khoản (In hoa không dấu)
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2 font-semibold text-[#62646a] hover:bg-neutral-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || payoutAmount <= 0 || payoutAmount > availableBalance}
                  className="px-5 py-2.5 font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? 'Đang chuyển khoản...' : 'Xác nhận rút tiền'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL 2: Nạp tiền ví ký quỹ (Dành cho Người yêu cầu) */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-[#222325]">
                  Nạp tiền vào ví ký quỹ Escrow
                </h3>
              </div>
              <button
                onClick={() => setShowDepositModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4 pt-4 text-xs">
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200">
                <span className="text-[11px] text-indigo-900 block font-semibold">Mục đích nạp quỹ:</span>
                <p className="text-[11px] text-indigo-800 mt-0.5">
                  Số dư ví nạp vào sẽ được dùng để ký quỹ bảo chứng trực tiếp cho các Tasker khi bạn giao việc.
                </p>
              </div>

              <div>
                <label className="block font-bold text-[#404145] mb-1">
                  Chọn mức nạp nhanh
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[200000, 500000, 1000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`py-2 px-2 rounded-xl font-bold font-mono text-center border transition-all cursor-pointer ${
                        depositAmount === amt
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {formatVND(amt)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#404145] mb-1">
                  Số tiền nạp tùy chỉnh (VND) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  step={50000}
                  min={50000}
                  required
                  className="w-full px-3.5 py-2.5 text-sm font-mono font-bold bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-[#404145] mb-1">
                  Phương thức thanh toán <span className="text-rose-500">*</span>
                </label>
                <select
                  value={depositMethod}
                  onChange={(e) => setDepositMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="VietQR 24/7 (Quét mã chuyển khoản tức thì)">VietQR 24/7 (Quét mã tức thì)</option>
                  <option value="Ví MoMo Sinh Viên">Ví MoMo Sinh Viên</option>
                  <option value="Thẻ ATM Napas Nội Địa">Thẻ ATM Napas Nội Địa</option>
                  <option value="Chuyển khoản trực tiếp MB Bank">Chuyển khoản trực tiếp MB Bank</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-4 py-2 font-semibold text-[#62646a] hover:bg-neutral-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isDepositing || depositAmount <= 0}
                  className="px-5 py-2.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isDepositing ? 'Đang xác nhận nạp...' : 'Xác nhận nạp tiền'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
