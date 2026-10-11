import React, { useState } from 'react';
import {
  VerificationRequest,
  ReportItem,
  DisputeItem,
  SupportTicketItem,
  TaskItem,
  ActiveScreen,
} from '../../types';
import {
  Headphones,
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Send,
  Eye,
  ArrowUpRight,
  Sparkles,
  Zap,
  Lock,
  RotateCcw,
  UserCheck,
  Building,
  DollarSign,
  AlertOctagon,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface StaffScreenProps {
  verifications: VerificationRequest[];
  onApproveVerification: (id: string, notes?: string) => void;
  onRejectVerification: (id: string, reason: string) => void;
  onRequestResubmitVerification?: (id: string, note: string) => void;

  disputes: DisputeItem[];
  onArbitrateDispute: (
    disputeId: string,
    decision: 'REFUND_REQUESTER' | 'PAYOUT_TASKER' | 'SPLIT_50_50' | 'ESCALATE_TO_ADMIN',
    staffNote: string
  ) => void;

  reports: ReportItem[];
  onModerateReport: (
    reportId: string,
    action: 'DELIST_TASK' | 'WARN_USER' | 'REQUEST_BAN' | 'DISMISS',
    staffNote: string
  ) => void;

  supportTickets: SupportTicketItem[];
  onReplyTicket: (ticketId: string, replyText: string, markResolved?: boolean) => void;

  tasks: TaskItem[];
  onBoostUrgentTask?: (taskId: string) => void;
  onNavigateToScreen: (screen: ActiveScreen) => void;
}

export const StaffScreen: React.FC<StaffScreenProps> = ({
  verifications,
  onApproveVerification,
  onRejectVerification,
  onRequestResubmitVerification,
  disputes,
  onArbitrateDispute,
  reports,
  onModerateReport,
  supportTickets,
  onReplyTicket,
  tasks,
  onBoostUrgentTask,
  onNavigateToScreen,
}) => {
  // Staff Shift State
  const [shiftStatus, setShiftStatus] = useState<'ONLINE' | 'AWAY' | 'OFFLINE'>('ONLINE');
  const [activeQueue, setActiveQueue] = useState<
    'KYC_QUEUE' | 'DISPUTES_QUEUE' | 'REPORTS_QUEUE' | 'TICKETS_QUEUE' | 'EMERGENCY_QUEUE'
  >('KYC_QUEUE');

  // Interactive Modals / Forms
  const [selectedVerifForPreview, setSelectedVerifForPreview] = useState<VerificationRequest | null>(null);
  const [selectedDisputeForAction, setSelectedDisputeForAction] = useState<DisputeItem | null>(null);
  const [arbitrationDecision, setArbitrationDecision] = useState<
    'REFUND_REQUESTER' | 'PAYOUT_TASKER' | 'SPLIT_50_50' | 'ESCALATE_TO_ADMIN'
  >('PAYOUT_TASKER');
  const [arbitrationNote, setArbitrationNote] = useState<string>('');

  // Selected Ticket for Chat Reply
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem>(supportTickets[0] || null);
  const [ticketReplyText, setTicketReplyText] = useState<string>('');

  // Toast feedback
  const [feedback, setFeedback] = useState<string | null>(null);

  const showStaffToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Quick reply macro options for CSKH
  const QUICK_MACROS = [
    'Chào bạn! Số tiền đã được bảo hộ an toàn trong quỹ Escrow của VIETVI.',
    'Để rút tiền về tài khoản ngân hàng, thời gian xử lý qua Napas 24/7 là từ 5 - 15 phút.',
    'Bạn vui lòng chụp rõ 4 góc thẻ sinh viên và không để lóa ánh đèn flash để được duyệt tick xanh nhé!',
    'VIETVI nghiêm cấm giao dịch ngoài sàn. Mọi thỏa thuận ngoài hệ thống sẽ không được bảo hộ Escrow.',
  ];

  const handleApplyMacro = (macro: string) => {
    setTicketReplyText((prev) => (prev ? `${prev} ${macro}` : macro));
  };

  const handleSendTicketReply = (resolveNow: boolean = false) => {
    if (!ticketReplyText.trim() || !selectedTicket) return;
    onReplyTicket(selectedTicket.id, ticketReplyText, resolveNow);
    setTicketReplyText('');
    showStaffToast(
      resolveNow
        ? `Đã phản hồi & Đóng Ticket #${selectedTicket.id} thành công!`
        : `Đã gửi câu trả lời đến ${selectedTicket.studentName}!`
    );
  };

  const handleConfirmArbitration = () => {
    if (!selectedDisputeForAction) return;
    onArbitrateDispute(
      selectedDisputeForAction.id,
      arbitrationDecision,
      arbitrationNote || 'Đã đối chiếu bằng chứng đơn hàng và lịch sử trao đổi của hai bên.'
    );
    showStaffToast(`Đã ra phán quyết cho Tranh chấp #${selectedDisputeForAction.id} thành công!`);
    setSelectedDisputeForAction(null);
    setArbitrationNote('');
  };

  // Filter counters
  const pendingKYCCount = verifications.filter((v) => v.status === 'PENDING').length;
  const activeDisputesCount = disputes.filter(
    (d) => d.status === 'OPEN' || d.status === 'INVESTIGATING'
  ).length;
  const openReportsCount = reports.filter((r) => r.status !== 'RESOLVED').length;
  const openTicketsCount = supportTickets.filter((t) => t.status !== 'RESOLVED').length;
  const urgentTasksCount = tasks.filter(
    (t) => t.status === 'OPEN' && (t.deadline.includes('06/10') || t.deadline.includes('07/10'))
  ).length;

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-16 right-4 z-50 bg-neutral-900 text-white px-4 py-3 rounded-2xl text-xs font-semibold shadow-xl border border-neutral-700 animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Staff Command Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5" />
              <span>Bàn làm việc Chuyên viên Vận hành (Staff Ops Desk)</span>
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs font-semibold text-neutral-600">
              Mã Staff: <strong>STF-NAM-01</strong> (Lê Hoàng Nam)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
            Trung tâm Tác nghiệp &amp; Trọng tài Sinh viên
          </h1>
          <p className="text-xs sm:text-sm text-[#62646a] max-w-2xl">
            Tiếp nhận và giải quyết trực tiếp 5 hàng đợi vận hành hàng ngày: Kiểm duyệt Thẻ sinh viên, Trọng tài hòa giải Escrow, Kiểm duyệt tin rác và Hỗ trợ CSKH trực tuyến.
          </p>
        </div>

        {/* Shift status switch & Quick Metrics */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-neutral-500 font-medium">Ca trực hiện tại:</span>
              <span className="font-bold text-[#222325]">Ca Sáng (08:00 - 16:00)</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-neutral-500 font-medium">Trạng thái sẵn sàng:</span>
              <div className="flex items-center gap-1.5">
                <select
                  value={shiftStatus}
                  onChange={(e) => setShiftStatus(e.target.value as any)}
                  className="bg-white px-2 py-0.5 rounded border border-neutral-200 text-xs font-bold cursor-pointer"
                >
                  <option value="ONLINE">🟢 Đang trực tuyến</option>
                  <option value="AWAY">🟡 Tạm nghỉ (15p)</option>
                  <option value="OFFLINE">🔴 Kết thúc ca</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Shift KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#62646a] mb-2 font-medium">
            <span>KYC Thẻ SV đã duyệt</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-[#222325]">14 hồ sơ</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>⏱️ Phản hồi TB: 14 phút/ca</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#62646a] mb-2 font-medium">
            <span>Trọng tài Escrow</span>
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-[#222325]">{disputes.length} vụ việc</div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">
            {disputes.filter((d) => d.status === 'ESCALATED_TO_ADMIN').length > 0
              ? '1 vụ đã chuyển Admin'
              : 'Đã hòa giải 2/3 vụ'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#62646a] mb-2 font-medium">
            <span>Ticket CSKH trực tuyến</span>
            <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
              <HelpCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-[#222325]">{supportTickets.length} phiếu</div>
          <p className="text-[11px] text-neutral-500 font-medium mt-1">
            {openTicketsCount} phiếu cần phản hồi
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#62646a] mb-2 font-medium">
            <span>Điểm hài lòng CSAT</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-600">4.95 / 5.0 ★</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            98.2% sinh viên đánh giá 5 sao
          </p>
        </div>
      </div>

      {/* 5 Queue Switcher Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-neutral-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-semibold">
        <button
          onClick={() => setActiveQueue('KYC_QUEUE')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeQueue === 'KYC_QUEUE'
              ? 'bg-indigo-600 text-white font-bold shadow-xs'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>1. Duyệt Thẻ SV (KYC)</span>
          {pendingKYCCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeQueue === 'KYC_QUEUE' ? 'bg-indigo-900 text-indigo-100' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {pendingKYCCount} chờ
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveQueue('DISPUTES_QUEUE')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeQueue === 'DISPUTES_QUEUE'
              ? 'bg-indigo-600 text-white font-bold shadow-xs'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>2. Trọng tài Tranh chấp Escrow</span>
          {activeDisputesCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeQueue === 'DISPUTES_QUEUE'
                  ? 'bg-indigo-900 text-indigo-100'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {activeDisputesCount} ca
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveQueue('REPORTS_QUEUE')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeQueue === 'REPORTS_QUEUE'
              ? 'bg-indigo-600 text-white font-bold shadow-xs'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>3. Kiểm duyệt Vi phạm &amp; Tin rác</span>
          {openReportsCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeQueue === 'REPORTS_QUEUE'
                  ? 'bg-indigo-900 text-indigo-100'
                  : 'bg-neutral-200 text-neutral-800'
              }`}
            >
              {openReportsCount} báo cáo
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveQueue('TICKETS_QUEUE')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeQueue === 'TICKETS_QUEUE'
              ? 'bg-indigo-600 text-white font-bold shadow-xs'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>4. Trực Ticket CSKH</span>
          {openTicketsCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeQueue === 'TICKETS_QUEUE'
                  ? 'bg-indigo-900 text-indigo-100'
                  : 'bg-teal-100 text-teal-800'
              }`}
            >
              {openTicketsCount} phiếu
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveQueue('EMERGENCY_QUEUE')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeQueue === 'EMERGENCY_QUEUE'
              ? 'bg-indigo-600 text-white font-bold shadow-xs'
              : 'text-[#62646a] hover:bg-neutral-100'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>5. Điều phối Task Khẩn cấp</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-700 font-bold">
            {urgentTasksCount} task gấp
          </span>
        </button>
      </div>

      {/* QUEUE CONTENT 1: KYC STUDENT VERIFICATION QUEUE */}
      {activeQueue === 'KYC_QUEUE' && (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 text-xs text-indigo-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold">Quy trình duyệt Tick xanh của Staff:</span> Đối chiếu MSSV,
              họ tên và ảnh chụp mặt trước thẻ sinh viên. Nếu hợp lệ, bấm Phê duyệt để tự động kích
              hoạt huy hiệu xác thực trên toàn sàn cho sinh viên.
            </div>
            <span className="font-bold text-indigo-700 shrink-0">
              Cam kết SLA: &lt; 2 tiếng
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-[#62646a] uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Mã hồ sơ</th>
                    <th className="py-3 px-4">Họ và tên</th>
                    <th className="py-3 px-4">Trường Đại học &amp; MSSV</th>
                    <th className="py-3 px-4">Email trường</th>
                    <th className="py-3 px-4">Ảnh thẻ SV</th>
                    <th className="py-3 px-4">Thời gian nộp</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {verifications.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-neutral-600">
                        {item.id}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#222325]">
                        {item.studentName}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#222325]">{item.university}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">
                          MSSV: {item.studentId}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                          {item.studentEmail}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedVerifForPreview(item)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Xem thẻ</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-neutral-500">{item.submittedAt}</td>
                      <td className="py-3 px-4">
                        {item.status === 'PENDING' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                            Chờ duyệt
                          </span>
                        )}
                        {item.status === 'VERIFIED' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1 w-max">
                            <CheckCircle className="w-3 h-3" />
                            <span>Đã cấp Tick xanh</span>
                          </span>
                        )}
                        {item.status === 'REJECTED' && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                            Đã từ chối
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                onApproveVerification(item.id, 'Thẻ sinh viên hợp lệ');
                                showStaffToast(`Đã duyệt Tick xanh cho ${item.studentName}!`);
                              }}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                              title="Phê duyệt cấp Tick xanh"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Duyệt</span>
                            </button>
                            {onRequestResubmitVerification && (
                              <button
                                onClick={() => {
                                  onRequestResubmitVerification(
                                    item.id,
                                    'Ảnh thẻ bị lóa sáng mờ mã số, vui lòng chụp lại'
                                  );
                                  showStaffToast(`Đã yêu cầu ${item.studentName} chụp lại thẻ!`);
                                }}
                                className="px-2 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                                title="Yêu cầu chụp lại ảnh thẻ"
                              >
                                <span>Chụp lại</span>
                              </button>
                            )}
                            <button
                              onClick={() => {
                                onRejectVerification(item.id, 'Thông tin thẻ không trùng khớp');
                                showStaffToast(`Đã từ chối hồ sơ của ${item.studentName}`);
                              }}
                              className="px-2 py-1.5 bg-neutral-200 hover:bg-rose-100 hover:text-rose-700 text-neutral-700 font-semibold rounded-lg transition-colors cursor-pointer"
                              title="Từ chối hồ sơ"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-neutral-400 font-medium">Hoàn tất</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QUEUE CONTENT 2: DISPUTE ARBITRATION QUEUE */}
      {activeQueue === 'DISPUTES_QUEUE' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold">Nhiệm vụ Trọng tài Sơ thẩm của Staff:</span> Kiểm tra bản
              giao kết quả và tin nhắn trao đổi trong Order để đưa ra phán quyết công bằng. Nếu tranh
              chấp vượt quá 1.000.000 đ hoặc có dấu hiệu gian lận học thuật, Staff có thể{' '}
              <strong>Chuyển cấp lên Admin</strong>.
            </div>
            <span className="font-bold text-amber-800 shrink-0">Bảo chứng Escrow 100%</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {disputes.map((dsp) => (
              <div
                key={dsp.id}
                className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200">
                      Mã vụ: {dsp.id}
                    </span>
                    <span className="text-xs text-neutral-400">·</span>
                    <span className="text-xs font-semibold text-[#62646a]">
                      Đơn hàng: <strong>{dsp.orderId}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Ngân sách đang khóa ký quỹ:</span>
                    <span className="text-base font-extrabold text-[#222325] font-mono">
                      {dsp.amount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#222325]">{dsp.taskTitle}</h3>
                  <div className="mt-2 p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs text-neutral-700 space-y-1">
                    <span className="font-bold text-[#222325]">Lý do khiếu nại từ Bên yêu cầu: </span>
                    <p className="italic text-neutral-600">{dsp.reason}</p>
                  </div>
                </div>

                {/* Counterparties compare box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                      Bên khiếu nại (Claimant):
                    </span>
                    <div className="font-bold text-[#222325]">{dsp.claimant.displayName}</div>
                    <div className="text-neutral-500 text-[11px]">{dsp.claimant.university}</div>
                    <div className="text-blue-600 font-semibold mt-1">
                      Vai trò trong đơn: {dsp.claimantRole === 'REQUESTER' ? 'Người yêu cầu (Thuê)' : 'Người thực hiện'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      Bên bị khiếu nại (Defendant):
                    </span>
                    <div className="font-bold text-[#222325]">{dsp.defendant.displayName}</div>
                    <div className="text-neutral-500 text-[11px]">{dsp.defendant.university}</div>
                    <div className="text-neutral-600 font-semibold mt-1">
                      Vai trò trong đơn: {dsp.claimantRole === 'REQUESTER' ? 'Người thực hiện (Nhận việc)' : 'Người yêu cầu'}
                    </div>
                  </div>
                </div>

                {/* Staff Handling Status & Actions */}
                <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-neutral-500 font-medium">Trạng thái: </span>
                    {dsp.status === 'INVESTIGATING' && (
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Staff đang thụ lý điều tra
                      </span>
                    )}
                    {dsp.status === 'OPEN' && (
                      <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Mới mở tranh chấp
                      </span>
                    )}
                    {dsp.status === 'ESCALATED_TO_ADMIN' && (
                      <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        Đã chuyển cấp lên Admin
                      </span>
                    )}
                    {dsp.status === 'RESOLVED_PAYOUT' && (
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Đã giải ngân cho Tasker
                      </span>
                    )}
                    {dsp.status === 'RESOLVED_REFUND' && (
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Đã hoàn tiền cho Requester
                      </span>
                    )}
                  </div>

                  {dsp.status !== 'RESOLVED_REFUND' &&
                    dsp.status !== 'RESOLVED_PAYOUT' &&
                    dsp.status !== 'ESCALATED_TO_ADMIN' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedDisputeForAction(dsp);
                            setArbitrationDecision('PAYOUT_TASKER');
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Mở Phòng Trọng tài &amp; Phán quyết</span>
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUEUE CONTENT 3: REPORTS & MODERATION QUEUE */}
      {activeQueue === 'REPORTS_QUEUE' && (
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 flex items-center justify-between">
            <span>
              <strong>Kiểm duyệt an toàn môi trường học đường:</strong> Xử lý nghiêm các hành vi
              yêu cầu chuyển tiền cọc ngoài sàn, lừa đảo hoặc dùng thẻ sinh viên giả.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-xs text-neutral-600">{rep.id}</span>
                    <span className="text-xs text-neutral-400">·</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 font-bold text-neutral-700">
                      Loại: {rep.targetType}
                    </span>
                    <span className="text-xs text-neutral-400">·</span>
                    <span className="text-xs text-neutral-500">Người báo cáo: {rep.reporterName}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#222325]">
                    {rep.targetTitle || `Đối tượng #${rep.targetId}`}
                  </h4>
                  <p className="text-xs text-[#62646a]">{rep.reason}</p>
                  {rep.staffNote && (
                    <div className="text-[11px] text-indigo-700 bg-indigo-50 p-2 rounded-lg font-medium">
                      Ghi chú Staff: {rep.staffNote}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rep.status !== 'RESOLVED' && rep.status !== 'ESCALATED_TO_ADMIN' ? (
                    <>
                      <button
                        onClick={() => {
                          onModerateReport(rep.id, 'DELIST_TASK', 'Đã gỡ bài đăng vì vi phạm nội quy cọc');
                          showStaffToast(`Đã gỡ bỏ bài đăng vi phạm #${rep.id}!`);
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Gỡ Task vi phạm
                      </button>
                      <button
                        onClick={() => {
                          onModerateReport(rep.id, 'WARN_USER', 'Đã gửi cảnh cáo cấp 1 tới tài khoản');
                          showStaffToast(`Đã gửi cảnh cáo chính thức tới người vi phạm!`);
                        }}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Cảnh cáo
                      </button>
                      <button
                        onClick={() => {
                          onModerateReport(rep.id, 'REQUEST_BAN', 'Chuyển cấp Admin đề xuất khóa vĩnh viễn');
                          showStaffToast(`Đã chuyển cấp lên Admin để khóa tài khoản!`);
                        }}
                        className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Chuyển Admin cấm
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-neutral-500 px-3 py-1 bg-neutral-100 rounded-xl">
                      {rep.status === 'RESOLVED' ? 'Đã xử lý xong' : 'Đã chuyển Admin'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUEUE CONTENT 4: SUPPORT TICKETS & HELP DESK */}
      {activeQueue === 'TICKETS_QUEUE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left list of tickets */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-4 space-y-3">
            <h3 className="text-sm font-bold text-[#222325] px-2">Hàng đợi Ticket CSKH</h3>
            <div className="space-y-2">
              {supportTickets.map((tck) => (
                <div
                  key={tck.id}
                  onClick={() => setSelectedTicket(tck)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs ${
                    selectedTicket?.id === tck.id
                      ? 'bg-indigo-50 border-indigo-300 shadow-xs'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-neutral-500 text-[11px]">{tck.id}</span>
                    <span
                      className={`px-2 py-0.2 rounded-full font-bold text-[10px] ${
                        tck.status === 'OPEN'
                          ? 'bg-rose-100 text-rose-700'
                          : tck.status === 'ANSWERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {tck.status === 'OPEN' ? 'Chưa trả lời' : tck.status === 'ANSWERED' ? 'Đã trả lời' : 'Đang xử lý'}
                    </span>
                  </div>
                  <h4 className="font-bold text-[#222325] line-clamp-1">{tck.subject}</h4>
                  <div className="text-[11px] text-neutral-500 mt-1 flex items-center justify-between">
                    <span>{tck.studentName} ({tck.university.split('(')[1]?.replace(')', '') || 'SV'})</span>
                    <span>{tck.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right chat / reply box */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-6 flex flex-col justify-between space-y-4">
            {selectedTicket ? (
              <>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-500">
                          {selectedTicket.id}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                          Chuyên mục: {selectedTicket.category}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#222325] mt-1">
                        {selectedTicket.subject}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Sinh viên: <strong>{selectedTicket.studentName}</strong> ({selectedTicket.studentEmail}) · {selectedTicket.university}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSendTicketReply(true)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl cursor-pointer self-start sm:self-auto"
                    >
                      Đánh dấu giải quyết xong
                    </button>
                  </div>

                  {/* Messages Feed */}
                  <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
                    {selectedTicket.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-2xl text-xs max-w-lg ${
                          m.senderRole === 'STAFF'
                            ? 'ml-auto bg-indigo-600 text-white rounded-br-none'
                            : 'bg-neutral-100 text-[#222325] rounded-bl-none'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] mb-1 opacity-80">
                          <span className="font-bold">{m.senderName}</span>
                          <span>{m.timestamp}</span>
                        </div>
                        <p className="leading-relaxed">{m.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply section with Quick Macros */}
                <div className="pt-4 border-t border-neutral-100 space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                      Câu trả lời mẫu nhanh (Quick Macros):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_MACROS.map((macro, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyMacro(macro)}
                          className="px-2.5 py-1 text-[11px] bg-neutral-50 hover:bg-indigo-50 hover:text-indigo-700 border border-neutral-200 rounded-lg text-neutral-600 transition-colors cursor-pointer text-left line-clamp-1 max-w-xs"
                        >
                          {macro}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ticketReplyText}
                      onChange={(e) => setTicketReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendTicketReply(false);
                      }}
                      placeholder="Nhập nội dung phản hồi chính thức cho sinh viên..."
                      className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-hidden focus:border-indigo-600"
                    />
                    <button
                      onClick={() => handleSendTicketReply(false)}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-neutral-400 text-xs">
                Chọn một phiếu ticket bên trái để xử lý
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUEUE CONTENT 5: EMERGENCY TASK DISPATCHER */}
      {activeQueue === 'EMERGENCY_QUEUE' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold">Radar Điều phối Task Gấp:</span> Giám sát các bài đăng có
              thời hạn dưới 24h hoặc ngân sách tốt nhưng chưa có ứng viên. Staff có thể bấm Ghim ưu
              tiên để đẩy lên vị trí nổi bật tại sàn #market-tasks.
            </div>
            <span className="font-bold text-amber-800 shrink-0">Hỗ trợ sinh viên 24/7</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks
              .filter((t) => t.status === 'OPEN')
              .slice(0, 6)
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                      <span className="font-mono font-bold">{task.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[10px]">
                        Hạn: {task.deadline.split('ngày')[1] || task.deadline}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#222325] line-clamp-2">{task.title}</h4>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{task.description}</p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-neutral-500 block">Ngân sách:</span>
                      <span className="text-sm font-bold text-[#222325] font-mono">
                        {task.budget.toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (onBoostUrgentTask) onBoostUrgentTask(task.id);
                        showStaffToast(`Đã ghim ưu tiên Task #${task.id} lên đầu sàn!`);
                      }}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Ghim ưu tiên</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* MODAL 1: VIEW STUDENT CARD IMAGE (KYC DETAIL) */}
      {selectedVerifForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-[#222325]">
                  Đối chiếu Thẻ sinh viên #{selectedVerifForPreview.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVerifForPreview(null)}
                className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student info sheet */}
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Họ và tên:</span>
                <span className="font-bold text-[#222325]">{selectedVerifForPreview.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Mã số sinh viên (MSSV):</span>
                <span className="font-mono font-bold text-indigo-700">{selectedVerifForPreview.studentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Trường Đại học:</span>
                <span className="font-semibold text-[#222325]">{selectedVerifForPreview.university}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Email trường:</span>
                <span className="font-mono text-neutral-600">{selectedVerifForPreview.studentEmail}</span>
              </div>
            </div>

            {/* Simulated Card Image Graphic */}
            <div className="aspect-16/10 rounded-2xl bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 p-4 text-white flex flex-col justify-between border-2 border-indigo-400/30 shadow-inner relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">
                    🎓
                  </div>
                  <span className="text-xs font-bold tracking-wide uppercase">
                    THẺ SINH VIÊN ĐẠI HỌC
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-2 py-0.5 rounded-full font-mono">
                  NIÊN KHÓA 2022 - 2026
                </span>
              </div>

              <div className="flex items-center gap-4 my-2">
                <div className="w-16 h-20 rounded-lg bg-neutral-800 border-2 border-white/40 flex items-center justify-center text-xs font-bold text-neutral-400 shrink-0">
                  Ảnh SV
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-sm tracking-wide">
                    {selectedVerifForPreview.studentName}
                  </div>
                  <div className="text-[11px] text-indigo-200">
                    MSSV: <strong>{selectedVerifForPreview.studentId}</strong>
                  </div>
                  <div className="text-[11px] text-indigo-200">
                    {selectedVerifForPreview.university}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/60 border-t border-white/10 pt-2 font-mono">
                <span>File: {selectedVerifForPreview.evidenceRef}</span>
                <span>VIETVI SECURE ID</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedVerifForPreview(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  onApproveVerification(selectedVerifForPreview.id);
                  setSelectedVerifForPreview(null);
                  showStaffToast(`Đã duyệt Tick xanh cho ${selectedVerifForPreview.studentName}!`);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Xác nhận Duyệt Tick Xanh</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ARBITRATION ROOM DECISION */}
      {selectedDisputeForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-[#222325]">
                  Phòng Trọng tài Hòa giải #{selectedDisputeForAction.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDisputeForAction(null)}
                className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
                <div className="font-bold text-[#222325]">{selectedDisputeForAction.taskTitle}</div>
                <div className="text-neutral-500">
                  Ngân sách đang khóa ký quỹ:{' '}
                  <strong className="text-emerald-700 font-mono">
                    {selectedDisputeForAction.amount.toLocaleString('vi-VN')} đ
                  </strong>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#222325] block mb-2">
                  Lựa chọn Phán quyết sơ thẩm của Staff:
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      arbitrationDecision === 'PAYOUT_TASKER'
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="decision"
                      checked={arbitrationDecision === 'PAYOUT_TASKER'}
                      onChange={() => setArbitrationDecision('PAYOUT_TASKER')}
                      className="mt-0.5"
                    />
                    <div>
                      <strong className="text-[#222325] block">
                        1. Giải ngân 100% thù lao cho Người thực hiện (Tasker)
                      </strong>
                      <span className="text-neutral-500 text-[11px]">
                        Áp dụng khi Tasker đã làm đúng cam kết Expected Output ban đầu, Requester từ
                        chối nghiệm thu vô lý.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      arbitrationDecision === 'REFUND_REQUESTER'
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="decision"
                      checked={arbitrationDecision === 'REFUND_REQUESTER'}
                      onChange={() => setArbitrationDecision('REFUND_REQUESTER')}
                      className="mt-0.5"
                    />
                    <div>
                      <strong className="text-[#222325] block">
                        2. Hoàn tiền 100% về ví cho Người yêu cầu (Requester)
                      </strong>
                      <span className="text-neutral-500 text-[11px]">
                        Áp dụng khi Tasker quá hạn nghiêm trọng, nộp file lỗi hoặc bỏ dở công việc.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      arbitrationDecision === 'SPLIT_50_50'
                        ? 'bg-purple-50 border-purple-300'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="decision"
                      checked={arbitrationDecision === 'SPLIT_50_50'}
                      onChange={() => setArbitrationDecision('SPLIT_50_50')}
                      className="mt-0.5"
                    />
                    <div>
                      <strong className="text-[#222325] block">
                        3. Hòa giải chia đôi tỷ lệ 50% - 50%
                      </strong>
                      <span className="text-neutral-500 text-[11px]">
                        Áp dụng khi cả hai bên đều hoàn thành một phần công việc và đồng ý phương án hòa giải.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      arbitrationDecision === 'ESCALATE_TO_ADMIN'
                        ? 'bg-rose-50 border-rose-300'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="decision"
                      checked={arbitrationDecision === 'ESCALATE_TO_ADMIN'}
                      onChange={() => setArbitrationDecision('ESCALATE_TO_ADMIN')}
                      className="mt-0.5"
                    />
                    <div>
                      <strong className="text-rose-900 block">
                        4. Chuyển cấp lên Hội đồng Quản trị viên (Escalate to Admin)
                      </strong>
                      <span className="text-neutral-500 text-[11px]">
                        Vụ việc phức tạp, ngân sách lớn vượt thẩm quyền hoặc có dấu hiệu gian lận học thuật.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#222325] block mb-1">
                  Biên bản ghi chú phán quyết của Staff:
                </label>
                <textarea
                  rows={3}
                  value={arbitrationNote}
                  onChange={(e) => setArbitrationNote(e.target.value)}
                  placeholder="Ghi rõ lý do căn cứ theo tin nhắn và file giao nộp để làm cơ sở cho cả hai bên..."
                  className="w-full p-3 rounded-xl border border-neutral-200 text-xs focus:outline-hidden focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                onClick={() => setSelectedDisputeForAction(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmArbitration}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
              >
                Ban hành Phán quyết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
