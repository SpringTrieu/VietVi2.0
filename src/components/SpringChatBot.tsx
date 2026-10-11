import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Minus,
  Maximize2,
  Minimize2,
  RotateCcw,
  ShieldCheck,
  Wallet,
  PlusCircle,
  Briefcase,
  AlertTriangle,
  GraduationCap,
  Building,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
} from 'lucide-react';
import { ActiveScreen, UserMode, UserProfile } from '../types';

interface SpringChatBotProps {
  currentUser?: UserProfile;
  userMode: UserMode;
  onNavigateToScreen: (screen: ActiveScreen) => void;
  onOpenPostTask: () => void;
  onOpenVerify: () => void;
  onToggleUserMode: () => void;
}

type ChatActionType =
  | 'POST_TASK'
  | 'VERIFY_KYC'
  | 'OPEN_WALLET'
  | 'OPEN_DISPUTES'
  | 'OPEN_CAMPUS'
  | 'EXPLORE_TASKS'
  | 'TOGGLE_MODE'
  | 'OPEN_ORDERS'
  | 'OPEN_INTEGRITY'
  | 'OPEN_ANALYTICS'
  | 'OPEN_PORTFOLIO';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini-3.8-flash' | 'spring-ai' | 'local-knowledge';
  actions?: Array<{
    label: string;
    actionType: ChatActionType;
    iconName?: string;
  }>;
}

const INITIAL_SUGGESTIONS = [
  {
    icon: '🛡️',
    text: 'Cơ chế Ký quỹ Escrow 100% hoạt động thế nào?',
    query: 'Giải thích cơ chế bảo vệ tiền Ký quỹ Escrow tại VIETVI',
  },
  {
    icon: '💸',
    text: 'Phí sàn VIETVI và quy định rút tiền về ngân hàng?',
    query: 'Phí sàn VIETVI là bao nhiêu và cách nạp rút tiền về ngân hàng/MoMo?',
  },
  {
    icon: '📝',
    text: 'Cách đăng Task mới và nghiệm thu sản phẩm?',
    query: 'Làm sao để đăng một Task mới đúng chuẩn và nghiệm thu sản phẩm?',
  },
  {
    icon: '🎓',
    text: 'Xác thực Tick xanh Sinh viên có lợi ích gì?',
    query: 'Lợi ích của việc xác minh Thẻ sinh viên (Tick xanh) và quy trình duyệt KYC?',
  },
  {
    icon: '⚖️',
    text: 'Quy trình giải quyết nếu xảy ra tranh chấp công việc?',
    query: 'Nếu xảy ra tranh chấp giữa Người thuê và Người làm thì ai giải quyết và bao lâu?',
  },
  {
    icon: '🏆',
    text: 'Campus Hub và xếp hạng sinh viên các trường?',
    query: 'Campus Hub của VIETVI là gì và cách tham gia bảng vàng sinh viên?',
  },
];

