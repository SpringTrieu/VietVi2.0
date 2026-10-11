import React from 'react';
import { ShieldCheck, Lock, Star, HeadphonesIcon } from 'lucide-react';

export const TrustPillars: React.FC = () => {
  const pillars = [
    {
      title: 'Tạm giữ an toàn (Escrow Protection)',
      desc: 'Khoản thanh toán được hệ thống tạm giữ khi tạo Order. Người thực hiện an tâm làm việc, Người yêu cầu chỉ giải ngân khi đã kiểm tra và nghiệm thu kết quả.',
      icon: <Lock className="w-5 h-5 text-emerald-600" />,
      detail: '0% nguy cơ bùng tiền',
    },
    {
      title: 'Xác minh Sinh viên chính quy',
      desc: 'Hồ sơ người dùng được đối chiếu qua thẻ sinh viên hoặc email tên miền giáo dục (.edu.vn), giúp môi trường giao lưu trung thực và trách nhiệm.',
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
      detail: 'Huy hiệu tick xanh uy tín',
    },
    {
      title: 'Đánh giá 3 tiêu chí chuẩn mực',
      desc: 'Hệ thống review sau mỗi Order dựa trên: (1) Mức độ phản hồi, (2) Chất lượng đúng cam kết, (3) Độ hài lòng để cộng đồng có dữ liệu khách quan.',
      icon: <Star className="w-5 h-5 text-amber-500" />,
      detail: 'Đánh giá thật từ giao dịch thật',
    },
    {
      title: 'Đội ngũ Hỗ trợ giải quyết tranh chấp',
      desc: 'Khi có bất đồng về chất lượng hoặc trễ deadline, Staff và Admin sẽ can thiệp xem xét lịch sử trao đổi, tệp đính kèm và hoàn tiền nếu vi phạm.',
      icon: <HeadphonesIcon className="w-5 h-5 text-purple-600" />,
      detail: 'Sẵn sàng can thiệp 24/7',
    },
  ];

  return (
    <section id="trust-pillars" className="py-16 bg-[#f7f7f8] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            An toàn là ưu tiên số một
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222325] mt-1 tracking-tight">
            Lớp bảo vệ niềm tin tại VIETVI
          </h2>
          <p className="text-xs sm:text-sm text-[#62646a] mt-2">
            Xây dựng niềm tin dựa trên bằng chứng giao dịch thực tế, không dùng cam kết ảo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-[#222325] mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#62646a] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 text-[11px] font-semibold text-neutral-800">
                <span>{item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
