import React, { useState } from 'react';
import {
  Scale,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  GraduationCap,
  Building2,
  Lock,
  FileText,
  BadgeCheck,
  Send,
  HelpCircle,
  PhoneCall,
  Flame,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface IntegrityPolicyScreenProps {
  currentUser: UserProfile;
  onBackToHome: () => void;
  onExploreTasks: () => void;
  onReportViolation: () => void;
}

export const IntegrityPolicyScreen: React.FC<IntegrityPolicyScreenProps> = ({
  currentUser,
  onBackToHome,
  onExploreTasks,
  onReportViolation,
}) => {
  const [pledgeChecked1, setPledgeChecked1] = useState(false);
  const [pledgeChecked2, setPledgeChecked2] = useState(false);
  const [pledgeChecked3, setPledgeChecked3] = useState(false);
  const [hasSignedPledge, setHasSignedPledge] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const canSignPledge = pledgeChecked1 && pledgeChecked2 && pledgeChecked3;

  const handleSignPledge = () => {
    if (canSignPledge) {
      setHasSignedPledge(true);
    }
  };

  const handleAnonymousReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setReportSubmitted(true);
    setTimeout(() => {
      setReportText('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#62646a] mb-1">
              <button onClick={onBackToHome} className="hover:text-emerald-600 cursor-pointer">
                Trang chủ
              </button>
              <span>/</span>
              <span>Quy định &amp; Tiêu chuẩn</span>
              <span>/</span>
              <span className="font-bold text-[#222325]">Mã màn: INTEGRITY-01</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#222325] tracking-tight">
                  Chính sách Liêm chính Học thuật &amp; Quy tắc Ứng xử
                </h1>
                <p className="text-xs text-[#62646a]">
                  Khung quy định chuẩn mực bảo vệ sinh viên và các trường Đại học tại Việt Nam.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onExploreTasks}
            className="px-4 py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            Về Sàn Task
          </button>
        </div>

        {/* Hero Notice Banner */}
        <div className="p-6 bg-linear-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 rounded-3xl border border-amber-300/60 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-black uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            Tôn chỉ vận hành của VIETVI Marketplace
          </div>
          <h2 className="text-lg font-black text-[#222325]">
            Nói KHÔNG với Gian lận Thi cử · Kiến tạo Thu nhập Sinh viên Chân chính
          </h2>
          <p className="text-xs text-neutral-700 max-w-4xl leading-relaxed">
            VIETVI được thiết kế như một nền tảng kết nối kỹ năng và công việc bán thời gian lành mạnh (Micro-tasks)
            dành cho sinh viên. Chúng tôi phối hợp chặt chẽ với các câu lạc bộ, Đoàn - Hội và Phòng Công tác Sinh viên
            các trường Đại học để đảm bảo mọi nhiệm vụ đăng tải đều mang tính hỗ trợ học thuật hợp pháp và nâng cao kỹ năng thực chiến.
          </p>
        </div>

        {/* Section 1: Comparison Matrix (Allowed vs Strictly Forbidden) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column: Allowed Tasks */}
          <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-emerald-800 uppercase tracking-wide">
                  Được Phép Hoạt Động (White-hat Support)
                </h3>
                <p className="text-[11px] text-neutral-500">Khuyến khích và được bảo chứng Escrow 100%</p>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs text-neutral-700">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold text-sm leading-none mt-0.5">✓</span>
                <div>
                  <strong className="text-[#222325]">Gia sư &amp; Ôn tập 1 kèm 1:</strong> Hướng dẫn lại lý thuyết khó, giải đáp phương pháp làm bài toán cao cấp, xác suất, kinh tế lượng.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold text-sm leading-none mt-0.5">✓</span>
                <div>
                  <strong className="text-[#222325]">Hỗ trợ Lập trình &amp; Gỡ lỗi (Debug):</strong> Giải thích kiến trúc code, tìm lỗi logic trong script Python/Java, hướng dẫn setup môi trường phát triển.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold text-sm leading-none mt-0.5">✓</span>
                <div>
                  <strong className="text-[#222325]">Thiết kế Slide &amp; Đồ họa Trực quan:</strong> Vẽ infographic số liệu, làm slide thuyết trình Canva/PowerPoint cho bài nói trước lớp.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold text-sm leading-none mt-0.5">✓</span>
                <div>
                  <strong className="text-[#222325]">Định dạng Văn bản &amp; Trích dẫn:</strong> Canh lề, đánh số trang, tạo mục lục tự động, chuẩn hóa tài liệu theo chuẩn APA, IEEE, Harvard.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold text-sm leading-none mt-0.5">✓</span>
                <div>
                  <strong className="text-[#222325]">Dịch thuật &amp; Hiệu đính (Proofreading):</strong> Dịch bài báo khoa học tiếng Anh tham khảo, sửa lỗi ngữ pháp tiếng Anh học thuật.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold text-sm leading-none mt-0.5">✓</span>
                <div>
                  <strong className="text-[#222325]">Công việc Onsite Campus:</strong> Trực gian hàng sự kiện, chụp ảnh hội thảo, hỗ trợ phát tờ rơi, tiếp tân lễ hội trường.
                </div>
              </li>
            </ul>
          </div>

          {/* Column: Strictly Prohibited */}
          <div className="bg-white rounded-3xl border-2 border-rose-500/40 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <XCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-rose-800 uppercase tracking-wide">
                  Tuyệt Đối Nghiêm Cấm (Zero Tolerance)
                </h3>
                <p className="text-[11px] text-neutral-500">Khóa tài khoản vĩnh viễn &amp; Báo cáo về trường</p>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs text-neutral-700">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold text-sm leading-none mt-0.5">✕</span>
                <div>
                  <strong className="text-[#222325]">Thi hộ &amp; Kiểm tra hộ:</strong> Nghiêm cấm nhận làm bài thi giữa kỳ, cuối kỳ trực tuyến (LMS/MS Teams) hoặc vào phòng thi hộ người khác.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold text-sm leading-none mt-0.5">✕</span>
                <div>
                  <strong className="text-[#222325]">Làm trọn gói Khóa luận / Đồ án tốt nghiệp:</strong> Không cho phép viết hộ 100% luận văn, khóa luận để sinh viên nộp lấy bằng tốt nghiệp.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold text-sm leading-none mt-0.5">✕</span>
                <div>
                  <strong className="text-[#222325]">Mua bán Đề thi &amp; Dữ liệu bảo mật:</strong> Mua bán đề thi rò rỉ, ngân hàng câu hỏi nội bộ hoặc tài liệu mật của giảng viên.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold text-sm leading-none mt-0.5">✕</span>
                <div>
                  <strong className="text-[#222325]">Đạo văn &amp; Mạo danh tác quyền:</strong> Sao chép nguyên văn công trình nghiên cứu của người khác để bán kiếm lời.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold text-sm leading-none mt-0.5">✕</span>
                <div>
                  <strong className="text-[#222325]">Lừa cọc ngoài sàn:</strong> Yêu cầu chuyển khoản Zalo/Momo cá nhân để chiếm đoạt tiền mà không qua bảo chứng Escrow.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold text-sm leading-none mt-0.5">✕</span>
                <div>
                  <strong className="text-[#222325]">Dùng thẻ SV giả mạo:</strong> Chỉnh sửa Photoshop thẻ sinh viên hoặc mượn danh nghĩa sinh viên khác để xác thực KYC.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2: 3-Tier Penalties */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#222325]">
                Khung Chế tài &amp; Quy trình Xử lý Vi phạm 3 Cấp độ
              </h2>
              <p className="text-xs text-[#62646a]">
                Áp dụng đối với mọi thành viên, bao gồm cả Bên thuê (Requester) và Sinh viên nhận việc (Tasker).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Level 1 */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                Cấp độ 1: Cảnh cáo
              </span>
              <h4 className="font-extrabold text-sm text-[#222325]">Cảnh cáo &amp; Tạm giữ Ký quỹ</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Áp dụng cho các vi phạm vô ý hoặc trao đổi thông tin chưa đúng quy chuẩn. Hệ thống gửi thông báo nhắc nhở và tạm giữ khoản ký quỹ liên quan trong 48 giờ để rà soát.
              </p>
            </div>

            {/* Level 2 */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold uppercase tracking-wider">
                Cấp độ 2: Đóng băng
              </span>
              <h4 className="font-extrabold text-sm text-[#222325]">Đóng băng Tài khoản</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Khóa quyền đăng task và nhận task trong 30 ngày. Hủy bỏ mọi thứ hạng trên Campus Leaderboard và thu hồi huy hiệu xác minh sinh viên uy tín.
              </p>
            </div>

            {/* Level 3 */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
                Cấp độ 3: Trục xuất
              </span>
              <h4 className="font-extrabold text-sm text-[#222325]">Cấm Vĩnh Viễn &amp; Báo Cáo Trường</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Khóa vĩnh viễn CCCD / MSSV khỏi hệ thống. Trong trường hợp phát hiện đường dây thi hộ hoặc gian lận có tổ chức, VIETVI sẽ chuyển giao hồ sơ chứng cứ cho Phòng CTSV trường Đại học.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Interactive Honor Pledge */}
        <div className="bg-white rounded-3xl border-2 border-emerald-500/50 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  CHỨNG NHẬN ĐẠO ĐỨC NGHỀ NGHIỆP
                </span>
                <h2 className="text-lg font-black text-[#222325]">
                  Bản Cam kết Liêm chính Học thuật Sinh viên
                </h2>
              </div>
            </div>

            {hasSignedPledge && (
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center gap-1.5 border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ĐÃ KÝ ĐIỆN TỬ: {currentUser.displayName}
              </span>
            )}
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Ký cam kết để nhận <strong>Huy hiệu Sinh viên Liêm chính (Academic Integrity Verified)</strong> hiển thị công khai trên hồ sơ của bạn, giúp gia tăng 80% độ tin cậy khi nộp báo giá nhận việc.
          </p>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 cursor-pointer hover:bg-neutral-100/60 transition-colors">
              <input
                type="checkbox"
                disabled={hasSignedPledge}
                checked={pledgeChecked1 || hasSignedPledge}
                onChange={(e) => setPledgeChecked1(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-xs text-neutral-700 leading-relaxed">
                Tôi cam kết <strong>tuyệt đối không nhận hoặc đăng tải các công việc thi hộ, kiểm tra hộ</strong> dưới bất kỳ hình thức trực tiếp hay trực tuyến nào.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 cursor-pointer hover:bg-neutral-100/60 transition-colors">
              <input
                type="checkbox"
                disabled={hasSignedPledge}
                checked={pledgeChecked2 || hasSignedPledge}
                onChange={(e) => setPledgeChecked2(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-xs text-neutral-700 leading-relaxed">
                Tôi cam kết <strong>không đạo văn, không bán sản phẩm nghiên cứu của người khác</strong> và đảm bảo mọi tài liệu bàn giao đều đạt chuẩn liêm chính học thuật.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 cursor-pointer hover:bg-neutral-100/60 transition-colors">
              <input
                type="checkbox"
                disabled={hasSignedPledge}
                checked={pledgeChecked3 || hasSignedPledge}
                onChange={(e) => setPledgeChecked3(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-xs text-neutral-700 leading-relaxed">
                Tôi cam kết giao dịch minh bạch, <strong>sử dụng cơ chế tạm giữ ký quỹ Escrow của VIETVI</strong> để bảo vệ quyền lợi sinh viên và không dẫn dụ giao dịch ngoài sàn.
              </span>
            </label>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-neutral-500">
              * Chữ ký điện tử có giá trị định danh gắn với MSSV: <strong>{currentUser.studentId || '20224589'}</strong>
            </span>

            {!hasSignedPledge ? (
              <button
                onClick={handleSignPledge}
                disabled={!canSignPledge}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${
                  canSignPledge
                    ? 'bg-[#1dbf73] hover:bg-[#19a463] text-white'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                Ký Cam kết Liêm chính Điện tử
              </button>
            ) : (
              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                ✓ Đã cấp chứng nhận huy hiệu Liêm chính vào Hồ sơ của bạn
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Whistleblower & Anonymous Report */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#222325]">
                Đường Dây Nóng Báo Cáo Gian Lận Ẩn Danh
              </h3>
              <p className="text-xs text-[#62646a]">
                Nếu phát hiện bài đăng nghi vấn thi hộ, bán đề thi hoặc lừa đảo, hãy gửi báo cáo ẩn danh. Đội ngũ Kiểm duyệt sẽ xử lý trong 15 phút.
              </p>
            </div>
          </div>

          {reportSubmitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>
                Cảm ơn bạn! Báo cáo ẩn danh đã được chuyển đến Ban Kiểm duyệt và Tổ trọng tài sinh viên.
              </span>
            </div>
          ) : (
            <form onSubmit={handleAnonymousReport} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="Nhập mã Task, liên kết hoặc thông tin đối tượng nghi vấn có hành vi vi phạm học thuật..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="w-full p-3.5 text-xs bg-neutral-50 border border-neutral-300 rounded-2xl outline-none focus:border-rose-500 focus:bg-white resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">
                  Bảo mật 100%: Danh tính người báo cáo được mã hóa ẩn danh.
                </span>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Báo Cáo Khẩn Cấp</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
