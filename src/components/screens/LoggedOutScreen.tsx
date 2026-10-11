import React from 'react';
import { LogOut, ShieldCheck, ArrowRight, Home, CheckCircle2, Lock } from 'lucide-react';

interface LoggedOutScreenProps {
  lastUserEmail?: string;
  onLoginAgain: () => void;
  onExploreAsGuest: () => void;
}

export const LoggedOutScreen: React.FC<LoggedOutScreenProps> = ({
  lastUserEmail = 'minhanh.nguyen@sis.hust.edu.vn',
  onLoginAgain,
  onExploreAsGuest,
}) => {
  const logoutTime = new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="py-16 sm:py-24 max-w-2xl mx-auto px-4 sm:px-6 text-center animate-in fade-in">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/90 shadow-sm space-y-6">
        {/* Logout Icon badge */}
        <div className="w-16 h-16 rounded-3xl bg-neutral-100 text-[#222325] mx-auto flex items-center justify-center shadow-xs">
          <LogOut className="w-8 h-8 text-neutral-700" />
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Phiên làm việc đã kết thúc an toàn</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
            Bạn đã đăng xuất thành công
          </h1>

          <p className="text-xs sm:text-sm text-[#62646a] max-w-md mx-auto leading-relaxed">
            Tài khoản <strong className="text-[#222325]">{lastUserEmail}</strong> đã được đăng xuất an toàn vào lúc <strong>{logoutTime}</strong>. Mọi dữ liệu giao dịch, số dư bảo chứng Escrow và lịch sử trao đổi của bạn đều được lưu trữ bảo mật.
          </p>
        </div>

        {/* Security assurance card */}
        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-left text-xs space-y-2 text-[#404145]">
          <div className="flex items-center gap-2 font-bold text-[#222325]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Xác nhận bảo mật theo Mục 4.1:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-[#62646a] pl-1">
            <li>Session Token đã được vô hiệu hóa trên trình duyệt này.</li>
            <li>Các đơn hàng đang thực hiện vẫn được bảo chứng 100% trong không gian Order.</li>
            <li>Bạn có thể đăng nhập lại bất kỳ lúc nào bằng mã OTP email trường.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onLoginAgain}
            className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Đăng nhập lại bằng Email OTP</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreAsGuest}
            className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-semibold text-[#404145] bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Tiếp tục khám phá với tư cách Khách</span>
          </button>
        </div>
      </div>
    </div>
  );
};