export const SpringChatBot: React.FC<SpringChatBotProps> = ({
  currentUser,
  userMode,
  onNavigateToScreen,
  onOpenPostTask,
  onOpenVerify,
  onToggleUserMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Xin chào ${currentUser?.displayName ? currentUser.displayName : 'bạn'}! 🌱 Mình là **Spring ChatBot** — Trợ lý AI thông minh của nền tảng **VIETVI**.

Mình nắm rõ toàn bộ quy chế, chính sách ký quỹ Escrow 100%, biểu phí 0%, hướng dẫn nhận việc, đăng việc và xử lý tranh chấp của VIETVI. Bạn cần mình hỗ trợ điều gì hôm nay?`,
      timestamp: 'Vừa xong',
      source: 'gemini-3.8-flash',
      actions: [
        { label: '🛡️ Xem cơ chế Escrow', actionType: 'OPEN_WALLET' },
        { label: '🚀 Đăng việc mới', actionType: 'POST_TASK' },
        { label: '🎓 Nhận Tick xanh SV', actionType: 'VERIFY_KYC' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasUnreadNotification(false);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Chào bạn! Mình là **Spring ChatBot** đã sẵn sàng phiên trò chuyện mới. Hãy chọn gợi ý câu hỏi bên dưới hoặc nhập nội dung bạn thắc mắc nhé!`,
        timestamp: 'Vừa xong',
        source: 'gemini-3.8-flash',
        actions: [
          { label: '🛡️ Bảo vệ Ký quỹ', actionType: 'OPEN_WALLET' },
          { label: '🚀 Đăng việc mới', actionType: 'POST_TASK' },
        ],
      },
    ]);
  };

  // Local Semantic Intelligence Engine (Instant fallback & Action generator)
  const getLocalKnowledgeResponse = (query: string): { reply: string; actions?: ChatMessage['actions'] } => {
    const q = query.toLowerCase();

    if (q.includes('escrow') || q.includes('ký quỹ') || q.includes('an toàn') || q.includes('bảo vệ')) {
      return {
        reply: `🛡️ **Cơ chế Ký quỹ Escrow 100% tại VIETVI:**

1. **Khóa quỹ an toàn**: Khi Người yêu cầu chấp nhận báo giá, thù lao được khóa lại trong hệ thống ký quỹ của VIETVI, không bên nào tự ý rút được.
2. **Bảo vệ Người làm (Tasker)**: Bạn yên tâm làm bài vì tiền đã nằm chắc chắn trong quỹ, không bao giờ bị bùng tiền công.
3. **Bảo vệ Người thuê (Requester)**: Tiền chỉ được giải ngân cho Tasker khi bạn nhận file sản phẩm và bấm "Nghiệm thu hài lòng" (hoặc hết 48h tự động nghiệm thu).
4. **Trọng tài công minh**: Nếu đối phương không bàn giao hoặc làm sai yêu cầu, sàn sẽ hoàn tiền 100% cho bạn.`,
        actions: [
          { label: 'Mở Ví Escrow & Quản lý số dư', actionType: 'OPEN_WALLET' },
          { label: 'Khám phá các Task đang mở', actionType: 'EXPLORE_TASKS' },
        ],
      };
    }

    if (q.includes('phí sàn') || q.includes('rút tiền') || q.includes('nạp tiền') || q.includes('ngân hàng') || q.includes('momo')) {
      return {
        reply: `💸 **Chính sách Phí sàn & Giao dịch Tài chính:**

- **Phí sàn**: Hiện tại là **0%** dành trọn vẹn cho sinh viên (hoàn toàn miễn phí, bạn nhận trọn 100% số tiền thù lao đã thỏa thuận).
- **Nạp tiền ví ký quỹ**: Hỗ trợ chuyển khoản ngân hàng qua mã QR VietQR, cổng VNPay và ví điện tử MoMo tức thì.
- **Rút tiền về tài khoản**: 
  - Hạn mức rút tối thiểu: **50.000 VNĐ**.
  - Thời gian xử lý: Tiền về tài khoản ngân hàng chính chủ hoặc MoMo trong vòng **15 - 30 phút**.
  - Không giới hạn số lần rút trong ngày.`,
        actions: [
          { label: 'Xem Ví Ký quỹ cá nhân', actionType: 'OPEN_WALLET' },
        ],
      };
    }

    if (q.includes('đăng task') || q.includes('đăng việc') || q.includes('tạo task') || q.includes('thuê')) {
      return {
        reply: `📝 **Quy trình Đăng Task mới trên VIETVI:**

1. **Điền thông tin Task**: Nhập tiêu đề rõ ràng, mô tả công việc, file tài liệu nguồn sẵn có và **Kết quả nghiệm thu cụ thể (Expected Output)**.
2. **Thiết lập Ngân sách & Hạn chót**: Nhập mức thù lao (tối thiểu 50.000đ) và thời hạn hoàn thành bàn giao.
3. **Chọn Hình thức**: Làm *Online 100%* hoặc *Onsite gặp trực tiếp tại trường*.
4. **Khóa quỹ Escrow**: Sau khi nạp bảo chứng, Task của bạn sẽ xuất hiện trên sàn để hàng nghìn sinh viên gửi báo giá cạnh tranh chỉ sau 15 phút!`,
        actions: [
          { label: '+ Mở form Đăng Task mới ngay', actionType: 'POST_TASK' },
        ],
      };
    }

    if (q.includes('tick xanh') || q.includes('xác thực') || q.includes('kyc') || q.includes('thẻ sinh viên') || q.includes('thẻ sv')) {
      return {
        reply: `🎓 **Xác thực Thẻ sinh viên (Huy hiệu Tick xanh KYC):**

- **Lợi ích vượt trội**:
  - Tăng **3.5 lần** tỷ lệ được Người yêu cầu chọn giao việc.
  - Được ưu tiên đẩy báo giá lên đầu danh sách.
  - Mở khóa các Task ngân sách cao (> 1.000.000 VNĐ).
  - Được Staff hỗ trợ ưu tiên tối đa khi phát sinh tranh chấp.
- **Cách thực hiện**:
  1. Chụp ảnh rõ nét 2 mặt Thẻ sinh viên đang theo học.
  2. Nhập MSSV và Email trường cấp (.edu.vn).
  3. Chuyên viên Vận hành (Staff Ops) thẩm định và phê duyệt trong vòng **2 giờ**.`,
        actions: [
          { label: 'Nộp ảnh Thẻ SV xác minh ngay', actionType: 'VERIFY_KYC' },
        ],
      };
    }

    if (q.includes('tranh chấp') || q.includes('khiếu nại') || q.includes('hòa giải') || q.includes('lừa đảo') || q.includes('bùng')) {
      return {
        reply: `⚖️ **Cơ chế Xử lý Tranh chấp & Hòa giải 2 cấp tại VIETVI:**

1. **Cấp 1 - Hòa giải Sơ thẩm (Staff Ops)**:
   - Khi có khiếu nại, Chuyên viên Vận hành can thiệp trong 24 giờ.
   - Staff đối chiếu lịch sử chat, file bàn giao và yêu cầu ban đầu.
   - Các phán quyết khả thi: Hoàn tiền 100% cho Requester, Giải ngân 100% cho Tasker, hoặc chia tỷ lệ 50/50.
2. **Cấp 2 - Chung thẩm Tối cao (Super Admin)**:
   - Nếu vụ việc có yếu tố gian lận có tổ chức hoặc 2 bên không chấp thuận hòa giải sơ thẩm, Staff chuyển hồ sơ lên Admin.
   - Super Admin đưa ra phán quyết chung thẩm cuối cùng, có quyền khóa tài khoản vĩnh viễn kẻ gian lận hoặc kích hoạt Quỹ bảo chứng VIETVI bồi thường.`,
        actions: [
          { label: 'Xem Trung tâm Khiếu nại', actionType: 'OPEN_DISPUTES' },
        ],
      };
    }

    if (q.includes('campus') || q.includes('bảng vàng') || q.includes('trường') || q.includes('xếp hạng')) {
      return {
        reply: `🏆 **Campus Hub — Không gian Kết nối & Bảng vàng Sinh viên:**

- **Bảng xếp hạng danh giá**: Tôn vinh các bạn sinh viên có điểm uy tín cao nhất (5.0★), số lượng Task hoàn thành xuất sắc và đánh giá 360° tích cực từ cộng đồng.
- **Lọc theo từng trường**: Xem bảng vàng riêng của trường bạn (*Bách Khoa HUST, Ngoại Thương FTU, Kinh Tế NEU, Công Nghệ UET, Bách Khoa HCMUT...*).
- **Quy tắc Liêm chính học thuật**: Tra cứu bộ quy tắc ứng xử học thuật được cam kết bởi cộng đồng sinh viên văn minh.`,
        actions: [
          { label: 'Khám phá Campus Hub ngay', actionType: 'OPEN_CAMPUS' },
        ],
      };
    }

    if (q.includes('kiếm tiền') || q.includes('tìm việc') || q.includes('báo giá') || q.includes('slide') || q.includes('code')) {
      return {
        reply: `💼 **Cách sinh viên gia tăng thu nhập trên VIETVI:**

1. **Chuyển sang Chế độ Người thực hiện (Tasker)** bằng thanh chuyển đổi vai trò.
2. **Lọc Task phù hợp chuyên môn**: Thiết kế slide Canva/PowerPoint, viết code Python/Web, phân tích số liệu SPSS/Excel, dịch thuật, gia sư.
3. **Gửi báo giá cạnh tranh**: Nêu rõ thù lao mong muốn, cam kết số ngày bàn giao và đính kèm sản phẩm mẫu (Portfolio).
4. **Bàn giao đúng hạn**: Nhận đánh giá 5★ và nhận tiền thù lao giải ngân vào ví tức thì!`,
        actions: [
          { label: 'Xem các Task đang tuyển trên Sàn', actionType: 'EXPLORE_TASKS' },
          { label: 'Đổi sang Chế độ Tasker', actionType: 'TOGGLE_MODE' },
        ],
      };
    }

    if (q.includes('liêm chính') || q.includes('thi hộ') || q.includes('đạo văn') || q.includes('luận văn') || q.includes('quy chế')) {
      return {
        reply: `⚖️ **Chính sách Liêm chính Học thuật tại VIETVI:**
- **Tuyệt đối nghiêm cấm**: Thi hộ, kiểm tra hộ (cả online và offline), làm hộ 100% luận văn/khóa luận tốt nghiệp, mua bán đề thi rò rỉ. Vi phạm sẽ bị đóng băng vĩnh viễn và báo cáo về trường ĐH.
- **Được phép hoạt động**: Gia sư giải thích bài, hướng dẫn lập trình & sửa lỗi debug, thiết kế slide thuyết trình, định dạng văn bản chuẩn APA/IEEE, dịch thuật tài liệu tiếng Anh học thuật.
- Bạn có thể ký **Cam kết Liêm chính Điện tử** để nhận huy hiệu kiểm định trên hồ sơ!`,
        actions: [
          { label: 'Xem Chính sách Liêm chính SV (INTEGRITY-01)', actionType: 'OPEN_INTEGRITY' },
        ],
      };
    }

    if (q.includes('đơn hàng') || q.includes('hợp đồng') || q.includes('order') || q.includes('tiến độ')) {
      return {
        reply: `📋 **Quản lý Đơn hàng & Hợp đồng (ORDER-01):**
- Màn hình **Quản lý Đơn hàng** giúp bạn theo dõi tất cả hợp đồng hai phía (Bên thuê & Sinh viên làm việc).
- Bộ lọc trạng thái: Đang làm, Chờ nghiệm thu, Cần sửa bài, Đã hoàn thành, Tranh chấp.
- Có thể xem và tải **Phiếu Chứng nhận Hợp đồng Điện tử & Biên lai Ký quỹ** có mã QR và chữ ký số để nộp giấy tờ học thuật hoặc thanh quyết toán cá nhân!`,
        actions: [
          { label: 'Mở Quản lý Đơn hàng (ORDER-01)', actionType: 'OPEN_ORDERS' },
        ],
      };
    }

    if (q.includes('thống kê') || q.includes('doanh thu') || q.includes('thu nhập') || q.includes('hiệu suất')) {
      return {
        reply: `📊 **Thống kê Thu nhập & Năng lực Sinh viên (ANALYTICS-01):**
- Báo cáo tài chính cá nhân: Tổng thu nhập đã nhận, tiền đang ký quỹ an toàn.
- Biểu đồ doanh thu theo tuần/tháng và cơ cấu nguồn thu theo danh mục (Lập trình, Thiết kế, Gia sư, Dịch thuật).
- Chỉ số SLA: Tỷ lệ bàn giao đúng hạn (98.8%), điểm CSAT trung bình (4.98★).
- Phân tích xu hướng kỹ năng hot có nhu cầu cao trên campus và mức giá trung bình thị trường!`,
        actions: [
          { label: 'Xem Báo cáo Phân tích Thu nhập (ANALYTICS-01)', actionType: 'OPEN_ANALYTICS' },
          { label: 'Quản lý Ví rút tiền', actionType: 'OPEN_WALLET' },
        ],
      };
    }

    // Default general response
    return {
      reply: `Cảm ơn câu hỏi của bạn về **"${query}"**! 

VIETVI là sàn việc làm micro-task hai chiều dành riêng cho sinh viên Việt Nam với các trụ cột:
- 🛡️ **Ký quỹ Escrow 100%**: An toàn tuyệt đối cho cả 2 bên.
- 💸 **0% phí sàn**: Miễn phí cho sinh viên, nạp rút nhanh qua QR/MoMo.
- 🎓 **Huy hiệu Tick xanh**: Thẩm định thẻ sinh viên chính chủ.
- ⚖️ **Hòa giải chuyên nghiệp**: Đội ngũ Staff và Admin trực 24/7.

Bạn có thể bấm vào các nút điều hướng nhanh bên dưới để thao tác ngay nhé!`,
      actions: [
        { label: '🚀 Đăng việc mới', actionType: 'POST_TASK' },
        { label: '🔍 Tìm việc làm', actionType: 'EXPLORE_TASKS' },
        { label: '💳 Ví Escrow', actionType: 'OPEN_WALLET' },
      ],
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Vừa xong',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      // Call server-side API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const res = await fetch('/api/spring-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const localActions = getLocalKnowledgeResponse(text).actions;

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply || getLocalKnowledgeResponse(text).reply,
          timestamp: 'Vừa xong',
          source: data.source || 'gemini-3.8-flash',
          actions: localActions,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      // Resilient fallback to local semantic knowledge base
      const fallback = getLocalKnowledgeResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-fb-${Date.now()}`,
        sender: 'assistant',
        text: fallback.reply,
        timestamp: 'Vừa xong',
        source: 'local-knowledge',
        actions: fallback.actions,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAction = (actionType: ChatActionType) => {
    switch (actionType) {
      case 'POST_TASK':
        onOpenPostTask();
        break;
      case 'VERIFY_KYC':
        onOpenVerify();
        break;
      case 'OPEN_WALLET':
        onNavigateToScreen('WALLET');
        break;
      case 'OPEN_DISPUTES':
        onNavigateToScreen('DISPUTES');
        break;
      case 'OPEN_CAMPUS':
        onNavigateToScreen('CAMPUS_HUB');
        break;
      case 'OPEN_ORDERS':
        onNavigateToScreen('ORDER_MANAGEMENT');
        break;
      case 'OPEN_INTEGRITY':
        onNavigateToScreen('INTEGRITY_POLICY');
        break;
      case 'OPEN_ANALYTICS':
        onNavigateToScreen('STUDENT_ANALYTICS');
        break;
      case 'OPEN_PORTFOLIO':
        onNavigateToScreen('PUBLIC_PORTFOLIO');
        break;
      case 'EXPLORE_TASKS': {
        const el = document.getElementById('market-tasks');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          onNavigateToScreen('HOME');
        }
        break;
      }
      case 'TOGGLE_MODE':
        onToggleUserMode();
        break;
    }
  };

  return (
    <>
      {/* 1. Floating Action Button (FAB) at Bottom-Right */}
      {!isOpen && (
        <aside
          aria-label="Khởi chạy trợ lý AI Spring ChatBot"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3"
        >
          {/* Welcome Hint Pill */}
          <div
            onClick={handleOpenChat}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-emerald-200 shadow-lg text-xs font-semibold text-neutral-800 cursor-pointer hover:border-emerald-400 transition-all group"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Hỏi <strong>Spring ChatBot</strong> về VIETVI</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Glowing Green FAB Button */}
          <button
            onClick={handleOpenChat}
            className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-500 to-[#19a463] text-white flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title="Mở trợ lý ảo Spring ChatBot"
          >
            <div className="absolute inset-0 rounded-2xl bg-emerald-400/30 animate-ping pointer-events-none" />
            <Bot className="w-7 h-7 text-white group-hover:rotate-6 transition-transform" />

            {/* Online Indicator Badge */}
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-[9px] font-bold text-neutral-900">
              ✨
            </span>

            {hasUnreadNotification && (
              <span className="absolute -top-1.5 -left-1.5 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-extrabold shadow-xs">
                Mới
              </span>
            )}
          </button>
        </aside>
      )}

      {/* 2. Minimized Floating Bar */}
      {isOpen && isMinimized && (
        <div className="fixed bottom-5 right-5 z-40 bg-neutral-900 text-white p-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-neutral-700 animate-in fade-in">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-1.5">
              <span>Spring ChatBot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-neutral-400">Trợ lý AI VIETVI đang trực tuyến</p>
          </div>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer ml-2"
            title="Mở lại khung chat"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-neutral-800 cursor-pointer"
            title="Đóng chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Interactive Floating Chatbot Modal / Panel */}
      {isOpen && !isMinimized && (
        <section
          aria-label="Hộp trò chuyện Spring ChatBot"
          className={`fixed z-50 transition-all duration-300 shadow-2xl bg-white border border-neutral-200 overflow-hidden flex flex-col ${
            isExpanded
              ? 'inset-3 sm:inset-6 rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-32px)] sm:w-[420px] h-[580px] max-h-[85vh] rounded-3xl'
          } animate-in fade-in zoom-in-95`}
        >
          {/* Header */}
          <div className="p-4 bg-linear-to-r from-neutral-900 via-[#1e293b] to-neutral-900 text-white flex items-center justify-between shrink-0 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white tracking-wide">
                    Spring ChatBot
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    AI 24/7
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Trợ lý tri thức toàn diện VIETVI</span>
                </div>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
                title="Bắt đầu hội thoại mới"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer hidden sm:block"
                title={isExpanded ? 'Thu nhỏ cửa sổ' : 'Phóng to cửa sổ'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
                title="Thu nhỏ xuống thanh taskbar"
              >
                <Minus className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-neutral-800 cursor-pointer"
                title="Đóng hội thoại"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="bg-emerald-50/80 px-4 py-2 text-[11px] text-emerald-900 border-b border-emerald-100 flex items-center justify-between shrink-0">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sẵn sàng trả lời mọi câu hỏi về Ký quỹ, Biểu phí, Đăng việc, Khiếu nại!</span>
            </span>
            <span className="text-emerald-700 font-semibold text-[10px] hidden sm:inline">
              Phí sàn 0%
            </span>
          </div>

          {/* Messages List Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-[#f8fafc]/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-linear-to-br from-emerald-500 to-[#19a463] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-neutral-900 text-white rounded-tr-xs'
                      : 'bg-white text-neutral-800 border border-neutral-200/90 rounded-tl-xs'
                  }`}
                >
                  {/* Sender label & badge */}
                  <div className="flex items-center justify-between text-[10px] gap-2">
                    <span className="font-bold opacity-80">
                      {msg.sender === 'user' ? 'Bạn' : 'Spring ChatBot'}
                    </span>
                    <span className="opacity-50">{msg.timestamp}</span>
                  </div>

                  {/* Message Body with clean paragraphs */}
                  <div className="leading-relaxed whitespace-pre-line text-xs font-normal">
                    {msg.text}
                  </div>

                  {/* Interactive Action Buttons if attached */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="pt-2 border-t border-neutral-100 flex flex-wrap gap-1.5">
                      {msg.actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleExecuteAction(act.actionType)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3 text-emerald-600" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* AI Source tag */}
                  {msg.source && msg.sender === 'assistant' && (
                    <div className="text-[10px] text-neutral-400 flex items-center gap-1 pt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Nguồn: Tri thức hệ thống VIETVI</span>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-neutral-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-neutral-500 p-2 animate-pulse">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span>Spring ChatBot đang tra cứu thông tin VIETVI...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips Carousel */}
          <div className="p-2.5 bg-white border-t border-neutral-100 shrink-0">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block px-1 mb-1.5">
              Gợi ý câu hỏi phổ biến:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {INITIAL_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  disabled={isLoading}
                  onClick={() => handleSendMessage(sug.query)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <span>{sug.icon}</span>
                  <span>{sug.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-neutral-200/90 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập câu hỏi cho Spring ChatBot (VD: Escrow là gì, cách rút tiền...)..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
            />

            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-[#19a463] hover:from-emerald-600 hover:to-[#179659] text-white flex items-center justify-center transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              title="Gửi câu hỏi"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}
    </>
  );
};
