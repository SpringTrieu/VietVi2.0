import React from 'react';
import {
  Search,
  MapPin,
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle2,
  ArrowRightLeft,
  Briefcase,
  User,
  Plus,
  Coins,
  FileCheck,
} from 'lucide-react';
import { UNIVERSITIES } from '../data/mockData';
import { TaskMode, UserMode, ActiveScreen } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedUni: string;
  onSelectUni: (uni: string) => void;
  selectedMode: TaskMode | 'ALL';
  onSelectMode: (mode: TaskMode | 'ALL') => void;
  userMode?: UserMode;
  onToggleMode?: () => void;
  onOpenPostTask: () => void;
  onOpenVerify: () => void;
  onNavigateToScreen?: (screen: ActiveScreen) => void;
  openTasksCount?: number;
  offersCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedUni,
  onSelectUni,
  selectedMode,
  onSelectMode,
  userMode = 'REQUESTER',
  onToggleMode,
  onOpenPostTask,
  onOpenVerify,
  onNavigateToScreen,
  openTasksCount = 3,
  offersCount = 4,
}) => {
  const handleQuickTagClick = (tag: string) => {
    onSearchChange(tag);
    const element = document.getElementById('market-tasks');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isRequester = userMode === 'REQUESTER';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-neutral-50/50 to-[#f7f7f8] pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Dual-Role Context Bar with 1-Click Toggle */}
        <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
                isRequester ? 'bg-indigo-600' : 'bg-emerald-600'
              }`}
            >
              {isRequester ? <User className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
            </span>
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#222325]">
                  {isRequester
                    ? 'Bạn đang ở chế độ: Người yêu cầu (Thuê sinh viên)'
                    : 'Bạn đang ở chế độ: Người thực hiện (Nhận việc & Kiếm tiền)'}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isRequester
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isRequester ? 'Bên thuê' : 'Bên làm việc'}
                </span>
              </div>
              <p className="text-[#62646a] mt-0.5">
                {isRequester
                  ? 'Giao diện ưu tiên đăng việc, xem ứng viên và duyệt nghiệm thu giải ngân.'
                  : 'Giao diện ưu tiên duyệt việc, gửi báo giá cạnh tranh và nộp bài để nhận thù lao.'}
              </p>
            </div>
          </div>

          {onToggleMode && (
            <button
              onClick={onToggleMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer self-start sm:self-auto shrink-0 ${
                isRequester
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-indigo-50 text-indigo-800 border-indigo-300 hover:bg-indigo-100'
              }`}
              title="Nhấn để đổi sang chế độ còn lại"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>
                {isRequester ? 'Chuyển sang Người thực hiện' : 'Chuyển sang Người yêu cầu'}
              </span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & High-Intent Search */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Student-first context badge */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {isRequester
                  ? 'Ký quỹ Escrow 100% · Chỉ giải ngân khi bạn hài lòng nghiệm thu'
                  : 'Thù lao đã được ký quỹ an toàn · Yên tâm nhận việc không lo bùng tiền'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[#62646a]">Sàn sinh viên VIETVI</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#222325] tracking-tight leading-[1.15]">
              {isRequester ? (
                <>
                  Cần giúp việc học tập, đồ án?{' '}
                  <span className="text-[#1dbf73]">Sinh viên tài năng</span> sẵn sàng hỗ trợ.
                </>
              ) : (
                <>
                  Tận dụng kiến thức & kỹ năng sinh viên{' '}
                  <span className="text-[#1dbf73]">kiếm thêm thu nhập</span> an toàn.
                </>
              )}
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#62646a] max-w-2xl leading-relaxed">
              {isRequester
                ? 'Biến nhu cầu rời rạc thành Task rõ ràng, có hạn chót và ngân sách minh bạch. Đăng yêu cầu trong 2 phút — sinh viên cùng trường hoặc toàn quốc giải quyết nhanh chóng, an toàn qua bảo chứng Escrow.'
                : 'Khám phá hàng chục Task học thuật, slide thuyết trình, code đồ án, dịch thuật mỗi ngày. Nộp báo giá minh bạch, làm việc trực tiếp và rút thù lao về tài khoản ngân hàng ngay khi nghiệm thu.'}
            </p>

            {/* Structured Search Module */}
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-sm border border-neutral-200/80 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                {/* Keyword input */}
                <div className="sm:col-span-6 relative flex items-center">
                  <Search className="absolute left-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={
                      isRequester
                        ? 'Tìm kiếm Task mẫu: Làm slide, Code Python, Gia sư...'
                        : 'Tìm việc làm theo kỹ năng: Python, Figma, React, Dịch...'
                    }
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-neutral-50 rounded-xl border-0 focus:ring-2 focus:ring-[#1dbf73] focus:bg-white transition-all text-[#222325] placeholder:text-neutral-400"
                  />
                </div>

                {/* University filter */}
                <div className="sm:col-span-3 relative flex items-center">
                  <select
                    value={selectedUni}
                    onChange={(e) => onSelectUni(e.target.value)}
                    className="w-full py-2.5 px-3 text-xs bg-neutral-50 rounded-xl border-0 text-[#404145] font-medium focus:ring-2 focus:ring-[#1dbf73] focus:bg-white cursor-pointer"
                  >
                    {UNIVERSITIES.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mode selector */}
                <div className="sm:col-span-3 flex items-center">
                  <select
                    value={selectedMode}
                    onChange={(e) => onSelectMode(e.target.value as TaskMode | 'ALL')}
                    className="w-full py-2.5 px-3 text-xs bg-neutral-50 rounded-xl border-0 text-[#404145] font-medium focus:ring-2 focus:ring-[#1dbf73] focus:bg-white cursor-pointer"
                  >
                    <option value="ALL">Mọi hình thức</option>
                    <option value="ONLINE">Chỉ Online</option>
                    <option value="ONSITE">Onsite tại trường</option>
                    <option value="FLEXIBLE">Linh hoạt</option>
                  </select>
                </div>
              </div>

              {/* Action row below search */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100 text-xs">
                {/* Clean unboxed quick keywords */}
                <div className="flex items-center gap-1.5 flex-wrap text-neutral-500">
                  <span className="font-semibold text-neutral-700">Gợi ý:</span>
                  <button
                    onClick={() => handleQuickTagClick('Slide')}
                    className="hover:text-emerald-700 hover:underline cursor-pointer"
                  >
                    Slide đồ án
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    onClick={() => handleQuickTagClick('Python')}
                    className="hover:text-emerald-700 hover:underline cursor-pointer"
                  >
                    Python cào dữ liệu
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    onClick={() => handleQuickTagClick('Gia sư')}
                    className="hover:text-emerald-700 hover:underline cursor-pointer"
                  >
                    Gia sư Giải Tích
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    onClick={() => handleQuickTagClick('Dịch thuật')}
                    className="hover:text-emerald-700 hover:underline cursor-pointer"
                  >
                    Dịch học thuật
                  </button>
                </div>

                <a
                  href="#market-tasks"
                  className="inline-flex items-center gap-1 font-semibold text-[#1dbf73] hover:text-[#19a463] hover:underline"
                >
                  <span>{isRequester ? 'Duyệt tham khảo Task' : 'Xem các Task đang tuyển'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Action CTAs based on active mode */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              {isRequester ? (
                <>
                  <button
                    onClick={onOpenPostTask}
                    className="px-6 py-3 text-sm font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-sm transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>+ Đăng Task mới trong 2 phút</span>
                  </button>

                  {onNavigateToScreen && (
                    <button
                      onClick={() => onNavigateToScreen('MY_TASKS')}
                      className="px-5 py-3 text-sm font-semibold text-[#404145] bg-white hover:bg-neutral-100 border border-neutral-200 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <FileCheck className="w-4 h-4 text-indigo-600" />
                      <span>Xem báo giá đang chờ duyệt ({offersCount})</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <a
                    href="#market-tasks"
                    className="px-6 py-3 text-sm font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-sm transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Khám phá việc làm kiếm thù lao</span>
                  </a>

                  {onNavigateToScreen && (
                    <button
                      onClick={() => onNavigateToScreen('MY_JOBS')}
                      className="px-5 py-3 text-sm font-semibold text-[#404145] bg-white hover:bg-neutral-100 border border-neutral-200 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Coins className="w-4 h-4 text-emerald-600" />
                      <span>Quản lý công việc & thù lao</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Column: Visual Anchor & Verified Student Proof Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/90 space-y-6">
              
              {/* Header inside card */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    {isRequester ? 'Cam kết cho Bên thuê' : 'Cam kết cho Bên làm việc'}
                  </p>
                  <h3 className="text-lg font-bold text-[#222325] mt-0.5">
                    {isRequester
                      ? 'Nghiệm thu hài lòng mới giải ngân'
                      : 'Ký quỹ 100% trước khi bắt đầu'}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              {/* Sample verified student showcase inside card */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    TK
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#222325] truncate">
                        Tuấn Khoa
                      </span>
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-1.5 py-0.5 rounded">
                        Đã xác minh SV
                      </span>
                    </div>
                    <p className="text-xs text-[#62646a] truncate">
                      Kỹ thuật Máy tính K67 · ĐHBK Hà Nội
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-neutral-200/60 text-xs">
                  <div>
                    <span className="block text-[11px] text-neutral-400">Đã hoàn thành</span>
                    <span className="font-bold text-[#222325] tabular-nums">28 Task</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-neutral-400">Đánh giá 3 chiều</span>
                    <span className="font-bold text-[#222325] tabular-nums">5.0 ★</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-neutral-400">Tỷ lệ đúng hạn</span>
                    <span className="font-bold text-emerald-600 tabular-nums">100%</span>
                  </div>
                </div>
              </div>

              {/* 3 Core Trust Guarantees */}
              <div className="space-y-2.5 text-xs text-[#404145]">
                {isRequester ? (
                  <>
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>
                        <strong className="text-[#222325]">Không sợ mất tiền:</strong> Thù lao nằm trong Escrow, chỉ chuyển cho Tasker khi bạn duyệt bàn giao.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>
                        <strong className="text-[#222325]">Được yêu cầu sửa đổi:</strong> Thoải mái yêu cầu chỉnh sửa nếu sản phẩm chưa đạt chuẩn.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>
                        <strong className="text-[#222325]">Trọng tài công bằng:</strong> Đội ngũ hỗ trợ VIETVI sẵn sàng can thiệp hòa giải 24/7.
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>
                        <strong className="text-[#222325]">Không lo bùng thù lao:</strong> Khách đã nạp tiền vào hệ thống trước khi bạn tiến hành làm việc.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>
                        <strong className="text-[#222325]">Rút tiền tức thì:</strong> Nhận tiền về tài khoản ngân hàng hoặc MoMo ngay sau khi nghiệm thu.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>
                        <strong className="text-[#222325]">Xây dựng Portfolio:</strong> Mọi Task hoàn thành đều tích lũy vào hồ sơ uy tín có Tick xanh.
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Live activity ticker */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-[#62646a]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {isRequester
                    ? 'Có 18 bạn sinh viên giỏi đang sẵn sàng nhận việc'
                    : 'Có 12 Task mới được đăng trong 24 giờ qua'}
                </span>
                <span className="font-mono text-neutral-400">Toàn quốc</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof & Quantitative Rigor Strip */}
        <div className="mt-12 pt-8 border-t border-neutral-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#222325] tabular-nums">
              3.450+
            </div>
            <p className="text-xs text-[#62646a] mt-1 font-medium">Task sinh viên đã hoàn tất</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tabular-nums">
              98.6%
            </div>
            <p className="text-xs text-[#62646a] mt-1 font-medium">Tỷ lệ nghiệm thu thành công</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#222325] tabular-nums">
              45+
            </div>
            <p className="text-xs text-[#62646a] mt-1 font-medium">Trường Đại học trên cả nước</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 tabular-nums">
              &lt; 2 Giờ
            </div>
            <p className="text-xs text-[#62646a] mt-1 font-medium">Thời gian trung vị nhận đề xuất đầu</p>
          </div>
        </div>
      </div>
    </section>
  );
};
