import React, { useState } from 'react';
import { DisputeItem, OrderItem } from '../../types';
import {
  AlertTriangle,
  ShieldCheck,
  Scale,
  CheckCircle,
  Clock,
  ArrowRight,
  FileText,
  User,
  Plus,
  X,
} from 'lucide-react';

interface DisputeCenterScreenProps {
  disputes: DisputeItem[];
  orders: OrderItem[];
  onOpenDispute: (orderId: string, reason: string) => void;
  onAdminResolveDispute: (disputeId: string, resolutionType: 'REFUND' | 'PAYOUT') => void;
  isAdmin: boolean;
  onBackToOrders: () => void;
}

export const DisputeCenterScreen: React.FC<DisputeCenterScreenProps> = ({
  disputes,
  orders,
  onOpenDispute,
  onAdminResolveDispute,
  isAdmin,
  onBackToOrders,
}) => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.length > 0 ? orders[0].id : ''
  );
  const [disputeReason, setDisputeReason] = useState<string>('');

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !disputeReason.trim()) return;

    onOpenDispute(selectedOrderId, disputeReason);
    setDisputeReason('');
    setShowCreateModal(false);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider mb-1">
            <span>Trung tâm Tranh chấp &amp; Khiếu nại (Luồng D)</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#62646a]">Vận hành có con người tham gia (Human-in-the-loop)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
            Giải quyết Bất đồng Giao dịch &amp; Nghiệm thu
          </h1>
          <p className="text-xs sm:text-sm text-[#62646a] mt-1">
            Bảo vệ công bằng cho cả Người yêu cầu và Người thực hiện khi kết quả bàn giao không đúng với Expected Output ban đầu.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Mở khiếu nại cho Order</span>
        </button>
      </div>

      {/* 3-Step Arbitration Guarantee */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-rose-700 font-mono">BƯỚC 1</span>
          <h4 className="font-bold text-sm text-[#222325]">Mở khiếu nại &amp; Khóa tiền</h4>
          <p className="text-xs text-[#62646a] leading-relaxed">
            Ngân sách của Order được tạm dừng giải ngân để bảo đảm không bên nào bị mất tiền oan.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-purple-700 font-mono">BƯỚC 2</span>
          <h4 className="font-bold text-sm text-[#222325]">Staff đối chiếu chứng cứ</h4>
          <p className="text-xs text-[#62646a] leading-relaxed">
            Đội ngũ Hỗ trợ VIETVI đọc tin nhắn trao đổi, kiểm tra file đính kèm và tiêu chuẩn Expected Output.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-emerald-700 font-mono">BƯỚC 3</span>
          <h4 className="font-bold text-sm text-[#222325]">Phán quyết &amp; Giải ngân công bằng</h4>
          <p className="text-xs text-[#62646a] leading-relaxed">
            Hoàn trả 100% ngân sách nếu Tasker bỏ dở, hoặc giải ngân cho Tasker nếu sản phẩm đã đạt chuẩn.
          </p>
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#222325]">
          Danh sách các vụ khiếu nại đang xử lý ({disputes.length})
        </h3>

        {disputes.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-neutral-200 text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-[#222325]">Không có tranh chấp nào</h4>
            <p className="text-xs text-[#62646a]">
              Mọi giao dịch trên VIETVI đang diễn ra thuận lợi và đúng hạn.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map((dsp) => (
              <div
                key={dsp.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2 text-xs text-[#62646a]">
                    <span className="font-mono font-bold text-rose-700">Mã khiếu nại: #{dsp.id}</span>
                    <span>·</span>
                    <span>Đơn hàng: #{dsp.orderId}</span>
                    <span>·</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        dsp.status === 'INVESTIGATING'
                          ? 'bg-amber-100 text-amber-800'
                          : dsp.status === 'RESOLVED_REFUND'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {dsp.status === 'INVESTIGATING'
                        ? 'Đang điều tra & Đối chiếu'
                        : dsp.status === 'RESOLVED_REFUND'
                        ? 'Đã xử lý: Hoàn tiền Requester'
                        : 'Đã xử lý: Giải ngân Tasker'}
                    </span>
                  </div>

                  <span className="text-xs text-neutral-400 font-mono">{dsp.createdAt}</span>
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#222325]">
                    {dsp.taskTitle}
                  </h4>
                  <p className="text-xs text-neutral-700 bg-neutral-50 p-3.5 rounded-xl border border-neutral-100 mt-2 leading-relaxed">
                    <strong>Nội dung phản ánh:</strong> &ldquo;{dsp.reason}&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <span className="text-neutral-400 block text-[11px]">Bên mở khiếu nại:</span>
                    <strong className="text-[#222325]">{dsp.claimant.displayName}</strong>
                    <p className="text-[11px] text-[#62646a]">{dsp.claimant.university}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <span className="text-neutral-400 block text-[11px]">Bên bị khiếu nại:</span>
                    <strong className="text-[#222325]">{dsp.defendant.displayName}</strong>
                    <p className="text-[11px] text-[#62646a]">{dsp.defendant.university}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <span className="text-neutral-400 block text-[11px]">Số tiền đang tạm khóa:</span>
                    <strong className="text-base font-mono text-rose-700">{formatVND(dsp.amount)}</strong>
                  </div>
                </div>

                {dsp.resolution && (
                  <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                    <span className="font-bold block">Kết luận từ Đội ngũ Quản trị VIETVI:</span>
                    <p>{dsp.resolution}</p>
                  </div>
                )}

                {/* Admin Arbitration Controls */}
                {dsp.status === 'INVESTIGATING' && (
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100">
                    <span className="text-xs text-[#62646a]">
                      Quyền phán quyết Staff / Quản trị viên:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAdminResolveDispute(dsp.id, 'REFUND')}
                        className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                      >
                        Phán quyết: Hoàn 100% tiền cho Người yêu cầu
                      </button>
                      <button
                        onClick={() => onAdminResolveDispute(dsp.id, 'PAYOUT')}
                        className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
                      >
                        Phán quyết: Giải ngân thù lao cho Người thực hiện
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Dispute Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div
            className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-[#222325]">
                  Mở yêu cầu can thiệp tranh chấp
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-[#404145] mb-1">
                  Chọn Đơn hàng Order cần khiếu nại
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-rose-500"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      #{o.id} - {o.taskTitle} ({formatVND(o.agreedPrice)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#404145] mb-1">
                  Lý do chi tiết &amp; Bằng chứng vi phạm Expected Output
                </label>
                <textarea
                  rows={4}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Nêu rõ những điểm sản phẩm bàn giao không đạt yêu cầu, mốc thời gian vi phạm hoặc yêu cầu ngoài thỏa thuận..."
                  required
                  className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-[11px] text-rose-900">
                Khi gửi khiếu nại, ngân sách sẽ được bảo vệ khóa tạm giữ cho đến khi Staff có kết luận chính thức.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-[#62646a] hover:bg-neutral-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Gửi yêu cầu can thiệp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
