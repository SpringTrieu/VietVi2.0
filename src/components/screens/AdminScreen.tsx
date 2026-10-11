import React, { useState } from 'react';
import {
  VerificationRequest,
  ReportItem,
  TaskCategory,
  DisputeItem,
  StaffMember,
  AuditLogEntry,
  PlatformConfig,
  ActiveScreen,
} from '../../types';
import {
  MOCK_VERIFICATIONS,
  MOCK_REPORTS,
  CATEGORIES,
  MOCK_DISPUTES,
  MOCK_STAFF_MEMBERS,
  MOCK_AUDIT_LOGS,
  DEFAULT_PLATFORM_CONFIG,
} from '../../data/mockData';
import {
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  FileText,
  Activity,
  Users,
  Grid,
  Lock,
  Unlock,
  History,
  Plus,
  Sliders,
  DollarSign,
  Headphones,
  Scale,
  UserX,
  UserCheck,
  Sparkles,
  Zap,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Settings,
  Eye,
  RefreshCw,
} from 'lucide-react';

export interface AdminScreenProps {
  verifications?: VerificationRequest[];
  onApproveVerification?: (id: string, notes?: string) => void;
  onRejectVerification?: (id: string, reason: string) => void;

  disputes?: DisputeItem[];
  onFinalRulingDispute?: (
    disputeId: string,
    decision: 'REFUND_REQUESTER' | 'PAYOUT_TASKER' | 'CUSTOM_SPLIT' | 'PLATFORM_COMPENSATE',
    adminRulingNote: string,
    splitPercentRequester?: number
  ) => void;

  reports?: ReportItem[];
  onConfirmBanUser?: (reportId: string, userId: string, reason: string) => void;
  onPardonUser?: (reportId: string, reason: string) => void;

  categories?: TaskCategory[];
  onAddCategory?: (newCategory: TaskCategory) => void;
  onToggleCategoryStatus?: (categoryId: string) => void;

  staffMembers?: StaffMember[];
  onUpdateStaffShift?: (staffId: string, newShift: string, newStatus: 'ONLINE' | 'AWAY' | 'OFFLINE') => void;

  auditLogs?: AuditLogEntry[];
  onAddAuditLog?: (entry: AuditLogEntry) => void;

  platformConfig?: PlatformConfig;
  onUpdatePlatformConfig?: (newConfig: Partial<PlatformConfig>) => void;

