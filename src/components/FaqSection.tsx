import React, { useState } from 'react';
import { OFFICIAL_FAQS } from '../data/mockData';
import { ChevronDown, ShieldCheck, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="official-faq" className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Giải đáp chính thức từ Đội ngũ
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222325] mt-1 tracking-tight">
            Câu hỏi thường gặp (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-[#62646a] mt-2">
            Mọi thắc mắc về luồng tiền, nghiệm thu và quyền lợi sinh viên đều có câu trả lời xác thực.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {OFFICIAL_FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-neutral-200 rounded-2xl overflow-hidden bg-neutral-50/50 transition-colors"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[#222325] hover:bg-neutral-100/70 transition-colors"
                >
                  <span className="leading-snug">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#404145] space-y-3 animate-in fade-in">
                    <p className="leading-relaxed bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
                      {faq.officialAnswer}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#62646a] px-1">
                      <div className="flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Phản hồi chính thức bởi: <strong>{faq.staffName}</strong> ({faq.staffBadge})</span>
                      </div>
                      <span className="text-neutral-400">Cập nhật: {faq.updatedAt}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
