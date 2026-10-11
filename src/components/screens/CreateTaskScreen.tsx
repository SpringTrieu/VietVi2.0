import React, { useState } from 'react';
import { TaskCategory, TaskMode, University } from '../../types';
import { CATEGORIES, UNIVERSITIES } from '../../data/mockData';
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  DollarSign,
  Info,
} from 'lucide-react';

interface CreateTaskScreenProps {
  onBack: () => void;
  onTaskCreated: (taskData: {
    title: string;
    categoryId: string;
    description: string;
    expectedOutput: string;
    budget: number;
    deadline: string;
    mode: TaskMode;
    locationNote: string;
    tags: string[];
  }) => void;
  userUniversity: string;
}

export const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({
  onBack,
  onTaskCreated,
  userUniversity,
}) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [description, setDescription] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [budget, setBudget] = useState(250000);
  const [deadline, setDeadline] = useState('10/10/2026');
  const [mode, setMode] = useState<TaskMode>('ONLINE');
  const [locationNote, setLocationNote] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Canva', 'Bách Khoa', 'Slide']);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCategory = CATEGORIES.find((c) => c.id === categoryId);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !expectedOutput.trim() || budget < 50000) {
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onTaskCreated({
        title,
        categoryId,
        description,
        expectedOutput,
        budget,
        deadline,
        mode,
        locationNote: mode === 'ONSITE' ? locationNote || 'Khuôn viên trường' : 'Làm việc Online hoàn toàn',
        tags,
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Sàn Task</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Bảo hộ Escrow 100% — Tiền chỉ giải ngân khi bạn hài lòng</span>
          </div>
        </div>

        {/* Header Title */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Quy trình tạo việc · Bước 1 / 1
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight mt-1">
            Đăng yêu cầu công việc mới (Micro-task)
          </h1>
          <p className="text-sm text-neutral-600 mt-1.5">
            Kết nối với hơn 20.000 bạn sinh viên chuyên môn cao từ Bách Khoa, NEU, FTU, FPT... Nhận báo giá cạnh tranh chỉ sau 15 phút.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Thông tin cơ bản */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-neutral-100">
              <div className="w-7 h-7 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-base font-bold text-[#222325]">
                Mô tả công việc &amp; Yêu cầu bàn giao
              </h2>
            </div>

            {/* Tiêu đề */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                Tiêu đề Task <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Thiết kế slide bảo vệ đồ án 20 trang bằng Canva chuẩn font ĐH Bách Khoa"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1dbf73]/30 focus:border-[#1dbf73]"
              />
              <p className="text-[11px] text-neutral-400 mt-1.5">
                Nêu ngắn gọn nội dung và định dạng sản phẩm bạn cần nhận để ứng viên dễ hiểu.
              </p>
            </div>

            {/* Danh mục */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  Danh mục phù hợp <span className="text-rose-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 cursor-pointer focus:bg-white focus:outline-none focus:border-[#1dbf73]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.taskCount} việc đang mở)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  Hình thức làm việc <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('ONLINE')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mode === 'ONLINE'
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Online
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('ONSITE')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mode === 'ONSITE'
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Trực tiếp (Onsite)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('FLEXIBLE')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mode === 'FLEXIBLE'
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Linh hoạt
                  </button>
                </div>
              </div>
            </div>

            {/* Chi tiết mô tả */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                Nội dung chi tiết &amp; Nguồn tài liệu sẵn có <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả cụ thể: Yêu cầu gồm những gì, bạn đã có sẵn dàn bài hay file Word chưa, phong cách mong muốn..."
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1dbf73]/30 focus:border-[#1dbf73]"
              />
            </div>

            {/* Sản phẩm bàn giao cụ thể */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                Kết quả nghiệm thu cụ thể (Expected Output) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
                placeholder="VD: 1 link chỉnh sửa Canva Pro + 1 file xuất bản PDF độ phân giải cao"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1dbf73]/30 focus:border-[#1dbf73]"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Đây là tiêu chí pháp lý để Admin đối chiếu khi nghiệm thu và giải ngân Escrow.
              </p>
            </div>

            {/* Tags kỹ năng */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                Thẻ kỹ năng liên quan (Tối đa 5 thẻ)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Gõ tag (VD: Canva, Python, SPSS, Dịch thuật) rồi nhấn Thêm"
                  className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#1dbf73]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Thêm thẻ
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-xs font-medium"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Ngân sách & Thời hạn */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-neutral-100">
              <div className="w-7 h-7 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-base font-bold text-[#222325]">
                Ngân sách dự kiến &amp; Thời hạn hoàn thành
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Ngân sách */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  Ngân sách thù lao (VNĐ) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={50000}
                    step={10000}
                    required
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-4 py-3 pl-10 bg-neutral-50 border border-neutral-200 rounded-xl text-base font-bold text-[#222325] focus:bg-white focus:outline-none focus:border-[#1dbf73]"
                  />
                  <DollarSign className="w-5 h-5 text-neutral-400 absolute left-3 top-3.5" />
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mt-2">
                  <span>Tương đương: <strong>{budget.toLocaleString('vi-VN')} đ</strong></span>
                  <span className="text-emerald-600 font-semibold">Phí sàn: 0 đ (0%)</span>
                </div>

                {/* Gợi ý mức giá nhanh */}
                <div className="flex gap-1.5 mt-3">
                  {[100000, 200000, 350000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setBudget(amt)}
                      className={`text-[11px] py-1 px-2 rounded-lg border transition-colors cursor-pointer ${
                        budget === amt
                          ? 'border-neutral-900 bg-neutral-900 text-white font-bold'
                          : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {(amt / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Hạn chót */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  Thời hạn hoàn thành bàn giao <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="VD: 10/10/2026 hoặc 23:59 ngày mai"
                    className="w-full px-4 py-3 pl-10 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-800 focus:bg-white focus:outline-none focus:border-[#1dbf73]"
                  />
                  <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">
                  Ứng viên sẽ căn cứ vào thời hạn này để sắp xếp lịch học và cam kết hoàn thành.
                </p>
              </div>
            </div>

            {/* Escrow Guarantee Box */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Cơ chế bảo vệ thù lao của bạn trên VIETVI</span>
              </div>
              <p className="text-emerald-700 leading-relaxed text-[11px]">
                Số tiền <strong>{budget.toLocaleString('vi-VN')} đ</strong> sẽ được bảo lưu an toàn. Bạn chỉ thanh toán khi đã xem và đồng ý với file sản phẩm trong Không gian Order. Nếu ứng viên không bàn giao hoặc vi phạm, bạn được nhận lại 100% thù lao.
              </p>
            </div>

            {/* Academic Integrity Check */}
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-neutral-600 leading-relaxed">
                Tôi cam kết yêu cầu này tuân thủ <strong className="text-neutral-900">Quy tắc Liêm chính Học thuật</strong> của VIETVI (Không thuê thi hộ, không gian lận bài kiểm tra chính thức).
              </span>
            </label>
          </div>

          {/* Action CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-semibold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Hủy bỏ &amp; Quay lại
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !agreeTerms || !title || !description}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                isSubmitting || !agreeTerms || !title || !description
                  ? 'bg-neutral-300 cursor-not-allowed shadow-none'
                  : 'bg-[#1dbf73] hover:bg-[#19a463] hover:shadow-lg active:scale-98'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang xuất bản lên sàn...' : 'Xuất bản Task lên Sàn ngay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
