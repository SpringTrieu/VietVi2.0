import React, { useState } from 'react';
import { CATEGORIES, UNIVERSITIES } from '../data/mockData';
import { TaskItem, TaskMode, UserProfile } from '../types';
import { X, CheckCircle, Upload, Calendar, DollarSign, MapPin, Sparkles, HelpCircle } from 'lucide-react';

interface PostTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (newTask: TaskItem) => void;
  currentUser?: UserProfile;
}

export const PostTaskModal: React.FC<PostTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
  currentUser,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('design');
  const [description, setDescription] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [budget, setBudget] = useState<number>(350000);
  const [deadline, setDeadline] = useState('18:00 ngày 08/10/2026');
  const [mode, setMode] = useState<TaskMode>('ONLINE');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('Slide, Đồ án, Canva');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !expectedOutput || !budget) return;

    setSubmitting(true);
    setTimeout(() => {
      const selectedCat = CATEGORIES.find((c) => c.id === categoryId);
      const newTask: TaskItem = {
        id: `tsk-${Date.now().toString().slice(-4)}`,
        title,
        categoryId,
        categoryName: selectedCat ? selectedCat.name : 'Khác',
        description,
        expectedOutput,
        budget,
        deadline,
        mode,
        location: mode === 'ONSITE' ? location : undefined,
        status: 'OPEN',
        requester: currentUser || {
          id: 'usr-current',
          displayName: 'Minh Anh (Bạn)',
          university: 'Đại học Bách Khoa Hà Nội',
          major: 'Khoa học Máy tính K67',
          avatarBg: 'bg-emerald-600',
          rating: 5.0,
          reviewCount: 4,
          tasksCompleted: 3,
          isVerifiedStudent: true,
          role: 'STUDENT',
        },
        offersCount: 0,
        createdAt: 'Vừa xong',
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      onTaskCreated(newTask);
      setSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-neutral-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div>
            <h3 className="text-lg font-bold text-[#222325]">
              Đăng Task mới trên VIETVI
            </h3>
            <p className="text-xs text-[#62646a]">
              Tạo yêu cầu rõ ràng để sinh viên gửi đề xuất chính xác trong vài phút
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#404145] mb-1">
              Tiêu đề Task <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Thiết kế Slide báo cáo môn Marketing 20 trang bằng Canva"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73] focus:border-[#1dbf73]"
            />
          </div>

          {/* Category & Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#404145] mb-1">
                Danh mục <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73] cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#404145] mb-1">
                Hình thức thực hiện <span className="text-rose-500">*</span>
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as TaskMode)}
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73] cursor-pointer"
              >
                <option value="ONLINE">Làm Online (Trực tuyến)</option>
                <option value="ONSITE">Onsite tại Campus / Trường</option>
                <option value="FLEXIBLE">Linh hoạt</option>
              </select>
            </div>
          </div>

          {/* Location if ONSITE */}
          {mode === 'ONSITE' && (
            <div>
              <label className="block text-xs font-bold text-[#404145] mb-1">
                Địa điểm cụ thể tại trường <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ví dụ: Giảng đường D9 - ĐH Bách Khoa Hà Nội"
                  required={mode === 'ONSITE'}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#404145] mb-1">
              Mô tả chi tiết yêu cầu <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nêu rõ hoàn cảnh, tài liệu có sẵn, yêu cầu kỹ thuật..."
              required
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
            />
          </div>

          {/* Expected Output (Core UX Requirement) */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
            <label className="block text-xs font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Tiêu chuẩn nghiệm thu (Kết quả mong đợi)</span>
              <span className="text-rose-500">*</span>
            </label>
            <p className="text-[11px] text-emerald-800 mb-2">
              Mô tả chính xác sản phẩm bạn sẽ nhận để bấm hoàn thành (ví dụ: File PPTX 20 trang, không lỗi chính tả, file zip source code...).
            </p>
            <textarea
              rows={2}
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              placeholder="Ví dụ: File PPTX + PDF gồm 20 slide, màu xanh dương navy, có đồ thị tăng trưởng."
              required
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white rounded-xl border border-emerald-300 focus:ring-2 focus:ring-[#1dbf73]"
            />
          </div>

          {/* Budget & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#404145] mb-1">
                Ngân sách sẵn sàng chi trả (VND) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  step={10000}
                  min={50000}
                  required
                  className="w-full px-3.5 py-2.5 text-sm font-mono font-bold bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
                />
              </div>
              <span className="text-[11px] text-[#62646a] mt-1 block">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(budget)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#404145] mb-1">
                Hạn chót bàn giao <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="23:59 ngày 08/10/2026"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-[#404145] mb-1">
              Từ khóa / Kỹ năng (ngăn cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Canva, PowerPoint, Đồ án"
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#62646a] hover:bg-neutral-100 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {submitting ? 'Đang đăng Task...' : 'Đăng Task ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
