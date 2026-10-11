import React, { useState } from 'react';
import { HelpTopic } from '../../types';
import { MOCK_HELP_TOPICS } from '../../data/mockData';
import {
  HelpCircle,
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  MessageSquare,
  Lock,
  GraduationCap,
  Scale,
  Wallet,
  CheckCircle2,
  FileQuestion,
  Headphones,
} from 'lucide-react';

interface HelpCenterScreenProps {
  onBackToHome?: () => void;
  onOpenDispute?: () => void;
}

export const HelpCenterScreen: React.FC<HelpCenterScreenProps> = ({
  onBackToHome,
  onOpenDispute,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string>(MOCK_HELP_TOPICS[0].id);

  // Ticket Form state
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketCategory, setTicketCategory] = useState('ESCROW');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const categories = [
    { id: 'ALL', label: 'Tất cả chủ đề' },
    { id: 'ESCROW', label: 'Bảo vệ Escrow', icon: <Lock className="w-3.5 h-3.5" /> },
    { id: 'STUDENT_RULES', label: 'Liêm chính Học thuật', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'DISPUTE', label: 'Khiếu nại & Hòa giải', icon: <Scale className="w-3.5 h-3.5" /> },
    { id: 'WITHDRAWAL', label: 'Rút tiền & Phí', icon: <Wallet className="w-3.5 h-3.5" /> },
    { id: 'SAFETY', label: 'An toàn & Tick Xanh', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  const filteredTopics = MOCK_HELP_TOPICS.filter((topic) => {
    if (selectedCategory !== 'ALL' && topic.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        topic.title.toLowerCase().includes(q) ||
        topic.summary.toLowerCase().includes(q) ||
        topic.content.some((c) => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketEmail || !ticketMessage) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketName('');
      setTicketEmail('');
      setTicketMessage('');
      setTicketSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Trung tâm Trợ giúp &amp; An toàn Sinh viên</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#222325] tracking-tight">
            Chúng tôi có thể giúp gì cho bạn?
          </h1>
          <p className="text-sm text-neutral-600 mt-2">
            Tìm hiểu cơ chế ký quỹ Escrow bảo vệ thù lao, quy định liêm chính học thuật và hướng dẫn xử lý tranh chấp 24/7.
          </p>

          {/* Search bar */}
          <div className="mt-6 relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm: cơ chế escrow, rút tiền bao lâu, hủy task..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-200 rounded-2xl text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1dbf73]/30 focus:border-[#1dbf73]"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8 justify-start sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-14">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => {
              const isExpanded = expandedId === topic.id;
              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? '' : topic.id)}
                    className="w-full text-left p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-neutral-50/50"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {topic.category}
                      </span>
                      <h3 className="text-base font-bold text-[#222325] mt-2">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        {topic.summary}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-neutral-100 text-neutral-600 shrink-0 mt-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-neutral-100 text-xs text-neutral-600 leading-relaxed space-y-2.5 bg-neutral-50/40">
                      {topic.content.map((p, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1dbf73] mt-1.5 shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200 text-neutral-400 text-xs">
              Không tìm thấy chủ đề hướng dẫn nào phù hợp với từ khóa "{searchQuery}".
            </div>
          )}
        </div>

        {/* Support Ticket Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#222325]">
                Vẫn cần hỗ trợ thêm?
              </h2>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Đội ngũ sinh viên phụ trách hỗ trợ trực tuyến 24/7 từ Bách Khoa, NEU, FTU luôn sẵn sàng phản hồi trong vòng 15 phút.
              </p>
            </div>

            <div className="pt-2 space-y-2 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Hotline khẩn cấp: 1900 6868 (8:00 - 22:00)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Email: support@vietvi.edu.vn</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Hòa giải tranh chấp mở trực tiếp trong Order</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            {ticketSubmitted ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-900">
                  Đã tiếp nhận yêu cầu hỗ trợ thành công!
                </h3>
                <p className="text-xs text-emerald-700">
                  Mã vé: #SUP-{(Date.now() % 10000)}. Chúng tôi sẽ phản hồi qua email của bạn trong ít phút.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                      Họ và tên sinh viên
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                      Email liên hệ (.edu.vn / cá nhân)
                    </label>
                    <input
                      type="email"
                      required
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      placeholder="ban@sis.hust.edu.vn"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                    Chủ đề cần giải quyết
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 cursor-pointer focus:bg-white focus:outline-none focus:border-[#1dbf73]"
                  >
                    <option value="ESCROW">Ký quỹ Escrow &amp; Thanh toán</option>
                    <option value="ORDER">Đơn hàng &amp; Nghiệm thu sản phẩm</option>
                    <option value="DISPUTE">Khiếu nại / Hòa giải</option>
                    <option value="VERIFY">Xác minh Thẻ sinh viên</option>
                    <option value="OTHER">Vấn đề khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                    Nội dung mô tả chi tiết
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Mô tả cụ thể mã Task hoặc đơn hàng bạn cần trợ giúp..."
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#1dbf73]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi yêu cầu trợ giúp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
