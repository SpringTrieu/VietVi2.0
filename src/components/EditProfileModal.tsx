import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  X,
  CheckCircle2,
  User,
  GraduationCap,
  BookOpen,
  Sparkles,
  CreditCard,
  Building,
  Phone,
  Link as LinkIcon,
  Clock,
  DollarSign,
  AlertCircle,
  Palette,
  RotateCcw,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { UNIVERSITIES, VIETNAM_BANKS, CURRENT_USER } from '../data/mockData';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (updatedProfile: Partial<UserProfile>) => void;
  initialTab?: 'BASIC' | 'SKILLS' | 'BANKING';
}

const AVATAR_COLORS = [
  { label: 'Ngọc lục bảo (Emerald)', bg: 'bg-emerald-600', ring: 'ring-emerald-500' },
  { label: 'Chàm hoàng gia (Indigo)', bg: 'bg-indigo-600', ring: 'ring-indigo-500' },
  { label: 'Tím hoa cà (Violet)', bg: 'bg-violet-600', ring: 'ring-violet-500' },
  { label: 'Xanh da trời (Sky)', bg: 'bg-sky-600', ring: 'ring-sky-500' },
  { label: 'Hổ phách (Amber)', bg: 'bg-amber-600', ring: 'ring-amber-500' },
  { label: 'Hồng ngọc (Rose)', bg: 'bg-rose-600', ring: 'ring-rose-500' },
  { label: 'Xanh lam (Teal)', bg: 'bg-teal-600', ring: 'ring-teal-500' },
  { label: 'Tím thẫm (Purple)', bg: 'bg-purple-700', ring: 'ring-purple-500' },
];

const SUGGESTED_SKILLS = [
  'Python',
  'PowerPoint',
  'Canva Pro',
  'SPSS',
  'Excel Nâng Cao',
  'React/Tailwind',
  'IELTS 7.5',
  'Dịch thuật CNTT',
  'Figma',
  'Gia sư Giải Tích',
  'Viết Content SEO',
  'Photoshop',
  'Machine Learning',
  'SQL / Database',
  'Làm video CapCut',
];

