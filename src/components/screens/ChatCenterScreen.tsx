import React, { useState } from 'react';
import { ChatThread, DirectMessage, UserProfile } from '../../types';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  ShieldCheck,
  CheckCheck,
  Clock,
  Sparkles,
  ExternalLink,
  User,
  ArrowLeft,
  ChevronRight,
  Smile,
} from 'lucide-react';

interface ChatCenterScreenProps {
  threads: ChatThread[];
  currentUser: UserProfile;
  initialThreadId?: string;
  onSendMessage: (threadId: string, content: string) => void;
  onSelectTaskDetail?: (taskId: string) => void;
  onBackToHome?: () => void;
}

export const ChatCenterScreen: React.FC<ChatCenterScreenProps> = ({
  threads,
  currentUser,
  initialThreadId,
  onSendMessage,
  onSelectTaskDetail,
  onBackToHome,
}) => {
  const [activeThreadId, setActiveThreadId] = useState<string>(
    initialThreadId || (threads.length > 0 ? threads[0].id : '')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');

  React.useEffect(() => {
    if (initialThreadId && threads.some((t) => t.id === initialThreadId)) {
      setActiveThreadId(initialThreadId);
    }
  }, [initialThreadId, threads]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const filteredThreads = threads.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.peerUser.displayName.toLowerCase().includes(q) ||
      t.peerUser.university.toLowerCase().includes(q) ||
      (t.taskTitle && t.taskTitle.toLowerCase().includes(q))
    );
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;
    onSendMessage(activeThread.id, inputText.trim());
    setInputText('');
  };

  const handleQuickReply = (text: string) => {
    if (!activeThread) return;
    onSendMessage(activeThread.id, text);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="p-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
                Hộp thư Trao đổi Sinh viên (Chat Center)
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Thảo luận yêu cầu công việc, gửi tài liệu và thống nhất chi tiết trước khi chốt đơn hàng.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tin nhắn được mã hóa nội bộ theo quy định bảo mật sinh viên</span>
          </div>
        </div>

        {/* Main Messenger Container */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
          
          {/* Left Panel: Conversation Threads (4 cols) */}
          <div className="md:col-span-5 lg:col-span-4 border-r border-neutral-200 flex flex-col bg-neutral-50/50">
            
            {/* Search Input */}
            <div className="p-4 border-b border-neutral-200 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên bạn bè, trường học, task..."
                  className="w-full pl-9 pr-3 py-2 bg-neutral-100 border-none rounded-xl text-xs placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-[#1dbf73]/30"
                />
              </div>
            </div>

            {/* Thread List */}
            <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
              {filteredThreads.length > 0 ? (
                filteredThreads.map((thread) => {
                  const isSelected = thread.id === activeThreadId;
                  return (
                    <button
                      key={thread.id}
                      type="button"
                      onClick={() => setActiveThreadId(thread.id)}
                      className={`w-full text-left p-4 transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50/60 border-l-4 border-l-[#1dbf73]'
                          : 'hover:bg-white bg-transparent'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-2xl ${thread.peerUser.avatarBg} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs relative`}
                      >
                        {thread.peerUser.displayName.slice(0, 2).toUpperCase()}
                        {thread.peerUser.isVerifiedStudent && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#222325] truncate">
                            {thread.peerUser.displayName}
                          </h4>
                          <span className="text-[10px] text-neutral-400 shrink-0">
                            {thread.lastTimestamp}
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {thread.peerUser.university}
                        </p>

                        {thread.taskTitle && (
                          <p className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded-md mt-1 truncate max-w-full">
                            📌 {thread.taskTitle}
                          </p>
                        )}

                        <p className="text-xs text-neutral-600 truncate mt-1">
                          {thread.lastMessage}
                        </p>
                      </div>

                      {thread.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#1dbf73] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                          {thread.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-neutral-400 text-xs">
                  Không tìm thấy cuộc trò chuyện nào phù hợp.
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Active Chat Stream (8 cols) */}
          {activeThread ? (
            <div className="md:col-span-7 lg:col-span-8 flex flex-col h-full bg-white">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl ${activeThread.peerUser.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                  >
                    {activeThread.peerUser.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-[#222325] truncate">
                        {activeThread.peerUser.displayName}
                      </h3>
                      {activeThread.peerUser.isVerifiedStudent && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Sinh viên xác minh
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 truncate">
                      {activeThread.peerUser.university} · ★ {activeThread.peerUser.rating} ({activeThread.peerUser.tasksCompleted} việc hoàn tất)
                    </p>
                  </div>
                </div>

                {activeThread.taskId && onSelectTaskDetail && (
                  <button
                    onClick={() => onSelectTaskDetail(activeThread.taskId!)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    <span>Xem Task liên quan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Task Link Banner if attached */}
              {activeThread.taskTitle && (
                <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
                  <span className="truncate">
                    Công việc trao đổi: <strong className="text-neutral-900">{activeThread.taskTitle}</strong>
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold shrink-0">
                    Trạng thái: Đang trao đổi tiền giao dịch
                  </span>
                </div>
              )}

              {/* Messages Body */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-neutral-50/30">
                {activeThread.messages.map((msg) => {
                  const isMine = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                          isMine
                            ? 'bg-neutral-900 text-white rounded-br-xs'
                            : 'bg-white text-neutral-800 border border-neutral-200/90 rounded-bl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-neutral-400 mt-1 px-1">
                        <span>{msg.createdAt}</span>
                        {isMine && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Reply Suggestions */}
              <div className="p-2.5 px-4 bg-neutral-50 border-t border-neutral-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
                <span className="text-neutral-400 font-semibold shrink-0">Gợi ý nhanh:</span>
                {[
                  'Mình có sẵn tài liệu rồi nhé!',
                  'Bạn hoàn thành trong 24h được không?',
                  'Có thể trao đổi chi tiết hơn qua Order không?',
                  'Bạn kiểm tra giúp mình file đính kèm nha.',
                ].map((txt) => (
                  <button
                    key={txt}
                    type="button"
                    onClick={() => handleQuickReply(txt)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400 transition-colors cursor-pointer shrink-0"
                  >
                    {txt}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-neutral-200 bg-white flex items-center gap-2">
                <button
                  type="button"
                  title="Đính kèm file"
                  className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Nhắn tin cho ${activeThread.peerUser.displayName}...`}
                  className="flex-1 px-4 py-2.5 bg-neutral-100 border-none rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#1dbf73]/30"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`p-2.5 rounded-xl text-white transition-all cursor-pointer ${
                    inputText.trim()
                      ? 'bg-[#1dbf73] hover:bg-[#19a463] shadow-xs'
                      : 'bg-neutral-300 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="md:col-span-7 lg:col-span-8 flex flex-col items-center justify-center p-12 text-center text-neutral-400">
              <MessageSquare className="w-12 h-12 text-neutral-300 mb-3" />
              <h3 className="text-sm font-bold text-neutral-700">Chưa chọn cuộc trò chuyện</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Chọn một bạn sinh viên ở cột bên trái để bắt đầu trao đổi công việc.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