  onNavigateToScreen?: (screen: ActiveScreen) => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  verifications = MOCK_VERIFICATIONS,
  onApproveVerification,
  onRejectVerification,
  disputes = MOCK_DISPUTES,
  onFinalRulingDispute,
  reports = MOCK_REPORTS,
  onConfirmBanUser,
  onPardonUser,
  categories = CATEGORIES,
  onAddCategory,
  onToggleCategoryStatus,
  staffMembers = MOCK_STAFF_MEMBERS,
  onUpdateStaffShift,
  auditLogs = MOCK_AUDIT_LOGS,
  onAddAuditLog,
  platformConfig = DEFAULT_PLATFORM_CONFIG,
  onUpdatePlatformConfig,
  onNavigateToScreen,
}) => {
  // Navigation tabs in Admin
  const [activeQueue, setActiveQueue] = useState<
    'ESCALATED_DISPUTES' | 'BAN_REVIEWS' | 'STAFF_MONITOR' | 'PLATFORM_ECONOMICS' | 'CATEGORIES' | 'USERS' | 'AUDIT_LOGS'
  >('ESCALATED_DISPUTES');

  const [feedback, setFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Local state for interactive modals / forms
  const [selectedDisputeForRuling, setSelectedDisputeForRuling] = useState<DisputeItem | null>(null);
  const [rulingDecision, setRulingDecision] = useState<
    'REFUND_REQUESTER' | 'PAYOUT_TASKER' | 'CUSTOM_SPLIT' | 'PLATFORM_COMPENSATE'
  >('CUSTOM_SPLIT');
  const [rulingNote, setRulingNote] = useState<string>('');
  const [customSplitRequesterPercent, setCustomSplitRequesterPercent] = useState<number>(50);

  // User management state
  const [usersList, setUsersList] = useState([
    {
      id: 'usr-101',
      name: 'Minh Hằng',
      email: 'hang.nm@ftu.edu.vn',
      uni: 'ĐH Ngoại Thương',
      role: 'STUDENT',
      status: 'ACTIVE',
      tasksCount: 9,
      violationCount: 0,
    },
    {
      id: 'usr-102',
      name: 'Tuấn Khoa',
      email: 'khoa.tt@sis.hust.edu.vn',
      uni: 'ĐH Bách Khoa',
      role: 'STUDENT',
      status: 'ACTIVE',
      tasksCount: 5,
      violationCount: 0,
    },
    {
      id: 'usr-199',
      name: 'Nguyễn Văn Hùng',
      email: 'hung.nv@hnue.edu.vn',
      uni: 'ĐH Sư Phạm',
      role: 'STUDENT',
      status: 'UNDER_REVIEW',
      tasksCount: 1,
      violationCount: 1,
    },
    {
      id: 'usr-spam-77',
      name: 'Trần Văn Giả (Tài khoản lừa cọc)',
      email: 'fake.scam@gmail.com',
      uni: 'Chưa xác thực',
      role: 'STUDENT',
      status: 'FLAGGED_BY_STAFF',
      tasksCount: 2,
      violationCount: 3,
    },
  ]);

  // Category creation form
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  // Platform Economics form state
  const [currentFee, setCurrentFee] = useState<number>(platformConfig.platformFeePercent);
  const [currentMinWithdraw, setCurrentMinWithdraw] = useState<number>(platformConfig.minWithdrawalVND);
  const [currentEscrowTimeout, setCurrentEscrowTimeout] = useState<number>(platformConfig.autoEscrowReleaseHours);
  const [isMaintenance, setIsMaintenance] = useState<boolean>(platformConfig.maintenanceMode);

  // Audit filter state
  const [auditFilterActor, setAuditFilterActor] = useState<'ALL' | 'STAFF' | 'ADMIN' | 'SYSTEM'>('ALL');

  // Filtered queries
  const escalatedDisputes = disputes.filter(
    (d) => d.status === 'ESCALATED_TO_ADMIN' || (d.amount >= 1000000 && d.status !== 'RESOLVED_PAYOUT' && d.status !== 'RESOLVED_REFUND' && d.status !== 'RESOLVED_SPLIT')
  );

  const banRecommendations = reports.filter(
    (r) => r.status === 'ESCALATED_TO_ADMIN' || r.actionTaken === 'SUSPEND_REQUESTED'
  );

  // Handle Supreme Ruling
  const handleConfirmSupremeRuling = () => {
    if (!selectedDisputeForRuling) return;

    if (onFinalRulingDispute) {
      onFinalRulingDispute(
        selectedDisputeForRuling.id,
        rulingDecision,
        rulingNote || 'Đã xem xét biên bản hòa giải của Chuyên viên Staff và ra Phán quyết Chung thẩm Tối cao.',
        customSplitRequesterPercent
      );
    }

    // Add audit entry
    const entry: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      actor: 'SuperAdmin_Hoang',
      actorRole: 'ADMIN',
      action: 'SUPREME_ARBITRATION_RULING',
      target: `Tranh chấp #${selectedDisputeForRuling.id} (${selectedDisputeForRuling.taskTitle})`,
      timestamp: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN'),
      status: 'CRITICAL',
      details: `Phán quyết tối cao: ${rulingDecision}. Ghi chú: ${rulingNote}`,
    };
    if (onAddAuditLog) onAddAuditLog(entry);

    showToast(`Đã ban hành Phán quyết Chung thẩm cho Tranh chấp #${selectedDisputeForRuling.id}!`);
    setSelectedDisputeForRuling(null);
    setRulingNote('');
  };

  // Handle Ban confirmation
  const handleExecuteBan = (report: ReportItem) => {
    if (onConfirmBanUser) {
      onConfirmBanUser(report.id, report.targetId, report.reason);
    }
    setUsersList((prev) =>
      prev.map((u) => (u.id === report.targetId ? { ...u, status: 'BANNED_PERMANENT' } : u))
    );

    const entry: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      actor: 'SuperAdmin_Hoang',
      actorRole: 'ADMIN',
      action: 'PERMANENT_BAN_CONFIRMED',
      target: `User #${report.targetId}`,
      timestamp: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN'),
      status: 'CRITICAL',
      details: `Phê duyệt đề xuất khóa vĩnh viễn từ Staff. Lý do: ${report.reason}`,
    };
    if (onAddAuditLog) onAddAuditLog(entry);

    showToast(`Đã xác nhận Khóa tài khoản vĩnh viễn đối với #${report.targetId}!`);
  };

  const handlePardon = (report: ReportItem) => {
    if (onPardonUser) {
      onPardonUser(report.id, 'Hạ mức phạt xuống cảnh cáo nhắc nhở');
    }
    setUsersList((prev) =>
      prev.map((u) => (u.id === report.targetId ? { ...u, status: 'ACTIVE', violationCount: u.violationCount + 1 } : u))
    );

    const entry: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      actor: 'SuperAdmin_Hoang',
      actorRole: 'ADMIN',
      action: 'PARDON_USER_WARNING',
      target: `User #${report.targetId}`,
      timestamp: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN'),
      status: 'WARNING',
      details: `Ân xá khóa vĩnh viễn, chuyển sang phạt cảnh cáo nội bộ.`,
    };
    if (onAddAuditLog) onAddAuditLog(entry);

    showToast(`Đã ân xá và chuyển thành Cảnh cáo cấp 2 đối với #${report.targetId}!`);
  };

  // Handle category creation
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: TaskCategory = {
      id: `cat-${Date.now().toString().slice(-4)}`,
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      iconName: 'Grid',
      taskCount: 0,
      description: newCatDesc || 'Danh mục chuyên môn mới do Quản trị viên khởi tạo.',
    };

    if (onAddCategory) onAddCategory(newCat);

    const entry: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      actor: 'SuperAdmin_Hoang',
      actorRole: 'ADMIN',
      action: 'CREATE_SYSTEM_CATEGORY',
      target: `Danh mục: ${newCat.name}`,
      timestamp: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN'),
      status: 'SUCCESS',
      details: `Khởi tạo danh mục mới cho toàn bộ sinh viên trên nền tảng.`,
    };
    if (onAddAuditLog) onAddAuditLog(entry);

    setNewCatName('');
    setNewCatDesc('');
    setShowAddCat(false);
    showToast(`Đã tạo mới danh mục hệ thống: "${newCat.name}"!`);
  };

  // Handle Save Platform Economics
  const handleSaveEconomics = () => {
    if (onUpdatePlatformConfig) {
      onUpdatePlatformConfig({
        platformFeePercent: currentFee,
        minWithdrawalVND: currentMinWithdraw,
        autoEscrowReleaseHours: currentEscrowTimeout,
        maintenanceMode: isMaintenance,
      });
    }

    const entry: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      actor: 'SuperAdmin_Hoang',
      actorRole: 'ADMIN',
      action: 'UPDATE_PLATFORM_CONFIG',
      target: `Chính sách sàn & Kinh tế nền tảng`,
      timestamp: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN'),
      status: 'WARNING',
      details: `Phí sàn: ${currentFee}%, Hạn mức rút: ${currentMinWithdraw.toLocaleString('vi-VN')} đ, Escrow Timeout: ${currentEscrowTimeout}h`,
    };
    if (onAddAuditLog) onAddAuditLog(entry);

    showToast('Đã lưu cấu hình kinh tế và chính sách sàn VIETVI!');
  };

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditFilterActor === 'ALL') return true;
    return log.actorRole === auditFilterActor;
  });

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-16 right-4 z-50 bg-purple-950 text-white px-4 py-3 rounded-2xl text-xs font-semibold shadow-xl border border-purple-800 animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Admin Executive Header */}
      <div className="bg-gradient-to-r from-purple-950 via-neutral-900 to-neutral-950 text-white rounded-3xl p-6 sm:p-8 border border-purple-900/60 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Hội đồng Quản trị viên Cấp cao (Super Admin Governance)</span>
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs font-mono text-purple-200">
              Quyền hạn tối cao: <strong>SUPER_ADMIN_TIER_1</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Trung tâm Điều hành &amp; Giám sát Toàn diện VIETVI
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl">
            Phân cấp thẩm quyền rõ ràng với Staff: Admin phụ trách Phán quyết Chung thẩm các vụ tranh chấp lớn, Phê duyệt khóa tài khoản vi phạm do Staff chuyển lên, Giám sát KPI đội ngũ Staff, Quản lý danh mục và Thiết lập chính sách kinh tế sàn.
          </p>
        </div>

        {/* Quick Link to Staff Screen for inspection */}
        {onNavigateToScreen && (
          <div className="shrink-0 flex flex-col gap-2">
            <button
              onClick={() => onNavigateToScreen('STAFF')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white rounded-xl text-xs font-bold border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Headphones className="w-4 h-4 text-indigo-400" />
              <span>Xem Bàn làm việc Staff</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
            <span className="text-[11px] text-purple-300/80 text-center font-mono">
              3 Nhân viên đang trực ca
            </span>
          </div>
        )}
      </div>

      {/* 4 Governance KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#62646a] mb-2 font-medium">
            <span>Tranh chấp Cấp cao chờ duyệt</span>
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <Scale className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-rose-700">{escalatedDisputes.length} vụ việc</div>
          <p className="text-[11px] text-neutral-500 font-medium mt-1">
            Được Staff chuyển cấp &gt; 1.000.000 đ
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#62646a] mb-2 font-medium">
            <span>Đề xuất Khóa tài khoản</span>
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <UserX className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{banRecommendations.length} hồ sơ</div>
          <p className="text-[11px] text-neutral-500 font-medium mt-1">
            Chờ Super Admin phê duyệt lệnh cấm
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#62646a] mb-2 font-medium">
            <span>Đội ngũ Chuyên viên Staff</span>
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Headphones className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-[#222325]">{staffMembers.length} chuyên viên</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            CSAT trung bình: 4.95 / 5.0 ★
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#62646a] mb-2 font-medium">
            <span>Phí sàn hiện tại (Escrow)</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">0% (Miễn phí)</div>
          <p className="text-[11px] text-neutral-500 font-medium mt-1">
            Chính sách bảo trợ sinh viên MVP
          </p>
        </div>
      </div>

      {/* Admin Queue Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-neutral-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-semibold shadow-xs">
        <button
          onClick={() => setActiveQueue('ESCALATED_DISPUTES')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeQueue === 'ESCALATED_DISPUTES'
              ? 'bg-purple-700 text-white font-bold shadow-xs'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>1. Tranh chấp Chung thẩm</span>
          {escalatedDisputes.length > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeQueue === 'ESCALATED_DISPUTES'
                  ? 'bg-purple-950 text-purple-200'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {escalatedDisputes.length} ca
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveQueue('BAN_REVIEWS')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeQueue === 'BAN_REVIEWS'
              ? 'bg-purple-700 text-white font-bold shadow-xs'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          <UserX className="w-4 h-4" />
          <span>2. Phê duyệt Khóa Tài khoản</span>
          {banRecommendations.length > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeQueue === 'BAN_REVIEWS'
                  ? 'bg-purple-950 text-purple-200'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {banRecommendations.length} chờ
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveQueue('STAFF_MONITOR')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeQueue === 'STAFF_MONITOR'
              ? 'bg-purple-700 text-white font-bold shadow-xs'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>3. Quản lý Đội ngũ Staff &amp; SLA</span>
        </button>

        <button
          onClick={() => setActiveQueue('PLATFORM_ECONOMICS')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeQueue === 'PLATFORM_ECONOMICS'
              ? 'bg-purple-700 text-white font-bold shadow-xs'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>4. Chính sách Sàn &amp; Phí Escrow</span>
        </button>

        <button
          onClick={() => setActiveQueue('CATEGORIES')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeQueue === 'CATEGORIES'
              ? 'bg-purple-700 text-white font-bold shadow-xs'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>5. Danh mục Hệ thống</span>
        </button>

        <button
          onClick={() => setActiveQueue('USERS')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeQueue === 'USERS'
              ? 'bg-purple-700 text-white font-bold shadow-xs'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>6. Danh bạ &amp; Phân quyền User</span>
        </button>

        <button
          onClick={() => setActiveQueue('AUDIT_LOGS')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeQueue === 'AUDIT_LOGS'
              ? 'bg-purple-700 text-white font-bold shadow-xs'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>7. Nhật ký Kiểm toán (Audit Logs)</span>
        </button>
      </div>

      {/* QUEUE 1: ESCALATED DISPUTES (CHUNG THẨM TỐI CAO) */}
      {activeQueue === 'ESCALATED_DISPUTES' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold">Thẩm quyền Chung thẩm của Quản trị viên:</span> Đây là các vụ tranh chấp vượt quá hạn mức sơ thẩm của Staff (&gt; 1.000.000 đ) hoặc hai bên không chấp thuận phương án hòa giải của Staff. Phán quyết của Quản trị viên là tối cao, lệnh giải ngân/hoàn tiền được thi hành ngay lập tức.
            </div>
            <span className="font-bold text-purple-800 shrink-0">BR-07 / Section 10.2</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {escalatedDisputes.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-neutral-200 text-center text-xs text-neutral-500">
                Hiện không có vụ tranh chấp nào cần chuyển cấp lên Admin. Đội ngũ Staff đang kiểm soát tốt các ca sơ thẩm.
              </div>
            ) : (
              escalatedDisputes.map((dsp) => (
                <div
                  key={dsp.id}
                  className="bg-white rounded-3xl p-6 border-2 border-purple-200/80 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-mono font-bold text-xs border border-purple-300">
                        Chuyển cấp: {dsp.id}
                      </span>
                      <span className="text-xs text-neutral-400">·</span>
                      <span className="text-xs font-semibold text-[#62646a]">
                        Mã đơn: <strong>{dsp.orderId}</strong>
                      </span>
                      {dsp.handledByStaff && (
                        <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">
                          Staff bàn giao: {dsp.handledByStaff}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">Ký quỹ đang đóng băng:</span>
                      <span className="text-lg font-extrabold text-purple-900 font-mono">
                        {dsp.amount.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#222325]">{dsp.taskTitle}</h3>
                    <div className="mt-2 p-3 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-rose-900 space-y-1">
                      <span className="font-bold">Lý do Staff chuyển cấp lên Admin: </span>
                      <p className="italic">{dsp.escalatedReason || dsp.reason}</p>
                    </div>
                  </div>

                  {/* 2 Parties Detail Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                        Bên khiếu nại (Claimant):
                      </span>
                      <div className="font-bold text-[#222325]">{dsp.claimant.displayName}</div>
                      <div className="text-neutral-500 text-[11px]">{dsp.claimant.university}</div>
                      <div className="text-blue-700 font-semibold mt-1">
                        Vai trò: {dsp.claimantRole === 'REQUESTER' ? 'Người yêu cầu (Thuê)' : 'Người thực hiện'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                      <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                        Bên bị khiếu nại (Defendant):
                      </span>
                      <div className="font-bold text-[#222325]">{dsp.defendant.displayName}</div>
                      <div className="text-neutral-500 text-[11px]">{dsp.defendant.university}</div>
                      <div className="text-neutral-700 font-semibold mt-1">
                        Vai trò: {dsp.claimantRole === 'REQUESTER' ? 'Người thực hiện' : 'Người yêu cầu'}
                      </div>
                    </div>
                  </div>

                  {/* Admin Supreme Action Button */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-500">
                      Thời điểm mở: <strong>{dsp.createdAt}</strong>
                    </span>

                    <button
                      onClick={() => {
                        setSelectedDisputeForRuling(dsp);
                        setRulingDecision('CUSTOM_SPLIT');
                      }}
                      className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Mở Phiên Chung thẩm &amp; Phán quyết Tối cao</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* QUEUE 2: BAN REVIEWS & SEVERE VIOLATIONS */}
      {activeQueue === 'BAN_REVIEWS' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
            <span>
              <strong>Phê duyệt Khóa tài khoản vĩnh viễn (Super Admin Authority):</strong> Nhân viên Staff chỉ có quyền sơ lọc và gửi đề xuất. Quyết định cấm tài khoản vĩnh viễn và xử lý dòng tiền tồn đọng thuộc thẩm quyền duy nhất của Quản trị viên.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {banRecommendations.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-neutral-200 text-center text-xs text-neutral-500">
                Hiện không có hồ sơ nào bị Staff đề xuất khóa tài khoản.
              </div>
            ) : (
              banRecommendations.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                        Mã báo cáo: #{rep.id}
                      </span>
                      <span className="text-xs text-neutral-400">·</span>
                      <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Đề xuất từ: {rep.handledByStaff || 'Chuyên viên Staff'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#222325]">
                      Đối tượng vi phạm: <span className="font-mono text-rose-700">{rep.targetId}</span> ({rep.targetTitle || 'Tài khoản'})
                    </h4>

                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs text-neutral-700 space-y-1">
                      <div>
                        <strong>Hành vi vi phạm: </strong>
                        <span className="italic">{rep.reason}</span>
                      </div>
                      {rep.staffNote && (
                        <div className="text-indigo-700 font-medium pt-1">
                          <strong>Biên bản Staff: </strong>
                          {rep.staffNote}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handlePardon(rep)}
                      className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Bác bỏ / Ân xá
                    </button>
                    <button
                      onClick={() => handleExecuteBan(rep)}
                      className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Xác nhận Khóa vĩnh viễn</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* QUEUE 3: STAFF MONITORING & SLA KPI */}
      {activeQueue === 'STAFF_MONITOR' && (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 text-xs text-indigo-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold">Bảng Điều phối &amp; Giám sát Chuyên viên Staff:</span> Theo dõi hiệu suất thời gian thực của từng chuyên viên vận hành trong ca trực: Số hồ sơ KYC đã duyệt, số vụ hòa giải thành công và điểm hài lòng CSAT từ sinh viên.
            </div>
            <span className="font-bold text-indigo-800 shrink-0">Cam kết SLA &lt; 15 phút</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {staffMembers.map((stf) => (
              <div
                key={stf.id}
                className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl ${stf.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs`}
                    >
                      {stf.name.split(' ').pop()?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#222325]">{stf.name}</h4>
                      <span className="text-[11px] font-mono text-neutral-500 font-bold">{stf.staffCode}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      stf.status === 'ONLINE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : stf.status === 'AWAY'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {stf.status === 'ONLINE' ? '🟢 Đang trực' : stf.status === 'AWAY' ? '🟡 Tạm nghỉ' : '🔴 Vắng ca'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Ca phân bổ:</span>
                    <strong className="text-[#222325]">{stf.shift}</strong>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Hồ sơ KYC đã duyệt hôm nay:</span>
                    <strong className="text-indigo-700 font-mono">{stf.todayVerifiedCount} hồ sơ</strong>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Vụ hòa giải tranh chấp:</span>
                    <strong className="text-purple-700 font-mono">{stf.todayDisputesCount} ca</strong>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Ticket CSKH đã xử lý:</span>
                    <strong className="text-teal-700 font-mono">{stf.todayTicketsCount} ticket</strong>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Thời gian phản hồi TB:</span>
                    <strong className="text-[#222325] font-mono">⏱️ {stf.avgResolutionMinutes} phút</strong>
                  </div>
                  <div className="flex justify-between text-neutral-600 pt-2 border-t border-neutral-100">
                    <span className="font-semibold">Điểm CSAT đánh giá:</span>
                    <span className="font-bold text-amber-600">★ {stf.csatRating} / 5.0</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      if (onUpdateStaffShift) {
                        const nextStatus = stf.status === 'ONLINE' ? 'AWAY' : 'ONLINE';
                        onUpdateStaffShift(stf.id, stf.shift, nextStatus);
                      }
                      showToast(`Đã cập nhật trạng thái làm việc cho ${stf.name}!`);
                    }}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Đổi trạng thái ca
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUEUE 4: PLATFORM ECONOMICS & POLICY CONFIG */}
      {activeQueue === 'PLATFORM_ECONOMICS' && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <span>
              <strong>Cấu hình Kinh tế Sàn &amp; Quỹ Bảo chứng Escrow:</strong> Thiết lập tỷ lệ phí hoa hồng, hạn mức rút tiền và thời gian giải ngân tự động bảo vệ sinh viên theo Hiến chương An toàn VIETVI.
            </span>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs space-y-6 max-w-3xl">
            <h3 className="text-base font-bold text-[#222325] pb-3 border-b border-neutral-100">
              Thông số Chính sách Nền tảng
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="font-bold text-[#222325] block mb-1.5">
                  Tỷ lệ Phí Sàn (Platform Commission Fee %):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    step="0.5"
                    value={currentFee}
                    onChange={(e) => setCurrentFee(Number(e.target.value))}
                    className="w-24 p-2.5 rounded-xl border border-neutral-200 font-mono font-bold text-center"
                  />
                  <span className="text-neutral-500 font-bold">%</span>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md font-semibold">
                    (Giai đoạn MVP khuyến nghị 0%)
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#222325] block mb-1.5">
                  Hạn mức Rút tiền Tối thiểu (VND):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="10000"
                    min="10000"
                    value={currentMinWithdraw}
                    onChange={(e) => setCurrentMinWithdraw(Number(e.target.value))}
                    className="w-36 p-2.5 rounded-xl border border-neutral-200 font-mono font-bold text-right"
                  />
                  <span className="text-neutral-500">VNĐ</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#222325] block mb-1.5">
                  Thời hạn Tự động Giải ngân Escrow:
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={currentEscrowTimeout}
                    onChange={(e) => setCurrentEscrowTimeout(Number(e.target.value))}
                    className="p-2.5 rounded-xl border border-neutral-200 bg-white font-semibold cursor-pointer"
                  >
                    <option value={48}>48 giờ (Mặc định)</option>
                    <option value={72}>72 giờ (Cuối tuần &amp; Đồ án dài)</option>
                    <option value={24}>24 giờ (Khẩn cấp)</option>
                  </select>
                  <span className="text-[11px] text-neutral-500">nếu Requester không phản hồi</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#222325] block mb-1.5">
                  Chế độ Bảo trì Hệ thống (Maintenance Mode):
                </label>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => setIsMaintenance(!isMaintenance)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      isMaintenance
                        ? 'bg-rose-700 text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    {isMaintenance ? '🔴 Đang bật Bảo trì' : '🟢 Hệ thống Hoạt động 24/7'}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-end">
              <button
                onClick={handleSaveEconomics}
                className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Settings className="w-4 h-4" />
                <span>Lưu &amp; Áp dụng Toàn Sàn</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUEUE 5: SYSTEM CATEGORIES MANAGEMENT */}
      {activeQueue === 'CATEGORIES' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-[#62646a]">
              Quản lý danh mục công việc chuyên môn cho sinh viên toàn sàn. Chỉ Admin mới có quyền thêm/sửa/tắt danh mục.
            </p>
            <button
              onClick={() => setShowAddCat(!showAddCat)}
              className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-colors flex items-center gap-1.5 self-start cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm danh mục mới</span>
            </button>
          </div>

          {showAddCat && (
            <form
              onSubmit={handleCreateCategory}
              className="bg-white p-5 rounded-2xl border border-purple-200 space-y-3 animate-in fade-in text-xs shadow-xs"
            >
              <h4 className="font-bold text-[#222325]">Khởi tạo danh mục chuyên môn mới</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 mb-1 font-semibold">Tên danh mục:</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="VD: Gia sư & Ôn thi đại cương"
                    className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-hidden focus:border-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-semibold">Mô tả ngắn gọn:</label>
                  <input
                    type="text"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="VD: Hỗ trợ phương pháp giải tích, đại số tuyến tính..."
                    className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-hidden focus:border-purple-600"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCat(false)}
                  className="px-3 py-1.5 rounded-xl text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer"
                >
                  Tạo danh mục
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                    <span className="font-mono font-bold text-neutral-600">{cat.id}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
                      {cat.taskCount} task
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#222325]">{cat.name}</h4>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{cat.description}</p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Đang hiển thị trên sàn
                  </span>
                  <button
                    onClick={() => showToast(`Đã cập nhật trạng thái danh mục "${cat.name}"!`)}
                    className="text-neutral-500 hover:text-purple-700 font-medium cursor-pointer"
                  >
                    Cấu hình
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUEUE 6: USER DIRECTORY & ROLE MANAGEMENT */}
      {activeQueue === 'USERS' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
            <span>
              <strong>Quản lý Người dùng &amp; Phân quyền (RBAC):</strong> Kiểm soát quyền truy cập toàn hệ thống (GUEST / USER / STAFF / ADMIN), khóa hoặc mở khóa tài khoản vi phạm.
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-[#62646a] uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Mã User</th>
                    <th className="py-3 px-4">Họ và tên</th>
                    <th className="py-3 px-4">Email &amp; Trường</th>
                    <th className="py-3 px-4">Vai trò</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Vi phạm</th>
                    <th className="py-3 px-4 text-right">Thao tác Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-neutral-600">{u.id}</td>
                      <td className="py-3 px-4 font-bold text-[#222325]">{u.name}</td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-neutral-600">{u.email}</div>
                        <div className="text-[11px] text-neutral-500">{u.uni}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-neutral-100 text-neutral-800">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {u.status === 'ACTIVE' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                            Hoạt động
                          </span>
                        )}
                        {u.status === 'FLAGGED_BY_STAFF' && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                            Staff đề xuất cấm
                          </span>
                        )}
                        {u.status === 'UNDER_REVIEW' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                            Đang xem xét
                          </span>
                        )}
                        {u.status === 'BANNED_PERMANENT' && (
                          <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-white font-bold">
                            Đã khóa vĩnh viễn
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {u.violationCount > 0 ? (
                          <span className="text-rose-700 font-bold">{u.violationCount} lần</span>
                        ) : (
                          <span className="text-neutral-400">0</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.status === 'BANNED_PERMANENT' ? (
                            <button
                              onClick={() => {
                                setUsersList((prev) =>
                                  prev.map((item) => (item.id === u.id ? { ...item, status: 'ACTIVE' } : item))
                                );
                                showToast(`Đã mở khóa tài khoản cho ${u.name}!`);
                              }}
                              className="px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Mở khóa
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setUsersList((prev) =>
                                  prev.map((item) => (item.id === u.id ? { ...item, status: 'BANNED_PERMANENT' } : item))
                                );
                                showToast(`Đã khóa tài khoản của ${u.name}!`);
                              }}
                              className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Khóa TK
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QUEUE 7: IMMUTABLE AUDIT LOGS (BR-07) */}
      {activeQueue === 'AUDIT_LOGS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3">
            <p className="text-xs text-[#62646a]">
              Nhật ký kiểm toán hệ thống ghi lại mọi hành động nhạy cảm của cả Chuyên viên Staff, Quản trị viên Admin và Hệ thống Escrow tự động nhằm đảm bảo minh bạch tuyệt đối theo chuẩn BR-07.
            </p>

            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-neutral-500">Lọc theo chủ thể:</span>
              <button
                onClick={() => setAuditFilterActor('ALL')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                  auditFilterActor === 'ALL' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setAuditFilterActor('STAFF')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                  auditFilterActor === 'STAFF' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'
                }`}
              >
                Chỉ Staff
              </button>
              <button
                onClick={() => setAuditFilterActor('ADMIN')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                  auditFilterActor === 'ADMIN' ? 'bg-purple-700 text-white' : 'bg-purple-50 text-purple-700'
                }`}
              >
                Chỉ Admin
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-[#62646a] uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Mã Log</th>
                    <th className="py-3 px-4">Chủ thể (Actor)</th>
                    <th className="py-3 px-4">Hành động</th>
                    <th className="py-3 px-4">Mục tiêu tác động</th>
                    <th className="py-3 px-4">Chi tiết nghiệp vụ</th>
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4 text-right">Mức độ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-neutral-600">{log.id}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.actorRole === 'ADMIN'
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : log.actorRole === 'STAFF'
                              ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          {log.actor}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#222325]">{log.action}</td>
                      <td className="py-3 px-4 text-neutral-700">{log.target}</td>
                      <td className="py-3 px-4 text-neutral-500 font-sans text-[11px] max-w-xs truncate">
                        {log.details || '—'}
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[11px] whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'SUCCESS'
                              ? 'bg-emerald-50 text-emerald-700'
                              : log.status === 'WARNING'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SUPREME ARBITRATION RULING */}
      {selectedDisputeForRuling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border-2 border-purple-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-bold text-[#222325]">
                  Phán quyết Chung thẩm Tối cao #{selectedDisputeForRuling.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDisputeForRuling(null)}
                className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 space-y-1">
                <div className="font-bold text-[#222325]">{selectedDisputeForRuling.taskTitle}</div>
                <div className="text-neutral-600 flex items-center justify-between">
                  <span>
                    Ký quỹ Escrow đang bảo hộ:{' '}
                    <strong className="text-purple-900 font-mono text-sm">
                      {selectedDisputeForRuling.amount.toLocaleString('vi-VN')} đ
                    </strong>
                  </span>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    Staff phụ trách: {selectedDisputeForRuling.handledByStaff}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#222325] block mb-2">
                  Lựa chọn Phán quyết Chung thẩm của Quản trị viên:
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      rulingDecision === 'CUSTOM_SPLIT'
                        ? 'bg-purple-50 border-purple-400 shadow-xs'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ruling"
                      checked={rulingDecision === 'CUSTOM_SPLIT'}
                      onChange={() => setRulingDecision('CUSTOM_SPLIT')}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <strong className="text-[#222325] block">
                        1. Phân chia tỷ lệ theo khối lượng hoàn thành thực tế (Custom Split)
                      </strong>
                      <span className="text-neutral-500 text-[11px] block mt-0.5">
                        Xác định % công việc đã hoàn thành để giải ngân tương ứng cho Tasker và hoàn trả phần còn lại cho Requester.
                      </span>

                      {rulingDecision === 'CUSTOM_SPLIT' && (
                        <div className="mt-2 pt-2 border-t border-purple-200/80 flex items-center gap-4">
                          <span className="text-neutral-700 font-semibold">Tỷ lệ hoàn Requester:</span>
                          <input
                            type="range"
                            min="10"
                            max="90"
                            step="5"
                            value={customSplitRequesterPercent}
                            onChange={(e) => setCustomSplitRequesterPercent(Number(e.target.value))}
                            className="flex-1 accent-purple-700"
                          />
                          <span className="font-mono font-bold text-purple-900 bg-white px-2 py-0.5 rounded border border-purple-200">
                            {customSplitRequesterPercent}% ({((selectedDisputeForRuling.amount * customSplitRequesterPercent) / 100).toLocaleString('vi-VN')} đ)
                          </span>
                        </div>
                      )}
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      rulingDecision === 'REFUND_REQUESTER'
                        ? 'bg-blue-50 border-blue-400'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ruling"
                      checked={rulingDecision === 'REFUND_REQUESTER'}
                      onChange={() => setRulingDecision('REFUND_REQUESTER')}
                      className="mt-0.5"
                    />
                    <div>
                      <strong className="text-[#222325] block">
                        2. Hoàn tiền 100% cho Bên thuê (Requester) &amp; Cảnh cáo Tasker
                      </strong>
                      <span className="text-neutral-500 text-[11px]">
                        Xác định Tasker có hành vi gian lận học thuật hoặc nộp file trống/lỗi cố ý.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      rulingDecision === 'PAYOUT_TASKER'
                        ? 'bg-emerald-50 border-emerald-400'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ruling"
                      checked={rulingDecision === 'PAYOUT_TASKER'}
                      onChange={() => setRulingDecision('PAYOUT_TASKER')}
                      className="mt-0.5"
                    />
                    <div>
                      <strong className="text-[#222325] block">
                        3. Giải ngân 100% thù lao cho Người làm (Tasker)
                      </strong>
                      <span className="text-neutral-500 text-[11px]">
                        Xác định Tasker đã hoàn thành đầy đủ Expected Output, Requester gây khó dễ.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      rulingDecision === 'PLATFORM_COMPENSATE'
                        ? 'bg-amber-50 border-amber-400'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ruling"
                      checked={rulingDecision === 'PLATFORM_COMPENSATE'}
                      onChange={() => setRulingDecision('PLATFORM_COMPENSATE')}
                      className="mt-0.5"
                    />
                    <div>
                      <strong className="text-amber-900 block">
                        4. Trợ cấp đặc biệt từ Quỹ bảo trợ VIETVI (Platform Settlement)
                      </strong>
                      <span className="text-neutral-500 text-[11px]">
                        Hòa giải đặc biệt: Giải ngân cho Tasker đồng thời hoàn tiền cho Requester từ quỹ dự phòng rủi ro.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#222325] block mb-1">
                  Biên bản Phán quyết Chung thẩm Tối cao:
                </label>
                <textarea
                  rows={3}
                  value={rulingNote}
                  onChange={(e) => setRulingNote(e.target.value)}
                  placeholder="Ghi rõ căn cứ pháp lý và kết luận của Hội đồng Quản trị viên để lưu vết kiểm toán và thông báo tới cả hai bên..."
                  className="w-full p-3 rounded-xl border border-neutral-200 text-xs focus:outline-hidden focus:border-purple-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                onClick={() => setSelectedDisputeForRuling(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmSupremeRuling}
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Ban hành Phán quyết Chung thẩm</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
