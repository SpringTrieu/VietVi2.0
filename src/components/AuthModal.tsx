import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  User,
  GraduationCap,
  Sparkles,
  Lock,
  Upload,
  Clock,
  ArrowLeft,
  Check,
  Briefcase,
  Layers,
  FileCheck,
  Info,
} from 'lucide-react';
import { UNIVERSITIES } from '../data/mockData';
import { UserMode, UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (
    email: string,
    profileData?: Partial<UserProfile>,
    initialMode?: UserMode,
    verificationData?: { studentCardImage?: string; requestTickXanh?: boolean }
  ) => void;
  authIntent: string | null;
}

type AuthMode = 'LOGIN' | 'REGISTER';
type AuthStep = 'FORM' | 'OTP' | 'ONBOARDING' | 'SUCCESS';

const DEFAULT_SKILLS = [
  'Slide PowerPoint / Canva',
  'Lập trình Web & Python',
  'Gia sư Toán / Lý / Hóa',
  'Dịch thuật Anh - Việt',
  'Xử lý số liệu Excel / SPSS',
  'Viết tiểu luận & Content',
  'Thiết kế đồ họa Photoshop',
  'Nhập liệu & Word',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  authIntent,
}) => {
  if (!isOpen) return null;

  // Flow State
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [step, setStep] = useState<AuthStep>('FORM');

  // Login Form
  const [email, setEmail] = useState('minhanh.nguyen@sis.hust.edu.vn');
  
  // Registration Form
  const [fullName, setFullName] = useState('Trần Mai Phương');
  const [regEmail, setRegEmail] = useState('maiphuong.tran@sis.hust.edu.vn');
  const [selectedUniversity, setSelectedUniversity] = useState('Đại học Bách Khoa Hà Nội');
  const [studentId, setStudentId] = useState('20235678');
  const [major, setMajor] = useState('Công nghệ Thông tin - K68');

  // OTP Verification
  const [otp, setOtp] = useState('686868');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Onboarding Profile Setup (Step 3)
  const [onboardDisplayName, setOnboardDisplayName] = useState('');
  const [onboardUniversity, setOnboardUniversity] = useState('');
  const [onboardStudentId, setOnboardStudentId] = useState('');
  const [onboardMajor, setOnboardMajor] = useState('');
  const [onboardRolePreference, setOnboardRolePreference] = useState<UserMode>('TASKER');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Slide PowerPoint / Canva',
    'Lập trình Web & Python',
  ]);
  const [bio, setBio] = useState(
    'Sinh viên năng động, có kinh nghiệm hoàn thành đồ án và thiết kế slide thuyết trình chuẩn format.'
  );
  const [requestTickXanh, setRequestTickXanh] = useState(true);
  const [uploadedCardImage, setUploadedCardImage] = useState<string>(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
  );

  // Countdown timer effect
  useEffect(() => {
    let timer: any;
    if (step === 'OTP' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const getIntentMessage = () => {
    switch (authIntent) {
      case 'POST_TASK':
        return 'Vui lòng đăng nhập hoặc tạo tài khoản sinh viên để đăng Task mới.';
      case 'SUBMIT_OFFER':
        return 'Vui lòng đăng nhập để gửi đề xuất báo giá cho Task này.';
      case 'ACCEPT_OFFER':
        return 'Vui lòng đăng nhập để chấp nhận đề xuất và tạo Order bảo chứng.';
      case 'VERIFY_STUDENT':
        return 'Đăng nhập tài khoản sinh viên để nộp hồ sơ nhận Tick xanh uy tín.';
      default:
        return mode === 'LOGIN'
          ? 'Đăng nhập nhanh không cần mật khẩu với mã OTP gửi qua Email sinh viên.'
          : 'Tạo tài khoản sinh viên VIETVI để kết nối Task hai chiều an toàn.';
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = mode === 'LOGIN' ? email : regEmail;
    if (!targetEmail) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
      setCountdown(60);
      setCanResend(false);

      // Pre-seed onboarding info if registering
      if (mode === 'REGISTER') {
        setOnboardDisplayName(fullName || 'Sinh viên VIETVI');
        setOnboardUniversity(selectedUniversity);
        setOnboardStudentId(studentId || '20235678');
        setOnboardMajor(major || 'Sinh viên');
      }
    }, 450);
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setCountdown(60);
    setCanResend(false);
    setOtp('686868');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'LOGIN') {
        // Direct success for existing user login
        const matchedUni = UNIVERSITIES.find((u) => u.id === 'hust');
        onSuccessLogin(email, {
          displayName: 'Nguyễn Minh Anh',
          university: matchedUni?.name || 'Đại học Bách Khoa Hà Nội',
          email: email,
        });
        onClose();
      } else {
        // New registration -> Go to Onboarding step 3
        setStep('ONBOARDING');
      }
    }, 550);
  };

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      if (selectedSkills.length < 5) {
        setSelectedSkills([...selectedSkills, skill]);
      }
    }
  };

  const handleFinishOnboarding = () => {
    setStep('SUCCESS');
  };

  const handleEnterApp = () => {
    const newProfile: Partial<UserProfile> = {
      displayName: onboardDisplayName.trim() || fullName || 'Sinh viên VIETVI',
      university: onboardUniversity || selectedUniversity,
      studentId: onboardStudentId.trim() || studentId,
      major: onboardMajor.trim() || major,
      bio: bio.trim(),
      skills: selectedSkills,
      avatarBg: 'bg-indigo-600',
      rating: 5.0,
      reviewCount: 0,
      tasksCompleted: 0,
      isVerifiedStudent: false, // will be verified by staff
    };

    onSuccessLogin(regEmail, newProfile, onboardRolePreference, {
      studentCardImage: uploadedCardImage,
      requestTickXanh: requestTickXanh,
    });
    onClose();
  };

  // Quick Account Select for testing
  const handleQuickSelectDemo = (demoType: 'HUST' | 'FTU' | 'NEU') => {
    if (demoType === 'HUST') {
      setEmail('minhanh.nguyen@sis.hust.edu.vn');
    } else if (demoType === 'FTU') {
      setEmail('hoanglong.ftu@ftu.edu.vn');
    } else {
      setEmail('duyanh.neu@neu.edu.vn');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-neutral-200 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-neutral-100 bg-neutral-50/70 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              VIETVI
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#222325]">
                {step === 'FORM' && (mode === 'LOGIN' ? 'Đăng nhập tài khoản' : 'Đăng ký tài khoản sinh viên')}
                {step === 'OTP' && 'Xác thực OTP bảo mật'}
                {step === 'ONBOARDING' && 'Thiết lập hồ sơ sinh viên mới'}
                {step === 'SUCCESS' && 'Chúc mừng! Hồ sơ hoàn tất'}
              </h2>
              <span className="text-[11px] text-neutral-400 font-medium">
                {step === 'FORM' && 'Bước 1 / 4: Thông tin tài khoản'}
                {step === 'OTP' && 'Bước 2 / 4: Mã xác nhận email'}
                {step === 'ONBOARDING' && 'Bước 3 / 4: Cập nhật thông tin & vai trò'}
                {step === 'SUCCESS' && 'Bước 4 / 4: Sẵn sàng hoạt động'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-neutral-100 h-1 shrink-0">
          <div
            className="bg-[#1dbf73] h-1 transition-all duration-300"
            style={{
              width:
                step === 'FORM' ? '25%' : step === 'OTP' ? '50%' : step === 'ONBOARDING' ? '75%' : '100%',
            }}
          />
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: FORM (LOGIN / REGISTER TABS) */}
          {step === 'FORM' && (
            <div className="space-y-5">
              {/* Intent notice */}
              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="leading-snug">{getIntentMessage()}</span>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-2xl text-xs font-bold text-neutral-600">
                <button
                  type="button"
                  onClick={() => setMode('LOGIN')}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    mode === 'LOGIN' ? 'bg-white text-neutral-900 shadow-xs' : 'hover:text-neutral-900'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => setMode('REGISTER')}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    mode === 'REGISTER' ? 'bg-white text-neutral-900 shadow-xs' : 'hover:text-neutral-900'
                  }`}
                >
                  Đăng ký tài khoản mới
                </button>
              </div>

              {/* MODE A: LOGIN */}
              {mode === 'LOGIN' && (
                <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#404145] mb-1.5">
                      Email sinh viên hoặc Email cá nhân <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="minhanh.nguyen@sis.hust.edu.vn"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                      />
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      Hệ thống sẽ gửi mã xác thực OTP 6 số qua email này.
                    </span>
                  </div>

                  {/* Demo Account Fast-Picks */}
                  <div className="pt-1">
                    <span className="text-[11px] font-semibold text-neutral-500 block mb-1.5">
                      Chọn nhanh tài khoản sinh viên mẫu:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickSelectDemo('HUST')}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-medium cursor-pointer"
                      >
                        Bách Khoa (HUST)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickSelectDemo('FTU')}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-medium cursor-pointer"
                      >
                        Ngoại Thương (FTU)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickSelectDemo('NEU')}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-medium cursor-pointer"
                      >
                        Kinh Tế Quốc Dân (NEU)
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full py-3 font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm mt-3"
                  >
                    {isLoading ? (
                      <span>Đang gửi mã...</span>
                    ) : (
                      <>
                        <span>Nhận mã OTP đăng nhập</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* MODE B: REGISTER */}
              {mode === 'REGISTER' && (
                <form onSubmit={handleSendOtp} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-[#404145] mb-1">
                      Họ và tên sinh viên <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="VD: Trần Mai Phương"
                      required
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#404145] mb-1">
                      Email đăng ký (.edu.vn hoặc cá nhân) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="maiphuong.tran@sis.hust.edu.vn"
                      required
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                    />
                  </div>

                  {/* Standardized University Dropdown (Chỉ tên trường) */}
                  <div>
                    <label className="block font-bold text-[#404145] mb-1">
                      Trường Đại học đang theo học <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedUniversity}
                      onChange={(e) => setSelectedUniversity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 font-medium focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                    >
                      {UNIVERSITIES.filter((u) => u.id !== 'all').map((u) => (
                        <option key={u.id} value={u.name}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      Hệ thống tự động đồng bộ theo tên trường đại học chính thức.
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#404145] mb-1">
                        Mã số sinh viên (MSSV) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="VD: 20235678"
                        required
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#404145] mb-1">
                        Chuyên ngành & Niên khóa
                      </label>
                      <input
                        type="text"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="VD: CNTT - K68"
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !regEmail || !fullName}
                    className="w-full py-3 font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm mt-3"
                  >
                    {isLoading ? (
                      <span>Đang tạo mã OTP...</span>
                    ) : (
                      <>
                        <span>Tiếp tục xác thực OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#222325]">
                  Nhập mã OTP 6 số để xác nhận
                </h3>
                <p className="text-neutral-500 text-xs">
                  Mã xác thực đã được gửi tới:{' '}
                  <strong className="text-neutral-800">
                    {mode === 'LOGIN' ? email : regEmail}
                  </strong>
                </p>
              </div>

              {/* Demo OTP Helper Box */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-center space-y-1">
                <span className="text-[11px] font-bold block text-amber-800">
                  Mã OTP thử nghiệm nhanh:
                </span>
                <span className="font-mono text-base font-extrabold tracking-widest text-amber-950">
                  686868
                </span>
                <span className="text-[10px] text-amber-700 block">
                  (Đã tự động điền sẵn để trải nghiệm luồng xác thực liền mạch)
                </span>
              </div>

              <div>
                <label className="block font-bold text-[#404145] mb-1.5 text-center">
                  Mã OTP 6 chữ số
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  className="w-full text-center tracking-widest text-2xl font-mono font-bold py-3 bg-neutral-50 rounded-2xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
                <span>
                  {countdown > 0 ? (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Gửi lại mã sau <strong>{countdown}s</strong>
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-semibold">Mã đã sẵn sàng gửi lại</span>
                  )}
                </span>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend}
                  className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer disabled:text-neutral-400 disabled:no-underline"
                >
                  Gửi lại mã OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full py-3 font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
              >
                {isLoading ? (
                  <span>Đang kiểm tra...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {mode === 'LOGIN' ? 'Xác minh & Đăng nhập ngay' : 'Xác thực OTP & Thiết lập hồ sơ'}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('FORM')}
                className="w-full text-center text-xs text-neutral-500 hover:text-neutral-800 py-1 cursor-pointer flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại bước trước</span>
              </button>
            </form>
          )}

          {/* STEP 3: ONBOARDING PROFILE SETUP (WHEN REGISTERING A NEW ACCOUNT) */}
          {step === 'ONBOARDING' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <GraduationCap className="w-4 h-4 text-blue-700" />
                  <span>Bước 3: Hoàn thiện hồ sơ sinh viên VIETVI</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Cập nhật các kỹ năng thế mạnh và chọn vai trò khởi đầu để nhận gợi ý Task phù hợp nhất từ cộng đồng sinh viên.
                </p>
              </div>

              {/* Display Name & University */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#404145] mb-1">
                    Tên hiển thị công khai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={onboardDisplayName}
                    onChange={(e) => setOnboardDisplayName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#404145] mb-1">
                    Trường Đại học <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={onboardUniversity}
                    onChange={(e) => setOnboardUniversity(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                  >
                    {UNIVERSITIES.filter((u) => u.id !== 'all').map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#404145] mb-1">
                    Mã số sinh viên (MSSV)
                  </label>
                  <input
                    type="text"
                    value={onboardStudentId}
                    onChange={(e) => setOnboardStudentId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#404145] mb-1">
                    Chuyên ngành & Niên khóa
                  </label>
                  <input
                    type="text"
                    value={onboardMajor}
                    onChange={(e) => setOnboardMajor(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                  />
                </div>
              </div>

              {/* Initial Role Preference Selection */}
              <div>
                <label className="block font-bold text-[#404145] mb-1.5">
                  Mục tiêu chính khi tham gia VIETVI <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setOnboardRolePreference('TASKER')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      onboardRolePreference === 'TASKER'
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-neutral-900 mb-0.5">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Nhận việc (Tasker)</span>
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      Gửi báo giá, làm bài tập / slide / code và nhận thù lao ký quỹ.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOnboardRolePreference('REQUESTER')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      onboardRolePreference === 'REQUESTER'
                        ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-neutral-900 mb-0.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Đăng việc (Requester)</span>
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      Đăng yêu cầu, tìm bạn sinh viên giỏi hỗ trợ và bảo chứng Escrow.
                    </p>
                  </button>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  * Bạn có thể tự do chuyển đổi giữa 2 vai trò bất kỳ lúc nào chỉ bằng 1 cú nhấp chuột.
                </span>
              </div>

              {/* Skills Selector */}
              <div>
                <label className="block font-bold text-[#404145] mb-1.5">
                  Kỹ năng &amp; Thế mạnh của bạn (Chọn tối đa 5)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_SKILLS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleToggleSkill(skill)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block font-bold text-[#404145] mb-1">
                  Giới thiệu bản thân ngắn (Bio)
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Nêu một vài điểm nổi bật, thái độ làm việc đúng giờ..."
                  className="w-full px-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                />
              </div>

              {/* Instant Tick Xanh Option */}
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requestTickXanh}
                    onChange={(e) => setRequestTickXanh(e.target.checked)}
                    className="mt-0.5 rounded text-[#1dbf73] focus:ring-[#1dbf73]"
                  />
                  <div>
                    <span className="font-bold text-[#222325] block">
                      Gửi ảnh thẻ sinh viên để yêu cầu cấp Tick xanh ngay
                    </span>
                    <span className="text-[11px] text-neutral-500 leading-relaxed block">
                      Hồ sơ sẽ được chuyển đến hàng đợi của Chuyên viên Vận hành (Staff Ops) để thẩm định và cấp huy hiệu Tick xanh trong 2 giờ.
                    </span>
                  </div>
                </label>

                {requestTickXanh && (
                  <div className="flex items-center gap-3 pt-2 pl-6">
                    <img
                      src={uploadedCardImage}
                      alt="Thẻ SV"
                      className="w-16 h-11 object-cover rounded-lg border border-neutral-300 shrink-0"
                    />
                    <div className="text-[11px] text-neutral-600 space-y-0.5">
                      <span className="font-semibold text-emerald-700 block flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Đã sẵn sàng ảnh thẻ SV ({onboardUniversity})
                      </span>
                      <span className="text-neutral-400">MSSV: {onboardStudentId || studentId}</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="w-full py-3 font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm mt-3"
              >
                <span>Lưu thông tin &amp; Xem thẻ sinh viên VIETVI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 4: SUCCESS CELEBRATION */}
          {step === 'SUCCESS' && (
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-[#222325]">
                  Chào mừng bạn gia nhập VIETVI!
                </h3>
                <p className="text-xs text-[#62646a] mt-1">
                  Tài khoản sinh viên và hồ sơ năng lực của bạn đã được khởi tạo hoàn tất.
                </p>
              </div>

              {/* Digital Student Card Preview */}
              <div className="max-w-sm mx-auto p-4 rounded-2xl bg-linear-to-br from-[#18181b] to-[#27272a] text-white text-left shadow-lg space-y-3 border border-neutral-700">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
                      THẺ SINH VIÊN VIETVI
                    </span>
                  </div>
                  {requestTickXanh ? (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-400" />
                      Chờ duyệt Tick xanh
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-neutral-700 text-neutral-300 text-[10px]">
                      Thành viên mới
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
                    {(onboardDisplayName || fullName).slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {onboardDisplayName || fullName}
                    </h4>
                    <p className="text-xs text-neutral-300 font-medium">
                      {onboardUniversity || selectedUniversity}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      MSSV: {onboardStudentId || studentId} · {onboardMajor || major}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-700/80 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Chế độ: <strong className="text-white">{onboardRolePreference === 'TASKER' ? 'Người thực hiện' : 'Người yêu cầu'}</strong></span>
                  <span className="text-emerald-400 font-medium">Bảo chứng Escrow 100%</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleEnterApp}
                className="w-full py-3 font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
              >
                <span>Bắt đầu trải nghiệm sàn ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
