import React from 'react';
import { FileEdit, UserCheck, MessageSquareText, Award } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Đăng Task trong 2 phút',
      desc: 'Nhập tiêu đề, mô tả và quan trọng nhất là Tiêu chuẩn nghiệm thu (Expected Output) cùng ngân sách minh bạch.',
      icon: <FileEdit className="w-5 h-5 text-emerald-600" />,
    },
    {
      num: '02',
      title: 'Chọn Người thực hiện',
      desc: 'Các bạn sinh viên cùng trường hoặc toàn quốc gửi báo giá. Bạn so sánh hồ sơ, đánh giá sao và chọn bạn ưng ý nhất.',
      icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
    },
    {
      num: '03',
      title: 'Không gian Order an toàn',
      desc: 'Hai bên trao đổi tin nhắn, gửi tệp và theo dõi tiến độ. Ngân sách được hệ thống tạm giữ an toàn, bảo vệ cả hai bên.',
      icon: <MessageSquareText className="w-5 h-5 text-emerald-600" />,
    },
    {
      num: '04',
      title: 'Nghiệm thu & Đánh giá',
      desc: 'Kiểm tra sản phẩm bàn giao. Chỉ khi bạn hài lòng và bấm nghiệm thu, thù lao mới được chuyển giao cho Người thực hiện.',
      icon: <Award className="w-5 h-5 text-emerald-600" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Vòng giao dịch cốt lõi
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222325] mt-1 tracking-tight">
            Cách thức hoạt động của VIETVI
          </h2>
          <p className="text-xs sm:text-sm text-[#62646a] mt-2">
            Đơn giản, minh bạch và bảo đảm an toàn quyền lợi cho sinh viên ở cả hai đầu giao dịch.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-neutral-50/70 rounded-2xl p-6 border border-neutral-200/80 hover:border-neutral-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shadow-xs">
                    {step.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-400">
                    BƯỚC {step.num}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#222325] mb-2">
                  {step.title}
                </h3>

                <p className="text-xs text-[#62646a] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-neutral-200/60 flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold">
                <span>Rõ ràng · Không rủi ro</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