const BIO_TEMPLATES = [
  {
    title: 'Công nghệ & Lập trình (IT)',
    text: 'Sinh viên CNTT đam mê lập trình Python, web frontend và xử lý dữ liệu. Cam kết mã nguồn sạch, chạy ổn định và hỗ trợ hướng dẫn tận tình.',
  },
  {
    title: 'Thiết kế Slide & Thuyết trình',
    text: 'Chuyên thiết kế Slide PowerPoint thuyết trình, Infographic & ấn phẩm Canva Pro chuẩn học thuật. Đúng hẹn 100%, bảo hành chỉnh sửa đến khi hài lòng.',
  },
  {
    title: 'Ngoại ngữ & Dịch thuật',
    text: 'IELTS 7.5, kinh nghiệm dịch thuật học thuật Anh - Việt, soạn tóm tắt tài liệu tiếng Anh và gia sư giao tiếp cơ bản.',
  },
  {
    title: 'Kinh tế & Xử lý số liệu',
    text: 'Thành thạo phân tích số liệu SPSS, xử lý bảng biểu Excel nâng cao, hỗ trợ vẽ biểu đồ và tổng hợp số liệu tiểu luận chuẩn APA.',
  },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  initialTab = 'BASIC',
}) => {
  const [activeTab, setActiveTab] = useState<'BASIC' | 'SKILLS' | 'BANKING'>(initialTab);

  // Basic Info Form State
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [headline, setHeadline] = useState(currentUser.headline || '');
  const [major, setMajor] = useState(currentUser.major);
  const [university, setUniversity] = useState(currentUser.university);
  const [studentId, setStudentId] = useState(currentUser.studentId || '');
  const [graduationYear, setGraduationYear] = useState(currentUser.graduationYear || '2026');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '');
  const [avatarBg, setAvatarBg] = useState(currentUser.avatarBg || 'bg-emerald-600');

  // Skills & Bio Form State
  const [bio, setBio] = useState(currentUser.bio || '');
  const [skills, setSkills] = useState<string[]>(currentUser.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(currentUser.hourlyRate || 80000);
  const [availableHoursPerWeek, setAvailableHoursPerWeek] = useState<number>(currentUser.availableHoursPerWeek || 15);
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser.portfolioUrl || '');
  const [githubUrl, setGithubUrl] = useState(currentUser.githubUrl || '');

  // Banking Form State
  const [bankName, setBankName] = useState(currentUser.bankName || 'MB Bank (Quân Đội)');
  const [bankAccountNumber, setBankAccountNumber] = useState(currentUser.bankAccountNumber || '9704228899881234');
  const [bankAccountName, setBankAccountName] = useState(currentUser.bankAccountName || currentUser.displayName.toUpperCase());

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Sync state whenever modal opens or currentUser changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setDisplayName(currentUser.displayName);
      setHeadline(currentUser.headline || '');
      setMajor(currentUser.major);
      setUniversity(currentUser.university);
      setStudentId(currentUser.studentId || '');
      setGraduationYear(currentUser.graduationYear || '2026');
      setPhoneNumber(currentUser.phoneNumber || '');
      setAvatarBg(currentUser.avatarBg || 'bg-emerald-600');
      setBio(currentUser.bio || '');
      setSkills(currentUser.skills || []);
      setHourlyRate(currentUser.hourlyRate || 80000);
      setAvailableHoursPerWeek(currentUser.availableHoursPerWeek || 15);
      setPortfolioUrl(currentUser.portfolioUrl || '');
      setGithubUrl(currentUser.githubUrl || '');
      setBankName(currentUser.bankName || 'MB Bank (Quân Đội)');
      setBankAccountNumber(currentUser.bankAccountNumber || '9704228899881234');
      setBankAccountName(currentUser.bankAccountName || currentUser.displayName.toUpperCase());
      setErrors({});
    }
  }, [isOpen, currentUser, initialTab]);

  if (!isOpen) return null;

  // Add a skill tag
  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    setSkills([...skills, trimmed]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (indexToRemove: number) => {
    setSkills(skills.filter((_, idx) => idx !== indexToRemove));
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!displayName.trim() || displayName.trim().length < 3) {
      newErrors.displayName = 'Họ và tên hiển thị phải có ít nhất 3 ký tự';
    }

    if (!major.trim()) {
      newErrors.major = 'Vui lòng nhập chuyên ngành học';
    }

    if (phoneNumber && !/^[0-9+() -]{9,15}$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = 'Số điện thoại không đúng định dạng';
    }

    if (activeTab === 'BANKING') {
      if (!bankAccountNumber.trim()) {
        newErrors.bankAccountNumber = 'Số tài khoản ngân hàng không được để trống';
      }
      if (!bankAccountName.trim()) {
        newErrors.bankAccountName = 'Tên chủ tài khoản không được để trống';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('Khôi phục toàn bộ thông tin hồ sơ về trạng thái demo mặc định?')) {
      setDisplayName(CURRENT_USER.displayName);
      setHeadline(CURRENT_USER.headline || '');
      setMajor(CURRENT_USER.major);
      setUniversity(CURRENT_USER.university);
      setStudentId(CURRENT_USER.studentId || '');
      setGraduationYear(CURRENT_USER.graduationYear || '2026');
      setPhoneNumber(CURRENT_USER.phoneNumber || '');
      setAvatarBg(CURRENT_USER.avatarBg || 'bg-emerald-600');
      setBio(CURRENT_USER.bio || '');
      setSkills(CURRENT_USER.skills || []);
      setHourlyRate(CURRENT_USER.hourlyRate || 80000);
      setAvailableHoursPerWeek(CURRENT_USER.availableHoursPerWeek || 15);
      setPortfolioUrl(CURRENT_USER.portfolioUrl || '');
      setGithubUrl(CURRENT_USER.githubUrl || '');
      setBankName(CURRENT_USER.bankName || 'MB Bank (Quân Đội)');
      setBankAccountNumber(CURRENT_USER.bankAccountNumber || '9704228899881234');
      setBankAccountName(CURRENT_USER.bankAccountName || CURRENT_USER.displayName.toUpperCase());
    }
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);

    setTimeout(() => {
      onSaveProfile({
        displayName: displayName.trim(),
        headline: headline.trim(),
        major: major.trim(),
        university,
        studentId: studentId.trim(),
        graduationYear: graduationYear.trim(),
        phoneNumber: phoneNumber.trim(),
        avatarBg,
        bio: bio.trim(),
        skills,
        hourlyRate: Number(hourlyRate) || 80000,
        availableHoursPerWeek: Number(availableHoursPerWeek) || 15,
        portfolioUrl: portfolioUrl.trim(),
        githubUrl: githubUrl.trim(),
        bankName,
        bankAccountNumber: bankAccountNumber.trim(),
        bankAccountName: bankAccountName.trim().toUpperCase(),
      });
      setIsSaving(false);
      onClose();
    }, 450);
  };

  // Computed initials
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#222325]">
                Chỉnh sửa hồ sơ Sinh viên
              </h3>
              <p className="text-xs text-[#62646a]">
                Cập nhật thông tin học thuật, kỹ năng chuyên môn và tài khoản thanh toán nhận tiền
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Mini Preview Bar */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 px-6 py-3 border-b border-neutral-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-2xl ${avatarBg} text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm`}
            >
              {initials || 'SV'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-[#222325] truncate">
                  {displayName || 'Chưa nhập họ tên'}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-700 bg-white/90 border border-blue-200 px-1.5 py-0.2 rounded-md">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span>Xác minh SV</span>
                </span>
              </div>
              <p className="text-[11px] text-[#62646a] truncate">
                {major || 'Chuyên ngành'} · <strong className="text-neutral-700">{university}</strong>
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-right shrink-0">
            <div className="text-[11px] text-neutral-500">
              <span>Kỹ năng: </span>
              <strong className="text-emerald-700">{skills.length}</strong>
            </div>
            <span className="text-neutral-300">|</span>
            <div className="text-[11px] text-neutral-500">
              <span>Định danh: </span>
              <strong className="text-neutral-800">{studentId || 'Chưa có MSSV'}</strong>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-neutral-200 bg-white text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('BASIC')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'BASIC'
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-[#62646a] hover:text-[#222325]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>1. Học tập & Định danh</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SKILLS')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'SKILLS'
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-[#62646a] hover:text-[#222325]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2. Chuyên môn & Giới thiệu</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('BANKING')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'BANKING'
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-[#62646a] hover:text-[#222325]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>3. Tài khoản nhận tiền</span>
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 text-xs space-y-5">
          {/* ================= TAB 1: BASIC ================= */}
          {activeTab === 'BASIC' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Row 1: Display Name & Headline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#404145] mb-1">
                    Họ và tên hiển thị <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Minh Anh"
                    required
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 rounded-xl border focus:bg-white focus:ring-2 focus:ring-[#1dbf73] transition-all ${
                      errors.displayName ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200'
                    }`}
                  />
                  {errors.displayName && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.displayName}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-[#404145] mb-1">
                    Tiêu đề nghề nghiệp / Châm ngôn ngắn
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Ví dụ: Chuyên slide PowerPoint & Gia sư Python"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73] transition-all"
                  />
                </div>
              </div>

              {/* Row 2: University & Major */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#404145] mb-1">
                    Trường Đại học <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73] transition-all"
                  >
                    {UNIVERSITIES.filter((u) => u.id !== 'all').map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name} ({u.shortName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#404145] mb-1">
                    Khoa / Chuyên ngành & Khóa học <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="Ví dụ: Khoa học Máy tính - K67"
                    required
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 rounded-xl border focus:bg-white focus:ring-2 focus:ring-[#1dbf73] transition-all ${
                      errors.major ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200'
                    }`}
                  />
                  {errors.major && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.major}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Student ID, Grad Year, Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#404145] mb-1">
                    Mã số sinh viên (MSSV)
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Ví dụ: 20224589"
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#404145] mb-1">
                    Năm tốt nghiệp dự kiến
                  </label>
                  <input
                    type="text"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="Ví dụ: 2026"
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#404145] mb-1">
                    Số điện thoại / Zalo
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Ví dụ: 0981 234 567"
                    className={`w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border focus:bg-white focus:ring-2 focus:ring-[#1dbf73] ${
                      errors.phoneNumber ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200'
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-[10px] text-rose-600 mt-1">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              {/* Avatar Color Picker */}
              <div className="pt-2">
                <label className="flex items-center gap-1.5 font-bold text-[#404145] mb-2">
                  <Palette className="w-4 h-4 text-emerald-600" />
                  <span>Chọn màu nhận diện Avatar của bạn:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AVATAR_COLORS.map((col) => {
                    const isSelected = avatarBg === col.bg;
                    return (
                      <button
                        key={col.bg}
                        type="button"
                        onClick={() => setAvatarBg(col.bg)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                            : 'border-neutral-200 bg-white hover:bg-neutral-50'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-lg ${col.bg} text-white flex items-center justify-center shrink-0`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-[11px] font-semibold text-neutral-700 truncate">
                          {col.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: SKILLS & BIO ================= */}
          {activeTab === 'SKILLS' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Bio Section */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#404145]">
                    Giới thiệu bản thân (Bio)
                  </label>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {bio.length}/500 ký tự
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Chia sẻ thế mạnh học tập, kinh nghiệm làm việc, phương pháp trao đổi và cam kết liêm chính học thuật..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73] transition-all"
                />

                {/* Bio Templates Suggestions */}
                <div className="mt-2 space-y-1.5">
                  <span className="text-[11px] font-semibold text-neutral-500 block">
                    Gợi ý mẫu Bio nhanh (nhấp vào để áp dụng):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {BIO_TEMPLATES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBio(tmpl.text)}
                        className="text-left p-2 rounded-xl bg-neutral-50 hover:bg-emerald-50/60 border border-neutral-200 hover:border-emerald-300 text-[11px] transition-all cursor-pointer group"
                      >
                        <span className="font-bold text-neutral-800 group-hover:text-emerald-700 block mb-0.5">
                          {tmpl.title}
                        </span>
                        <span className="text-neutral-500 line-clamp-1">{tmpl.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills Tags Manager */}
              <div className="pt-2">
                <label className="block font-bold text-[#404145] mb-1">
                  Kỹ năng & Công cụ thành thạo ({skills.length})
                </label>

                {/* Current Skills Chips */}
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-neutral-50 rounded-2xl border border-neutral-200 min-h-[46px] mb-2">
                  {skills.length > 0 ? (
                    skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-[#222325] rounded-xl text-xs font-bold border border-neutral-200 shadow-2xs group"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(idx)}
                          className="text-neutral-400 hover:text-rose-600 rounded-full cursor-pointer ml-0.5"
                          title="Xóa kỹ năng này"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-400 italic self-center">
                      Chưa có kỹ năng nào. Nhập bên dưới hoặc bấm vào gợi ý để thêm.
                    </span>
                  )}
                </div>

                {/* Add new skill input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(newSkillInput);
                      }
                    }}
                    placeholder="Nhập tên kỹ năng và bấm Thêm (ví dụ: Figma, SPSS, Dịch tiếng Hàn...)"
                    className="flex-1 px-3.5 py-2 text-xs bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-[#1dbf73]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(newSkillInput)}
                    className="px-4 py-2 font-bold text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
                  >
                    + Thêm
                  </button>
                </div>

                {/* Suggested skills 1-click */}
                <div className="mt-2.5">
                  <span className="text-[11px] font-semibold text-neutral-500 mb-1.5 block">
                    Gợi ý kỹ năng sinh viên phổ biến (1 chạm để thêm):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_SKILLS.map((item) => {
                      const alreadyAdded = skills.some(
                        (s) => s.toLowerCase() === item.toLowerCase()
                      );
                      return (
                        <button
                          key={item}
                          type="button"
                          disabled={alreadyAdded}
                          onClick={() => handleAddSkill(item)}
                          className={`text-[11px] px-2.5 py-1 rounded-xl transition-all cursor-pointer font-medium ${
                            alreadyAdded
                              ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed opacity-60'
                              : 'bg-white hover:bg-emerald-50 text-neutral-700 hover:text-emerald-800 border border-neutral-200 hover:border-emerald-300'
                          }`}
                        >
                          {alreadyAdded ? `✓ ${item}` : `+ ${item}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Hourly Rate & Available Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="flex items-center gap-1 font-bold text-[#404145] mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mức thù lao kỳ vọng (VNĐ/giờ)</span>
                  </label>
                  <input
                    type="number"
                    step="5000"
                    min="30000"
                    max="500000"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Mức tham khảo cho khách hàng khi liên hệ mời nhận task.
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-1 font-bold text-[#404145] mb-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Số giờ rảnh mỗi tuần (giờ/tuần)</span>
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="60"
                    value={availableHoursPerWeek}
                    onChange={(e) => setAvailableHoursPerWeek(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Thời gian có thể bố trí làm thêm ngoài giờ học trên trường.
                  </p>
                </div>
              </div>

              {/* External Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1 font-bold text-[#404145] mb-1">
                    <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Liên kết Portfolio / Behance / Google Drive</span>
                  </label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://behance.net/username..."
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1 font-bold text-[#404145] mb-1">
                    <LinkIcon className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Liên kết GitHub cá nhân</span>
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username..."
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: BANKING & PAYOUT ================= */}
          {activeTab === 'BANKING' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <strong className="block font-bold mb-0.5">
                    Nguyên tắc Bảo chứng Escrow & Rút tiền minh bạch
                  </strong>
                  Tiền thù lao khi hoàn thành Task sẽ được giải ngân trực tiếp vào tài khoản ngân hàng chính chủ của bạn. Hệ thống yêu cầu tên chủ tài khoản trùng khớp với định danh sinh viên đã xác minh.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#404145] mb-1">
                    Ngân hàng thụ hưởng <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                  >
                    {VIETNAM_BANKS.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#404145] mb-1">
                    Số tài khoản ngân hàng <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    placeholder="Ví dụ: 9704228899881234"
                    required
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono bg-neutral-50 rounded-xl border focus:bg-white focus:ring-2 focus:ring-[#1dbf73] ${
                      errors.bankAccountNumber ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200'
                    }`}
                  />
                  {errors.bankAccountNumber && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.bankAccountNumber}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#404145] mb-1">
                  Tên chủ tài khoản (Viết hoa không dấu) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value.toUpperCase())}
                  placeholder="Ví dụ: NGUYEN MINH ANH"
                  required
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono tracking-wide uppercase bg-neutral-50 rounded-xl border focus:bg-white focus:ring-2 focus:ring-[#1dbf73] ${
                    errors.bankAccountName ? 'border-rose-400 bg-rose-50/30' : 'border-neutral-200'
                  }`}
                />
                {errors.bankAccountName && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.bankAccountName}</p>
                )}
                <p className="text-[11px] text-neutral-400 mt-1">
                  Khuyến nghị: Nhập chính xác tên như in trên thẻ ngân hàng hoặc ứng dụng Internet Banking.
                </p>
              </div>

              {/* Preview Card */}
              <div className="p-4 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl shadow-md space-y-3">
                <div className="flex items-center justify-between text-[11px] text-neutral-300">
                  <span className="font-semibold uppercase tracking-wider">Thẻ thụ hưởng VIETVI Escrow</span>
                  <span className="font-mono">{bankName.split('(')[0].trim()}</span>
                </div>
                <div className="font-mono text-base tracking-widest text-emerald-400">
                  {bankAccountNumber ? bankAccountNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <div>
                    <span className="text-[9px] text-neutral-400 block uppercase">Chủ tài khoản</span>
                    <span className="font-bold tracking-wide">{bankAccountName || 'NGUYEN MINH ANH'}</span>
                  </div>
                  <span className="text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    Hoạt động
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 hover:underline cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục dữ liệu gốc demo</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 font-semibold text-[#62646a] hover:bg-neutral-100 rounded-xl cursor-pointer transition-colors"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang lưu hồ sơ...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
