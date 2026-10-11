import React, { useState } from 'react';
import { StudentReviewItem, UserProfile } from '../../types';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  ThumbsUp,
  Award,
  ChevronDown,
  Filter,
  Send,
  CornerDownRight,
} from 'lucide-react';

interface ReviewsCenterScreenProps {
  reviews: StudentReviewItem[];
  currentUser: UserProfile;
  onSubmitReply: (reviewId: string, replyText: string) => void;
  onExploreOrders: () => void;
}

export const ReviewsCenterScreen: React.FC<ReviewsCenterScreenProps> = ({
  reviews,
  currentUser,
  onSubmitReply,
  onExploreOrders,
}) => {
  const [filterRole, setFilterRole] = useState<'ALL' | 'AS_TASKER' | 'AS_REQUESTER'>('ALL');
  const [replyInputId, setReplyInputId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const filteredReviews = reviews.filter((r) => {
    if (filterRole === 'AS_TASKER') return r.reviewerRole === 'REQUESTER'; // Reviewer was requester -> Reviewee is Tasker
    if (filterRole === 'AS_REQUESTER') return r.reviewerRole === 'TASKER';
    return true;
  });

  // Calculate statistics
  const totalReviews = reviews.length;
  const avgOverall =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.overallRating, 0) / totalReviews).toFixed(1)
      : '5.0';
  const avgQuality =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.ratingQuality, 0) / totalReviews).toFixed(1)
      : '5.0';
  const avgTimeliness =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.ratingTimeliness, 0) / totalReviews).toFixed(1)
      : '5.0';
  const avgCommunication =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.ratingCommunication, 0) / totalReviews).toFixed(1)
      : '5.0';

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    onSubmitReply(reviewId, replyText);
    setReplyText('');
    setReplyInputId(null);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Chuẩn đánh giá EVAL-01 &amp; EVAL-02</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325]">
            Hệ thống Đánh giá &amp; Điểm Tín nhiệm 360°
          </h1>
          <p className="text-xs sm:text-sm text-[#62646a] mt-1">
            Minh bạch hóa chất lượng sinh viên qua 3 tiêu chí: Chất lượng đầu ra, Đúng hạn bàn giao và
            Thái độ giao tiếp.
          </p>
        </div>

        <button
          onClick={onExploreOrders}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer self-start md:self-auto"
        >
          Xem các đơn hàng đã nghiệm thu
        </button>
      </div>

      {/* 3-Dimensional Rating Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-xs flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-xs font-bold text-[#62646a]">Điểm uy tín tổng thể</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-[#222325]">{avgOverall}</span>
            <span className="text-sm text-neutral-400 font-bold">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[11px] text-neutral-500 font-medium">Dựa trên {totalReviews} nhận xét đã xác thực</span>
        </div>

        {/* Criteria 1: Chất lượng (Quality) */}
        <div className="bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              Tiêu chí 1
            </span>
            <span className="text-xs font-extrabold text-[#222325]">{avgQuality} / 5.0</span>
          </div>
          <h4 className="font-bold text-sm text-[#222325]">Chất lượng đầu ra (Quality)</h4>
          <p className="text-[11px] text-[#62646a] leading-relaxed">
            Mức độ đáp ứng đúng Kết quả mong đợi (Expected Output) và tính thẩm mỹ / chính xác của sản phẩm.
          </p>
          <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '98%' }} />
          </div>
        </div>

        {/* Criteria 2: Đúng hạn (Timeliness) */}
        <div className="bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
              Tiêu chí 2
            </span>
            <span className="text-xs font-extrabold text-[#222325]">{avgTimeliness} / 5.0</span>
          </div>
          <h4 className="font-bold text-sm text-[#222325]">Đúng hạn cam kết (Timeliness)</h4>
          <p className="text-[11px] text-[#62646a] leading-relaxed">
            Tỷ lệ bàn giao sớm hoặc đúng deadline đã chốt trong Order, không trễ hẹn làm ảnh hưởng tiến độ.
          </p>
          <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Criteria 3: Giao tiếp (Communication) */}
        <div className="bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md">
              Tiêu chí 3
            </span>
            <span className="text-xs font-extrabold text-[#222325]">{avgCommunication} / 5.0</span>
          </div>
          <h4 className="font-bold text-sm text-[#222325]">Giao tiếp &amp; Thái độ (Communication)</h4>
          <p className="text-[11px] text-[#62646a] leading-relaxed">
            Tốc độ phản hồi tin nhắn trong Order Workspace, thái độ tôn trọng và cầu thị khi nhận yêu cầu sửa.
          </p>
          <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '96%' }} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setFilterRole('ALL')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filterRole === 'ALL'
              ? 'bg-[#1dbf73] text-white'
              : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
          }`}
        >
          Tất cả nhận xét ({reviews.length})
        </button>
        <button
          onClick={() => setFilterRole('AS_TASKER')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filterRole === 'AS_TASKER'
              ? 'bg-[#1dbf73] text-white'
              : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
          }`}
        >
          Nhận xét khi làm Người thực hiện (Tasker)
        </button>
        <button
          onClick={() => setFilterRole('AS_REQUESTER')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filterRole === 'AS_REQUESTER'
              ? 'bg-[#1dbf73] text-white'
              : 'text-[#62646a] hover:text-[#222325] hover:bg-neutral-100'
          }`}
        >
          Nhận xét khi làm Người yêu cầu (Requester)
        </button>
      </div>

      {/* Review Items List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="py-12 bg-white rounded-3xl border border-neutral-200 text-center text-xs text-[#62646a]">
            Chưa có đánh giá nào trong danh mục này.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl ${rev.reviewer.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                  >
                    {rev.reviewer.displayName[0]}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-[#222325]">
                        {rev.reviewer.displayName}
                      </span>
                      {rev.reviewer.isVerifiedStudent && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      )}
                      <span className="text-[10px] text-neutral-400 font-mono">
                        · Order #{rev.orderId}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#62646a]">
                      {rev.reviewer.university} ({rev.reviewer.major})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.round(rev.overallRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-black text-[#222325] ml-1">
                      {rev.overallRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400">{rev.createdAt}</span>
                </div>
              </div>

              {/* Task title context */}
              <div className="text-xs font-semibold text-emerald-800 bg-emerald-50/70 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                <span className="text-neutral-500 font-normal">Đã hoàn thành Task:</span>
                <span className="text-[#222325]">{rev.taskTitle}</span>
              </div>

              {/* 3 Criteria breakdown chips */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 font-medium">
                  Chất lượng: <strong>{rev.ratingQuality}/5★</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 font-medium">
                  Đúng hạn: <strong>{rev.ratingTimeliness}/5★</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 font-medium">
                  Giao tiếp: <strong>{rev.ratingCommunication}/5★</strong>
                </span>
              </div>

              {/* Review Comment Body */}
              <p className="text-xs text-[#222325] leading-relaxed font-normal">
                &ldquo;{rev.comment}&rdquo;
              </p>

              {/* Review Tags */}
              {rev.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {rev.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Tasker Response / Phúc đáp */}
              {rev.response ? (
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-500 font-semibold text-[11px]">
                    <CornerDownRight className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Phản hồi từ bạn ({currentUser.displayName}):</span>
                  </div>
                  <p className="text-[#404145] pl-5 italic text-[11px] leading-relaxed">
                    &ldquo;{rev.response}&rdquo;
                  </p>
                </div>
              ) : (
                <div>
                  {replyInputId === rev.id ? (
                    <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2 text-xs">
                      <label className="block text-neutral-700 font-semibold text-[11px]">
                        Viết phản hồi công khai cho nhận xét này:
                      </label>
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Cảm ơn bạn đã tin tưởng giao task! Rất vui được đồng hành cùng bạn..."
                        className="w-full px-3 py-2 bg-white rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#1dbf73]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReplyInputId(null)}
                          className="px-3 py-1 font-semibold text-neutral-500 text-xs"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() => handleSendReply(rev.id)}
                          className="px-3.5 py-1 bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-xs rounded-lg cursor-pointer"
                        >
                          Gửi phản hồi
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setReplyInputId(rev.id);
                        setReplyText('');
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Viết phản hồi cảm ơn người đánh giá</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
