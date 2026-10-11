import React, { useState } from 'react';
import { X, ShieldCheck, Check, Upload, GraduationCap, Mail, AlertCircle } from 'lucide-react';
import { UNIVERSITIES } from '../data/mockData';

interface VerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerifyModal: React.FC<VerifyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'FORM' | 'SUBMITTED'>('FORM');
  const [eduEmail, setEduEmail] = useState('minhanh.nguyen@sis.hust.edu.vn');
  const [studentId, setStudentId] = useState('20224567');
  const [selectedUni, setSelectedUni] = useState('Đại học Bách Khoa Hà Nội');
  const [skills, setSkills] = useState('PowerPoint, Python, Toán cao cấp');

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('SUBMITTED');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div
        className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-neutral-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#222325]">
                Xác minh Sinh viên (Tasker Verification)
              </h3>
              <p className="text-[11px] text-[#62646a]">
                Xây dựng độ uy tín cao hơn để nhận nhiều đề xuất Task
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {step === 'SUBMITTED' ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#222325]">
                  Hồ sơ xác minh đã được ghi nhận!
                </h4>
                <p className="text-xs text-[#62646a] mt-1 max-w-sm mx-auto">
                  Quản trị viên VIETVI đang đối chiếu email <strong>{eduEmail}</strong> với cơ sở dữ liệu trường. Trạng thái hiện tại: <span className="text-blue-700 font-semibold">PENDING_VERIFICATION</span> (Dự kiến hoàn tất trong 2 giờ).
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl"
              >
                Đã hiểu, quay lại Trang chủ
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200/60 text-blue-900 space-y-1">
                <p className="font-semibold">Lợi ích khi được xác minh:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-blue-800">
                  <li>Huy hiệu tick xanh &quot;Đã xác minh SV&quot; trên mọi đề xuất bạn gửi.</li>
                  <li>Tăng 3.5x tỷ lệ được Người yêu cầu chấp nhận và giao việc.</li>
                  <li>Bảo vệ tài khoản và ưu tiên hỗ trợ khi xảy ra tranh chấp.</li>
                </ul>
              </div>

              <div>
                <label className="block font-bold text-[#404145] mb-1">
                  Trường Đại học đang theo học
                </label>
                <select
                  value={selectedUni}
                  onChange={(e) => setSelectedUni(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                >
                  {UNIVERSITIES.filter((u) => u.id !== 'all').map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#404145] mb-1">
                    Mã số sinh viên (MSSV)
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#404145] mb-1">
                    Email trường cấp (.edu.vn)
                  </label>
                  <input
                    type="email"
                    value={eduEmail}
                    onChange={(e) => setEduEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#404145] mb-1">
                  Tải lên ảnh Thẻ sinh viên (Mặt trước)
                </label>
                <div className="border-2 border-dashed border-neutral-200 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-neutral-50/50">
                  <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-1" />
                  <p className="font-semibold text-[#222325]">
                    Nhấp để tải ảnh chụp Thẻ sinh viên
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Định dạng JPG, PNG dưới 5MB. Thông tin của bạn được bảo mật tuyệt đối.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#404145] mb-1">
                  Kỹ năng chuyên môn của bạn
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Ví dụ: Thiết kế Canva, Dịch tiếng Anh, Lập trình React"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 font-semibold text-[#62646a] hover:bg-neutral-100 rounded-xl"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                >
                  Gửi yêu cầu xét duyệt
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
