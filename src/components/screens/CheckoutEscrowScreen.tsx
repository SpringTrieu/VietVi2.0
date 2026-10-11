import React, { useState } from 'react';
import { EscrowCheckoutDraft, UserProfile } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  QrCode,
  Wallet,
  CreditCard,
  Building,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CheckoutEscrowScreenProps {
  draft: EscrowCheckoutDraft;
  availableBalance: number;
  currentUser: UserProfile;
  onConfirmPayment: (method: 'WALLET' | 'VIETQR' | 'MOMO') => void;
  onCancel: () => void;
}

export const CheckoutEscrowScreen: React.FC<CheckoutEscrowScreenProps> = ({
  draft,
  availableBalance,
  currentUser,
  onConfirmPayment,
  onCancel,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'WALLET' | 'VIETQR' | 'MOMO'>(
    availableBalance >= draft.amount ? 'WALLET' : 'VIETQR'
  );
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasConfirmedTransfer, setHasConfirmedTransfer] = useState(false);

  const transferMemo = `VIETVI ESCROW ${draft.offerId.toUpperCase()}`;
  const bankAccount = '9876543210';
  const bankName = 'MBBank - Ngân Hàng Quân Đội';
  const accountHolder = 'CONG TY VIETVI - TAI KHOAN ESCROW TIN THAC';

  const handleCopy = (text: string, type: 'acc' | 'memo') => {
    navigator.clipboard?.writeText(text);
    if (type === 'acc') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedMemo(true);
      setTimeout(() => setCopiedMemo(false), 2000);
    }
  };

  const handleExecutePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirmPayment(selectedMethod);
      setIsProcessing(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Quản lý Task</span>
          </button>
          
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold">Thanh toán Ký quỹ An toàn (256-bit SSL)</span>
          </div>
        </div>

        {/* Page Heading */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Khóa quỹ bảo chứng · Escrow Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight mt-1">
            Xác nhận ký quỹ &amp; Khởi động đơn hàng
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Số tiền thù lao sẽ được hệ thống VIETVI tạm giữ an toàn. Tiền chỉ được chuyển cho bạn thực hiện khi bạn kiểm tra và bấm nghiệm thu đạt.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Order Summary & Selected Tasker (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Task & Candidate Card */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-sm font-bold text-[#222325]">
                  Thông tin đơn hàng &amp; Ứng viên được chọn
                </h2>
              </div>

              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Yêu cầu công việc
                </span>
                <h3 className="text-base font-extrabold text-[#222325] mt-0.5 leading-snug">
                  {draft.taskTitle}
                </h3>
              </div>

              {/* Tasker Info Box */}
              <div className="flex items-center gap-3.5 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                <div
                  className={`w-12 h-12 rounded-xl ${draft.tasker.avatarBg} text-white font-black flex items-center justify-center text-sm shrink-0`}
                >
                  {draft.tasker.displayName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#222325] truncate">
                      {draft.tasker.displayName}
                    </span>
                    {draft.tasker.isVerifiedStudent && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold">
                        Tick Xanh
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 truncate">
                    {draft.tasker.university} · {draft.tasker.major}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                    <span className="text-amber-600 font-bold">★ {draft.tasker.rating}</span>
                    <span>({draft.tasker.reviewCount} đánh giá)</span>
                    <span>·</span>
                    <span>{draft.tasker.tasksCompleted} việc hoàn thành</span>
                  </div>
                </div>
              </div>

              {/* Delivery Schedule */}
              <div className="flex items-center justify-between text-xs py-2 px-3 bg-neutral-50 rounded-xl text-neutral-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  Cam kết bàn giao:
                </span>
                <span className="font-bold text-[#222325]">{draft.deadline}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-[#222325]">
                Chọn phương thức thanh toán ký quỹ
              </h2>

              <div className="space-y-2.5">
                
                {/* Method 1: Student Wallet */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('WALLET')}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    selectedMethod === 'WALLET'
                      ? 'border-[#1dbf73] bg-emerald-50/50 shadow-xs ring-1 ring-[#1dbf73]'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#222325]">
                          Ví Sinh Viên VIETVI
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">
                          Khuyên dùng
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Số dư khả dụng hiện có: <strong>{availableBalance.toLocaleString('vi-VN')} đ</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {availableBalance >= draft.amount ? (
                      <span className="text-xs font-bold text-emerald-600">Khả dụng</span>
                    ) : (
                      <span className="text-xs font-semibold text-rose-500">Thiếu số dư</span>
                    )}
                  </div>
                </button>

                {/* Method 2: VietQR Automatic */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('VIETQR')}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    selectedMethod === 'VIETQR'
                      ? 'border-[#1dbf73] bg-emerald-50/50 shadow-xs ring-1 ring-[#1dbf73]'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#222325]">
                          Quét mã VietQR (Tất cả ngân hàng)
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-bold">
                          Chuyển 24/7
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Chuyển tiền tự động duyệt tức thì qua MB, VCB, Techcombank, VPBank...
                      </p>
                    </div>
                  </div>
                </button>

                {/* Method 3: MoMo */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('MOMO')}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    selectedMethod === 'MOMO'
                      ? 'border-[#1dbf73] bg-emerald-50/50 shadow-xs ring-1 ring-[#1dbf73]'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-black text-xs shrink-0">
                      MoMo
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#222325]">
                        Ví điện tử MoMo
                      </span>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Thanh toán liên kết ví MoMo hoặc quét mã QR MoMo
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* VietQR Instructions Box */}
              {selectedMethod === 'VIETQR' && (
                <div className="p-5 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900">
                      Thông tin chuyển khoản Tín thác Escrow:
                    </span>
                    <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-semibold">
                      Tự động khớp lệnh
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    {/* Simulated QR Code Canvas */}
                    <div className="bg-white p-4 rounded-xl border border-blue-200 text-center shadow-xs">
                      <div className="w-36 h-36 mx-auto bg-neutral-900 text-white flex flex-col items-center justify-center rounded-lg p-2 relative overflow-hidden">
                        <QrCode className="w-24 h-24 text-white opacity-90" />
                        <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-400 mt-1">
                          VIETQR · NAPAS
                        </span>
                      </div>
                      <span className="block text-[10px] text-neutral-500 mt-2 font-medium">
                        Quét bằng App Ngân hàng bất kỳ
                      </span>
                    </div>

                    {/* Bank Info Details */}
                    <div className="space-y-2.5 text-xs text-neutral-700">
                      <div>
                        <span className="text-[10px] text-neutral-500 block">Ngân hàng thụ hưởng:</span>
                        <strong className="text-blue-900">{bankName}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block">Số tài khoản:</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-mono text-[#222325]">{bankAccount}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(bankAccount, 'acc')}
                            className="p-1 hover:bg-neutral-200 rounded text-neutral-600 cursor-pointer"
                          >
                            {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block">Nội dung chuyển khoản (Bắt buộc):</span>
                        <div className="flex items-center gap-2">
                          <strong className="font-mono text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {transferMemo}
                          </strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(transferMemo, 'memo')}
                            className="p-1 hover:bg-neutral-200 rounded text-neutral-600 cursor-pointer"
                          >
                            {copiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block">Số tiền chính xác:</span>
                        <strong className="text-sm text-emerald-700">
                          {draft.amount.toLocaleString('vi-VN')} đ
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Financial Breakdown & Escrow Guarantee (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Price Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-5">
              <h2 className="text-sm font-bold text-[#222325] pb-3 border-b border-neutral-100">
                Chi tiết thanh toán ký quỹ
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Thù lao Task cam kết:</span>
                  <span className="font-semibold text-neutral-900">
                    {draft.amount.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span className="flex items-center gap-1">
                    <span>Phí dịch vụ sàn sinh viên:</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                      0%
                    </span>
                  </span>
                  <span className="font-semibold text-emerald-600">0 đ</span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>Phí bảo hiểm bảo vệ Escrow:</span>
                  <span className="font-semibold text-emerald-600">Miễn phí</span>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#222325]">
                    Tổng tiền cần khóa Escrow:
                  </span>
                  <span className="text-2xl font-black text-[#1dbf73]">
                    {draft.amount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              {/* Security Policy Pillars */}
              <div className="space-y-2.5 pt-3 border-t border-neutral-100 text-[11px] text-neutral-500">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Tiền chưa chuyển vào tay Tasker ngay. Chỉ giải ngân khi bạn đã xem và nghiệm thu sản phẩm.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Bao gồm tối thiểu 02 lần yêu cầu chỉnh sửa bài miễn phí trong Order Workspace.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Admin can thiệp hòa giải 24/7 và hoàn tiền nếu Tasker không thực hiện đúng thỏa thuận.</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={isProcessing || (selectedMethod === 'WALLET' && availableBalance < draft.amount)}
                className={`w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                  isProcessing || (selectedMethod === 'WALLET' && availableBalance < draft.amount)
                    ? 'bg-neutral-300 cursor-not-allowed shadow-none'
                    : 'bg-[#1dbf73] hover:bg-[#19a463] hover:shadow-lg active:scale-98'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isProcessing
                    ? 'Đang xác thực & Khóa quỹ Escrow...'
                    : selectedMethod === 'WALLET'
                    ? 'Trừ Ví & Mở Order Workspace'
                    : 'Tôi đã chuyển khoản · Khởi tạo Order'}
                </span>
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="w-full py-2.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors text-center cursor-pointer"
              >
                Hủy giao dịch &amp; Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
