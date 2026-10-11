import React, { useState } from 'react';
import {
  UserProfile,
  CampusLeaderboardUser,
  StudentReviewItem,
  PortfolioProject,
  StudentSkillBadge,
  TaskItem,
} from '../../types';
import {
  MOCK_PORTFOLIO_PROJECTS,
  MOCK_VERIFIED_SKILLS,
  MOCK_STUDENT_REVIEWS,
  UNIVERSITIES,
} from '../../data/mockData';
import {
  BadgeCheck,
  Star,
  Clock,
  CheckCircle2,
  Share2,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  Github,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  MapPin,
  Send,
  X,
  FileText,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface PublicPortfolioScreenProps {
  studentProfile?: UserProfile | CampusLeaderboardUser;
  currentUser: UserProfile;
  availableTasks?: TaskItem[];
  onSendMessage: (peerUser: UserProfile) => void;
  onInviteToTask: (studentId: string, taskTitle: string, budget: number) => void;
  onBackToHome: () => void;
  onExploreLeaderboard: () => void;
}

export const PublicPortfolioScreen: React.FC<PublicPortfolioScreenProps> = ({
  studentProfile,
  currentUser,
  availableTasks = [],
  onSendMessage,
  onInviteToTask,
  onBackToHome,
  onExploreLeaderboard,
}) => {
  const [activeTab, setActiveTab] = useState<'PORTFOLIO' | 'SKILLS' | 'REVIEWS' | 'EDUCATION'>('PORTFOLIO');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteTaskTitle, setInviteTaskTitle] = useState('');
  const [inviteBudget, setInviteBudget] = useState('500000');
  const [inviteMessage, setInviteMessage] = useState('');
  const [shareToast, setShareToast] = useState(false);
  const [inviteSuccessToast, setInviteSuccessToast] = useState(false);

  // Default target user if none provided (e.g. top student Nguyen Minh Anh)
  const isTargetingCurrent = !studentProfile || studentProfile.id === currentUser.id || studentProfile.id === 'usr-current';
  const targetUser = isTargetingCurrent ? currentUser : (studentProfile as UserProfile);

  const profile: UserProfile = {
    id: targetUser?.id || 'lead-1',
    displayName:
      (studentProfile as CampusLeaderboardUser)?.name ||
      targetUser?.displayName ||
      currentUser.displayName,
    university: targetUser?.university || currentUser.university,
    major: targetUser?.major || currentUser.major,
    avatarBg: targetUser?.avatarBg || currentUser.avatarBg,
    rating: targetUser?.rating || 4.98,
    reviewCount: targetUser?.reviewCount || 38,
    tasksCompleted: (studentProfile as any)?.completedTasks || targetUser?.tasksCompleted || 38,
    isVerifiedStudent: targetUser?.isVerifiedStudent ?? true,
    role: 'STUDENT',
    studentId: targetUser?.studentId || currentUser.studentId || '20224589',
    headline: targetUser?.headline || currentUser.headline,
    bio: targetUser?.bio || currentUser.bio || 'Sinh viên đại học cam kết liêm chính học thuật 100%.',
    skills: (targetUser?.skills && targetUser.skills.length > 0) ? targetUser.skills : (currentUser.skills || ['Python', 'Selenium', 'Figma', 'React']),
    phoneNumber: targetUser?.phoneNumber || currentUser.phoneNumber,
    portfolioUrl: targetUser?.portfolioUrl || currentUser.portfolioUrl,
    githubUrl: targetUser?.githubUrl || currentUser.githubUrl,
    hourlyRate: targetUser?.hourlyRate || currentUser.hourlyRate,
    availableHoursPerWeek: targetUser?.availableHoursPerWeek || currentUser.availableHoursPerWeek,
  };

  const handleShareProfile = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteTaskTitle.trim()) return;

    onInviteToTask(profile.id, inviteTaskTitle, Number(inviteBudget) || 500000);
    setIsInviteModalOpen(false);
    setInviteSuccessToast(true);
    setTimeout(() => setInviteSuccessToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#62646a]">
            <button onClick={onBackToHome} className="hover:text-emerald-600 cursor-pointer">
              Trang chủ
            </button>
            <span>/</span>
            <button onClick={onExploreLeaderboard} className="hover:text-emerald-600 cursor-pointer">
              Campus Hub &amp; Bảng xếp hạng
            </button>
            <span>/</span>
            <span className="font-bold text-[#222325]">Hồ sơ Sinh viên (PORTFOLIO-01)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareProfile}
              className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-xl border border-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Chia sẻ hồ sơ</span>
            </button>
            {shareToast && (
              <span className="text-xs font-bold text-emerald-600 animate-in fade-in">
                ✓ Đã sao chép liên kết!
              </span>
            )}
          </div>
        </div>

        {/* Profile Hero Card */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs overflow-hidden">
          {/* Cover Banner */}
          <div className="h-32 sm:h-44 bg-linear-to-r from-emerald-600 via-teal-600 to-indigo-700 p-6 flex items-end justify-between relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold border border-white/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Top 1 Campus HUST
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950/40 backdrop-blur-md text-emerald-200 text-[11px] font-bold border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Sinh viên Liêm chính
              </span>
            </div>
          </div>

          {/* Profile Details Bar */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 -mt-12 sm:-mt-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative">
                <div
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl ${profile.avatarBg} text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-lg border-4 border-white`}
                >
                  {profile.displayName.charAt(0)}
                </div>
                <span
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-500/20"
                  title="Đang sẵn sàng nhận việc"
                />
              </div>

              {/* Title & Meta */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#222325]">
                    {profile.displayName}
                  </h1>
                  {profile.isVerifiedStudent && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                      <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                      Đã xác minh thẻ SV
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600">
                  <span className="font-semibold text-neutral-800 flex items-center gap-1">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    {profile.university}
                  </span>
                  <span>•</span>
                  <span>{profile.major}</span>
                  <span>•</span>
                  <span className="font-mono text-neutral-500">MSSV: {profile.studentId}</span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{profile.rating.toFixed(2)}</span>
                    <span className="text-xs font-normal text-neutral-500">
                      ({profile.reviewCount} đánh giá 5 sao)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onSendMessage(profile)}
                className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Nhắn tin</span>
              </button>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="px-5 py-2.5 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-extrabold rounded-xl shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>Giao việc / Mời làm Task</span>
              </button>
            </div>
          </div>

          {/* Bio strip */}
          {profile.bio && (
            <div className="px-6 sm:px-8 pb-6 border-t border-neutral-100 pt-4 text-xs text-neutral-600 leading-relaxed bg-neutral-50/50">
              <span className="font-bold text-neutral-800 mr-2">Giới thiệu:</span>
              {profile.bio}
            </div>
          )}
        </div>

        {inviteSuccessToast && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 font-bold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Đã gửi lời mời giao việc thành công tới {profile.displayName}! Tasker sẽ phản hồi bạn qua tin nhắn trong ít phút.
            </span>
          </div>
        )}

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
            <div className="text-xs text-neutral-500 font-medium">Nhiệm vụ Hoàn thành</div>
            <div className="text-2xl font-black text-[#222325] mt-1">{profile.tasksCompleted} Tasks</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Tỷ lệ thành công 100%</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
            <div className="text-xs text-neutral-500 font-medium">Giao hàng đúng hạn SLA</div>
            <div className="text-2xl font-black text-sky-700 mt-1">99.2%</div>
            <div className="text-[11px] text-sky-600 font-semibold mt-1">Cam kết đúng deadline</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
            <div className="text-xs text-neutral-500 font-medium">Tốc độ phản hồi trung bình</div>
            <div className="text-2xl font-black text-indigo-700 mt-1">&lt; 15 Phút</div>
            <div className="text-[11px] text-neutral-500 mt-1">Thường trực hỗ trợ</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
            <div className="text-xs text-neutral-500 font-medium">Bảo chứng Ký quỹ Escrow</div>
            <div className="text-2xl font-black text-amber-600 mt-1">100% An toàn</div>
            <div className="text-[11px] text-neutral-500 mt-1">0 rủi ro quỵt tiền</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-1.5 flex items-center gap-1 text-xs font-bold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('PORTFOLIO')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'PORTFOLIO'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Dự án &amp; Portfolio Mẫu ({MOCK_PORTFOLIO_PROJECTS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SKILLS')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'SKILLS'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Kỹ năng &amp; Chứng chỉ ({MOCK_VERIFIED_SKILLS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('REVIEWS')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'REVIEWS'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Đánh giá từ Khách hàng ({MOCK_STUDENT_REVIEWS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('EDUCATION')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'EDUCATION'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Học vấn &amp; Thành tích</span>
          </button>
        </div>

        {/* TAB CONTENT 1: PORTFOLIO SHOWCASE */}
        {activeTab === 'PORTFOLIO' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_PORTFOLIO_PROJECTS.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                {/* Project Image */}
                <div className="h-48 bg-neutral-100 overflow-hidden relative">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                    {project.category}
                  </span>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-amber-600 text-xs font-bold flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{project.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Project Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-[#222325] leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tags.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg bg-neutral-100 text-neutral-700 text-[11px] font-semibold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Footer Meta */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                      {project.clientUniversity}
                    </span>
                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-neutral-700 hover:text-black font-semibold flex items-center gap-1"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Mã nguồn</span>
                        </a>
                      )}
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Xem mẫu</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB CONTENT 2: VERIFIED SKILLS */}
        {activeTab === 'SKILLS' && (
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-black text-[#222325]">
                Hệ thống Kỹ năng &amp; Năng lực được Kiểm duyệt
              </h2>
              <p className="text-xs text-[#62646a] mt-0.5">
                Các kỹ năng đã được bảo chứng qua các Order hoàn thành thực tế và được Staff kiểm định bài nộp.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_VERIFIED_SKILLS.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/60 hover:bg-white hover:border-emerald-500/80 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="font-extrabold text-sm text-[#222325]">{skill.name}</div>
                    {skill.endorsedByStaff && (
                      <span className="p-1 rounded-full bg-emerald-100 text-emerald-700" title="Đã được Staff kiểm duyệt bài nộp">
                        <BadgeCheck className="w-4 h-4 text-emerald-600" />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                      Cấp độ: {skill.level}
                    </span>
                    <span className="font-medium text-[11px]">
                      {skill.verifiedCount} Task đã hoàn thành
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Academic Integrity Pledge Box */}
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong className="block font-bold">Cam kết minh bạch học thuật:</strong>
                Tất cả các sản phẩm do Tasker thực hiện đều tuân thủ Quy chuẩn Liêm chính Học thuật VIETVI: hỗ trợ giải thích, định dạng tài liệu, hỗ trợ lập trình mẫu và không tham gia thi hộ hoặc gian lận học phần.
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 3: CLIENT REVIEWS */}
        {activeTab === 'REVIEWS' && (
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
              <div>
                <h2 className="text-lg font-black text-[#222325]">Đánh giá 360° từ Người Thuê</h2>
                <p className="text-xs text-[#62646a]">
                  100% đánh giá đến từ các Order đã thanh toán và nghiệm thu qua Escrow.
                </p>
              </div>

              {/* Rating score badge */}
              <div className="flex items-center gap-4 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                <div className="text-3xl font-black text-amber-500">{profile.rating.toFixed(2)}</div>
                <div className="text-xs">
                  <div className="flex text-amber-400">
                    {'★'.repeat(5)}
                  </div>
                  <span className="text-neutral-500 font-medium">{profile.reviewCount} lượt đánh giá xuất sắc</span>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {MOCK_STUDENT_REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl border border-neutral-200/80 bg-neutral-50/40 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-full ${rev.reviewer.avatarBg} text-white font-bold text-xs flex items-center justify-center`}
                      >
                        {rev.reviewer.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-[#222325] flex items-center gap-1.5">
                          <span>{rev.reviewer.displayName}</span>
                          <span className="text-[10px] text-neutral-400 font-normal">
                            ({rev.reviewer.university})
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-500 font-medium">
                          Task: {rev.taskTitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{rev.overallRating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                    "{rev.comment}"
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rev.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-600 text-[10px] font-semibold"
                      >
                        ✓ {t}
                      </span>
                    ))}
                  </div>

                  {rev.response && (
                    <div className="p-3 rounded-xl bg-white border border-emerald-100 text-xs text-neutral-600 ml-4">
                      <strong className="text-emerald-700 font-bold block mb-1">
                        Phản hồi từ {profile.displayName}:
                      </strong>
                      {rev.response}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT 4: EDUCATION & CREDENTIALS */}
        {activeTab === 'EDUCATION' && (
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-black text-[#222325]">Học vấn, Bằng cấp &amp; Chứng chỉ</h2>
              <p className="text-xs text-[#62646a]">
                Thông tin sinh viên chính quy được xác thực qua email trường .edu.vn và thẻ sinh viên.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: University Info */}
              <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#222325]">{profile.university}</h3>
                    <p className="text-xs text-neutral-500">{profile.major}</p>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-neutral-600 pt-2 border-t border-neutral-200/80">
                  <div className="flex justify-between">
                    <span>Niên khóa:</span>
                    <strong className="text-neutral-800">2022 - 2026 (Năm 4)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Mã sinh viên (MSSV):</span>
                    <strong className="font-mono text-neutral-800">{profile.studentId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Điểm tích lũy CPA:</span>
                    <strong className="text-emerald-700 font-bold">3.65 / 4.0 (Giỏi)</strong>
                  </div>
                </div>
              </div>

              {/* Box 2: English & Academic Certifications */}
              <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#222325]">Chứng chỉ &amp; Giải thưởng</h3>
                    <p className="text-xs text-neutral-500">Đã đối soát hồ sơ gốc</p>
                  </div>
                </div>

                <div className="text-xs space-y-2 text-neutral-600 pt-2 border-t border-neutral-200/80">
                  <div className="flex items-center justify-between">
                    <span>Chứng chỉ IELTS Academic:</span>
                    <strong className="text-indigo-700 font-bold">Band 7.5 (2025)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Giải Ba Nghiên cứu Khoa học SV:</span>
                    <strong className="text-neutral-800">Cấp Trường HUST 2025</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Học bổng Khuyến khích Học tập:</span>
                    <strong className="text-neutral-800">Loại Xuất sắc K67</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Direct Hire / Invite to Task */}
        {isInviteModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsInviteModalOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5 animate-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-[#222325]">
                      Mời Giao việc Trực tiếp
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Gửi đề xuất Task trực tiếp cho {profile.displayName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Tiêu đề Task cần thực hiện *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Viết script Python crawl dữ liệu, Làm slide thuyết trình Canva..."
                    value={inviteTaskTitle}
                    onChange={(e) => setInviteTaskTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Ngân sách đề xuất (VND) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100000}
                      step={50000}
                      value={inviteBudget}
                      onChange={(e) => setInviteBudget(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Thời hạn hoàn thành
                    </label>
                    <input
                      type="text"
                      defaultValue="3 ngày"
                      className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Lời nhắn &amp; Yêu cầu cụ thể
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả ngắn gọn output bạn mong đợi và tài liệu đã có..."
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Khoản thù lao sẽ được bảo chứng an toàn qua Escrow khi bạn và Tasker đồng ý ký hợp đồng. 0% phí sàn cho sinh viên.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-xs cursor-pointer"
                  >
                    Gửi lời mời ngay
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
