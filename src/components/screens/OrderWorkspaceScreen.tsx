import React, { useState } from 'react';
import { OrderItem, OrderMessage, DeliveryItem, UserMode } from '../../types';
import {
  ShieldCheck,
  Clock,
  Send,
  Upload,
  CheckCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
  Star,
  Download,
  Paperclip,
  Check,
  User,
  Briefcase,
} from 'lucide-react';

interface OrderWorkspaceScreenProps {
  order: OrderItem;
  messages: OrderMessage[];
  userMode?: UserMode;
  onSendMessage: (content: string) => void;
  onSubmitDelivery: (note: string, fileName: string) => void;
  onAcceptDelivery: (deliveryId: string) => void;
  onRequestRevision: (deliveryId: string, reason: string) => void;
  onBackToJobs: () => void;
  onOpenDispute?: (orderId: string) => void;
  onSubmitReview?: (reviewData: {
    ratingQuality: number;
    ratingTimeliness: number;
    ratingCommunication: number;
    comment: string;
  }) => void;
}

export const OrderWorkspaceScreen: React.FC<OrderWorkspaceScreenProps> = ({
  order,
  messages,
  userMode = 'REQUESTER',
  onSendMessage,
  onSubmitDelivery,
  onAcceptDelivery,
  onRequestRevision,
  onBackToJobs,
  onOpenDispute,
  onSubmitReview,
}) => {
  const [activeTab, setActiveTab] = useState<'CHAT' | 'DELIVERY'>('CHAT');
  const [newMessage, setNewMessage] = useState('');
  
  // Delivery form state
  const [deliveryNote, setDeliveryNote] = useState('');
  const [deliveryFileName, setDeliveryFileName] = useState('');
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);

  // Revision state
  const [revisionReason, setRevisionReason] = useState('');
  const [showRevisionForm, setShowRevisionForm] = useState(false);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [ratingComm, setRatingComm] = useState(5);
  const [ratingDesc, setRatingDesc] = useState(5);
  const [ratingRec, setRatingRec] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryNote.trim()) return;
    onSubmitDelivery(deliveryNote, deliveryFileName || 'san_pham_ban_giao_v' + (order.deliveries.length + 1) + '.zip');
    setDeliveryNote('');
    setDeliveryFileName('');
    setShowDeliveryForm(false);
  };

  const handleAcceptFinal = (deliveryId: string) => {
    onAcceptDelivery(deliveryId);
    setShowReviewModal(true);
  };

  const handleRevisionSubmit = (deliveryId: string) => {
    if (!revisionReason.trim()) return;
    onRequestRevision(deliveryId, revisionReason);
    setRevisionReason('');
    setShowRevisionForm(false);
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={onBackToJobs}
          className="text-xs font-semibold text-[#62646a] hover:text-[#222325] flex items-center gap-1 cursor-pointer"
        >
          &larr; Quay lại danh sách Order
        </button>
      </div>

      {/* Order Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#62646a]">
              <span className="font-mono font-bold text-[#222325]">Không gian Order: #{order.id}</span>
              <span aria-hidden="true">·</span>
              <span
                className={`font-bold px-2.5 py-0.5 rounded text-[11px] ${
                  order.status === 'IN_PROGRESS'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : order.status === 'DELIVERED'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : order.status === 'COMPLETED'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                {order.status === 'IN_PROGRESS'
                  ? 'Đang thực hiện'
                  : order.status === 'DELIVERED'
                  ? 'Đã gửi bàn giao - Chờ nghiệm thu'
                  : order.status === 'COMPLETED'
                  ? 'Đã nghiệm thu hoàn tất & Giải ngân'
                  : order.status}
              </span>
              <span aria-hidden="true">·</span>
              <span>Khởi tạo lúc {order.createdAt}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-[#222325] mt-1">
              {order.taskTitle}
            </h1>
          </div>

          {/* Escrow badge & Amount */}
          <div className="text-left md:text-right">
            <span className="text-xs text-[#62646a] block">Thù lao bảo chứng (Escrow)</span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
              {formatVND(order.agreedPrice)}
            </span>
            <div className="flex items-center md:justify-end gap-1 text-[11px] text-emerald-800 font-semibold mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tiền đã khóa tạm giữ an toàn 100%</span>
            </div>
          </div>
        </div>

        {/* Role Persona Banner */}
        <div
          className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            userMode === 'REQUESTER'
              ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
                userMode === 'REQUESTER' ? 'bg-indigo-600' : 'bg-emerald-600'
              }`}
            >
              {userMode === 'REQUESTER' ? (
                <User className="w-4 h-4" />
              ) : (
                <Briefcase className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="font-bold flex items-center gap-2">
                <span>
                  {userMode === 'REQUESTER'
                    ? 'Bạn đang ở chế độ: NGƯỜI YÊU CẦU (Bên thuê)'
                    : 'Bạn đang ở chế độ: NGƯỜI THỰC HIỆN (Bên nhận việc)'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white font-semibold border border-current">
                  {userMode === 'REQUESTER' ? 'Quyền Nghiệm thu & Duyệt' : 'Quyền Nộp sản phẩm & Nhận thù lao'}
                </span>
              </div>
              <p className="text-[11px] opacity-90 mt-0.5">
                {userMode === 'REQUESTER'
                  ? 'Bạn đã nạp và ký quỹ 100% thù lao qua Escrow. Kiểm tra kỹ file bàn giao trước khi bấm "Nghiệm thu & Giải ngân".'
                  : 'Thù lao đã được ký quỹ an toàn 100% tại hệ thống. Hãy hoàn thành sản phẩm và nộp file đúng hạn để nhận tiền về ví.'}
              </p>
            </div>
          </div>
        </div>

        {/* Counterparties & Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
            <span className="text-neutral-400 block text-[11px]">Người yêu cầu (Requester)</span>
            <div className="font-bold text-[#222325] mt-0.5">{order.requester.displayName}</div>
            <div className="text-[11px] text-[#62646a]">{order.requester.university}</div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
            <span className="text-neutral-400 block text-[11px]">Người thực hiện (Tasker)</span>
            <div className="font-bold text-[#222325] mt-0.5">{order.tasker.displayName}</div>
            <div className="text-[11px] text-[#62646a]">{order.tasker.university}</div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
            <span className="text-neutral-400 block text-[11px]">Hạn bàn giao mục tiêu</span>
            <div className="font-bold text-[#222325] mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>{order.deadline}</span>
            </div>
            <div className="text-[11px] text-blue-700 font-semibold">Theo dõi tự động theo giờ hệ thống</div>
          </div>
        </div>
      </div>

      {/* Tabs navigation: Chat vs Bàn giao */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Chat conversation (ORDER-02) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/90 shadow-xs flex flex-col h-[650px] overflow-hidden">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/60">
            <div>
              <h3 className="font-bold text-sm text-[#222325]">Hội thoại trực tiếp trong Order</h3>
              <p className="text-[11px] text-[#62646a]">Chỉ hai bên tham gia và Nhân viên hỗ trợ mới xem được tin nhắn</p>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          </div>

          {/* Messages list */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-[#fbfbfb]">
            {messages.map((msg) => {
              const isMe = msg.senderRole === 'TASKER';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${
                    isMe ? 'ml-auto' : 'mr-auto'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mb-1 px-1">
                    <span className="font-semibold text-neutral-700">{msg.senderName}</span>
                    <span>·</span>
                    <span>{msg.createdAt}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-[#1dbf73] text-white rounded-tr-xs'
                        : 'bg-white text-[#222325] border border-neutral-200/80 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <p>{msg.content}</p>

                    {msg.attachmentName && (
                      <div
                        className={`mt-2 p-2 rounded-xl flex items-center gap-2 text-[11px] font-semibold ${
                          isMe ? 'bg-emerald-800 text-white' : 'bg-neutral-50 text-[#222325]'
                        }`}
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>Tệp đính kèm: {msg.attachmentName}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message input */}
          <form onSubmit={handleSend} className="p-3 border-t border-neutral-100 bg-white flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn trao đổi về Task..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2.5 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white transition-colors disabled:opacity-40 cursor-pointer"
              aria-label="Gửi tin nhắn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Deliveries, Revision & Escrow Release (ORDER-03 -> ORDER-05) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Deliveries Box */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#222325]">Khu vực Bàn giao kết quả</h3>
                <p className="text-[11px] text-[#62646a]">Lịch sử nộp file & nghiệm thu (ORDER-03)</p>
              </div>

              {order.status !== 'COMPLETED' && (
                userMode === 'TASKER' ? (
                  <button
                    onClick={() => setShowDeliveryForm(!showDeliveryForm)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {showDeliveryForm ? 'Đóng form' : '+ Bàn giao tệp'}
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                    Chờ Tasker nộp file
                  </span>
                )
              )}
            </div>

            {/* Delivery submission form */}
            {showDeliveryForm && (
              <form onSubmit={handleDeliverySubmit} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3 text-xs">
                <h4 className="font-bold text-emerald-950">Gửi bàn giao sản phẩm mới</h4>
                <div>
                  <label className="block text-[#404145] font-semibold mb-1">Ghi chú bàn giao</label>
                  <textarea
                    rows={2}
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    placeholder="Mô tả các nội dung bạn đã hoàn thiện theo tiêu chuẩn nghiệm thu..."
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-emerald-300 focus:ring-2 focus:ring-[#1dbf73]"
                  />
                </div>
                <div>
                  <label className="block text-[#404145] font-semibold mb-1">Tên file sản phẩm đính kèm</label>
                  <input
                    type="text"
                    value={deliveryFileName}
                    onChange={(e) => setDeliveryFileName(e.target.value)}
                    placeholder="Ví dụ: Slide_Do_An_Tot_Nghiep_FTU_v1.pptx"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-emerald-300 focus:ring-2 focus:ring-[#1dbf73]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl cursor-pointer"
                >
                  Xác nhận nộp bàn giao
                </button>
              </form>
            )}

            {/* Deliveries list */}
            {order.deliveries.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#62646a] bg-neutral-50 rounded-2xl border border-neutral-200">
                Chưa có bản giao nào được nộp. Người thực hiện đang tiến hành làm việc.
              </div>
            ) : (
              <div className="space-y-4">
                {order.deliveries.map((del) => (
                  <div
                    key={del.id}
                    className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-[#222325]">Phiên bản v{del.version}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            del.status === 'ACCEPTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : del.status === 'REVISION_REQUESTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {del.status === 'ACCEPTED'
                            ? 'Đã nghiệm thu'
                            : del.status === 'REVISION_REQUESTED'
                            ? 'Đã yêu cầu sửa'
                            : 'Đang chờ Người yêu cầu duyệt'}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400">{del.createdAt}</span>
                    </div>

                    <p className="text-[#404145] leading-relaxed">
                      &ldquo;{del.note}&rdquo;
                    </p>

                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-neutral-200 text-[11px]">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-[#222325] truncate">{del.fileName}</span>
                        <span className="text-neutral-400">({del.fileSize})</span>
                      </div>
                      <button className="text-emerald-700 font-bold hover:underline shrink-0 flex items-center gap-1 cursor-pointer">
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải về</span>
                      </button>
                    </div>

                    {/* Actions for Deliveries: Requester vs Tasker */}
                    {order.status !== 'COMPLETED' && del.status === 'PENDING' && (
                      <div className="pt-2 border-t border-neutral-200">
                        {userMode === 'REQUESTER' ? (
                          <div className="flex items-center justify-between gap-2">
                            <button
                              onClick={() => setShowRevisionForm(true)}
                              className="flex-1 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Yêu cầu sửa</span>
                            </button>

                            <button
                              onClick={() => handleAcceptFinal(del.id)}
                              className="flex-1 py-2 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Nghiệm thu & Giải ngân</span>
                            </button>
                          </div>
                        ) : (
                          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-center">
                            <span className="font-semibold block">Đang chờ Người yêu cầu nghiệm thu</span>
                            <span className="text-[11px] text-amber-700">
                              Khi Người yêu cầu bấm xác nhận, thù lao sẽ tự động giải ngân vào Ví của bạn.
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Revision Request Form */}
            {showRevisionForm && (
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2 text-xs">
                <h4 className="font-bold text-rose-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Yêu cầu chỉnh sửa lại sản phẩm</span>
                </h4>
                <p className="text-[11px] text-rose-800">
                  Nêu rõ những điểm chưa đạt so với Tiêu chuẩn nghiệm thu ban đầu để bạn Tasker chỉnh sửa.
                </p>
                <textarea
                  rows={2}
                  value={revisionReason}
                  onChange={(e) => setRevisionReason(e.target.value)}
                  placeholder="Ví dụ: Thiếu 2 biểu đồ so sánh ở slide 14 và màu nền chưa đúng Navy..."
                  className="w-full px-3 py-2 bg-white rounded-xl border border-rose-300"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowRevisionForm(false)}
                    className="px-3 py-1 font-semibold text-neutral-600"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleRevisionSubmit(order.deliveries[0]?.id || 'del-1')}
                    className="px-4 py-1.5 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer"
                  >
                    Gửi yêu cầu sửa
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Safety & Support Card */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-2.5">
            <h4 className="font-bold text-[#222325]">Bảo vệ quyền lợi giao dịch</h4>
            <p className="text-[11px] text-[#62646a] leading-relaxed">
              Mọi thay đổi trạng thái đều được lưu vào Audit Log. Nếu có bất kỳ tranh chấp nào, bạn có thể gửi yêu cầu can thiệp để Staff VIETVI đối chiếu tin nhắn và file bàn giao.
            </p>
            {onOpenDispute && (
              <button
                type="button"
                onClick={() => onOpenDispute(order.id)}
                className="w-full py-2 px-3 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Mở khiếu nại / Yêu cầu can thiệp tranh chấp</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3-Dimensional Rating Modal on Completion (TRUST-01 / TRUST-02) */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-neutral-200 shadow-2xl">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-2">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-lg font-bold text-[#222325]">Nghiệm thu Order thành công!</h3>
              <p className="text-xs text-[#62646a]">
                Thù lao <strong>{formatVND(order.agreedPrice)}</strong> đã được giải ngân cho Người thực hiện. Hãy đánh giá trải nghiệm 3 tiêu chí để xây dựng niềm tin sinh viên:
              </p>
            </div>

            {reviewSubmitted ? (
              <div className="text-center py-4 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-2xl border border-emerald-200">
                Cảm ơn bạn! Đánh giá 3 tiêu chí đã được lưu vào hồ sơ uy tín công khai của bạn Tasker.
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Criterion 1: Communication */}
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="font-semibold text-[#222325]">1. Mức độ giao tiếp & phản hồi</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingComm(star)}
                        className={`text-base cursor-pointer ${star <= ratingComm ? 'text-amber-500' : 'text-neutral-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Criterion 2: Quality as described */}
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="font-semibold text-[#222325]">2. Chất lượng đúng như mô tả</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingDesc(star)}
                        className={`text-base cursor-pointer ${star <= ratingDesc ? 'text-amber-500' : 'text-neutral-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Criterion 3: Recommendation */}
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="font-semibold text-[#222325]">3. Khả năng giới thiệu cho bạn bè</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingRec(star)}
                        className={`text-base cursor-pointer ${star <= ratingRec ? 'text-amber-500' : 'text-neutral-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Written review */}
                <div>
                  <label className="block text-[#404145] font-semibold mb-1">Lời nhận xét ngắn</label>
                  <textarea
                    rows={2}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Viết vài lời cảm ơn hoặc góp ý cho bạn sinh viên này..."
                    className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 font-semibold text-[#62646a] hover:bg-neutral-100 rounded-xl"
                  >
                    Bỏ qua
                  </button>
                  <button
                    onClick={() => {
                      if (onSubmitReview) {
                        onSubmitReview({
                          ratingQuality: ratingDesc,
                          ratingTimeliness: ratingRec,
                          ratingCommunication: ratingComm,
                          comment: reviewText || 'Bạn sinh viên hoàn thành tốt công việc, rất hài lòng!',
                        });
                      }
                      setReviewSubmitted(true);
                      setTimeout(() => {
                        setShowReviewModal(false);
                      }, 1400);
                    }}
                    className="px-5 py-2 font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl cursor-pointer"
                  >
                    Lưu đánh giá
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
