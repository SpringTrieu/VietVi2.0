import React, { useState } from 'react';
import { UserProfile, University } from '../../types';
import { UNIVERSITIES } from '../../data/mockData';
import {
  ShieldCheck,
  CheckCircle2,
  Mail,
  GraduationCap,
  Upload,
  AlertCircle,
  Clock,
  ArrowRight,
  FileCheck,
  Check,
  Sparkles,
} from 'lucide-react';

interface VerificationCenterScreenProps {
  currentUser: UserProfile;
  onVerificationSubmitted: (uni: string, studentId: string, email: string) => void;
  onExploreTasks: () => void;
}

export const VerificationCenterScreen: React.FC<VerificationCenterScreenProps> = ({
  currentUser,
  onVerificationSubmitted,
  onExploreTasks,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(currentUser.isVerifiedStudent ? 3 : 1);
  const [selectedUni, setSelectedUni] = useState<string>(currentUser.university || 'hust');
  const [studentId, setStudentId] = useState<string>(currentUser.studentId || '20225678');
  const [studentEmail, setStudentEmail] = useState<string>(
    currentUser.email || 'minhanh.nguyen@sis.hust.edu.vn'
  );
  const [otpCode, setOtpCode] = useState<string>('889922');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [cardFileName, setCardFileName] = useState<string>('the_sinh_vien_hust_mat_truoc.jpg');
  const [cardBackFileName, setCardBackFileName] = useState<string>('the_sinh_vien_hust_mat_sau.jpg');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const perks = [
    {
      title: 'Huy hiệu Tick Xanh Sinh Viên Uy Tín',
      desc: 'Xuất hiện nổi bật bên cạnh tên của bạn trên mọi Task Card, Offer và không gian trao đổi.',
    },
    {
      title: 'Tăng 300% tỷ lệ được Người yêu cầu chọn',
      desc: 'Người đăng task luôn ưu tiên trao cơ hội cho sinh viên có thẻ trường rõ ràng.',
    },
    {
      title: 'Bảo chứng an toàn khi rút thù lao về tài khoản ngân hàng',
      desc: 'Tự động kích hoạt hạn mức giải ngân nhanh trong vòng 15 phút sau khi nghiệm thu.',
    },
    {
      title: 'Quyền đăng bài không giới hạn trong Campus Hub',
      desc: 'Tham gia chia sẻ kiến thức, nhận xét đồ án và kết nối mạng lưới cựu sinh viên.',
    },
  ];

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length >= 4) {
      setOtpVerified(true);
      setCurrentStep(2);
    }
  };

  const handleSubmitDocuments = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onVerificationSubmitted(selectedUni, studentId, studentEmail);
      setCurrentStep(3);
    }, 800);
  };

  return (
    <div className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tiêu chuẩn VERIFY-01 &amp; AUTH-04</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325]">
            Trung tâm Định danh &amp; Xác minh Thẻ Sinh viên
          </h1>
          <p className="text-xs sm:text-sm text-[#62646a] mt-1">
            Xác thực danh tính học thuật để bảo vệ sự minh bạch, ngăn chặn lừa đảo và trao trọn quyền lợi cho sinh viên.
          </p>
        </div>

        {currentUser.isVerifiedStudent && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Tài khoản của bạn đã được xác minh</span>
          </div>
        )}
      </div>

      {/* Progress Steps Bar */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs font-bold">
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            currentStep >= 1
              ? 'bg-blue-50/80 border-blue-300 text-blue-900 shadow-xs'
              : 'bg-neutral-50 border-neutral-200 text-neutral-400'
          }`}
        >
          <span className="block text-[10px] text-blue-700 uppercase tracking-wider">Bước 1</span>
          <span className="text-xs sm:text-sm">Email trường (.edu.vn)</span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            currentStep >= 2
              ? 'bg-blue-50/80 border-blue-300 text-blue-900 shadow-xs'
              : 'bg-neutral-50 border-neutral-200 text-neutral-400'
          }`}
        >
          <span className="block text-[10px] text-blue-700 uppercase tracking-wider">Bước 2</span>
          <span className="text-xs sm:text-sm">Ảnh Thẻ SV 2 mặt</span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            currentStep >= 3
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 shadow-xs'
              : 'bg-neutral-50 border-neutral-200 text-neutral-400'
          }`}
        >
          <span className="block text-[10px] text-emerald-700 uppercase tracking-wider">Bước 3</span>
          <span className="text-xs sm:text-sm">Phê duyệt &amp; Tick xanh</span>
        </div>
      </div>

      {/* STEP 1: EMAIL & OTP */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs space-y-6">
          <div className="max-w-xl">
            <h3 className="text-lg font-extrabold text-[#222325] flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <span>Xác thực Email trường đại học chính thức</span>
            </h3>
            <p className="text-xs text-[#62646a] mt-1">
              Nhập email do trường bạn cấp (ví dụ: @sis.hust.edu.vn, @ftu.edu.vn, @neu.edu.vn, v.v.). Hệ thống sẽ gửi mã OTP xác nhận ngay lập tức.
            </p>
          </div>

          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-bold text-[#404145] mb-1.5">Trường đại học</label>
              <select
                value={selectedUni}
                onChange={(e) => setSelectedUni(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 font-semibold"
              >
                {UNIVERSITIES.filter((u) => u.id !== 'all').map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#404145] mb-1.5">
                Địa chỉ Email sinh viên
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="hoten.mssv@sis.hust.edu.vn"
                  className="flex-1 px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 font-medium"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  {otpSent ? 'Gửi lại mã' : 'Nhận mã OTP'}
                </button>
              </div>
            </div>

            {otpSent && (
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-3 animate-in fade-in">
                <span className="text-xs font-bold text-blue-900 block">
                  Đã gửi mã xác nhận 6 số đến email {studentEmail}
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Nhập 6 số OTP (Demo: 889922)"
                    className="flex-1 px-3.5 py-2 bg-white rounded-xl border border-blue-300 font-mono text-center tracking-widest font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Xác nhận OTP
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: STUDENT ID PHOTO */}
      {currentStep === 2 && (
        <form
          onSubmit={handleSubmitDocuments}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs space-y-6"
        >
          <div className="max-w-xl">
            <h3 className="text-lg font-extrabold text-[#222325] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <span>Tải ảnh Thẻ sinh viên để Admin đối chiếu</span>
            </h3>
            <p className="text-xs text-[#62646a] mt-1">
              Thông tin trên thẻ phải trùng khớp với Họ tên và Mã sinh viên đăng ký. Dữ liệu được mã hóa bảo mật theo luật An toàn thông tin mạng.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-[#404145] mb-1.5">Mã số sinh viên (MSSV)</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#404145] mb-1.5">Trường xác nhận</label>
              <input
                type="text"
                disabled
                value={selectedUni}
                className="w-full px-3.5 py-2.5 text-xs bg-neutral-100 rounded-xl border border-neutral-200 text-neutral-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div className="p-4 border-2 border-dashed border-neutral-200 rounded-2xl text-center space-y-2 bg-neutral-50/50">
              <Upload className="w-6 h-6 text-neutral-400 mx-auto" />
              <div className="text-xs font-bold text-[#222325]">Ảnh mặt trước thẻ SV</div>
              <p className="text-[11px] text-[#62646a]">Thấy rõ ảnh chân dung và Mã sinh viên</p>
              <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                ✓ {cardFileName}
              </span>
            </div>

            <div className="p-4 border-2 border-dashed border-neutral-200 rounded-2xl text-center space-y-2 bg-neutral-50/50">
              <Upload className="w-6 h-6 text-neutral-400 mx-auto" />
              <div className="text-xs font-bold text-[#222325]">Ảnh mặt sau thẻ SV</div>
              <p className="text-[11px] text-[#62646a]">Thấy rõ dấu mộc trường hoặc mã vạch</p>
              <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                ✓ {cardBackFileName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600"
            >
              Quay lại Bước 1
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Đang gửi hồ sơ...' : 'Gửi thẩm định ngay'}
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: APPROVED STATUS */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Xác thực thành công
              </span>
              <h3 className="text-xl font-extrabold text-[#222325]">
                Hồ sơ Sinh viên đã được phê duyệt chính thức
              </h3>
              <p className="text-xs text-[#62646a] leading-relaxed">
                Xin chúc mừng {currentUser.displayName}! Bạn đã có tick xanh uy tín sinh viên của trường{' '}
                <strong>{currentUser.university}</strong>. Toàn bộ hồ sơ của bạn đã sẵn sàng nhận task thù lao cao.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {perks.map((perk, i) => (
              <div key={i} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-1">
                <h4 className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{perk.title}</span>
                </h4>
                <p className="text-[11px] text-emerald-800 leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
            <button
              onClick={onExploreTasks}
              className="px-5 py-2.5 bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Xem các Task đang mở để gửi báo giá</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
