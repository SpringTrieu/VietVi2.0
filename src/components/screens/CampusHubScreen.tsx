import React, { useState } from 'react';
import { CampusLeaderboardUser, University } from '../../types';
import { UNIVERSITIES } from '../../data/mockData';
import {
  Trophy,
  Award,
  Sparkles,
  Building,
  GraduationCap,
  Star,
  CheckCircle2,
  TrendingUp,
  Users,
  Shield,
  MessageSquare,
  ArrowRight,
  Search,
  BookOpen,
  Filter,
} from 'lucide-react';

interface CampusHubScreenProps {
  leaderboard: CampusLeaderboardUser[];
  onSelectUniversity: (uniId: string) => void;
  onExploreTasks: () => void;
  onOpenVerify: () => void;
  onSelectStudentPortfolio?: (student: CampusLeaderboardUser) => void;
}

export const CampusHubScreen: React.FC<CampusHubScreenProps> = ({
  leaderboard,
  onSelectUniversity,
  onExploreTasks,
  onOpenVerify,
  onSelectStudentPortfolio,
}) => {
  const [selectedUniFilter, setSelectedUniFilter] = useState<string>('all');
  const [searchLeader, setSearchLeader] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'LEADERBOARD' | 'TRENDS' | 'GUIDELINES'>('LEADERBOARD');

  const filteredLeaders = leaderboard.filter((item) => {
    const matchUni =
      selectedUniFilter === 'all' ||
      item.university.toLowerCase().includes(selectedUniFilter.toLowerCase()) ||
      selectedUniFilter.toLowerCase().includes(item.university.toLowerCase());
    const matchSearch =
      item.name.toLowerCase().includes(searchLeader.toLowerCase()) ||
      item.major.toLowerCase().includes(searchLeader.toLowerCase()) ||
      item.skills.some((s) => s.toLowerCase().includes(searchLeader.toLowerCase()));
    return matchUni && matchSearch;
  });

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const trendingTopics = [
    {
      title: 'Thiết kế Slide đồ án tốt nghiệp chuẩn form Hội đồng',
      category: 'Graphic Design',
      taskCount: '128 Task đã làm',
      growth: '+34% tuần này',
      priceRange: '300k - 800k',
    },
    {
      title: 'Script Python thu thập dữ liệu & xử lý số liệu NCKH',
      category: 'Tech & Coding',
      taskCount: '92 Task đã làm',
      growth: '+48% tuần này',
      priceRange: '400k - 1.2M',
    },
    {
      title: 'Dịch thuật tài liệu nghiên cứu học thuật Anh - Việt',
      category: 'Writing & Translation',
      taskCount: '76 Task đã làm',
      growth: '+22% tuần này',
      priceRange: '200k - 600k',
    },
    {
      title: 'Chạy mô hình kinh tế lượng STATA & phân tích SPSS',
      category: 'Academic & Tutoring',
      taskCount: '64 Task đã làm',
      growth: '+19% tuần này',
      priceRange: '350k - 900k',
    },
  ];

  const communityRules = [
    {
      title: '1. Nghiêm cấm gian lận thi cử trực tiếp (Anti-exam cheating)',
      desc: 'VIETVI hỗ trợ học thuật, sửa lỗi code, thiết kế slide, gia sư và kỹ năng mềm. Nền tảng tuyệt đối không hỗ trợ thi hộ, làm bài kiểm tra trực tuyến hộ trong phòng thi.',
    },
    {
      title: '2. Bảo vệ thù lao bằng cơ chế Tạm giữ Escrow',
      desc: 'Mọi trao đổi ngân sách phải thực hiện qua không gian Order chính thức. Cấm yêu cầu chuyển tiền ngoài nền tảng để tránh các rủi ro lừa đảo.',
    },
    {
      title: '3. Cam kết đúng deadline và trách nhiệm sản phẩm',
      desc: 'Sinh viên nhận task có nghĩa vụ bàn giao đúng thời hạn cam kết. Nếu trễ hạn hoặc làm sai yêu cầu, người yêu cầu có quyền hủy và hoàn tiền 100%.',
    },
    {
      title: '4. Ứng xử văn minh, hỗ trợ lẫn nhau trong cùng trường',
      desc: 'Cộng đồng sinh viên đề cao tinh thần hỗ trợ đồng môn. Mọi góp ý sau khi nghiệm thu cần mang tính xây dựng và trung thực.',
    },
  ];

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 p-8 sm:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <Trophy className="w-3.5 h-3.5" />
            <span>Campus Community &amp; Talent Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Cộng đồng Sinh viên &amp; Bảng vinh danh Top Tasker
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Nơi kết nối các sinh viên xuất sắc từ ĐH Bách Khoa, Kinh Tế Quốc Dân, Ngoại Thương,
            ĐHQG và hơn 40+ trường trên toàn quốc. Kiếm thêm thu nhập chính đáng và xây dựng hồ sơ kỹ
            năng thực chiến.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreTasks}
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Khám phá Task đang mở</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenVerify}
              className="px-5 py-2.5 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/40 border border-emerald-400/40 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Xác minh thẻ sinh viên để lên bảng Top</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 overflow-x-auto scrollbar-none text-xs font-bold">
        <button
          onClick={() => setActiveTab('LEADERBOARD')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'LEADERBOARD'
              ? 'bg-[#1dbf73] text-white shadow-xs'
              : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Bảng xếp hạng Top Tasker sinh viên</span>
        </button>

        <button
          onClick={() => setActiveTab('TRENDS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'TRENDS'
              ? 'bg-[#1dbf73] text-white shadow-xs'
              : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Kỹ năng &amp; Nhu cầu Task nổi bật</span>
        </button>

        <button
          onClick={() => setActiveTab('GUIDELINES')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'GUIDELINES'
              ? 'bg-[#1dbf73] text-white shadow-xs'
              : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Quy tắc ứng xử học thuật &amp; Cộng đồng</span>
        </button>
      </div>

      {/* TAB 1: LEADERBOARD */}
      {activeTab === 'LEADERBOARD' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="p-4 bg-white rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm sinh viên theo tên, chuyên ngành hoặc kỹ năng (Python, Slide, SPSS...)..."
                value={searchLeader}
                onChange={(e) => setSearchLeader(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#1dbf73]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-neutral-400 shrink-0" />
              <select
                value={selectedUniFilter}
                onChange={(e) => {
                  setSelectedUniFilter(e.target.value);
                  onSelectUniversity(e.target.value);
                }}
                className="py-2 px-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-semibold text-[#404145] cursor-pointer"
              >
                <option value="all">Tất cả các trường (Toàn quốc)</option>
                {UNIVERSITIES.filter((u) => u.id !== 'all').map((uni) => (
                  <option key={uni.id} value={uni.name}>
                    {uni.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Leaderboard Table / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLeaders.map((leader) => (
              <div
                key={leader.id}
                className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden"
              >
                {/* Rank Ribbon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                        leader.rank === 1
                          ? 'bg-amber-400 text-amber-950 shadow-sm'
                          : leader.rank === 2
                          ? 'bg-slate-200 text-slate-800'
                          : leader.rank === 3
                          ? 'bg-amber-700/20 text-amber-800'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      #{leader.rank}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {leader.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{leader.rating}</span>
                  </div>
                </div>

                {/* Profile info */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl ${leader.avatarBg} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    {leader.name.split(' ').slice(-1)[0][0]}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-sm text-[#222325] truncate flex items-center gap-1.5">
                      <span>{leader.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    </h3>
                    <p className="text-xs text-neutral-600 truncate mt-0.5">{leader.major}</p>
                    <p className="text-[11px] text-[#62646a] truncate flex items-center gap-1 mt-0.5">
                      <GraduationCap className="w-3 h-3 text-neutral-400" />
                      <span>{leader.university}</span>
                    </p>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
                  <div>
                    <span className="block text-[10px] text-neutral-400 font-medium">Task hoàn thành</span>
                    <span className="text-xs font-black text-[#222325]">
                      {leader.completedTasks} Task
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-neutral-400 font-medium">Thu nhập tích lũy</span>
                    <span className="text-xs font-black text-emerald-700">
                      {formatVND(leader.earnedVnd)}
                    </span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {leader.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-neutral-100 text-neutral-600 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* View Portfolio CTA */}
                {onSelectStudentPortfolio && (
                  <button
                    onClick={() => onSelectStudentPortfolio(leader)}
                    className="w-full mt-2 py-1.5 px-3 bg-neutral-50 hover:bg-emerald-50 text-neutral-700 hover:text-emerald-700 border border-neutral-200 hover:border-emerald-300 text-[11px] font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Xem Hồ sơ Năng lực (PORTFOLIO-01)</span>
                    <ArrowRight className="w-3 h-3 text-emerald-600" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TRENDS */}
      {activeTab === 'TRENDS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingTopics.map((topic, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs hover:border-emerald-300 transition-colors space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                    {topic.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{topic.growth}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-[#222325]">{topic.title}</h3>
                  <p className="text-xs text-[#62646a] mt-1">
                    Số lượng sinh viên yêu cầu đang tăng mạnh trong kỳ đồ án và nghiên cứu khoa học.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                  <span className="text-neutral-500 font-medium">{topic.taskCount}</span>
                  <span className="font-bold text-[#222325]">Mức thù lao: {topic.priceRange}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-emerald-950 text-sm">
                Bạn có kỹ năng chuyên môn phù hợp với các xu hướng trên?
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Đăng ký trở thành Tasker ngay để tiếp cận các đề xuất thù lao hấp dẫn từ bạn bè cùng trường.
              </p>
            </div>
            <button
              onClick={onExploreTasks}
              className="px-4 py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Xem ngay các Task đang mở
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: GUIDELINES */}
      {activeTab === 'GUIDELINES' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-lg font-extrabold text-[#222325] flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>Bộ Quy chuẩn Đạo đức &amp; Vận hành Cộng đồng VIETVI</span>
            </h3>
            <p className="text-xs text-[#62646a] mt-1 leading-relaxed">
              VIETVI được thành lập với sứ mệnh tạo ra môi trường học tập, cọ xát kỹ năng và nâng cao
              năng lực tài chính cho sinh viên theo hướng lành mạnh, minh bạch và an toàn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityRules.map((rule, idx) => (
              <div key={idx} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1.5">
                <h4 className="font-bold text-xs text-[#222325]">{rule.title}</h4>
                <p className="text-[11px] text-[#62646a] leading-relaxed">{rule.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Mọi hành vi vi phạm điều khoản liêm chính học thuật hoặc lừa đảo giao dịch sẽ bị khóa tài
              khoản vĩnh viễn và thông báo về Hội Sinh viên các trường đối tác liên quan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
